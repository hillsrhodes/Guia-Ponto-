import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Bell,
  CheckCircle2,
  Send,
  MessageSquare,
  Globe,
  Eye,
  X,
  Phone,
  User,
  Clock,
  Tag,
  ShieldCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';

import {
  OwnerEmailNotificationRecord,
  OwnerEmailPreferences,
  NotificationChannelType,
  getOwnerEmailPreferences,
  saveOwnerEmailPreferences,
  getStoredOwnerEmailLogs,
  dispatchOwnerLeadEmailNotification,
  notifyOwnerOnWhatsAppButtonClick,
  notifyOwnerOnContactFormSubmit
} from '../../services/notificationService';

export {
  type OwnerEmailNotificationRecord,
  type OwnerEmailPreferences,
  type NotificationChannelType,
  getOwnerEmailPreferences,
  saveOwnerEmailPreferences,
  getStoredOwnerEmailLogs,
  dispatchOwnerLeadEmailNotification,
  notifyOwnerOnWhatsAppButtonClick,
  notifyOwnerOnContactFormSubmit
};

interface MerchantEmailNotificationHubProps {
  businessName?: string;
  compact?: boolean;
}

export function MerchantEmailNotificationHub({
  businessName = 'Restaurante Sabor & Fogo Co',
  compact = false
}: MerchantEmailNotificationHubProps) {
  const [prefs, setPrefs] = useState<OwnerEmailPreferences>(() => getOwnerEmailPreferences());
  const [logs, setLogs] = useState<OwnerEmailNotificationRecord[]>(() => getStoredOwnerEmailLogs());
  const [selectedEmailPreview, setSelectedEmailPreview] =
    useState<OwnerEmailNotificationRecord | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);

  useEffect(() => {
    const syncLogs = () => {
      setLogs(getStoredOwnerEmailLogs());
    };
    const syncPrefs = () => {
      setPrefs(getOwnerEmailPreferences());
    };

    window.addEventListener('guiaponto-email-notification-sent', syncLogs);
    window.addEventListener('guiaponto-email-prefs-updated', syncPrefs);
    window.addEventListener('storage', syncLogs);
    return () => {
      window.removeEventListener('guiaponto-email-notification-sent', syncLogs);
      window.removeEventListener('guiaponto-email-prefs-updated', syncPrefs);
      window.removeEventListener('storage', syncLogs);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleUpdatePrefs = (next: Partial<OwnerEmailPreferences>) => {
    const updated = { ...prefs, ...next };
    setPrefs(updated);
    saveOwnerEmailPreferences(updated);
  };

  const handleSaveSettingsForm = (e: React.FormEvent) => {
    e.preventDefault();
    saveOwnerEmailPreferences(prefs);
    showToast(`Destinatário (${prefs.ownerEmail}) e regras de alerta por e-mail salvos com sucesso!`);
  };

  const handleSendTestNotification = async (
    channel: 'Formulário de WhatsApp' | 'Formulário da Landing Page'
  ) => {
    setIsSendingTest(true);
    const record = await dispatchOwnerLeadEmailNotification({
      businessName,
      channel,
      leadName:
        channel === 'Formulário de WhatsApp'
          ? 'Carolina Mendes (Teste WhatsApp)'
          : 'Eduardo Fontes (Teste Landing Page)',
      leadPhone: '(15) 99188-7744',
      leadEmail: 'cliente.teste@sorocaba.com.br',
      serviceOrSubject:
        channel === 'Formulário de WhatsApp'
          ? 'Dúvida Rápida pelo Botão de WhatsApp'
          : 'Orçamento Prioritário via Landing Page',
      message:
        channel === 'Formulário de WhatsApp'
          ? 'Olá! Cliquei no botão de WhatsApp no GuiaPonto Sorocaba e gostaria de atendimento imediato.'
          : 'Preenchi o formulário completo da Landing Page da empresa para solicitar um orçamento detalhado hoje.',
      couponUsed: channel === 'Formulário da Landing Page' ? 'SOROCABA15' : undefined,
      neighborhood: 'Campolim, Sorocaba - SP'
    });
    setIsSendingTest(false);

    if (record) {
      setSelectedEmailPreview(record);
      showToast(`E-mail de notificação disparado para ${record.ownerEmail} (${channel})!`);
    } else {
      showToast('Este canal de notificação está desativado nas configurações acima.');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-7 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-black uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>Motor de Alertas Transacionais por E-mail • Tempo Real</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Notificações por E-mail para o Dono da Empresa
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Receba um alerta imediato no seu e-mail sempre que um cliente enviar contato pelo{' '}
            <strong className="text-white">Formulário de WhatsApp</strong> ou pelo{' '}
            <strong className="text-white">Formulário de Orçamento da Landing Page</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={isSendingTest}
            onClick={() => handleSendTestNotification('Formulário de WhatsApp')}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all disabled:opacity-60"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Simular Alerta WhatsApp</span>
          </button>
          <button
            type="button"
            disabled={isSendingTest}
            onClick={() => handleSendTestNotification('Formulário da Landing Page')}
            className="px-3.5 py-2.5 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all disabled:opacity-60"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Simular Alerta Landing Page</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-6 mt-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMsg(null)}
              className="text-emerald-700 hover:text-emerald-950 font-black cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column: Recipient Configuration & Channel Toggles */}
        {!compact && (
          <form onSubmit={handleSaveSettingsForm} className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#FE3A18]" />
                <span>Destinatários & Gatilhos de Disparo</span>
              </h4>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                SMTP ATIVO
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                E-mail Principal do Proprietário (Recebimento Imediato) *
              </label>
              <input
                type="email"
                required
                value={prefs.ownerEmail}
                onChange={(e) => handleUpdatePrefs({ ownerEmail: e.target.value })}
                placeholder="dono@suaempresa.com.br"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:border-[#FE3A18] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                E-mail em Cópia / Equipe Comercial (CC Opcional)
              </label>
              <input
                type="email"
                value={prefs.ccEmail}
                onChange={(e) => handleUpdatePrefs({ ccEmail: e.target.value })}
                placeholder="vendas@suaempresa.com.br"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:border-[#FE3A18] focus:outline-none"
              />
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Alerta em Novo Contato via WhatsApp</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Dispara e-mail quando o cliente abre conversa pelo modal de WhatsApp.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdatePrefs({ notifyOnWhatsAppForm: !prefs.notifyOnWhatsAppForm })
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer shrink-0 ${
                    prefs.notifyOnWhatsAppForm
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {prefs.notifyOnWhatsAppForm ? 'Ativo' : 'Pausado'}
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#FE3A18]" />
                    <span>Alerta em Orçamento na Landing Page</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Dispara e-mail com todos os campos preenchidos na página exclusiva da empresa.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdatePrefs({ notifyOnLandingPageForm: !prefs.notifyOnLandingPageForm })
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer shrink-0 ${
                    prefs.notifyOnLandingPageForm
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {prefs.notifyOnLandingPageForm ? 'Ativo' : 'Pausado'}
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Botão 1-Clique p/ Responder no WhatsApp no E-mail</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Inclui botão direto no corpo do e-mail para chamar o lead no celular.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdatePrefs({
                      includeDirectWhatsAppLink: !prefs.includeDirectWhatsAppLink
                    })
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer shrink-0 ${
                    prefs.includeDirectWhatsAppLink
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {prefs.includeDirectWhatsAppLink ? 'Ativo' : 'Pausado'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5 text-[#FE3A18]" />
              <span>Salvar Preferências de Notificação por E-mail</span>
            </button>
          </form>
        )}

        {/* Right Column: Real-Time Dispatched Emails Log */}
        <div className={`${compact ? 'lg:col-span-12' : 'lg:col-span-7'} space-y-4`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Caixa de Saída • E-mails Enviados ao Proprietário ({logs.length})
              </h4>
              <p className="text-[11px] text-slate-500">
                Clique em qualquer alerta abaixo para visualizar o e-mail completo entregue para{' '}
                <strong className="text-slate-700">{prefs.ownerEmail}</strong>.
              </p>
            </div>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {logs.map((item) => {
              const isWa =
                item.channel === 'Formulário de WhatsApp' ||
                item.channel === 'Botão de WhatsApp';
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isWa
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-orange-100 text-[#FE3A18] border border-orange-200'
                        }`}
                      >
                        {item.channel}
                      </span>
                      <span className="text-xs font-black text-slate-900">{item.leadName}</span>
                      <span className="text-[11px] font-mono text-slate-500">{item.leadPhone}</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ {item.smtpStatus}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-700 line-clamp-1">
                      Para: <span className="font-mono text-slate-900">{item.ownerEmail}</span> —{' '}
                      {item.serviceOrSubject}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      "{item.message}" ·{' '}
                      <span className="font-mono font-bold text-slate-700">
                        Data: {item.contactDateFormatted || item.dispatchedAt}
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedEmailPreview(item)}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-900 hover:text-white text-slate-800 border border-slate-200 font-black text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-all self-start sm:self-center"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#FE3A18]" />
                    <span>Ver E-mail</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Preview of the Actual HTML Email Delivered to the Business Owner */}
      <AnimatePresence>
        {selectedEmailPreview && (
          <div
            onClick={() => setSelectedEmailPreview(null)}
            className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden border border-slate-200 shadow-2xl"
            >
              {/* Email Client Header Bar */}
              <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-5 h-5 text-[#FE3A18]" />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                      Preview do E-mail Entregue ao Proprietário • {selectedEmailPreview.smtpStatus}
                    </span>
                    <h4 className="text-sm font-bold text-white line-clamp-1">
                      {selectedEmailPreview.emailSubject}
                    </h4>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEmailPreview(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Email Envelope Metadata */}
              <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 text-xs space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-slate-500">De:</span>{' '}
                    <strong className="text-slate-800">
                      GuiaPonto Sorocaba Alertas &lt;alertas@guiaponto.com.br&gt;
                    </strong>
                  </div>
                  <span className="font-mono text-slate-500">
                    {selectedEmailPreview.dispatchedAt}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-slate-500">Para (Dono da Empresa):</span>{' '}
                    <strong className="text-slate-900 font-mono">
                      {selectedEmailPreview.ownerEmail}
                    </strong>
                  </div>
                  {selectedEmailPreview.ccEmail && (
                    <div>
                      <span className="text-slate-500">Cc:</span>{' '}
                      <span className="font-mono text-slate-700">
                        {selectedEmailPreview.ccEmail}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Email HTML Body Content */}
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FE3A18]/10 to-amber-500/10 border border-[#FE3A18]/25 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase text-[#FE3A18]">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Origem: {selectedEmailPreview.channel}</span>
                    </span>
                    <h3 className="text-lg font-black text-slate-900">
                      Você recebeu um novo contato para {selectedEmailPreview.businessName}!
                    </h3>
                    <p className="text-xs text-slate-600">
                      Recomendamos responder em até <strong>5 minutos</strong> para aumentar em até
                      3x a chance de fechamento em Sorocaba.
                    </p>
                  </div>
                </div>

                {/* Customer Lead Details Table */}
                <div className="rounded-2xl border border-slate-200 divide-y divide-slate-200 text-xs sm:text-sm">
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-2 font-semibold">
                      <User className="w-4 h-4 text-slate-400" />
                      Nome do Cliente:
                    </span>
                    <strong className="text-slate-900">{selectedEmailPreview.leadName}</strong>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-2 font-semibold">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      WhatsApp / Telefone:
                    </span>
                    <strong className="text-emerald-700 font-mono">
                      {selectedEmailPreview.leadPhone}
                    </strong>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-2 font-semibold">
                      <Mail className="w-4 h-4 text-slate-400" />
                      E-mail do Cliente:
                    </span>
                    <span className="text-slate-800 font-mono">
                      {selectedEmailPreview.leadEmail || 'Não informado'}
                    </span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-2 font-semibold">
                      <Clock className="w-4 h-4 text-slate-400" />
                      Serviço / Assunto:
                    </span>
                    <strong className="text-slate-900">
                      {selectedEmailPreview.serviceOrSubject}
                    </strong>
                  </div>
                  {selectedEmailPreview.couponUsed && (
                    <div className="p-3.5 flex items-center justify-between bg-amber-50/60">
                      <span className="text-amber-800 flex items-center gap-2 font-bold">
                        <Tag className="w-4 h-4 text-amber-600" />
                        Cupom Aplicado pelo Cliente:
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-xs">
                        {selectedEmailPreview.couponUsed}
                      </span>
                    </div>
                  )}
                </div>

                {/* Message Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Mensagem Enviada pelo Cliente:
                  </span>
                  <p className="text-sm text-slate-800 italic leading-relaxed">
                    "{selectedEmailPreview.message}"
                  </p>
                </div>

                {/* Action Button Inside Email */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <a
                    href={`https://wa.me/55${
                      selectedEmailPreview.leadPhone.replace(/\D/g, '') || '15999998888'
                    }?text=${encodeURIComponent(
                      `Olá ${selectedEmailPreview.leadName}! Recebemos seu contato enviado pelo GuiaPonto Sorocaba para ${selectedEmailPreview.businessName}. Como podemos ajudar?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Responder {selectedEmailPreview.leadName} no WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedEmailPreview(null)}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Fechar Preview do E-mail
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
