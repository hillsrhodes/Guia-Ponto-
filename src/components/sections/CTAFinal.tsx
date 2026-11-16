/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

interface CTAFinalProps {
  onOpenRegisterModal: () => void;
}

export function CTAFinal({ onOpenRegisterModal }: CTAFinalProps) {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-[#FE3A18] via-rose-600 to-orange-600 rounded-3xl p-8 sm:p-16 text-white text-center relative overflow-hidden shadow-2xl shadow-[#FE3A18]/30"
        >
          {/* Background glowing elements */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Sua empresa merece ser encontrada</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Não deixe sua empresa fora da internet.
              </h2>

              <p className="text-base sm:text-xl text-rose-100 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Seus futuros clientes estão procurando produtos e serviços todos os dias em Sorocaba e região. Dê mais visibilidade ao seu negócio e facilite o caminho entre sua empresa e quem precisa do que você oferece.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2 text-xs sm:text-sm text-rose-100 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Cadastro 100% gratuito
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Sem cartão de crédito
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Ativação imediata
                </span>
              </div>

              <div className="pt-4">
                <button
                  onClick={onOpenRegisterModal}
                  className="px-8.5 py-4.5 rounded-2xl bg-white text-[#FE3A18] hover:bg-rose-50 font-extrabold text-base sm:text-lg shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3 group cursor-pointer"
                >
                  <span>Cadastrar Minha Empresa Grátis</span>
                  <ArrowRight className="w-5 h-5 text-[#FE3A18] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-rose-200">
                <MapPin className="w-4 h-4" />
                <span>GuiaPonto — Sua empresa merece ser encontrada.</span>
              </div>
            </div>

            {/* Right Column: Official Herói Robô GuiaPonto Illustration */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-white/25 rounded-full blur-2xl scale-110 pointer-events-none" />
                <img
                  src="https://www.guiaponto.com.br/guia/wp-content/themes/guiaponto-guia/assets/img/heroi-robo-320.webp"
                  alt="Herói Robô GuiaPonto"
                  referrerPolicy="no-referrer"
                  className="w-48 h-48 sm:w-60 sm:h-60 object-contain drop-shadow-2xl relative z-10 select-none"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
