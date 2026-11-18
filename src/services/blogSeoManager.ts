/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  InsightArticle,
  InsightArticleSeoConfig,
  InsightSchemaType
} from '../data/businessInsightsData';

const DYNAMIC_ARTICLE_JSONLD_SCRIPT_ID = 'guiaponto-dynamic-article-jsonld';

let cachedDefaults: {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
} | null = null;

function captureDefaultHeadMeta() {
  if (typeof document === 'undefined' || cachedDefaults) return;
  const getMetaContent = (selector: string) =>
    document.head.querySelector<HTMLMetaElement>(selector)?.content || '';

  cachedDefaults = {
    title: document.title || 'GuiaPonto — Seu negócio merece ser encontrado',
    description: getMetaContent('meta[name="description"]'),
    ogTitle: getMetaContent('meta[property="og:title"]'),
    ogDescription: getMetaContent('meta[property="og:description"]'),
    ogType: getMetaContent('meta[property="og:type"]') || 'website'
  };
}

export function resolveArticleCanonicalUrl(article: {
  slug?: string;
  seo?: Partial<InsightArticleSeoConfig>;
}): string {
  if (article.seo?.canonicalUrl?.trim()) {
    return article.seo.canonicalUrl.trim();
  }
  const slug = article.slug?.trim() || 'artigo-business-insights';
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${window.location.pathname}#business-insights/${slug}`;
  }
  return `https://www.guiaponto.com.br/insights/${slug}`;
}

export function resolveEffectiveArticleSeo(article: {
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  seo?: Partial<InsightArticleSeoConfig>;
}): InsightArticleSeoConfig {
  const metaTitle = (article.seo?.metaTitle || article.title || '').trim().slice(0, 70);
  const metaDescription = (article.seo?.metaDescription || article.excerpt || '')
    .trim()
    .slice(0, 165);
  const focusKeywords =
    article.seo?.focusKeywords && article.seo.focusKeywords.length > 0
      ? article.seo.focusKeywords
      : [article.category, 'Negócios Locais', 'GuiaPonto'];
  const schemaType: InsightSchemaType = article.seo?.schemaType || 'BlogPosting';
  const canonicalUrl = resolveArticleCanonicalUrl(article);

  return {
    metaTitle,
    metaDescription,
    focusKeywords,
    schemaType,
    canonicalUrl,
    ogTitle: (article.seo?.ogTitle || metaTitle).trim(),
    ogDescription: (article.seo?.ogDescription || metaDescription).trim()
  };
}

