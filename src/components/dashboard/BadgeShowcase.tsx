import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Pin,
  Sparkles,
  ShieldCheck,
  Award,
  Lock,
  Unlock,
  Check,
  Eye,
  RotateCw,
  ArrowUpRight,
  Layers,
  Star,
  Flame,
  Crown,
  Zap,
  Globe
} from 'lucide-react';
import { triggerAchievementCelebration } from './AchievementCelebration';

export interface DigitalAchievementBadge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'Performance' | 'Reputação' | 'Inovação IA' | 'Regional Sorocaba';
  rarity: 'Lendário' | 'Épico' | 'Ouro' | 'Verificado';
  unlocked: boolean;
  pinned: boolean;
  unlockedAt?: string;
  xpValue: number;
  trustBoostLabel: string;
  progress: number;
  requirementText: string;
  iconType: 'pioneer_star' | 'rocket_100' | 'crown_top' | 'ai_prism' | 'sorocaba_shield' | 'whatsapp_flash' | 'diamond_elite' | 'seo_globe' | 'local_connector';
  palette: {
    primary: string;
    secondary: string;
    glow: string;
    rim: string;
    bgGradient: string;
    badgeText: string;
  };
}

export const BADGE_SHOWCASE_STORAGE_KEY = 'guiaponto_pinned_badges_v1';

