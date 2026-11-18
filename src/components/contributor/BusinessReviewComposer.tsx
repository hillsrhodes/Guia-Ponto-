/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, CheckCircle2, Send, Star, Trophy } from 'lucide-react';
import { useContributorProfile } from '../../hooks/useContributorProfile';
import {
  submitContributorBusinessReview,
  SubmitReviewResult
} from '../../services/contributorRewardsService';
import { renderContributorBadgeIcon } from './ContributorSummaryStrip';

interface BusinessReviewComposerProps {
  businessId: string;
  businessName: string;
  businessCategory: string;
  businessNeighborhood: string;
  onOpenContributorProfile?: () => void;
}

const REVIEW_HIGHLIGHT_OPTIONS = [
  'Atendimento rápido',
  'Ótimo custo-benefício',
  'Ambiente agradável',
  'Pontualidade',
  'Recomendo na região'
];

export function BusinessReviewComposer({
  businessId,
  businessName,
  businessCategory,
  businessNeighborhood,
  onOpenContributorProfile
}: BusinessReviewComposerProps) {
  const profile = useContributorProfile();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState<string>(profile.state.userName);
  const [comment, setComment] = useState<string>('');
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastRewardResult, setLastRewardResult] = useState<SubmitReviewResult | null>(null);

  const toggleHighlight = (tag: string) => {
    setSelectedHighlights((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (comment.trim().length < 15) {
      setErrorMsg('Escreva pelo menos 15 caracteres contando como foi sua experiência.');
      return;
    }

    const result = submitContributorBusinessReview({
      businessId,
      businessName,
      category: businessCategory,
      neighborhood: businessNeighborhood,
      rating,
      comment,
      highlights: selectedHighlights,
      reviewerName
    });

    setLastRewardResult(result);
    setComment('');
    setSelectedHighlights([]);
  };

  const activeStars = hoverRating || rating;
  const trimmedLen = comment.trim().length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 space-y-6">
      {/* Header + Live Contribuidor Counter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-[#FE3A18]">
            Programa de Engajamento · Contribuidor GuiaPonto
          </div>
          <h3 className="text-xl font-black text-slate-900">
            Avalie {businessName} e Evolua Seu Nível
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Compartilhe sua experiência real para ajudar outros moradores, somar no seu contador e desbloquear badges no perfil.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono tabular-nums">
            <span className="text-slate-500">Contribuidor GuiaPonto: </span>
            <strong className="text-slate-900">
              {profile.reviewCount} {profile.reviewCount === 1 ? 'avaliação' : 'avaliações'}
            </strong>
            <span className="text-slate-300 mx-1.5">·</span>
            <strong className="text-[#FE3A18]">
              Nível {profile.levelInfo.current.level}
            </strong>
          </div>

          {onOpenContributorProfile && (
            <button
              type="button"
              onClick={onOpenContributorProfile}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Ver Perfil & Badges</span>
            </button>
          )}
        </div>
      </div>

      {/* Submission Reward Feedback */}
      {lastRewardResult && (
        <div
          role="status"
          className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-emerald-900 font-black text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Avaliação publicada! Você ganhou +{lastRewardResult.pointsEarned} XP.
              </span>
            </div>
            <span className="text-xs font-mono tabular-nums font-bold text-emerald-800">
              Total Contribuidor GuiaPonto: {lastRewardResult.snapshot.reviewCount}{' '}
              {lastRewardResult.snapshot.reviewCount === 1 ? 'avaliação' : 'avaliações'} ·{' '}
              {lastRewardResult.snapshot.totalXp.toLocaleString('pt-BR')} XP
            </span>
          </div>

          {lastRewardResult.leveledUpTo && (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 bg-white border border-emerald-200 px-3.5 py-2.5 rounded-xl">
              <Trophy className="w-4 h-4 text-[#FE3A18] shrink-0" />
              <span>
                Você subiu para o Nível {lastRewardResult.leveledUpTo.level} ·{' '}
                {lastRewardResult.leveledUpTo.title}!
              </span>
            </div>
          )}

          {lastRewardResult.newlyUnlockedBadges.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-900">
                Novas Badges Desbloqueadas:
              </div>
              <div className="flex flex-wrap gap-2">
                {lastRewardResult.newlyUnlockedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="px-3 py-2 rounded-xl bg-white border border-emerald-200 flex items-center gap-2 text-xs font-bold text-slate-900"
                  >
                    <span className="text-[#FE3A18]">
                      {renderContributorBadgeIcon(badge.iconKey, 'w-4 h-4')}
                    </span>
                    <span>{badge.title}</span>
                    <span className="font-mono text-emerald-700">+{badge.xpBonus} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Review Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Star Rating Selector */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-bold text-slate-800 block">
              Sua Nota para {businessName}
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`Avaliar com ${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
                  className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= activeStars
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-mono tabular-nums font-bold text-slate-700">
                {activeStars.toFixed(1)} / 5.0
              </span>
            </div>
          </div>

          {/* Reviewer Name */}
          <div className="md:col-span-7 space-y-1.5">
            <label htmlFor="reviewer-name-input" className="text-xs font-bold text-slate-800 block">
              Seu Nome no Perfil de Contribuidor
            </label>
            <input
              id="reviewer-name-input"
              type="text"
              required
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Ex: Camila Oliveira"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#FE3A18]"
            />
          </div>
        </div>

        {/* Experience Highlights */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Destaques da Experiência (Opcional · +15 XP)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {REVIEW_HIGHLIGHT_OPTIONS.map((tag) => {
              const selected = selectedHighlights.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleHighlight(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    selected
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comment Field */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <label htmlFor="reviewer-comment-input" className="font-bold text-slate-800">
              Conte como foi o atendimento ou serviço *
            </label>
            <span className="font-mono tabular-nums text-slate-500">
              {trimmedLen >= 60
                ? `${trimmedLen} caracteres · Bônus detalhista (+25 XP) ativo`
                : `${trimmedLen}/60 caracteres para bônus +25 XP`}
            </span>
          </div>
          <textarea
            id="reviewer-comment-input"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Ex: Atendimento ágil pelo WhatsApp e excelente serviço no bairro ${businessNeighborhood}...`}
            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FE3A18]"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            Recompensa estimada: +{50 + (trimmedLen >= 60 ? 25 : 0) + (selectedHighlights.length > 0 ? 15 : 0)} XP
          </span>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-bold text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Publicar Avaliação</span>
          </button>
        </div>
      </form>
    </div>
  );
}
