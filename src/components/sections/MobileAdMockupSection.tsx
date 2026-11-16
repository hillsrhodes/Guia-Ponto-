/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Smartphone, Star, MapPin, MessageSquare, Phone, Share2, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface MobileAdMockupSectionProps {
  onOpenRegisterModal: () => void;
  onContactWhatsApp: (businessName: string) => void;
}

export function MobileAdMockupSection({ onOpenRegisterModal, onContactWhatsApp }: MobileAdMockupSectionProps) {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[#FE3A18]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FE3A18]/10 text-[#FE3A18] text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-[#FE3A18]" />
              <span>Experiência Mobile Otimizada</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Seu negócio na palma da mão de quem procura.
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Mais de 80% das buscas por serviços locais são feitas pelo celular. Com o GuiaPonto, seu perfil comercial é exibido em um formato moderno, rápido e com botão de WhatsApp direto para fechar vendas na hora.
            </p>

            <div className="space-y-3 pt-2 text-left max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Página comercial completa com fotos e avaliações</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Integração instantânea com WhatsApp Business</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Otimizado para indexação no Google e buscas locais</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onOpenRegisterModal}
                className="px-8 py-4 rounded-2xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-bold text-base shadow-xl shadow-[#FE3A18]/30 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Criar Meu Anúncio Grátis</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Smartphone Mockup */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* Floating Decorative Badges - positioned safely below the phone notch / top frame */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute top-40 -left-20 bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl p-4 z-40 flex items-center gap-3 hidden sm:flex"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-slate-400 font-bold uppercase">Contato Direto</span>
                  <span className="text-sm font-bold text-slate-900">WhatsApp Ativo</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                className="absolute bottom-28 -right-20 bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl p-4 z-40 flex items-center gap-3 hidden sm:flex"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FE3A18] text-white flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-slate-400 font-bold uppercase">Destaque Local</span>
                  <span className="text-sm font-bold text-slate-900">Plano Premium</span>
                </div>
              </motion.div>

              {/* Smartphone Frame */}
              <div className="w-[300px] sm:w-[320px] h-[640px] rounded-[3rem] border-[10px] border-slate-900 bg-slate-900 shadow-2xl overflow-hidden relative ring-8 ring-slate-900/10">
                
                {/* Phone Speaker Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-30 flex items-center justify-center">
                  <div className="w-12 h-1.5 bg-slate-800 rounded-full" />
                </div>

                {/* Screen Content */}
                <div className="w-full h-full bg-slate-50 pt-8 pb-6 px-4 overflow-y-auto no-scrollbar flex flex-col justify-between">
                  
                  <div>
                    {/* App Bar inside phone */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-lg bg-[#FE3A18] text-white flex items-center justify-center font-black text-xs">
                          GP
                        </div>
                        <span className="font-extrabold text-sm text-slate-900">GuiaPonto</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Online
                      </span>
                    </div>

                    {/* Listing Card Inside Phone */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                      <div className="relative h-36 bg-slate-200">
                        <img
                          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
                          alt="Restaurante Sabor & Fogo"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-[#FE3A18] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow">
                          Destaque
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-slate-500">Restaurantes & Gastronomia</span>
                          <div className="flex items-center gap-1 bg-amber-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                            <Star className="w-3 h-3 fill-white" />
                            <span>4.9</span>
                          </div>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 leading-tight">
                          Restaurante Sabor & Fogo
                        </h4>

                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>Sorocaba, SP - Campolim</span>
                        </div>

                        <p className="text-[11px] text-slate-600 line-clamp-2">
                          O melhor da culinária contemporânea e grelhados na brasa. Ambiente aconchegante e delivery rápido.
                        </p>

                        <div className="pt-2">
                          <button
                            onClick={() => onContactWhatsApp('Restaurante Sabor & Fogo')}
                            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Pedir no WhatsApp</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Additional Mini Ad card */}
                    <div className="mt-3 bg-white rounded-2xl border border-slate-200 p-3 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                        IM
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 truncate">Imobiliária Nova Era</h5>
                        <p className="text-[10px] text-slate-500 truncate">Curitiba, PR • Aluguel e Venda</p>
                      </div>
                    </div>

                  </div>

                  {/* Phone Bottom Home Indicator */}
                  <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-4" />

                </div>

              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
