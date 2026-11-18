/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Check,
  Code2,
  Copy,
  Edit3,
  Eye,
  Globe,
  Plus,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Upload,
  X
} from 'lucide-react';
import {
  InsightArticle,
  InsightArticleSection,
  InsightCategory,
  InsightSchemaType
} from '../../data/businessInsightsData';
import {
  BLOG_ARTICLES_UPDATED_EVENT,
  PRESET_BLOG_COVERS,
  deleteBlogArticleById,
  formatBlogDatePtBr,
  loadBlogArticles,
  resetBlogArticlesToDefaults,
  setFeaturedBlogArticleById,
  slugifyBlogTitle,
  upsertBlogArticle
} from '../../services/blogArticlesStore';
import {
  buildArticleJsonLd,
  buildArticleMetaTagsHtml,
  resolveArticleCanonicalUrl,
  resolveEffectiveArticleSeo
} from '../../services/blogSeoManager';

interface MasterBlogArticleEditorProps {
  onNotify?: (message: string) => void;
}

interface EditableSectionDraft {
  heading: string;
  bodyText: string;
}

const CATEGORIES: InsightCategory[] = [
  'SEO Local',
  'Marketing',
  'Crescimento Digital'
];

const SCHEMA_TYPES: {
  value: InsightSchemaType;
  label: string;
  description: string;
}[] = [
  {
    value: 'BlogPosting',
    label: 'BlogPosting',
    description: 'Ideal para artigos editoriais, estudos de caso locais e guias do blog.'
  },
  {
    value: 'Article',
    label: 'Article',
    description: 'Indicado para conteúdos evergreen de autoridade e referência técnica.'
  },
  {
    value: 'HowTo',
    label: 'HowTo (Passo a Passo)',
    description: 'Transforma o Checklist Prático em etapas estruturadas HowToStep no Google.'
  }
];

function createBlankDraft(): {
  id: string;
  slug: string;
  category: InsightCategory;
  title: string;
  subtitle: string;
  excerpt: string;
  authorName: string;
  authorRole: string;
  readTime: string;
  impactMetric: string;
  coverImage: string;
  coverAlt: string;
  featured: boolean;
  sections: EditableSectionDraft[];
  actionChecklist: string[];
  metaTitle: string;
  metaDescription: string;
  focusKeywords: string[];
  schemaType: InsightSchemaType;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
} {
  return {
    id: `article-${Date.now()}`,
    slug: '',
    category: 'SEO Local',
    title: '',
    subtitle: '',
    excerpt: '',
    authorName: 'Camila Vasconcelos',
    authorRole: 'Estrategista de SEO Local',
    readTime: '5 min de leitura',
    impactMetric: '+120% alcance local em 60 dias',
    coverImage: PRESET_BLOG_COVERS[0]?.url || '',
    coverAlt: 'Ilustração editorial de marketing e crescimento para negócios locais',
    featured: false,
    sections: [
      {
        heading: '1. Diagnóstico Inicial da Presença Local',
        bodyText:
          'Descreva aqui o primeiro passo estratégico para negócios locais aumentarem visibilidade e contatos diretos.'
      }
    ],
    actionChecklist: [
      'Revisar nome comercial, endereço e WhatsApp na vitrine GuiaPonto'
    ],
    metaTitle: '',
    metaDescription: '',
    focusKeywords: ['SEO local', 'negócios locais', 'busca orgânica'],
    schemaType: 'BlogPosting',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: ''
  };
}

