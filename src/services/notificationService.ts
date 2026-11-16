/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NotificationChannelType =
  | 'Botão de WhatsApp'
  | 'Formulário de WhatsApp'
  | 'Formulário da Landing Page';

export interface OwnerEmailNotificationRecord {
  id: string;
  businessName: string;
  ownerEmail: string;
  ccEmail?: string;
  channel: NotificationChannelType;
  leadName: string;
  leadPhone: string;
  leadEmail?: string;
  serviceOrSubject: string;
  message: string;
  couponUsed?: string;
  neighborhood?: string;
  contactDateIso: string;
  contactDateFormatted: string;
  emailSubject: string;
  emailHtmlPreview: string;
  smtpStatus: 'Entregue (250 OK)';
  dispatchedAt: string;
}

export interface OwnerEmailPreferences {
  ownerEmail: string;
  ccEmail: string;
  notifyOnWhatsAppForm: boolean;
  notifyOnLandingPageForm: boolean;
  includeDirectWhatsAppLink: boolean;
  includeAiLeadSummary: boolean;
}

export interface LeadNotificationParams {
  businessName: string;
  channel: NotificationChannelType;
  leadName: string;
  leadPhone: string;
  leadEmail?: string;
  serviceOrSubject?: string;
  message: string;
  couponUsed?: string;
  neighborhood?: string;
  ownerEmailOverride?: string;
  contactDate?: Date;
}

const EMAIL_LOG_STORAGE_KEY = 'guiaponto_owner_email_notifications';
const EMAIL_PREFS_STORAGE_KEY = 'guiaponto_owner_email_prefs';

const DEFAULT_EMAIL_PREFS: OwnerEmailPreferences = {
  ownerEmail: 'alexandre@guiaponto.com',
  ccEmail: 'comercial@saborefogo.com.br',
  notifyOnWhatsAppForm: true,
  notifyOnLandingPageForm: true,
  includeDirectWhatsAppLink: true,
  includeAiLeadSummary: true
};

/**
 * Directory mapping of Sorocaba business names to their respective owner emails.
 * Falls back to the configured ownerEmail in OwnerEmailPreferences.
 */
const BUSINESS_OWNER_EMAIL_DIRECTORY: Record<string, string> = {
  'restaurante sabor & fogo co.': 'alexandre@saborefogo.com.br',
  'restaurante sabor & fogo co': 'alexandre@saborefogo.com.br',
  'restaurante sabor & fogo': 'alexandre@saborefogo.com.br',
  'residencial sênior acolher': 'diretoria@residencialacolher.com.br',
  'imobiliária nova era prime': 'contato@novaeraprime.com.br',
  'oficina mecânica precision car': 'atendimento@precisioncar.com.br',
  'clínica odontológica sorriso prime': 'dra.camila@sorrisoprime.com.br',
  'advocacia & consultoria ribeiro': 'dr.ribeiro@ribeiroadvocacia.com.br',
  'padaria artesanal grão d’ouro': 'gerencia@graodouro.com.br',
  'pet care & hospital veterinário 24h': 'plantao@petcaresorocaba.com.br',
  'studio bella donna cabelo & estética': 'agenda@studiobelladonna.com.br',
  'contabilidade estratégica sorocaba': 'fiscal@contabilidadesorocaba.com.br',
  'empório da carne & parrilla': 'pedidos@emporiodacarne.com.br',
  'auto elétrica & baterias forte': 'socorro@bateriasforte.com.br',
  'villa moda & conceito sorocaba': 'estilo@villamodasorocaba.com.br',
  'climatech engenharia & manutenção': 'engenharia@climatechsorocaba.com.br',
  'quinta da serra gastronomia & eventos': 'reservas@quintadaserra.com.br',
  'solar de itu arquitetura & condomínios': 'projetos@solardeitu.com.br'
};

export function formatContactDatePtBr(date: Date = new Date()): string {
  const datePart = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const timePart = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  return `${datePart} às ${timePart}`;
}

export function resolveBusinessOwnerEmail(
  businessName: string,
  ownerEmailOverride?: string
): string {
  if (ownerEmailOverride && ownerEmailOverride.trim()) {
    return ownerEmailOverride.trim();
  }
  const prefs = getOwnerEmailPreferences();
  const normalized = (businessName || '').trim().toLowerCase();
  if (
    prefs.ownerEmail &&
    prefs.ownerEmail !== DEFAULT_EMAIL_PREFS.ownerEmail
  ) {
    return prefs.ownerEmail;
  }
  return (
    BUSINESS_OWNER_EMAIL_DIRECTORY[normalized] ||
    prefs.ownerEmail ||
    'alexandre@guiaponto.com'
  );
}

