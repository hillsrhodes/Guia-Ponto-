/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ContributorReviewItem {
  id: string;
  businessId: string;
  businessName: string;
  category: string;
  neighborhood: string;
  rating: number;
  comment: string;
  highlights: string[];
  helpfulCount: number;
  xpEarned: number;
  createdAt: string;
}

export interface ContributorBadgeDefinition {
  id: string;
  title: string;
  description: string;
  requirementLabel: string;
  category: 'Marco' | 'Qualidade' | 'Descoberta' | 'Comunidade';
  iconKey: 'first_star' | 'quill' | 'compass' | 'utensils' | 'shield' | 'trophy';
  xpBonus: number;
  check: (state: ContributorState) => { unlocked: boolean; current: number; target: number };
}

export interface ContributorLevelDefinition {
  level: number;
  title: string;
  minXp: number;
  perk: string;
}

export interface ContributorState {
  userName: string;
  city: string;
  memberSince: string;
  reviews: ContributorReviewItem[];
  unlockedBadgeDates: Record<string, string>;
}

export interface EvaluatedContributorBadge extends ContributorBadgeDefinition {
  unlocked: boolean;
  unlockedAt?: string;
  currentProgress: number;
  targetProgress: number;
  progressPercent: number;
}

export interface ContributorProfileSnapshot {
  state: ContributorState;
  reviewCount: number;
  uniqueBusinessesCount: number;
  uniqueNeighborhoodsCount: number;
  totalHelpfulVotes: number;
  totalXp: number;
  levelInfo: {
    current: ContributorLevelDefinition;
    next: ContributorLevelDefinition | null;
    progressPercent: number;
    xpRemaining: number;
  };
  badges: EvaluatedContributorBadge[];
  unlockedBadgesCount: number;
}

export const CONTRIBUTOR_STORAGE_KEY = 'guiaponto_contributor_profile_v1';
export const CONTRIBUTOR_UPDATED_EVENT = 'guiaponto-contributor-updated';

export const CONTRIBUTOR_LEVELS: ContributorLevelDefinition[] = [
  {
    level: 1,
    title: 'Explorador Local',
    minXp: 0,
    perk: 'Selo inicial de avaliador verificado na comunidade Sorocaba'
  },
  {
    level: 2,
    title: 'Guia de Bairro',
    minXp: 150,
    perk: 'Destaque de credibilidade nas avaliações do seu bairro'
  },
  {
    level: 3,
    title: 'Especialista Sorocaba',
    minXp: 350,
    perk: 'Avaliações com peso prioritário no ranking de estabelecimentos'
  },
  {
    level: 4,
    title: 'Embaixador Regional',
    minXp: 650,
    perk: 'Acesso antecipado a cupons exclusivos de parceiros locais'
  },
  {
    level: 5,
    title: 'Lenda GuiaPonto',
    minXp: 1000,
    perk: 'Status máximo de confiança e curadoria oficial na região'
  }
];

export const CONTRIBUTOR_BADGE_DEFINITIONS: ContributorBadgeDefinition[] = [
  {
    id: 'badge-primeira-opiniao',
    title: 'Primeira Opinião',
    description: 'Publicou sua primeira avaliação verificada para ajudar moradores da região.',
    requirementLabel: '1 avaliação publicada',
    category: 'Marco',
    iconKey: 'first_star',
    xpBonus: 30,
    check: (state) => ({
      unlocked: state.reviews.length >= 1,
      current: Math.min(state.reviews.length, 1),
      target: 1
    })
  },
  {
    id: 'badge-avaliador-detalhista',
    title: 'Avaliador Detalhista',
    description: 'Escreveu avaliações completas com detalhes úteis sobre atendimento e experiência.',
    requirementLabel: '2 avaliações com 60+ caracteres',
    category: 'Qualidade',
    iconKey: 'quill',
    xpBonus: 45,
    check: (state) => {
      const detailedCount = state.reviews.filter((r) => r.comment.trim().length >= 60).length;
      return {
        unlocked: detailedCount >= 2,
        current: Math.min(detailedCount, 2),
        target: 2
      };
    }
  },
  {
    id: 'badge-explorador-bairros',
    title: 'Explorador de Bairros',
    description: 'Avaliou estabelecimentos em múltiplos bairros de Sorocaba e Votorantim.',
    requirementLabel: '3 bairros diferentes avaliados',
    category: 'Descoberta',
    iconKey: 'compass',
    xpBonus: 60,
    check: (state) => {
      const neighborhoods = new Set(
        state.reviews.map((r) => r.neighborhood.trim().toLowerCase()).filter(Boolean)
      );
      return {
        unlocked: neighborhoods.size >= 3,
        current: Math.min(neighborhoods.size, 3),
        target: 3
      };
    }
  },
  {
    id: 'badge-curador-gastronomico',
    title: 'Curador de Serviços Locais',
    description: 'Compartilhou experiência real em múltiplas categorias do guia comercial.',
    requirementLabel: '2 categorias distintas avaliadas',
    category: 'Descoberta',
    iconKey: 'utensils',
    xpBonus: 50,
    check: (state) => {
      const categories = new Set(
        state.reviews.map((r) => r.category.trim().toLowerCase()).filter(Boolean)
      );
      return {
        unlocked: categories.size >= 2,
        current: Math.min(categories.size, 2),
        target: 2
      };
    }
  },
  {
    id: 'badge-voz-confianca',
    title: 'Voz de Confiança',
    description: 'Suas avaliações acumularam reconhecimento e votos úteis da comunidade.',
    requirementLabel: '10 votos úteis recebidos',
    category: 'Comunidade',
    iconKey: 'shield',
    xpBonus: 70,
    check: (state) => {
      const helpful = state.reviews.reduce((acc, r) => acc + r.helpfulCount, 0);
      return {
        unlocked: helpful >= 10,
        current: Math.min(helpful, 10),
        target: 10
      };
    }
  },
  {
    id: 'badge-embaixador-5',
    title: 'Contribuidor Ouro',
    description: 'Alcançou 5 ou mais avaliações publicadas, fortalecendo o comércio local.',
    requirementLabel: '5 avaliações publicadas',
    category: 'Marco',
    iconKey: 'trophy',
    xpBonus: 100,
    check: (state) => ({
      unlocked: state.reviews.length >= 5,
      current: Math.min(state.reviews.length, 5),
      target: 5
    })
  }
];

