import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Search,
  Check,
  X,
  Plus,
  Edit3,
  Trash2,
  ArrowLeft,
  Crown,
  Lock,
  Unlock,
  AlertTriangle,
  BarChart3,
  Settings,
  Bot,
  Star,
  MapPin,
  Download,
  RefreshCw,
  Sliders,
  Award,
  MessageSquare,
  CheckCircle2,
  Eye,
  Filter,
  BookOpen
} from 'lucide-react';
import { SorocabaGrowthHeatmap } from './SorocabaGrowthHeatmap';
import {
  MercadoPagoCheckoutModal,
  MercadoPagoGatewayStatusPanel
} from '../ui/MercadoPagoCheckoutModal';
import { MasterBlogArticleEditor } from './MasterBlogArticleEditor';

export type AdminTabId =
  | 'overview'
  | 'businesses'
  | 'subscriptions'
  | 'moderation'
  | 'blog_editor'
  | 'ai_governance'
  | 'settings';

export interface AdminManagedBusiness {
  id: string;
  name: string;
  ownerName: string;
  cnpj: string;
  category: string;
  neighborhood: string;
  city: string;
  whatsapp: string;
  email: string;
  plan: 'Gratuito' | 'Premium Pro' | 'Enterprise VIP';
  billingCycle: 'Mensal' | 'Anual' | 'Isento';
  mrrContribution: number;
  status: 'Verificado' | 'Pendente Auditoria' | 'Suspenso';
  featuredInNeighborhood: boolean;
  monthlyClicks: number;
  whatsappLeads: number;
  rating: number;
  joinedAt: string;
}

export interface AdminSubscriptionInvoice {
  id: string;
  businessName: string;
  plan: 'Premium Pro' | 'Enterprise VIP';
  cycle: 'Anual' | 'Mensal';
  amount: number;
  paymentMethod: 'PIX Instantâneo' | 'Cartão 12x' | 'Boleto B2B';
  status: 'Pago' | 'Processando' | 'Atrasado';
  date: string;
}

export interface AdminModerationItem {
  id: string;
  type: 'Avaliação de Cliente' | 'Anúncio Criado com IA' | 'Cadastro de Nova Empresa';
  businessName: string;
  authorName: string;
  content: string;
  rating?: number;
  neighborhood: string;
  createdAt: string;
  aiRiskScore: 'Seguro (98%)' | 'Revisão Recomendada' | 'Possível Spam';
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
}

export interface AdminPromoCoupon {
  id: string;
  code: string;
  discountPct: number;
  targetPlan: 'Premium Pro' | 'Enterprise VIP' | 'Todos';
  usesCount: number;
  maxUses: number;
  active: boolean;
}

const INITIAL_ADMIN_BUSINESSES: AdminManagedBusiness[] = [
  {
    id: 'biz-1',
    name: 'GuiaPonto Destaques & Serviços',
    ownerName: 'Alexandre Santos',
    cnpj: '42.819.301/0001-88',
    category: 'Restaurantes & Gastronomia',
    neighborhood: 'Campolim',
    city: 'Sorocaba - SP',
    whatsapp: '(15) 99999-8888',
    email: 'alexandre@guiaponto.com',
    plan: 'Premium Pro',
    billingCycle: 'Anual',
    mrrContribution: 24.75,
    status: 'Verificado',
    featuredInNeighborhood: true,
    monthlyClicks: 1420,
    whatsappLeads: 328,
    rating: 4.9,
    joinedAt: '12 Jan 2026'
  },
  {
    id: 'biz-2',
    name: 'Residencial Sênior Acolher',
    ownerName: 'Dra. Helena Vasconcelos',
    cnpj: '19.402.118/0001-40',
    category: 'Casa de Repouso & Cuidado',
    neighborhood: 'Santa Rosália',
    city: 'Sorocaba - SP',
    whatsapp: '(15) 97777-2222',
    email: 'contato@residencialacolher.com.br',
    plan: 'Enterprise VIP',
    billingCycle: 'Anual',
    mrrContribution: 149.0,
    status: 'Verificado',
    featuredInNeighborhood: true,
    monthlyClicks: 980,
    whatsappLeads: 214,
    rating: 4.9,
    joinedAt: '03 Fev 2026'
  },
  {
    id: 'biz-3',
    name: 'Oficina Mecânica Precision Car',
    ownerName: 'Roberto Almeida',
    cnpj: '31.775.904/0001-12',
    category: 'Oficinas & Automotivo',
    neighborhood: 'Trujillo',
    city: 'Sorocaba - SP',
    whatsapp: '(15) 95555-4444',
    email: 'roberto@precisioncar.com.br',
    plan: 'Premium Pro',
    billingCycle: 'Mensal',
    mrrContribution: 49.9,
    status: 'Verificado',
    featuredInNeighborhood: true,
    monthlyClicks: 790,
    whatsappLeads: 185,
    rating: 4.8,
    joinedAt: '18 Mar 2026'
  },
  {
    id: 'biz-4',
    name: 'Clínica Sorria Mais Implantes',
    ownerName: 'Dr. Marcos Prado',
    cnpj: '28.550.431/0001-95',
    category: 'Saúde & Estética',
    neighborhood: 'Centro',
    city: 'Sorocaba - SP',
    whatsapp: '(15) 94444-5555',
    email: 'diretoria@sorriamais.com.br',
    plan: 'Enterprise VIP',
    billingCycle: 'Anual',
    mrrContribution: 149.0,
    status: 'Verificado',
    featuredInNeighborhood: true,
    monthlyClicks: 1640,
    whatsappLeads: 392,
    rating: 5.0,
    joinedAt: '02 Abr 2026'
  },
  {
    id: 'biz-5',
    name: 'Bistrô & Cafeteria Villa Campolim',
    ownerName: 'Renata Vasconcelos',
    cnpj: '51.209.884/0001-21',
    category: 'Restaurantes & Gastronomia',
    neighborhood: 'Campolim',
    city: 'Sorocaba - SP',
    whatsapp: '(15) 99145-8821',
    email: 'renata@villacampolim.com.br',
    plan: 'Gratuito',
    billingCycle: 'Isento',
    mrrContribution: 0,
    status: 'Pendente Auditoria',
    featuredInNeighborhood: false,
    monthlyClicks: 145,
    whatsappLeads: 14,
    rating: 4.7,
    joinedAt: 'Há 2 dias'
  },
  {
    id: 'biz-6',
    name: 'Imobiliária Nova Era Prime',
    ownerName: 'Fernando Camargo',
    cnpj: '14.889.302/0001-77',
    category: 'Imobiliárias & Arquitetura',
    neighborhood: 'Wanel Ville',
    city: 'Sorocaba - SP',
    whatsapp: '(15) 96666-3333',
    email: 'fernando@novaeraprime.com.br',
    plan: 'Gratuito',
    billingCycle: 'Isento',
    mrrContribution: 0,
    status: 'Pendente Auditoria',
    featuredInNeighborhood: false,
    monthlyClicks: 120,
    whatsappLeads: 15,
    rating: 4.6,
    joinedAt: 'Ontem'
  },
  {
    id: 'biz-7',
    name: 'Empório & Padaria Artesanal Além Ponte',
    ownerName: 'Gustavo Nogueira',
    cnpj: '39.104.552/0001-63',
    category: 'Restaurantes & Gastronomia',
    neighborhood: 'Além Ponte',
    city: 'Sorocaba - SP',
    whatsapp: '(15) 98812-9090',
    email: 'gustavo@emporioalemponte.com.br',
    plan: 'Premium Pro',
    billingCycle: 'Anual',
    mrrContribution: 24.75,
    status: 'Verificado',
    featuredInNeighborhood: false,
    monthlyClicks: 680,
    whatsappLeads: 154,
    rating: 4.9,
    joinedAt: '19 Set 2026'
  }
];