export const DEFAULT_DIGITAL_BADGES: DigitalAchievementBadge[] = [
  {
    id: 'badge-pioneer-sorocaba',
    title: 'Pioneiro GuiaPonto',
    subtitle: 'Membro Fundador Sorocaba',
    description: 'Concedido às empresas fundadoras verificadas na região metropolitana de Sorocaba com histórico íntegro.',
    category: 'Regional Sorocaba',
    rarity: 'Lendário',
    unlocked: true,
    pinned: true,
    unlockedAt: '12 Jan 2026',
    xpValue: 500,
    trustBoostLabel: '+18% Confiança Local',
    progress: 100,
    requirementText: 'Cadastro verificado no lote fundador de Sorocaba',
    iconType: 'pioneer_star',
    palette: {
      primary: '#F59E0B',
      secondary: '#EA580C',
      glow: 'rgba(245, 158, 11, 0.45)',
      rim: '#FDE68A',
      bgGradient: 'from-amber-500/25 via-orange-600/15 to-slate-900',
      badgeText: 'text-amber-300'
    }
  },
  {
    id: 'badge-top-rated-category',
    title: 'Top Rated 4.9★',
    subtitle: 'Líder de Avaliações no Campolim',
    description: 'Mantém nota média igual ou superior a 4.8 estrelas em mais de 100 avaliações auditadas de clientes reais.',
    category: 'Reputação',
    rarity: 'Lendário',
    unlocked: true,
    pinned: true,
    unlockedAt: '04 Fev 2026',
    xpValue: 450,
    trustBoostLabel: '+24% Conversão na Vitrine',
    progress: 100,
    requirementText: 'Manter média 4.8+ por 60 dias consecutivos',
    iconType: 'crown_top',
    palette: {
      primary: '#FBBF24',
      secondary: '#B45309',
      glow: 'rgba(251, 191, 36, 0.5)',
      rim: '#FEF08A',
      bgGradient: 'from-yellow-500/25 via-amber-700/15 to-slate-900',
      badgeText: 'text-yellow-300'
    }
  },
  {
    id: 'badge-whatsapp-flash',
    title: 'Resposta Flash < 5m',
    subtitle: 'Atendimento Instantâneo WhatsApp',
    description: 'Reconhece lojistas que respondem novos leads e pedidos de orçamento em menos de 5 minutos.',
    category: 'Performance',
    rarity: 'Épico',
    unlocked: true,
    pinned: true,
    unlockedAt: '19 Mar 2026',
    xpValue: 350,
    trustBoostLabel: '+31% Leads no WhatsApp',
    progress: 100,
    requirementText: 'Tempo médio de resposta abaixo de 5 min',
    iconType: 'whatsapp_flash',
    palette: {
      primary: '#10B981',
      secondary: '#047857',
      glow: 'rgba(16, 185, 129, 0.45)',
      rim: '#A7F3D0',
      bgGradient: 'from-emerald-500/25 via-teal-700/15 to-slate-900',
      badgeText: 'text-emerald-300'
    }
  },
  {
    id: 'badge-ai-master-creator',
    title: 'AI Master Creator',
    subtitle: 'Campanhas Otimizadas com IA',
    description: 'Dominou o GuiaPonto IA Studio e o Auto-Follow-up inteligente para criar campanhas de alta conversão.',
    category: 'Inovação IA',
    rarity: 'Épico',
    unlocked: true,
    pinned: false,
    unlockedAt: '02 Abr 2026',
    xpValue: 400,
    trustBoostLabel: '+22% CTR nos Anúncios',
    progress: 100,
    requirementText: '3+ campanhas otimizadas com Gemini IA',
    iconType: 'ai_prism',
    palette: {
      primary: '#8B5CF6',
      secondary: '#4F46E5',
      glow: 'rgba(139, 92, 246, 0.45)',
      rim: '#DDD6FE',
      bgGradient: 'from-violet-500/25 via-indigo-700/15 to-slate-900',
      badgeText: 'text-violet-300'
    }
  },
  {
    id: 'badge-100-clicks-rocket',
    title: 'Marco 1.000 Cliques',
    subtitle: 'Tração Comercial Acelerada',
    description: 'Superou a marca de 1.000 cliques qualificados de consumidores na região de Sorocaba.',
    category: 'Performance',
    rarity: 'Ouro',
    unlocked: true,
    pinned: false,
    unlockedAt: '28 Abr 2026',
    xpValue: 300,
    trustBoostLabel: 'Destaque em Buscas Locais',
    progress: 100,
    requirementText: 'Alcançar 1.000 cliques auditados no diretório',
    iconType: 'rocket_100',
    palette: {
      primary: '#FE3A18',
      secondary: '#BE123C',
      glow: 'rgba(254, 58, 24, 0.45)',
      rim: '#FECDD3',
      bgGradient: 'from-[#FE3A18]/25 via-rose-700/15 to-slate-900',
      badgeText: 'text-rose-300'
    }
  },
  {
    id: 'badge-sorocaba-verified-shield',
    title: 'Guardião Local DDD 15',
    subtitle: 'Empresa 100% Auditada Sorocaba',
    description: 'CNPJ ativo, endereço presencial validado por geolocalização em Sorocaba e conformidade LGPD.',
    category: 'Regional Sorocaba',
    rarity: 'Verificado',
    unlocked: true,
    pinned: true,
    unlockedAt: '10 Mai 2026',
    xpValue: 350,
    trustBoostLabel: 'Selo Oficial de Segurança',
    progress: 100,
    requirementText: 'Validação geográfica e documental em Sorocaba',
    iconType: 'sorocaba_shield',
    palette: {
      primary: '#06B6D4',
      secondary: '#0369A1',
      glow: 'rgba(6, 182, 212, 0.45)',
      rim: '#BAE6FD',
      bgGradient: 'from-cyan-500/25 via-sky-700/15 to-slate-900',
      badgeText: 'text-cyan-300'
    }
  },
  {
    id: 'badge-seo-dominator',
    title: 'Dominador Google SERP',
    subtitle: 'Indexação Orgânica Nível Ouro',
    description: 'Atingiu 95+ pontos no SEO Optimizer com Rich Snippets de estrelas ativos para buscas locais.',
    category: 'Inovação IA',
    rarity: 'Ouro',
    unlocked: false,
    pinned: false,
    xpValue: 450,
    trustBoostLabel: '+48% Tráfego Orgânico',
    progress: 88,
    requirementText: 'Atingir Score SEO 96+ em 3 anúncios ativos (88%)',
    iconType: 'seo_globe',
    palette: {
      primary: '#38BDF8',
      secondary: '#1D4ED8',
      glow: 'rgba(56, 189, 248, 0.45)',
      rim: '#E0F2FE',
      bgGradient: 'from-sky-500/25 via-blue-700/15 to-slate-900',
      badgeText: 'text-sky-300'
    }
  },
  {
    id: 'badge-diamond-regional',
    title: 'Diamante Regional',
    subtitle: 'Elite 1% de Sorocaba & Região',
    description: 'A honraria máxima do GuiaPonto: reservada a empresas com Reputation Score 98+ e zero reclamações.',
    category: 'Reputação',
    rarity: 'Lendário',
    unlocked: false,
    pinned: false,
    xpValue: 1000,
    trustBoostLabel: '+45% Autoridade Máxima',
    progress: 94,
    requirementText: 'Alcançar Reputation Score 98/100 (Atual: 94/100)',
    iconType: 'diamond_elite',
    palette: {
      primary: '#E879F9',
      secondary: '#7E22CE',
      glow: 'rgba(232, 121, 249, 0.5)',
      rim: '#FAE8FF',
      bgGradient: 'from-fuchsia-500/25 via-purple-800/15 to-slate-900',
      badgeText: 'text-fuchsia-300'
    }
  },
  {
    id: 'badge-local-connector',
    title: 'Local Connector',
    subtitle: 'Embaixador da Expansão Sorocaba',
    description: 'Concedido aos lojistas e parceiros indicados que expandem o ecossistema comercial verificado de Sorocaba e região.',
    category: 'Regional Sorocaba',
    rarity: 'Épico',
    unlocked: true,
    pinned: false,
    unlockedAt: '13 Nov 2026',
    xpValue: 500,
    trustBoostLabel: '+28% Rede B2B Sorocaba',
    progress: 100,
    requirementText: 'Indicar ou registrar-se via link de referência local em Sorocaba',
    iconType: 'local_connector',
    palette: {
      primary: '#14B8A6',
      secondary: '#0F766E',
      glow: 'rgba(20, 184, 166, 0.5)',
      rim: '#99F6E4',
      bgGradient: 'from-teal-500/25 via-emerald-800/15 to-slate-900',
      badgeText: 'text-teal-300'
    }
  }
];

