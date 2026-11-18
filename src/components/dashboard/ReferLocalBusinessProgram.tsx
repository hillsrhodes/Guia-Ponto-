import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Share2,
  Link2,
  Copy,
  Check,
  Sparkles,
  UserPlus,
  Building2,
  MapPin,
  Award,
  Zap,
  Trophy,
  ArrowUpRight,
  Gift,
  ShieldCheck,
  MessageSquare,
  RefreshCw,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Badge3DIcon, unlockLocalConnectorBadge } from './BadgeShowcase';
import { triggerAchievementCelebration } from './AchievementCelebration';

export interface ReferredBusinessRecord {
  id: string;
  businessName: string;
  ownerName: string;
  category: string;
  neighborhood: string;
  city: string;
  phone: string;
  referralCodeUsed: string;
  registeredAt: string;
  referrerXpEarned: number;
  inviteeXpEarned: number;
  badgeAwarded: 'Local Connector';
  status: 'Verificado & Ativo' | 'Bonificação Dupla Concedida';
}

interface ReferLocalBusinessProgramProps {
  referrerBusinessName: string;
  referrerOwnerName: string;
  onAwardXp: (points: number, reason: string) => void;
  onNewPartnerRegistered?: (partner: {
    id: string;
    name: string;
    category: string;
    rating: number;
    location: string;
    whatsapp: string;
    verified: boolean;
    image: string;
  }) => void;
}

const SOROCABA_ZONES = [
  'Campolim',
  'Santa Rosália',
  'Centro Histórico',
  'Wanel Ville',
  'Trujillo',
  'Jardim Faculdade',
  'Éden / Zona Industrial',
  'Votorantim (RM Sorocaba)'
];

const BUSINESS_CATEGORIES = [
  'Restaurantes & Gastronomia',
  'Saúde & Estética',
  'Oficinas & Automotivo',
  'Imobiliárias & Arquitetura',
  'Casa de Repouso & Cuidado',
  'Varejo & Serviços Locais'
];

const STORAGE_KEY_REFERRALS = 'guiaponto_sorocaba_referrals_v1';

const INITIAL_REFERRED_BUSINESSES: ReferredBusinessRecord[] = [
  {
    id: 'ref-101',
    businessName: 'Bistrô & Cafeteria Villa Campolim',
    ownerName: 'Renata Vasconcelos',
    category: 'Restaurantes & Gastronomia',
    neighborhood: 'Campolim',
    city: 'Sorocaba - SP',
    phone: '(15) 99145-8821',
    referralCodeUsed: 'SOROCABA-ALEXANDRE-500',
    registeredAt: 'Há 3 dias',
    referrerXpEarned: 500,
    inviteeXpEarned: 500,
    badgeAwarded: 'Local Connector',
    status: 'Bonificação Dupla Concedida'
  },
  {
    id: 'ref-102',
    businessName: 'Estética Avançada Lumina Derma',
    ownerName: 'Dr. Henrique Prado',
    category: 'Saúde & Estética',
    neighborhood: 'Santa Rosália',
    city: 'Sorocaba - SP',
    phone: '(15) 99782-3310',
    referralCodeUsed: 'SOROCABA-ALEXANDRE-500',
    registeredAt: 'Ontem',
    referrerXpEarned: 500,
    inviteeXpEarned: 500,
    badgeAwarded: 'Local Connector',
    status: 'Bonificação Dupla Concedida'
  }
];

const LOCAL_CONNECTOR_PALETTE = {
  primary: '#14B8A6',
  secondary: '#0F766E',
  glow: 'rgba(20, 184, 166, 0.5)',
  rim: '#99F6E4',
  bgGradient: 'from-teal-500/25 via-emerald-800/15 to-slate-900',
  badgeText: 'text-teal-300'
};

