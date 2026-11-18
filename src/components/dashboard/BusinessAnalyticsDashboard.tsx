/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  Download,
  Eye,
  Filter,
  MessageSquare,
  RotateCcw,
  TrendingUp
} from 'lucide-react';

export type AnalyticsRange = '7d' | '30d' | '6m';
export type AnalyticsChannel = 'all' | 'organic' | 'directory' | 'qrcode';

interface RawAnalyticsPoint {
  label: string;
  storefrontViews: number;
  whatsappClicks: number;
  daysCount: number;
}

interface ChannelBreakdownItem {
  id: Exclude<AnalyticsChannel, 'all'>;
  channel: string;
  viewsShare: number;
  conversionMultiplier: number;
}

const BASE_SERIES_BY_RANGE: Record<AnalyticsRange, RawAnalyticsPoint[]> = {
  '7d': [
    { label: 'Seg', storefrontViews: 640, whatsappClicks: 74, daysCount: 1 },
    { label: 'Ter', storefrontViews: 820, whatsappClicks: 102, daysCount: 1 },
    { label: 'Qua', storefrontViews: 790, whatsappClicks: 96, daysCount: 1 },
    { label: 'Qui', storefrontViews: 1080, whatsappClicks: 142, daysCount: 1 },
    { label: 'Sex', storefrontViews: 1390, whatsappClicks: 192, daysCount: 1 },
    { label: 'Sáb', storefrontViews: 1580, whatsappClicks: 228, daysCount: 1 },
    { label: 'Dom', storefrontViews: 1020, whatsappClicks: 136, daysCount: 1 }
  ],
  '30d': [
    { label: 'Sem 1', storefrontViews: 4120, whatsappClicks: 478, daysCount: 7 },
    { label: 'Sem 2', storefrontViews: 4680, whatsappClicks: 576, daysCount: 7 },
    { label: 'Sem 3', storefrontViews: 5340, whatsappClicks: 705, daysCount: 7 },
    { label: 'Sem 4', storefrontViews: 6290, whatsappClicks: 874, daysCount: 9 }
  ],
  '6m': [
    { label: 'Jun', storefrontViews: 11200, whatsappClicks: 1180, daysCount: 30 },
    { label: 'Jul', storefrontViews: 13400, whatsappClicks: 1510, daysCount: 31 },
    { label: 'Ago', storefrontViews: 15100, whatsappClicks: 1840, daysCount: 31 },
    { label: 'Set', storefrontViews: 17600, whatsappClicks: 2290, daysCount: 30 },
    { label: 'Out', storefrontViews: 19800, whatsappClicks: 2710, daysCount: 31 },
    { label: 'Nov', storefrontViews: 22400, whatsappClicks: 3240, daysCount: 30 }
  ]
};

const CHANNELS: ChannelBreakdownItem[] = [
  {
    id: 'organic',
    channel: 'Busca Orgânica',
    viewsShare: 0.46,
    conversionMultiplier: 1.08
  },
  {
    id: 'directory',
    channel: 'Vitrine GuiaPonto',
    viewsShare: 0.34,
    conversionMultiplier: 0.94
  },
  {
    id: 'qrcode',
    channel: 'QR Code Balcão',
    viewsShare: 0.2,
    conversionMultiplier: 1.24
  }
];

const CHANNEL_FILTER_LABELS: Record<AnalyticsChannel, string> = {
  all: 'Todos os canais',
  organic: 'Busca Orgânica',
  directory: 'Vitrine GuiaPonto',
  qrcode: 'QR Code Balcão'
};

interface BusinessAnalyticsDashboardProps {
  businessName?: string;
  isDarkMode?: boolean;
}

