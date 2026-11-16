import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Flame,
  TrendingUp,
  Target,
  Sliders,
  Zap,
  Check,
  ArrowUpRight,
  Compass,
  Clock,
  Users,
  MousePointerClick,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { calculateHaversineDistanceKm } from '../../utils/sorocabaGeolocation';

export type HeatmapMetricMode = 'activity' | 'clicks' | 'whatsapp_leads' | 'coverage_gap';
export type HeatmapTimeWindow = 'all_day' | 'lunch_peak' | 'afternoon' | 'night_peak';

export interface SorocabaNeighborhoodHeatNode {
  id: string;
  name: string;
  zone: 'Zona Sul' | 'Centro' | 'Zona Leste' | 'Zona Oeste' | 'Zona Norte' | 'Zona Industrial' | 'RM Sorocaba';
  lat: number;
  lng: number;
  // Normalized SVG canvas coordinates (0-1000 width, 0-620 height)
  mapX: number;
  mapY: number;
  monthlySearches: number;
  adClicks: number;
  whatsappLeads: number;
  growthYoY: string;
  trafficScore: number; // 0-100 regional user activity intensity
  initialPresenceScore: number; // 0-100 merchant's current presence in this neighborhood
  topPeakWindow: HeatmapTimeWindow;
  keyCorridor: string;
  insightNote: string;
  timeMultipliers: Record<HeatmapTimeWindow, number>;
}

