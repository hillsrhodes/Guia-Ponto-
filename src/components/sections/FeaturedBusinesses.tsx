/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Star,
  MapPin,
  MessageSquare,
  Sparkles,
  Building2,
  ArrowRight,
  LocateFixed,
  Navigation,
  ShieldCheck,
  Loader2,
  Compass
} from 'lucide-react';
import {
  SOROCABA_REGIONAL_HUBS,
  calculateHaversineDistanceKm,
  estimateTravelTimeMinutes,
  SorocabaHubPoint
} from '../../utils/sorocabaGeolocation';
import { useSorocabaGeolocationCenter } from '../../hooks/useSorocabaGeolocationCenter';

interface FeaturedBusinessesProps {
  onContactWhatsApp: (businessName: string) => void;
  onOpenDirectory?: (category?: string) => void;
  onOpenBusinessLanding?: (businessId: string, adminMode?: boolean) => void;
}

function BusinessCard({
  biz,
  onContactWhatsApp,
  onOpenBusinessLanding
}: {
  biz: any;
  index: number;
  onContactWhatsApp: (name: string) => void;
  onOpenBusinessLanding?: (businessId: string, adminMode?: boolean) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 0.95", "start 0.65"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, scale, y }}
      className={`gp-business-card group flex flex-col justify-between ${
        biz.featured ? 'gp-business-card--featured' : ''
      }`}
    >
      {/* Top-Right Diagonal CSS Corner Ribbon (Featured PRO vs Verified) */}
      <div className="gp-corner-ribbon-box" aria-hidden="true">
        {biz.featured ? (
          <div className="gp-corner-ribbon gp-corner-ribbon--featured">
            ★ Destaque
          </div>
        ) : (
          <div className="gp-corner-ribbon gp-corner-ribbon--verified">
            ✓ Verificado
          </div>
        )}
      </div>

      <div>
        {/* Image & CSS Flag Ribbons */}
        <div className="relative h-56 overflow-hidden bg-slate-100">
          <img
            src={biz.image}
            alt={biz.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/15 to-transparent" />

          {/* Left-Edge CSS 3D Flag Ribbons with V-Notch Tail & Shimmer */}
          <div className="absolute top-3.5 left-0 flex flex-col items-start gap-1.5 z-10">
            {biz.featured && (
              <span className="gp-flag-ribbon gp-flag-ribbon--featured">
                <Sparkles className="w-3 h-3 text-amber-200 shrink-0" />
                <span>Destaque Premium</span>
              </span>
            )}
            <span className="gp-flag-ribbon gp-flag-ribbon--verified">
              <ShieldCheck className="w-3 h-3 text-emerald-100 shrink-0" />
              <span>Verificado Sorocaba</span>
            </span>
          </div>

          {/* Bottom Strip: Category + Proximity + Star Rating */}
          <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between gap-2 text-white z-10">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-black/55 backdrop-blur-md truncate">
                {biz.category}
              </span>
              <span className="bg-slate-950/85 backdrop-blur-md text-emerald-300 border border-emerald-500/35 text-[11px] font-black px-2 py-0.5 rounded-lg shadow flex items-center gap-1 shrink-0">
                <Navigation className="w-3 h-3 text-emerald-400" />
                <span>{biz.distanceKm.toFixed(1)} km</span>
              </span>
            </div>

            <div className="flex items-center gap-1 bg-amber-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow shrink-0">
              <Star className="w-3.5 h-3.5 fill-white" />
              <span>{biz.rating}</span>
              <span className="opacity-85 text-[10px]">({biz.reviews})</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3
              onClick={() => onOpenBusinessLanding && onOpenBusinessLanding(`b${biz.id}`, false)}
              className="text-xl font-bold text-slate-900 group-hover:text-[#FE3A18] transition-colors cursor-pointer leading-snug"
            >
              {biz.name}
            </h3>
          </div>

          {/* Perceived-Value Authority Sub-Strip */}
          <div className="flex items-center gap-2 mb-3">
            {biz.featured ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#FE3A18] bg-orange-50 border border-[#FE3A18]/20 px-2.5 py-0.5 rounded-md">
                <Sparkles className="w-3 h-3 text-[#FE3A18]" />
                Vitrine Patrocinada · Prioridade no Topo
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Empresa Auditada pelo GuiaPonto
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-4">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-4 h-4 text-[#FE3A18] shrink-0" />
              <span className="truncate">{biz.location}</span>
            </div>
            <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">
              ~{estimateTravelTimeMinutes(biz.distanceKm)} min daqui
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {biz.tags.map((tag: string, i: number) => (
              <span key={i} className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-6 pt-0 space-y-2">
        {onOpenBusinessLanding && (
          <button
            type="button"
            onClick={() => onOpenBusinessLanding(`b${biz.id}`, false)}
            className="gp-lift-interactive w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-[#FE3A18] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Ver Landing Page Completa da Empresa</span>
          </button>
        )}
        <button
          onClick={() => onContactWhatsApp(biz.name)}
          className="gp-lift-interactive w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-2 group/btn cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Contato Direto via WhatsApp</span>
        </button>
      </div>
    </motion.div>
  );
}

export function FeaturedBusinesses({
  onContactWhatsApp,
  onOpenDirectory,
  onOpenBusinessLanding
}: FeaturedBusinessesProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortByProximity, setSortByProximity] = useState<boolean>(true);
  const {
    userCoords,
    activeHubId,
    isLocating: isLocatingGps,
    statusMessage: gpsFeedback,
    selectHub,
    refreshGpsWithSorocabaLock
  } = useSorocabaGeolocationCenter({
    autoDetectOnMount: true,
    defaultHubId: 'campolim',
    enforceRegionLock: true
  });
  const userOrigin = {
    lat: userCoords.lat,
    lng: userCoords.lng,
    label: userCoords.label,
    isGps: userCoords.isGpsActive
  };

  const businesses = [
    {
      id: 1,
      name: 'Restaurante Sabor & Fogo',
      category: 'Restaurantes & Gastronomia',
      rating: 4.9,
      reviews: 128,
      location: 'Sorocaba, SP - Campolim',
      lat: -23.5329,
      lng: -47.4658,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      whatsapp: '5515999998888',
      tags: ['Delivery', 'Almoço Executivo', 'Ambiente Familiar'],
      featured: true,
    },
    {
      id: 2,
      name: 'Residencial Sênior Acolher',
      category: 'Casa de Repouso & Cuidado',
      rating: 5.0,
      reviews: 64,
      location: 'Sorocaba, SP - Santa Rosália',
      lat: -23.4892,
      lng: -47.4486,
      image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
      whatsapp: '5515988887777',
      tags: ['Enfermagem 24h', 'Fisioterapia', 'Nutrição Especializada'],
      featured: true,
    },
    {
      id: 3,
      name: 'Imobiliária Nova Era Prime',
      category: 'Imobiliárias & Arquitetura',
      rating: 4.8,
      reviews: 92,
      location: 'Sorocaba, SP - Parque Campolim',
      lat: -23.5368,
      lng: -47.4631,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
      whatsapp: '5515977776666',
      tags: ['Alto Padrão', 'Locação Ágil', 'Próximo ao Iguatemi'],
      featured: true,
    },
    {
      id: 4,
      name: 'Oficina Mecânica Precision Car',
      category: 'Oficinas & Automotivo',
      rating: 4.9,
      reviews: 210,
      location: 'Sorocaba, SP - Trujillo',
      lat: -23.4932,
      lng: -47.4632,
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
      whatsapp: '5515966665555',
      tags: ['Injeção Eletrônica', 'Revisão Geral', 'Garantia Estendida'],
      featured: false,
    },
    {
      id: 5,
      name: 'Clínica Odontológica Sorria Mais',
      category: 'Saúde & Estética',
      rating: 5.0,
      reviews: 175,
      location: 'Sorocaba, SP - Centro / Barão de Tatuí',
      lat: -23.5015,
      lng: -47.4581,
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      whatsapp: '5515955554444',
      tags: ['Implantes', 'Ortodontia', 'Atendimento de Urgência'],
      featured: true,
    },
    {
      id: 6,
      name: 'Escritório Contábil Confiável',
      category: 'Serviços Profissionais',
      rating: 4.9,
      reviews: 84,
      location: 'Votorantim, SP - Centro',
      lat: -23.5467,
      lng: -47.4378,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      whatsapp: '5515944443333',
      tags: ['Abertura de Empresa', 'BPO Financeiro', 'Imposto de Renda'],
      featured: false,
    },
  ];

  const handleUseBrowserGps = async () => {
    await refreshGpsWithSorocabaLock();
    setSortByProximity(true);
  };

  const handleSelectHub = (hub: SorocabaHubPoint) => {
    selectHub(hub);
    setSortByProximity(true);
  };

  const categories = ['Todos', 'Restaurantes & Gastronomia', 'Casa de Repouso & Cuidado', 'Imobiliárias & Arquitetura', 'Saúde & Estética'];

  const filteredBusinesses = useMemo(() => {
    const withDistance = businesses.map((b) => ({
      ...b,
      distanceKm: Math.max(0.2, calculateHaversineDistanceKm(userOrigin.lat, userOrigin.lng, b.lat, b.lng))
    }));

    const byCategory = selectedCategory === 'Todos'
      ? withDistance
      : withDistance.filter((b) => b.category === selectedCategory);

    if (sortByProximity) {
      return [...byCategory].sort((a, b) => a.distanceKm - b.distanceKm);
    }
    return byCategory;
  }, [selectedCategory, userOrigin.lat, userOrigin.lng, sortByProximity]);

  return (
    <section id="destaques" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FE3A18]/10 text-[#FE3A18] text-xs font-semibold mb-3">
              <Sparkles className="w-4 h-4 text-[#FE3A18]" />
              <span>Vitrine Sorocaba & Região • Proximidade Real</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Sugestões de Empresas Próximas em Sorocaba
            </h2>
            <p className="text-slate-600 mt-2 text-base">
              Ative sua localização automática para ordenar as sugestões pela distância real até você em Sorocaba, Votorantim e arredores.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`gp-lift-interactive px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#FE3A18] text-white shadow-md shadow-[#FE3A18]/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Automatic Geolocation Selector Bar for Featured Suggestions */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm mb-10 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Centralizar Sugestões por Proximidade:
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    {userOrigin.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {gpsFeedback || 'Use o GPS do navegador ou selecione seu bairro em Sorocaba e arredores para recalcular as distâncias.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleUseBrowserGps}
                disabled={isLocatingGps}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                {isLocatingGps ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LocateFixed className="w-4 h-4" />
                )}
                <span>{userOrigin.isGps ? 'GPS Sorocaba Ativo' : 'Localização Automática (GPS)'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Bairros / Cidades:</span>
            {SOROCABA_REGIONAL_HUBS.slice(0, 8).map((hub) => (
              <button
                key={hub.id}
                type="button"
                onClick={() => handleSelectHub(hub)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                  activeHubId === hub.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {hub.name} {hub.city !== 'Sorocaba' ? `(${hub.city})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Business Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBusinesses.map((biz, index) => (
            <BusinessCard
              key={biz.id}
              biz={biz}
              index={index}
              onContactWhatsApp={onContactWhatsApp}
              onOpenBusinessLanding={onOpenBusinessLanding}
            />
          ))}
        </div>

        {/* View All Businesses in Directory Button */}
        {onOpenDirectory && (
          <div className="mt-14 text-center">
            <button
              onClick={() => onOpenDirectory(selectedCategory !== 'Todos' ? selectedCategory : undefined)}
              className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-900 text-slate-900 hover:text-white border-2 border-slate-900 font-extrabold text-sm shadow-md hover:shadow-xl transition-all inline-flex items-center gap-3 group cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-[#FE3A18]" />
              <span>Ver Todas as Empresas no Diretório Completo</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                Filtro AJAX
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
