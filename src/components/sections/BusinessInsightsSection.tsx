/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  X
} from 'lucide-react';
import {
  InsightArticle,
  InsightCategory
} from '../../data/businessInsightsData';
import {
  BLOG_ARTICLES_UPDATED_EVENT,
  loadBlogArticles
} from '../../services/blogArticlesStore';
import {
  applyDynamicArticleHeadSeo,
  buildArticleJsonLd,
  resolveEffectiveArticleSeo,
  restoreDefaultSiteHeadSeo
} from '../../services/blogSeoManager';
import { GrowthTipsNewsletter } from './GrowthTipsNewsletter';

interface BusinessInsightsSectionProps {
  onOpenRegisterModal?: () => void;
}

type FilterOption = 'Todos' | InsightCategory;

const FILTER_OPTIONS: FilterOption[] = [
  'Todos',
  'SEO Local',
  'Marketing',
  'Crescimento Digital'
];

export function BusinessInsightsSection({
  onOpenRegisterModal
}: BusinessInsightsSectionProps) {
  const [articles, setArticles] = useState<InsightArticle[]>(() => loadBlogArticles());
  const [selectedCategory, setSelectedCategory] = useState<FilterOption>('Todos');
  const [activeArticle, setActiveArticle] = useState<InsightArticle | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const syncArticles = () => {
      const updated = loadBlogArticles();
      setArticles(updated);
      setActiveArticle((prev) =>
        prev ? updated.find((a) => a.id === prev.id) || null : null
      );
    };
    window.addEventListener(BLOG_ARTICLES_UPDATED_EVENT, syncArticles);
    window.addEventListener('storage', syncArticles);
    return () => {
      window.removeEventListener(BLOG_ARTICLES_UPDATED_EVENT, syncArticles);
      window.removeEventListener('storage', syncArticles);
    };
  }, []);

  const filteredArticles =
    selectedCategory === 'Todos'
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  const leadArticle =
    filteredArticles.find((a) => a.featured) || filteredArticles[0] || null;
  const secondaryArticles = leadArticle
    ? filteredArticles.filter((a) => a.id !== leadArticle.id)
    : [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeArticle) {
        setActiveArticle(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeArticle]);

  // Synchronize document.head meta tags & Schema.org JSON-LD when reading an article
  useEffect(() => {
    if (activeArticle) {
      applyDynamicArticleHeadSeo(activeArticle);
    } else {
      restoreDefaultSiteHeadSeo();
    }
    return () => {
      restoreDefaultSiteHeadSeo();
    };
  }, [activeArticle]);

  const handleImageError = (articleId: string) => {
    setFailedImages((prev) => ({ ...prev, [articleId]: true }));
  };

  const toggleChecklistStep = (articleId: string, stepIndex: number) => {
    const key = `${articleId}-${stepIndex}`;
    setCheckedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNextArticle = () => {
    if (!activeArticle || articles.length === 0) return;
    const currentIndex = articles.findIndex(
      (item) => item.id === activeArticle.id
    );
    const nextIndex = (currentIndex + 1) % articles.length;
    setActiveArticle(articles[nextIndex]);
  };

  // Structured data for organic search visibility (Schema.org Blog / BlogPosting / Article / HowTo)
  const insightsStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Business Insights — GuiaPonto Negócios Locais',
    description:
      'Artigos práticos sobre marketing local, SEO regional e crescimento digital para negócios locais.',
    blogPost: articles.map((article) => buildArticleJsonLd(article))
  };

  const activeArticleSeo = activeArticle
    ? resolveEffectiveArticleSeo(activeArticle)
    : null;

  return (
    <section
      id="business-insights"
      aria-labelledby="business-insights-heading"
      className="py-24 bg-slate-50 border-t border-slate-200/80 relative"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(insightsStructuredData) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Section Header + Interactive Segmented Filter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-slate-200">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#FE3A18]">
              <span>Business Insights</span>
              <span aria-hidden="true" className="text-slate-300">
                /
              </span>
              <span className="text-slate-500 font-semibold">
                Autoridade & Busca Orgânica
              </span>
            </div>
            <h2
              id="business-insights-heading"
              className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 text-balance"
            >
              Guias Práticos de Marketing, SEO Local e Crescimento Digital
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Conteúdo estratégico para negócios locais conquistarem mais relevância no Google, fortalecerem sua reputação no bairro e transformarem pesquisas em clientes reais.
            </p>
          </div>

          {/* Interactive Category Filter Control (Allowed functional tabs) */}
          <div
            role="tablist"
            aria-label="Filtrar artigos por tema"
            className="inline-flex flex-wrap items-center gap-1 p-1.5 bg-white border border-slate-200 rounded-xl self-start lg:self-end"
          >
            {FILTER_OPTIONS.map((option) => {
              const isActive = selectedCategory === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(option)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lead Featured Editorial Article */}
        {leadArticle && (
          <article className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch group transition-colors hover:border-slate-300">
            <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[340px] bg-slate-900 overflow-hidden">
              {!failedImages[leadArticle.id] ? (
                <img
                  src={leadArticle.coverImage}
                  alt={leadArticle.coverAlt}
                  referrerPolicy="no-referrer"
                  onError={() => handleImageError(leadArticle.id)}
                  className="w-full h-full lg:h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="w-full h-full min-h-[280px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-8 text-center text-white space-y-3">
                  <BookOpen className="w-10 h-10 text-[#FE3A18]" />
                  <p className="text-sm font-bold max-w-xs">{leadArticle.title}</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                {/* Clean Unboxed Metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                  <span className="font-bold text-[#FE3A18]">{leadArticle.category}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={leadArticle.isoDate}>{leadArticle.publishedAt}</time>
                  <span aria-hidden="true">·</span>
                  <span>{leadArticle.readTime}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight text-balance">
                  <button
                    type="button"
                    onClick={() => setActiveArticle(leadArticle)}
                    className="text-left hover:text-[#FE3A18] transition-colors cursor-pointer"
                  >
                    {leadArticle.title}
                  </button>
                </h3>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {leadArticle.excerpt}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">
                    Por {leadArticle.author.name}
                  </span>
                  <span className="font-mono tabular-nums font-bold text-emerald-700">
                    {leadArticle.impactMetric}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveArticle(leadArticle)}
                  className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-[#FE3A18] text-white font-bold text-xs sm:text-sm transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Ler Artigo Completo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                  Inclui checklist prático
                </span>
              </div>
            </div>
          </article>
        )}

        {/* Secondary Articles Grid */}
        {secondaryArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {secondaryArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden flex flex-col justify-between group hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden relative">
                    {!failedImages[article.id] ? (
                      <img
                        src={article.coverImage}
                        alt={article.coverAlt}
                        referrerPolicy="no-referrer"
                        onError={() => handleImageError(article.id)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center text-white space-y-2">
                        <BookOpen className="w-8 h-8 text-[#FE3A18]" />
                        <span className="text-xs font-bold">{article.category}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-7 space-y-3">
                    {/* Unboxed Typographic Metadata */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                      <span className="font-bold text-[#FE3A18]">{article.category}</span>
                      <span aria-hidden="true">·</span>
                      <time dateTime={article.isoDate}>{article.publishedAt}</time>
                      <span aria-hidden="true">·</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-snug text-balance">
                      <button
                        type="button"
                        onClick={() => setActiveArticle(article)}
                        className="text-left hover:text-[#FE3A18] transition-colors cursor-pointer"
                      >
                        {article.title}
                      </button>
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-xs font-mono tabular-nums font-semibold text-slate-500 truncate">
                    {article.impactMetric}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveArticle(article)}
                    className="text-xs font-extrabold text-slate-900 hover:text-[#FE3A18] inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Ler artigo</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Newsletter de Dicas de Crescimento */}
        <GrowthTipsNewsletter />
      </div>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="insight-modal-title"
          className="fixed inset-0 z-[95] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setActiveArticle(null)}
        >
          <article
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Top Modal Bar */}
            <header className="px-6 sm:px-8 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-white shrink-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 min-w-0">
                <span className="font-bold text-[#FE3A18] whitespace-nowrap shrink-0">
                  {activeArticle.category}
                </span>
                <span aria-hidden="true">·</span>
                <time dateTime={activeArticle.isoDate} className="whitespace-nowrap">
                  {activeArticle.publishedAt}
                </time>
                <span aria-hidden="true">·</span>
                <span className="whitespace-nowrap">{activeArticle.readTime}</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                aria-label="Fechar artigo"
                className="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Scrollable Article Prose */}
            <div className="overflow-y-auto p-6 sm:p-10 space-y-8">
              <div className="space-y-4">
                <h2
                  id="insight-modal-title"
                  className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight text-balance"
                >
                  {activeArticle.title}
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  {activeArticle.subtitle}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
                  <span>
                    Escrito por{' '}
                    <strong className="text-slate-900">{activeArticle.author.name}</strong>{' '}
                    ({activeArticle.author.role})
                  </span>
                  <span className="font-mono tabular-nums font-bold text-emerald-700">
                    {activeArticle.impactMetric}
                  </span>
                </div>
              </div>

              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80">
                {!failedImages[activeArticle.id] ? (
                  <img
                    src={activeArticle.coverImage}
                    alt={activeArticle.coverAlt}
                    referrerPolicy="no-referrer"
                    onError={() => handleImageError(activeArticle.id)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white p-6">
                    <BookOpen className="w-10 h-10 text-[#FE3A18]" />
                  </div>
                )}
              </div>

              <div className="space-y-7">
                {activeArticle.sections.map((section, idx) => (
                  <section key={idx} className="space-y-3">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      {section.heading}
                    </h3>
                    {section.paragraphs.map((paragraph, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-slate-700 text-base leading-relaxed max-w-[70ch]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </section>
                ))}
              </div>

              {/* Interactive Action Checklist */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900">
                    Checklist Prático para Aplicar Hoje
                  </h3>
                  <p className="text-xs text-slate-500">
                    Marque os itens à medida que implementar no perfil do seu negócio.
                  </p>
                </div>

                <ul className="space-y-2.5">
                  {activeArticle.actionChecklist.map((step, idx) => {
                    const isChecked = Boolean(checkedSteps[`${activeArticle.id}-${idx}`]);
                    return (
                      <li key={idx}>
                        <button
                          type="button"
                          onClick={() => toggleChecklistStep(activeArticle.id, idx)}
                          className={`w-full text-left px-4 py-3 rounded-xl border transition-colors flex items-center gap-3 cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                              : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100/70'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                              isChecked
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'bg-white border-slate-300'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              isChecked ? 'line-through text-emerald-800' : ''
                            }`}
                          >
                            {step}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {activeArticleSeo && activeArticleSeo.focusKeywords.length > 0 && (
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-slate-700">Temas SEO:</span>
                  <span>{activeArticleSeo.focusKeywords.join(' · ')}</span>
                </div>
              )}
            </div>

            {/* Bottom Reader Action Bar */}
            <footer className="px-6 sm:px-8 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={handleNextArticle}
                className="text-xs font-bold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <span>Próximo artigo</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {onOpenRegisterModal && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveArticle(null);
                    onOpenRegisterModal();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-extrabold text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Cadastrar Meu Negócio Grátis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </footer>
          </article>
        </div>
      )}
    </section>
  );
}