export const SOROCABA_HEATMAP_NODES: SorocabaNeighborhoodHeatNode[] = [
  {
    id: 'campolim',
    name: 'Parque Campolim',
    zone: 'Zona Sul',
    lat: -23.5329,
    lng: -47.4658,
    mapX: 465,
    mapY: 435,
    monthlySearches: 19400,
    adClicks: 1420,
    whatsappLeads: 318,
    growthYoY: '+44%',
    trafficScore: 98,
    initialPresenceScore: 92,
    topPeakWindow: 'lunch_peak',
    keyCorridor: 'Av. Antônio Carlos Comitre & Shopping Iguatemi',
    insightNote: 'Maior densidade de poder aquisitivo e buscas por gastronomia, clínicas e serviços premium.',
    timeMultipliers: { all_day: 1, lunch_peak: 1.15, afternoon: 0.92, night_peak: 1.12 }
  },
  {
    id: 'centro',
    name: 'Centro Histórico',
    zone: 'Centro',
    lat: -23.5015,
    lng: -47.4526,
    mapX: 525,
    mapY: 285,
    monthlySearches: 16800,
    adClicks: 1190,
    whatsappLeads: 264,
    growthYoY: '+29%',
    trafficScore: 94,
    initialPresenceScore: 84,
    topPeakWindow: 'afternoon',
    keyCorridor: 'Praça Cel. Fernando Prestes & Av. Dom Aguirre',
    insightNote: 'Fluxo intenso de pedestres e escritórios entre 09h e 17h30 com alta conversão no WhatsApp.',
    timeMultipliers: { all_day: 1, lunch_peak: 1.08, afternoon: 1.18, night_peak: 0.65 }
  },
  {
    id: 'santa-rosalia',
    name: 'Santa Rosália',
    zone: 'Zona Leste',
    lat: -23.4892,
    lng: -47.4418,
    mapX: 615,
    mapY: 225,
    monthlySearches: 13200,
    adClicks: 890,
    whatsappLeads: 195,
    growthYoY: '+36%',
    trafficScore: 89,
    initialPresenceScore: 54,
    topPeakWindow: 'lunch_peak',
    keyCorridor: 'Av. Pereira da Silva & Polo Médico-Esportivo',
    insightNote: 'Alto tráfego de famílias e profissionais de saúde; sua presença local ainda pode dobrar aqui.',
    timeMultipliers: { all_day: 1, lunch_peak: 1.1, afternoon: 1.04, night_peak: 0.95 }
  },
  {
    id: 'wanel-ville',
    name: 'Wanel Ville & Júlio de Mesquita',
    zone: 'Zona Oeste',
    lat: -23.4945,
    lng: -47.5092,
    mapX: 235,
    mapY: 255,
    monthlySearches: 14900,
    adClicks: 740,
    whatsappLeads: 162,
    growthYoY: '+51%',
    trafficScore: 91,
    initialPresenceScore: 38,
    topPeakWindow: 'night_peak',
    keyCorridor: 'Av. Paulo Emanuel de Almeida',
    insightNote: 'Bairro em explosão comercial na Zona Oeste! Alta atividade de usuários, mas baixa cobertura atual dos seus anúncios.',
    timeMultipliers: { all_day: 1, lunch_peak: 0.95, afternoon: 0.98, night_peak: 1.22 }
  },
  {
    id: 'jd-faculdade',
    name: 'Jardim Faculdade & Vergueiro',
    zone: 'Zona Sul',
    lat: -23.5168,
    lng: -47.4582,
    mapX: 495,
    mapY: 358,
    monthlySearches: 11600,
    adClicks: 860,
    whatsappLeads: 204,
    growthYoY: '+33%',
    trafficScore: 86,
    initialPresenceScore: 88,
    topPeakWindow: 'lunch_peak',
    keyCorridor: 'Av. Barão de Tatuí & Corredor Hospitalar',
    insightNote: 'Forte conexão com o Campolim; público universitário, médico e executivo com resposta rápida.',
    timeMultipliers: { all_day: 1, lunch_peak: 1.12, afternoon: 1.05, night_peak: 1.02 }
  },
  {
    id: 'trujillo',
    name: 'Trujillo & Av. Gen. Osório',
    zone: 'Zona Norte',
    lat: -23.4881,
    lng: -47.4662,
    mapX: 455,
    mapY: 205,
    monthlySearches: 9800,
    adClicks: 620,
    whatsappLeads: 141,
    growthYoY: '+27%',
    trafficScore: 79,
    initialPresenceScore: 68,
    topPeakWindow: 'afternoon',
    keyCorridor: 'Av. General Osório & Av. Américo Figueiredo',
    insightNote: 'Excelente tração para serviços automotivos, saúde e varejo tradicional.',
    timeMultipliers: { all_day: 1, lunch_peak: 0.96, afternoon: 1.14, night_peak: 0.82 }
  },
  {
    id: 'mangal',
    name: 'Mangal & General Carneiro',
    zone: 'Zona Oeste',
    lat: -23.5112,
    lng: -47.4685,
    mapX: 410,
    mapY: 325,
    monthlySearches: 10900,
    adClicks: 795,
    whatsappLeads: 178,
    growthYoY: '+31%',
    trafficScore: 83,
    initialPresenceScore: 79,
    topPeakWindow: 'afternoon',
    keyCorridor: 'Av. General Carneiro',
    insightNote: 'Corredor consolidado de clínicas, escritórios jurídicos e alimentação executiva.',
    timeMultipliers: { all_day: 1, lunch_peak: 1.05, afternoon: 1.1, night_peak: 0.88 }
  },
  {
    id: 'alem-ponte',
    name: 'Além Ponte & Av. São Paulo',
    zone: 'Zona Leste',
    lat: -23.5062,
    lng: -47.4331,
    mapX: 685,
    mapY: 305,
    monthlySearches: 11400,
    adClicks: 610,
    whatsappLeads: 134,
    growthYoY: '+38%',
    trafficScore: 84,
    initialPresenceScore: 44,
    topPeakWindow: 'afternoon',
    keyCorridor: 'Av. São Paulo & Nogueira Padilha',
    insightNote: 'Eixo Leste com mais de 11 mil buscas mensais; ativar destaque local aqui captura demanda reprimida.',
    timeMultipliers: { all_day: 1, lunch_peak: 1.02, afternoon: 1.09, night_peak: 0.94 }
  },
  {
    id: 'ipanema-norte',
    name: 'Eixo Av. Ipanema & Cidade Norte',
    zone: 'Zona Norte',
    lat: -23.4585,
    lng: -47.4785,
    mapX: 395,
    mapY: 110,
    monthlySearches: 15600,
    adClicks: 690,
    whatsappLeads: 148,
    growthYoY: '+47%',
    trafficScore: 88,
    initialPresenceScore: 34,
    topPeakWindow: 'night_peak',
    keyCorridor: 'Av. Ipanema & Shopping Cidade Sorocaba',
    insightNote: 'Alta densidade populacional e crescimento acelerado (+47%); grande oportunidade de expansão.',
    timeMultipliers: { all_day: 1, lunch_peak: 0.98, afternoon: 1.06, night_peak: 1.18 }
  },
  {
    id: 'eden-industrial',
    name: 'Éden & Zona Industrial',
    zone: 'Zona Industrial',
    lat: -23.4215,
    lng: -47.4152,
    mapX: 795,
    mapY: 105,
    monthlySearches: 8900,
    adClicks: 430,
    whatsappLeads: 96,
    growthYoY: '+41%',
    trafficScore: 76,
    initialPresenceScore: 31,
    topPeakWindow: 'lunch_peak',
    keyCorridor: 'Rod. Castelinho (SP-075) & Polo Industrial',
    insightNote: 'Demanda corporativa B2B, refeições coletivas, manutenção e serviços no horário de almoço.',
    timeMultipliers: { all_day: 1, lunch_peak: 1.24, afternoon: 1.02, night_peak: 0.62 }
  },
  {
    id: 'votorantim',
    name: 'Votorantim (Av. 31 de Março)',
    zone: 'RM Sorocaba',
    lat: -23.5446,
    lng: -47.4388,
    mapX: 590,
    mapY: 515,
    monthlySearches: 12300,
    adClicks: 780,
    whatsappLeads: 172,
    growthYoY: '+39%',
    trafficScore: 85,
    initialPresenceScore: 62,
    topPeakWindow: 'night_peak',
    keyCorridor: 'Av. 31 de Março & Divisa Campolim',
    insightNote: 'Conurbado ao Parque Campolim (apenas 2,8 km); clientes cruzam a divisa diariamente para consumir.',
    timeMultipliers: { all_day: 1, lunch_peak: 1.04, afternoon: 1.0, night_peak: 1.15 }
  }
];

