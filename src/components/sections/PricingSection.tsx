/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  Crown,
  Lock,
  Calculator,
  Award
} from 'lucide-react';
import {
  ShimmerLockedBenefitsBox,
  FreeVsProComparisonModal
} from '../ui/FreePlanLockedBenefitsAndModal';

interface PricingSectionProps {
  onSelectPlan: (planName: string) => void;
}

interface ComparisonItem {
  category: string;
  feature: string;
  free: string | boolean;
  premium: string;
  enterprise: string;
}

const PUBLIC_COMPARISON_ITEMS: ComparisonItem[] = [
  {
    category: 'Vitrine & Buscas',
    feature: 'Posicionamento no Diretório & Mapa de Sorocaba',
    free: 'Listagem padrão por ordem alfabética',
    premium: 'Topo absoluto do seu bairro + Destaque Patrocinado',
    enterprise: 'Dominância Regional (Sorocaba + Região Metropolitana)'
  },
  {
    category: 'Vitrine & Buscas',
    feature: 'Cliques Diretos para o WhatsApp (0% Comissão)',
    free: 'Até 15 cliques monitorados/mês',
    premium: 'Cliques e Leads Ilimitados + Mensagem Personalizada',
    enterprise: 'Ilimitado + Roteamento para Múltiplos Vendedores'
  },
  {
    category: 'Vitrine & Buscas',
    feature: 'Galeria de Fotos HD & Vídeos Spotlight',
    free: '1 Foto principal',
    premium: 'Até 12 Fotos HD + 2 Vídeos Spotlight na Vitrine',
    enterprise: 'Galeria Ilimitada + Destaque Multimídia'
  },
  {
    category: 'Vitrine & Buscas',
    feature: 'Palavras-Chave para Indexação no Google (SEO Local)',
    free: '1 Palavra-chave básica',
    premium: '10 Palavras-chave + Rich Snippets de Estrelas no Google',
    enterprise: 'Palavras-chave Ilimitadas + Consultoria SEO Mensal'
  },
  {
    category: 'Inteligência Artificial',
    feature: 'Criador & Editor de Anúncios com IA (Gemini Studio)',
    free: '1 Teste de degustação gratuito',
    premium: 'Criações e Otimizações Ilimitadas em 4 Tons de Voz',
    enterprise: 'Ilimitado + IA Treinada na Identidade da Sua Marca'
  },
  {
    category: 'Inteligência Artificial',
    feature: 'Auto-Follow-up de Leads & Resposta de Avaliações com IA',
    free: false,
    premium: 'Incluso (Respostas prontas em 1 clique)',
    enterprise: 'Automação Completa Multi-Unidades'
  },
  {
    category: 'Inteligência Artificial',
    feature: 'Radar AI Local Trends (Volume de Buscas em Sorocaba)',
    free: 'Resumo básico da categoria',
    premium: 'Acesso Completo + 4 Oportunidades de Crescimento/mês',
    enterprise: 'Inteligência Competitiva Comparativa por Bairro'
  },
  {
    category: 'Autoridade & Segurança',
    feature: 'Insígnias 3D Colecionáveis na Landing Page Pública',
    free: '1 Insígnia no painel interno',
    premium: 'Fixar até 4 Insígnias 3D na Vitrine Pública (+24% conversão)',
    enterprise: 'Todas as Insígnias 3D + Selo Exclusivo "Diamante Regional"'
  },
  {
    category: 'Autoridade & Segurança',
    feature: 'Backup Automático Criptografado (AES-256) & Relatórios PDF',
    free: 'Exportação manual simples',
    premium: 'Backup Automático Criptografado + Relatórios PDF Executivos',
    enterprise: 'Auditoria Completa LGPD + Gerente de Conta Dedicado'
  }
];

