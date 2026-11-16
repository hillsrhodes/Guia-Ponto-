/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Utensils,
  HeartPulse,
  Home,
  Briefcase,
  ShoppingBag,
  Wrench,
  GraduationCap,
  Car,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Navigation,
  Stethoscope
} from 'lucide-react';

interface CategoryBentoGridProps {
  onSelectCategory: (categoryName: string, radiusKm?: number) => void;
}

const RADIUS_OPTIONS = [
  { value: 5, label: 'Até 5 km', sub: 'Sorocaba Urbano' },
  { value: 10, label: 'Até 10 km', sub: 'Sorocaba + Votorantim' },
  { value: 25, label: 'Até 25 km', sub: 'Araçoiaba, Itu e Região' },
  { value: 50, label: 'Até 50 km', sub: 'Toda Região (RMS)' },
];

export function CategoryBentoGrid({ onSelectCategory }: CategoryBentoGridProps) {
  const [selectedRadius, setSelectedRadius] = useState<number>(10);
  const [onlyVerifiedSorocaba, setOnlyVerifiedSorocaba] = useState<boolean>(true);

  const categories = [
    {
      name: 'Restaurantes & Gastronomia',
      localCount: 412,
      regionalCount: 185,
      icon: Utensils,
      color: 'from-[#FE3A18] to-rose-600',
      description: 'Grelhados, almoço executivo, padarias artesanais e delivery no WhatsApp.',
      badge: 'Mais Buscado',
      topNeighborhoods: ['Campolim', 'Santa Rosália', 'Além Ponte'],
      verifiedPercentage: '98%',
    },
    {
      name: 'Saúde & Estética',
      localCount: 380,
      regionalCount: 140,
      icon: Stethoscope,
      color: 'from-sky-500 to-indigo-600',
      description: 'Clínicas odontológicas, estética avançada, academias e hospitais veterinários 24h.',
      badge: 'Alta Procura',
      topNeighborhoods: ['Centro', 'Campolim', 'Wanel Ville'],
      verifiedPercentage: '99%',
    },
    {
      name: 'Casa de Repouso & Cuidado',
      localCount: 94,
      regionalCount: 48,
      icon: HeartPulse,
      color: 'from-rose-500 to-pink-600',
      description: 'Residenciais sênior, enfermagem 24h, fisioterapia e acolhimento humanizado.',
      badge: 'Especializado',
      topNeighborhoods: ['Santa Rosália', 'Mangal', 'Jardim Vergueiro'],
      verifiedPercentage: '100%',
    },
    {
      name: 'Imobiliárias & Arquitetura',
      localCount: 275,
      regionalCount: 110,
      icon: Home,
      color: 'from-orange-500 to-[#FE3A18]',
      description: 'Compra, venda e locação de alto padrão em condomínios de Sorocaba e Votorantim.',
      badge: 'Alto Padrão',
      topNeighborhoods: ['Campolim', 'Boa Vista', 'Votorantim'],
      verifiedPercentage: '96%',
    },
    {
      name: 'Oficinas & Automotivo',
      localCount: 310,
      regionalCount: 125,
      icon: Car,
      color: 'from-emerald-500 to-teal-600',
      description: 'Mecânica especializada, injeção eletrônica, baterias delivery e estética automotiva.',
      badge: 'Essencial',
      topNeighborhoods: ['Trujillo', 'Av. General Osório', 'Votorantim'],
      verifiedPercentage: '97%',
    },
    {
      name: 'Serviços Profissionais',
      localCount: 340,
      regionalCount: 95,
      icon: Briefcase,
      color: 'from-[#FE3A18] to-amber-600',
      description: 'Advocacia empresarial, contabilidade, coworkings e consultoria B2B regional.',
      badge: 'Corporativo',
      topNeighborhoods: ['Mangal', 'Centro', 'Campolim'],
      verifiedPercentage: '98%',
    },
    {
      name: 'Lojas & Comércio Local',
      localCount: 520,
      regionalCount: 210,
      icon: ShoppingBag,
      color: 'from-rose-600 to-purple-600',
      description: 'Moda, calçados, móveis planejados, presentes e variedades no comércio de Sorocaba.',
      badge: 'Comércio Forte',
      topNeighborhoods: ['Centro (Barão de Tatuí)', 'Campolim', 'Wanel Ville'],
      verifiedPercentage: '95%',
    },
    {
      name: 'Assistência & Manutenção',
      localCount: 245,
      regionalCount: 88,
      icon: Wrench,
      color: 'from-amber-500 to-[#FE3A18]',
      description: 'Climatização de ar-condicionado, eletricistas, energia solar e reparos residenciais.',
      badge: 'Atendimento Rápido',
      topNeighborhoods: ['Além Ponte', 'Cerrado', 'Vila Hortência'],
      verifiedPercentage: '96%',
    },
  ];

  return (
    <section id="categorias" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FE3A18]/10 text-[#FE3A18] text-xs font-bold border border-[#FE3A18]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#FE3A18]" />
              <span>Prioridade Regional Ativa • DDD (15)</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Selo Verificado Sorocaba</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Explore Categorias em Sorocaba e Região
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Nossa busca prioriza automaticamente empresas locais verificadas em <strong className="text-slate-900">Sorocaba, Votorantim e Região Metropolitana</strong>, garantindo atendimento rápido pelo WhatsApp.
          </p>
        </div>

        {/* Regional Priority & Radius Control Bar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-md mb-12 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Raio de Alcance da Busca Regional
                </h3>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Centro Base: Sorocaba, SP
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Selecione a distância máxima para filtrar empresas cadastradas ao clicar em qualquer categoria abaixo:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full lg:w-auto">
            {RADIUS_OPTIONS.map((opt) => {
              const isSelected = selectedRadius === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedRadius(opt.value)}
                  className={`px-3.5 py-2.5 rounded-2xl text-left transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/15 scale-[1.02]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="text-xs font-black flex items-center gap-1.5">
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FE3A18]' : 'text-slate-400'}`} />
                    <span>{opt.label}</span>
                  </div>
                  <div className={`text-[10px] font-medium ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                    {opt.sub}
                  </div>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setOnlyVerifiedSorocaba(!onlyVerifiedSorocaba)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                onlyVerifiedSorocaba
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
              title="Priorizar empresas com selo Verificado Sorocaba"
            >
              <ShieldCheck className={`w-4 h-4 ${onlyVerifiedSorocaba ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>Priorizar Verificado Sorocaba</span>
            </button>
          </div>
        </div>

        {/* Uniform Grid Model (4 columns on desktop, 2 on tablet, 1 on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            const displayedCount = selectedRadius <= 5
              ? `${cat.localCount} em Sorocaba`
              : `${cat.localCount + cat.regionalCount} em Sorocaba & Região`;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => onSelectCategory(cat.name, selectedRadius)}
                className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-[#FE3A18]/50 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden h-full"
              >
                {/* Spotlight background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FE3A18]/5 via-rose-500/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Verificado Sorocaba
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-[#FE3A18] group-hover:text-white transition-colors">
                        {cat.badge}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#FE3A18] transition-colors mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  {/* Local Sorocaba Neighborhoods Pills */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FE3A18]" />
                      Destaques em Sorocaba:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {cat.topNeighborhoods.map((nh, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                        >
                          {nh}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black tracking-wide text-[#FE3A18] block">
                      {displayedCount}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Raio selecionado: até {selectedRadius} km
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#FE3A18] text-slate-700 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