export function MasterBlogArticleEditor({
  onNotify
}: MasterBlogArticleEditorProps) {
  const [articles, setArticles] = useState<InsightArticle[]>(() =>
    loadBlogArticles()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'Todos' | InsightCategory>('Todos');

  const [editingId, setEditingId] = useState<string | null>(
    () => loadBlogArticles()[0]?.id || null
  );
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editorMode, setEditorMode] = useState<'edit' | 'preview' | 'seo'>('edit');
  const [formError, setFormError] = useState<string | null>(null);

  // Form Draft State
  const [draftId, setDraftId] = useState('');
  const [draftSlug, setDraftSlug] = useState('');
  const [slugLockedManually, setSlugLockedManually] = useState(false);
  const [draftCategory, setDraftCategory] = useState<InsightCategory>('SEO Local');
  const [draftTitle, setDraftTitle] = useState('');
  const [draftSubtitle, setDraftSubtitle] = useState('');
  const [draftExcerpt, setDraftExcerpt] = useState('');
  const [draftAuthorName, setDraftAuthorName] = useState('');
  const [draftAuthorRole, setDraftAuthorRole] = useState('');
  const [draftReadTime, setDraftReadTime] = useState('5 min de leitura');
  const [draftImpactMetric, setDraftImpactMetric] = useState('');
  const [draftCoverImage, setDraftCoverImage] = useState(PRESET_BLOG_COVERS[0]?.url || '');
  const [draftCoverAlt, setDraftCoverAlt] = useState('');
  const [draftFeatured, setDraftFeatured] = useState(false);
  const [draftSections, setDraftSections] = useState<EditableSectionDraft[]>([]);
  const [draftChecklist, setDraftChecklist] = useState<string[]>([]);
  const [newChecklistInput, setNewChecklistInput] = useState('');

  // Dynamic SEO & Schema.org Draft State
  const [draftMetaTitle, setDraftMetaTitle] = useState('');
  const [draftMetaDescription, setDraftMetaDescription] = useState('');
  const [draftFocusKeywords, setDraftFocusKeywords] = useState<string[]>([]);
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [draftSchemaType, setDraftSchemaType] = useState<InsightSchemaType>('BlogPosting');
  const [draftCanonicalUrl, setDraftCanonicalUrl] = useState('');
  const [draftOgTitle, setDraftOgTitle] = useState('');
  const [draftOgDescription, setDraftOgDescription] = useState('');
  const [copiedBlock, setCopiedBlock] = useState<'meta' | 'jsonld' | null>(null);

  const loadArticleIntoDraft = (article: InsightArticle) => {
    setEditingId(article.id);
    setIsCreatingNew(false);
    setFormError(null);
    setDraftId(article.id);
    setDraftSlug(article.slug);
    setSlugLockedManually(true);
    setDraftCategory(article.category);
    setDraftTitle(article.title);
    setDraftSubtitle(article.subtitle);
    setDraftExcerpt(article.excerpt);
    setDraftAuthorName(article.author.name);
    setDraftAuthorRole(article.author.role);
    setDraftReadTime(article.readTime);
    setDraftImpactMetric(article.impactMetric);
    setDraftCoverImage(article.coverImage);
    setDraftCoverAlt(article.coverAlt);
    setDraftFeatured(Boolean(article.featured));
    setDraftSections(
      article.sections.map((s) => ({
        heading: s.heading,
        bodyText: s.paragraphs.join('\n\n')
      }))
    );
    setDraftChecklist([...article.actionChecklist]);
    setDraftMetaTitle(article.seo?.metaTitle || '');
    setDraftMetaDescription(article.seo?.metaDescription || '');
    setDraftFocusKeywords(
      article.seo?.focusKeywords ? [...article.seo.focusKeywords] : [article.category, 'Negócios Locais']
    );
    setDraftSchemaType(article.seo?.schemaType || 'BlogPosting');
    setDraftCanonicalUrl(article.seo?.canonicalUrl || '');
    setDraftOgTitle(article.seo?.ogTitle || '');
    setDraftOgDescription(article.seo?.ogDescription || '');
  };

  // Initialize first article into form on mount
  useEffect(() => {
    const initialList = loadBlogArticles();
    if (initialList.length > 0 && !draftId) {
      loadArticleIntoDraft(initialList[0]);
    }
  }, []);

  // Sync with external updates
  useEffect(() => {
    const handleSync = () => {
      setArticles(loadBlogArticles());
    };
    window.addEventListener(BLOG_ARTICLES_UPDATED_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(BLOG_ARTICLES_UPDATED_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return articles.filter((a) => {
      const matchesCat = categoryFilter === 'Todos' || a.category === categoryFilter;
      const matchesQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.author.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [articles, searchQuery, categoryFilter]);

  const handleStartNewArticle = () => {
    const blank = createBlankDraft();
    setEditingId(null);
    setIsCreatingNew(true);
    setEditorMode('edit');
    setFormError(null);
    setDraftId(blank.id);
    setDraftSlug(blank.slug);
    setSlugLockedManually(false);
    setDraftCategory(blank.category);
    setDraftTitle(blank.title);
    setDraftSubtitle(blank.subtitle);
    setDraftExcerpt(blank.excerpt);
    setDraftAuthorName(blank.authorName);
    setDraftAuthorRole(blank.authorRole);
    setDraftReadTime(blank.readTime);
    setDraftImpactMetric(blank.impactMetric);
    setDraftCoverImage(blank.coverImage);
    setDraftCoverAlt(blank.coverAlt);
    setDraftFeatured(blank.featured);
    setDraftSections(blank.sections);
    setDraftChecklist(blank.actionChecklist);
    setDraftMetaTitle(blank.metaTitle);
    setDraftMetaDescription(blank.metaDescription);
    setDraftFocusKeywords(blank.focusKeywords);
    setDraftSchemaType(blank.schemaType);
    setDraftCanonicalUrl(blank.canonicalUrl);
    setDraftOgTitle(blank.ogTitle);
    setDraftOgDescription(blank.ogDescription);
  };

  const handleTitleChange = (val: string) => {
    setDraftTitle(val);
    if (!slugLockedManually) {
      setDraftSlug(slugifyBlogTitle(val));
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraftCoverImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSection = () => {
    setDraftSections((prev) => [
      ...prev,
      {
        heading: `${prev.length + 1}. Novo Tópico Estratégico`,
        bodyText: ''
      }
    ]);
  };

  const handleUpdateSection = (
    idx: number,
    field: keyof EditableSectionDraft,
    value: string
  ) => {
    setDraftSections((prev) =>
      prev.map((sec, i) => (i === idx ? { ...sec, [field]: value } : sec))
    );
  };

  const handleRemoveSection = (idx: number) => {
    if (draftSections.length <= 1) return;
    setDraftSections((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddChecklistItem = () => {
    const trimmed = newChecklistInput.trim();
    if (!trimmed) return;
    setDraftChecklist((prev) => [...prev, trimmed]);
    setNewChecklistInput('');
  };

  const handleRemoveChecklistItem = (idx: number) => {
    setDraftChecklist((prev) => prev.filter((_, i) => i !== idx));
  };

  const buildStructuredSections = (): InsightArticleSection[] => {
    return draftSections
      .filter((s) => s.heading.trim() || s.bodyText.trim())
      .map((s) => ({
        heading: s.heading.trim() || 'Seção do Artigo',
        paragraphs: s.bodyText
          .split(/\n{2,}|\n/)
          .map((p) => p.trim())
          .filter(Boolean)
      }));
  };

  const estimatedWordCount = useMemo(() => {
    const allText = [
      draftTitle,
      draftSubtitle,
      draftExcerpt,
      ...draftSections.map((s) => `${s.heading} ${s.bodyText}`)
    ].join(' ');
    return allText.trim() ? allText.trim().split(/\s+/).length : 0;
  }, [draftTitle, draftSubtitle, draftExcerpt, draftSections]);

  const handleAddKeyword = () => {
    const cleaned = newKeywordInput.trim();
    if (!cleaned) return;
    if (!draftFocusKeywords.some((k) => k.toLowerCase() === cleaned.toLowerCase())) {
      setDraftFocusKeywords((prev) => [...prev, cleaned]);
    }
    setNewKeywordInput('');
  };

  const handleRemoveKeyword = (idx: number) => {
    setDraftFocusKeywords((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCopyBlock = async (block: 'meta' | 'jsonld', text: string) => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopiedBlock(block);
      setTimeout(() => {
        setCopiedBlock((prev) => (prev === block ? null : prev));
      }, 2200);
      onNotify?.(
        block === 'meta'
          ? 'Meta tags HTML copiadas para a área de transferência!'
          : 'Esquema JSON-LD (Schema.org) copiado!'
      );
    } catch {
      onNotify?.('Selecione e copie o código diretamente do inspetor.');
    }
  };

  const saveCurrentArticle = () => {
    setFormError(null);

    if (draftTitle.trim().length < 6) {
      setFormError('Informe um título com pelo menos 6 caracteres.');
      setEditorMode('edit');
      return;
    }
    if (draftExcerpt.trim().length < 20) {
      setFormError('Escreva um resumo (excerpt) com pelo menos 20 caracteres para SEO.');
      setEditorMode('edit');
      return;
    }

    const structuredSections = buildStructuredSections();
    if (structuredSections.length === 0 || structuredSections[0].paragraphs.length === 0) {
      setFormError('Adicione pelo menos uma seção com conteúdo de texto no artigo.');
      setEditorMode('edit');
      return;
    }

    const existing = articles.find((a) => a.id === draftId);
    const todayFormatted = formatBlogDatePtBr();
    const resolvedSlug =
      draftSlug.trim() ||
      slugifyBlogTitle(draftTitle) ||
      `artigo-${Date.now()}`;

    const effectiveMetaTitle = (draftMetaTitle.trim() || draftTitle.trim()).slice(0, 70);
    const effectiveMetaDescription = (draftMetaDescription.trim() || draftExcerpt.trim()).slice(
      0,
      165
    );
    const effectiveKeywords =
      draftFocusKeywords.length > 0
        ? draftFocusKeywords
        : [draftCategory, 'Negócios Locais', 'GuiaPonto'];

    const finalArticle: InsightArticle = {
      id: draftId || `article-${Date.now()}`,
      slug: resolvedSlug,
      category: draftCategory,
      title: draftTitle.trim(),
      subtitle: draftSubtitle.trim() || draftExcerpt.trim(),
      excerpt: draftExcerpt.trim(),
      publishedAt: existing?.publishedAt || todayFormatted.publishedAt,
      isoDate: existing?.isoDate || todayFormatted.isoDate,
      readTime:
        draftReadTime.trim() ||
        `${Math.max(1, Math.ceil(estimatedWordCount / 180))} min de leitura`,
      author: {
        name: draftAuthorName.trim() || 'Equipe Editorial GuiaPonto',
        role: draftAuthorRole.trim() || 'Especialista em Negócios Locais'
      },
      coverImage: draftCoverImage || PRESET_BLOG_COVERS[0]?.url || '',
      coverAlt: draftCoverAlt.trim() || draftTitle.trim(),
      featured: draftFeatured,
      impactMetric: draftImpactMetric.trim() || '+100% presença orgânica local',
      sections: structuredSections,
      actionChecklist: draftChecklist.filter((item) => item.trim().length > 0),
      seo: {
        metaTitle: effectiveMetaTitle,
        metaDescription: effectiveMetaDescription,
        focusKeywords: effectiveKeywords,
        schemaType: draftSchemaType,
        canonicalUrl: draftCanonicalUrl.trim() || undefined,
        ogTitle: draftOgTitle.trim() || undefined,
        ogDescription: draftOgDescription.trim() || undefined
      }
    };

    const nextList = upsertBlogArticle(finalArticle);
    setArticles(nextList);
    setEditingId(finalArticle.id);
    setIsCreatingNew(false);
    onNotify?.(
      isCreatingNew
        ? `Novo artigo "${finalArticle.title}" publicado com SEO & JSON-LD!`
        : `Alterações e metadados SEO de "${finalArticle.title}" salvos!`
    );
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    saveCurrentArticle();
  };

  const handleDeleteArticle = (id: string, title: string) => {
    if (articles.length <= 1) {
      setFormError('Mantenha pelo menos 1 artigo publicado no blog Business Insights.');
      return;
    }
    const nextList = deleteBlogArticleById(id);
    setArticles(nextList);
    if (editingId === id && nextList[0]) {
      loadArticleIntoDraft(nextList[0]);
    }
    onNotify?.(`Artigo "${title}" removido do blog.`);
  };

  const handleSetFeatured = (id: string, title: string) => {
    const nextList = setFeaturedBlogArticleById(id);
    setArticles(nextList);
    if (draftId === id) {
      setDraftFeatured(true);
    }
    onNotify?.(`"${title}" definido como artigo principal em destaque!`);
  };

  const handleResetDefaults = () => {
    const defaults = resetBlogArticlesToDefaults();
    setArticles(defaults);
    if (defaults[0]) {
      loadArticleIntoDraft(defaults[0]);
    }
    onNotify?.('Artigos originais do blog Business Insights restaurados.');
  };

  const previewSections = buildStructuredSections();

  const draftArticleForSeo: InsightArticle = useMemo(() => {
    const existing = articles.find((a) => a.id === draftId);
    const todayFormatted = formatBlogDatePtBr();
    return {
      id: draftId || 'draft-preview',
      slug: draftSlug.trim() || slugifyBlogTitle(draftTitle) || 'artigo-business-insights',
      category: draftCategory,
      title: draftTitle.trim() || 'Título do Artigo Business Insights',
      subtitle: draftSubtitle.trim() || draftExcerpt.trim(),
      excerpt:
        draftExcerpt.trim() ||
        'Guia estratégico GuiaPonto para atrair clientes locais e fortalecer sua presença orgânica.',
      publishedAt: existing?.publishedAt || todayFormatted.publishedAt,
      isoDate: existing?.isoDate || todayFormatted.isoDate,
      readTime: draftReadTime.trim() || '5 min de leitura',
      author: {
        name: draftAuthorName.trim() || 'Equipe Editorial GuiaPonto',
        role: draftAuthorRole.trim() || 'Especialista em SEO Local'
      },
      coverImage: draftCoverImage || '',
      coverAlt: draftCoverAlt.trim() || draftTitle.trim(),
      featured: draftFeatured,
      impactMetric: draftImpactMetric.trim() || '+100% alcance orgânico',
      sections: previewSections,
      actionChecklist: draftChecklist,
      seo: {
        metaTitle: draftMetaTitle.trim() || draftTitle.trim(),
        metaDescription: draftMetaDescription.trim() || draftExcerpt.trim(),
        focusKeywords:
          draftFocusKeywords.length > 0
            ? draftFocusKeywords
            : [draftCategory, 'Negócios Locais'],
        schemaType: draftSchemaType,
        canonicalUrl: draftCanonicalUrl.trim() || undefined,
        ogTitle: draftOgTitle.trim() || undefined,
        ogDescription: draftOgDescription.trim() || undefined
      }
    };
  }, [
    articles,
    draftId,
    draftSlug,
    draftCategory,
    draftTitle,
    draftSubtitle,
    draftExcerpt,
    draftReadTime,
    draftAuthorName,
    draftAuthorRole,
    draftCoverImage,
    draftCoverAlt,
    draftFeatured,
    draftImpactMetric,
    previewSections,
    draftChecklist,
    draftMetaTitle,
    draftMetaDescription,
    draftFocusKeywords,
    draftSchemaType,
    draftCanonicalUrl,
    draftOgTitle,
    draftOgDescription
  ]);

  const effectiveSeo = useMemo(
    () => resolveEffectiveArticleSeo(draftArticleForSeo),
    [draftArticleForSeo]
  );

  const generatedMetaHtml = useMemo(
    () => buildArticleMetaTagsHtml(draftArticleForSeo),
    [draftArticleForSeo]
  );

  const generatedJsonLdString = useMemo(
    () => JSON.stringify(buildArticleJsonLd(draftArticleForSeo), null, 2),
    [draftArticleForSeo]
  );

  const resolvedCanonicalPreview = useMemo(
    () => resolveArticleCanonicalUrl(draftArticleForSeo),
    [draftArticleForSeo]
  );

  const metaTitleLen = (draftMetaTitle || draftTitle).trim().length;
  const metaDescLen = (draftMetaDescription || draftExcerpt).trim().length;

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold text-[#FE3A18]">
            CMS Editorial · Business Insights
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Editor de Artigos do Blog ({articles.length} publicados)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Crie, edite, destaque ou remova artigos de Marketing, SEO Local e Crescimento Digital. As alterações atualizam o blog público em tempo real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>

          <button
            type="button"
            onClick={handleStartNewArticle}
            className="px-4 py-2.5 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-black text-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Artigo</span>
          </button>
        </div>
      </div>

      {/* Main Split Workspace: Left Article Directory (4 cols) + Right Editor/Preview (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: ARTICLES LIST & FILTERS */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar artigo por título ou autor..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#FE3A18] focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5">
            {(['Todos', ...CATEGORIES] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles List */}
          {filteredArticles.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <BookOpen className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-800">
                Nenhum artigo encontrado
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('Todos');
                }}
                className="text-xs font-bold text-[#FE3A18] hover:underline cursor-pointer"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
              {filteredArticles.map((art) => {
                const isSelected = editingId === art.id && !isCreatingNew;
                return (
                  <div
                    key={art.id}
                    className={`p-3.5 rounded-2xl border transition-colors space-y-2.5 ${
                      isSelected
                        ? 'bg-orange-50/50 border-[#FE3A18]'
                        : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => loadArticleIntoDraft(art)}
                      className="w-full text-left flex items-start gap-3 cursor-pointer"
                    >
                      <img
                        src={art.coverImage}
                        alt={art.coverAlt}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-200"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                          <span className="font-bold text-[#FE3A18]">
                            {art.category}
                          </span>
                          <span aria-hidden="true" className="text-slate-300">
                            ·
                          </span>
                          <span className="font-mono tabular-nums text-slate-500">
                            {art.publishedAt}
                          </span>
                        </div>
                        <h3 className="text-xs font-black text-slate-900 line-clamp-2 leading-snug">
                          {art.title}
                        </h3>
                      </div>
                    </button>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
                      <button
                        type="button"
                        onClick={() => handleSetFeatured(art.id, art.title)}
                        className={`inline-flex items-center gap-1 font-bold cursor-pointer ${
                          art.featured
                            ? 'text-amber-600'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            art.featured ? 'fill-amber-400 text-amber-500' : ''
                          }`}
                        />
                        <span>{art.featured ? 'Em Destaque' : 'Destacar'}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => loadArticleIntoDraft(art)}
                          className="font-bold text-slate-700 hover:text-[#FE3A18] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Editar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteArticle(art.id, art.title)}
                          className="font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: STRUCTURED BLOG ARTICLE EDITOR & LIVE READER PREVIEW */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 overflow-hidden">
          {/* Editor Top Mode Switcher */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900">
                {isCreatingNew
                  ? 'Criando Novo Artigo para o Blog'
                  : `Editando Artigo · ${draftSlug || draftId}`}
              </div>
              <div className="text-[11px] font-mono tabular-nums text-slate-500">
                {estimatedWordCount} palavras · {draftSections.length}{' '}
                {draftSections.length === 1 ? 'seção' : 'seções'} ·{' '}
                {draftChecklist.length} itens de checklist
              </div>
            </div>

            <div
              role="tablist"
              aria-label="Modo do editor de artigo"
              className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-200/70"
            >
              <button
                type="button"
                role="tab"
                aria-selected={editorMode === 'edit'}
                onClick={() => setEditorMode('edit')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                  editorMode === 'edit'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={editorMode === 'preview'}
                onClick={() => setEditorMode('preview')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                  editorMode === 'preview'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Pré-visualização</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={editorMode === 'seo'}
                onClick={() => setEditorMode('seo')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                  editorMode === 'seo'
                    ? 'bg-white text-[#FE3A18] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>SEO & JSON-LD</span>
              </button>
            </div>
          </div>

          {editorMode === 'preview' ? (
            /* LIVE ARTICLE READER PREVIEW */
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-[#FE3A18]">{draftCategory}</span>
                  <span aria-hidden="true">·</span>
                  <span>{draftReadTime}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums text-emerald-700 font-bold">
                    {draftImpactMetric}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-balance">
                  {draftTitle || 'Título do Artigo'}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {draftSubtitle || draftExcerpt || 'Subtítulo e contexto do artigo.'}
                </p>
                <div className="text-xs text-slate-500">
                  Por <strong className="text-slate-900">{draftAuthorName}</strong> ({draftAuthorRole})
                </div>
              </div>

              {draftCoverImage && (
                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={draftCoverImage}
                    alt={draftCoverAlt || draftTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-6">
                {previewSections.map((sec, idx) => (
                  <div key={idx} className="space-y-2.5">
                    <h3 className="text-lg font-black text-slate-900">{sec.heading}</h3>
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-sm sm:text-base text-slate-700 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              {draftChecklist.length > 0 && (
                <div className="pt-5 border-t border-slate-200 space-y-3">
                  <h4 className="text-sm font-black text-slate-900">
                    Checklist Prático para Aplicar Hoje
                  </h4>
                  <ul className="space-y-2">
                    {draftChecklist.map((step, i) => (
                      <li
                        key={i}
                        className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 flex items-center gap-2.5"
                      >
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : editorMode === 'seo' ? (
            /* DYNAMIC SEO META TAGS & SCHEMA.ORG JSON-LD CONFIGURATOR */
            <div className="p-6 sm:p-8 space-y-7">
              {/* Header Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#FE3A18]" />
                    <span>Otimização Orgânica, Meta Tags Dinâmicas & JSON-LD</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Configure como o Google exibe este artigo nos resultados de busca e injete automaticamente Schema.org estruturado ao abrir o leitor no blog.
                  </p>
                </div>
                <span className="font-mono tabular-nums text-[11px] font-bold text-slate-700 whitespace-nowrap shrink-0">
                  Schema: {draftSchemaType}
                </span>
              </div>

              {/* Google Search Snippet Preview */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-900 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#FE3A18]" />
                    <span>Pré-visualização do Resultado no Google (SERP)</span>
                  </span>
                  <span className="font-mono tabular-nums text-[11px] text-slate-500">
                    Título {metaTitleLen}/60 · Descrição {metaDescLen}/160
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                  <div className="text-[11px] text-slate-500 font-mono truncate">
                    {resolvedCanonicalPreview}
                  </div>
                  <div className="text-base sm:text-lg font-medium text-[#1a0dab] leading-snug line-clamp-1">
                    {effectiveSeo.metaTitle || 'Título SEO do artigo Business Insights'}
                  </div>
                  <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed line-clamp-2">
                    {effectiveSeo.metaDescription ||
                      'Meta description exibida nos resultados orgânicos de busca.'}
                  </p>
                </div>
              </div>

              {/* Meta Title & Meta Description */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs font-bold text-slate-800">
                      Meta Title SEO (30–60 caracteres recomendados)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDraftMetaTitle(draftTitle.slice(0, 60))}
                        className="text-[11px] font-bold text-[#FE3A18] hover:underline cursor-pointer"
                      >
                        Usar Título H1
                      </button>
                      <span
                        className={`text-[11px] font-mono tabular-nums font-bold ${
                          metaTitleLen >= 30 && metaTitleLen <= 60
                            ? 'text-emerald-700'
                            : metaTitleLen > 60
                            ? 'text-amber-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {metaTitleLen} chars
                      </span>
                    </div>
                  </div>
                  <input
                    type="text"
                    maxLength={70}
                    value={draftMetaTitle}
                    onChange={(e) => setDraftMetaTitle(e.target.value)}
                    placeholder={draftTitle || 'Ex: SEO Local no Google Maps para Negócios do Bairro'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:border-[#FE3A18] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs font-bold text-slate-800">
                      Meta Description (120–160 caracteres recomendados)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDraftMetaDescription(draftExcerpt.slice(0, 160))}
                        className="text-[11px] font-bold text-[#FE3A18] hover:underline cursor-pointer"
                      >
                        Usar Resumo Editorial
                      </button>
                      <span
                        className={`text-[11px] font-mono tabular-nums font-bold ${
                          metaDescLen >= 120 && metaDescLen <= 160
                            ? 'text-emerald-700'
                            : metaDescLen > 160
                            ? 'text-amber-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {metaDescLen} chars
                      </span>
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={165}
                    value={draftMetaDescription}
                    onChange={(e) => setDraftMetaDescription(e.target.value)}
                    placeholder={
                      draftExcerpt ||
                      'Resumo persuasivo com palavra-chave principal para aumentar taxa de cliques orgânicos.'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:border-[#FE3A18] focus:outline-none"
                  />
                </div>
              </div>

              {/* Schema.org @type Selector */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-800 block">
                  Tipo de Esquema Estruturado (Schema.org @type)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SCHEMA_TYPES.map((schemaOpt) => {
                    const selected = draftSchemaType === schemaOpt.value;
                    return (
                      <button
                        key={schemaOpt.value}
                        type="button"
                        onClick={() => setDraftSchemaType(schemaOpt.value)}
                        className={`p-3.5 rounded-2xl border text-left transition-colors cursor-pointer space-y-1 ${
                          selected
                            ? 'bg-orange-50/70 border-[#FE3A18]'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-xs font-black text-slate-900 flex items-center justify-between">
                          <span>{schemaOpt.label}</span>
                          {selected && <Check className="w-3.5 h-3.5 text-[#FE3A18]" />}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          {schemaOpt.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Focus Keywords Manager */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#FE3A18]" />
                  <span>Palavras-chave Foco (Meta Keywords & Schema keywords)</span>
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeywordInput}
                    onChange={(e) => setNewKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    placeholder="Ex: seo local para restaurantes"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-[#FE3A18] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
                  >
                    + Adicionar
                  </button>
                </div>

                {draftFocusKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {draftFocusKeywords.map((kw, idx) => (
                      <button
                        key={`${kw}-${idx}`}
                        type="button"
                        onClick={() => handleRemoveKeyword(idx)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-rose-300 hover:text-rose-700 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <span>{kw}</span>
                        <X className="w-3 h-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Canonical URL & OpenGraph Social Overrides */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    URL Canônica (Opcional — preenchida automaticamente pelo slug se vazia)
                  </label>
                  <input
                    type="url"
                    value={draftCanonicalUrl}
                    onChange={(e) => setDraftCanonicalUrl(e.target.value)}
                    placeholder={resolvedCanonicalPreview}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 focus:bg-white focus:border-[#FE3A18] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Título OpenGraph / Social (og:title)
                  </label>
                  <input
                    type="text"
                    value={draftOgTitle}
                    onChange={(e) => setDraftOgTitle(e.target.value)}
                    placeholder={effectiveSeo.metaTitle || 'Herdado de Meta Title'}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-[#FE3A18] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Descrição OpenGraph / Social (og:description)
                  </label>
                  <input
                    type="text"
                    value={draftOgDescription}
                    onChange={(e) => setDraftOgDescription(e.target.value)}
                    placeholder={effectiveSeo.metaDescription || 'Herdado de Meta Description'}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-[#FE3A18] focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Generated HTML Meta Tags & JSON-LD Inspector */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-slate-900">
                      Meta Tags Dinâmicas Geradas (Head)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyBlock('meta', generatedMetaHtml)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedBlock === 'meta' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar HTML</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-2xl bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-64">
                    <code>{generatedMetaHtml}</code>
                  </pre>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-slate-900">
                      Esquema JSON-LD (application/ld+json)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyBlock('jsonld', generatedJsonLdString)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedBlock === 'jsonld' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar JSON-LD</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-64">
                    <code>{generatedJsonLdString}</code>
                  </pre>
                </div>
              </div>

              {/* Save Action Bar inside SEO Tab */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Ao salvar, o leitor do blog injeta essas meta tags e o JSON-LD no &lt;head&gt; em tempo real.
                </span>

                <button
                  type="button"
                  onClick={saveCurrentArticle}
                  className="px-6 py-3 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-black text-xs sm:text-sm transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {isCreatingNew ? 'Publicar com SEO & JSON-LD' : 'Salvar SEO e Artigo'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* STRUCTURED EDITOR FORM */
            <form onSubmit={handleSaveArticle} className="p-6 sm:p-8 space-y-6">
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                  {formError}
                </div>
              )}

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8 space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Título do Artigo (H1 / SEO) *
                  </label>
                  <input
                    type="text"
                    required
                    value={draftTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Ex: Como Atrair Mais Clientes Locais Pelo Google Maps"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:border-[#FE3A18] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Categoria *
                  </label>
                  <select
                    value={draftCategory}
                    onChange={(e) =>
                      setDraftCategory(e.target.value as InsightCategory)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#FE3A18] focus:outline-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-7 space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Slug da URL
                  </label>
                  <input
                    type="text"
                    value={draftSlug}
                    onChange={(e) => {
                      setSlugLockedManually(true);
                      setDraftSlug(e.target.value);
                    }}
                    placeholder="como-atrair-clientes-locais"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 focus:bg-white focus:border-[#FE3A18] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-5 flex items-end">
                  <label className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draftFeatured}
                      onChange={(e) => setDraftFeatured(e.target.checked)}
                      className="rounded accent-[#FE3A18]"
                    />
                    <span>Artigo em Destaque no Topo do Blog</span>
                  </label>
                </div>
              </div>

              {/* Subtitle & Excerpt */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Subtítulo Editorial
                  </label>
                  <input
                    type="text"
                    value={draftSubtitle}
                    onChange={(e) => setDraftSubtitle(e.target.value)}
                    placeholder="Resumo estratégico exibido abaixo do título ao abrir o artigo"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:border-[#FE3A18] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Resumo / Meta Description (Card & SEO) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={draftExcerpt}
                    onChange={(e) => setDraftExcerpt(e.target.value)}
                    placeholder="Descrição objetiva exibida no card do blog e nos metadados de busca orgânica..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:border-[#FE3A18] focus:outline-none"
                  />
                </div>
              </div>

              {/* Author, ReadTime & Metric */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Nome do Autor
                  </label>
                  <input
                    type="text"
                    value={draftAuthorName}
                    onChange={(e) => setDraftAuthorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-[#FE3A18] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Cargo / Especialidade
                  </label>
                  <input
                    type="text"
                    value={draftAuthorRole}
                    onChange={(e) => setDraftAuthorRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-[#FE3A18] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Tempo de Leitura
                  </label>
                  <input
                    type="text"
                    value={draftReadTime}
                    onChange={(e) => setDraftReadTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-[#FE3A18] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Métrica de Impacto
                  </label>
                  <input
                    type="text"
                    value={draftImpactMetric}
                    onChange={(e) => setDraftImpactMetric(e.target.value)}
                    placeholder="+140% visibilidade"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-emerald-700 font-bold focus:bg-white focus:border-[#FE3A18] focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Image Selection & Upload */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black text-slate-900">
                    Imagem de Capa do Artigo
                  </span>
                  <label className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#FE3A18] text-xs font-bold text-slate-800 inline-flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[#FE3A18]" />
                    <span>Enviar Imagem Local</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="sr-only"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PRESET_BLOG_COVERS.map((preset) => {
                    const active = draftCoverImage === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setDraftCoverImage(preset.url);
                          if (!draftCoverAlt) setDraftCoverAlt(preset.alt);
                        }}
                        className={`rounded-xl overflow-hidden border-2 transition-all cursor-pointer aspect-[16/10] relative ${
                          active ? 'border-[#FE3A18]' : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.alt}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  value={draftCoverAlt}
                  onChange={(e) => setDraftCoverAlt(e.target.value)}
                  placeholder="Texto alternativo (Alt SEO) da imagem de capa"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:border-[#FE3A18] focus:outline-none"
                />
              </div>

              {/* Article Sections Editor */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      Conteúdo do Artigo (Seções & Parágrafos)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Separe múltiplos parágrafos com uma quebra de linha.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Seção</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {draftSections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono font-bold text-slate-500">
                          Seção {idx + 1}
                        </span>
                        {draftSections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(idx)}
                            className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                          >
                            Remover seção
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        value={sec.heading}
                        onChange={(e) =>
                          handleUpdateSection(idx, 'heading', e.target.value)
                        }
                        placeholder="Subtítulo da seção (ex: 1. Consistência de NAP)"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:border-[#FE3A18] focus:outline-none"
                      />

                      <textarea
                        rows={4}
                        value={sec.bodyText}
                        onChange={(e) =>
                          handleUpdateSection(idx, 'bodyText', e.target.value)
                        }
                        placeholder="Escreva os parágrafos desta seção..."
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed focus:border-[#FE3A18] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Checklist Editor */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h4 className="text-sm font-black text-slate-900">
                  Checklist Prático do Artigo ({draftChecklist.length})
                </h4>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newChecklistInput}
                    onChange={(e) => setNewChecklistInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddChecklistItem();
                      }
                    }}
                    placeholder="Adicionar nova tarefa prática para o leitor..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-[#FE3A18] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddChecklistItem}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
                  >
                    + Incluir Item
                  </button>
                </div>

                {draftChecklist.length > 0 && (
                  <ul className="space-y-2">
                    {draftChecklist.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                      >
                        <span className="truncate">{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveChecklistItem(i)}
                          className="text-rose-600 hover:text-rose-700 font-bold shrink-0 cursor-pointer"
                        >
                          Remover
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* SEO & Schema Summary Bar inside Edit Mode */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5 text-xs">
                  <div className="font-black text-slate-900">
                    SEO & Schema.org Configurado ({draftSchemaType})
                  </div>
                  <div className="font-mono tabular-nums text-[11px] text-slate-600">
                    Meta Title: {metaTitleLen}/60 · Meta Desc: {metaDescLen}/160 ·{' '}
                    {effectiveSeo.focusKeywords.length} palavras-chave
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditorMode('seo')}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#FE3A18] text-xs font-bold text-slate-900 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Code2 className="w-3.5 h-3.5 text-[#FE3A18]" />
                  <span>Configurar SEO & JSON-LD</span>
                </button>
              </div>

              {/* Submit / Save Bar */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  As alterações ficam visíveis imediatamente na seção Business Insights.
                </span>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-black text-xs sm:text-sm transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {isCreatingNew ? 'Publicar Artigo no Blog' : 'Salvar Alterações'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
