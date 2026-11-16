/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  CheckCircle2,
  X,
  User,
  Phone,
  Clock,
  Eye,
  MessageSquare,
  Globe,
  ExternalLink
} from 'lucide-react';
import { OwnerEmailNotificationRecord } from '../../services/notificationService';

export function SimulatedEmailNotificationToast() {
  const [activeToast, setActiveToast] =
    useState<OwnerEmailNotificationRecord | null>(null);
  const [inspectedEmail, setInspectedEmail] =
    useState<OwnerEmailNotificationRecord | null>(null);

  useEffect(() => {
    const handleEmailDispatched = (event: Event) => {
      const customEvent = event as CustomEvent<OwnerEmailNotificationRecord>;
      if (customEvent.detail) {
        setActiveToast(customEvent.detail);
      }
    };

    window.addEventListener(
      'guiaponto-email-notification-sent',
      handleEmailDispatched
    );
    return () => {
      window.removeEventListener(
        'guiaponto-email-notification-sent',
        handleEmailDispatched
      );
    };
  }, []);

  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 8500);
    return () => clearTimeout(timer);
  }, [activeToast]);

  return (
    <>
      {/* Real-time Floating Simulated Email Toast */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            key={activeToast.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-5 left-5 z-[90] w-[calc(100vw-2.5rem)] max-w-md bg-slate-950 text-white rounded-2xl border border-emerald-500/40 shadow-2xl shadow-slate-950/60 overflow-hidden"
          >
            <div className="px-4 py-2.5 bg-emerald-600/20 border-b border-emerald-500/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-black text-emerald-300 truncate">
                  E-mail Simulado Enviado ao Proprietário
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                  {activeToast.smtpStatus}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveToast(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Fechar notificação"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">Para (Proprietário):</span>
                <span className="font-mono font-bold text-amber-300 truncate">
                  {activeToast.ownerEmail}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">Empresa:</span>
                <span className="font-bold text-white truncate">
                  {activeToast.businessName}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                    <User className="w-3.5 h-3.5" />
                    {activeToast.leadName}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-slate-300">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {activeToast.leadPhone}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span className="inline-flex items-center gap-1">
                    {activeToast.channel === 'Formulário da Landing Page' ? (
                      <Globe className="w-3 h-3 text-indigo-400" />
                    ) : (
                      <MessageSquare className="w-3 h-3 text-emerald-400" />
                    )}
                    {activeToast.channel}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-slate-300">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {activeToast.contactDateFormatted}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setInspectedEmail(activeToast);
                    setActiveToast(null);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver E-mail Simulado Completo</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Simulated Email Preview Modal */}
      <AnimatePresence>
        {inspectedEmail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden"
            >
              <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                      Notificação Transacional Simulada • {inspectedEmail.smtpStatus}
                    </span>
                    <h4 className="text-base font-black">
                      Comprovante de E-mail para o Proprietário
                    </h4>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectedEmail(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-slate-500 font-semibold">
                      Para (Proprietário):
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {inspectedEmail.ownerEmail}
                    </span>
                  </div>
                  {inspectedEmail.ccEmail && (
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-slate-500 font-semibold">
                        Cópia (CC):
                      </span>
                      <span className="font-mono text-slate-700">
                        {inspectedEmail.ccEmail}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-slate-500 font-semibold">
                      Data e Hora do Contato:
                    </span>
                    <span className="font-mono font-bold text-emerald-700">
                      {inspectedEmail.contactDateFormatted}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-slate-500 font-semibold">
                      Gatilho / Origem:
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                      {inspectedEmail.channel}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-semibold block mb-0.5">
                      Assunto do E-mail:
                    </span>
                    <p className="font-bold text-slate-900">
                      {inspectedEmail.emailSubject}
                    </p>
                  </div>
                </div>

                {/* Lead Details Table */}
                <div className="rounded-2xl border border-slate-200 p-4 space-y-2.5 text-xs">
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Dados Completos do Lead Capturado
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 block">
                        Nome do Contato
                      </span>
                      <strong className="text-slate-900">
                        {inspectedEmail.leadName}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 block">
                        Telefone / WhatsApp
                      </span>
                      <strong className="text-slate-900 font-mono">
                        {inspectedEmail.leadPhone}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 block">
                        E-mail Informado
                      </span>
                      <strong className="text-slate-900 font-mono">
                        {inspectedEmail.leadEmail || 'Não informado'}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 block">
                        Data do Contato
                      </span>
                      <strong className="text-slate-900 font-mono">
                        {inspectedEmail.contactDateFormatted}
                      </strong>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70">
                    <span className="text-[10px] font-bold uppercase text-emerald-700 block mb-1">
                      Mensagem / Interesse ({inspectedEmail.serviceOrSubject})
                    </span>
                    <p className="text-slate-800 leading-relaxed">
                      &ldquo;{inspectedEmail.message}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <a
                    href={`https://wa.me/${
                      inspectedEmail.leadPhone.replace(/\D/g, '') ||
                      '5515999998888'
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Responder Lead no WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setInspectedEmail(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