export function buildArticleJsonLd(article: InsightArticle): Record<string, unknown> {
  const seo = resolveEffectiveArticleSeo(article);
  const canonicalUrl = seo.canonicalUrl || resolveArticleCanonicalUrl(article);
  const allText = [
    article.title,
    article.subtitle,
    article.excerpt,
    ...article.sections.flatMap((s) => [s.heading, ...s.paragraphs])
  ].join(' ');
  const wordCount = allText.trim() ? allText.trim().split(/\s+/).length : 0;

  const basePublisher = {
    '@type': 'Organization',
    name: 'GuiaPonto Negócios Locais',
    url:
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}`
        : 'https://www.guiaponto.com.br'
  };

  if (seo.schemaType === 'HowTo') {
    const steps =
      article.actionChecklist.length > 0
        ? article.actionChecklist.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step,
            text: step
          }))
        : article.sections.map((sec, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: sec.heading,
            text: sec.paragraphs.join(' ')
          }));

    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: seo.metaTitle || article.title,
      description: seo.metaDescription || article.excerpt,
      datePublished: article.isoDate,
      dateModified: article.isoDate,
      inLanguage: 'pt-BR',
      author: {
        '@type': 'Person',
        name: article.author.name,
        jobTitle: article.author.role
      },
      publisher: basePublisher,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl
      },
      keywords: seo.focusKeywords.join(', '),
      step: steps
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': seo.schemaType,
    headline: seo.metaTitle || article.title,
    alternativeHeadline: article.subtitle || undefined,
    description: seo.metaDescription || article.excerpt,
    articleSection: article.category,
    keywords: seo.focusKeywords.join(', '),
    datePublished: article.isoDate,
    dateModified: article.isoDate,
    inLanguage: 'pt-BR',
    wordCount,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role
    },
    publisher: basePublisher,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl
    }
  };
}

export function buildArticleMetaTagsHtml(article: InsightArticle): string {
  const seo = resolveEffectiveArticleSeo(article);
  const canonicalUrl = seo.canonicalUrl || resolveArticleCanonicalUrl(article);
  const esc = (val: string) => val.replace(/"/g, '&quot;');

  return [
    `<title>${seo.metaTitle}</title>`,
    `<meta name="description" content="${esc(seo.metaDescription)}" />`,
    `<meta name="keywords" content="${esc(seo.focusKeywords.join(', '))}" />`,
    `<link rel="canonical" href="${esc(canonicalUrl)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:site_name" content="GuiaPonto" />`,
    `<meta property="og:title" content="${esc(seo.ogTitle || seo.metaTitle)}" />`,
    `<meta property="og:description" content="${esc(seo.ogDescription || seo.metaDescription)}" />`,
    `<meta property="og:url" content="${esc(canonicalUrl)}" />`,
    `<meta property="article:section" content="${esc(article.category)}" />`,
    `<meta property="article:published_time" content="${esc(article.isoDate)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(seo.ogTitle || seo.metaTitle)}" />`,
    `<meta name="twitter:description" content="${esc(seo.ogDescription || seo.metaDescription)}" />`
  ].join('\n');
}

function upsertHeadMeta(
  attrName: 'name' | 'property',
  attrValue: string,
  content: string
) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attrName}="${attrValue}"]`
  );
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertHeadCanonical(href: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function applyDynamicArticleHeadSeo(article: InsightArticle): void {
  if (typeof document === 'undefined') return;
  captureDefaultHeadMeta();

  const seo = resolveEffectiveArticleSeo(article);
  const canonicalUrl = seo.canonicalUrl || resolveArticleCanonicalUrl(article);
  const jsonLd = buildArticleJsonLd(article);

  document.title = `${seo.metaTitle} | Business Insights GuiaPonto`;
  upsertHeadMeta('name', 'description', seo.metaDescription);
  upsertHeadMeta('name', 'keywords', seo.focusKeywords.join(', '));
  upsertHeadCanonical(canonicalUrl);

  upsertHeadMeta('property', 'og:type', 'article');
  upsertHeadMeta('property', 'og:title', seo.ogTitle || seo.metaTitle);
  upsertHeadMeta(
    'property',
    'og:description',
    seo.ogDescription || seo.metaDescription
  );
  upsertHeadMeta('property', 'og:url', canonicalUrl);
  upsertHeadMeta('property', 'og:site_name', 'GuiaPonto');

  upsertHeadMeta('name', 'twitter:card', 'summary_large_image');
  upsertHeadMeta('name', 'twitter:title', seo.ogTitle || seo.metaTitle);
  upsertHeadMeta(
    'name',
    'twitter:description',
    seo.ogDescription || seo.metaDescription
  );

  let scriptEl = document.getElementById(
    DYNAMIC_ARTICLE_JSONLD_SCRIPT_ID
  ) as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = DYNAMIC_ARTICLE_JSONLD_SCRIPT_ID;
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify(jsonLd, null, 2);
}

export function restoreDefaultSiteHeadSeo(): void {
  if (typeof document === 'undefined') return;
  if (cachedDefaults) {
    document.title = cachedDefaults.title;
    if (cachedDefaults.description) {
      upsertHeadMeta('name', 'description', cachedDefaults.description);
    }
    if (cachedDefaults.ogTitle) {
      upsertHeadMeta('property', 'og:title', cachedDefaults.ogTitle);
    }
    if (cachedDefaults.ogDescription) {
      upsertHeadMeta(
        'property',
        'og:description',
        cachedDefaults.ogDescription
      );
    }
    upsertHeadMeta('property', 'og:type', cachedDefaults.ogType);
  }

  const scriptEl = document.getElementById(DYNAMIC_ARTICLE_JSONLD_SCRIPT_ID);
  if (scriptEl) {
    scriptEl.remove();
  }
}