const INITIAL_INVOICES: AdminSubscriptionInvoice[] = [
  {
    id: 'INV-2026-901',
    businessName: 'Clínica Sorria Mais Implantes',
    plan: 'Enterprise VIP',
    cycle: 'Anual',
    amount: 1788.0,
    paymentMethod: 'PIX Instantâneo',
    status: 'Pago',
    date: 'Hoje, 10:14'
  },
  {
    id: 'INV-2026-902',
    businessName: 'GuiaPonto Destaques & Serviços',
    plan: 'Premium Pro',
    cycle: 'Anual',
    amount: 297.0,
    paymentMethod: 'Cartão 12x',
    status: 'Pago',
    date: 'Ontem, 16:40'
  },
  {
    id: 'INV-2026-903',
    businessName: 'Oficina Mecânica Precision Car',
    plan: 'Premium Pro',
    cycle: 'Mensal',
    amount: 49.9,
    paymentMethod: 'PIX Instantâneo',
    status: 'Pago',
    date: '12 Nov 2026'
  },
  {
    id: 'INV-2026-904',
    businessName: 'Residencial Sênior Acolher',
    plan: 'Enterprise VIP',
    cycle: 'Anual',
    amount: 1788.0,
    paymentMethod: 'Boleto B2B',
    status: 'Pago',
    date: '10 Nov 2026'
  },
  {
    id: 'INV-2026-905',
    businessName: 'Empório & Padaria Artesanal Além Ponte',
    plan: 'Premium Pro',
    cycle: 'Anual',
    amount: 297.0,
    paymentMethod: 'Cartão 12x',
    status: 'Processando',
    date: 'Hoje, 11:30'
  }
];

const INITIAL_MODERATION_QUEUE: AdminModerationItem[] = [
  {
    id: 'mod-1',
    type: 'Cadastro de Nova Empresa',
    businessName: 'Bistrô & Cafeteria Villa Campolim',
    authorName: 'Renata Vasconcelos',
    content:
      'Solicitação de verificação de CNPJ (51.209.884/0001-21) e geolocalização na Av. Antônio Carlos Comitre, Campolim - Sorocaba.',
    neighborhood: 'Campolim',
    createdAt: 'Há 18 min',
    aiRiskScore: 'Seguro (98%)',
    status: 'Pendente'
  },
  {
    id: 'mod-2',
    type: 'Anúncio Criado com IA',
    businessName: 'Oficina Mecânica Precision Car',
    authorName: 'Cacilda AI Studio (Gemini)',
    content:
      'Título: "Revisão Preventiva Express em Sorocaba com Check-up Computadorizado Grátis no WhatsApp" — Categoria: Oficinas & Automotivo.',
    neighborhood: 'Trujillo',
    createdAt: 'Há 45 min',
    aiRiskScore: 'Seguro (98%)',
    status: 'Pendente'
  },
  {
    id: 'mod-3',
    type: 'Avaliação de Cliente',
    businessName: 'Restaurante Sabor & Fogo',
    authorName: 'Camila Albuquerque',
    content:
      'Almoço executivo impecável no Campolim! Fui atendida em 2 minutos pelo WhatsApp da vitrine GuiaPonto e a reserva estava pronta.',
    rating: 5,
    neighborhood: 'Campolim',
    createdAt: 'Há 2 horas',
    aiRiskScore: 'Seguro (98%)',
    status: 'Pendente'
  },
  {
    id: 'mod-4',
    type: 'Avaliação de Cliente',
    businessName: 'Imobiliária Nova Era Prime',
    authorName: 'Usuário Anônimo #882',
    content:
      'Link suspeito de divulgação externa não solicitada nos comentários da avaliação.',
    rating: 1,
    neighborhood: 'Wanel Ville',
    createdAt: 'Há 3 horas',
    aiRiskScore: 'Possível Spam',
    status: 'Pendente'
  }
];

const INITIAL_COUPONS: AdminPromoCoupon[] = [
  {
    id: 'coup-1',
    code: 'SOROCABA50',
    discountPct: 50,
    targetPlan: 'Premium Pro',
    usesCount: 84,
    maxUses: 200,
    active: true
  },
  {
    id: 'coup-2',
    code: 'CAMPOLIMVIP',
    discountPct: 30,
    targetPlan: 'Enterprise VIP',
    usesCount: 19,
    maxUses: 50,
    active: true
  },
  {
    id: 'coup-3',
    code: 'FUNDADORGP',
    discountPct: 60,
    targetPlan: 'Todos',
    usesCount: 100,
    maxUses: 100,
    active: false
  }
];

interface MasterAdminPanelSPAProps {
  onBackToHome: () => void;
  onSwitchToMerchantDashboard: () => void;
}

