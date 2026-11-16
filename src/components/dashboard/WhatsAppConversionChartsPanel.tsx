import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  Eye,
  MousePointerClick,
  MessageSquare,
  TrendingUp,
  BarChart3,
  Filter,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export type AnalyticsTimeframe = '7d' | '30d' | '6m';

interface TimeSeriesPoint {
  period: string;
  profileViews: number;
  adClicks: number;
  whatsappLeads: number;
  whatsappConversionRate: number; // % of adClicks that became WhatsApp leads
  profileToClickRate: number; // % of profileViews that clicked an ad
}

const DATA_BY_TIMEFRAME: Record<AnalyticsTimeframe, TimeSeriesPoint[]> = {
  '7d': [
    {
      period: 'Seg',
      profileViews: 620,
      adClicks: 120,
      whatsappLeads: 18,
      whatsappConversionRate: 15.0,
      profileToClickRate: 19.4
    },
    {
      period: 'Ter',
      profileViews: 890,
      adClicks: 210,
      whatsappLeads: 33,
      whatsappConversionRate: 15.7,
      profileToClickRate: 23.6
    },
    {
      period: 'Qua',
      profileViews: 780,
      adClicks: 180,
      whatsappLeads: 29,
      whatsappConversionRate: 16.1,
      profileToClickRate: 23.1
    },
    {
      period: 'Qui',
      profileViews: 1150,
      adClicks: 290,
      whatsappLeads: 49,
      whatsappConversionRate: 16.9,
      profileToClickRate: 25.2
    },
    {
      period: 'Sex',
      profileViews: 1420,
      adClicks: 340,
      whatsappLeads: 62,
      whatsappConversionRate: 18.2,
      profileToClickRate: 23.9
    },
    {
      period: 'Sáb',
      profileViews: 1610,
      adClicks: 380,
      whatsappLeads: 74,
      whatsappConversionRate: 19.5,
      profileToClickRate: 23.6
    },
    {
      period: 'Dom',
      profileViews: 1090,
      adClicks: 250,
      whatsappLeads: 44,
      whatsappConversionRate: 17.6,
      profileToClickRate: 22.9
    }
  ],
  '30d': [
    {
      period: 'Semana 1',
      profileViews: 3850,
      adClicks: 790,
      whatsappLeads: 118,
      whatsappConversionRate: 14.9,
      profileToClickRate: 20.5
    },
    {
      period: 'Semana 2',
      profileViews: 4420,
      adClicks: 940,
      whatsappLeads: 151,
      whatsappConversionRate: 16.1,
      profileToClickRate: 21.3
    },
    {
      period: 'Semana 3',
      profileViews: 5190,
      adClicks: 1160,
      whatsappLeads: 198,
      whatsappConversionRate: 17.1,
      profileToClickRate: 22.4
    },
    {
      period: 'Semana 4',
      profileViews: 6180,
      adClicks: 1420,
      whatsappLeads: 264,
      whatsappConversionRate: 18.6,
      profileToClickRate: 23.0
    }
  ],
  '6m': [
    {
      period: 'Jun',
      profileViews: 9400,
      adClicks: 1680,
      whatsappLeads: 215,
      whatsappConversionRate: 12.8,
      profileToClickRate: 17.9
    },
    {
      period: 'Jul',
      profileViews: 11200,
      adClicks: 2140,
      whatsappLeads: 295,
      whatsappConversionRate: 13.8,
      profileToClickRate: 19.1
    },
    {
      period: 'Ago',
      profileViews: 13500,
      adClicks: 2690,
      whatsappLeads: 398,
      whatsappConversionRate: 14.8,
      profileToClickRate: 19.9
    },
    {
      period: 'Set',
      profileViews: 15800,
      adClicks: 3340,
      whatsappLeads: 531,
      whatsappConversionRate: 15.9,
      profileToClickRate: 21.1
    },
    {
      period: 'Out',
      profileViews: 18100,
      adClicks: 3980,
      whatsappLeads: 672,
      whatsappConversionRate: 16.9,
      profileToClickRate: 22.0
    },
    {
      period: 'Nov',
      profileViews: 21400,
      adClicks: 4860,
      whatsappLeads: 884,
      whatsappConversionRate: 18.2,
      profileToClickRate: 22.7
    }
  ]
};

