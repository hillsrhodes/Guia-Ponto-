/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Mic,
  LocateFixed,
  Loader2,
  Building2,
  Tag,
  Star,
  X,
  ExternalLink,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSorocabaGeolocationCenter } from '../../hooks/useSorocabaGeolocationCenter';
import {
  DIRECTORY_MOCK_DATA,
  DirectoryBusiness
} from '../directory/BusinessDirectoryPage';
import { ContributorSummaryStrip } from '../contributor/ContributorSummaryStrip';

interface HeroSearchProps {
  onOpenRegisterModal: () => void;
  onOpenDirectory?: (searchTerm?: string, cityTerm?: string) => void;
  onSelectCategory?: (categoryName: string) => void;
  onSelectBusiness?: (business: DirectoryBusiness) => void;
  onOpenContributorProfile?: () => void;
  activeTab: 'business' | 'consumer';
}

interface AutocompleteCategoryItem {
  name: string;
  shortLabel: string;
  keywords: string[];
  count: number;
}

const AUTOCOMPLETE_CATEGORIES: Omit<AutocompleteCategoryItem, 'count'>[] = [
  {
    name: 'Restaurantes & Gastronomia',
    shortLabel: 'Almoço executivo, carnes nobres, padarias, cafés e eventos',
    keywords: [
      'restaurante',
      'comida',
      'almoco',
      'churrasco',
      'padaria',
      'cafe',
      'gastronomia',
      'jantar',
      'pizzaria',
      'lanchonete',
      'bar'
    ]
  },
  {
    name: 'Saúde & Estética',
    shortLabel: 'Clínicas odontológicas, salões de beleza, spa e veterinária 24h',
    keywords: [
      'clinica',
      'dentista',
      'odontologia',
      'salao',
      'estetica',
      'veterinario',
      'pet',
      'saude',
      'medico',
      'beleza',
      'cabelo'
    ]
  },
  {
    name: 'Oficinas & Automotivo',
    shortLabel: 'Mecânica, revisão, auto elétrica, baterias e ar automotivo',
    keywords: [
      'oficina',
      'mecanica',
      'carro',
      'auto eletrica',
      'bateria',
      'pneu',
      'revisao',
      'automotivo',
      'veiculo'
    ]
  },
  {
    name: 'Imobiliárias & Arquitetura',
    shortLabel: 'Compra, venda, locação de alto padrão e condomínios fechados',
    keywords: [
      'imobiliaria',
      'imoveis',
      'casa',
      'apartamento',
      'aluguel',
      'arquitetura',
      'condominio',
      'terreno'
    ]
  },
  {
    name: 'Serviços Profissionais',
    shortLabel: 'Advocacia, contabilidade, consultoria empresarial e tecnologia',
    keywords: [
      'advocacia',
      'advogado',
      'contabilidade',
      'contador',
      'consultoria',
      'juridico',
      'marketing',
      'escritorio'
    ]
  },
  {
    name: 'Lojas & Comércio Local',
    shortLabel: 'Moda feminina e masculina, acessórios, calçados e presentes',
    keywords: [
      'loja',
      'moda',
      'roupas',
      'calcados',
      'presentes',
      'comercio',
      'boutique',
      'varejo'
    ]
  },
  {
    name: 'Assistência & Manutenção',
    shortLabel: 'Ar-condicionado split, elétrica, reparos e energia solar',
    keywords: [
      'ar-condicionado',
      'eletricista',
      'manutencao',
      'conserto',
      'energia solar',
      'assistencia tecnica',
      'reparo'
    ]
  },
  {
    name: 'Casa de Repouso & Cuidado',
    shortLabel: 'Residencial sênior, enfermagem 24h e cuidados geriátricos',
    keywords: [
      'idosos',
      'casa de repouso',
      'geriatria',
      'cuidador',
      'residencial senior',
      'enfermagem',
      'acolher'
    ]
  }
];

function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function HighlightMatchedText({ text, query }: { text: string; query: string }) {
  const cleanQuery = normalizeSearchText(query);
  if (!cleanQuery) return <>{text}</>;

  const normalizedText = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  const matchIndex = normalizedText.indexOf(cleanQuery);
  if (matchIndex === -1) return <>{text}</>;

  const before = text.slice(0, matchIndex);
  const match = text.slice(matchIndex, matchIndex + cleanQuery.length);
  const after = text.slice(matchIndex + cleanQuery.length);

  return (
    <>
      {before}
      <mark className="bg-[#FE3A18]/15 text-[#FE3A18] font-extrabold rounded px-0.5 not-italic">
        {match}
      </mark>
      {after}
    </>
  );
}

