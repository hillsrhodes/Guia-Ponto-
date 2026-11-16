import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Sparkles,
  Award,
  CheckCircle2,
  PartyPopper,
  Star,
  X,
  Zap
} from 'lucide-react';
import { Badge3DIcon, DigitalAchievementBadge } from './BadgeShowcase';

export interface AchievementCelebrationPayload {
  id?: string;
  type: 'badge' | 'milestone' | 'level_up';
  title: string;
  subtitle: string;
  description?: string;
  xpEarned: number;
  rarity?: string;
  trustBoostLabel?: string;
  rewardHighlight?: string;
  badgeIconType?: DigitalAchievementBadge['iconType'];
  badgePalette?: DigitalAchievementBadge['palette'];
}

export const ACHIEVEMENT_CELEBRATION_EVENT = 'guiaponto-achievement-celebration';

/**
 * Fires a multi-stage canvas-confetti celebration burst across the viewport
 */
export function fireAchievementConfetti(intensity: 'standard' | 'grand' = 'grand') {
  const brandColors = [
    '#FE3A18',
    '#F59E0B',
    '#10B981',
    '#14B8A6',
    '#FBBF24',
    '#38BDF8',
    '#A855F7'
  ];

  try {
    // 1. Central Star & Trophy Burst
    confetti({
      particleCount: intensity === 'grand' ? 85 : 50,
      spread: 80,
      origin: { x: 0.5, y: 0.55 },
      colors: brandColors,
      shapes: ['star', 'circle'],
      scalar: 1.15,
      zIndex: 9999
    });

    // 2. Left & Right Side Cannons after 180ms
    setTimeout(() => {
      confetti({
        particleCount: 55,
        angle: 60,
        spread: 60,
        origin: { x: 0.08, y: 0.68 },
        colors: brandColors,
        zIndex: 9999
      });
      confetti({
        particleCount: 55,
        angle: 120,
        spread: 60,
        origin: { x: 0.92, y: 0.68 },
        colors: brandColors,
        zIndex: 9999
      });
    }, 180);

    // 3. Final Golden Shower after 450ms for grand celebrations
    if (intensity === 'grand') {
      setTimeout(() => {
        confetti({
          particleCount: 70,
          spread: 110,
          startVelocity: 35,
          decay: 0.92,
          origin: { x: 0.5, y: 0.35 },
          colors: ['#FBBF24', '#FE3A18', '#10B981', '#FEF08A'],
          shapes: ['star', 'circle'],
          zIndex: 9999
        });
      }, 450);
    }
  } catch (err) {
    console.warn('Confetti animation fallback:', err);
  }
}

/**
 * Helper to trigger an AchievementCelebration from anywhere in AlexandreDashboardSPA
 */
export function triggerAchievementCelebration(payload: AchievementCelebrationPayload) {
  fireAchievementConfetti('grand');
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<AchievementCelebrationPayload>(ACHIEVEMENT_CELEBRATION_EVENT, {
        detail: payload
      })
    );
  }
}

interface AchievementCelebrationProps {
  activeCelebration?: AchievementCelebrationPayload | null;
  onDismiss?: () => void;
}

export function AchievementCelebration({
  activeCelebration: externalCelebration,
  onDismiss
}: AchievementCelebrationProps) {
  const [celebration, setCelebration] = useState<AchievementCelebrationPayload | null>(
    externalCelebration || null
  );
  const [spinCount, setSpinCount] = useState<number>(0);

  useEffect(() => {
    if (externalCelebration) {
      setCelebration(externalCelebration);
      fireAchievementConfetti('grand');
    }
  }, [externalCelebration]);

  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<AchievementCelebrationPayload>;
      if (customEvent.detail) {
        setCelebration(customEvent.detail);
        setSpinCount((prev) => prev + 1);
      }
    };

    window.addEventListener(ACHIEVEMENT_CELEBRATION_EVENT, handleEvent);
    return () => {
      window.removeEventListener(ACHIEVEMENT_CELEBRATION_EVENT, handleEvent);
    };
  }, []);

  const handleClose = useCallback(() => {
    setCelebration(null);
    if (onDismiss) onDismiss();
  }, [onDismiss]);

  // Auto-dismiss after 9 seconds if user doesn't close manually
  useEffect(() => {
    if (!celebration) return;
    const timer = setTimeout(() => {
      handleClose();
    }, 9000);
    return () => clearTimeout(timer);
  }, [celebration, handleClose]);

  const typeLabel =
    celebration?.type === 'badge'
      ? 'NOVA INSÍGNIA 3D DESBLOQUEADA'
      : celebration?.type === 'level_up'
      ? 'NOVO NÍVEL GUIAPONTO PRO ATINGIDO!'
      : 'MARCO DO LOJISTA CONCLUÍDO!';

  return (
    <AnimatePresence>
      {celebration && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-[120] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-400/60 rounded-3xl max-w-md w-full p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden text-center space-y-6"
          >
            {/* Ambient Radial Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#FE3A18]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer z-20"
              title="Fechar celebração"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase tracking-wider relative z-10">
              <PartyPopper className="w-4 h-4 text-[#FE3A18]" />
              <span>{typeLabel}</span>
              {celebration.rarity && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-white">{celebration.rarity}</span>
                </>
              )}
            </div>

            {/* Centerpiece Visual: 3D Badge or Trophy + Mascot */}
            <div className="py-2 flex flex-col items-center justify-center relative z-10">
              {celebration.badgeIconType && celebration.badgePalette ? (
                <div
                  onClick={() => {
                    setSpinCount((prev) => prev + 1);
                    fireAchievementConfetti('standard');
                  }}
                  className="cursor-pointer"
                  title="Clique para girar e lançar mais confetes!"
                >
                  <Badge3DIcon
                    iconType={celebration.badgeIconType}
                    palette={celebration.badgePalette}
                    size="lg"
                    isHovered={true}
                    spinTrigger={spinCount}
                  />
                </div>
              ) : (
                <motion.div
                  animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  onClick={() => fireAchievementConfetti('standard')}
                  className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-amber-400 via-[#FE3A18] to-rose-600 p-1 shadow-2xl shadow-amber-500/30 cursor-pointer flex items-center justify-center"
                >
                  <div className="w-full h-full rounded-[20px] bg-slate-950/90 flex items-center justify-center p-2">
                    <img
                      src="https://www.guiaponto.com.br/guia/wp-content/themes/guiaponto-guia/assets/img/heroi-robo-320.webp"
                      alt="Celebração GuiaPonto"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain drop-shadow-xl"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
                    <Trophy className="w-5 h-5" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Title & Description */}
            <div className="space-y-2 relative z-10">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                {celebration.title}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-amber-300">
                {celebration.subtitle}
              </p>
              {celebration.description && (
                <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto pt-1">
                  {celebration.description}
                </p>
              )}
            </div>

            {/* XP & Impact Highlight Box */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-around gap-4 relative z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Bônus de Experiência
                </span>
                <span className="text-lg font-black text-amber-400 font-mono">
                  +{celebration.xpEarned} XP
                </span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Impacto Comercial
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-400">
                  {celebration.trustBoostLabel || celebration.rewardHighlight || 'Destaque Verificado Sorocaba'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 relative z-10">
              <button
                type="button"
                onClick={() => {
                  setSpinCount((prev) => prev + 1);
                  fireAchievementConfetti('grand');
                }}
                className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <PartyPopper className="w-4 h-4" />
                <span>Mais Confetes!</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#FE3A18] to-amber-500 hover:opacity-95 text-white font-black text-xs shadow-xl shadow-[#FE3A18]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Continuar Evoluindo</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
