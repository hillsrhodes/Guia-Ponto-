/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Sparkles, Bot, Zap, CheckCircle2, ArrowRight, Wand2 } from 'lucide-react';

interface AIAdTechShowcaseProps {
  onOpenRegisterModal: () => void;
}

export function AIAdTechShowcase({ onOpenRegisterModal }: AIAdTechShowcaseProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden border-y border-slate-200/60">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-[#FE3A18]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FE3A18]/10 text-[#FE3A18] text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#FE3A18] animate-spin" />
              <span>Tecnologia Disruptiva • Cacilda AI</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Anúncios criados por Inteligência Artificial em segundos.
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Esqueça formulários chatos e manuais complexos. Nossa assistente <strong className="text-slate-900">Cacilda AI</strong> analisa seu nicho, gera títulos magnéticos, descrições de alta conversão e otimiza seu perfil automaticamente para o WhatsApp e para o Google.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Copywriting Magnético Automático</h4>
                  <p className="text-xs text-slate-500">Textos persuasivos gerados por IA com foco total em fechar vendas no WhatsApp.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Editor e Versionamento Inteligente</h4>
                  <p className="text-xs text-slate-500">Atualize preços, crie promoções de Natal ou Black Friday conversando com a IA.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Otimização SEO Local Avançada</h4>
                  <p className="text-xs text-slate-500">Seu negócio posicionado nas buscas da sua cidade de forma automática.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onOpenRegisterModal}
                className="px-8 py-4 rounded-2xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-extrabold text-base shadow-xl shadow-[#FE3A18]/30 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Wand2 className="w-5 h-5" />
                <span>Testar Criador de Anúncios com IA</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Interactive AI Simulation Box with Official GuiaPonto Robot Mascot */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FE3A18]/20 rounded-full blur-3xl pointer-events-none" />

              {/* TopMascot & Studio Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FE3A18]/25 to-slate-800 border border-[#FE3A18]/40 p-1.5 flex items-center justify-center shrink-0 shadow-lg"
                  >
                    <img
                      src="https://www.guiaponto.com.br/guia/wp-content/themes/guiaponto-guia/assets/img/robo-480.webp"
                      alt="Robô Assistente GuiaPonto IA"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                  </motion.div>
                  <div>
                    <h4 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                      <span>Cacilda AI Studio</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">Ativo</span>
                    </h4>
                    <p className="text-xs text-slate-400">Assistente oficial GuiaPonto em tempo real</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-400 self-start sm:self-center">
                  <Zap className="w-4 h-4 fill-amber-400" />
                  <span>1.2s</span>
                </div>
              </div>

              {/* Chat Simulation */}
              <div className="space-y-4 mb-6 relative z-10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300 shrink-0">
                    EU
                  </div>
                  <div className="bg-slate-800/80 rounded-2xl rounded-tl-none p-3.5 text-xs sm:text-sm text-slate-200">
                    "Sou dono de uma oficina mecânica em Sorocaba especialista em injeção eletrônica."
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-[#FE3A18]/50 p-1 flex items-center justify-center shrink-0 shadow-md">
                    <img
                      src="https://www.guiaponto.com.br/guia/wp-content/themes/guiaponto-guia/assets/img/robo-480.webp"
                      alt="Robô GuiaPonto"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-none p-4 text-xs sm:text-sm text-slate-100 space-y-2">
                    <p className="font-semibold text-[#FE3A18]">✨ Anúncio Gerado com Sucesso:</p>
                    <p className="font-bold text-white text-base">Oficina Precision Car — Injeção Eletrônica e Revisão Geral</p>
                    <p className="text-slate-300 text-xs">"Economize combustível e evite dores de cabeça em Sorocaba. Diagnóstico computadorizado gratuito e garantia estendida. Fale com um mecânico no WhatsApp!"</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-emerald-400 text-xs font-bold relative z-10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Pronto para publicação instantânea na vitrine</span>
                </div>
                <span className="text-white bg-emerald-600 px-2.5 py-1 rounded-lg">1-Click Publish</span>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