interface SorocabaGrowthHeatmapProps {
  businessName: string;
  baseNeighborhood?: string;
  onAwardXp?: (points: number, reason: string) => void;
}

export function SorocabaGrowthHeatmap({
  businessName,
  baseNeighborhood = 'Campolim',
  onAwardXp
}: SorocabaGrowthHeatmapProps) {
  const [metricMode, setMetricMode] = useState<HeatmapMetricMode>('activity');
  const [timeWindow, setTimeWindow] = useState<HeatmapTimeWindow>('all_day');
  const [coverageRadiusKm, setCoverageRadiusKm] = useState<number>(6.5);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('wanel-ville');
  const [boostedNeighborhoods, setBoostedNeighborhoods] = useState<Record<string, boolean>>({
    campolim: true,
    centro: true,
    'jd-faculdade': true
  });
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  // Base HQ node (defaults to Campolim)
  const baseHub = useMemo(() => {
    return (
      SOROCABA_HEATMAP_NODES.find((n) =>
        n.name.toLowerCase().includes(baseNeighborhood.toLowerCase())
      ) || SOROCABA_HEATMAP_NODES[0]
    );
  }, [baseNeighborhood]);

  // Compute dynamic metrics for each neighborhood based on timeWindow, coverageRadiusKm, and active boosts
  const enrichedNodes = useMemo(() => {
    return SOROCABA_HEATMAP_NODES.map((node) => {
      const distFromHqKm =
        node.id === baseHub.id
          ? 0.4
          : calculateHaversineDistanceKm(baseHub.lat, baseHub.lng, node.lat, node.lng);

      const isWithinRadius = distFromHqKm <= coverageRadiusKm;
      const isBoosted = Boolean(boostedNeighborhoods[node.id]);
      const multiplier = node.timeMultipliers[timeWindow] || 1;

      const effectiveTraffic = Math.min(100, Math.round(node.trafficScore * multiplier));
      const effectivePresence = Math.min(
        100,
        Math.round(
          node.initialPresenceScore +
            (isBoosted ? 28 : 0) +
            (isWithinRadius ? 8 : -10)
        )
      );

      // Opportunity gap = high user traffic minus current local presence
      const coverageGap = Math.max(0, effectiveTraffic - effectivePresence);

      let statusCategory: 'Dominante' | 'Oportunidade Crítica' | 'Alcance Estável' =
        'Alcance Estável';
      if (effectivePresence >= 78) {
        statusCategory = 'Dominante';
      } else if (effectiveTraffic >= 80 && effectivePresence < 65) {
        statusCategory = 'Oportunidade Crítica';
      }

      return {
        ...node,
        distFromHqKm,
        isWithinRadius,
        isBoosted,
        effectiveTraffic,
        effectivePresence,
        coverageGap,
        statusCategory,
        adjustedSearches: Math.round(node.monthlySearches * multiplier),
        adjustedClicks: Math.round(
          node.adClicks * multiplier * (isBoosted ? 1.24 : 1)
        ),
        adjustedLeads: Math.round(
          node.whatsappLeads * multiplier * (isBoosted ? 1.28 : 1)
        )
      };
    });
  }, [baseHub, coverageRadiusKm, boostedNeighborhoods, timeWindow]);

  const selectedNode = useMemo(() => {
    return (
      enrichedNodes.find((n) => n.id === selectedNodeId) || enrichedNodes[0]
    );
  }, [enrichedNodes, selectedNodeId]);

  // Aggregate KPIs across Sorocaba
  const summaryStats = useMemo(() => {
    const totalRegionalSearches = enrichedNodes.reduce(
      (acc, n) => acc + n.adjustedSearches,
      0
    );
    const highTrafficNodes = enrichedNodes.filter((n) => n.effectiveTraffic >= 80);
    const reachedHighTrafficNodes = highTrafficNodes.filter(
      (n) => n.effectivePresence >= 70 || n.isBoosted
    );
    const highTrafficCoveragePct = Math.round(
      (reachedHighTrafficNodes.length / Math.max(1, highTrafficNodes.length)) * 100
    );
    const criticalGapNodes = enrichedNodes.filter(
      (n) => n.statusCategory === 'Oportunidade Crítica'
    );

    return {
      totalRegionalSearches,
      highTrafficCoveragePct,
      reachedCount: reachedHighTrafficNodes.length,
      totalHighTrafficCount: highTrafficNodes.length,
      criticalGapCount: criticalGapNodes.length
    };
  }, [enrichedNodes]);

  const handleToggleNeighborhoodBoost = (nodeId: string, nodeName: string) => {
    const willBoost = !boostedNeighborhoods[nodeId];
    setBoostedNeighborhoods((prev) => ({
      ...prev,
      [nodeId]: willBoost
    }));

    if (willBoost) {
      setFeedbackBanner(
        `Alcance geográfico expandido para ${nodeName}! Presença local aumentada em +28% nos resultados de busca desse bairro.`
      );
      if (onAwardXp) {
        onAwardXp(85, `Ativou Boost de Alcance no Mapa de Calor: ${nodeName}`);
      }
    } else {
      setFeedbackBanner(`Boost geográfico pausado em ${nodeName}.`);
    }

    setTimeout(() => setFeedbackBanner(null), 4500);
  };

  // Convert coverageRadiusKm into SVG pixel radius around baseHub (approx 36px per km on 1000x620 canvas)
  const svgRadiusPx = Math.min(440, Math.max(95, coverageRadiusKm * 36));

  return (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Top Header & Regional Penetration Summary */}
      <div className="p-6 sm:p-8 border-b border-slate-800 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-400">
              <Flame className="w-4 h-4 text-[#FE3A18]" />
              <span>SOROCABA GROWTH HEATMAP · GEOMETRIA DE TRÁFEGO LOCAL</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400 font-mono">
                BASE: {baseHub.name.toUpperCase()} (-23.5329, -47.4658)
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Mapa de Calor de Atividade & Alcance por Bairros de Sorocaba
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Visualize de onde vem a maior atividade de consumidores na região e identifique se a presença digital de{' '}
              <strong className="text-white">{businessName}</strong> está alcançando os bairros de maior tráfego ou deixando demanda reprimida para concorrentes.
            </p>
          </div>

          {/* Regional Penetration Score Box */}
          <div className="grid grid-cols-2 gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shrink-0">
            <div className="pr-4 border-r border-slate-800">
              <span className="text-[11px] text-slate-400 block">
                Cobertura em Polos de Pico
              </span>
              <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums mt-0.5">
                {summaryStats.highTrafficCoveragePct}%
              </div>
              <span className="text-[11px] text-slate-400 block">
                {summaryStats.reachedCount} de {summaryStats.totalHighTrafficCount} polos cobertos
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">
                Bairros com Gap Crítico
              </span>
              <div className="text-2xl font-black text-amber-400 font-mono tabular-nums mt-0.5">
                {summaryStats.criticalGapCount} {summaryStats.criticalGapCount === 1 ? 'bairro' : 'bairros'}
              </div>
              <span className="text-[11px] text-[#FE3A18] font-semibold block">
                Alto tráfego / baixa presença
              </span>
            </div>
          </div>
        </div>

        {/* Controls Bar: Metric Mode + Time Window + Coverage Radius Slider */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 pt-2">
          {/* Metric Selector */}
          <div className="xl:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block">
              Camada de Calor Exibida no Mapa:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'activity', label: 'Atividade Total' },
                { id: 'clicks', label: 'Cliques Anúncio' },
                { id: 'whatsapp_leads', label: 'Leads WhatsApp' },
                { id: 'coverage_gap', label: 'Gap de Alcance' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMetricMode(m.id as HeatmapMetricMode)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    metricMode === m.id
                      ? 'bg-[#FE3A18] text-white shadow-sm'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time of Day Window Selector */}
          <div className="xl:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Janela de Horário em Sorocaba:</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'all_day', label: '24h Geral' },
                { id: 'lunch_peak', label: '11h–14h Pico' },
                { id: 'afternoon', label: '14h–18h Com.' },
                { id: 'night_peak', label: '18h–23h Noite' }
              ].map((tw) => (
                <button
                  key={tw.id}
                  type="button"
                  onClick={() => setTimeWindow(tw.id as HeatmapTimeWindow)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    timeWindow === tw.id
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  {tw.label}
                </button>
              ))}
            </div>
          </div>

          {/* Coverage Radius Slider */}
          <div className="xl:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold">Raio de Alcance Ativo:</span>
              <span className="font-mono font-black text-emerald-400 tabular-nums">
                {coverageRadiusKm.toFixed(1)} km
              </span>
            </div>
            <input
              type="range"
              min="2.5"
              max="15"
              step="0.5"
              value={coverageRadiusKm}
              onChange={(e) => setCoverageRadiusKm(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>2.5 km (Bairro)</span>
              <span>8 km (Urbano)</span>
              <span>15 km (RM)</span>
            </div>
          </div>
        </div>

        {/* Action Feedback Banner */}
        <AnimatePresence>
          {feedbackBanner && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{feedbackBanner}</span>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackBanner(null)}
                className="text-xs text-emerald-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Split Body: Left Interactive Heatmap Canvas (7 cols) + Right Neighborhood Diagnostic Inspector (5 cols) */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* LEFT COLUMN: Cartographic Sorocaba Heatmap Canvas */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden relative min-h-[480px]">
          {/* Top Map Overlay Bar */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 relative z-20">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Compass className="w-4 h-4 text-[#FE3A18]" />
              <span>Malha Urbana de Sorocaba & Votorantim</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-mono tabular-nums">
                {summaryStats.totalRegionalSearches.toLocaleString('pt-BR')} buscas/mês
              </span>
            </div>

            {/* Thermal Legend */}
            <div className="flex items-center gap-3 text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FE3A18]" />
                <span>Pico Intenso (85%+)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Tráfego Alto</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full border border-emerald-400 bg-emerald-400/20" />
                <span>Seu Raio ({coverageRadiusKm.toFixed(1)} km)</span>
              </span>
            </div>
          </div>

          {/* Interactive SVG Heatmap Viewport */}
          <div className="relative flex-1 w-full flex items-center justify-center bg-slate-950 overflow-hidden">
            <svg
              viewBox="0 0 1000 620"
              className="w-full h-full max-h-[520px] select-none"
            >
              <defs>
                {/* Radial Thermal Gradients */}
                <radialGradient id="heat-intense" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FE3A18" stopOpacity="0.72" />
                  <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#FE3A18" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heat-medium" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heat-gap" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.78" />
                  <stop offset="55%" stopColor="#FB923C" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
                </radialGradient>
                <pattern
                  id="sorocaba-grid"
                  width="50"
                  height="50"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 50 0 L 0 0 0 50"
                    fill="none"
                    stroke="rgba(148, 163, 184, 0.08)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>

              {/* Cartographic Coordinate Grid Background */}
              <rect width="1000" height="620" fill="url(#sorocaba-grid)" />

              {/* Stylized Sorocaba Municipal Perimeter Polygon */}
              <path
                d="M 140,180 L 310,65 L 670,55 L 890,110 L 860,360 L 720,565 L 410,580 L 180,460 Z"
                fill="rgba(15, 23, 42, 0.75)"
                stroke="rgba(100, 116, 139, 0.35)"
                strokeWidth="2"
                strokeDasharray="8 6"
              />

              {/* Major Sorocaba Arterial Highways & Rio Sorocaba */}
              {/* Rio Sorocaba & Av. Dom Aguirre */}
              <path
                d="M 480,580 C 505,450 535,340 555,250 C 575,165 660,110 740,55"
                fill="none"
                stroke="rgba(56, 189, 248, 0.25)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Rod. Raposo Tavares (SP-270) */}
              <path
                d="M 80,470 C 280,455 460,440 650,410 C 790,385 880,340 950,295"
                fill="none"
                stroke="rgba(148, 163, 184, 0.28)"
                strokeWidth="3.5"
              />
              {/* Rod. Sen. José Ermírio de Moraes (Castelinho SP-075) */}
              <path
                d="M 535,280 L 850,80"
                fill="none"
                stroke="rgba(148, 163, 184, 0.24)"
                strokeWidth="3"
              />
              {/* Eixo Av. Ipanema -> Centro -> Campolim */}
              <path
                d="M 395,90 L 525,285 L 465,435 L 590,525"
                fill="none"
                stroke="rgba(148, 163, 184, 0.22)"
                strokeWidth="2.5"
              />
              {/* Eixo Oeste Wanel Ville -> Mangal -> Centro -> Além Ponte */}
              <path
                d="M 210,250 L 410,325 L 525,285 L 700,305"
                fill="none"
                stroke="rgba(148, 163, 184, 0.22)"
                strokeWidth="2.5"
              />

              {/* Highway Labels */}
              <text x="160" y="445" fill="rgba(148,163,184,0.55)" fontSize="11" fontWeight="700">
                ROD. RAPOSO TAVARES (SP-270)
              </text>
              <text x="695" y="165" fill="rgba(148,163,184,0.55)" fontSize="11" fontWeight="700">
                CASTELINHO (SP-075)
              </text>
              <text x="555" y="385" fill="rgba(56,189,248,0.55)" fontSize="10" fontWeight="700">
                RIO SOROCABA / DOM AGUIRRE
              </text>

              {/* Merchant Local Presence Coverage Radius Circle */}
              <circle
                cx={baseHub.mapX}
                cy={baseHub.mapY}
                r={svgRadiusPx}
                fill="rgba(16, 185, 129, 0.07)"
                stroke="#10B981"
                strokeWidth="2"
                strokeDasharray="6 6"
              />

              {/* Thermal Heat Blobs Layer */}
              {enrichedNodes.map((node) => {
                const rawScore =
                  metricMode === 'coverage_gap'
                    ? node.coverageGap + 25
                    : node.effectiveTraffic;
                const heatRadius = Math.max(55, Math.round(rawScore * 1.15));
                const gradId =
                  metricMode === 'coverage_gap'
                    ? 'url(#heat-gap)'
                    : rawScore >= 85
                    ? 'url(#heat-intense)'
                    : 'url(#heat-medium)';

                return (
                  <circle
                    key={`heat-${node.id}`}
                    cx={node.mapX}
                    cy={node.mapY}
                    r={heatRadius}
                    fill={gradId}
                    className="pointer-events-none transition-all duration-300"
                  />
                );
              })}

              {/* Connection Lines from Merchant Base HQ to Boosted / Reached Neighborhoods */}
              {enrichedNodes.map((node) => {
                if (node.id === baseHub.id) return null;
                const isReached = node.isWithinRadius || node.isBoosted;
                return (
                  <line
                    key={`link-${node.id}`}
                    x1={baseHub.mapX}
                    y1={baseHub.mapY}
                    x2={node.mapX}
                    y2={node.mapY}
                    stroke={
                      node.isBoosted
                        ? '#10B981'
                        : isReached
                        ? 'rgba(251, 191, 36, 0.35)'
                        : 'rgba(244, 63, 94, 0.25)'
                    }
                    strokeWidth={node.id === selectedNode.id ? '2.5' : '1.5'}
                    strokeDasharray={node.isBoosted ? undefined : '4 4'}
                  />
                );
              })}

              {/* Interactive Neighborhood Nodes */}
              {enrichedNodes.map((node) => {
                const isSelected = node.id === selectedNode.id;
                const isCriticalGap = node.statusCategory === 'Oportunidade Crítica';

                const metricBadgeText =
                  metricMode === 'activity'
                    ? `${node.effectiveTraffic}% ativ.`
                    : metricMode === 'clicks'
                    ? `${node.adjustedClicks} cliques`
                    : metricMode === 'whatsapp_leads'
                    ? `${node.adjustedLeads} leads`
                    : `Gap -${node.coverageGap}%`;

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="cursor-pointer group"
                  >
                    {/* Outer Selection / Critical Ring */}
                    <circle
                      cx={node.mapX}
                      cy={node.mapY}
                      r={isSelected ? 22 : 16}
                      fill={
                        isSelected
                          ? 'rgba(254, 58, 24, 0.35)'
                          : isCriticalGap
                          ? 'rgba(245, 158, 11, 0.22)'
                          : 'rgba(15, 23, 42, 0.6)'
                      }
                      stroke={
                        isSelected
                          ? '#FFFFFF'
                          : node.isBoosted
                          ? '#10B981'
                          : isCriticalGap
                          ? '#F59E0B'
                          : '#FE3A18'
                      }
                      strokeWidth={isSelected ? '3' : '2'}
                    />

                    {/* Core Node Pin */}
                    <circle
                      cx={node.mapX}
                      cy={node.mapY}
                      r={isSelected ? 9 : 7}
                      fill={
                        node.isBoosted
                          ? '#10B981'
                          : isCriticalGap
                          ? '#F59E0B'
                          : '#FE3A18'
                      }
                    />

                    {/* Neighborhood Label Box */}
                    <g transform={`translate(${node.mapX}, ${node.mapY - 28})`}>
                      <rect
                        x="-78"
                        y="-22"
                        width="156"
                        height="36"
                        rx="8"
                        fill={isSelected ? '#0F172A' : 'rgba(15, 23, 42, 0.92)'}
                        stroke={
                          isSelected
                            ? '#FE3A18'
                            : node.isBoosted
                            ? 'rgba(16, 185, 129, 0.6)'
                            : 'rgba(148, 163, 184, 0.3)'
                        }
                        strokeWidth={isSelected ? '2' : '1'}
                      />
                      <text
                        x="0"
                        y="-7"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="10.5"
                        fontWeight="800"
                      >
                        {node.name.split(' & ')[0]}
                      </text>
                      <text
                        x="0"
                        y="7"
                        textAnchor="middle"
                        fill={
                          node.isBoosted
                            ? '#34D399'
                            : isCriticalGap
                            ? '#FBBF24'
                            : '#FCA5A5'
                        }
                        fontSize="9.5"
                        fontWeight="700"
                      >
                        {metricBadgeText} · Presença {node.effectivePresence}%
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Map Bar: Quick Insight */}
          <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-slate-400">
              Clique em qualquer bairro do mapa para diagnosticar seu alcance e ativar campanhas locais.
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              Bairros com Boost Ativo: {Object.values(boostedNeighborhoods).filter(Boolean).length}
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Selected Neighborhood Diagnostic & Reach Optimizer */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          {/* Active Neighborhood Diagnostic Card */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <span>{selectedNode.zone.toUpperCase()}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedNode.distFromHqKm} km da sua base</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400">{selectedNode.growthYoY} YoY</span>
                </div>
                <h4 className="text-xl font-black text-white mt-1">
                  {selectedNode.name}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Eixo Principal: {selectedNode.keyCorridor}
                </p>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-xl shrink-0 ${
                  selectedNode.statusCategory === 'Dominante'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : selectedNode.statusCategory === 'Oportunidade Crítica'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {selectedNode.statusCategory}
              </span>
            </div>

            {/* Dual Comparison Bars: Regional User Activity vs Your Local Presence */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">
                     Intensidade de Atividade de Usuários no Bairro
                  </span>
                  <span className="font-mono font-black text-[#FE3A18] tabular-nums">
                    {selectedNode.effectiveTraffic} / 100
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-[#FE3A18] rounded-full transition-all duration-300"
                    style={{ width: `${selectedNode.effectiveTraffic}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">
                    Sua Presença & Alcance Atual em {selectedNode.name.split(' & ')[0]}
                  </span>
                  <span className="font-mono font-black text-emerald-400 tabular-nums">
                    {selectedNode.effectivePresence}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${selectedNode.effectivePresence}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 3 Neighborhood Telemetry Boxes */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="bg-slate-950 rounded-2xl p-3.5 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Buscas / Mês</span>
                <div className="text-base sm:text-lg font-black text-white font-mono tabular-nums mt-0.5">
                  {selectedNode.adjustedSearches.toLocaleString('pt-BR')}
                </div>
              </div>
              <div className="bg-slate-950 rounded-2xl p-3.5 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Cliques Estimados</span>
                <div className="text-base sm:text-lg font-black text-amber-400 font-mono tabular-nums mt-0.5">
                  {selectedNode.adjustedClicks.toLocaleString('pt-BR')}
                </div>
              </div>
              <div className="bg-slate-950 rounded-2xl p-3.5 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Leads WhatsApp</span>
                <div className="text-base sm:text-lg font-black text-emerald-400 font-mono tabular-nums mt-0.5">
                  {selectedNode.adjustedLeads.toLocaleString('pt-BR')}
                </div>
              </div>
            </div>

            {/* AI Geolocation Recommendation Note */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-400">
                Diagnóstico de Alcance Local:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedNode.insightNote}
              </p>
            </div>

            {/* 1-Click Neighborhood Boost Button */}
            <button
              type="button"
              onClick={() =>
                handleToggleNeighborhoodBoost(selectedNode.id, selectedNode.name)
              }
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedNode.isBoosted
                  ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-[#FE3A18] hover:bg-[#e33315] text-white shadow-lg shadow-[#FE3A18]/25'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>
                {selectedNode.isBoosted
                  ? `Boost Geográfico Ativo em ${selectedNode.name.split(' & ')[0]} (+28% Alcance)`
                  : `Expandir Presença para ${selectedNode.name.split(' & ')[0]} (+85 XP)`}
              </span>
            </button>
          </div>

          {/* Ranked High-Traffic Neighborhoods List */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-300">
                Ranking de Bairros por Atividade vs. Sua Cobertura
              </h5>
              <span className="text-[11px] text-slate-400">Clique para inspecionar</span>
            </div>

            <div className="space-y-2 max-h-[225px] overflow-y-auto pr-1">
              {enrichedNodes
                .slice()
                .sort((a, b) => b.effectiveTraffic - a.effectiveTraffic)
                .map((node) => {
                  const isSelected = node.id === selectedNode.id;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-slate-950 border-[#FE3A18] shadow-md'
                          : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800/80'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white truncate">
                            {node.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            · {node.distFromHqKm} km
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Atividade: <strong className="text-amber-400 font-mono">{node.effectiveTraffic}%</strong> · Sua Presença:{' '}
                          <strong
                            className={`font-mono ${
                              node.effectivePresence >= 75
                                ? 'text-emerald-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {node.effectivePresence}%
                          </strong>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 ${
                          node.isBoosted
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : node.statusCategory === 'Oportunidade Crítica'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {node.isBoosted ? 'Ativo ✓' : node.statusCategory}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