const INITIAL_SEED_EMAIL_LOGS: OwnerEmailNotificationRecord[] = [
  {
    id: 'email-seed-1',
    businessName: 'Restaurante Sabor & Fogo Co',
    ownerEmail: 'alexandre@guiaponto.com',
    ccEmail: 'comercial@saborefogo.com.br',
    channel: 'Formulário da Landing Page',
    leadName: 'Ricardo Almeida',
    leadPhone: '(15) 99124-8830',
    leadEmail: 'ricardo.almeida@sorocaba.br',
    serviceOrSubject: 'Reserva de Almoço Executivo (Grupo 6 pessoas)',
    message:
      'Olá! Vi a página de vocês no GuiaPonto Sorocaba e gostaria de agendar uma mesa para amanhã às 12h30.',
    couponUsed: 'SOROCABA15',
    neighborhood: 'Campolim, Sorocaba - SP',
    contactDateIso: new Date(Date.now() - 3600 * 1000).toISOString(),
    contactDateFormatted: formatContactDatePtBr(new Date(Date.now() - 3600 * 1000)),
    emailSubject:
      '🔔 [Novo Lead via Formulário da Landing Page] Ricardo Almeida entrou em contato com Restaurante Sabor & Fogo Co',
    emailHtmlPreview:
      'Novo orçamento recebido via Landing Page no GuiaPonto Sorocaba! Cliente Ricardo Almeida solicitou Reserva de Almoço Executivo com cupom SOROCABA15.',
    smtpStatus: 'Entregue (250 OK)',
    dispatchedAt: 'Hoje às 11:42'
  },
  {
    id: 'email-seed-2',
    businessName: 'Restaurante Sabor & Fogo Co',
    ownerEmail: 'alexandre@guiaponto.com',
    channel: 'Formulário de WhatsApp',
    leadName: 'Marcos Vinicius',
    leadPhone: '(15) 99711-4502',
    leadEmail: 'marcos.v@campolim.com.br',
    serviceOrSubject: 'Contato Rápido via Botão de WhatsApp',
    message:
      'Olá! Vi sua empresa no GuiaPonto e gostaria de confirmar se têm delivery para o Parque Campolim hoje.',
    neighborhood: 'Campolim, Sorocaba - SP',
    contactDateIso: new Date(Date.now() - 7200 * 1000).toISOString(),
    contactDateFormatted: formatContactDatePtBr(new Date(Date.now() - 7200 * 1000)),
    emailSubject:
      '🔔 [Novo Lead via Formulário de WhatsApp] Marcos Vinicius entrou em contato com Restaurante Sabor & Fogo Co',
    emailHtmlPreview:
      'Novo contato iniciado via Formulário de WhatsApp! Cliente Marcos Vinicius enviou mensagem pelo modal de WhatsApp da vitrine.',
    smtpStatus: 'Entregue (250 OK)',
    dispatchedAt: 'Hoje às 10:15'
  }
];

export function getOwnerEmailPreferences(): OwnerEmailPreferences {
  try {
    const raw = localStorage.getItem(EMAIL_PREFS_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_EMAIL_PREFS, ...JSON.parse(raw) };
    }
  } catch {
    // ignore storage errors
  }
  return DEFAULT_EMAIL_PREFS;
}

export function saveOwnerEmailPreferences(prefs: OwnerEmailPreferences): void {
  try {
    localStorage.setItem(EMAIL_PREFS_STORAGE_KEY, JSON.stringify(prefs));
    window.dispatchEvent(
      new CustomEvent('guiaponto-email-prefs-updated', { detail: prefs })
    );
  } catch {
    // ignore storage errors
  }
}

export function getStoredOwnerEmailLogs(): OwnerEmailNotificationRecord[] {
  try {
    const raw = localStorage.getItem(EMAIL_LOG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item: any) => ({
          ...item,
          contactDateIso: item.contactDateIso || new Date().toISOString(),
          contactDateFormatted:
            item.contactDateFormatted ||
            item.dispatchedAt ||
            formatContactDatePtBr(new Date())
        }));
      }
    }
  } catch {
    // ignore storage errors
  }
  return INITIAL_SEED_EMAIL_LOGS;
}

/**
 * Core Notification Service Utility:
 * Sends a simulated email to the business owner's email whenever a contact form
 * or WhatsApp button is triggered, including lead data and the exact contact date.
 */