export function BusinessAnalyticsDashboard({
  businessName = 'Seu Negócio Local',
  isDarkMode = false
}: BusinessAnalyticsDashboardProps) {
  const [range, setRange] = useState<AnalyticsRange>('7d');
  const [channel, setChannel] = useState<AnalyticsChannel>('all');
  const [exportedNotice, setExportedNotice] = useState<string | null>(null);

  const chartSeries = useMemo(() => {
    const base = BASE_SERIES_BY_RANGE[range];
    const selectedChannelMeta =
      channel === 'all' ? null : CHANNELS.find((c) => c.id === channel);

    return base.map((point) => {
      const views = selectedChannelMeta
        ? Math.round(point.storefrontViews * selectedChannelMeta.viewsShare)
        : point.storefrontViews;

      const rawClicks = selectedChannelMeta
        ? Math.round(
            point.whatsappClicks *
              selectedChannelMeta.viewsShare *
              selectedChannelMeta.conversionMultiplier
          )
        : point.whatsappClicks;

      const clicks = Math.min(views, rawClicks);
      const conversionRate =
        views > 0 ? Number(((clicks / views) * 100).toFixed(1)) : 0;

      return {
        label: point.label,
        storefrontViews: views,
        whatsappClicks: clicks,
        conversionRate,
        daysCount: point.daysCount
      };
    });
  }, [range, channel]);

  const summary = useMemo(() => {
    const totalViews = chartSeries.reduce((acc, p) => acc + p.storefrontViews, 0);
    const totalWhatsappClicks = chartSeries.reduce(
      (acc, p) => acc + p.whatsappClicks,
      0
    );
    const totalDays = chartSeries.reduce((acc, p) => acc + p.daysCount, 0);
    const conversionRate =
      totalViews > 0
        ? Number(((totalWhatsappClicks / totalViews) * 100).toFixed(1))
        : 0;
    const avgDailyClicks =
      totalDays > 0 ? Math.round(totalWhatsappClicks / totalDays) : 0;

    return {
      totalViews,
      totalWhatsappClicks,
      conversionRate,
      avgDailyClicks
    };
  }, [chartSeries]);

  const channelBreakdown = useMemo(() => {
    const basePoints = BASE_SERIES_BY_RANGE[range];
    const baseTotalViews = basePoints.reduce(
      (acc, p) => acc + p.storefrontViews,
      0
    );
    const baseTotalClicks = basePoints.reduce(
      (acc, p) => acc + p.whatsappClicks,
      0
    );

    return CHANNELS.map((item) => {
      const views = Math.round(baseTotalViews * item.viewsShare);
      const clicks = Math.round(
        baseTotalClicks * item.viewsShare * item.conversionMultiplier
      );
      const rate = views > 0 ? Number(((clicks / views) * 100).toFixed(1)) : 0;
      return {
        id: item.id,
        channel: item.channel,
        storefrontViews: views,
        whatsappClicks: clicks,
        conversionRate: rate,
        isFocused: channel === 'all' || channel === item.id
      };
    });
  }, [range, channel]);

  const handleResetFilters = () => {
    setRange('7d');
    setChannel('all');
  };

  const handleExportCsv = () => {
    const headers = [
      'Periodo',
      'Canal',
      'Visualizacoes_da_Vitrine',
      'Cliques_no_WhatsApp',
      'Taxa_de_Conversao_Pct'
    ];
    const rows = chartSeries.map((pt) => [
      pt.label,
      CHANNEL_FILTER_LABELS[channel],
      pt.storefrontViews,
      pt.whatsappClicks,
      pt.conversionRate.toFixed(1)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `analytics-${range}-${channel}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    setExportedNotice(
      `Arquivo CSV (${range.toUpperCase()} · ${CHANNEL_FILTER_LABELS[channel]}) exportado com sucesso.`
    );
    setTimeout(() => setExportedNotice(null), 4000);
  };

  const surfaceClass = isDarkMode
    ? 'bg-slate-900 border-slate-800 text-slate-100'
    : 'bg-white border-slate-200 text-slate-900';

  const subtleSurfaceClass = isDarkMode
    ? 'bg-slate-950/60 border-slate-800 text-slate-100'
    : 'bg-slate-50/70 border-slate-200 text-slate-900';

  const mutedTextClass = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const gridStroke = isDarkMode ? '#1e293b' : '#e2e8f0';
  const axisStroke = isDarkMode ? '#94a3b8' : '#64748b';

  return (
    <section
      aria-labelledby="business-analytics-heading"
      className={`rounded-3xl border p-6 sm:p-8 space-y-8 ${surfaceClass}`}
    >
      {/* Top Header + Controls */}
      <div
        className={`flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-6 border-b ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="font-bold text-[#FE3A18]">
              Dashboard de Analytics
            </span>
            <span aria-hidden="true" className={mutedTextClass}>
              ·
            </span>
            <span className={mutedTextClass}>{businessName}</span>
            <span aria-hidden="true" className={mutedTextClass}>
              ·
            </span>
            <span className={mutedTextClass}>
              {CHANNEL_FILTER_LABELS[channel]}
            </span>
          </div>

          <h2
            id="business-analytics-heading"
            className="text-2xl sm:text-3xl font-black tracking-tight text-balance"
          >
            Desempenho da Vitrine e Conversão no WhatsApp
          </h2>

          <p className={`text-sm leading-relaxed ${mutedTextClass}`}>
            Monitore visualizações da vitrine pública, cliques diretos no botão
            de WhatsApp e taxa de conversão por período e canal de origem.
          </p>
        </div>

        {/* Interactive Toolbar */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Segmented Timeframe Selector */}
          <div
            role="tablist"
            aria-label="Período de análise"
            className={`inline-flex items-center gap-1 p-1 rounded-xl border ${
              isDarkMode
                ? 'bg-slate-950 border-slate-800'
                : 'bg-slate-100 border-slate-200'
            }`}
          >
            {[
              { id: '7d' as const, label: '7 dias' },
              { id: '30d' as const, label: '30 dias' },
              { id: '6m' as const, label: '6 meses' }
            ].map((item) => {
              const active = range === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setRange(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? isDarkMode
                        ? 'bg-white text-slate-900'
                        : 'bg-slate-900 text-white'
                      : isDarkMode
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Channel Origin Filter */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${
              isDarkMode
                ? 'bg-slate-950 border-slate-800 text-slate-200'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-[#FE3A18] shrink-0" />
            <label htmlFor="analytics-channel-filter" className="sr-only">
              Filtrar por canal de origem
            </label>
            <select
              id="analytics-channel-filter"
              value={channel}
              onChange={(e) => setChannel(e.target.value as AnalyticsChannel)}
              className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option
                value="all"
                className={isDarkMode ? 'bg-slate-900 text-white' : ''}
              >
                Todos os canais
              </option>
              <option
                value="organic"
                className={isDarkMode ? 'bg-slate-900 text-white' : ''}
              >
                Busca Orgânica
              </option>
              <option
                value="directory"
                className={isDarkMode ? 'bg-slate-900 text-white' : ''}
              >
                Vitrine GuiaPonto
              </option>
              <option
                value="qrcode"
                className={isDarkMode ? 'bg-slate-900 text-white' : ''}
              >
                QR Code Balcão
              </option>
            </select>
          </div>

          {(range !== '7d' || channel !== 'all') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isDarkMode
                  ? 'border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetar</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {exportedNotice && (
        <div
          role="status"
          className={`px-4 py-3 rounded-xl border text-xs font-semibold ${
            isDarkMode
              ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          {exportedNotice}
        </div>
      )}

      {/* 4 Core KPI Summary Strip (Tabular Numerals, No Nested Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border space-y-2 ${subtleSurfaceClass}`}>
          <div className={`flex items-center justify-between text-xs font-semibold ${mutedTextClass}`}>
            <span>Visualizações da Vitrine</span>
            <Eye className="w-4 h-4 text-blue-600 shrink-0" />
          </div>
          <div className="text-3xl font-black font-mono tabular-nums tracking-tight">
            {summary.totalViews.toLocaleString('pt-BR')}
          </div>
          <div className="text-xs font-semibold text-blue-600">
            +21,4% vs. período anterior
          </div>
        </div>

        <div className={`p-5 rounded-2xl border space-y-2 ${subtleSurfaceClass}`}>
          <div className={`flex items-center justify-between text-xs font-semibold ${mutedTextClass}`}>
            <span>Cliques no WhatsApp</span>
            <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-3xl font-black font-mono tabular-nums tracking-tight text-emerald-600">
            {summary.totalWhatsappClicks.toLocaleString('pt-BR')}
          </div>
          <div className="text-xs font-semibold text-emerald-600">
            Contatos diretos iniciados
          </div>
        </div>

        <div className={`p-5 rounded-2xl border space-y-2 ${subtleSurfaceClass}`}>
          <div className={`flex items-center justify-between text-xs font-semibold ${mutedTextClass}`}>
            <span>Taxa de Conversão</span>
            <TrendingUp className="w-4 h-4 text-[#FE3A18] shrink-0" />
          </div>
          <div className="text-3xl font-black font-mono tabular-nums tracking-tight text-[#FE3A18]">
            {summary.conversionRate.toFixed(1)}%
          </div>
          <div className={`text-xs font-semibold ${mutedTextClass}`}>
            Meta regional: 12,0% ({summary.conversionRate >= 12 ? 'atingida' : 'em progresso'})
          </div>
        </div>

        <div className={`p-5 rounded-2xl border space-y-2 ${subtleSurfaceClass}`}>
          <div className={`flex items-center justify-between text-xs font-semibold ${mutedTextClass}`}>
            <span>Média Diária WhatsApp</span>
            <MessageSquare className="w-4 h-4 text-amber-600 shrink-0" />
          </div>
          <div className="text-3xl font-black font-mono tabular-nums tracking-tight">
            {summary.avgDailyClicks.toLocaleString('pt-BR')}
            <span className={`text-sm font-semibold ml-1 ${mutedTextClass}`}>
              /dia
            </span>
          </div>
          <div className={`text-xs font-semibold ${mutedTextClass}`}>
            Cliques qualificados por dia
          </div>
        </div>
      </div>

      {/* Primary Charts Grid (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Visualizações da Vitrine vs. Cliques no WhatsApp */}
        <div className={`lg:col-span-6 p-5 sm:p-6 rounded-2xl border space-y-4 ${subtleSurfaceClass}`}>
          <div className="space-y-1">
            <h3 className="text-base font-black tracking-tight">
              01. Visualizações da Vitrine vs. Cliques no WhatsApp
            </h3>
            <p className={`text-xs ${mutedTextClass}`}>
              Evolução conjunta do alcance na vitrine e acionamentos do botão de WhatsApp.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartSeries}
                margin={{ top: 10, right: 12, left: -12, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="dashStorefrontGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="dashWhatsappGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="label" stroke={axisStroke} fontSize={12} />
                <YAxis stroke={axisStroke} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #334155',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="storefrontViews"
                  name="Visualizações da Vitrine"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#dashStorefrontGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="whatsappClicks"
                  name="Cliques no WhatsApp"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#dashWhatsappGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Cliques no WhatsApp & Taxa de Conversão (%) */}
        <div className={`lg:col-span-6 p-5 sm:p-6 rounded-2xl border space-y-4 ${subtleSurfaceClass}`}>
          <div className="space-y-1">
            <h3 className="text-base font-black tracking-tight">
              02. Taxa de Conversão da Vitrine para WhatsApp (%)
            </h3>
            <p className={`text-xs ${mutedTextClass}`}>
              Volume de cliques no WhatsApp (barras) e eficiência percentual de conversão (linha).
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartSeries}
                margin={{ top: 10, right: 12, left: -12, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="label" stroke={axisStroke} fontSize={12} />
                <YAxis yAxisId="left" stroke="#16a34a" fontSize={12} />
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
                    borderRadius: '12px',
                    border: '1px solid #334155',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <ReferenceLine
                  yAxisId="right"
                  y={12}
                  stroke="#d97706"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Meta 12%',
                    position: 'insideTopRight',
                    fill: '#d97706',
                    fontSize: 11
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="whatsappClicks"
                  name="Cliques no WhatsApp"
                  fill="#16a34a"
                  radius={[6, 6, 0, 0]}
                  barSize={28}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="conversionRate"
                  name="Taxa de Conversão (%)"
                  stroke="#FE3A18"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#FE3A18' }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3: Desempenho por Canal de Origem + Tabela Alinhada */}
      <div className={`p-5 sm:p-6 rounded-2xl border grid grid-cols-1 lg:grid-cols-12 gap-6 items-center ${subtleSurfaceClass}`}>
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-black tracking-tight">
              03. Conversão por Canal de Origem
            </h3>
            <p className={`text-xs ${mutedTextClass}`}>
              Comparativo entre canais que trazem visitantes até sua vitrine e geram cliques no WhatsApp.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr
                  className={`border-b ${
                    isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                  }`}
                >
                  <th className="py-2.5 pr-3 font-semibold">Canal</th>
                  <th className="py-2.5 px-2 font-semibold text-right">Vitrine</th>
                  <th className="py-2.5 px-2 font-semibold text-right">WhatsApp</th>
                  <th className="py-2.5 pl-2 font-semibold text-right">Conversão</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDarkMode ? 'divide-slate-800/80' : 'divide-slate-200/80'
                }`}
              >
                {channelBreakdown.map((row) => (
                  <tr
                    key={row.id}
                    className={
                      row.isFocused ? '' : 'opacity-45 transition-opacity'
                    }
                  >
                    <td className="py-2.5 pr-3 font-bold">{row.channel}</td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                      {row.storefrontViews.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums text-emerald-600 font-bold">
                      {row.whatsappClicks.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-2.5 pl-2 text-right font-mono tabular-nums font-bold text-[#FE3A18]">
                      {row.conversionRate.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-7 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={channelBreakdown}
              margin={{ top: 10, right: 12, left: -12, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="channel" stroke={axisStroke} fontSize={11} />
              <YAxis stroke={axisStroke} fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
              <Bar
                dataKey="storefrontViews"
                name="Visualizações da Vitrine"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="whatsappClicks"
                name="Cliques no WhatsApp"
                fill="#16a34a"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