type FlattenedSuggestion =
  | { type: 'category'; category: AutocompleteCategoryItem }
  | { type: 'business'; business: DirectoryBusiness };

export function HeroSearch({
  onOpenRegisterModal,
  onOpenDirectory,
  onSelectCategory,
  onSelectBusiness,
  onOpenContributorProfile,
  activeTab
}: HeroSearchProps) {
  const { activeHub, isLocating, refreshGpsWithSorocabaLock } =
    useSorocabaGeolocationCenter({
      autoDetectOnMount: true,
      defaultHubId: 'campolim',
      enforceRegionLock: true
    });

  const [searchTerm, setSearchTerm] = useState('');
  const [cityTerm, setCityTerm] = useState(
    () => `${activeHub.name}, ${activeHub.city}`
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [isListening, setIsListening] = useState(false);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCityTerm(`${activeHub.name}, ${activeHub.city}`);
  }, [activeHub.id, activeHub.name, activeHub.city]);

  // Close autocomplete dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Enrich categories with live count from DIRECTORY_MOCK_DATA
  const categoriesWithCount = useMemo<AutocompleteCategoryItem[]>(() => {
    return AUTOCOMPLETE_CATEGORIES.map((cat) => {
      const count = DIRECTORY_MOCK_DATA.filter(
        (b) => b.category === cat.name
      ).length;
      return { ...cat, count };
    });
  }, []);

  // Compute filtered categories and businesses as the user types
  const { matchedCategories, matchedBusinesses } = useMemo(() => {
    const normalizedQuery = normalizeSearchText(searchTerm);

    if (!normalizedQuery) {
      return {
        matchedCategories: categoriesWithCount.slice(0, 4),
        matchedBusinesses: DIRECTORY_MOCK_DATA.slice(0, 5)
      };
    }

    const categories = categoriesWithCount.filter((cat) => {
      const inName = normalizeSearchText(cat.name).includes(normalizedQuery);
      const inLabel = normalizeSearchText(cat.shortLabel).includes(
        normalizedQuery
      );
      const inKeywords = cat.keywords.some((kw) =>
        normalizeSearchText(kw).includes(normalizedQuery)
      );
      return inName || inLabel || inKeywords;
    });

    const businesses = DIRECTORY_MOCK_DATA.filter((biz) => {
      const inName = normalizeSearchText(biz.name).includes(normalizedQuery);
      const inCategory = normalizeSearchText(biz.category).includes(
        normalizedQuery
      );
      const inSubcategory = normalizeSearchText(biz.subcategory).includes(
        normalizedQuery
      );
      const inNeighborhood = normalizeSearchText(biz.neighborhood).includes(
        normalizedQuery
      );
      const inTags = biz.tags.some((t) =>
        normalizeSearchText(t).includes(normalizedQuery)
      );
      return (
        inName || inCategory || inSubcategory || inNeighborhood || inTags
      );
    })
      .sort((a, b) => {
        // Prioritize prefix or direct name matches first
        const aNameMatch = normalizeSearchText(a.name).includes(
          normalizedQuery
        );
        const bNameMatch = normalizeSearchText(b.name).includes(
          normalizedQuery
        );
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        return b.rating - a.rating;
      })
      .slice(0, 6);

    return {
      matchedCategories: categories.slice(0, 4),
      matchedBusinesses: businesses
    };
  }, [searchTerm, categoriesWithCount]);

  // Flat list for keyboard navigation (ArrowUp / ArrowDown / Enter)
  const flattenedSuggestions = useMemo<FlattenedSuggestion[]>(() => {
    const list: FlattenedSuggestion[] = [];
    matchedCategories.forEach((category) =>
      list.push({ type: 'category', category })
    );
    matchedBusinesses.forEach((business) =>
      list.push({ type: 'business', business })
    );
    return list;
  }, [matchedCategories, matchedBusinesses]);

  const handleSelectCategoryItem = (categoryName: string) => {
    setSearchTerm(categoryName);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    } else if (onOpenDirectory) {
      onOpenDirectory(categoryName, cityTerm);
    }
  };

  const handleSelectBusinessItem = (
    business: DirectoryBusiness,
    openLandingDirectly = false
  ) => {
    setSearchTerm(business.name);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    if (openLandingDirectly && onSelectBusiness) {
      onSelectBusiness(business);
      return;
    }
    if (onOpenDirectory) {
      onOpenDirectory(business.name, cityTerm);
    } else if (onSelectBusiness) {
      onSelectBusiness(business);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsDropdownOpen(true);
      return;
    }

    if (!isDropdownOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < flattenedSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : flattenedSuggestions.length - 1
      );
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      const selected = flattenedSuggestions[highlightedIndex];
      if (selected) {
        e.preventDefault();
        if (selected.type === 'category') {
          handleSelectCategoryItem(selected.category.name);
        } else {
          handleSelectBusinessItem(selected.business);
        }
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    if ((activeTab === 'consumer' || searchTerm.trim().length > 0) && onOpenDirectory) {
      onOpenDirectory(searchTerm.trim(), cityTerm);
      return;
    }
    const element = document.getElementById('destaques');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setGeoNotice('Reconhecimento de voz indisponível neste navegador.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setSearchTerm(speechToText);
      setIsDropdownOpen(true);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleGetCurrentLocation = async () => {
    const result = await refreshGpsWithSorocabaLock();
    setCityTerm(`${result.nearestHub.name}, ${result.nearestHub.city}`);
    setGeoNotice(result.statusMessage);
  };

  return (
    <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="flex flex-col items-center space-y-5">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FE3A18]/10 border border-[#FE3A18]/20 text-[#FE3A18] text-xs sm:text-sm font-semibold shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#FE3A18] animate-pulse" />
              <span>
                {activeTab === 'business'
                  ? 'Vitrine Digital para Negócios de Sorocaba e Região'
                  : 'Encontre os melhores comércios e serviços em Sorocaba e Região'}
              </span>
            </motion.div>
          </div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]"
          >
            Seu Negócio <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#FE3A18] via-rose-500 to-orange-500 bg-clip-text text-transparent">
              merece ser encontrado
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto"
          >
            {activeTab === 'business' ? (
              <>
                Conquiste mais visibilidade na internet e coloque seu negócio na
                frente de clientes que estão procurando produtos e serviços em{' '}
                <strong className="text-slate-900 font-semibold">
                  Sorocaba, Votorantim e região
                </strong>
                . No{' '}
                <strong className="text-slate-900 font-semibold">
                  GuiaPonto
                </strong>
                , você cria sua página comercial, divulga contatos e atrai
                clientes locais no WhatsApp.
              </>
            ) : (
              <>
                Descubra restaurantes, clínicas, oficinas, lojas e prestadores
                de serviços qualificados em{' '}
                <strong className="text-slate-900 font-semibold">
                  Sorocaba e região metropolitana
                </strong>
                . Conecte-se diretamente pelo WhatsApp em segundos.
              </>
            )}
          </motion.p>

          {/* Immersive Search Box with Real-Time Autocomplete */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 relative z-30"
          >
            <form
              onSubmit={handleSearch}
              className="backdrop-blur-md bg-white/95 border border-white/40 shadow-2xl rounded-2xl p-3 sm:p-4 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-3 items-center ring-1 ring-slate-900/5 relative"
            >
              {/* Service / Business Autocomplete Input */}
              <div
                ref={searchContainerRef}
                className="md:col-span-5 relative"
              >
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FE3A18] transition-all relative">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    role="combobox"
                    aria-expanded={isDropdownOpen}
                    aria-autocomplete="list"
                    aria-controls="hero-search-autocomplete-listbox"
                    placeholder={
                      isListening
                        ? 'Ouvindo... Fale agora'
                        : 'Busque categorias ou negócios (Ex: Restaurante, Sabor...)'
                    }
                    value={searchTerm}
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsDropdownOpen(true);
                      setHighlightedIndex(-1);
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none pr-16"
                  />

                  {/* Clear Input Button */}
                  {searchTerm.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setHighlightedIndex(-1);
                        inputRef.current?.focus();
                      }}
                      title="Limpar busca"
                      className="absolute right-10 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Microphone Button */}
                  <button
                    type="button"
                    onClick={toggleListening}
                    title="Busca por voz"
                    className={`absolute right-2.5 p-2 rounded-xl transition-all cursor-pointer ${
                      isListening
                        ? 'bg-[#FE3A18] text-white animate-pulse shadow-lg shadow-[#FE3A18]/40'
                        : 'text-slate-400 hover:text-[#FE3A18] hover:bg-slate-100'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>

                {/* Real-Time Autocomplete Dropdown */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      id="hero-search-autocomplete-listbox"
                      role="listbox"
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                      className="absolute left-0 right-0 md:w-[500px] lg:w-[560px] top-full mt-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xl shadow-slate-900/15 overflow-hidden z-50 text-left"
                    >
                      {/* Top Status Header */}
                      <div className="px-4 py-2.5 bg-slate-900 text-white flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-[#FE3A18]" />
                          <span>
                            {searchTerm.trim()
                              ? `Sugestões instantâneas para "${searchTerm.trim()}"`
                              : 'Sugestões em Destaque · Sorocaba & Região'}
                          </span>
                        </div>
                        <span className="text-slate-400 font-mono hidden sm:inline">
                          ↑↓ navegar · Enter selecionar
                        </span>
                      </div>

                      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
                        {/* SECTION 1: SUGGESTED CATEGORIES */}
                        {matchedCategories.length > 0 && (
                          <div className="p-2.5">
                            <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Tag className="w-3 h-3 text-[#FE3A18]" />
                                Categorias Sugeridas
                              </span>
                              <span>{matchedCategories.length} encontradas</span>
                            </div>

                            <div className="mt-1 space-y-1">
                              {matchedCategories.map((cat, idx) => {
                                const isHighlighted = highlightedIndex === idx;
                                return (
                                  <button
                                    key={cat.name}
                                    type="button"
                                    role="option"
                                    aria-selected={isHighlighted}
                                    onMouseEnter={() => setHighlightedIndex(idx)}
                                    onClick={() => handleSelectCategoryItem(cat.name)}
                                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                                      isHighlighted
                                        ? 'bg-orange-50/90 ring-1 ring-[#FE3A18]/30'
                                        : 'hover:bg-slate-50'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                          isHighlighted
                                            ? 'bg-[#FE3A18] text-white'
                                            : 'bg-[#FE3A18]/10 text-[#FE3A18]'
                                        }`}
                                      >
                                        <Compass className="w-4 h-4" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                          <HighlightMatchedText
                                            text={cat.name}
                                            query={searchTerm}
                                          />
                                        </div>
                                        <div className="text-[11px] text-slate-500 truncate">
                                          {cat.shortLabel}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                                        {cat.count}{' '}
                                        {cat.count === 1 ? 'negócio' : 'negócios'}
                                      </span>
                                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* SECTION 2: SUGGESTED BUSINESSES */}
                        {matchedBusinesses.length > 0 && (
                          <div className="p-2.5">
                            <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Building2 className="w-3 h-3 text-emerald-600" />
                                Negócios de Sorocaba & Região
                              </span>
                              <span>{matchedBusinesses.length} sugestões</span>
                            </div>

                            <div className="mt-1 space-y-1">
                              {matchedBusinesses.map((biz, bIdx) => {
                                const flatIndex =
                                  matchedCategories.length + bIdx;
                                const isHighlighted =
                                  highlightedIndex === flatIndex;

                                return (
                                  <div
                                    key={biz.id}
                                    role="option"
                                    aria-selected={isHighlighted}
                                    onMouseEnter={() =>
                                      setHighlightedIndex(flatIndex)
                                    }
                                    className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-xl transition-all ${
                                      isHighlighted
                                        ? 'bg-orange-50/90 ring-1 ring-[#FE3A18]/30'
                                        : 'hover:bg-slate-50'
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => handleSelectBusinessItem(biz, false)}
                                      className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer"
                                    >
                                      <img
                                        src={biz.image}
                                        alt={biz.name}
                                        referrerPolicy="no-referrer"
                                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                                      />
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                            <HighlightMatchedText
                                              text={biz.name}
                                              query={searchTerm}
                                            />
                                          </span>
                                          {biz.verified && (
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                          )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500">
                                          <span className="font-medium text-slate-700 truncate">
                                            <HighlightMatchedText
                                              text={biz.category}
                                              query={searchTerm}
                                            />
                                          </span>
                                          <span aria-hidden="true">·</span>
                                          <span className="truncate">
                                            {biz.neighborhood}, {biz.city}
                                          </span>
                                          <span aria-hidden="true">·</span>
                                          <span className="inline-flex items-center gap-0.5 font-mono font-bold text-amber-600">
                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                            {biz.rating.toFixed(1)}
                                          </span>
                                        </div>
                                      </div>
                                    </button>

                                    {onSelectBusiness && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSelectBusinessItem(biz, true);
                                        }}
                                        title={`Abrir página exclusiva de ${biz.name}`}
                                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#FE3A18] text-slate-700 hover:text-white text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                                      >
                                        <span>Vitrine</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* EMPTY STATE WHEN NO CATEGORY OR BUSINESS MATCHES */}
                        {matchedCategories.length === 0 &&
                          matchedBusinesses.length === 0 && (
                            <div className="p-6 text-center space-y-2">
                              <p className="text-xs sm:text-sm font-bold text-slate-800">
                                Nenhuma categoria ou empresa exata para &ldquo;
                                {searchTerm}&rdquo;
                              </p>
                              <p className="text-xs text-slate-500">
                                Pressione <strong>Enter</strong> ou clique abaixo
                                para pesquisar em todo o diretório de Sorocaba e
                                Região.
                              </p>
                            </div>
                          )}
                      </div>

                      {/* Bottom Quick Footer CTA */}
                      {onOpenDirectory && (
                        <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsDropdownOpen(false);
                              onOpenDirectory(searchTerm.trim(), cityTerm);
                            }}
                            className="w-full py-1.5 px-3 rounded-xl bg-[#FE3A18]/10 hover:bg-[#FE3A18]/15 text-[#FE3A18] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Search className="w-3.5 h-3.5" />
                            <span>
                              {searchTerm.trim()
                                ? `Ver todos os resultados para "${searchTerm.trim()}" no Diretório`
                                : 'Explorar todas as categorias e negócios no Diretório'}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* City Input with Map Geolocation Button */}
              <div className="md:col-span-4 flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FE3A18] transition-all relative">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Cidade ou Bairro (Ex: Sorocaba, Campolim, Votorantim)"
                  value={cityTerm}
                  onChange={(e) => setCityTerm(e.target.value)}
                  className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none pr-10"
                />

                {/* Map Geolocation Button */}
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  title="Localização automática (GPS Sorocaba e Região)"
                  className="absolute right-3 p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
                >
                  {isLocating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  ) : (
                    <LocateFixed className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Search / Action Button */}
              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FE3A18] to-rose-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-[#FE3A18]/25 hover:shadow-[#FE3A18]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>
                    {searchTerm.trim().length > 0
                      ? 'Buscar Agora'
                      : activeTab === 'business'
                      ? 'Cadastrar Grátis'
                      : 'Pesquisar'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>

            {geoNotice && (
              <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <LocateFixed className="w-3.5 h-3.5 text-emerald-600" />
                <span>{geoNotice}</span>
              </div>
            )}

            {/* Quick badges under search */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-5 text-xs sm:text-sm text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cadastro
                gratuito para começar
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Contato
                direto via WhatsApp
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#FE3A18]" /> Sem
                mensalidade obrigatória
              </span>
            </div>

            {/* Link to Directory Page with AJAX Filter */}
            {onOpenDirectory && (
              <div className="mt-4 pt-3 border-t border-slate-200/50 flex justify-center">
                <button
                  type="button"
                  onClick={() => onOpenDirectory(searchTerm, cityTerm)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-2 group cursor-pointer hover:shadow-xs"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#FE3A18]" />
                  <span>
                    Explorar todos os negócios cadastrados no{' '}
                    <strong>Diretório com Filtro AJAX</strong>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    Tempo Real
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>

          {/* Primary CTA if in Business Mode, or Contribuidor Profile Bar in Consumer Mode */}
          {activeTab === 'business' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={onOpenRegisterModal}
                className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-xl shadow-slate-900/20 hover:scale-105 transition-all flex items-center gap-3 group cursor-pointer"
              >
                <span>Cadastrar Meu Negócio Grátis</span>
                <ArrowRight className="w-5 h-5 text-[#FE3A18] group-hover:translate-x-1 transition-transform" />
              </button>
              <span className="text-sm text-slate-500">
                Leva apenas 2 minutos.{' '}
                <strong className="text-slate-700">
                  Sem cartão de crédito.
                </strong>
              </span>
            </motion.div>
          ) : (
            onOpenContributorProfile && (
              <div className="pt-2 max-w-4xl mx-auto">
                <ContributorSummaryStrip
                  onOpenProfileModal={onOpenContributorProfile}
                  onExploreBusinesses={() => onOpenDirectory?.('', cityTerm)}
                />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