export function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [avgTicket, setAvgTicket] = useState<number>(120);
  const [extraSales, setExtraSales] = useState<number>(12);
  const [showFullComparison, setShowFullComparison] = useState<boolean>(true);
  const [comparisonModalOpen, setComparisonModalOpen] = useState<boolean>(false);
  const [highlightedBenefitId, setHighlightedBenefitId] = useState<string | null>(null);

  const handleOpenComparisonModal = (benefitId?: string) => {
    setHighlightedBenefitId(benefitId || null);
    setComparisonModalOpen(true);
  };

  const monthlyCost = billingCycle === 'annual' ? 24.75 : 49.90;
  const dailyCost = (monthlyCost / 30).toFixed(2).replace('.', ',');
  const estimatedGain = avgTicket * extraSales;
  const netGain = estimatedGain - monthlyCost;
  const monthsPaidByFirstSale = Math.max(1, Math.floor(avgTicket / monthlyCost));

  return (
    <section id="planos" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs font-bold tracking-wider text-[#FE3A18] uppercase">
            Estratégia Transparente · Comece Grátis e Escale com IA
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Invista menos de R$ 0,85 por dia para dominar seu bairro em Sorocaba.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Cadastre sua empresa gratuitamente para validar a plataforma ou ative o{' '}
            <strong className="text-slate-900">Plano Premium Pro</strong> para aparecer no topo das buscas e multiplicar seus orçamentos no WhatsApp.
          </p>

          {/* Toggle Billing */}
          <div className="pt-4 flex items-center justify-center">
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  billingCycle === 'annual'
                    ? 'bg-[#FE3A18] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Anual · R$ 24,75/mês (Economize 50%)
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  billingCycle === 'monthly'
                    ? 'bg-[#FE3A18] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mensal · R$ 49,90/mês
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleOpenComparisonModal()}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm whitespace-nowrap shrink-0"
            >
              <Lock className="w-3.5 h-3.5 text-[#FE3A18]" />
              <span>Comparar Lado a Lado: Gratuito vs. Pro</span>
            </button>
          </div>
        </div>

        {/* 3-Column Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* 1. Plano Gratuito */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col justify-between space-y-8"
          >
            <div className="space-y-6">
              <div>
                <div className="text-xs font-semibold text-slate-500">
                  Porta de Entrada · Grátis para Sempre
                </div>
                <h3 className="text-2xl font-black text-slate-900 mt-1">Plano Gratuito</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Para colocar seu comércio no mapa de Sorocaba e receber os primeiros contatos sem custo.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/80">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 font-mono tabular-nums">
                    R$ 0
                  </span>
                  <span className="text-sm text-slate-500">/ sempre grátis</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Não exige cartão de crédito</p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-900">
                  Funcionalidades incluídas no Gratuito:
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    <span>Perfil comercial verificado + Pino no Mapa de Sorocaba</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    <span>Botão de WhatsApp direto (até 15 cliques monitorados/mês)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    <span>1 foto profissional + 1 palavra-chave local</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    <span>1 degustação gratuita no Criador de Anúncios com IA</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    <span>Link de Indicação B2B Sorocaba (+500 XP por parceiro)</span>
                  </li>
                </ul>

                {/* Interactive Shimmering Padlock Component for Locked Pro Benefits */}
                <ShimmerLockedBenefitsBox
                  onOpenComparisonModal={handleOpenComparisonModal}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPlan('Plano Gratuito')}
              className="w-full py-4 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Começar no Plano Gratuito</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* 2. Plano Premium Pro (Mais Popular) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-slate-950 text-white border-2 border-[#FE3A18] rounded-3xl p-8 flex flex-col justify-between relative shadow-2xl space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#FE3A18]">
                  Mais Escolhido em Sorocaba · Recomendado
                </span>
                <span className="text-xs font-mono text-amber-400">
                  Teste 7 Dias Grátis
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Plano Premium Pro</h3>
                <p className="text-sm text-slate-300 mt-1">
                  Acelerador completo com Inteligência Artificial e prioridade máxima nas buscas locais.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono tabular-nums">
                    {billingCycle === 'annual' ? 'R$ 24,75' : 'R$ 49,90'}
                  </span>
                  <span className="text-sm text-slate-400">/ mês</span>
                </div>
                <p className="text-xs text-emerald-400 font-semibold mt-1">
                  {billingCycle === 'annual'
                    ? `R$ 297 à vista no plano anual · Apenas R$ ${dailyCost} por dia`
                    : 'Ou R$ 24,75/mês no ciclo anual (50% OFF)'}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-amber-400">
                  Tudo do Plano Gratuito mais:
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#FE3A18] shrink-0 mt-1" />
                    <span>
                      <strong className="text-white">Destaque Absoluto no Topo</strong> das buscas do seu bairro
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#FE3A18] shrink-0 mt-1" />
                    <span>
                      <strong className="text-white">Cliques e Orçamentos Ilimitados</strong> direto no WhatsApp
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#FE3A18] shrink-0 mt-1" />
                    <span>
                      <strong className="text-white">Criador & Editor IA Studio Ilimitado</strong> (Gemini)
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#FE3A18] shrink-0 mt-1" />
                    <span>
                      <strong className="text-white">Respostas com IA</strong> para Avaliações de Clientes e Auto-Follow-up
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#FE3A18] shrink-0 mt-1" />
                    <span>
                      <strong className="text-white">Vitrine 3D Pública:</strong> fixe até 4 Insígnias 3D na sua página
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#FE3A18] shrink-0 mt-1" />
                    <span>
                      <strong className="text-white">12 Fotos HD + 2 Vídeos Spotlight</strong> + 10 Palavras-Chave Google
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#FE3A18] shrink-0 mt-1" />
                    <span>
                      <strong className="text-white">Radar AI Local Trends</strong> + Backup Criptografado AES-256
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => onSelectPlan('Plano Premium Pro')}
                className="w-full py-4 rounded-2xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-black text-sm sm:text-base shadow-lg shadow-[#FE3A18]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Crown className="w-4 h-4" />
                <span>Experimentar Premium 7 Dias Grátis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Se paga na 1ª venda · Garantia total de 7 dias</span>
              </div>
            </div>
          </motion.div>

          {/* 3. Plano Enterprise Regional */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col justify-between space-y-8"
          >
            <div className="space-y-6">
              <div>
                <div className="text-xs font-semibold text-purple-700">
                  Para Redes, Clínicas & Líderes de Mercado
                </div>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  Enterprise Regional
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Alcance expandido em toda a Região Metropolitana de Sorocaba (DDD 15) e atendimento VIP.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/80">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 font-mono tabular-nums">
                    {billingCycle === 'annual' ? 'R$ 149' : 'R$ 199'}
                  </span>
                  <span className="text-sm text-slate-500">/ mês</span>
                </div>
                <p className="text-xs text-purple-700 font-semibold mt-1">
                  Inclui Gerente de Conta Dedicado em Sorocaba
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-900">
                  Tudo do Premium Pro mais:
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-purple-600 shrink-0 mt-1" />
                    <span>
                      <strong>Destaque Regional DDD 15:</strong> Sorocaba, Votorantim, Itu e Salto
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-purple-600 shrink-0 mt-1" />
                    <span>
                      <strong>Selo 3D "Diamante Regional"</strong> exclusivo para o Top 1%
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-purple-600 shrink-0 mt-1" />
                    <span>
                      <strong>Galeria e Palavras-Chave Ilimitadas</strong> para domínio no Google
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-purple-600 shrink-0 mt-1" />
                    <span>
                      <strong>Roteamento Multi-Atendentes</strong> no WhatsApp comercial
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-purple-600 shrink-0 mt-1" />
                    <span>
                      <strong>Consultoria Mensal de Tráfego Local</strong> + Multiplicador 3x XP
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPlan('Plano Enterprise Regional')}
              className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Falar com Consultor Enterprise</span>
            </button>
          </motion.div>
        </div>

        {/* Persuasive Value Calculator: Why Premium is a No-Brainer */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-400">
                  MATEMÁTICA DE RETORNO IMEDIATO · RISCO ZERO
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Veja quanto apenas {extraSales} clientes extras por mês representam no seu faturamento:
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Ao contrário de aplicativos de entrega que cobram até 27% de comissão em cada pedido, o GuiaPonto tem{' '}
                  <strong className="text-white">taxa zero sobre suas vendas</strong>. Todo o lucro dos clientes que chamam no WhatsApp fica 100% com você.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">Seu Ticket Médio por Venda:</span>
                    <span className="font-mono font-black text-amber-400 text-sm">
                      R$ {avgTicket}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="1500"
                    step="10"
                    value={avgTicket}
                    onChange={(e) => setAvgTicket(Number(e.target.value))}
                    className="w-full accent-[#FE3A18] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>R$ 30</span>
                    <span>R$ 500</span>
                    <span>R$ 1.500</span>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">Vendas Extras / Mês no WhatsApp:</span>
                    <span className="font-mono font-black text-emerald-400 text-sm">
                      +{extraSales} vendas
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={extraSales}
                    onChange={(e) => setExtraSales(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>1 venda</span>
                    <span>20 vendas</span>
                    <span>50 vendas</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400">Investimento Mensal Premium:</span>
                <span className="text-sm font-mono font-bold text-white">
                  R$ {monthlyCost.toFixed(2).replace('.', ',')} (R$ {dailyCost}/dia)
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400">1 Única Venda de R$ {avgTicket} Paga:</span>
                <span className="text-sm font-mono font-black text-amber-400">
                  {monthsPaidByFirstSale} {monthsPaidByFirstSale === 1 ? 'mês' : 'meses'} de assinatura
                </span>
              </div>

              <div className="pt-1">
                <span className="text-xs font-semibold text-emerald-400 block">
                  Retorno Líquido Estimado no Seu Caixa:
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tabular-nums mt-1">
                  + R$ {netGain.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mês
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectPlan('Plano Premium Pro')}
                className="w-full py-3.5 px-4 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Garantir Meu Destaque Premium Agora</span>
              </button>
            </div>
          </div>
        </div>

        {/* Full Feature Comparison Table */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Comparativo Completo de Funcionalidades: Gratuito vs. Assinatura
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Transparência total sobre o que está disponível gratuitamente e o que você desbloqueia ao assinar.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowFullComparison(!showFullComparison)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer self-start sm:self-center whitespace-nowrap shrink-0"
            >
              {showFullComparison ? 'Ocultar Tabela Comparativa' : 'Ver Tabela Comparativa Completa'}
            </button>
          </div>

          {showFullComparison && (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
                      <th className="py-4 px-5 min-w-[240px]">Recurso / Funcionalidade</th>
                      <th className="py-4 px-5 min-w-[180px]">Plano Gratuito (R$ 0)</th>
                      <th className="py-4 px-5 min-w-[220px] bg-orange-50/60 text-[#FE3A18]">
                        Plano Premium Pro (R$ 24,75/mês)
                      </th>
                      <th className="py-4 px-5 min-w-[200px]">Enterprise Regional (R$ 149/mês)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                    {PUBLIC_COMPARISON_ITEMS.map((item) => (
                      <tr key={item.feature} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-5">
                          <span className="text-[11px] font-semibold text-slate-400 block">
                            {item.category}
                          </span>
                          <span className="font-bold text-slate-900">{item.feature}</span>
                        </td>
                        <td className="py-4 px-5 text-slate-600">
                          {item.free === false ? (
                            <span className="inline-flex items-center gap-1.5 text-slate-400">
                              <X className="w-4 h-4 text-slate-300 shrink-0" />
                              <span>Não incluído</span>
                            </span>
                          ) : (
                            <span>{item.free}</span>
                          )}
                        </td>
                        <td className="py-4 px-5 bg-orange-50/30 font-bold text-slate-900">
                          <div className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[#FE3A18] shrink-0 mt-0.5" />
                            <span>{item.premium}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 font-semibold text-slate-800">
                          <div className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                            <span>{item.enterprise}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Side-by-Side Comparison Modal (Gratuito vs. Pro) */}
      <FreeVsProComparisonModal
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
        onSelectProPlan={() => onSelectPlan('Plano Premium Pro')}
        onContinueFreePlan={() => onSelectPlan('Plano Gratuito')}
        initialHighlightedBenefitId={highlightedBenefitId}
      />
    </section>
  );
}
