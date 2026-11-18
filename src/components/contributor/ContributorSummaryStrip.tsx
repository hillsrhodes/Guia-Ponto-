/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Award, Compass, ShieldCheck, Star, Trophy, Utensils, ArrowRight } from 'lucide-react';
import { useContributorProfile } from '../../hooks/useContributorProfile';
import { ContributorBadgeDefinition } from '../../services/contributorRewardsService';

export function renderContributorBadgeIcon(
  iconKey: ContributorBadgeDefinition['iconKey'],
  className = 'w-5 h-5'
) {
  switch (iconKey) {
    case 'first_star':
      return <Star className={className} />;
    case 'quill':
      return <Award className={className} />;
    case 'compass':
      return <Compass className={className} />;
    case 'utensils':
      return <Utensils className={className} />;
    case 'shield':
      return <ShieldCheck className={className} />;
    case 'trophy':
    default:
      return <Trophy className={className} />;
  }
}

interface ContributorSummaryStripProps {
  onOpenProfileModal: () => void;
  onExploreBusinesses?: () => void;
  variant?: 'light' | 'dark';
}

export function ContributorSummaryStrip({
  onOpenProfileModal,
  onExploreBusinesses,
  variant = 'light'
}: ContributorSummaryStripProps) {
  const profile = useContributorProfile();
  const isDark = variant === 'dark';

  const initials = profile.state.userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 text-left transition-colors ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-white'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: User Identity & Contribuidor GuiaPonto Counter */}
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-slate-900 text-white border border-slate-700 flex items-center justify-center font-black text-sm shrink-0">
            {initials || 'CG'}
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
              <span className="font-extrabold truncate">{profile.state.userName}</span>
              <span aria-hidden="true" className={isDark ? 'text-slate-600' : 'text-slate-300'}>
                ·
              </span>
              <span className="font-bold text-[#FE3A18]">
                Nível {profile.levelInfo.current.level} · {profile.levelInfo.current.title}
              </span>
            </div>

            {/* Contador Contribuidor GuiaPonto */}
            <div
              className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono tabular-nums ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              <span className="font-bold">
                Contribuidor GuiaPonto:{' '}
                <strong className={isDark ? 'text-white' : 'text-slate-900'}>
                  {profile.reviewCount} {profile.reviewCount === 1 ? 'avaliação' : 'avaliações'}
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {profile.unlockedBadgesCount}/{profile.badges.length} badges
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-600 font-bold">
                {profile.totalXp.toLocaleString('pt-BR')} XP
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Level Progress */}
        <div className="lg:w-56 space-y-1.5 shrink-0">
          <div
            className={`flex items-center justify-between text-[11px] font-mono tabular-nums ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            <span>
              {profile.levelInfo.next
                ? `Próximo: ${profile.levelInfo.next.title}`
                : 'Nível máximo atingido'}
            </span>
            <span>{profile.levelInfo.progressPercent}%</span>
          </div>
          <div
            className={`h-2 w-full rounded-full overflow-hidden ${
              isDark ? 'bg-slate-800' : 'bg-slate-100'
            }`}
          >
            <div
              className="h-full bg-[#FE3A18] transition-all duration-300"
              style={{ width: `${profile.levelInfo.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenProfileModal}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#FE3A18]" />
            <span>Meu Perfil & Badges</span>
          </button>

          {onExploreBusinesses && (
            <button
              type="button"
              onClick={onExploreBusinesses}
              className="px-4 py-2 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <span>Avaliar Negócio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