export function ReferLocalBusinessProgram({
  referrerBusinessName,
  referrerOwnerName,
  onAwardXp,
  onNewPartnerRegistered
}: ReferLocalBusinessProgramProps) {
  // Referral Link Generator State
  const [selectedZone, setSelectedZone] = useState<string>('Campolim');
  const [customCampaignTag, setCustomCampaignTag] = useState<string>('EXPANSAO-DDD15');
  const [referralCode, setReferralCode] = useState<string>('SOROCABA-ALEXANDRE-500');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedInviteText, setCopiedInviteText] = useState<boolean>(false);
  const [badgeSpinCount, setBadgeSpinCount] = useState<number>(0);

  // Referred Businesses Ledger State
  const [referredList, setReferredList] = useState<ReferredBusinessRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REFERRALS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_REFERRED_BUSINESSES;
  });

  // New Referred Business Registration Simulator Form
  const [newBizName, setNewBizName] = useState<string>('');
  const [newOwnerName, setNewOwnerName] = useState<string>('');
  const [newBizCategory, setNewBizCategory] = useState<string>(BUSINESS_CATEGORIES[0]);
  const [newBizNeighborhood, setNewBizNeighborhood] = useState<string>('Campolim');
  const [newBizPhone, setNewBizPhone] = useState<string>('(15) 99610-4490');
  const [celebrationBanner, setCelebrationBanner] = useState<{
    referrerName: string;
    newBusinessName: string;
    neighborhood: string;
    xpEach: number;
  } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REFERRALS, JSON.stringify(referredList));
    } catch {
      // ignore storage errors
    }
  }, [referredList]);

  const baseAppOrigin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://guiaponto.com.br';

  const uniqueReferralUrl = `${baseAppOrigin}/?ref=${encodeURIComponent(
    referralCode
  )}&bairro=${encodeURIComponent(selectedZone.toLowerCase().replace(/\s+/g, '-'))}&campanha=${encodeURIComponent(
    customCampaignTag
  )}`;

  const handleGenerateNewCode = () => {
    const cleanZone = selectedZone
      .split(' ')[0]
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const nextCode = `GP-${cleanZone}-${randomSuffix}`;
    setReferralCode(nextCode);
    setBadgeSpinCount((prev) => prev + 1);
    onAwardXp(25, `Gerou link exclusivo de indicação para ${selectedZone}`);
  };

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(uniqueReferralUrl);
    setCopiedLink(true);
    onAwardXp(30, 'Copiou Link Único de Indicação Sorocaba');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const whatsappInviteMessage = `Olá! Aqui é ${referrerOwnerName} da ${referrerBusinessName}. Estou convidando negócios parceiros de ${selectedZone} e Sorocaba para o diretório GuiaPonto! Cadastre sua empresa pelo meu link exclusivo para nós dois ganharmos +500 XP de impulso e a insígnia 3D "Local Connector" na vitrine pública: ${uniqueReferralUrl}`;

  const handleCopyWhatsappInvite = () => {
    navigator.clipboard.writeText(whatsappInviteMessage);
    setCopiedInviteText(true);
    onAwardXp(30, 'Copiou Convite B2B para WhatsApp');
    setTimeout(() => setCopiedInviteText(false), 3000);
  };

  const handleSimulateReferralRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedBiz = newBizName.trim() || 'Empório & Gastronomia Real Campolim';
    const trimmedOwner = newOwnerName.trim() || ' Marcelo Tavares';

    const xpRewardEach = 500;
    const newRecord: ReferredBusinessRecord = {
      id: `ref-${Date.now()}`,
      businessName: trimmedBiz,
      ownerName: trimmedOwner,
      category: newBizCategory,
      neighborhood: newBizNeighborhood,
      city: 'Sorocaba - SP',
      phone: newBizPhone.trim() || '(15) 99811-2200',
      referralCodeUsed: referralCode,
      registeredAt: 'Agora mesmo',
      referrerXpEarned: xpRewardEach,
      inviteeXpEarned: xpRewardEach,
      badgeAwarded: 'Local Connector',
      status: 'Bonificação Dupla Concedida'
    };

    setReferredList((prev) => [newRecord, ...prev]);

    // Unlock and sync the 3D 'Local Connector' badge in BadgeShowcase & Public Landing Page
    unlockLocalConnectorBadge(true);
    setBadgeSpinCount((prev) => prev + 2);

    // Trigger canvas-confetti AchievementCelebration modal for the Local Connector badge & dual XP milestone
    triggerAchievementCelebration({
      type: 'badge',
      title: 'Local Connector • Sorocaba',
      subtitle: `Parceria B2B Confirmada: ${trimmedBiz}`,
      description: `Indicação verificada em ${newBizNeighborhood}, Sorocaba! Ambos os negócios receberam +${xpRewardEach} XP e desbloquearam a insígnia 3D "Local Connector".`,
      xpEarned: xpRewardEach,
      rarity: 'Épico',
      trustBoostLabel: '+28% Rede B2B Sorocaba',
      badgeIconType: 'local_connector',
      badgePalette: LOCAL_CONNECTOR_PALETTE
    });

    // Award XP to the referrer
    onAwardXp(
      xpRewardEach,
      `Indicação Confirmada: ${trimmedBiz} (+500 XP & Insígnia Local Connector para ambos!)`
    );

    // Also notify parent if it wants to add the business to the Partner Directory
    if (onNewPartnerRegistered) {
      onNewPartnerRegistered({
        id: newRecord.id,
        name: newRecord.businessName,
        category: newRecord.category,
        rating: 5.0,
        location: `${newRecord.neighborhood}, Sorocaba - SP`,
        whatsapp: newRecord.phone,
        verified: true,
        image:
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80'
      });
    }

    setCelebrationBanner({
      referrerName: referrerBusinessName,
      newBusinessName: trimmedBiz,
      neighborhood: newBizNeighborhood,
      xpEach: xpRewardEach
    });

    setNewBizName('');
    setNewOwnerName('');
  };

  const totalReferrals = referredList.length;
  const totalXpGenerated = referredList.reduce(
    (acc, item) => acc + item.referrerXpEarned,
    0
  );
  const nextMilestoneTarget = 5;
  const expansionProgressPct = Math.min(
    100,
    Math.round((totalReferrals / nextMilestoneTarget) * 100)
  );

  return (
    <div className="bg-slate-950 text-white rounded-3xl border border-teal-500/30 shadow-2xl overflow-hidden relative">
      {/* Ambient Background Glows */}
      <div className="absolute -top-28 -right-28 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -left-28 w-96 h-96 bg-[#FE3A18]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & 3D 'Local Connector' Badge Spotlight */}
      <div className="p-6 sm:p-8 border-b border-slate-800/90 relative z-10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
              <Sparkles className="w-4 h-4 text-[#FE3A18]" />
              <span>PROGRAMA REFER-A-LOCAL-BUSINESS · EXPANSÃO SOROCABA</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-300 font-mono">RECOMPENSA DUPLA B2B</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Indique uma Empresa de Sorocaba & Desbloqueie o Selo 3D "Local Connector"
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Gere seu link único de embaixador local. Quando um novo comércio ou prestador de serviços de Sorocaba se cadastra pelo seu link,{' '}
              <strong className="text-teal-300">
                tanto a sua empresa quanto o novo negócio ganham +500 XP
              </strong>{' '}
              e recebem a insígnia 3D oficial <strong className="text-white">"Local Connector"</strong> na vitrine pública.
            </p>
          </div>

          {/* 3D Local Connector Badge Interactive Pedestal */}
          <div className="bg-slate-900/95 border border-teal-500/40 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0 shadow-xl">
            <div
              onClick={() => setBadgeSpinCount((prev) => prev + 1)}
              className="cursor-pointer shrink-0"
              title="Clique para girar a insígnia 3D Local Connector"
            >
              <Badge3DIcon
                iconType="local_connector"
                palette={LOCAL_CONNECTOR_PALETTE}
                size="md"
                isHovered={true}
                spinTrigger={badgeSpinCount}
              />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-300 block">
                INSÍGNIA 3D DE RECOMPENSA DUPLA
              </span>
              <h4 className="text-base font-black text-white">Local Connector</h4>
              <p className="text-xs text-slate-300 max-w-[200px]">
                Concedida ao Indicador e ao Novo Lojista (+500 XP cada)
              </p>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                +28% Autoridade B2B em Sorocaba
              </span>
            </div>
          </div>
        </div>

        {/* Quantitative Expansion KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Negócios Indicados em Sorocaba
            </span>
            <div className="text-2xl font-black text-white font-mono tabular-nums mt-1">
              {totalReferrals} negócios
            </div>
            <span className="text-[11px] text-teal-400 font-semibold mt-0.5 block">
              Rede B2B Verificada DDD (15)
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              XP Acumulado por Indicações
            </span>
            <div className="text-2xl font-black text-amber-400 font-mono tabular-nums mt-1">
              +{totalXpGenerated.toLocaleString('pt-BR')} XP
            </div>
            <span className="text-[11px] text-slate-300 font-semibold mt-0.5 block">
              +500 XP para você e +500 XP para o convidado
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Meta Hub Sorocaba ({totalReferrals}/{nextMilestoneTarget})
              </span>
              <span className="font-mono font-bold text-teal-300">{expansionProgressPct}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${expansionProgressPct}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 block">
              Indique {Math.max(0, nextMilestoneTarget - totalReferrals)} mais para 1 mês de Boost Grátis
            </span>
          </div>
        </div>
      </div>

      {/* Dual-Reward Celebration Banner when a new business registers */}
      <AnimatePresence>
        {celebrationBanner && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-teal-950 via-emerald-900/90 to-slate-900 border-b border-teal-400/40 px-6 py-5 relative z-10"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-teal-300 block">
                    RECOMPENSA DUPLA CONCEDIDA · EXPANSÃO SOROCABA ({celebrationBanner.neighborhood.toUpperCase()})
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white">
                    {celebrationBanner.referrerName} & {celebrationBanner.newBusinessName} ganharam +{celebrationBanner.xpEach} XP e o selo 3D "Local Connector"!
                  </h4>
                  <p className="text-xs text-slate-200 mt-0.5">
                    A conquista 3D "Local Connector" já foi desbloqueada e fixada na sua vitrine de conquistas do Perfil.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCelebrationBanner(null)}
                className="px-4 py-2 rounded-xl bg-slate-950/60 hover:bg-slate-950 text-teal-200 text-xs font-bold border border-teal-400/30 cursor-pointer shrink-0"
              >
                Fechar Aviso
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Two-Column Interactive Workspace */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left Column (7 cols): Unique Referral Link Generator & Share Tools */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Link2 className="w-5 h-5 text-teal-400" />
                <div>
                  <h4 className="font-extrabold text-base text-white">
                    1. Gerador de Link Único de Indicação
                  </h4>
                  <p className="text-xs text-slate-400">
                    Personalize o link por bairro de Sorocaba para rastrear suas indicações B2B
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateNewCode}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Gerar Novo Código</span>
              </button>
            </div>

            {/* Zone & Campaign Customizer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Região / Bairro Alvo em Sorocaba
                </label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-teal-400"
                >
                  {SOROCABA_ZONES.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Código Único do Embaixador
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-teal-300 focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            {/* Generated URL Copy Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-teal-500/30 space-y-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-teal-300 uppercase tracking-wider">
                  Seu Link Exclusivo de Indicação Local:
                </span>
                <span className="text-slate-400 font-mono">
                  Recompensa: +500 XP + Badge 3D Local Connector
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={uniqueReferralUrl}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-emerald-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyReferralLink}
                  className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-lg shadow-teal-500/20"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Link Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Link Único</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Ready-to-Send WhatsApp B2B Pitch */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  Mensagem Pronta para Enviar a Lojistas no WhatsApp
                </span>
                <button
                  type="button"
                  onClick={handleCopyWhatsappInvite}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedInviteText ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Mensagem Copiada!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Convite WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800/80 font-mono">
                {whatsappInviteMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Interactive New Business Referral Registration Simulator */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 space-y-5 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#FE3A18] text-white flex items-center justify-center font-black shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                    TESTAR CONVERSÃO DE INDICAÇÃO
                  </span>
                  <h4 className="font-extrabold text-base text-white">
                    2. Cadastrar Nova Empresa via Link
                  </h4>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Registre uma empresa parceira usando o código{' '}
                <span className="font-mono font-bold text-teal-300">{referralCode}</span> para creditar instantaneamente{' '}
                <strong className="text-white">+500 XP</strong> e a conquista 3D{' '}
                <strong className="text-teal-300">Local Connector</strong> para ambos os negócios.
              </p>

              <form onSubmit={handleSimulateReferralRegistration} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Nome da Nova Empresa em Sorocaba
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Padaria Artesanal Ouro do Campolim"
                    value={newBizName}
                    onChange={(e) => setNewBizName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Responsável / Lojista
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Camila Rocha"
                      value={newOwnerName}
                      onChange={(e) => setNewOwnerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      WhatsApp Comercial
                    </label>
                    <input
                      type="text"
                      value={newBizPhone}
                      onChange={(e) => setNewBizPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-semibold text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Categoria do Negócio
                    </label>
                    <select
                      value={newBizCategory}
                      onChange={(e) => setNewBizCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-teal-400"
                    >
                      {BUSINESS_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Bairro em Sorocaba
                    </label>
                    <select
                      value={newBizNeighborhood}
                      onChange={(e) => setNewBizNeighborhood(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-teal-400"
                    >
                      {SOROCABA_ZONES.map((z) => (
                        <option key={z} value={z}>
                          {z}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#FE3A18] to-amber-500 hover:opacity-95 text-white font-black text-xs shadow-xl shadow-[#FE3A18]/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>Confirmar Cadastro Indicado (+500 XP & Selo p/ Ambos)</span>
                </button>
              </form>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Validação Automática DDD (15)</span>
              <span className="text-teal-300 font-bold">Sincronizado com Badge Showcase 3D</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ledger: History of Referred Sorocaba Businesses */}
      <div className="px-6 sm:px-8 pb-8 relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-teal-400" />
              <h4 className="font-extrabold text-sm text-white">
                Histórico de Negócios Conectados por Você em Sorocaba ({referredList.length})
              </h4>
            </div>
            <span className="text-xs text-emerald-400 font-bold">
              Todos os negócios abaixo receberam +500 XP + Insígnia "Local Connector"
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-5">Empresa Indicada</th>
                  <th className="py-3.5 px-5">Bairro / Região</th>
                  <th className="py-3.5 px-5">Código Utilizado</th>
                  <th className="py-3.5 px-5">Recompensa Dupla</th>
                  <th className="py-3.5 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {referredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-extrabold text-white">{item.businessName}</div>
                      <div className="text-[11px] text-slate-400">
                        {item.ownerName} · {item.category}
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-slate-200 font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#FE3A18]" />
                        {item.neighborhood}, {item.city}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{item.phone}</span>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-teal-300 font-bold">
                      {item.referralCodeUsed}
                      <span className="block text-[10px] text-slate-500 font-sans font-normal">
                        {item.registeredAt}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-amber-400">
                        +{item.referrerXpEarned} XP (Você) / +{item.inviteeXpEarned} XP (Convidado)
                      </div>
                      <div className="text-[11px] text-teal-300 font-semibold flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        Insígnia 3D: {item.badgeAwarded}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
