import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  X,
  Crown,
  Zap,
  TrendingUp,
  Calculator,
  Lock,
  Unlock,
  ArrowRight,
  ShieldCheck,
  Award,
  BarChart3,
  MessageSquare,
  Bot,
  Globe,
  Layers,
  Target,
  DollarSign,
  Users
} from 'lucide-react';
import { triggerAchievementCelebration } from './AchievementCelebration';
import {
  ShimmerLockedBenefitsBox,
  FreeVsProComparisonModal
} from '../ui/FreePlanLockedBenefitsAndModal';
import {
  MercadoPagoCheckoutModal,
  MercadoPagoGatewayStatusPanel
} from '../ui/MercadoPagoCheckoutModal';

export interface MonetizationFeatureRow {
  id: string;
  category: 'Vitrine & Posicionamento Local' | 'Inteligência Artificial & Automação' | 'Reputação, Gamificação & Insígnias 3D' | 'Segurança, Dados & Suporte';
  feature: string;
  description: string;
  freeValue: string | boolean;
  premiumValue: string | boolean;
  enterpriseValue: string | boolean;
  conversionTriggerNote: string;
}

export const MONETIZATION_FEATURE_MATRIX: MonetizationFeatureRow[] = [
  // 1. Vitrine & Posicionamento Local
  {
    id: 'vitrine-1',
    category: 'Vitrine & Posicionamento Local',
    feature: 'Perfil Comercial & Geolocalização em Sorocaba',
    description: 'Presença no mapa interativo e listagem por bairro (Campolim, Santa Rosália, Centro, etc.).',
    freeValue: 'Listagem Padrão (Ordem Alfabética)',
    premiumValue: 'Topo das Buscas + Destaque Patrocinado no Bairro',
    enterpriseValue: 'Dominância Regional (Sorocaba + RM) & Pino Ouro no Mapa',
    conversionTriggerNote: 'Porta de entrada gratuita: o lojista vê sua empresa no mapa, mas percebe os concorrentes Premium acima dele.'
  },
  {
    id: 'vitrine-2',
    category: 'Vitrine & Posicionamento Local',
    feature: 'Botão Direto de Orçamento via WhatsApp',
    description: 'Recebimento de contatos direto no WhatsApp comercial sem comissão sobre vendas.',
    freeValue: 'Até 15 cliques monitorados/mês',
    premiumValue: 'Cliques Ilimitados + Mensagem Pré-Formatada por Anúncio',
    enterpriseValue: 'Cliques Ilimitados + Roteamento Multi-Atendentes',
    conversionTriggerNote: 'Ao atingir 15 leads gratuitos no mês, o painel avisa que novos clientes estão buscando a empresa, estimulando o upgrade imediato.'
  },
  {
    id: 'vitrine-3',
    category: 'Vitrine & Posicionamento Local',
    feature: 'Galeria de Fotos HD & Vitrine de Vídeo (Spotlight)',
    description: 'Exibição visual de produtos, cardápios, instalações e vídeos demonstrativos.',
    freeValue: '1 Foto da Fachada / Logo',
    premiumValue: 'Até 12 Fotos HD + 2 Vídeos Spotlight na Vitrine',
    enterpriseValue: 'Galeria Ilimitada + Produção de Vídeo Destaque',
    conversionTriggerNote: 'Perfis com vídeo e 8+ fotos convertem 3,4x mais clientes; o plano gratuito mostra os slots extras bloqueados com preview.'
  },
  {
    id: 'vitrine-4',
    category: 'Vitrine & Posicionamento Local',
    feature: 'Palavras-Chave de Intenção de Compra (SEO Local)',
    description: 'Indexação para termos estratégicos buscados no Google e no diretório GuiaPonto.',
    freeValue: '1 Palavra-chave básica',
    premiumValue: '10 Palavras-chave + Otimizador Google SERP com Rich Snippets',
    enterpriseValue: 'Palavras-chave Ilimitadas + Landing Page Dedicada com QR Code',
    conversionTriggerNote: 'O lojista gratuito descobre no painel quais termos os clientes estão pesquisando em Sorocaba e assina para destravar as palavras-chave.'
  },

  // 2. Inteligência Artificial & Automação
  {
    id: 'ia-1',
    category: 'Inteligência Artificial & Automação',
    feature: 'Criador & Editor de Anúncios com IA (Cacilda AI Studio)',
    description: 'Geração automática de títulos persuasivos, ofertas e chamadas para ação.',
    freeValue: '1 Teste de Geração IA (Degustação)',
    premiumValue: 'Gerações Ilimitadas em 4 Tons Comerciais',
    enterpriseValue: 'Ilimitado + Treinamento Personalizado na Voz da Marca',
    conversionTriggerNote: 'Efeito "Aha!": o usuário experimenta 1 criação gratuita com IA, vê a qualidade profissional e assina para usar em todas as campanhas.'
  },
  {
    id: 'ia-2',
    category: 'Inteligência Artificial & Automação',
    feature: 'CRM de Leads & Auto-Follow-up por E-mail com IA',
    description: 'Respostas automáticas hiper-personalizadas por categoria para fechar vendas rápidas.',
    freeValue: false,
    premiumValue: 'Incluso (Rascunhos & Disparo em 1 Clique)',
    enterpriseValue: 'Automação Completa + Cadência Multi-Canal',
    conversionTriggerNote: 'Mostra o rascunho pronto gerado pela IA para o primeiro lead recebido, liberando o envio contínuo no plano Premium.'
  },
  {
    id: 'ia-3',
    category: 'Inteligência Artificial & Automação',
    feature: 'AI Local Trends Dashboard (Volume de Buscas em Sorocaba)',
    description: 'Análise preditiva de demanda mensal, janelas de pico e oportunidades de crescimento.',
    freeValue: 'Visão Resumida da Categoria',
    premiumValue: 'Radar Completo de Buscas + 4 Oportunidades de Crescimento IA/mês',
    enterpriseValue: 'Inteligência Competitiva Comparativa por Bairro',
    conversionTriggerNote: 'Exibe o volume total de buscas do bairro (ex: 18.400 buscas no Campolim) e convida o lojista a capturar essa demanda no Premium.'
  },
  {
    id: 'ia-4',
    category: 'Inteligência Artificial & Automação',
    feature: 'Calendário Inteligente de Horários de Pico (Drag & Drop)',
    description: 'Agendamento automático de anúncios nos horários de almoço, happy hour e pico comercial.',
    freeValue: false,
    premiumValue: 'Até 15 Agendamentos Semanais de Alta Conversão',
    enterpriseValue: 'Agendamentos Ilimitados + Boost Automático de Lance IA',
    conversionTriggerNote: 'Aumenta o CTR em +38% sem exigir esforço diário do comerciante.'
  },

  // 3. Reputação, Gamificação & Insígnias 3D
  {
    id: 'rep-1',
    category: 'Reputação, Gamificação & Insígnias 3D',
    feature: 'Central de Gestão de Avaliações & Respostas com IA',
    description: 'Agregação de avaliações por estrelas e respostas automáticas para feedbacks positivos ou críticos.',
    freeValue: 'Visualização de Avaliações Públicas',
    premiumValue: 'Respostas IA Ilimitadas + Filtro Inteligente de Sentimento',
    enterpriseValue: 'Gestão Multi-Unidades + Auditoria de Reputação',
    conversionTriggerNote: 'Quando uma avaliação 3★ ou 5★ chega, o painel oferece um botão "Responder com IA em 5 segundos" exclusivo para assinantes.'
  },
  {
    id: 'rep-2',
    category: 'Reputação, Gamificação & Insígnias 3D',
    feature: 'Badge Showcase 3D & Fixação na Landing Page Pública',
    description: 'Insígnias colecionáveis em 3D (Top Rated 4.9★, Resposta Flash, Pioneiro Sorocaba) na vitrine.',
    freeValue: '1 Insígnia Básica no Painel Interno',
    premiumValue: 'Fixar até 4 Insígnias 3D na Página Pública (+24% Confiança)',
    enterpriseValue: 'Todas as Insígnias 3D + Selo Exclusivo "Diamante Regional"',
    conversionTriggerNote: 'Aversão à perda e status social: o lojista conquista medalhas no painel e assina o Premium para exibi-las aos clientes na vitrine pública.'
  },
  {
    id: 'rep-3',
    category: 'Reputação, Gamificação & Insígnias 3D',
    feature: 'Multiplicador de XP no Ranking da Comunidade Sorocaba',
    description: 'Suba de nível mais rápido no Leaderboard de negócios verificados de Sorocaba.',
    freeValue: 'Ganho de XP Padrão (1x)',
    premiumValue: 'Multiplicador Turbo 2x XP + Status GuiaPonto Pro Gold',
    enterpriseValue: 'Multiplicador 3x XP + Status GuiaPonto Pro Legend VIP',
    conversionTriggerNote: 'Gamificação competitiva entre comércios locais do mesmo bairro.'
  },

  // 4. Segurança, Dados & Suporte
  {
    id: 'sec-1',
    category: 'Segurança, Dados & Suporte',
    feature: 'Backup Automático & Exportação JSON Criptografada (AES-GCM 256)',
    description: 'Proteção integral de anúncios, carteira de leads e histórico de avaliações com senha.',
    freeValue: 'Exportação Manual Básica',
    premiumValue: 'Backup Automático Agendado + Cofre Criptografado AES-256',
    enterpriseValue: 'Backup Diário em Nuvem + Auditoria Completa LGPD',
    conversionTriggerNote: 'Segurança patrimonial digital: conforme a carteira de leads cresce, o lojista assina para nunca perder seu histórico comercial.'
  },
  {
    id: 'sec-2',
    category: 'Segurança, Dados & Suporte',
    feature: 'Relatórios Executivos em PDF & Calculadora Preditiva de ROI',
    description: 'Demonstrativo mensal de impressões, cliques, leads e faturamento estimado.',
    freeValue: 'Resumo Mensal Simplificado',
    premiumValue: 'Exportação PDF Executivo + Simulador de Receita Completo',
    enterpriseValue: 'Relatórios White-Label + Consultor Dedicado em Sorocaba',
    conversionTriggerNote: 'Comprova tangivelmente o retorno sobre o investimento todo mês, reduzindo o cancelamento (churn) para menos de 2%.'
  }
];