const DEFAULT_CONTRIBUTOR_STATE: ContributorState = {
  userName: 'Camila Oliveira',
  city: 'Campolim, Sorocaba - SP',
  memberSince: 'Jan 2026',
  reviews: [
    {
      id: 'rev-seed-1',
      businessId: 'b1',
      businessName: 'Restaurante Sabor & Fogo',
      category: 'Restaurantes & Gastronomia',
      neighborhood: 'Campolim',
      rating: 5,
      comment:
        'Almoço executivo muito bem servido, carnes no ponto exato e atendimento rápido pelo WhatsApp para reserva de mesa.',
      highlights: ['Atendimento rápido', 'Ambiente agradável'],
      helpfulCount: 6,
      xpEarned: 90,
      createdAt: '14 Out 2026'
    },
    {
      id: 'rev-seed-2',
      businessId: 'b2',
      businessName: 'Clínica Odonto Sorocaba Prime',
      category: 'Saúde & Estética',
      neighborhood: 'Jardim Faculdade',
      rating: 5,
      comment:
        'Pontualidade impecável na consulta e orçamento transparente desde o primeiro contato. Estrutura moderna e higienizada.',
      highlights: ['Pontualidade', 'Ótimo custo-benefício'],
      helpfulCount: 5,
      xpEarned: 90,
      createdAt: '02 Nov 2026'
    }
  ],
  unlockedBadgeDates: {
    'badge-primeira-opiniao': '14 Out 2026',
    'badge-avaliador-detalhista': '02 Nov 2026',
    'badge-curador-gastronomico': '02 Nov 2026',
    'badge-voz-confianca': '08 Nov 2026'
  }
};

function formatShortDatePtBr(date = new Date()): string {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()] || 'Nov';
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function loadContributorState(): ContributorState {
  if (typeof window === 'undefined') return DEFAULT_CONTRIBUTOR_STATE;
  try {
    const raw = window.localStorage.getItem(CONTRIBUTOR_STORAGE_KEY);
    if (!raw) return DEFAULT_CONTRIBUTOR_STATE;
    const parsed = JSON.parse(raw) as Partial<ContributorState>;
    if (!parsed || !Array.isArray(parsed.reviews)) {
      return DEFAULT_CONTRIBUTOR_STATE;
    }
    return {
      userName: parsed.userName || DEFAULT_CONTRIBUTOR_STATE.userName,
      city: parsed.city || DEFAULT_CONTRIBUTOR_STATE.city,
      memberSince: parsed.memberSince || DEFAULT_CONTRIBUTOR_STATE.memberSince,
      reviews: parsed.reviews,
      unlockedBadgeDates: parsed.unlockedBadgeDates || {}
    };
  } catch {
    return DEFAULT_CONTRIBUTOR_STATE;
  }
}

