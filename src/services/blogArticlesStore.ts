/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BUSINESS_INSIGHTS_ARTICLES,
  InsightArticle
} from '../data/businessInsightsData';

export const BLOG_ARTICLES_STORAGE_KEY = 'guiaponto_blog_articles_v1';
export const BLOG_ARTICLES_UPDATED_EVENT = 'guiaponto-blog-articles-updated';

export const PRESET_BLOG_COVERS = BUSINESS_INSIGHTS_ARTICLES.map((a) => ({
  id: a.id,
  label: `${a.category} — ${a.title.slice(0, 36)}...`,
  url: a.coverImage,
  alt: a.coverAlt
}));

export function slugifyBlogTitle(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function formatBlogDatePtBr(date = new Date()): {
  publishedAt: string;
  isoDate: string;
} {
  const months = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez'
  ];
  const day = String(date.getDate()).padStart(2, '0');
  const monthIdx = date.getMonth();
  const monthLabel = months[monthIdx] || 'Nov';
  const year = date.getFullYear();
  const mm = String(monthIdx + 1).padStart(2, '0');

  return {
    publishedAt: `${day} ${monthLabel} ${year}`,
    isoDate: `${year}-${mm}-${day}`
  };
}

export function loadBlogArticles(): InsightArticle[] {
  if (typeof window === 'undefined') return BUSINESS_INSIGHTS_ARTICLES;
  try {
    const raw = window.localStorage.getItem(BLOG_ARTICLES_STORAGE_KEY);
    if (!raw) return BUSINESS_INSIGHTS_ARTICLES;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return BUSINESS_INSIGHTS_ARTICLES;
    }
    return parsed as InsightArticle[];
  } catch {
    return BUSINESS_INSIGHTS_ARTICLES;
  }
}

export function persistBlogArticles(articles: InsightArticle[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(BLOG_ARTICLES_STORAGE_KEY, JSON.stringify(articles));
    window.dispatchEvent(new CustomEvent(BLOG_ARTICLES_UPDATED_EVENT));
  } catch {
    // Ignore storage quota errors safely
  }
}

export function upsertBlogArticle(article: InsightArticle): InsightArticle[] {
  const current = loadBlogArticles();
  const exists = current.some((a) => a.id === article.id);

  let next = exists
    ? current.map((a) => (a.id === article.id ? article : a))
    : [article, ...current];

  if (article.featured) {
    next = next.map((a) => ({
      ...a,
      featured: a.id === article.id
    }));
  }

  persistBlogArticles(next);
  return next;
}

export function deleteBlogArticleById(id: string): InsightArticle[] {
  const current = loadBlogArticles();
  const next = current.filter((a) => a.id !== id);
  persistBlogArticles(next);
  return next;
}

export function setFeaturedBlogArticleById(id: string): InsightArticle[] {
  const current = loadBlogArticles();
  const next = current.map((a) => ({
    ...a,
    featured: a.id === id
  }));
  persistBlogArticles(next);
  return next;
}

export function resetBlogArticlesToDefaults(): InsightArticle[] {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(BLOG_ARTICLES_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(BLOG_ARTICLES_UPDATED_EVENT));
    } catch {
      // Ignore errors
    }
  }
  return BUSINESS_INSIGHTS_ARTICLES;
}