export async function dispatchOwnerLeadEmailNotification(
  params: LeadNotificationParams
): Promise<OwnerEmailNotificationRecord | null> {
  const prefs = getOwnerEmailPreferences();

  // Check if owner has enabled notifications for this channel
  if (
    (params.channel === 'Formulário de WhatsApp' ||
      params.channel === 'Botão de WhatsApp') &&
    !prefs.notifyOnWhatsAppForm
  ) {
    return null;
  }
  if (
    params.channel === 'Formulário da Landing Page' &&
    !prefs.notifyOnLandingPageForm
  ) {
    return null;
  }

  const contactDate = params.contactDate || new Date();
  const contactDateIso = contactDate.toISOString();
  const contactDateFormatted = formatContactDatePtBr(contactDate);
  const nowStr = contactDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const recipientEmail = resolveBusinessOwnerEmail(
    params.businessName,
    params.ownerEmailOverride
  );

  const payload = {
    businessName: params.businessName || 'Empresa Parceira GuiaPonto',
    ownerEmail: recipientEmail,
    ccEmail: prefs.ccEmail,
    channel: params.channel,
    leadName: params.leadName || 'Cliente GuiaPonto Sorocaba',
    leadPhone: params.leadPhone || '(15) 99100-0000',
    leadEmail: params.leadEmail || 'Não informado',
    serviceOrSubject:
      params.serviceOrSubject || 'Interesse Comercial na Vitrine',
    message: params.message,
    couponUsed: params.couponUsed,
    neighborhood: params.neighborhood || 'Sorocaba - SP',
    contactDateIso,
    contactDateFormatted
  };

  const cleanDigits =
    String(payload.leadPhone).replace(/\D/g, '') || '5515999998888';
  const whatsappDirectUrl = `https://wa.me/${
    cleanDigits.startsWith('55') ? cleanDigits : `55${cleanDigits}`
  }`;

  const simulatedEmailBody = `Novo contato registrado no GuiaPonto Sorocaba!
• Data e Hora do Contato: ${contactDateFormatted}
• Empresa Destinatária: ${payload.businessName} (${payload.neighborhood})
• E-mail do Proprietário: ${payload.ownerEmail}
• Canal Acionado: ${payload.channel}
• Nome do Lead: ${payload.leadName}
• Telefone / WhatsApp: ${payload.leadPhone}
• E-mail do Lead: ${payload.leadEmail}
• Assunto / Serviço: ${payload.serviceOrSubject}
${payload.couponUsed ? `• Cupom Utilizado: ${payload.couponUsed}\n` : ''}• Mensagem do Lead: "${payload.message}"
• Responder via WhatsApp: ${whatsappDirectUrl}`;

  let createdRecord: OwnerEmailNotificationRecord = {
    id: `email-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    businessName: payload.businessName,
    ownerEmail: payload.ownerEmail,
    ccEmail: payload.ccEmail || undefined,
    channel: payload.channel,
    leadName: payload.leadName,
    leadPhone: payload.leadPhone,
    leadEmail: payload.leadEmail,
    serviceOrSubject: payload.serviceOrSubject,
    message: payload.message,
    couponUsed: payload.couponUsed,
    neighborhood: payload.neighborhood,
    contactDateIso,
    contactDateFormatted,
    emailSubject: `🔔 [Novo Lead via ${payload.channel}] ${payload.leadName} entrou em contato com ${payload.businessName} (${contactDateFormatted})`,
    emailHtmlPreview: simulatedEmailBody,
    smtpStatus: 'Entregue (250 OK)',
    dispatchedAt: `Agora (${nowStr})`
  };

  try {
    const res = await fetch('/api/notifications/lead-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.notification) {
        createdRecord = {
          ...createdRecord,
          ...data.notification,
          contactDateIso:
            data.notification.contactDateIso || createdRecord.contactDateIso,
          contactDateFormatted:
            data.notification.contactDateFormatted ||
            createdRecord.contactDateFormatted
        };
      }
    }
  } catch {
    // Fallback to local simulated record if offline
  }

  try {
    const currentLogs = getStoredOwnerEmailLogs();
    const updatedLogs = [createdRecord, ...currentLogs].slice(0, 40);
    localStorage.setItem(EMAIL_LOG_STORAGE_KEY, JSON.stringify(updatedLogs));
    window.dispatchEvent(
      new CustomEvent('guiaponto-email-notification-sent', {
        detail: createdRecord
      })
    );
  } catch {
    // ignore storage errors
  }

  return createdRecord;
}

/**
 * Helper triggered immediately when a user clicks any WhatsApp button across the platform.
 */
export async function notifyOwnerOnWhatsAppButtonClick(params: {
  businessName: string;
  leadName?: string;
  leadPhone?: string;
  leadEmail?: string;
  serviceOrSubject?: string;
  message?: string;
  neighborhood?: string;
}): Promise<OwnerEmailNotificationRecord | null> {
  return dispatchOwnerLeadEmailNotification({
    businessName: params.businessName,
    channel: 'Botão de WhatsApp',
    leadName: params.leadName || 'Visitante via Botão de WhatsApp',
    leadPhone: params.leadPhone || '(15) 99100-0000',
    leadEmail: params.leadEmail || 'Capturado via Clique WhatsApp',
    serviceOrSubject:
      params.serviceOrSubject || 'Acionamento Direto do Botão de WhatsApp',
    message:
      params.message ||
      `Cliente acionou o botão de WhatsApp de ${params.businessName} no GuiaPonto Sorocaba.`,
    neighborhood: params.neighborhood || 'Sorocaba - SP',
    contactDate: new Date()
  });
}

/**
 * Helper triggered when a user submits a contact form or WhatsApp lead modal.
 */
export async function notifyOwnerOnContactFormSubmit(
  params: Omit<LeadNotificationParams, 'channel'> & {
    channel?: NotificationChannelType;
  }
): Promise<OwnerEmailNotificationRecord | null> {
  return dispatchOwnerLeadEmailNotification({
    ...params,
    channel: params.channel || 'Formulário da Landing Page',
    contactDate: params.contactDate || new Date()
  });
}
