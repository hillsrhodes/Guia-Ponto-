import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Unlock,
  Check,
  X,
  Crown,
  ArrowRight,
  BarChart3,
  Bot,
  Award,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Zap
} from 'lucide-react';

export interface LockedBenefitItem {
  id: string;
  title: string;
  subtitle: string;
  impactMetric: string;
  category: 'IA & Automação' | 'Relatórios & Dados' | 'Destaque & WhatsApp' | 'Reputação 3D';
  freeLimitation: string;
  proUnlockedPower: string;
}

export const LOCKED_PRO_BENEFITS: LockedBenefitItem[] = [
  {
    id: 'locked-ia-unlimited',
    title: 'IA Studio Ilimitada & Auto-Follow-up',
    subtitle: 'Criação de anúncios Gemini + respostas automáticas de leads e avaliações',
    impactMetric: '+3.2x velocidade de fechamento',
    category: 'IA & Automação',
    freeLimitation: 'Apenas 1 teste único de degustação; sem respostas automáticas',
    proUnlockedPower: 'Gerações ilimitadas em 4 tons de voz + Auto-Follow-up de leads e avaliações em 1 clique'
  },
  {
    id: 'locked-advanced-reports',
    title: 'Relatórios Avançados & Radar Sorocaba',
    subtitle: 'Volume mensal de buscas por bairro, exportação PDF executivo e simulador de ROI',
    impactMetric: '+48% inteligência de tráfego',
    category: 'Relatórios & Dados',
    freeLimitation: 'Apenas contagem simples de visualizações sem dados de busca do bairro',
    proUnlockedPower: 'AI Local Trends completo em Sorocaba + Relatórios PDF + Backup Criptografado AES-256'
  },
  {
    id: 'locked-top-search-whatsapp',
    title: 'Topo Absoluto nas Buscas & WhatsApp Ilimitado',
    subtitle: 'Prioridade máxima no seu bairro em Sorocaba sem limite mensal de cliques',
    impactMetric: '+340% orçamentos diretos',
    category: 'Destaque & WhatsApp',
    freeLimitation: 'Listagem alfabética padrão e limite de 15 cliques monitorados/mês',
    proUnlockedPower: 'Destaque patrocinado no topo do bairro + Cliques ilimitados no WhatsApp (0% comissão)'
  },
  {
    id: 'locked-3d-badges-showcase',
    title: 'Vitrine Pública de Insígnias 3D & SEO Google',
    subtitle: 'Fixe até 4 troféus 3D na sua página pública + 10 palavras-chave com estrelas no Google',
    impactMetric: '+24% taxa de conversão',
    category: 'Reputação 3D',
    freeLimitation: 'Sem insígnias 3D na vitrine pública e apenas 1 palavra-chave básica',
    proUnlockedPower: 'Até 4 Insígnias 3D públicas + 12 Fotos HD + 2 Vídeos Spotlight + Rich Snippets Google'
  }
];

export interface SideBySideComparisonRow {
  id: string;
  category: 'IA & Automação' | 'Relatórios & Dados' | 'Destaque & WhatsApp' | 'Reputação 3D';
  feature: string;
  freeSpec: string;
  freeAvailable: boolean;
  proSpec: string;
  proHighlight: string;
}

export const SIDE_BY_SIDE_COMPARISON_ROWS: SideBySideComparisonRow[] = [
  {
    id: 'row-1',
    category: 'Destaque & WhatsApp',
    feature: 'Posicionamento nas Buscas de Sorocaba',
    freeSpec: 'Ordem alfabética (abaixo dos assinantes)',
    freeAvailable: true,
    proSpec: 'Topo Absoluto do Bairro + Pino Destacado',
    proHighlight: '3,4x mais visualizações'
  },
  {
    id: 'row-2',
    category: 'Destaque & WhatsApp',
    feature: 'Orçamentos Diretos no WhatsApp (0% Taxa)',
    freeSpec: 'Limite de 15 cliques/mês',
    freeAvailable: true,
    proSpec: 'Cliques e Leads Ilimitados 24h/dia',
    proHighlight: 'Sem perda de clientes'
  },
  {
    id: 'row-3',
    category: 'IA & Automação',
    feature: 'Criador & Editor de Anúncios com IA (Gemini)',
    freeSpec: '1 teste único de degustação',
    freeAvailable: false,
    proSpec: 'Criações e Otimizações Ilimitadas',
    proHighlight: 'Copy pronta em 5 seg'
  },
  {
    id: 'row-4',
    category: 'IA & Automação',
    feature: 'Auto-Follow-up de Leads & Resposta de Avaliações IA',
    freeSpec: 'Bloqueado no Plano Gratuito',
    freeAvailable: false,
    proSpec: 'Rascunhos e Disparo Inteligente em 1 Clique',
    proHighlight: '+31% conversão de leads'
  },
  {
    id: 'row-5',
    category: 'Relatórios & Dados',
    feature: 'Relatórios Avançados PDF & Radar de Buscas Sorocaba',
    freeSpec: 'Bloqueado (apenas resumo básico)',
    freeAvailable: false,
    proSpec: 'AI Local Trends + Exportação PDF Executivo',
    proHighlight: 'Dados reais por bairro'
  },
  {
    id: 'row-6',
    category: 'Relatórios & Dados',
    feature: 'Backup Automático Criptografado (AES-GCM 256)',
    freeSpec: 'Apenas exportação manual simples',
    freeAvailable: false,
    proSpec: 'Backup Agendado + Cofre Criptografado com Senha',
    proHighlight: 'Segurança total LGPD'
  },
  {
    id: 'row-7',
    category: 'Reputação 3D',
    feature: 'Vitrine de Insígnias 3D na Landing Page Pública',
    freeSpec: 'Bloqueado na página pública',
    freeAvailable: false,
    proSpec: 'Fixe até 4 Insígnias 3D Interativas no Topo',
    proHighlight: '+24% confiança imediata'
  },
  {
    id: 'row-8',
    category: 'Reputação 3D',
    feature: 'Galeria Multimídia & Indexação SEO Google',
    freeSpec: '1 foto + 1 palavra-chave simples',
    freeAvailable: true,
    proSpec: '12 Fotos HD + 2 Vídeos + 10 Palavras-Chave Google',
    proHighlight: 'Estrelas na busca Google'
  }
];