export function loadStoredBadges(): DigitalAchievementBadge[] {
  try {
    const raw = localStorage.getItem(BADGE_SHOWCASE_STORAGE_KEY);
    if (!raw) return DEFAULT_DIGITAL_BADGES;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_DIGITAL_BADGES;
    return DEFAULT_DIGITAL_BADGES.map((def) => {
      const found = parsed.find((b: DigitalAchievementBadge) => b.id === def.id);
      if (!found) return def;
      return {
        ...def,
        unlocked: Boolean(found.unlocked),
        pinned: Boolean(found.pinned && found.unlocked),
        unlockedAt: found.unlockedAt || def.unlockedAt,
        progress: typeof found.progress === 'number' ? found.progress : def.progress
      };
    });
  } catch {
    return DEFAULT_DIGITAL_BADGES;
  }
}

export function getPinnedBadgesForPublicProfile(): DigitalAchievementBadge[] {
  return loadStoredBadges().filter((b) => b.unlocked && b.pinned);
}

export function unlockLocalConnectorBadge(autoPinIfRoom = true): DigitalAchievementBadge | null {
  try {
    const current = loadStoredBadges();
    const pinnedCount = current.filter((b) => b.unlocked && b.pinned).length;
    const updated = current.map((b) => {
      if (b.id === 'badge-local-connector') {
        return {
          ...b,
          unlocked: true,
          progress: 100,
          unlockedAt: 'Agora • Expansão Sorocaba',
          pinned: b.pinned || (autoPinIfRoom && pinnedCount < 4)
        };
      }
      return b;
    });
    localStorage.setItem(BADGE_SHOWCASE_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('guiaponto-badges-external-sync'));
    window.dispatchEvent(new CustomEvent('guiaponto-badges-updated'));
    return updated.find((b) => b.id === 'badge-local-connector') || null;
  } catch {
    return null;
  }
}

/**
 * Custom 3D Sculpted SVG Emblem Renderer with multi-layered depth & specular highlights
 */
