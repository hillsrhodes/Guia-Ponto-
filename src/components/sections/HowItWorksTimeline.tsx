/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { UserPlus, LayoutTemplate, Globe, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HowItWorksTimelineProps {
  onOpenRegisterModal: () => void;
}

export function HowItWorksTimeline({ onOpenRegisterModal }: HowItWorksTimelineProps) {
  const steps = [
    {
      number: '01',
      title: 'Crie sua conta',
      description: 'Faça seu cadastro gratuitamente em segundos e informe os dados básicos da sua empresa.',
      icon: UserPlus,
      color: 'from-[#FE3A18] to-rose-600',
    },
    {
      number: '02',
      title: 'Monte seu perfil comercial',
      description: 'Adicione descrição persuasiva, endereço, fotos de alta qualidade, serviços e links de contato.',
      icon: LayoutTemplate,
      color: 'from-rose-500 to-orange-600',
    },
    {
      number: '03',
      title: 'Publique seu negócio',
      description: 'Disponibilize seu perfil na vitrine digital para que milhares de pessoas encontrem sua empresa.',
      icon: Globe,
      color: 'from-orange-500 to-amber-600',
    },
    {
      number: '04',
      title: 'Conecte-se com seus clientes',
      description: 'Facilite o contato direto pelo WhatsApp e comece a fechar novos negócios todos os dias.',
      icon: MessageSquare,
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <section id="como-funciona" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Setup Simples em 5 Minutos</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Comece a divulgar seu negócio em poucos minutos.
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Você não precisa de conhecimentos técnicos ou de um site próprio para ter presença digital profissional.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 relative group hover:bg-white hover:shadow-xl hover:border-[#FE3A18]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${step.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-black text-slate-300 group-hover:text-[#FE3A18] transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#FE3A18] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200/60 flex items-center text-xs font-semibold text-slate-500">
                  <span>Passo {index + 1} de 4</span>
                </div>
              </motion.div>
            );
          })}

        </div>

        {/* Bottom CTA Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-slate-950 via-[#400d07] to-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl"
        >
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest font-bold text-[#FE3A18] bg-[#FE3A18]/20 px-3 py-1 rounded-full">
              É simples. É digital. É gratuito para começar.
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Pronto para colocar seu negócio na vitrine digital?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              Cadastre agora mesmo e comece a ser encontrado por potenciais clientes na sua região.
            </p>
          </div>

          <button
            onClick={onOpenRegisterModal}
            className="px-8 py-4 rounded-2xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-bold text-base shadow-lg shadow-[#FE3A18]/30 hover:scale-105 transition-all flex items-center gap-3 shrink-0 cursor-pointer"
          >
            <span>Cadastrar Meu Negócio Grátis</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