const AD_BREAKDOWN_DATA = [
  {
    adName: 'Restaurante Sabor & Fogo',
    neighborhood: 'Campolim',
    profileViews: 3420,
    adClicks: 810,
    whatsappLeads: 158,
    conversionRate: 19.5
  },
  {
    adName: 'Residencial Sênior Acolher',
    neighborhood: 'Santa Rosália',
    profileViews: 2190,
    adClicks: 490,
    whatsappLeads: 84,
    conversionRate: 17.1
  },
  {
    adName: 'Oficina Precision Car',
    neighborhood: 'Trujillo',
    profileViews: 1950,
    adClicks: 470,
    whatsappLeads: 67,
    conversionRate: 14.3
  }
];

interface WhatsAppConversionChartsPanelProps {
  businessName?: string;
  compact?: boolean;
}

export function WhatsAppConversionChartsPanel({
  businessName = 'GuiaPonto Destaques & Serviços',
  compact = false
}: WhatsAppConversionChartsPanelProps) {
  const [timeframe, setTimeframe] = useState<AnalyticsTimeframe>('7d');
  const [selectedAdFilter, setSelectedAdFilter] = useState<string>('all');

  // Scale series if a single ad is selected
  const activeSeries = useMemo(() => {
    const base = DATA_BY_TIMEFRAME[timeframe];
    if (selectedAdFilter === 'all') return base;

    const factor =
      selectedAdFilter === 'sabor' ? 0.52 : selectedAdFilter === 'acolher' ? 0.28 : 0.2;
    const convBoost =
      selectedAdFilter === 'sabor' ? 1.08 : selectedAdFilter === 'acolher' ? 1.0 : 0.9;

    return base.map((pt) => {
      const profileViews = Math.round(pt.profileViews * factor);
      const adClicks = Math.round(pt.adClicks * factor);
      const whatsappConversionRate = Number(
        (pt.whatsappConversionRate * convBoost).toFixed(1)
      );
      const whatsappLeads = Math.max(
        1,
        Math.round((adClicks * whatsappConversionRate) / 100)
      );
      return {
        ...pt,
        profileViews,
        adClicks,
        whatsappLeads,
        whatsappConversionRate
      };
    });
  }, [timeframe, selectedAdFilter]);

  const totals = useMemo(() => {
    const totalProfileViews = activeSeries.reduce((acc, p) => acc + p.profileViews, 0);
    const totalAdClicks = activeSeries.reduce((acc, p) => acc + p.adClicks, 0);
    const totalWhatsappLeads = activeSeries.reduce((acc, p) => acc + p.whatsappLeads, 0);
    const avgWhatsappConversion =
      totalAdClicks > 0
        ? Number(((totalWhatsappLeads / totalAdClicks) * 100).toFixed(1))
        : 0;
    const clickThroughRate =
      totalProfileViews > 0
        ? Number(((totalAdClicks / totalProfileViews) * 100).toFixed(1))
        : 0;

    return {
      totalProfileViews,
      totalAdClicks,
      totalWhatsappLeads,
      avgWhatsappConversion,
      clickThroughRate
    };
  }, [activeSeries]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
      {/* Header & Interactive Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FE3A18]/10 text-[#FE3A18] text-[11px] font-black uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Inteligência Visual Recharts • Funil de Conversão Sorocaba</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Visualizações do Perfil, Cliques em Anúncios & Conversão WhatsApp
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Acompanhe em tempo real quantos visitantes visualizam o perfil de{' '}
            <strong className="text-slate-800">{businessName}</strong>, clicam nos seus anúncios e
            convertem em leads reais no WhatsApp.
          </p>
        </div>

        {/* Timeframe & Ad Selectors */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {[
              { id: '7d' as const, label: 'Últimos 7 Dias' },
              { id: '30d' as const, label: '30 Dias' },
              { id: '6m' as const, label: '6 Meses' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTimeframe(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  timeframe === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-[#FE3A18]" />
            <select
              value={selectedAdFilter}
              onChange={(e) => setSelectedAdFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">Todos os Anúncios Ativos</option>
              <option value="sabor">Restaurante Sabor & Fogo</option>
              <option value="acolher">Residencial Sênior Acolher</option>
              <option value="precision">Oficina Precision Car</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4 Core Funnel KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Visualizações do Perfil</span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">
            {totals.totalProfileViews.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] font-bold text-blue-600">
            ↑ +24,8% alcance orgânico + vitrine
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Cliques em Anúncios</span>
            <MousePointerClick className="w-4 h-4 text-[#FE3A18]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">
            {totals.totalAdClicks.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] font-bold text-[#FE3A18]">
            Taxa Perfil → Clique: {totals.clickThroughRate}%
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>Leads Gerados no WhatsApp</span>
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono tabular-nums">
            {totals.totalWhatsappLeads.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] font-bold text-emerald-700">
            Contatos diretos prontos p/ fechamento
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span>Taxa de Conversão WhatsApp</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums">
            {totals.avgWhatsappConversion}%
          </div>
          <div className="text-[11px] font-semibold text-emerald-400">
            Meta Sorocaba (15,0%) superada ✓
          </div>
        </div>
      </div>

      {/* Primary Charts Grid (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Visualizações do Perfil vs. Cliques em Anúncios (AreaChart) */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h4 className="text-sm sm:text-base font-black text-slate-900">
                1. Visualizações do Perfil vs. Cliques em Anúncios
              </h4>
              <p className="text-xs text-slate-500">
                Comparativo entre tráfego no perfil público e cliques nos anúncios ativos
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200">
              RECHARTS AREA
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activeSeries}
                margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="profileViewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="adClicksGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FE3A18" stopOpacity={0.38} />
                    <stop offset="95%" stopColor="#FE3A18" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid #334155',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="profileViews"
                  name="Visualizações do Perfil"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#profileViewsGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="adClicks"
                  name="Cliques em Anúncios"
                  stroke="#FE3A18"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#adClicksGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Leads de WhatsApp & Taxa de Conversão por Leads de WhatsApp (%) */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h4 className="text-sm sm:text-base font-black text-slate-900">
                2. Taxa de Conversão por Leads de WhatsApp (%)
              </h4>
              <p className="text-xs text-slate-500">
                Volume de leads no WhatsApp (barras) e eficiência de conversão sobre cliques (linha)
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
              CONVERSÃO WHATSAPP
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={activeSeries}
                margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                <YAxis
                  yAxisId="left"
                  stroke="#059669"
                  fontSize={12}
                  tickFormatter={(v) => `${v}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#FE3A18"
                  fontSize={12}
                  domain={[0, 25]}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid #334155',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <ReferenceLine
                  yAxisId="right"
                  y={15}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Meta 15%',
                    position: 'insideTopRight',
                    fill: '#d97706',
                    fontSize: 10
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="whatsappLeads"
                  name="Leads de WhatsApp"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                  barSize={28}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="whatsappConversionRate"
                  name="Taxa de Conversão WhatsApp (%)"
                  stroke="#FE3A18"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#FE3A18' }}
                  activeDot={{ r: 7 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Optional 3rd Section: Comparativo por Anúncio (Shown when not compact) */}
      {!compact && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 text-white border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ranking de Eficiência por Anúncio</span>
            </div>
            <h4 className="text-base sm:text-lg font-black text-white">
              Desempenho de Conversão WhatsApp por Campanha em Sorocaba
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Anúncios com botão de resposta imediata no WhatsApp e oferta clara no título alcançam
              até <strong className="text-emerald-400">19,5% de conversão</strong> sobre os cliques.
            </p>

            <div className="space-y-2 pt-1">
              {AD_BREAKDOWN_DATA.map((item) => (
                <div
                  key={item.adName}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{item.adName}</div>
                    <div className="text-[11px] text-slate-400">
                      {item.neighborhood} · {item.profileViews.toLocaleString('pt-BR')} views ·{' '}
                      {item.adClicks} cliques
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-black text-xs">
                      {item.conversionRate}% conv.
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {item.whatsappLeads} leads WhatsApp
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 h-64 w-full bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={AD_BREAKDOWN_DATA}
                margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="adName" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    color: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #334155',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar
                  dataKey="adClicks"
                  name="Cliques no Anúncio"
                  fill="#FE3A18"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="whatsappLeads"
                  name="Leads WhatsApp"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