export const STRATEGIC_PERSUASION_PILLARS = [
  {
    step: '01',
    title: 'Isca de Valor Imediato (Aquisição Freemium Sem Atrito)',
    subtitle: 'Objetivo: Colocar 100% dos comércios de Sorocaba dentro da plataforma em menos de 3 minutos.',
    mechanism: 'O lojista cadastra sua empresa gratuitamente, aparece no mapa geolocalizado de Sorocaba, ganha 1 degustação do Criador de Anúncios com IA e recebe seus primeiros cliques no WhatsApp.',
    psychologicalTrigger: 'Reciprocidade & Efeito Dotação (Endowment Effect)',
    conversionImpact: 'Taxa de ativação inicial de 68% dos visitantes comerciais.'
  },
  {
    step: '02',
    title: 'Gatilho do "Lead Visível & Demanda Reprimida"',
    subtitle: 'Objetivo: Mostrar dinheiro real na mesa antes de pedir o cartão de crédito.',
    mechanism: 'O painel gratuito mostra exatamente quantas buscas ocorreram no bairro (ex: "1.420 pessoas buscaram sua categoria no Campolim este mês") e avisa quando o limite de 15 cliques gratuitos no WhatsApp está prestes a ser atingido.',
    psychologicalTrigger: 'Aversão à Perda (FOMO Comercial)',
    conversionImpact: '34% dos lojistas migram para o Premium assim que atingem o 12º clique no WhatsApp.'
  },
  {
    step: '03',
    title: 'Ancoragem de Preço Irresistível ("Custo de 1 Cafezinho")',
    subtitle: 'Objetivo: Eliminar a objeção financeira comparando a assinatura ao ticket médio de 1 única venda.',
    mechanism: 'No plano anual (R$ 297/ano ou R$ 24,75/mês), o investimento equivale a R$ 0,82 por dia. Basta fechar 1 único pedido ou serviço no mês pelo WhatsApp para pagar a assinatura do ano inteiro.',
    psychologicalTrigger: 'Ancoragem de ROI Assimétrico (Despesa Micro vs. Retorno Macro)',
    conversionImpact: 'Aumenta a escolha pelo ciclo Anual em 72%, garantindo fluxo de caixa imediato.'
  },
  {
    step: '04',
    title: 'Status Social B2B & Vitrine de Insígnias 3D',
    subtitle: 'Objetivo: Transformar reputação digital em orgulho do proprietário e barreira de saída.',
    mechanism: 'O lojista desbloqueia conquistas 3D no painel (Pioneiro Sorocaba, Top Rated 4.9★, Resposta Flash), mas fixar até 4 troféus 3D no topo da Landing Page pública é um privilégio do assinante Premium.',
    psychologicalTrigger: 'Prova Social Verificada & Prestígio Local',
    conversionImpact: 'Reduz o cancelamento (churn) em 64%, pois o lojista não quer perder seus selos públicos.'
  },
  {
    step: '05',
    title: 'Crescimento Viral "Indique um Negócio Local" (CAC Zero)',
    subtitle: 'Objetivo: Fazer cada assinante trazer 2 a 3 novos lojistas vizinhos em Sorocaba.',
    mechanism: 'Ao indicar um comércio parceiro pelo link exclusivo, ambos ganham +500 XP e a insígnia 3D "Local Connector". Acumulando indicações, o lojista ganha descontos na renovação Premium.',
    psychologicalTrigger: 'Loop Viral B2B & Comunidade Regional DDD 15',
    conversionImpact: 'Reduz o Custo de Aquisição de Clientes (CAC) em 58% na expansão regional.'
  }
];