export function saveContributorState(state: ContributorState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONTRIBUTOR_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(CONTRIBUTOR_UPDATED_EVENT));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function buildContributorSnapshot(state: ContributorState): ContributorProfileSnapshot {
  const badges: EvaluatedContributorBadge[] = CONTRIBUTOR_BADGE_DEFINITIONS.map((def) => {
    const { unlocked, current, target } = def.check(state);
    const progressPercent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
    return {
      ...def,
      unlocked,
      unlockedAt: unlocked ? state.unlockedBadgeDates[def.id] || formatShortDatePtBr() : undefined,
      currentProgress: current,
      targetProgress: target,
      progressPercent
    };
  });

  const reviewsXp = state.reviews.reduce((acc, r) => acc + r.xpEarned + r.helpfulCount * 5, 0);
  const badgesXp = badges
    .filter((b) => b.unlocked)
    .reduce((acc, b) => acc + b.xpBonus, 0);
  const totalXp = reviewsXp + badgesXp;

  let current = CONTRIBUTOR_LEVELS[0];
  let next: ContributorLevelDefinition | null = CONTRIBUTOR_LEVELS[1] || null;

  for (let i = 0; i < CONTRIBUTOR_LEVELS.length; i++) {
    if (totalXp >= CONTRIBUTOR_LEVELS[i].minXp) {
      current = CONTRIBUTOR_LEVELS[i];
      next = CONTRIBUTOR_LEVELS[i + 1] || null;
    }
  }

  let progressPercent = 100;
  let xpRemaining = 0;
  if (next) {
    const span = next.minXp - current.minXp;
    const earnedInSpan = totalXp - current.minXp;
    progressPercent = span > 0 ? Math.min(100, Math.max(0, Math.round((earnedInSpan / span) * 100))) : 100;
    xpRemaining = Math.max(0, next.minXp - totalXp);
  }

  const uniqueBusinessesCount = new Set(state.reviews.map((r) => r.businessId)).size;
  const uniqueNeighborhoodsCount = new Set(
    state.reviews.map((r) => r.neighborhood.trim().toLowerCase()).filter(Boolean)
  ).size;
  const totalHelpfulVotes = state.reviews.reduce((acc, r) => acc + r.helpfulCount, 0);

  return {
    state,
    reviewCount: state.reviews.length,
    uniqueBusinessesCount,
    uniqueNeighborhoodsCount,
    totalHelpfulVotes,
    totalXp,
    levelInfo: {
      current,
      next,
      progressPercent,
      xpRemaining
    },
    badges,
    unlockedBadgesCount: badges.filter((b) => b.unlocked).length
  };
}

export function getContributorSnapshot(): ContributorProfileSnapshot {
  return buildContributorSnapshot(loadContributorState());
}

export function updateContributorIdentity(userName: string, city: string): ContributorProfileSnapshot {
  const current = loadContributorState();
  const updated: ContributorState = {
    ...current,
    userName: userName.trim() || current.userName,
    city: city.trim() || current.city
  };
  saveContributorState(updated);
  return buildContributorSnapshot(updated);
}

export interface SubmitReviewPayload {
  businessId: string;
  businessName: string;
  category: string;
  neighborhood: string;
  rating: number;
  comment: string;
  highlights: string[];
  reviewerName?: string;
}

export interface SubmitReviewResult {
  snapshot: ContributorProfileSnapshot;
  createdReview: ContributorReviewItem;
  pointsEarned: number;
  newlyUnlockedBadges: EvaluatedContributorBadge[];
  leveledUpTo: ContributorLevelDefinition | null;
}

export function submitContributorBusinessReview(payload: SubmitReviewPayload): SubmitReviewResult {
  const prevState = loadContributorState();
  const prevSnapshot = buildContributorSnapshot(prevState);

  const trimmedComment = payload.comment.trim();
  const baseXp = 50;
  const detailBonus = trimmedComment.length >= 60 ? 25 : 0;
  const highlightBonus = payload.highlights.length > 0 ? 15 : 0;
  const pointsEarned = baseXp + detailBonus + highlightBonus;

  const createdReview: ContributorReviewItem = {
    id: `rev-${Date.now()}`,
    businessId: payload.businessId,
    businessName: payload.businessName,
    category: payload.category,
    neighborhood: payload.neighborhood,
    rating: payload.rating,
    comment: trimmedComment,
    highlights: payload.highlights,
    helpfulCount: 0,
    xpEarned: pointsEarned,
    createdAt: formatShortDatePtBr()
  };

  const nextState: ContributorState = {
    ...prevState,
    userName: payload.reviewerName?.trim() || prevState.userName,
    reviews: [createdReview, ...prevState.reviews],
    unlockedBadgeDates: { ...prevState.unlockedBadgeDates }
  };

  // Evaluate newly unlocked badges and record their unlock dates
  const todayLabel = formatShortDatePtBr();
  const newlyUnlockedIds: string[] = [];

  for (const def of CONTRIBUTOR_BADGE_DEFINITIONS) {
    const wasUnlocked = prevSnapshot.badges.find((b) => b.id === def.id)?.unlocked ?? false;
    const isNowUnlocked = def.check(nextState).unlocked;
    if (isNowUnlocked && !nextState.unlockedBadgeDates[def.id]) {
      nextState.unlockedBadgeDates[def.id] = todayLabel;
    }
    if (!wasUnlocked && isNowUnlocked) {
      newlyUnlockedIds.push(def.id);
    }
  }

  saveContributorState(nextState);
  const nextSnapshot = buildContributorSnapshot(nextState);

  const newlyUnlockedBadges = nextSnapshot.badges.filter((b) =>
    newlyUnlockedIds.includes(b.id)
  );
  const leveledUpTo =
    nextSnapshot.levelInfo.current.level > prevSnapshot.levelInfo.current.level
      ? nextSnapshot.levelInfo.current
      : null;

  return {
    snapshot: nextSnapshot,
    createdReview,
    pointsEarned,
    newlyUnlockedBadges,
    leveledUpTo
  };
}