export function MasterAdminPanelSPA({
  onBackToHome,
  onSwitchToMerchantDashboard
}: MasterAdminPanelSPAProps) {
  const [activeTab, setActiveTab] = useState<AdminTabId>('overview');
  const [businesses, setBusinesses] = useState<AdminManagedBusiness[]>(INITIAL_ADMIN_BUSINESSES);
  const [invoices] = useState<AdminSubscriptionInvoice[]>(INITIAL_INVOICES);
  const [moderationQueue, setModerationQueue] = useState<AdminModerationItem[]>(
    INITIAL_MODERATION_QUEUE
  );
  const [coupons, setCoupons] = useState<AdminPromoCoupon[]>(INITIAL_COUPONS);
  const [adminMpModalOpen, setAdminMpModalOpen] = useState<boolean>(false);
  const [adminMpPlanId, setAdminMpPlanId] = useState<'premium' | 'enterprise'>('premium');

  // Filters for Business Management
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [planFilter, setPlanFilter] = useState<string>('Todos');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');

  // New Business Modal State
  const [showAddBusinessModal, setShowAddBusinessModal] = useState<boolean>(false);
  const [newBizName, setNewBizName] = useState<string>('');
  const [newBizOwner, setNewBizOwner] = useState<string>('');
  const [newBizCategory, setNewBizCategory] = useState<string>('Restaurantes & Gastronomia');
  const [newBizNeighborhood, setNewBizNeighborhood] = useState<string>('Campolim');
  const [newBizWhatsapp, setNewBizWhatsapp] = useState<string>('(15) 99100-0000');
  const [newBizPlan, setNewBizPlan] = useState<'Gratuito' | 'Premium Pro' | 'Enterprise VIP'>(
    'Premium Pro'
  );

  // New Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState<string>('');
  const [newCouponDiscount, setNewCouponDiscount] = useState<number>(40);

  // Global Platform Settings State (Plano Gratuito & Ecossistema)
  const [freePlanAdLimit, setFreePlanAdLimit] = useState<number>(1);
  const [freePlanAiAssistantEnabled, setFreePlanAiAssistantEnabled] = useState<boolean>(true);
  const [freePlanAiAssistantQuota, setFreePlanAiAssistantQuota] = useState<number>(1);
  const [freePlanAdOptimizerEnabled, setFreePlanAdOptimizerEnabled] = useState<boolean>(true);
  const [freePlanAdOptimizerQuota, setFreePlanAdOptimizerQuota] = useState<number>(1);
  const [freePlanClickLimit, setFreePlanClickLimit] = useState<number>(15);
  const [freePlanPhotoLimit, setFreePlanPhotoLimit] = useState<number>(1);
  const [sorocabaGeoLockEnabled, setSorocabaGeoLockEnabled] = useState<boolean>(true);
  const [aiAutoModerationEnabled, setAiAutoModerationEnabled] = useState<boolean>(true);
  const [broadcastMessage, setBroadcastMessage] = useState<string>('');
  const [adminToast, setAdminToast] = useState<string | null>(null);

  const handleSaveGlobalSettings = () => {
    try {
      localStorage.setItem(
        'guiaponto_global_free_plan_config',
        JSON.stringify({
          freePlanAdLimit,
          freePlanAiAssistantEnabled,
          freePlanAiAssistantQuota,
          freePlanAdOptimizerEnabled,
          freePlanAdOptimizerQuota,
          freePlanClickLimit,
          freePlanPhotoLimit,
          sorocabaGeoLockEnabled,
          aiAutoModerationEnabled
        })
      );
    } catch {
      // ignore storage errors
    }
    triggerToast(
      `Configurações Globais salvas: Plano Gratuito com limite de ${freePlanAdLimit} anúncio(s), Assistente de IA (${
        freePlanAiAssistantEnabled ? `${freePlanAiAssistantQuota}x/mês` : 'Bloqueado'
      }) e Otimizador de Anúncios (${
        freePlanAdOptimizerEnabled ? `${freePlanAdOptimizerQuota}x/mês` : 'Bloqueado'
      })!`
    );
  };

  const triggerToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 4000);
  };

  // Computed Platform Metrics
  const metrics = useMemo(() => {
    const totalBusinesses = businesses.length;
    const verifiedCount = businesses.filter((b) => b.status === 'Verificado').length;
    const pendingCount = businesses.filter((b) => b.status === 'Pendente Auditoria').length;
    const freeCount = businesses.filter((b) => b.plan === 'Gratuito').length;
    const premiumCount = businesses.filter((b) => b.plan === 'Premium Pro').length;
    const enterpriseCount = businesses.filter((b) => b.plan === 'Enterprise VIP').length;
    const paidSubscribers = premiumCount + enterpriseCount;
    const conversionRatePct = Math.round(
      (paidSubscribers / Math.max(1, totalBusinesses)) * 100
    );

    const activeMrr = businesses.reduce((acc, b) => acc + b.mrrContribution, 0);
    // Projected scale MRR for the Sorocaba network (base network + active rows)
    const networkMrr = 18450 + activeMrr;
    const totalMonthlyClicks = businesses.reduce((acc, b) => acc + b.monthlyClicks, 0);
    const totalWhatsappLeads = businesses.reduce((acc, b) => acc + b.whatsappLeads, 0);
    const pendingModerationCount = moderationQueue.filter(
      (m) => m.status === 'Pendente'
    ).length;

    return {
      totalBusinesses,
      verifiedCount,
      pendingCount,
      freeCount,
      premiumCount,
      enterpriseCount,
      paidSubscribers,
      conversionRatePct,
      networkMrr,
      totalMonthlyClicks,
      totalWhatsappLeads,
      pendingModerationCount
    };
  }, [businesses, moderationQueue]);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.cnpj.includes(searchQuery);
      const matchesPlan = planFilter === 'Todos' || b.plan === planFilter;
      const matchesStatus = statusFilter === 'Todos' || b.status === statusFilter;
      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [businesses, searchQuery, planFilter, statusFilter]);

  // Handlers
  const handleVerifyBusiness = (id: string) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'Verificado' } : b))
    );
    triggerToast('Empresa auditada e selo Verificado concedido com sucesso!');
  };

  const handleToggleSuspendBusiness = (id: string) => {
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const nextStatus = b.status === 'Suspenso' ? 'Verificado' : 'Suspenso';
        triggerToast(`Status de "${b.name}" alterado para ${nextStatus}.`);
        return { ...b, status: nextStatus };
      })
    );
  };

  const handleChangeBusinessPlan = (
    id: string,
    nextPlan: 'Gratuito' | 'Premium Pro' | 'Enterprise VIP'
  ) => {
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const nextMrr =
          nextPlan === 'Enterprise VIP'
            ? 149.0
            : nextPlan === 'Premium Pro'
            ? 24.75
            : 0;
        const nextCycle = nextPlan === 'Gratuito' ? 'Isento' : 'Anual';
        triggerToast(`Plano de "${b.name}" atualizado para ${nextPlan}!`);
        return {
          ...b,
          plan: nextPlan,
          billingCycle: nextCycle,
          mrrContribution: nextMrr,
          featuredInNeighborhood: nextPlan !== 'Gratuito'
        };
      })
    );
  };

  const handleToggleFeatured = (id: string) => {
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const nextFeat = !b.featuredInNeighborhood;
        triggerToast(
          nextFeat
            ? `"${b.name}" fixada no topo do bairro ${b.neighborhood}!`
            : `"${b.name}" removida do destaque patrocinado.`
        );
        return { ...b, featuredInNeighborhood: nextFeat };
      })
    );
  };

  const handleAddNewBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName.trim()) return;

    const mrr =
      newBizPlan === 'Enterprise VIP'
        ? 149.0
        : newBizPlan === 'Premium Pro'
        ? 24.75
        : 0;

    const created: AdminManagedBusiness = {
      id: `biz-${Date.now()}`,
      name: newBizName.trim(),
      ownerName: newBizOwner.trim() || 'Proprietário Verificado',
      cnpj: '48.920.114/0001-09',
      category: newBizCategory,
      neighborhood: newBizNeighborhood,
      city: 'Sorocaba - SP',
      whatsapp: newBizWhatsapp,
      email: 'contato@empresa.com.br',
      plan: newBizPlan,
      billingCycle: newBizPlan === 'Gratuito' ? 'Isento' : 'Anual',
      mrrContribution: mrr,
      status: 'Verificado',
      featuredInNeighborhood: newBizPlan !== 'Gratuito',
      monthlyClicks: 210,
      whatsappLeads: 42,
      rating: 5.0,
      joinedAt: 'Agora mesmo'
    };

    setBusinesses((prev) => [created, ...prev]);
    setNewBizName('');
    setNewBizOwner('');
    setShowAddBusinessModal(false);
    triggerToast(`Empresa "${created.name}" cadastrada e ativada em ${created.neighborhood}!`);
  };

  const handleModerationDecision = (id: string, decision: 'Aprovado' | 'Rejeitado') => {
    setModerationQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: decision } : item))
    );
    triggerToast(`Item de moderação marcado como ${decision}.`);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const created: AdminPromoCoupon = {
      id: `coup-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      discountPct: newCouponDiscount,
      targetPlan: 'Premium Pro',
      usesCount: 0,
      maxUses: 100,
      active: true
    };
    setCoupons((prev) => [created, ...prev]);
    setNewCouponCode('');
    triggerToast(`Cupom promocional ${created.code} (${created.discountPct}% OFF) criado!`);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col md:flex-row font-sans">
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-72 bg-slate-950 text-white border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div className="p-6 space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FE3A18] text-white flex items-center justify-center font-black shadow-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-white block">
                  GuiaPonto Admin
                </span>
                <span className="text-[11px] text-amber-400 font-semibold block">
                  Console Master · Sorocaba
                </span>
              </div>
            </div>
          </div>

          {/* Admin Navigation Links */}
          <nav className="space-y-1.5">
            {[
              {
                id: 'overview',
                label: 'Visão Geral & KPIs',
                icon: BarChart3,
                badge: null
              },
              {
                id: 'businesses',
                label: 'Negócios & Lojistas',
                icon: Building2,
                badge: `${metrics.totalBusinesses}`
              },
              {
                id: 'subscriptions',
                label: 'Assinaturas & Receita',
                icon: DollarSign,
                badge: 'MRR'
              },
              {
                id: 'moderation',
                label: 'Moderação & Auditoria',
                icon: AlertTriangle,
                badge:
                  metrics.pendingModerationCount > 0
                    ? `${metrics.pendingModerationCount}`
                    : null
              },
              {
                id: 'blog_editor',
                label: 'Editor de Artigos (Blog)',
                icon: BookOpen,
                badge: 'BLOG'
              },
              {
                id: 'ai_governance',
                label: 'Motor Gemini IA & Cotas',
                icon: Bot,
                badge: 'IA'
              },
              {
                id: 'settings',
                label: 'Configurações Globais',
                icon: Settings,
                badge: null
              }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as AdminTabId)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FE3A18] text-white shadow-lg shadow-[#FE3A18]/25'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-auto px-2 py-0.5 rounded-md text-[10px] font-mono font-black ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-amber-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Switcher & Back to Home */}
        <div className="p-5 border-t border-slate-800 space-y-2.5">
          <button
            type="button"
            onClick={onSwitchToMerchantDashboard}
            className="w-full py-3 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Crown className="w-4 h-4" />
            <span>Ir para Escritório do Lojista</span>
          </button>

          <button
            type="button"
            onClick={onBackToHome}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para a Home Pública</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Bar Contract */}
        <header className="h-20 bg-white border-b border-slate-200 px-6 sm:px-10 flex items-center justify-between gap-6 sticky top-0 z-30">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={onBackToHome}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-[#FE3A18] text-slate-800 hover:text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar à Home</span>
            </button>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-400 truncate">
                Administração Central · Região Metropolitana de Sorocaba (DDD 15)
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 truncate">
                {activeTab === 'overview' && 'Visão Geral da Plataforma & Operações'}
                {activeTab === 'businesses' && 'Gestão de Negócios & Diretório Local'}
                {activeTab === 'subscriptions' && 'Faturamento, Assinaturas & Planos'}
                {activeTab === 'moderation' && 'Fila de Moderação & Auditoria IA'}
                {activeTab === 'blog_editor' && 'Editor de Artigos do Blog • Business Insights'}
                {activeTab === 'ai_governance' && 'Governança Gemini IA & Consumo'}
                {activeTab === 'settings' && 'Configurações Globais do Sistema'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowAddBusinessModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-black text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Empresa</span>
            </button>
          </div>
        </header>

        {/* Global Admin Toast Notification */}
        <AnimatePresence>
          {adminToast && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mx-6 sm:mx-10 mt-6 p-4 rounded-2xl bg-slate-950 text-white border border-emerald-500/40 shadow-xl flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-emerald-400">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{adminToast}</span>
              </div>
              <button
                type="button"
                onClick={() => setAdminToast(null)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Workspace Container */}
        <main className="p-6 sm:p-10 space-y-8 max-w-7xl w-full mx-auto">
          {/* ================= TAB 1: OVERVIEW & REGIONAL COMMAND ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* 4 Primary Executive KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Receita Recorrente (MRR)</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 font-mono tabular-nums">
                    R$ {metrics.networkMrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-emerald-600 font-semibold">
                    +28,4% vs. mês anterior · ARR R$ {(metrics.networkMrr * 12).toLocaleString('pt-BR')}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Negócios Gerenciados</span>
                    <Building2 className="w-4 h-4 text-[#FE3A18]" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 font-mono tabular-nums">
                    {metrics.totalBusinesses}
                  </div>
                  <div className="text-xs text-slate-500">
                    {metrics.verifiedCount} verificados ·{' '}
                    <strong className="text-amber-600">{metrics.pendingCount} pendentes</strong>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Conversão Freemium → Pro</span>
                    <Crown className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 font-mono tabular-nums">
                    {metrics.conversionRatePct}%
                  </div>
                  <div className="text-xs text-slate-500">
                    {metrics.paidSubscribers} assinantes pagos ({metrics.premiumCount} Pro · {metrics.enterpriseCount} VIP)
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Leads Gerados no WhatsApp</span>
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 font-mono tabular-nums">
                    {metrics.totalWhatsappLeads.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-xs text-emerald-600 font-semibold">
                    {metrics.totalMonthlyClicks.toLocaleString('pt-BR')} cliques auditados em Sorocaba
                  </div>
                </div>
              </div>

              {/* Pending Approvals & Moderation Quick Action Box */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Pending Business Verifications */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        Negócios Aguardando Verificação Documental / CNPJ
                      </h3>
                      <p className="text-xs text-slate-500">
                        Aprove o cadastro para liberar o selo oficial de segurança no diretório de Sorocaba.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('businesses')}
                      className="text-xs font-bold text-[#FE3A18] hover:underline cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Ver Todos →
                    </button>
                  </div>

                  {businesses.filter((b) => b.status === 'Pendente Auditoria').length === 0 ? (
                    <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-xs font-bold text-emerald-800">
                      Todos os negócios cadastrados em Sorocaba já foram auditados e verificados!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {businesses
                        .filter((b) => b.status === 'Pendente Auditoria')
                        .map((biz) => (
                          <div
                            key={biz.id}
                            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-sm text-slate-900">
                                  {biz.name}
                                </span>
                                <span className="text-xs text-slate-500">
                                  · {biz.neighborhood}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 font-mono">
                                CNPJ: {biz.cnpj} · Resp: {biz.ownerName} · Plano: {biz.plan}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleVerifyBusiness(biz.id)}
                                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Aprovar CNPJ</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleChangeBusinessPlan(biz.id, 'Premium Pro')
                                }
                                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs cursor-pointer"
                              >
                                Ativar Pro
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Plan Distribution Breakdown */}
                <div className="lg:col-span-5 bg-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-amber-400">
                      DISTRIBUIÇÃO DA CARTEIRA DE ASSINATURAS
                    </span>
                    <h3 className="text-lg font-black text-white">
                      Funil de Monetização Ativo em Sorocaba
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-300">Plano Gratuito (Porta de Entrada)</span>
                        <span className="font-mono text-slate-400">{metrics.freeCount} negócios</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-400 rounded-full"
                          style={{
                            width: `${(metrics.freeCount / Math.max(1, metrics.totalBusinesses)) * 100}%`
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-amber-300">Plano Premium Pro (R$ 24,75–49,90)</span>
                        <span className="font-mono text-amber-400">{metrics.premiumCount} negócios</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FE3A18] rounded-full"
                          style={{
                            width: `${(metrics.premiumCount / Math.max(1, metrics.totalBusinesses)) * 100}%`
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-purple-300">Enterprise Regional VIP (R$ 149/mês)</span>
                        <span className="font-mono text-purple-400">{metrics.enterpriseCount} negócios</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{
                            width: `${(metrics.enterpriseCount / Math.max(1, metrics.totalBusinesses)) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('subscriptions')}
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    Gerenciar Faturas & Cupons de Desconto →
                  </button>
                </div>
              </div>

              {/* Integrated Sorocaba Regional Growth Heatmap */}
              <SorocabaGrowthHeatmap
                businessName="Rede Global GuiaPonto Sorocaba"
                baseNeighborhood="Campolim"
              />
            </div>
          )}

          {/* ================= TAB 2: GESTÃO DE NEGÓCIOS & DIRETÓRIO ================= */}
          {activeTab === 'businesses' && (
            <div className="space-y-6">
              {/* Search & Filter Bar */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por empresa, responsável, CNPJ ou bairro..."
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-[#FE3A18] focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Plano:</span>
                  {['Todos', 'Gratuito', 'Premium Pro', 'Enterprise VIP'].map((plan) => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => setPlanFilter(plan)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        planFilter === plan
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {plan}
                    </button>
                  ))}

                  <span className="text-xs font-bold text-slate-500 ml-2">Status:</span>
                  {['Todos', 'Verificado', 'Pendente Auditoria', 'Suspenso'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        statusFilter === st
                          ? 'bg-[#FE3A18] text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Businesses Management Table */}
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
                        <th className="py-4 px-5">Empresa & CNPJ</th>
                        <th className="py-4 px-5">Bairro / Categoria</th>
                        <th className="py-4 px-5">Plano & Ciclo</th>
                        <th className="py-4 px-5">Status</th>
                        <th className="py-4 px-5 text-right">Cliques / Leads</th>
                        <th className="py-4 px-5 text-right">Ações Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                      {filteredBusinesses.map((biz) => (
                        <tr key={biz.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-5 align-top">
                            <div className="font-black text-slate-900">{biz.name}</div>
                            <div className="text-xs text-slate-500">
                              Resp: {biz.ownerName} · <span className="font-mono">{biz.cnpj}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              WhatsApp: {biz.whatsapp}
                            </div>
                          </td>

                          <td className="py-4 px-5 align-top">
                            <div className="font-bold text-slate-800">{biz.neighborhood}</div>
                            <div className="text-xs text-slate-500">{biz.category}</div>
                            {biz.featuredInNeighborhood && (
                              <span className="text-[11px] font-bold text-[#FE3A18] block mt-0.5">
                                ★ Destaque no Topo do Bairro
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-5 align-top">
                            <select
                              value={biz.plan}
                              onChange={(e) =>
                                handleChangeBusinessPlan(
                                  biz.id,
                                  e.target.value as 'Gratuito' | 'Premium Pro' | 'Enterprise VIP'
                                )
                              }
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-bold text-xs text-slate-900 cursor-pointer focus:outline-none focus:border-[#FE3A18]"
                            >
                              <option value="Gratuito">Gratuito (R$ 0)</option>
                              <option value="Premium Pro">Premium Pro (R$ 24,75)</option>
                              <option value="Enterprise VIP">Enterprise VIP (R$ 149)</option>
                            </select>
                            <div className="text-[11px] text-slate-400 mt-1 font-mono">
                              MRR: R$ {biz.mrrContribution.toFixed(2).replace('.', ',')} ({biz.billingCycle})
                            </div>
                          </td>

                          <td className="py-4 px-5 align-top">
                            <span
                              className={`font-bold text-xs ${
                                biz.status === 'Verificado'
                                  ? 'text-emerald-700'
                                  : biz.status === 'Pendente Auditoria'
                                  ? 'text-amber-700'
                                  : 'text-rose-700'
                              }`}
                            >
                              {biz.status}
                            </span>
                          </td>

                          <td className="py-4 px-5 align-top text-right font-mono tabular-nums">
                            <div className="font-bold text-slate-900">
                              {biz.monthlyClicks.toLocaleString('pt-BR')} cliques
                            </div>
                            <div className="text-xs text-emerald-600 font-semibold">
                              {biz.whatsappLeads} leads WhatsApp
                            </div>
                          </td>

                          <td className="py-4 px-5 align-top text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {biz.status === 'Pendente Auditoria' && (
                                <button
                                  type="button"
                                  onClick={() => handleVerifyBusiness(biz.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                                  title="Aprovar e Verificar CNPJ"
                                >
                                  Verificar
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleToggleFeatured(biz.id)}
                                className={`px-2.5 py-1.5 rounded-lg font-bold text-xs cursor-pointer border ${
                                  biz.featuredInNeighborhood
                                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                                }`}
                                title="Alternar destaque no topo do bairro"
                              >
                                {biz.featuredInNeighborhood ? 'Topo ★' : 'Destacar'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleSuspendBusiness(biz.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs cursor-pointer"
                              >
                                {biz.status === 'Suspenso' ? 'Reativar' : 'Suspender'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: FATURAMENTO, ASSINATURAS & CUPONS ================= */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Invoices Ledger */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-5">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Faturas & Transações Recentes de Assinaturas
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pagamentos processados via PIX Instantâneo, Cartão em 12x e Boleto B2B em Sorocaba.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
                          <th className="py-3.5 px-4">Fatura / Data</th>
                          <th className="py-3.5 px-4">Empresa Assinante</th>
                          <th className="py-3.5 px-4">Plano / Método</th>
                          <th className="py-3.5 px-4 text-right">Valor</th>
                          <th className="py-3.5 px-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-xs">
                        {invoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-50">
                            <td className="py-3.5 px-4 font-mono">
                              <div className="font-bold text-slate-900">{inv.id}</div>
                              <div className="text-slate-400">{inv.date}</div>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              {inv.businessName}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-slate-800">
                                {inv.plan} ({inv.cycle})
                              </div>
                              <div className="text-slate-400">{inv.paymentMethod}</div>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900 tabular-nums">
                              R$ {inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <span
                                className={`font-bold ${
                                  inv.status === 'Pago'
                                    ? 'text-emerald-600'
                                    : 'text-amber-600'
                                }`}
                              >
                                {inv.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Promotional Coupons Manager */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Cupons de Conversão (Freemium → Pro)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Crie códigos promocionais para campanhas comerciais nos bairros de Sorocaba.
                    </p>
                  </div>

                  <form onSubmit={handleCreateCoupon} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Código do Cupom
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: WANEL50"
                          value={newCouponCode}
                          onChange={(e) => setNewCouponCode(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono uppercase"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Desconto (%)
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="80"
                          value={newCouponDiscount}
                          onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                    >
                      + Criar Novo Cupom de Desconto
                    </button>
                  </form>

                  <div className="space-y-2.5">
                    {coupons.map((c) => (
                      <div
                        key={c.id}
                        className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-slate-900">
                              {c.code}
                            </span>
                            <span className="text-xs font-bold text-[#FE3A18]">
                              {c.discountPct}% OFF
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Usos: {c.usesCount} / {c.maxUses} · Alvo: {c.targetPlan}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setCoupons((prev) =>
                              prev.map((item) =>
                                item.id === c.id ? { ...item, active: !item.active } : item
                              )
                            )
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                            c.active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {c.active ? 'Ativo' : 'Pausado'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mercado Pago Gateway & Webhooks Monitor */}
              <MercadoPagoGatewayStatusPanel
                onOpenCheckout={(plan) => {
                  setAdminMpPlanId(plan || 'premium');
                  setAdminMpModalOpen(true);
                }}
              />
            </div>
          )}

          {/* ================= TAB 4: MODERAÇÃO DE ANÚNCIOS & AVALIAÇÕES ================= */}
          {activeTab === 'moderation' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Central de Auditoria de Conteúdo, Avaliações e Anúncios IA
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mantenha a qualidade e veracidade das avaliações e anúncios publicados em Sorocaba.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-600">
                  {metrics.pendingModerationCount} itens pendentes de revisão
                </span>
              </div>

              <div className="space-y-4">
                {moderationQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-black text-[#FE3A18]">{item.type}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-bold text-slate-900">{item.businessName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-500">{item.neighborhood}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-400">{item.createdAt}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        "{item.content}"
                      </p>
                      <div className="text-[11px] text-slate-500">
                        Autor: <strong>{item.authorName}</strong> · Filtro Gemini Safety:{' '}
                        <strong
                          className={
                            item.aiRiskScore === 'Possível Spam'
                              ? 'text-rose-600'
                              : 'text-emerald-600'
                          }
                        >
                          {item.aiRiskScore}
                        </strong>{' '}
                        · Status atual: <strong>{item.status}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleModerationDecision(item.id, 'Aprovado')}
                        className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                          item.status === 'Aprovado'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border border-slate-200 hover:bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Aprovar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleModerationDecision(item.id, 'Rejeitado')}
                        className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                          item.status === 'Rejeitado'
                            ? 'bg-rose-600 text-white'
                            : 'bg-white border border-slate-200 hover:bg-rose-50 text-rose-700'
                        }`}
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Bloquear / Spam</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 5: GOVERNANÇA GEMINI IA & COTAS ================= */}
          {activeTab === 'ai_governance' && (
            <div className="space-y-6">
              <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <span className="text-xs font-bold text-amber-400">
                      TELEMETRIA E GOVERNANÇA DE INTELIGÊNCIA ARTIFICIAL
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                      Consumo dos Módulos Gemini IA no Ecossistema GuiaPonto
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">
                    Proxy Server-Side Ativo (/api/gemini/*)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      module: 'Cacilda AI Ad Studio & Assistente IA',
                      calls: '4.820 gerações/mês',
                      conversionImpact: '+38% CTR médio',
                      planAccess: freePlanAiAssistantEnabled
                        ? `Gratuito: ${freePlanAiAssistantQuota} uso(s) | Pro: Ilimitado`
                        : 'Exclusivo Premium Pro & VIP'
                    },
                    {
                      module: 'Otimizador de Anúncios IA',
                      calls: '3.140 análises/mês',
                      conversionImpact: '+32% eficiência de lance',
                      planAccess: freePlanAdOptimizerEnabled
                        ? `Gratuito: ${freePlanAdOptimizerQuota} análise(s) | Pro: Ilimitado`
                        : 'Exclusivo Premium Pro & VIP'
                    },
                    {
                      module: 'Auto-Follow-up de Leads',
                      calls: '2.190 e-mails/mês',
                      conversionImpact: '+31% fechamento',
                      planAccess: 'Exclusivo Premium Pro & VIP'
                    },
                    {
                      module: 'AI Local Trends Sorocaba',
                      calls: '980 análises/mês',
                      conversionImpact: 'Radar de bairros',
                      planAccess: 'Resumo grátis / Completo Pro'
                    }
                  ].map((mod) => (
                    <div
                      key={mod.module}
                      className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-2"
                    >
                      <div className="text-xs font-bold text-amber-400">{mod.module}</div>
                      <div className="text-xl font-black text-white font-mono tabular-nums">
                        {mod.calls}
                      </div>
                      <div className="text-xs text-emerald-400 font-semibold">
                        Impacto: {mod.conversionImpact}
                      </div>
                      <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                        Regra: {mod.planAccess}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5B: EDITOR DE ARTIGOS DO BLOG ================= */}
          {activeTab === 'blog_editor' && (
            <MasterBlogArticleEditor onNotify={triggerToast} />
          )}

          {/* ================= TAB 6: CONFIGURAÇÕES GLOBAIS DO SISTEMA ================= */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#FE3A18]">
                      Setup Global do Plano Gratuito (Freemium)
                    </span>
                    <h3 className="text-lg font-black text-slate-900">
                      Limites de Anúncios, Assistente de IA & Otimizador no Plano Gratuito
                    </h3>
                    <p className="text-xs text-slate-500">
                      Configure a degustação estratégica do Plano Gratuito para acelerar o upgrade para o Plano Premium Pro.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFreePlanAdLimit(1);
                      setFreePlanAiAssistantEnabled(true);
                      setFreePlanAiAssistantQuota(1);
                      setFreePlanAdOptimizerEnabled(true);
                      setFreePlanAdOptimizerQuota(1);
                      triggerToast(
                        'Preset padrão aplicado: 1 Anúncio, Assistente de IA ativo e Otimizador de Anúncios ativo no Plano Gratuito!'
                      );
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-extrabold shrink-0 cursor-pointer"
                  >
                    Restaurar Padrão (1 Anúncio + IA)
                  </button>
                </div>

                <div className="space-y-4">
                  {/* 1. Limite de Criação de Anúncio no Plano Gratuito = 1 */}
                  <div className="p-4 rounded-2xl bg-orange-50/70 border-2 border-[#FE3A18]/30 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                          <span>1. Limite de Criação de Anúncios (Plano Gratuito)</span>
                          <span className="px-2 py-0.5 rounded-md bg-[#FE3A18] text-white text-[10px] font-black uppercase">
                            Setup Ativo: {freePlanAdLimit} {freePlanAdLimit === 1 ? 'Anúncio' : 'Anúncios'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Define quantos anúncios simultâneos o lojista pode criar e publicar gratuitamente na vitrine de Sorocaba.
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {[1, 2, 3, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setFreePlanAdLimit(num)}
                            className={`w-8 h-8 rounded-xl font-black text-xs transition-all cursor-pointer ${
                              freePlanAdLimit === num
                                ? 'bg-[#FE3A18] text-white shadow-md shadow-[#FE3A18]/30'
                                : 'bg-white border border-slate-200 text-slate-700 hover:border-[#FE3A18]'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={freePlanAdLimit}
                      onChange={(e) => setFreePlanAdLimit(Number(e.target.value))}
                      className="w-full accent-[#FE3A18] cursor-pointer"
                    />
                  </div>

                  {/* 2. Assistente de IA no Plano Gratuito */}
                  <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                          <Bot className="w-4 h-4 text-indigo-600" />
                          <span>2. Assistente de IA no Plano Gratuito (GuiaPonto IA Mentor & Studio)</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Permite que o lojista gratuito utilize o Assistente de IA para criar seu 1º anúncio e tirar dúvidas de conversão local.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFreePlanAiAssistantEnabled(!freePlanAiAssistantEnabled)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-black shrink-0 cursor-pointer transition-all ${
                          freePlanAiAssistantEnabled
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {freePlanAiAssistantEnabled ? 'Liberado no Gratuito' : 'Bloqueado (Só Pro)'}
                      </button>
                    </div>

                    {freePlanAiAssistantEnabled && (
                      <div className="pt-2 border-t border-indigo-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-indigo-950">
                          Cota mensal do Assistente de IA no Plano Gratuito:
                        </span>
                        <div className="flex items-center gap-1.5">
                          {[
                            { label: '1 Geração/Consulta IA', val: 1 },
                            { label: '3 Consultas/mês', val: 3 },
                            { label: '5 Consultas/mês', val: 5 }
                          ].map((opt) => (
                            <button
                              key={opt.val}
                              type="button"
                              onClick={() => setFreePlanAiAssistantQuota(opt.val)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                                freePlanAiAssistantQuota === opt.val
                                  ? 'bg-indigo-950 text-white'
                                  : 'bg-white border border-indigo-200 text-indigo-900 hover:bg-indigo-100'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. Otimizador de Anúncios IA no Plano Gratuito */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-emerald-600" />
                          <span>3. Otimizador de Anúncios IA no Plano Gratuito (AI Ad Optimizer)</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Habilita o diagnóstico de copy, SEO local e sugestão de horários de pico para o anúncio do Plano Gratuito.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFreePlanAdOptimizerEnabled(!freePlanAdOptimizerEnabled)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-black shrink-0 cursor-pointer transition-all ${
                          freePlanAdOptimizerEnabled
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {freePlanAdOptimizerEnabled ? 'Liberado no Gratuito' : 'Bloqueado (Só Pro)'}
                      </button>
                    </div>

                    {freePlanAdOptimizerEnabled && (
                      <div className="pt-2 border-t border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-emerald-950">
                          Cota mensal do Otimizador de Anúncios no Plano Gratuito:
                        </span>
                        <div className="flex items-center gap-1.5">
                          {[
                            { label: '1 Otimização IA/mês', val: 1 },
                            { label: '2 Otimizações/mês', val: 2 },
                            { label: '3 Otimizações/mês', val: 3 }
                          ].map((opt) => (
                            <button
                              key={opt.val}
                              type="button"
                              onClick={() => setFreePlanAdOptimizerQuota(opt.val)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                                freePlanAdOptimizerQuota === opt.val
                                  ? 'bg-emerald-800 text-white'
                                  : 'bg-white border border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Demais parâmetros operacionais */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Limite Mensal de Cliques no WhatsApp (Plano Gratuito)</span>
                      <span className="font-mono text-[#FE3A18]">{freePlanClickLimit} cliques/mês</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={freePlanClickLimit}
                      onChange={(e) => setFreePlanClickLimit(Number(e.target.value))}
                      className="w-full accent-[#FE3A18] cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Limite de Fotos na Galeria (Plano Gratuito)</span>
                      <span className="font-mono text-[#FE3A18]">{freePlanPhotoLimit} foto(s)</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={freePlanPhotoLimit}
                      onChange={(e) => setFreePlanPhotoLimit(Number(e.target.value))}
                      className="w-full accent-[#FE3A18] cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Forçar Centralização Geográfica em Sorocaba (-23.5329, -47.4658)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Garante que visitantes na região vejam resultados de Sorocaba por padrão.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSorocabaGeoLockEnabled(!sorocabaGeoLockEnabled)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                        sorocabaGeoLockEnabled
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {sorocabaGeoLockEnabled ? 'Ativo' : 'Desativado'}
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Pré-Moderação Automática de Avaliações com Gemini IA
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Sinaliza automaticamente spam ou links suspeitos antes da publicação.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAiAutoModerationEnabled(!aiAutoModerationEnabled)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                        aiAutoModerationEnabled
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {aiAutoModerationEnabled ? 'Ativo' : 'Desativado'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveGlobalSettings}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-black text-xs cursor-pointer shadow-lg shadow-[#FE3A18]/20"
                  >
                    Salvar Configurações Globais
                  </button>
                </div>
              </div>

              {/* Right Column: Resumo do Setup Ativo + Global Broadcast */}
              <div className="lg:col-span-5 space-y-6">
                {/* Card Resumo das Regras Ativas do Plano Gratuito */}
                <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                        Resumo em Tempo Real
                      </span>
                      <h4 className="text-base font-black text-white">
                        Pacote Ativo do Plano Gratuito
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                      SINCRONIZADO
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs">
                    <li className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Criação de Anúncios:</span>
                      <strong className="text-white font-mono">
                        Até {freePlanAdLimit} anúncio(s) ativo(s)
                      </strong>
                    </li>
                    <li className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Assistente de IA:</span>
                      <strong className="text-emerald-400 font-mono">
                        {freePlanAiAssistantEnabled
                          ? `Ativo (${freePlanAiAssistantQuota} uso/mês)`
                          : 'Bloqueado'}
                      </strong>
                    </li>
                    <li className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Otimizador de Anúncios IA:</span>
                      <strong className="text-emerald-400 font-mono">
                        {freePlanAdOptimizerEnabled
                          ? `Ativo (${freePlanAdOptimizerQuota} análise/mês)`
                          : 'Bloqueado'}
                      </strong>
                    </li>
                    <li className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Cliques WhatsApp Rastreados:</span>
                      <strong className="text-white font-mono">{freePlanClickLimit}/mês</strong>
                    </li>
                    <li className="flex items-center justify-between py-1.5">
                      <span className="text-slate-400">Fotos na Galeria:</span>
                      <strong className="text-white font-mono">{freePlanPhotoLimit} foto(s)</strong>
                    </li>
                  </ul>
                </div>

                {/* Global Broadcast to Merchants */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-5">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Disparar Comunicado Oficial para Lojistas
                    </h3>
                    <p className="text-xs text-slate-500">
                      Envie um aviso diretamente para a central de notificações de todos os negócios de Sorocaba.
                    </p>
                  </div>

                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Ex: Novo horário de pico detectado para a Black Friday em Sorocaba! Ativem o Cacilda AI Studio..."
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-[#FE3A18] focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (!broadcastMessage.trim()) return;
                      setBroadcastMessage('');
                      triggerToast(
                        `Comunicado enviado para ${metrics.totalBusinesses} lojistas cadastrados em Sorocaba!`
                      );
                    }}
                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs cursor-pointer"
                  >
                    Enviar Comunicado Global
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal: Cadastrar Nova Empresa Manualmente pelo Admin */}
      <AnimatePresence>
        {showAddBusinessModal && (
          <div
            onClick={() => setShowAddBusinessModal(false)}
            className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900">
                  Cadastrar & Verificar Nova Empresa (Admin)
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddBusinessModal(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddNewBusiness} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome Fantasia da Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBizName}
                    onChange={(e) => setNewBizName(e.target.value)}
                    placeholder="Ex: Clínica Vida Plena Campolim"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Responsável
                    </label>
                    <input
                      type="text"
                      value={newBizOwner}
                      onChange={(e) => setNewBizOwner(e.target.value)}
                      placeholder="Nome do sócio/gestor"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp Comercial
                    </label>
                    <input
                      type="text"
                      value={newBizWhatsapp}
                      onChange={(e) => setNewBizWhatsapp(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Bairro em Sorocaba
                    </label>
                    <select
                      value={newBizNeighborhood}
                      onChange={(e) => setNewBizNeighborhood(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                    >
                      <option value="Campolim">Campolim</option>
                      <option value="Centro">Centro</option>
                      <option value="Santa Rosália">Santa Rosália</option>
                      <option value="Wanel Ville">Wanel Ville</option>
                      <option value="Trujillo">Trujillo</option>
                      <option value="Além Ponte">Além Ponte</option>
                      <option value="Votorantim">Votorantim</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Plano Inicial Concedido
                    </label>
                    <select
                      value={newBizPlan}
                      onChange={(e) =>
                        setNewBizPlan(
                          e.target.value as 'Gratuito' | 'Premium Pro' | 'Enterprise VIP'
                        )
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                    >
                      <option value="Gratuito">Plano Gratuito</option>
                      <option value="Premium Pro">Plano Premium Pro</option>
                      <option value="Enterprise VIP">Enterprise VIP</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={newBizCategory}
                    onChange={(e) => setNewBizCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                  >
                    <option value="Restaurantes & Gastronomia">Restaurantes & Gastronomia</option>
                    <option value="Saúde & Estética">Saúde & Estética</option>
                    <option value="Oficinas & Automotivo">Oficinas & Automotivo</option>
                    <option value="Imobiliárias & Arquitetura">Imobiliárias & Arquitetura</option>
                    <option value="Casa de Repouso & Cuidado">Casa de Repouso & Cuidado</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddBusinessModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-black text-xs cursor-pointer"
                  >
                    Salvar e Ativar no Diretório
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mercado Pago Checkout Modal from Admin Panel */}
      <MercadoPagoCheckoutModal
        isOpen={adminMpModalOpen}
        onClose={() => setAdminMpModalOpen(false)}
        initialPlanId={adminMpPlanId}
      />
    </div>
  );
}