interface ShimmerLockedBenefitsBoxProps {
  onOpenComparisonModal: (initialHighlightId?: string) => void;
  variant?: 'light' | 'compact';
}

/**
 * Visual component rendered inside the Free Plan card showing a glowing padlock
 * with a continuous shimmer sweep over locked Pro benefits (like Advanced Reports & Unlimited AI).
 */
export function ShimmerLockedBenefitsBox({
  onOpenComparisonModal,
  variant = 'light'
}: ShimmerLockedBenefitsBoxProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="pt-4 border-t border-slate-200/80 space-y-3">
      {/* Header with Glowing Padlock */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-amber-400 shadow-sm overflow-hidden shrink-0">
            <motion.div
              animate={{ x: ['-120%', '220%'] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-amber-300/40 to-transparent -skew-x-12 pointer-events-none"
            />
            <Lock className="w-3.5 h-3.5 relative z-10" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-900 block leading-tight">
              Benefícios Pro Bloqueados no Gratuito
            </span>
            <span className="text-[11px] text-slate-500 block">
              Clique em um item para comparar e desbloquear
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenComparisonModal()}
          className="text-[11px] font-extrabold text-[#FE3A18] hover:underline cursor-pointer whitespace-nowrap shrink-0"
        >
          Comparar Planos →
        </button>
      </div>

      {/* Shimmering Locked Benefit Items */}
      <div className="space-y-2">
        {LOCKED_PRO_BENEFITS.map((item, idx) => {
          const isHovered = hoveredItem === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => onOpenComparisonModal(item.id)}
              whileHover={{ scale: 1.01 }}
              className="w-full text-left relative overflow-hidden rounded-xl border border-amber-500/35 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 p-3 text-white shadow-xs transition-all cursor-pointer group"
            >
              {/* Animated Shimmer Sweep Overlay */}
              <motion.div
                animate={{ x: ['-100%', '250%'] }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: idx * 0.45
                }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent -skew-x-12 pointer-events-none"
              />

              <div className="relative z-10 flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 min-w-0">
                  {/* Glowing Padlock Icon */}
                  <div
                    className="mt-0.5 w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                    style={{
                      boxShadow: isHovered
                        ? '0 0 14px rgba(251, 191, 36, 0.65)'
                        : '0 0 8px rgba(251, 191, 36, 0.3)'
                    }}
                  >
                    {isHovered ? (
                      <Unlock className="w-3.5 h-3.5 text-amber-300" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-white group-hover:text-amber-300 transition-colors truncate">
                      {item.title}
                    </div>
                    {variant !== 'compact' && (
                      <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold text-amber-300 whitespace-nowrap shrink-0 mt-0.5">
                  {item.impactMetric}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Trigger Button for Side-by-Side Comparison Modal */}
      <button
        type="button"
        onClick={() => onOpenComparisonModal()}
        className="w-full py-2.5 px-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-slate-900 font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Lock className="w-3.5 h-3.5 text-[#FE3A18]" />
        <span>Ver Comparativo Lado a Lado: Gratuito vs. Pro</span>
      </button>
    </div>
  );
}

interface FreeVsProComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProPlan: (billingCycle: 'annual' | 'monthly') => void;
  onContinueFreePlan?: () => void;
  initialHighlightedBenefitId?: string | null;
}

/**
 * Interactive Side-by-Side Comparison Modal (Plano Gratuito vs. Plano Pro)
 * designed to maximize conversion with clear contrast, ROI proof, and 1-click upgrade.
 */
export function FreeVsProComparisonModal({
  isOpen,
  onClose,
  onSelectProPlan,
  onContinueFreePlan,
  initialHighlightedBenefitId
}: FreeVsProComparisonModalProps) {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const highlightedBenefit = LOCKED_PRO_BENEFITS.find(
    (b) => b.id === initialHighlightedBenefitId
  );

  const filteredRows = SIDE_BY_SIDE_COMPARISON_ROWS.filter(
    (r) => selectedCategory === 'Todos' || r.category === selectedCategory
  );

  const monthlyPrice = billingCycle === 'annual' ? '24,75' : '49,90';
  const dailyPrice = billingCycle === 'annual' ? '0,82' : '1,66';

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl max-w-5xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            {/* Top Modal Header */}
            <div className="bg-slate-950 text-white p-6 sm:p-8 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Crown className="w-4 h-4 text-[#FE3A18]" />
                  <span>COMPARATIVO LADO A LADO · DECISÃO INTELIGENTE</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Plano Gratuito vs. Plano Premium Pro
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Descubra como desbloquear a IA ilimitada, os relatórios avançados e o topo das buscas em Sorocaba por menos de R$ {dailyPrice}/dia.
                </p>
              </div>

              <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
                {/* Billing Toggle inside Modal */}
                <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      billingCycle === 'annual'
                        ? 'bg-[#FE3A18] text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Anual (-50%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      billingCycle === 'monthly'
                        ? 'bg-[#FE3A18] text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Mensal
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shrink-0"
                  title="Fechar comparativo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
              {/* If opened by clicking a specific locked benefit, highlight it at the top */}
              {highlightedBenefit && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                      <Unlock className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-amber-400">
                        RECURSO SELECIONADO PARA DESBLOQUEIO: {highlightedBenefit.title.toUpperCase()}
                      </div>
                      <p className="text-xs text-slate-300">
                        <strong className="text-rose-300">No Gratuito:</strong> {highlightedBenefit.freeLimitation} ·{' '}
                        <strong className="text-emerald-300">No Plano Pro:</strong> {highlightedBenefit.proUnlockedPower}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-amber-300 whitespace-nowrap shrink-0">
                    {highlightedBenefit.impactMetric}
                  </span>
                </div>
              )}

              {/* Side-by-Side Summary Header Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Free Column Summary */}
                <div className="rounded-2xl p-5 bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-500">
                        Presença Inicial Básica
                      </span>
                      <h4 className="text-xl font-black text-slate-900">Plano Gratuito</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                        R$ 0
                      </span>
                      <span className="block text-[11px] text-slate-500">sempre grátis</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Indicado apenas para cadastrar o endereço no mapa. Possui travas em IA, relatórios avançados e limite de 15 cliques/mês no WhatsApp.
                  </p>
                </div>

                {/* Pro Column Summary */}
                <div className="rounded-2xl p-5 bg-slate-950 text-white border-2 border-[#FE3A18] flex flex-col justify-between space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <span className="text-xs font-bold text-amber-400">
                        Destaque Máximo & IA Ilimitada
                      </span>
                      <h4 className="text-xl font-black text-white">Plano Premium Pro</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-white font-mono tabular-nums">
                        R$ {monthlyPrice}
                      </span>
                      <span className="block text-[11px] text-emerald-400 font-semibold">
                        /mês (R$ {dailyPrice}/dia)
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed relative z-10">
                    Desbloqueia todos os motores de crescimento: Topo das buscas em Sorocaba, IA Studio ilimitada, relatórios executivos PDF e até 4 Insígnias 3D públicas.
                  </p>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <span className="text-xs font-bold text-slate-700">
                  Filtrar comparação por área:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    'Todos',
                    'Destaque & WhatsApp',
                    'IA & Automação',
                    'Relatórios & Dados',
                    'Reputação 3D'
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Side-by-Side Comparison Matrix */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
                        <th className="py-3.5 px-4 min-w-[210px]">Funcionalidade</th>
                        <th className="py-3.5 px-4 min-w-[200px]">Plano Gratuito (R$ 0)</th>
                        <th className="py-3.5 px-4 min-w-[260px] bg-orange-50/70 text-[#FE3A18]">
                          Plano Premium Pro (Desbloqueado)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      {filteredRows.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="text-[10px] font-semibold text-slate-400 block">
                              {row.category}
                            </span>
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">
                              {row.feature}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-start gap-2 text-slate-500">
                              {row.freeAvailable ? (
                                <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                              ) : (
                                <Lock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              )}
                              <span>{row.freeSpec}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 bg-orange-50/30">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 font-bold text-slate-900">
                                <Check className="w-4 h-4 text-[#FE3A18] shrink-0 mt-0.5" />
                                <span>{row.proSpec}</span>
                              </div>
                              <span className="text-[11px] font-mono font-bold text-emerald-700 whitespace-nowrap shrink-0">
                                {row.proHighlight}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bottom Sticky Conversion Footer */}
            <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2.5 text-xs text-slate-600">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  <strong>7 Dias de Teste Grátis</strong> · Se paga com 1 única venda no WhatsApp · Cancele quando quiser
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {onContinueFreePlan && (
                  <button
                    type="button"
                    onClick={() => {
                      onContinueFreePlan();
                      onClose();
                    }}
                    className="px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Manter Gratuito Limitado
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onSelectProPlan(billingCycle);
                    onClose();
                  }}
                  className="flex-1 sm:flex-initial px-6 py-3.5 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#FE3A18]/25 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Desbloquear Tudo no Plano Pro (R$ {monthlyPrice}/mês)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