interface MonetizationStrategyHubProps {
  currentPlan: 'gratuito' | 'premium' | 'enterprise';
  onSelectPlan: (plan: 'gratuito' | 'premium' | 'enterprise', billingCycle: 'annual' | 'monthly') => void;
  onAwardXp?: (points: number, reason: string) => void;
}

export function MonetizationStrategyHub({
  currentPlan,
  onSelectPlan,
  onAwardXp
}: MonetizationStrategyHubProps) {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Todas');
  const [averageTicket, setAverageTicket] = useState<number>(120);
  const [estimatedExtraSalesPerMonth, setEstimatedExtraSalesPerMonth] = useState<number>(14);
  const [activeStrategyTab, setActiveStrategyTab] = useState<'plans' | 'matrix' | 'playbook'>('plans');
  const [comparisonModalOpen, setComparisonModalOpen] = useState<boolean>(false);
  const [highlightedBenefitId, setHighlightedBenefitId] = useState<string | null>(null);
  const [mpModalOpen, setMpModalOpen] = useState<boolean>(false);
  const [mpPlanId, setMpPlanId] = useState<'premium' | 'enterprise'>('premium');

  const handleOpenMercadoPagoCheckout = (
    targetPlan: 'premium' | 'enterprise'
  ) => {
    setMpPlanId(targetPlan);
    setMpModalOpen(true);
  };

  const handleOpenComparisonModal = (benefitId?: string) => {
    setHighlightedBenefitId(benefitId || null);
    setComparisonModalOpen(true);
  };

  const monthlyEquivalentPrice = billingCycle === 'annual' ? 24.75 : 49.90;
  const annualTotal = 297;
  const dailyCost = (monthlyEquivalentPrice / 30).toFixed(2).replace('.', ',');

  const monthlyExtraRevenue = averageTicket * estimatedExtraSalesPerMonth;
  const netMonthlyProfit = monthlyExtraRevenue - monthlyEquivalentPrice;
  const roiMultiple = Math.max(1, Math.round(monthlyExtraRevenue / monthlyEquivalentPrice));

  const categories = [
    'Todas',
    'Vitrine & Posicionamento Local',
    'Inteligência Artificial & Automação',
    'Reputação, Gamificação & Insígnias 3D',
    'Segurança, Dados & Suporte'
  ];

  const filteredMatrix = MONETIZATION_FEATURE_MATRIX.filter(
    (row) => selectedCategoryFilter === 'Todas' || row.category === selectedCategoryFilter
  );

  const handleActivatePlan = (plan: 'gratuito' | 'premium' | 'enterprise') => {
    onSelectPlan(plan, billingCycle);
    if (plan === 'premium') {
      if (onAwardXp) onAwardXp(600, 'Ativou Assinatura Plano Premium Pro Sorocaba');
      triggerAchievementCelebration({
        type: 'badge',
        title: 'Assinante Premium Pro Ativo!',
        subtitle: 'Destaque Máximo & IA Ilimitada Desbloqueados',
        description:
          'Sua empresa agora conta com posicionamento prioritário em Sorocaba, Cacilda AI Studio ilimitado, até 4 insígnias 3D públicas e multiplicador 2x XP.',
        xpEarned: 600,
        rarity: 'Lendário',
        trustBoostLabel: '+340% Visibilidade e Leads no WhatsApp',
        badgeIconType: 'crown_top',
        badgePalette: {
          primary: '#FBBF24',
          secondary: '#B45309',
          glow: 'rgba(251, 191, 36, 0.5)',
          rim: '#FEF08A',
          bgGradient: 'from-yellow-500/25 via-amber-700/15 to-slate-900',
          badgeText: 'text-yellow-300'
        }
      });
    } else if (plan === 'enterprise') {
      if (onAwardXp) onAwardXp(1000, 'Upgrade para Plano Enterprise Dominância Regional');
      triggerAchievementCelebration({
        type: 'badge',
        title: 'Dominância Regional • Enterprise VIP',
        subtitle: 'Selo Diamante Regional & Prioridade Máxima DDD 15',
        description:
          'Você desbloqueou o nível máximo do ecossistema GuiaPonto com cobertura em toda a Região Metropolitana de Sorocaba e gerente dedicado.',
        xpEarned: 1000,
        rarity: 'Lendário',
        trustBoostLabel: 'Top 1% Autoridade Regional Sorocaba',
        badgeIconType: 'diamond_elite',
        badgePalette: {
          primary: '#E879F9',
          secondary: '#7E22CE',
          glow: 'rgba(232, 121, 249, 0.5)',
          rim: '#FAE8FF',
          bgGradient: 'from-fuchsia-500/25 via-purple-800/15 to-slate-900',
          badgeText: 'text-fuchsia-300'
        }
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Strategic Header & Sub-Navigation */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6 overflow-hidden">
        <div className="flex flex-col gap-5">
          <div className="space-y-2 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-400">
              <span>ARQUITETURA DE MONETIZAÇÃO & PLANOS</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">FREEMIUM PRODUCT-LED GROWTH (SOROCABA & REGIÃO)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Plano Estratégico de Monetização & Assinatura GuiaPonto
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Estrutura desenhada para atrair comércios locais sem barreira de entrada no{' '}
              <strong className="text-white">Plano Gratuito</strong> e converter em assinantes recorrentes no{' '}
              <strong className="text-amber-400">Plano Premium Pro</strong> através de Inteligência Artificial, prova social 3D e ROI imediato no WhatsApp.
            </p>
          </div>

          {/* Segmented Mode Selector */}
          <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-2xl w-full sm:w-auto self-start">
            <button
              type="button"
              onClick={() => setActiveStrategyTab('plans')}
              className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStrategyTab === 'plans'
                  ? 'bg-[#FE3A18] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Planos & Calculadora ROI
            </button>
            <button
              type="button"
              onClick={() => setActiveStrategyTab('matrix')}
              className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStrategyTab === 'matrix'
                  ? 'bg-[#FE3A18] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Gratuito vs. Assinatura
            </button>
            <button
              type="button"
              onClick={() => setActiveStrategyTab('playbook')}
              className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStrategyTab === 'playbook'
                  ? 'bg-[#FE3A18] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3. Playbook de Persuasão
            </button>
            <button
              type="button"
              onClick={() => handleOpenComparisonModal()}
              className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Modal Gratuito vs. Pro</span>
            </button>
          </div>
        </div>

        {/* Summary Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 block">Investimento Diário (Plano Anual)</span>
            <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums mt-1">
              R$ {dailyCost} / dia
            </div>
            <span className="text-xs text-slate-400 mt-0.5 block">
              Menos que um café expresso por dia
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 block">Payback Médio do Assinante</span>
            <div className="text-2xl font-black text-white font-mono tabular-nums mt-1">
              1ª Venda no Mês
            </div>
            <span className="text-xs text-amber-400 mt-0.5 block">
              0% de comissão sobre vendas no WhatsApp
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 block">Aumento Médio de Leads (Premium)</span>
            <div className="text-2xl font-black text-[#FE3A18] font-mono tabular-nums mt-1">
              +340% Cliques
            </div>
            <span className="text-xs text-slate-400 mt-0.5 block">
              Topo das buscas + SEO Google + IA Studio
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 block">Seu Plano Atual no Escritório</span>
            <div className="text-2xl font-black text-amber-400 mt-1 capitalize">
              {currentPlan === 'gratuito'
                ? 'Plano Gratuito'
                : currentPlan === 'premium'
                ? 'Premium Pro'
                : 'Enterprise VIP'}
            </div>
            <span className="text-xs text-emerald-400 mt-0.5 block">
              Garantia incondicional de 7 dias
            </span>
          </div>
        </div>
      </div>

      {/* TAB 1: PRICING TIERS & PERSUASIVE ROI CALCULATOR */}
      {activeStrategyTab === 'plans' && (
        <div className="space-y-8">
          {/* Billing Cadence Switcher */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 overflow-hidden">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Escolha o Ciclo de Assinatura (Desconto Estratégico de 50% no Anual)
              </h3>
              <p className="text-xs text-slate-500">
                A ancoragem anual reduz o custo mensal de R$ 49,90 para o equivalente a R$ 24,75/mês (R$ 297/ano).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl self-start lg:self-center">
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-[#FE3A18] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Anual · R$ 24,75/mês (Economize 50%)
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[#FE3A18] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mensal · R$ 49,90/mês
              </button>
            </div>
          </div>

          {/* 3-Tier Strategic Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* TIER 1: PLANO GRATUITO (PORTA DE ENTRADA) */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div>
                  <div className="text-xs font-semibold text-slate-500">
                    Para iniciantes · Porta de Entrada Sem Custo
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    Plano Gratuito
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Posicione sua empresa no mapa de Sorocaba e sinta o gosto dos primeiros contatos via WhatsApp.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 font-mono tabular-nums">
                      R$ 0
                    </span>
                    <span className="text-xs text-slate-500">/ grátis para sempre</span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-1">
                    Sem necessidade de cartão de crédito
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-slate-900">
                    O que entra no Plano Gratuito:
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Perfil comercial básico + Pino no Mapa de Sorocaba</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Botão direto de WhatsApp (até 15 cliques monitorados/mês)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>1 Foto principal do negócio + 1 Palavra-chave local</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>1 Teste gratuito no Criador de Anúncios com IA</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Acesso ao Programa Indique um Negócio Local (+500 XP)</span>
                    </li>
                  </ul>

                  {/* Interactive Shimmering Padlock Component for Locked Pro Benefits */}
                  <ShimmerLockedBenefitsBox
                    onOpenComparisonModal={handleOpenComparisonModal}
                    variant="compact"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleActivatePlan('gratuito')}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                  currentPlan === 'gratuito'
                    ? 'bg-slate-100 text-slate-600 border border-slate-300'
                    : 'bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {currentPlan === 'gratuito' ? 'Plano Gratuito Ativo' : 'Simular Plano Gratuito'}
              </button>
            </div>

            {/* TIER 2: PLANO PREMIUM PRO (O MOTOR DE CONVERSÃO RECOMENDADO) */}
            <div className="bg-slate-950 text-white rounded-3xl p-7 border-2 border-[#FE3A18] shadow-2xl flex flex-col justify-between space-y-6 relative">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#FE3A18]">
                    Mais Assinado em Sorocaba · Recomendado
                  </span>
                  <span className="text-xs font-mono text-amber-400">
                    7 Dias Grátis
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">
                    Plano Premium Pro
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Para negócios que querem dominar o topo do seu bairro em Sorocaba e ter a IA trabalhando 24h por dia.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-white font-mono tabular-nums">
                      {billingCycle === 'annual' ? 'R$ 24,75' : 'R$ 49,90'}
                    </span>
                    <span className="text-xs text-slate-400">/ mês</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold block mt-1">
                    {billingCycle === 'annual'
                      ? `Faturado R$ ${annualTotal}/ano (Equivale a R$ ${dailyCost} por dia)`
                      : 'Ou R$ 24,75/mês no plano anual (50% de economia)'}
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-amber-400">
                    Tudo do Gratuito + Poder Total de Conversão:
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-200">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#FE3A18] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">Topo Absoluto nas Buscas</strong> do seu bairro e categoria em Sorocaba
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#FE3A18] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">Cliques e Leads Ilimitados</strong> no WhatsApp (0% comissão)
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#FE3A18] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">Cacilda AI Studio Ilimitado:</strong> criação de anúncios e ofertas com Gemini
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#FE3A18] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">Auto-Follow-up de Leads & Resposta de Avaliações com IA</strong> em 1 clique
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#FE3A18] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">Vitrine 3D Pública:</strong> fixe até 4 Insígnias 3D na sua Landing Page (+24% conversão)
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#FE3A18] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">AI Local Trends Sorocaba:</strong> volume mensal de buscas e oportunidades
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#FE3A18] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">Galeria 12 Fotos HD + 2 Vídeos Spotlight</strong> + 10 Palavras-Chave Google SEO
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#FE3A18] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">Backup Automático Criptografado (AES-256)</strong> + Relatórios PDF Executivos
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleOpenMercadoPagoCheckout('premium')}
                  className="w-full py-4 px-5 rounded-2xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#FE3A18]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  <span>
                    {currentPlan === 'premium'
                      ? 'Assinatura Premium Ativa (Mercado Pago)'
                      : 'Assinar via Mercado Pago (PIX & Cartão)'}
                  </span>
                </button>
                <div className="text-center text-[11px] text-slate-400">
                  Mercado Pago Brasil · 7 dias grátis · Se paga na 1ª venda
                </div>
              </div>
            </div>

            {/* TIER 3: PLANO ENTERPRISE DOMINÂNCIA REGIONAL */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div>
                  <div className="text-xs font-semibold text-purple-700">
                    Para Redes, Clínicas, Imobiliárias & Líderes Regionais
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    Enterprise Regional
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Dominância em toda a Região Metropolitana de Sorocaba (DDD 15), múltiplas unidades e suporte VIP dedicado.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-slate-900 font-mono tabular-nums">
                      {billingCycle === 'annual' ? 'R$ 149' : 'R$ 199'}
                    </span>
                    <span className="text-xs text-slate-500">/ mês</span>
                  </div>
                  <span className="text-xs text-purple-700 font-semibold block mt-1">
                    Inclui Gerente de Conta Dedicado + Selo Diamante Regional
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-slate-900">
                    Tudo do Premium Pro + Exclusividades VIP:
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Alcance Regional Expandido:</strong> Sorocaba, Votorantim, Itu, Salto e Itapetininga
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Selo 3D "Diamante Regional"</strong> exclusivo para o Top 1% do diretório
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Agendamento Automático Ilimitado</strong> nos Horários de Pico (Almoço & Jantar)
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Roteamento de WhatsApp Multi-Unidades</strong> ou múltiplos consultores de vendas
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Consultoria Mensal de Tráfego & SEO</strong> com especialista GuiaPonto
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Multiplicador 3x XP</strong> no Ranking da Comunidade GuiaPonto
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenMercadoPagoCheckout('enterprise')}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  currentPlan === 'enterprise'
                    ? 'bg-purple-700 text-white shadow-md'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>
                  {currentPlan === 'enterprise'
                    ? 'Plano Enterprise VIP Ativo'
                    : 'Assinar Enterprise (Mercado Pago)'}
                </span>
              </button>
            </div>
          </div>

          {/* Live Mercado Pago Gateway Monitor Panel */}
          <MercadoPagoGatewayStatusPanel
            onOpenCheckout={(plan) =>
              handleOpenMercadoPagoCheckout(plan || 'premium')
            }
          />

          {/* Interactive Persuasion Tool: "Why Premium Pays for Itself on Sale #1" Calculator */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#FE3A18]">
                  SIMULADOR DE VIABILIDADE COMERCIAL · ARGUMENTO DE FECHAMENTO
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Calculadora: Por que o Plano Premium se paga já no 1º cliente do mês?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Ajuste o ticket médio do seu negócio e veja como a diferença entre ficar escondido no gratuito vs. aparecer no topo do Premium impacta seu caixa.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {[
                  { label: 'Gastronomia (R$ 75)', ticket: 75, sales: 22 },
                  { label: 'Estética & Saúde (R$ 260)', ticket: 260, sales: 12 },
                  { label: 'Oficina Auto (R$ 340)', ticket: 340, sales: 10 },
                  { label: 'Imobiliária / Serviços (R$ 950)', ticket: 950, sales: 6 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setAverageTicket(preset.ticket);
                      setEstimatedExtraSalesPerMonth(preset.sales);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border whitespace-nowrap shrink-0 ${
                      averageTicket === preset.ticket
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Sliders */}
              <div className="lg:col-span-6 space-y-5">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Valor Médio de 1 Venda / Serviço (Ticket Médio)
                    </label>
                    <span className="text-base font-black text-slate-900 font-mono tabular-nums">
                      R$ {averageTicket.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="2000"
                    step="10"
                    value={averageTicket}
                    onChange={(e) => setAverageTicket(Number(e.target.value))}
                    className="w-full accent-[#FE3A18] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>R$ 30</span>
                    <span>R$ 500</span>
                    <span>R$ 2.000</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Novas Vendas Extras/Mês Geradas pelo Destaque Premium + IA
                    </label>
                    <span className="text-base font-black text-[#FE3A18] font-mono tabular-nums">
                      {estimatedExtraSalesPerMonth} vendas/mês
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    step="1"
                    value={estimatedExtraSalesPerMonth}
                    onChange={(e) => setEstimatedExtraSalesPerMonth(Number(e.target.value))}
                    className="w-full accent-[#FE3A18] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>1 venda/mês</span>
                    <span>15 vendas/mês</span>
                    <span>60 vendas/mês</span>
                  </div>
                </div>
              </div>

              {/* Resulting Persuasive Math Card */}
              <div className="lg:col-span-6 bg-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
                    <span className="text-xs text-slate-400 block">Custo Mensal Premium</span>
                    <div className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums mt-1">
                      R$ {monthlyEquivalentPrice.toFixed(2).replace('.', ',')}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      R$ {dailyCost} por dia no plano anual
                    </span>
                  </div>

                  <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
                    <span className="text-xs text-slate-400 block">Receita Extra Estimada</span>
                    <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tabular-nums mt-1">
                      R$ {monthlyExtraRevenue.toLocaleString('pt-BR')}
                    </div>
                    <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
                      Multiplicador de {roiMultiple}x sobre a assinatura
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-300 block">
                      Lucro Líquido Mensal Após Pagar o GuiaPonto:
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums mt-0.5">
                      + R$ {netMonthlyProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mês
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleActivatePlan('premium')}
                    className="px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Destravar Esse Retorno
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-amber-400">Conclusão Estratégica:</strong> Com um ticket médio de{' '}
                  <strong>R$ {averageTicket}</strong>, basta fechar{' '}
                  <strong className="text-white">1 única venda</strong> através do botão de WhatsApp para pagar{' '}
                  <strong>{Math.max(1, Math.floor(averageTicket / monthlyEquivalentPrice))} meses inteiros</strong> de assinatura Premium.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPLETE FEATURE MATRIX (GRATUITO VS ASSINATURA) */}
      {activeStrategyTab === 'matrix' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Matriz Detalhada: O que entra no Plano Gratuito vs. Assinatura Premium
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Cada funcionalidade gratuita foi desenhada para gerar valor imediato e criar o desejo natural de upgrade para o Plano Premium.
              </p>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedCategoryFilter === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
                  <th className="py-4 px-4 min-w-[240px]">Funcionalidade & Módulo</th>
                  <th className="py-4 px-4 min-w-[170px]">Plano Gratuito (R$ 0)</th>
                  <th className="py-4 px-4 min-w-[210px] bg-orange-50/60 text-[#FE3A18]">
                    Plano Premium Pro (R$ 24,75/mês)
                  </th>
                  <th className="py-4 px-4 min-w-[190px]">Enterprise Regional (R$ 149/mês)</th>
                  <th className="py-4 px-4 min-w-[250px]">Gatilho Psicológico de Upgrade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {filteredMatrix.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 align-top">
                      <div className="text-[11px] font-semibold text-slate-400">
                        {row.category}
                      </div>
                      <div className="font-black text-slate-900 text-sm mt-0.5">
                        {row.feature}
                      </div>
                      <p className="text-slate-500 mt-1 leading-relaxed">
                        {row.description}
                      </p>
                    </td>

                    <td className="py-4 px-4 align-top">
                      {row.freeValue === false ? (
                        <span className="inline-flex items-center gap-1.5 text-slate-400 font-semibold">
                          <X className="w-4 h-4 text-slate-300 shrink-0" />
                          <span>Não incluído</span>
                        </span>
                      ) : (
                        <span className="font-semibold text-slate-700 leading-relaxed block">
                          {row.freeValue}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 align-top bg-orange-50/30">
                      <div className="flex items-start gap-2 font-bold text-slate-900">
                        <Check className="w-4 h-4 text-[#FE3A18] shrink-0 mt-0.5" />
                        <span>{row.premiumValue}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 align-top">
                      <div className="flex items-start gap-2 font-semibold text-purple-900">
                        <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                        <span>{row.enterpriseValue}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 align-top">
                      <p className="text-slate-600 leading-relaxed">
                        {row.conversionTriggerNote}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: STRATEGIC MONETIZATION & PERSUASION PLAYBOOK */}
      {activeStrategyTab === 'playbook' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="max-w-3xl space-y-2">
              <div className="text-xs font-bold text-[#FE3A18]">
                ENGENHARIA DE CONVERSÃO B2B · SOROCABA & REGIÃO
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Os 5 Pilares Estratégicos para Converter Usuários Gratuitos em Assinantes Premium
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Em vez de bloquear toda a plataforma com um paywall frio, o GuiaPonto utiliza a metodologia{' '}
                <strong>Product-Led Growth (PLG)</strong>: entregamos uma vitória rápida no plano gratuito e usamos dados reais de demanda local para tornar o upgrade uma decisão financeira óbvia.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {STRATEGIC_PERSUASION_PILLARS.map((pillar) => (
                <div
                  key={pillar.step}
                  className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-colors grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
                >
                  <div className="lg:col-span-4 space-y-1.5">
                    <div className="text-xs font-mono font-bold text-[#FE3A18]">
                      PILAR ESTRATÉGICO {pillar.step}
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {pillar.subtitle}
                    </p>
                  </div>

                  <div className="lg:col-span-5 space-y-1.5">
                    <div className="text-xs font-bold text-slate-700">
                      Mecanismo Prático no Produto:
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {pillar.mechanism}
                    </p>
                  </div>

                  <div className="lg:col-span-3 bg-slate-900 text-white rounded-2xl p-4 space-y-2">
                    <div className="text-[11px] text-amber-400 font-semibold">
                      Gatilho: {pillar.psychologicalTrigger}
                    </div>
                    <div className="text-xs font-bold text-emerald-400">
                      Impacto: {pillar.conversionImpact}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Call to Action inside Playbook */}
            <div className="p-6 rounded-2xl bg-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-base font-black text-white">
                  Pronto para aplicar o destaque máximo na vitrine da sua empresa?
                </h4>
                <p className="text-xs text-slate-300">
                  Ative o Plano Premium Pro agora e ganhe +600 XP imediatos + Insígnia 3D de Liderança em Sorocaba.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveStrategyTab('plans');
                  handleActivatePlan('premium');
                }}
                className="px-6 py-3.5 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-black text-xs transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>Ativar Plano Premium Pro</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal (Gratuito vs. Pro) */}
      <FreeVsProComparisonModal
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
        onSelectProPlan={(selectedCycle) => {
          setBillingCycle(selectedCycle);
          setComparisonModalOpen(false);
          handleOpenMercadoPagoCheckout('premium');
        }}
        onContinueFreePlan={() => handleActivatePlan('gratuito')}
        initialHighlightedBenefitId={highlightedBenefitId}
      />

      {/* Mercado Pago Checkout Modal */}
      <MercadoPagoCheckoutModal
        isOpen={mpModalOpen}
        onClose={() => setMpModalOpen(false)}
        initialPlanId={mpPlanId}
        initialBillingCycle={billingCycle}
        onSubscriptionCompleted={(tx) => {
          handleActivatePlan(tx.planId);
        }}
      />
    </div>
  );
}
