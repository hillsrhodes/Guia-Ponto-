/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Building2, Layers, MapPin, TrendingUp } from 'lucide-react';

export function StatsBanner() {
  const stats = [
    {
      icon: Building2,
      value: '2.500+',
      label: 'Negócios Cadastrados',
      description: 'Negócios ativos gerando oportunidades diárias.',
      color: 'from-[#FE3A18] to-rose-600',
    },
    {
      icon: Layers,
      value: '48',
      label: 'Categorias de Serviços',
      description: 'Restaurantes, saúde, imobiliárias, oficinas e mais.',
      color: 'from-rose-500 to-orange-500',
    },
    {
      icon: MapPin,
      value: '120+',
      label: 'Cidades Atendidas',
      description: 'Presença consolidada em dezenas de regiões.',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: TrendingUp,
      value: '94%',
      label: 'Satisfação dos Clientes',
      description: 'Negócios que relatam aumento nos contatos.',
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FE3A18]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-[#FE3A18] bg-[#FE3A18]/10 px-3 py-1 rounded-full border border-[#FE3A18]/20">
            Prova Social Verificada
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3">
            Negócios locais merecem ser vistos.
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Indicadores atualizados e reais de negócios que já transformaram sua presença digital com o GuiaPonto.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 relative group hover:border-[#FE3A18]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FE3A18]/10"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-base font-semibold text-[#FE3A18] mb-1">
                  {stat.label}
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
