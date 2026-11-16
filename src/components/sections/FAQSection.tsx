/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'O cadastro no GuiaPonto é realmente gratuito?',
      answer: 'Sim! Você pode cadastrar sua empresa gratuitamente e manter seu perfil no plano gratuito sem nenhuma mensalidade, por tempo indeterminado.',
    },
    {
      question: 'Preciso ter um site para cadastrar minha empresa?',
      answer: 'Não. Você pode criar seu perfil comercial completo no GuiaPonto mesmo sem possuir um site próprio. Sua página funcionará como sua vitrine digital na internet.',
    },
    {
      question: 'Como meus clientes entram em contato comigo?',
      answer: 'Seu perfil disponibiliza canais de contato diretos, incluindo o WhatsApp, facilitando a conversação rápida e o fechamento de vendas.',
    },
    {
      question: 'Meu negócio vai aparecer no Google?',
      answer: 'O GuiaPonto trabalha com estrutura otimizada para buscas locais. Seu perfil pode ser indexado pelos motores de busca, aumentando suas chances de ser descoberto por novos clientes.',
    },
    {
      question: 'Posso começar no gratuito e contratar o Premium depois?',
      answer: 'Sim! Você pode iniciar sua presença digital gratuitamente e migrar para o plano Premium a qualquer momento para ter mais destaque, fotos e relatórios.',
    },
    {
      question: 'O plano gratuito tem prazo de validade?',
      answer: 'Não. O plano gratuito é permanente para que pequenos negócios e autônomos sempre tenham acesso à vitrine digital.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FE3A18]/10 text-[#FE3A18] text-xs font-semibold">
            <HelpCircle className="w-4 h-4 text-[#FE3A18]" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Dúvidas Frequentes
          </h2>
          <p className="text-slate-600 text-base">
            Tudo o que você precisa saber sobre o cadastro e funcionamento do GuiaPonto.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-[#FE3A18] transition-colors"
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#FE3A18] text-white' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
