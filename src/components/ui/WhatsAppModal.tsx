/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { X, MessageSquare, Send, CheckCircle2, Phone, User, Mail, ExternalLink } from 'lucide-react';
import {
  notifyOwnerOnContactFormSubmit,
  resolveBusinessOwnerEmail,
  formatContactDatePtBr
} from '../../services/notificationService';

interface WhatsAppModalProps {
  businessName: string | null;
  onClose: () => void;
}

export function WhatsAppModal({ businessName, onClose }: WhatsAppModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [message, setMessage] = useState(
    'Olá! Vi sua empresa no GuiaPonto e gostaria de mais informações sobre seus serviços.'
  );
  const [sent, setSent] = useState(false);
  const [notifiedOwnerEmail, setNotifiedOwnerEmail] = useState<string>('');
  const [contactTimestamp, setContactTimestamp] = useState<string>('');

  if (!businessName) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const ownerEmail = resolveBusinessOwnerEmail(businessName);
    setNotifiedOwnerEmail(ownerEmail);
    setContactTimestamp(formatContactDatePtBr(now));
    setSent(true);

    await notifyOwnerOnContactFormSubmit({
      businessName,
      channel: 'Formulário de WhatsApp',
      leadName: customerName.trim() || 'Visitante GuiaPonto Sorocaba',
      leadPhone: customerPhone.trim() || '(15) 99100-0000',
      leadEmail: customerEmail.trim() || 'Não informado',
      serviceOrSubject: 'Contato Rápido via Formulário de WhatsApp',
      message: message.trim(),
      contactDate: now
    });
  };

  const handleCloseModal = () => {
    setSent(false);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    onClose();
  };

  const whatsappUrl = `https://wa.me/5515999999999?text=${encodeURIComponent(
    `${customerName ? `Olá, meu nome é ${customerName}. ` : ''}${message}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-emerald-600 p-6 text-white relative">
          <button
            onClick={handleCloseModal}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-200">
                Contato via WhatsApp + Alerta E-mail
              </span>
              <h3 className="text-xl font-black">{businessName}</h3>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {sent ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900">
                  Contato Registrado com Sucesso!
                </h4>
                <p className="text-xs text-slate-500">
                  Sua mensagem está pronta para abrir no WhatsApp da empresa.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Notificação por E-mail Enviada ao Proprietário!</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Um e-mail simulado com seus dados e data do contato (
                  <strong className="font-mono">{contactTimestamp}</strong>) foi entregue para{' '}
                  <strong className="font-mono">{notifiedOwnerEmail}</strong>.
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCloseModal}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Abrir Conversa no WhatsApp Agora</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Fechar Janela
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Seu Nome *
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: João Silva"
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Seu WhatsApp *
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(15) 99123-4567"
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Seu E-mail (Opcional)
                </label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="voce@email.com.br"
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Mensagem para {businessName}
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-[11px] text-slate-600">
                <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  O dono da empresa também recebe um <strong>alerta imediato por e-mail</strong> com
                  seu pedido.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar & Iniciar Conversa no WhatsApp</span>
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
