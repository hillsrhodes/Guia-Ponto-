/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Award,
  Check,
  Edit3,
  Lock,
  Star,
  ThumbsUp,
  Trophy,
  X
} from 'lucide-react';
import { useContributorProfile } from '../../hooks/useContributorProfile';
import {
  CONTRIBUTOR_LEVELS,
  updateContributorIdentity
} from '../../services/contributorRewardsService';
import { renderContributorBadgeIcon } from './ContributorSummaryStrip';

interface ContributorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreDirectoryToReview?: () => void;
}

export function ContributorProfileModal({
  isOpen,
  onClose,
  onExploreDirectoryToReview
}: ContributorProfileModalProps) {
  const profile = useContributorProfile();
  const [activeSection, setActiveSection] = useState<'overview' | 'badges' | 'reviews'>('overview');
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [draftName, setDraftName] = useState(profile.state.userName);
  const [draftCity, setDraftCity] = useState(profile.state.city);

  if (!isOpen) return null;

  const initials = profile.state.userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');

  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    updateContributorIdentity(draftName, draftCity);
    setIsEditingIdentity(false);
  };

  const startEditingIdentity = () => {
    setDraftName(profile.state.userName);
    setDraftCity(profile.state.city);
    setIsEditingIdentity(true);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contributor-profile-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ duration: 0.18 }}
          className="bg-white rounded-3xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Profile Header */}
          <div className="bg-slate-950 text-white p-6 sm:p-8 border-b border-slate-800 shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FE3A18] text-white flex items-center justify-center font-black text-xl shrink-0">
                  {initials || 'CG'}
                </div>

                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="font-bold text-[#FE3A18]">
                      Contribuidor GuiaPonto
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Membro desde {profile.state.memberSince}</span>
                    <span aria-hidden="true">·</span>
                    <span>{profile.state.city}</span>
                  </div>

                  {isEditingIdentity ? (
                    <form onSubmit={handleSaveIdentity} className="flex flex-wrap items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        placeholder="Seu nome"
                        required
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#FE3A18]"
                      />
                      <input
                        type="text"
                        value={draftCity}
                        onChange={(e) => setDraftCity(e.target.value)}
                        placeholder="Bairro, Cidade"
                        required
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#FE3A18]"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Salvar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingIdentity(false)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </form>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3">
                      <h2
                        id="contributor-profile-title"
                        className="text-xl sm:text-2xl font-black tracking-tight text-white truncate"
                      >
                        {profile.state.userName}
                      </h2>
                      <button
                        type="button"
                        onClick={startEditingIdentity}
                        className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar perfil</span>
                      </button>
                    </div>
                  )}

                  <div className="text-xs text-slate-300">
                    Nível Atual:{' '}
                    <strong className="text-amber-400">
                      Nível {profile.levelInfo.current.level} · {profile.levelInfo.current.title}
                    </strong>{' '}
                    — {profile.levelInfo.current.perk}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar perfil do contribuidor"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contador Oficial Contribuidor GuiaPonto */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">
                  Contador Contribuidor GuiaPonto
                </div>
                <div className="text-2xl font-black font-mono tabular-nums text-white mt-1">
                  {profile.reviewCount}{' '}
                  <span className="text-xs font-semibold text-slate-400">
                    {profile.reviewCount === 1 ? 'avaliação' : 'avaliações'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">
                  Pontuação Acumulada
                </div>
                <div className="text-2xl font-black font-mono tabular-nums text-emerald-400 mt-1">
                  {profile.totalXp.toLocaleString('pt-BR')}{' '}
                  <span className="text-xs font-semibold">XP</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">
                  Badges Desbloqueadas
                </div>
                <div className="text-2xl font-black font-mono tabular-nums text-amber-400 mt-1">
                  {profile.unlockedBadgesCount}/{profile.badges.length}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">
                  Votos Úteis Recebidos
                </div>
                <div className="text-2xl font-black font-mono tabular-nums text-white mt-1">
                  {profile.totalHelpfulVotes}
                </div>
              </div>
            </div>

            {/* Next Level Progress Bar */}
            <div className="mt-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-300">
                <span>
                  {profile.levelInfo.next
                    ? `Progresso para Nível ${profile.levelInfo.next.level} (${profile.levelInfo.next.title})`
                    : 'Você atingiu o nível máximo da comunidade GuiaPonto'}
                </span>
                <span>
                  {profile.levelInfo.next
                    ? `Faltam ${profile.levelInfo.xpRemaining} XP (${profile.levelInfo.progressPercent}%)`
                    : '100%'}
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  className="h-full bg-[#FE3A18] transition-all duration-300"
                  style={{ width: `${profile.levelInfo.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div
              role="tablist"
              aria-label="Seções do perfil do contribuidor"
              className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-200/70"
            >
              {[
                { id: 'overview' as const, label: 'Níveis & Progressão' },
                { id: 'badges' as const, label: `Badges (${profile.unlockedBadgesCount}/${profile.badges.length})` },
                { id: 'reviews' as const, label: `Avaliações (${profile.reviewCount})` }
              ].map((tab) => {
                const active = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveSection(tab.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {onExploreDirectoryToReview && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onExploreDirectoryToReview();
                }}
                className="px-4 py-2 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <span>Avaliar um Negócio Agora (+50 XP)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Trilha de Níveis · Contribuidor GuiaPonto
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Avalie negócios reais, inclua detalhes úteis e acumule XP para desbloquear novos níveis e reconhecimento na região.
                    </p>
                  </div>
                  <div className="text-xs font-mono tabular-nums text-slate-500">
                    +50 XP por avaliação · +25 XP por comentário detalhado · +15 XP por destaques
                  </div>
                </div>

                <div className="space-y-3">
                  {CONTRIBUTOR_LEVELS.map((lvl) => {
                    const isUnlocked = profile.totalXp >= lvl.minXp;
                    const isCurrent = profile.levelInfo.current.level === lvl.level;

                    return (
                      <div
                        key={lvl.level}
                        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isCurrent
                            ? 'bg-orange-50/60 border-[#FE3A18]'
                            : isUnlocked
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : 'bg-slate-50 border-slate-200 opacity-75'
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-black font-mono text-sm shrink-0 ${
                              isCurrent
                                ? 'bg-[#FE3A18] text-white'
                                : isUnlocked
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {lvl.level}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2 text-sm font-black text-slate-900">
                              <span>{lvl.title}</span>
                              {isCurrent && (
                                <span className="text-xs font-bold text-[#FE3A18]">
                                  · Nível atual
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">{lvl.perk}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono tabular-nums font-bold shrink-0">
                          <span className={isUnlocked ? 'text-emerald-700' : 'text-slate-500'}>
                            {lvl.minXp.toLocaleString('pt-BR')} XP
                          </span>
                          {isUnlocked ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeSection === 'badges' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Badges de Reconhecimento ({profile.unlockedBadgesCount} de {profile.badges.length} conquistadas)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Cada badge desbloqueada concede bônus de XP no seu perfil de Contribuidor GuiaPonto.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-5 rounded-2xl border space-y-3 transition-colors ${
                        badge.unlocked
                          ? 'bg-white border-slate-200'
                          : 'bg-slate-50 border-slate-200 opacity-80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                              badge.unlocked
                                ? 'bg-slate-950 text-amber-400'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {renderContributorBadgeIcon(badge.iconKey, 'w-5 h-5')}
                          </div>
                          <div>
                            <div className="text-[11px] font-semibold text-slate-500">
                              {badge.category} · +{badge.xpBonus} XP
                            </div>
                            <h4 className="text-sm font-black text-slate-900">
                              {badge.title}
                            </h4>
                          </div>
                        </div>

                        {badge.unlocked ? (
                          <span className="text-xs font-bold text-emerald-700 shrink-0 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Desbloqueada</span>
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-slate-500 shrink-0 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Bloqueada</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {badge.description}
                      </p>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-500">
                          <span>{badge.requirementLabel}</span>
                          <span>
                            {badge.unlocked && badge.unlockedAt
                              ? `Conquistada em ${badge.unlockedAt}`
                              : `${badge.currentProgress}/${badge.targetProgress}`}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              badge.unlocked ? 'bg-emerald-600' : 'bg-slate-400'
                            }`}
                            style={{ width: `${badge.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'reviews' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Histórico de Avaliações ({profile.reviewCount})
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Todas as avaliações publicadas contabilizam no seu Contador Contribuidor GuiaPonto.
                    </p>
                  </div>
                </div>

                {profile.state.reviews.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50 text-center space-y-2">
                    <Trophy className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-sm font-bold text-slate-900">
                      Você ainda não publicou avaliações
                    </p>
                    <p className="text-xs text-slate-500">
                      Abra a vitrine de qualquer negócio e compartilhe sua experiência para ganhar sua primeira badge.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {profile.state.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-black text-slate-900">
                              {rev.businessName}
                            </h4>
                            <div className="text-xs text-slate-500">
                              {rev.category} · {rev.neighborhood} · {rev.createdAt}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 font-mono tabular-nums text-xs">
                            <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {rev.rating.toFixed(1)}
                            </span>
                            <span className="font-bold text-emerald-700">
                              +{rev.xpEarned} XP
                            </span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          &ldquo;{rev.comment}&rdquo;
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
                          <span>
                            {rev.highlights.length > 0
                              ? rev.highlights.join(' · ')
                              : 'Avaliação verificada'}
                          </span>
                          <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{rev.helpfulCount} votos úteis</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
