/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Star, CheckCircle, ThumbsUp, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';

export function TestimonialsGoogleSection() {
  const reviews = [
    {
      id: 1,
      author: 'Carlos Eduardo Mendes',
      role: 'Proprietário - Restaurante Sabor & Fogo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      date: 'Há 3 dias',
      text: 'Coloquei minha pizzaria no GuiaPonto e em menos de uma semana já recebi vários pedidos e contatos diretos pelo WhatsApp. A página é super profissional e fácil de configurar. Recomendo muito para quem tem negócio local!',
      verified: true,
      likes: 24,
    },
    {
      id: 2,
      author: 'Mariana Silveira',
      role: 'Diretora - Residencial Sênior Acolher',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      date: 'Há 1 semana',
      text: 'Excelente plataforma! Conectou nossa instituição de cuidado sênior exatamente com famílias da nossa região que estavam procurando por vagas. O suporte é rápido e o plano gratuito é excelente.',
      verified: true,
      likes: 18,
    },
    {
      id: 3,
      author: 'Roberto Almeida',
      role: 'Fundador - Oficina Precision Car',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      date: 'Há 2 semanas',
      text: 'Ferramenta indispensável para prestadores de serviços. O cadastro foi em minutos e já aparecemos nas buscas locais. Meus clientes adoram poder mandar mensagem no WhatsApp direto pelo perfil.',
      verified: true,
      likes: 31,
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Google Style Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 bg-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-sm">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Avaliações Verificadas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              O que dizem os empreendedores
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl">
              Depoimentos reais de lojistas, prestadores de serviços e empresários que transformaram sua presença digital.
            </p>
          </div>

          {/* Google Rating Summary Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-md flex items-center gap-6 shrink-0">
            <div className="flex flex-col items-center justify-center border-r border-slate-100 pr-6">
              <span className="text-4xl font-black text-slate-900">4.9</span>
              <div className="flex items-center gap-0.5 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">1.480+ Avaliações</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs">
                  G
                </div>
                <span className="text-sm font-bold text-slate-900">Google Business Reviews</span>
              </div>
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> 100% de avaliações verificadas
              </p>
              <span className="text-[10px] text-slate-400 block">Classificação de excelência local</span>
            </div>
          </div>
        </div>

        {/* Google Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, index) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group hover:border-[#FE3A18]/40"
            >
              <div>
                {/* Author Info */}
                <div className="flex items-center gap-4 mb-5">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                      {rev.author}
                      <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500/10 shrink-0" />
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{rev.role}</p>
                  </div>
                </div>

                {/* Stars and Date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{rev.date}</span>
                </div>

                {/* Review Text */}
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic mb-6">
                  "{rev.text}"
                </p>
              </div>

              {/* Card Footer / Google Badge */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                  <span>{rev.likes} pessoas acharam útil</span>
                </span>
                <span className="font-semibold text-[#FE3A18] bg-[#FE3A18]/10 px-2.5 py-1 rounded-md">
                  Google Review
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
