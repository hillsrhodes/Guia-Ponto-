/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, ArrowRight, CheckCircle2, MessageSquare, Star, MapPin, X, ShieldCheck, QrCode, Copy, RefreshCw } from 'lucide-react';

interface CacildaAICreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishSuccess: (adData: any) => void;
}

export function CacildaAICreatorModal({ isOpen, onClose, onPublishSuccess }: CacildaAICreatorModalProps) {
  const [step, setStep] = useState<'step1' | 'processing' | 'step2_preview' | 'plan_selection' | 'success'>('step1');
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'cacilda' | 'user'; text: string }>>([
    { sender: 'cacilda', text: 'Bora, meu rei! Me conta o que seu negócio faz, onde você atende e o que quer divulgar hoje.' }
  ]);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');

  // Generated Ad preview state
  const [adData, setAdData] = useState({
    title: '',
    category: '',
    city: '',
    description: '',
    whatsapp: '',
    differentials: [] as string[],
    cta: 'Falar no WhatsApp',
  });

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newHistory = [...chatHistory, { sender: 'user' as const, text: userInput }];
    setChatHistory(newHistory);
    setUserInput('');

    // Simulate Cacilda processing and generating structured ad
    setStep('processing');
    setTimeout(() => {
      // Parse basic info or fallback
      const text = userInput.toLowerCase();
      let category = 'Serviços Locais';
      if (text.includes('restaurante') || text.includes('pizza') || text.includes('comida') || text.includes('lanche')) category = 'Restaurantes & Gastronomia';
      else if (text.includes('clinica') || text.includes('saude') || text.includes('odontolog') || text.includes('dentista')) category = 'Saúde & Estética';
      else if (text.includes('imovel') || text.includes('imobiliaria') || text.includes('casa')) category = 'Imobiliárias & Arquitetura';
      else if (text.includes('oficina') || text.includes('carro') || text.includes('mecanic')) category = 'Oficinas & Automotivo';

      let city = 'Sorocaba, SP';
      if (text.includes('votorantim')) city = 'Votorantim, SP';
      else if (text.includes('itu')) city = 'Itu, SP';
      else if (text.includes('salto')) city = 'Salto, SP';
      else if (text.includes('campolim')) city = 'Sorocaba, SP - Campolim';
      else if (text.includes('rio') || text.includes('rj')) city = 'Rio de Janeiro, RJ';

      setAdData({
        title: text.includes('promoção') ? 'Super Promoção Especial por Tempo Limitado' : 'Profissionais Qualificados Próximo a Você',
        category,
        city,
        description: newHistory[1]?.text || 'Atendimento especializado com foco em qualidade e agilidade para clientes de Sorocaba e região.',
        whatsapp: '(15) 99999-9999',
        differentials: ['Atendimento rápido', 'Profissionais certificados', 'Orçamento sem compromisso'],
        cta: 'Solicitar Orçamento',
      });

      setChatHistory([
        ...newHistory,
        { sender: 'cacilda', text: 'Prontinho! Analisei seu pedido e estruturei seu anúncio otimizado para o Google. Dá uma olhada na prévia abaixo e me diz o que acha!' }
      ]);
      setStep('step2_preview');
    }, 2000);
  };

  const handleApproveAndSelectPlan = (plan: 'free' | 'premium') => {
    setSelectedPlan(plan);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
      >
        {/* Header with Cacilda Avatar */}
        <div className="bg-gradient-to-r from-[#FE3A18] to-rose-600 p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#FE3A18] flex items-center justify-center shadow-lg font-black text-xl">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
                  Assistente IA
                </span>
                <span className="text-xs text-rose-100">Criação Guiada em 2 Passos</span>
              </div>
              <h3 className="text-2xl font-black mt-1">Cacilda — Criador de Anúncios</h3>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          
          {/* STEP 1: Conversational Chat */}
          {step === 'step1' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4 max-h-[350px] overflow-y-auto">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 text-sm sm:text-base leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#FE3A18] text-white rounded-br-none shadow-md'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.sender === 'cacilda' && (
                        <span className="block text-[10px] font-bold text-[#FE3A18] uppercase tracking-wider mb-1">
                          Cacilda (IA)
                        </span>
                      )}
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Ex: Tenho uma clínica em Santos, trabalho com implantes..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="flex-1 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#FE3A18] focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-2xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-bold shadow-lg shadow-[#FE3A18]/25 transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Enviar</span>
                </button>
              </form>
            </div>
          )}

          {/* PROCESSING STATE */}
          {step === 'processing' && (
            <div className="text-center py-16 space-y-6">
              <div className="w-20 h-20 rounded-full bg-[#FE3A18]/10 text-[#FE3A18] flex items-center justify-center mx-auto animate-spin">
                <RefreshCw className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-bold text-slate-900">Cacilda está preparando seu anúncio...</h4>
                <p className="text-slate-500 text-sm">Estruturando dados, título SEO e otimizando para conversão local.</p>
              </div>
            </div>
          )}

          {/* STEP 2: Preview & Edit */}
          {step === 'step2_preview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-slate-900">Prévia do Anúncio Gerado</h4>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                  Pronto para Publicação
                </span>
              </div>

              {/* Editable Preview Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Título do Anúncio</label>
                  <input
                    type="text"
                    value={adData.title}
                    onChange={(e) => setAdData({ ...adData, title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#FE3A18] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Categoria</label>
                    <input
                      type="text"
                      value={adData.category}
                      onChange={(e) => setAdData({ ...adData, category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#FE3A18] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Cidade / Região</label>
                    <input
                      type="text"
                      value={adData.city}
                      onChange={(e) => setAdData({ ...adData, city: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#FE3A18] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Descrição Comercial</label>
                  <textarea
                    rows={3}
                    value={adData.description}
                    onChange={(e) => setAdData({ ...adData, description: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-[#FE3A18] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">WhatsApp de Contato</label>
                  <input
                    type="text"
                    value={adData.whatsapp}
                    onChange={(e) => setAdData({ ...adData, whatsapp: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#FE3A18] focus:outline-none"
                  />
                </div>
              </div>

              {/* Plan Selection */}
              <div className="space-y-3">
                <h5 className="text-sm font-bold text-slate-900">Escolha a Modalidade de Publicação</h5>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setSelectedPlan('free')}
                    className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${
                      selectedPlan === 'free' ? 'border-[#FE3A18] bg-rose-50/50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-500 uppercase">Grátis para Sempre</span>
                    <h6 className="text-lg font-black text-slate-900 mt-1">Plano Gratuito</h6>
                    <p className="text-xs text-slate-500 mt-1">1 imagem, palavra-chave e WhatsApp para copiar.</p>
                  </div>

                  <div
                    onClick={() => setSelectedPlan('premium')}
                    className={`border-2 rounded-2xl p-5 cursor-pointer transition-all relative ${
                      selectedPlan === 'premium' ? 'border-[#FE3A18] bg-rose-50/50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="absolute top-3 right-3 bg-[#FE3A18] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                      Recomendado
                    </span>
                    <span className="text-xs font-bold text-[#FE3A18] uppercase">Destaque Máximo</span>
                    <h6 className="text-lg font-black text-slate-900 mt-1">Plano Premium</h6>
                    <p className="text-xs text-slate-500 mt-1">Até 8 imagens, botão direto WhatsApp, R$ 297/ano ou 12x R$ 29,70.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-4">
                <button
                  onClick={() => setStep('step1')}
                  className="px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  Voltar e Conversar com Cacilda
                </button>
                <button
                  onClick={() => handleApproveAndSelectPlan(selectedPlan)}
                  className="flex-1 py-3.5 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-bold text-sm shadow-lg shadow-[#FE3A18]/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Aprovar e Publicar Anúncio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS STATE */}
          {step === 'success' && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-black text-slate-900">Anúncio Publicado com Sucesso!</h4>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Sua vitrine digital já está no ar pelo modalidade <strong className="text-slate-900 uppercase">{selectedPlan}</strong>. Você já pode acessar seu painel para gerenciar e compartilhar.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left max-w-md mx-auto space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-slate-900">Link Público:</span>
                  <span className="text-[#FE3A18] font-medium truncate max-w-[200px]">guiaponto.com.br/anuncio/sabor-e-fogo</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-slate-900">Status:</span>
                  <span className="text-emerald-600 font-bold">Ativo & Indexado</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onPublishSuccess({ ...adData, plan: selectedPlan });
                  onClose();
                }}
                className="w-full py-4 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-bold text-base shadow-lg shadow-[#FE3A18]/25 transition-all cursor-pointer"
              >
                Acessar Meu Painel do Anunciante
              </button>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