export function Badge3DIcon({
  iconType,
  palette,
  size = 'md',
  isHovered = false,
  spinTrigger = 0
}: {
  iconType: DigitalAchievementBadge['iconType'];
  palette: DigitalAchievementBadge['palette'];
  size?: 'sm' | 'md' | 'lg';
  isHovered?: boolean;
  spinTrigger?: number;
}) {
  const dimensions =
    size === 'lg' ? 'w-28 h-28' : size === 'sm' ? 'w-12 h-12' : 'w-20 h-20';

  const gradId = `grad-${iconType}-${size}`;
  const rimId = `rim-${iconType}-${size}`;
  const shadowId = `drop-${iconType}-${size}`;

  return (
    <motion.div
      animate={{
        rotateY: spinTrigger * 360 + (isHovered ? 18 : 0),
        rotateX: isHovered ? -12 : 0,
        y: isHovered ? -5 : [0, -4, 0]
      }}
      transition={{
        rotateY: { duration: 0.75, ease: 'easeOut' },
        rotateX: { duration: 0.35, ease: 'easeOut' },
        y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
      }}
      style={{ transformStyle: 'preserve-3d' }}
      className={`relative ${dimensions} flex items-center justify-center select-none`}
    >
      {/* Back Ambient 3D Glow Plane */}
      <div
        className="absolute inset-1 rounded-full blur-xl transition-opacity duration-300 pointer-events-none"
        style={{
          background: palette.glow,
          opacity: isHovered ? 0.95 : 0.55,
          transform: 'translateZ(-18px)'
        }}
      />

      {/* Outer 3D Orbital Bezel Ring */}
      <div
        className="absolute inset-0 rounded-2xl border border-white/25 pointer-events-none transition-transform duration-300"
        style={{
          background: `linear-gradient(135deg, ${palette.primary}33 0%, rgba(15,23,42,0.85) 65%, ${palette.secondary}44 100%)`,
          boxShadow: `0 14px 28px -8px ${palette.glow}, inset 0 2px 4px rgba(255,255,255,0.45), inset 0 -4px 8px rgba(0,0,0,0.65)`,
          transform: 'translateZ(0px) rotate(6deg)'
        }}
      />

      {/* Secondary Tilted 3D Pedestal Plate */}
      <div
        className="absolute inset-1.5 rounded-xl border border-white/20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 25%, ${palette.primary}55, rgba(15,23,42,0.92) 75%)`,
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.35)',
          transform: 'translateZ(10px)'
        }}
      />

      {/* Foreground Sculpted 3D Vector Emblem */}
      <svg
        viewBox="0 0 100 100"
        className="w-4/5 h-4/5 relative z-10 overflow-visible"
        style={{
          transform: 'translateZ(26px)',
          filter: `drop-shadow(0 8px 10px rgba(0,0,0,0.65))`
        }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.rim} />
            <stop offset="45%" stopColor={palette.primary} />
            <stop offset="100%" stopColor={palette.secondary} />
          </linearGradient>
          <linearGradient id={rimId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={palette.secondary} />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="#000000" floodOpacity="0.55" />
          </filter>
        </defs>

        {/* 3D Extruded Base Polygon (Simulated 3D Depth Layer) */}
        <polygon
          points="50,10 86,28 86,72 50,90 14,72 14,28"
          fill={palette.secondary}
          transform="translate(0, 5)"
          opacity="0.85"
        />

        {/* Main Faceted Hexagonal Medallion */}
        <polygon
          points="50,10 86,28 86,72 50,90 14,72 14,28"
          fill={`url(#${gradId})`}
          stroke={`url(#${rimId})`}
          strokeWidth="3.5"
          filter={`url(#${shadowId})`}
        />

        {/* Inner Specular Facet Highlight */}
        <polygon
          points="50,17 79,32 79,68 50,83 21,68 21,32"
          fill="rgba(15, 23, 42, 0.35)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.2"
        />

        {/* Top Gloss Reflection Arc */}
        <path
          d="M 22 33 L 50 18 L 78 33 L 68 42 L 50 32 L 32 42 Z"
          fill="rgba(255,255,255,0.28)"
        />

        {/* Specific 3D Centerpiece Icon */}
        {iconType === 'pioneer_star' && (
          <g>
            <polygon
              points="50,24 58,41 76,43 63,56 66,74 50,65 34,74 37,56 24,43 42,41"
              fill={palette.secondary}
              transform="translate(0, 3)"
            />
            <polygon
              points="50,24 58,41 76,43 63,56 66,74 50,65 34,74 37,56 24,43 42,41"
              fill="#FFFFFF"
              stroke={palette.rim}
              strokeWidth="2"
            />
            <circle cx="50" cy="50" r="6" fill={palette.primary} />
          </g>
        )}

        {iconType === 'crown_top' && (
          <g>
            <path
              d="M26,66 L74,66 L78,38 L62,48 L50,28 L38,48 L22,38 Z"
              fill={palette.secondary}
              transform="translate(0, 3)"
            />
            <path
              d="M26,66 L74,66 L78,38 L62,48 L50,28 L38,48 L22,38 Z"
              fill="#FFFFFF"
              stroke={palette.rim}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="25" r="3.5" fill={palette.rim} />
            <circle cx="22" cy="35" r="3" fill={palette.rim} />
            <circle cx="78" cy="35" r="3" fill={palette.rim} />
          </g>
        )}

        {iconType === 'whatsapp_flash' && (
          <g>
            <polygon
              points="54,23 32,53 48,53 44,77 68,45 52,45"
              fill={palette.secondary}
              transform="translate(0, 3)"
            />
            <polygon
              points="54,23 32,53 48,53 44,77 68,45 52,45"
              fill="#FFFFFF"
              stroke={palette.rim}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </g>
        )}

        {iconType === 'ai_prism' && (
          <g>
            <polygon points="50,23 74,50 50,77 26,50" fill={palette.secondary} transform="translate(0,3)" />
            <polygon
              points="50,23 74,50 50,77 26,50"
              fill="#FFFFFF"
              stroke={palette.rim}
              strokeWidth="2"
            />
            <polygon points="50,23 74,50 50,55" fill={palette.rim} opacity="0.7" />
            <circle cx="50" cy="50" r="6" fill={palette.secondary} />
          </g>
        )}

        {iconType === 'rocket_100' && (
          <g>
            <path
              d="M50,22 C62,32 65,48 62,62 L50,74 L38,62 C35,48 38,32 50,22 Z"
              fill="#FFFFFF"
              stroke={palette.rim}
              strokeWidth="2"
            />
            <polygon points="38,54 26,64 38,64" fill={palette.rim} />
            <polygon points="62,54 74,64 62,64" fill={palette.rim} />
            <circle cx="50" cy="44" r="6.5" fill={palette.primary} />
          </g>
        )}

        {iconType === 'sorocaba_shield' && (
          <g>
            <path
              d="M50,23 L72,31 L72,50 C72,64 62,73 50,78 C38,73 28,64 28,50 L28,31 Z"
              fill="#FFFFFF"
              stroke={palette.rim}
              strokeWidth="2"
            />
            <path
              d="M42,51 L48,57 L60,43"
              fill="none"
              stroke={palette.secondary}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        {iconType === 'seo_globe' && (
          <g>
            <circle cx="50" cy="50" r="22" fill="#FFFFFF" stroke={palette.rim} strokeWidth="2" />
            <ellipse cx="50" cy="50" rx="11" ry="22" fill="none" stroke={palette.secondary} strokeWidth="2.5" />
            <line x1="28" y1="50" x2="72" y2="50" stroke={palette.secondary} strokeWidth="2.5" />
            <line x1="32" y1="39" x2="68" y2="39" stroke={palette.primary} strokeWidth="2" />
            <line x1="32" y1="61" x2="68" y2="61" stroke={palette.primary} strokeWidth="2" />
          </g>
        )}

        {iconType === 'diamond_elite' && (
          <g>
            <polygon
              points="36,30 64,30 76,44 50,76 24,44"
              fill="#FFFFFF"
              stroke={palette.rim}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <polyline
              points="24,44 76,44"
              fill="none"
              stroke={palette.primary}
              strokeWidth="2.5"
            />
            <polyline
              points="36,30 50,44 64,30"
              fill="none"
              stroke={palette.secondary}
              strokeWidth="2"
            />
            <polyline
              points="42,44 50,76 58,44"
              fill="none"
              stroke={palette.primary}
              strokeWidth="2"
            />
          </g>
        )}

        {iconType === 'local_connector' && (
          <g>
            {/* 3D Network Links */}
            <line x1="50" y1="30" x2="32" y2="62" stroke={palette.rim} strokeWidth="3.5" />
            <line x1="50" y1="30" x2="68" y2="62" stroke={palette.rim} strokeWidth="3.5" />
            <line x1="32" y1="62" x2="68" y2="62" stroke={palette.rim} strokeWidth="3.5" />
            <line x1="50" y1="30" x2="50" y2="52" stroke="#FFFFFF" strokeWidth="2.5" />
            <line x1="32" y1="62" x2="50" y2="52" stroke="#FFFFFF" strokeWidth="2.5" />
            <line x1="68" y1="62" x2="50" y2="52" stroke="#FFFFFF" strokeWidth="2.5" />
            {/* Outer Hub Nodes */}
            <circle cx="50" cy="29" r="7" fill="#FFFFFF" stroke={palette.secondary} strokeWidth="2.5" />
            <circle cx="31" cy="62" r="7" fill="#FFFFFF" stroke={palette.secondary} strokeWidth="2.5" />
            <circle cx="69" cy="62" r="7" fill="#FFFFFF" stroke={palette.secondary} strokeWidth="2.5" />
            {/* Central Core Sorocaba Hub */}
            <circle cx="50" cy="52" r="8.5" fill={palette.primary} stroke="#FFFFFF" strokeWidth="2.5" />
          </g>
        )}
      </svg>

      {/* Specular Shimmer Glint */}
      <div
        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white blur-[1px] pointer-events-none"
        style={{
          boxShadow: `0 0 12px 3px ${palette.rim}`,
          transform: 'translateZ(34px)'
        }}
      />
    </motion.div>
  );
}

interface BadgeShowcaseProps {
  businessName: string;
  onAwardXp?: (points: number, reason: string) => void;
}

export function BadgeShowcase({ businessName, onAwardXp }: BadgeShowcaseProps) {
  const [badges, setBadges] = useState<DigitalAchievementBadge[]>(() => loadStoredBadges());
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [hoveredBadgeId, setHoveredBadgeId] = useState<string | null>(null);
  const [cardTilt, setCardTilt] = useState<{ [id: string]: { rx: number; ry: number; gx: number; gy: number } }>({});
  const [spinCounters, setSpinCounters] = useState<{ [id: string]: number }>({});
  const [inspectedBadge, setInspectedBadge] = useState<DigitalAchievementBadge | null>(null);
  const [toastFeedback, setToastFeedback] = useState<string | null>(null);

  const MAX_PINNED = 4;

  // Save to localStorage and dispatch sync event so BusinessLandingPage updates immediately
  useEffect(() => {
    try {
      localStorage.setItem(BADGE_SHOWCASE_STORAGE_KEY, JSON.stringify(badges));
      window.dispatchEvent(new CustomEvent('guiaponto-badges-updated'));
    } catch (err) {
      console.warn('Erro ao salvar conquistas fixadas:', err);
    }
  }, [badges]);

  useEffect(() => {
    const handleExternalSync = () => {
      setBadges(loadStoredBadges());
    };
    window.addEventListener('guiaponto-badges-external-sync', handleExternalSync);
    return () => window.removeEventListener('guiaponto-badges-external-sync', handleExternalSync);
  }, []);

  const showToast = (msg: string) => {
    setToastFeedback(msg);
    setTimeout(() => setToastFeedback(null), 3800);
  };

  const pinnedBadges = badges.filter((b) => b.unlocked && b.pinned);
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const filteredBadges = badges.filter((b) => {
    if (selectedCategory === 'Todas') return true;
    if (selectedCategory === 'Fixadas na Vitrine') return b.pinned && b.unlocked;
    return b.category === selectedCategory;
  });

  const handleTogglePin = (badgeId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const target = badges.find((b) => b.id === badgeId);
    if (!target) return;

    if (!target.unlocked) {
      showToast('Desbloqueie esta conquista primeiro para fixá-la na sua Landing Page pública.');
      return;
    }

    if (!target.pinned && pinnedBadges.length >= MAX_PINNED) {
      showToast(`Limite de ${MAX_PINNED} conquistas fixadas atingido. Desafixe uma conquista para substituir.`);
      return;
    }

    const nextPinned = !target.pinned;
    setBadges((prev) =>
      prev.map((b) => (b.id === badgeId ? { ...b, pinned: nextPinned } : b))
    );

    // Trigger 360 3D spin on pin/unpin
    setSpinCounters((prev) => ({ ...prev, [badgeId]: (prev[badgeId] || 0) + 1 }));

    if (nextPinned) {
      showToast(`"${target.title}" fixada na sua Landing Page pública de Sorocaba!`);
      if (onAwardXp) onAwardXp(35, `Fixou conquista ${target.title} na vitrine pública`);
    } else {
      showToast(`"${target.title}" removida dos destaques públicos.`);
    }

    if (inspectedBadge && inspectedBadge.id === badgeId) {
      setInspectedBadge({ ...target, pinned: nextPinned });
    }
  };

  const handleUnlockSimulation = (badgeId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const target = badges.find((b) => b.id === badgeId);
    if (!target || target.unlocked) return;

    const todayStr = 'Hoje • Auditado';
    const shouldAutoPin = pinnedBadges.length < MAX_PINNED;

    setBadges((prev) =>
      prev.map((b) =>
        b.id === badgeId
          ? {
              ...b,
              unlocked: true,
              progress: 100,
              unlockedAt: todayStr,
              pinned: shouldAutoPin
            }
          : b
      )
    );

    setSpinCounters((prev) => ({ ...prev, [badgeId]: (prev[badgeId] || 0) + 1 }));
    if (onAwardXp) onAwardXp(target.xpValue, `Conquista 3D Desbloqueada: ${target.title}`);
    showToast(
      `Parabéns! Conquista "${target.title}" desbloqueada (+${target.xpValue} XP)${
        shouldAutoPin ? ' e fixada na página pública!' : '!'
      }`
    );

    triggerAchievementCelebration({
      type: 'badge',
      title: target.title,
      subtitle: target.subtitle,
      description: target.description,
      xpEarned: target.xpValue,
      rarity: target.rarity,
      trustBoostLabel: target.trustBoostLabel,
      badgeIconType: target.iconType,
      badgePalette: target.palette
    });

    if (inspectedBadge && inspectedBadge.id === badgeId) {
      setInspectedBadge({
        ...target,
        unlocked: true,
        progress: 100,
        unlockedAt: todayStr,
        pinned: shouldAutoPin
      });
    }
  };

  const handleCelebrateBadge = (badge: DigitalAchievementBadge, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSpinCounters((prev) => ({ ...prev, [badge.id]: (prev[badge.id] || 0) + 1 }));
    triggerAchievementCelebration({
      type: 'badge',
      title: badge.title,
      subtitle: badge.subtitle,
      description: badge.description,
      xpEarned: badge.xpValue,
      rarity: badge.rarity,
      trustBoostLabel: badge.trustBoostLabel,
      badgeIconType: badge.iconType,
      badgePalette: badge.palette
    });
  };

  const handlePointerMoveCard = (badgeId: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rx = ((y - centerY) / centerY) * -14;
    const ry = ((x - centerX) / centerX) * 14;
    const gx = Math.round((x / rect.width) * 100);
    const gy = Math.round((y / rect.height) * 100);

    setCardTilt((prev) => ({
      ...prev,
      [badgeId]: { rx, ry, gx, gy }
    }));
  };

  const handlePointerLeaveCard = (badgeId: string) => {
    setHoveredBadgeId(null);
    setCardTilt((prev) => ({
      ...prev,
      [badgeId]: { rx: 0, ry: 0, gx: 50, gy: 50 }
    }));
  };

  return (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
      {/* Subtle Ambient Lighting */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FE3A18]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Showcase Header */}
      <div className="p-6 sm:p-8 border-b border-slate-800/80 relative z-10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-400">
              <Sparkles className="w-4 h-4 text-[#FE3A18]" />
              <span>VITRINE DE CONQUISTAS 3D INTERATIVA</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400 font-mono">
                {unlockedCount}/{badges.length} DESBLOQUEADAS
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Badge Showcase & Destaques da Página Pública
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Explore suas insígnias digitais em 3D. Passe o mouse para inclinar os troféus e fixe até{' '}
              <strong className="text-white">{MAX_PINNED} conquistas favoritas</strong> para exibi-las automaticamente no topo da Landing Page pública de{' '}
              <span className="text-amber-400 font-bold">{businessName}</span>.
            </p>
          </div>

          {/* Summary KPI Counter Box */}
          <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shrink-0">
            <div className="pr-4 border-r border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Fixadas na Vitrine
              </span>
              <div className="text-2xl font-black text-amber-400 font-mono tabular-nums mt-0.5">
                {pinnedBadges.length} / {MAX_PINNED}
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold block">
                Sincronização Ativa
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Impacto em Conversão
              </span>
              <div className="text-2xl font-black text-white font-mono tabular-nums mt-0.5">
                +{pinnedBadges.length * 8 + 12}%
              </div>
              <span className="text-[11px] text-slate-400 block">
                Prova social verificada
              </span>
            </div>
          </div>
        </div>

        {/* Live Public Landing Page Pinned Bar Preview */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Pin className="w-4 h-4 text-[#FE3A18] rotate-45" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                Preview ao Vivo: Barra de Conquistas Fixadas na Landing Page Pública
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Visível para clientes no diretório de Sorocaba
            </span>
          </div>

          {pinnedBadges.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              Nenhuma conquista fixada no momento. Clique em <strong>"Fixar na Página Pública"</strong> em qualquer insígnia abaixo.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {pinnedBadges.map((badge) => (
                <motion.div
                  key={badge.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 transition-all group"
                >
                  <div
                    onClick={() =>
                      setSpinCounters((prev) => ({
                        ...prev,
                        [badge.id]: (prev[badge.id] || 0) + 1
                      }))
                    }
                    className="cursor-pointer shrink-0"
                    title="Clique para girar em 3D"
                  >
                    <Badge3DIcon
                      iconType={badge.iconType}
                      palette={badge.palette}
                      size="sm"
                      spinTrigger={spinCounters[badge.id] || 0}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-extrabold text-white truncate">
                        {badge.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold block truncate">
                      {badge.trustBoostLabel}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleTogglePin(badge.id, e)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                    title="Desafixar da página pública"
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Toast Feedback */}
        <AnimatePresence>
          {toastFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{toastFeedback}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastFeedback(null)}
                className="text-xs text-emerald-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {[
              'Todas',
              'Fixadas na Vitrine',
              'Regional Sorocaba',
              'Reputação',
              'Performance',
              'Inovação IA'
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#FE3A18] text-white shadow-lg shadow-[#FE3A18]/25'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Dica: Passe o cursor sobre os cards para interagir em 3D ou clique para inspecionar
          </span>
        </div>
      </div>

      {/* Interactive 3D Badges Grid */}
      <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {filteredBadges.map((badge) => {
          const tilt = cardTilt[badge.id] || { rx: 0, ry: 0, gx: 50, gy: 50 };
          const isHovered = hoveredBadgeId === badge.id;

          return (
            <div
              key={badge.id}
              style={{ perspective: '1100px' }}
              className="h-full"
            >
              <motion.div
                onMouseEnter={() => setHoveredBadgeId(badge.id)}
                onMouseMove={(e) => handlePointerMoveCard(badge.id, e)}
                onMouseLeave={() => handlePointerLeaveCard(badge.id)}
                onClick={() => setInspectedBadge(badge)}
                animate={{
                  rotateX: tilt.rx,
                  rotateY: tilt.ry,
                  scale: isHovered ? 1.025 : 1
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                style={{ transformStyle: 'preserve-3d' }}
                className={`relative h-full rounded-2xl p-5 border flex flex-col justify-between cursor-pointer select-none transition-colors overflow-hidden bg-gradient-to-b ${
                  badge.unlocked
                    ? badge.pinned
                      ? `${badge.palette.bgGradient} border-amber-400/70 shadow-xl`
                      : `${badge.palette.bgGradient} border-slate-800 hover:border-slate-700`
                    : 'from-slate-900 to-slate-950 border-slate-800/80 opacity-75'
                }`}
              >
                {/* Dynamic Specular Glare Overlay following cursor */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    opacity: isHovered ? 0.22 : 0,
                    background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, #ffffff, transparent 60%)`
                  }}
                />

                {/* Top Bar: Rarity & Pin Indicator */}
                <div
                  className="flex items-center justify-between gap-2 relative z-10"
                  style={{ transform: 'translateZ(18px)' }}
                >
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider ${badge.palette.badgeText}`}
                  >
                    {badge.rarity} · +{badge.xpValue} XP
                  </span>

                  {badge.unlocked ? (
                    <button
                      type="button"
                      onClick={(e) => handleTogglePin(badge.id, e)}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        badge.pinned
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                          : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                      title={
                        badge.pinned
                          ? 'Fixada na Landing Page pública (Clique para desafixar)'
                          : 'Fixar na Landing Page pública'
                      }
                    >
                      <Pin className={`w-3.5 h-3.5 ${badge.pinned ? 'rotate-45' : ''}`} />
                      <span className="text-[10px]">{badge.pinned ? 'Fixada' : 'Fixar'}</span>
                    </button>
                  ) : (
                    <span className="p-1.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                {/* Centerpiece: Floating 3D Animated Emblem */}
                <div
                  className="my-6 flex flex-col items-center justify-center relative z-10"
                  style={{ transform: 'translateZ(38px)' }}
                >
                  <div className={badge.unlocked ? '' : 'grayscale contrast-75'}>
                    <Badge3DIcon
                      iconType={badge.iconType}
                      palette={badge.palette}
                      size="md"
                      isHovered={isHovered}
                      spinTrigger={spinCounters[badge.id] || 0}
                    />
                  </div>

                  {/* Rotate 360 Trigger Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSpinCounters((prev) => ({
                        ...prev,
                        [badge.id]: (prev[badge.id] || 0) + 1
                      }));
                    }}
                    className="mt-3 text-[10px] font-semibold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Girar 3D</span>
                  </button>
                </div>

                {/* Badge Text & Conversion Boost Info */}
                <div
                  className="space-y-2 text-center relative z-10"
                  style={{ transform: 'translateZ(22px)' }}
                >
                  <div>
                    <h4 className="font-black text-sm text-white leading-snug">
                      {badge.title}
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-300">
                      {badge.subtitle}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    {badge.description}
                  </p>

                  {/* Progress or Conversion Boost Footer */}
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-medium">Impacto Público:</span>
                      <span className="font-bold text-emerald-400">{badge.trustBoostLabel}</span>
                    </div>

                    {badge.unlocked ? (
                      <button
                        type="button"
                        onClick={(e) => handleTogglePin(badge.id, e)}
                        className={`w-full py-2 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          badge.pinned
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                        }`}
                      >
                        <Pin className="w-3.5 h-3.5" />
                        <span>
                          {badge.pinned ? 'Exibindo na Landing Page' : 'Fixar na Página Pública'}
                        </span>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${badge.progress}%` }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleUnlockSimulation(badge.id, e)}
                          className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Concluir Meta ({badge.progress}%)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* 3D Badge Inspection Modal */}
      <AnimatePresence>
        {inspectedBadge && (
          <div
            onClick={() => setInspectedBadge(null)}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, rotateX: 15 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${inspectedBadge.palette.badgeText}`}
                  >
                    INSÍGNIA 3D CERTIFICADA · {inspectedBadge.rarity}
                  </span>
                  <h4 className="text-xl font-black text-white mt-0.5">
                    {inspectedBadge.title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectedBadge(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 flex flex-col items-center justify-center">
                <Badge3DIcon
                  iconType={inspectedBadge.iconType}
                  palette={inspectedBadge.palette}
                  size="lg"
                  isHovered={true}
                  spinTrigger={spinCounters[inspectedBadge.id] || 0}
                />
                <button
                  type="button"
                  onClick={() =>
                    setSpinCounters((prev) => ({
                      ...prev,
                      [inspectedBadge.id]: (prev[inspectedBadge.id] || 0) + 1
                    }))
                  }
                  className="mt-4 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Rotacionar Troféu 360°</span>
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <p className="leading-relaxed text-slate-200">{inspectedBadge.description}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Critério de Validação:</span>
                  <span className="font-semibold text-white">{inspectedBadge.requirementText}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Efeito na Landing Page:</span>
                  <span className="font-bold text-emerald-400">{inspectedBadge.trustBoostLabel}</span>
                </div>
                {inspectedBadge.unlockedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Conquistado em:</span>
                    <span className="font-mono text-amber-300">{inspectedBadge.unlockedAt}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {inspectedBadge.unlocked ? (
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
                    <button
                      type="button"
                      onClick={() => handleTogglePin(inspectedBadge.id)}
                      className={`flex-1 w-full py-3.5 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        inspectedBadge.pinned
                          ? 'bg-slate-800 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-[#FE3A18] hover:bg-[#e33315] text-white shadow-lg shadow-[#FE3A18]/25'
                      }`}
                    >
                      <Pin className="w-4 h-4" />
                      <span>
                        {inspectedBadge.pinned
                          ? 'Desafixar da Vitrine'
                          : 'Fixar na Landing Page'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        setInspectedBadge(null);
                        handleCelebrateBadge(inspectedBadge, e);
                      }}
                      className="py-3.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 w-full sm:w-auto"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Celebrar 🎉</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleUnlockSimulation(inspectedBadge.id)}
                    className="flex-1 py-3.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Desbloquear Agora (+{inspectedBadge.xpValue} XP)</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
