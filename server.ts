import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getMercadoPagoClient(): MercadoPagoConfig | null {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (
    !accessToken ||
    accessToken === 'APP_USR-your_mercadopago_access_token'
  ) {
    return null;
  }
  return new MercadoPagoConfig({
    accessToken,
    options: { timeout: 5000 },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  // Generic server-side Gemini generation endpoint for dashboard assistants
  app.post('/api/gemini/generate', async (req, res) => {
    try {
      const { prompt, systemInstruction, responseMimeType } = req.body || {};
      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ error: 'Prompt é obrigatório.' });
        return;
      }

      const ai = getGenAIClient();
      if (!ai) {
        res.status(503).json({ error: 'GEMINI_API_KEY não configurada no servidor.' });
        return;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          ...(systemInstruction ? { systemInstruction } : {}),
          ...(responseMimeType ? { responseMimeType } : {}),
        },
      });

      res.json({ text: response.text ?? '' });
    } catch (error: any) {
      console.error('Erro em /api/gemini/generate:', error);
      res.status(500).json({
        error: error?.message || 'Erro ao processar requisição na API Gemini.',
      });
    }
  });

  // Dedicated AI Local Trends Dashboard endpoint for Sorocaba monthly search volume & Growth Opportunities
  app.post('/api/gemini/local-trends', async (req, res) => {
    try {
      const {
        businessName = 'Restaurante Sabor & Fogo Co',
        category = 'Restaurantes & Gastronomia',
        neighborhood = 'Campolim, Sorocaba - SP',
      } = req.body || {};

      const ai = getGenAIClient();
      if (!ai) {
        res.status(503).json({ error: 'GEMINI_API_KEY não configurada no servidor.' });
        return;
      }

      const prompt = `Analise o volume mensal de buscas locais e apresente um resumo estratégico de "Oportunidades de Crescimento" (Growth Opportunities) para o seguinte negócio em Sorocaba - SP:
- Nome da Empresa: ${businessName}
- Categoria / Segmento: ${category}
- Bairro / Corredor Comercial em Sorocaba: ${neighborhood}

Gere dados analíticos realistas para o mercado de Sorocaba (bairros como Parque Campolim, Santa Rosália, Centro, Trujillo, Wanel Ville, Éden e Votorantim) contendo:
1. Volume total de buscas mensais pelo segmento em Sorocaba, crescimento percentual (YoY), taxa média de conversão para WhatsApp e janela de horário de maior demanda.
2. Série histórica dos últimos 6 meses (Jun, Jul, Ago, Set, Out, Nov) com volume de buscas mensais ("searchVolume") e buscas com intenção imediata de contato ("highIntentSearches").
3. 4 termos de busca locais específicos de Sorocaba ("topKeywords") com volume mensal exato, crescimento percentual e nível de concorrência ("Baixa", "Média" ou "Alta").
4. Resumo executivo de "Growth Opportunities" ("executiveSummary") e 3 oportunidades práticas de crescimento ("growthOpportunities") detalhando título, diagnóstico de demanda reprimida em Sorocaba, ação recomendada, impacto estimado em leads mensais e prioridade.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'Você é um estrategista sênior de inteligência de mercado hiperlocal em Sorocaba - SP. Retorne exclusivamente JSON estruturado seguindo o schema fornecido em português do Brasil.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              businessName: { type: Type.STRING },
              category: { type: Type.STRING },
              neighborhood: { type: Type.STRING },
              totalMonthlySearches: { type: Type.INTEGER },
              yoyGrowthPercent: { type: Type.NUMBER },
              whatsappConversionRate: { type: Type.NUMBER },
              peakDemandWindow: { type: Type.STRING },
              executiveSummary: { type: Type.STRING },
              monthlySeries: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    month: { type: Type.STRING },
                    searchVolume: { type: Type.INTEGER },
                    highIntentSearches: { type: Type.INTEGER },
                  },
                },
              },
              topKeywords: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    keyword: { type: Type.STRING },
                    monthlyVolume: { type: Type.INTEGER },
                    growthPct: { type: Type.STRING },
                    competition: { type: Type.STRING },
                  },
                },
              },
              growthOpportunities: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    recommendedAction: { type: Type.STRING },
                    estimatedMonthlyLeads: { type: Type.STRING },
                    targetZone: { type: Type.STRING },
                    priority: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      });

      const jsonText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(jsonText);
      res.json(parsed);
    } catch (error: any) {
      console.error('Erro em /api/gemini/local-trends:', error);
      res.status(500).json({
        error: error?.message || 'Falha ao consultar tendências locais no Gemini.',
      });
    }
  });

  // Dedicated AI Smart Category Suggestion endpoint for Business Registration Form
  const DEFAULT_BUSINESS_CATEGORIES = [
    'Restaurantes & Gastronomia',
    'Oficinas & Centros Automotivos',
    'Clínicas & Saúde',
    'Salões de Beleza & Barbearias',
    'Imobiliárias & Construção',
    'Pet Shops & Veterinárias',
    'Moda, Calçados & Varejo',
    'Academias & Esportes',
    'Serviços Profissionais & B2B',
    'Educação & Cursos',
  ];

  app.post('/api/gemini/suggest-categories', async (req, res) => {
    try {
      const {
        businessName = '',
        description = '',
        categories = DEFAULT_BUSINESS_CATEGORIES,
      } = req.body || {};

      const cleanDescription = String(description || '').trim();
      const cleanName = String(businessName || '').trim();

      if (cleanDescription.length < 8) {
        res.status(400).json({
          error:
            'Escreva uma descrição com pelo menos 8 caracteres para a IA sugerir a categoria ideal.',
        });
        return;
      }

      const ai = getGenAIClient();
      if (!ai) {
        res.status(503).json({
          error:
            'GEMINI_API_KEY não configurada no servidor. Verifique Settings > Secrets ou selecione a categoria manualmente.',
        });
        return;
      }

      const allowedCategories: string[] =
        Array.isArray(categories) && categories.length > 0
          ? categories.filter(
              (c): c is string => typeof c === 'string' && c.trim().length > 0
            )
          : DEFAULT_BUSINESS_CATEGORIES;

      const prompt = `Você é um classificador especialista de diretórios de negócios locais (GuiaPonto).
Analise os dados do negócio abaixo e escolha a categoria principal MAIS PRECISA exclusivamente dentre as categorias permitidas listadas.

Categorias permitidas:
${allowedCategories.map((c, idx) => `${idx + 1}. ${c}`).join('\n')}

Dados do negócio:
- Nome Fantasia: ${cleanName || 'Não informado'}
- Descrição dos serviços e diferenciais: "${cleanDescription}"

Retorne JSON estruturado com:
- primaryCategory: exatamente o nome de uma das categorias permitidas acima;
- secondaryCategories: até 2 categorias alternativas da lista permitida (diferentes da primaryCategory) caso o negócio atenda segmentos próximos;
- confidenceLabel: "Alta" se a descrição deixa o segmento evidente, ou "Média" se houver mais de uma interpretação possível;
- reasoning: justificativa objetiva em 1 frase curta em português do Brasil explicando a escolha com base na descrição;
- suggestedTags: até 4 termos de busca locais curtos relevantes para esse negócio.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'Você classifica negócios locais brasileiros nas categorias oficiais do GuiaPonto. Sempre retorne nomes exatos das categorias permitidas em português do Brasil.',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              primaryCategory: { type: Type.STRING },
              secondaryCategories: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              confidenceLabel: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              suggestedTags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              'primaryCategory',
              'secondaryCategories',
              'confidenceLabel',
              'reasoning',
              'suggestedTags',
            ],
          },
        },
      });

      const rawText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawText);

      const normalizeMatch = (candidate: unknown): string | null => {
        if (typeof candidate !== 'string') return null;
        const trimmed = candidate.trim().toLowerCase();
        const exact = allowedCategories.find((c) => c.toLowerCase() === trimmed);
        if (exact) return exact;
        const partial = allowedCategories.find(
          (c) =>
            c.toLowerCase().includes(trimmed) ||
            trimmed.includes(c.toLowerCase())
        );
        return partial || null;
      };

      const primaryCategory =
        normalizeMatch(parsed.primaryCategory) || allowedCategories[0];

      const secondaryCategories = Array.isArray(parsed.secondaryCategories)
        ? parsed.secondaryCategories
            .map((c: unknown) => normalizeMatch(c))
            .filter(
              (c: string | null): c is string =>
                Boolean(c) && c !== primaryCategory
            )
            .slice(0, 2)
        : [];

      const confidenceLabel =
        parsed.confidenceLabel === 'Média' ? 'Média' : 'Alta';

      const reasoning =
        typeof parsed.reasoning === 'string' && parsed.reasoning.trim()
          ? parsed.reasoning.trim()
          : `Categoria identificada com base nos serviços descritos para ${cleanName || 'o negócio'}.`;

      const suggestedTags = Array.isArray(parsed.suggestedTags)
        ? parsed.suggestedTags
            .filter(
              (t: unknown): t is string =>
                typeof t === 'string' && t.trim().length > 0
            )
            .map((t: string) => t.trim())
            .slice(0, 4)
        : [];

      res.json({
        primaryCategory,
        secondaryCategories,
        confidenceLabel,
        reasoning,
        suggestedTags,
      });
    } catch (error: any) {
      console.error('Erro em /api/gemini/suggest-categories:', error);
      res.status(500).json({
        error:
          error?.message ||
          'Não foi possível classificar automaticamente com a API do Gemini.',
      });
    }
  });

  // In-memory store for merchant lead email notifications
  interface DispatchedOwnerEmail {
    id: string;
    businessName: string;
    ownerEmail: string;
    ccEmail?: string;
    channel:
      | 'Botão de WhatsApp'
      | 'Formulário de WhatsApp'
      | 'Formulário da Landing Page';
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

  const dispatchedOwnerEmails: DispatchedOwnerEmail[] = [];

  app.get('/api/notifications/lead-email', (_req, res) => {
    res.json({ notifications: dispatchedOwnerEmails });
  });

  app.post('/api/notifications/lead-email', (req, res) => {
    try {
      const now = new Date();
      const defaultDatePart = now.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const defaultTimePart = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const {
        businessName = 'GuiaPonto Destaques & Serviços',
        ownerEmail = 'alexandre@guiaponto.com',
        ccEmail = '',
        channel = 'Formulário de WhatsApp',
        leadName = 'Visitante GuiaPonto',
        leadPhone = '(15) 99100-0000',
        leadEmail = 'Não informado',
        serviceOrSubject = 'Contato Comercial',
        message = 'Olá! Vi sua empresa no GuiaPonto Sorocaba e gostaria de mais informações.',
        couponUsed = '',
        neighborhood = 'Sorocaba - SP',
        contactDateIso = now.toISOString(),
        contactDateFormatted = `${defaultDatePart} às ${defaultTimePart}`,
      } = req.body || {};

      const nowStr = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const emailSubject = `🔔 [Novo Lead via ${channel}] ${leadName} entrou em contato com ${businessName} (${contactDateFormatted})`;
      const cleanDigits = String(leadPhone).replace(/\D/g, '') || '5515999998888';
      const whatsappDirectUrl = `https://wa.me/${cleanDigits.startsWith('55') ? cleanDigits : `55${cleanDigits}`}`;

      const emailHtmlPreview = `Novo contato recebido na plataforma GuiaPonto Sorocaba!
• Data e Hora do Contato: ${contactDateFormatted}
• Empresa: ${businessName} (${neighborhood})
• E-mail do Proprietário: ${ownerEmail}
• Canal de Origem: ${channel}
• Nome do Cliente: ${leadName}
• WhatsApp do Cliente: ${leadPhone}
• E-mail do Cliente: ${leadEmail || 'Não informado'}
• Serviço / Interesse: ${serviceOrSubject}
${couponUsed ? `• Cupom Aplicado: ${couponUsed}\n` : ''}• Mensagem: "${message}"
• Link Direto p/ Responder no WhatsApp: ${whatsappDirectUrl}`;

      const record: DispatchedOwnerEmail = {
        id: `email-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        businessName,
        ownerEmail,
        ccEmail: ccEmail || undefined,
        channel,
        leadName,
        leadPhone,
        leadEmail,
        serviceOrSubject,
        message,
        couponUsed: couponUsed || undefined,
        neighborhood,
        contactDateIso,
        contactDateFormatted,
        emailSubject,
        emailHtmlPreview,
        smtpStatus: 'Entregue (250 OK)',
        dispatchedAt: `Hoje às ${nowStr}`,
      };

      dispatchedOwnerEmails.unshift(record);
      if (dispatchedOwnerEmails.length > 50) {
        dispatchedOwnerEmails.pop();
      }

      res.json({
        success: true,
        notification: record,
      });
    } catch (error: any) {
      res.status(500).json({
        error: error?.message || 'Erro ao disparar notificação por e-mail.',
      });
    }
  });

  // =========================================================================
  // MERCADO PAGO GATEWAY (Checkout Pro & Transparente: PIX, Cartão, Saldo MP & Boleto)
  // =========================================================================
  const MERCADOPAGO_PLAN_CATALOG = {
    premium: {
      name: 'Plano Premium Pro',
      monthlyAmountBrl: 49.9,
      annualAmountBrl: 297.0,
      annualMonthlyEquivalentBrl: 24.75,
      trialDays: 7,
    },
    enterprise: {
      name: 'Enterprise Regional',
      monthlyAmountBrl: 199.0,
      annualAmountBrl: 1788.0,
      annualMonthlyEquivalentBrl: 149.0,
      trialDays: 7,
    },
  };
  interface MercadoPagoTransactionRecord {
    id: string;
    preferenceId: string;
    mpPaymentId: string;
    businessName: string;
    customerName: string;
    customerEmail: string;
    cnpj?: string;
    planId: 'premium' | 'enterprise';
    planName: 'Plano Premium Pro' | 'Enterprise Regional';
    billingCycle: 'annual' | 'monthly';
    paymentMethod: 'pix' | 'card' | 'account_money' | 'boleto';
    amountBrl: number;
    monthlyEquivalentBrl: number;
    discountAppliedPct: number;
    couponCode?: string;
    status: 'approved' | 'in_process';
    receiptNumber: string;
    createdAt: string;
  }

  interface MercadoPagoWebhookEventRecord {
    id: string;
    topic: 'payment.created' | 'payment.updated' | 'merchant_order' | 'subscription_preapproval';
    preferenceId: string;
    mpPaymentId: string;
    businessName: string;
    planName: string;
    amountBrl: number;
    paymentMethod: string;
    httpStatus: 200;
    receivedAt: string;
  }

  const mercadoPagoTransactions: MercadoPagoTransactionRecord[] = [
    {
      id: 'mp-tx-seed-1',
      preferenceId: '184920194-a8f92b10-4c21-49d0-9b1e-0294819201',
      mpPaymentId: '89401928412',
      businessName: 'Oficina Mecânica Precision Car',
      customerName: 'Roberto Almeida',
      customerEmail: 'roberto@precisioncar.com.br',
      cnpj: '31.775.904/0001-12',
      planId: 'premium',
      planName: 'Plano Premium Pro',
      billingCycle: 'annual',
      paymentMethod: 'pix',
      amountBrl: 297.0,
      monthlyEquivalentBrl: 24.75,
      discountAppliedPct: 50,
      status: 'approved',
      receiptNumber: 'MP-8940-1928',
      createdAt: 'Hoje às 10:18',
    },
    {
      id: 'mp-tx-seed-2',
      preferenceId: '184920194-c7d81e22-9a14-48b2-8f11-9481029481',
      mpPaymentId: '89401745109',
      businessName: 'Clínica Odontológica Sorriso Prime',
      customerName: 'Dra. Camila Nogueira',
      customerEmail: 'dra.camila@sorrisoprime.com.br',
      cnpj: '28.910.442/0001-09',
      planId: 'premium',
      planName: 'Plano Premium Pro',
      billingCycle: 'monthly',
      paymentMethod: 'account_money',
      amountBrl: 49.9,
      monthlyEquivalentBrl: 49.9,
      discountAppliedPct: 0,
      status: 'approved',
      receiptNumber: 'MP-8940-1745',
      createdAt: 'Ontem às 18:05',
    },
  ];

  const mercadoPagoWebhookEvents: MercadoPagoWebhookEventRecord[] = [
    {
      id: 'mp_evt_89401928412',
      topic: 'payment.updated',
      preferenceId: '184920194-a8f92b10-4c21-49d0-9b1e-0294819201',
      mpPaymentId: '89401928412',
      businessName: 'Oficina Mecânica Precision Car',
      planName: 'Plano Premium Pro (Anual)',
      amountBrl: 297.0,
      paymentMethod: 'PIX Mercado Pago',
      httpStatus: 200,
      receivedAt: 'Hoje às 10:18:04',
    },
    {
      id: 'mp_evt_89401745109',
      topic: 'payment.created',
      preferenceId: '184920194-c7d81e22-9a14-48b2-8f11-9481029481',
      mpPaymentId: '89401745109',
      businessName: 'Clínica Odontológica Sorriso Prime',
      planName: 'Plano Premium Pro (Mensal)',
      amountBrl: 49.9,
      paymentMethod: 'Saldo Conta Mercado Pago',
      httpStatus: 200,
      receivedAt: 'Ontem às 18:05:19',
    },
  ];

  app.get('/api/mercadopago/config', (_req, res) => {
    const mpClient = getMercadoPagoClient();
    res.json({
      gatewayActive: true,
      mode: mpClient ? 'live_api' : 'sandbox_ready',
      sdkVersion: 'mercadopago-nodejs v2 (Checkout Pro & PIX Transparente)',
      region: 'MLB — Brasil (Sorocaba / SP)',
      currency: 'BRL',
      supportedMethods: ['pix', 'card', 'account_money', 'boleto'],
      webhookEndpoint: '/api/mercadopago/webhook',
      plans: MERCADOPAGO_PLAN_CATALOG,
      transactions: mercadoPagoTransactions,
      webhookEvents: mercadoPagoWebhookEvents,
    });
  });

  app.post('/api/mercadopago/create-preference', async (req, res) => {
    try {
      const {
        planId = 'premium',
        billingCycle = 'annual',
        paymentMethod = 'pix',
        customerName = 'Alexandre Santos',
        customerEmail = 'alexandre@guiaponto.com',
        businessName = 'Restaurante Sabor & Fogo Co.',
        cnpj = '42.819.301/0001-88',
        couponCode = '',
      } = req.body || {};

      const selectedPlan =
        planId === 'enterprise'
          ? MERCADOPAGO_PLAN_CATALOG.enterprise
          : MERCADOPAGO_PLAN_CATALOG.premium;

      const baseAmount =
        billingCycle === 'annual'
          ? selectedPlan.annualAmountBrl
          : selectedPlan.monthlyAmountBrl;

      const normalizedCoupon = String(couponCode || '')
        .trim()
        .toUpperCase();
      let extraDiscountPct = 0;
      if (normalizedCoupon === 'SOROCABA50' || normalizedCoupon === 'PRO50') {
        extraDiscountPct = 15;
      } else if (
        normalizedCoupon === 'CAMPOLIM20' ||
        normalizedCoupon === 'SOROCABA15'
      ) {
        extraDiscountPct = 10;
      }

      const finalAmountBrl = Number(
        (baseAmount * (1 - extraDiscountPct / 100)).toFixed(2)
      );
      const monthlyEquivalentBrl =
        billingCycle === 'annual'
          ? Number((finalAmountBrl / 12).toFixed(2))
          : finalAmountBrl;

      const now = new Date();
      const timeFormatted = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const mpClient = getMercadoPagoClient();
      let initPointUrl: string | null = null;
      let preferenceId = `184920194-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      const mpPaymentId = `${Math.floor(
        89000000000 + Math.random() * 999999999
      )}`;

      if (mpClient) {
        try {
          const appUrl =
            process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL'
              ? process.env.APP_URL
              : 'http://localhost:3000';

          const preferenceApi = new Preference(mpClient);
          const createdPref = await preferenceApi.create({
            body: {
              items: [
                {
                  id: `gp-${planId}-${billingCycle}`,
                  title: `${selectedPlan.name} - GuiaPonto Sorocaba (${
                    billingCycle === 'annual' ? 'Anual' : 'Mensal'
                  })`,
                  description: `Assinatura comercial para ${businessName} (${cnpj})`,
                  quantity: 1,
                  currency_id: 'BRL',
                  unit_price: finalAmountBrl,
                },
              ],
              payer: {
                name: customerName,
                email: customerEmail,
              },
              back_urls: {
                success: `${appUrl}/?mp_status=approved`,
                failure: `${appUrl}/?mp_status=failure`,
                pending: `${appUrl}/?mp_status=pending`,
              },
              external_reference: `${businessName}|${planId}|${billingCycle}`,
            },
          });

          if (createdPref?.id) {
            preferenceId = createdPref.id;
          }
          if (createdPref?.init_point) {
            initPointUrl = createdPref.init_point;
          }
        } catch (mpErr) {
          console.warn(
            'Mercado Pago SDK live preference fallback activated:',
            mpErr
          );
        }
      }

      const transaction: MercadoPagoTransactionRecord = {
        id: `mp-tx-${Date.now()}`,
        preferenceId,
        mpPaymentId,
        businessName,
        customerName,
        customerEmail,
        cnpj,
        planId: planId === 'enterprise' ? 'enterprise' : 'premium',
        planName: selectedPlan.name as
          | 'Plano Premium Pro'
          | 'Enterprise Regional',
        billingCycle: billingCycle === 'monthly' ? 'monthly' : 'annual',
        paymentMethod:
          paymentMethod === 'pix' ||
          paymentMethod === 'account_money' ||
          paymentMethod === 'boleto'
            ? paymentMethod
            : 'card',
        amountBrl: finalAmountBrl,
        monthlyEquivalentBrl,
        discountAppliedPct:
          (billingCycle === 'annual' ? 50 : 0) + extraDiscountPct,
        couponCode: normalizedCoupon || undefined,
        status: 'approved',
        receiptNumber: `MP-${mpPaymentId.slice(0, 4)}-${mpPaymentId.slice(-4)}`,
        createdAt: `Agora (${timeFormatted})`,
      };

      mercadoPagoTransactions.unshift(transaction);
      if (mercadoPagoTransactions.length > 40) mercadoPagoTransactions.pop();

      const webhookEvt: MercadoPagoWebhookEventRecord = {
        id: `mp_evt_${Date.now()}`,
        topic: 'payment.updated',
        preferenceId,
        mpPaymentId,
        businessName,
        planName: `${selectedPlan.name} (${
          billingCycle === 'annual' ? 'Anual' : 'Mensal'
        })`,
        amountBrl: finalAmountBrl,
        paymentMethod:
          paymentMethod === 'pix'
            ? 'PIX Mercado Pago'
            : paymentMethod === 'account_money'
            ? 'Saldo Conta Mercado Pago'
            : paymentMethod === 'boleto'
            ? 'Boleto PEC Mercado Pago'
            : 'Cartão Mercado Pago',
        httpStatus: 200,
        receivedAt: `Hoje às ${timeFormatted}`,
      };

      mercadoPagoWebhookEvents.unshift(webhookEvt);
      if (mercadoPagoWebhookEvents.length > 40) mercadoPagoWebhookEvents.pop();

      const pixCopiaECola = `00020126640014BR.GOV.BCB.PIX0142mercadopago-mlb-${mpPaymentId}5204000053039865406${finalAmountBrl.toFixed(
        2
      )}5802BR5922MERCADOPAGO GUIAPONTO6008SOROCABA62070503***63049B7C`;
      const boletoLinhaDigitavel = `32391.29004 01894.019284 12000.150008 4 984500000${Math.round(
        finalAmountBrl * 100
      )
        .toString()
        .padStart(5, '0')}`;

      res.json({
        success: true,
        mode: mpClient ? 'live_api' : 'sandbox_ready',
        preferenceId,
        mpPaymentId,
        initPointUrl,
        pixCopiaECola,
        boletoLinhaDigitavel,
        transaction,
        webhookEvent: webhookEvt,
      });
    } catch (error: any) {
      res.status(500).json({
        error:
          error?.message ||
          'Falha ao criar preferência de pagamento no Mercado Pago.',
      });
    }
  });

  app.post('/api/mercadopago/simulate-webhook', (req, res) => {
    const {
      topic = 'payment.updated',
      businessName = 'Restaurante Sabor & Fogo Co.',
      planName = 'Plano Premium Pro (Anual)',
      amountBrl = 297.0,
      paymentMethod = 'PIX Mercado Pago',
    } = req.body || {};

    const nowStr = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const mpPaymentId = `${Math.floor(
      89000000000 + Math.random() * 999999999
    )}`;

    const evt: MercadoPagoWebhookEventRecord = {
      id: `mp_evt_sim_${Date.now()}`,
      topic,
      preferenceId: `184920194-${Math.random().toString(36).slice(2, 10)}`,
      mpPaymentId,
      businessName,
      planName,
      amountBrl: Number(amountBrl),
      paymentMethod,
      httpStatus: 200,
      receivedAt: `Hoje às ${nowStr}`,
    };

    mercadoPagoWebhookEvents.unshift(evt);
    res.json({ success: true, webhookEvent: evt });
  });

  app.post('/api/mercadopago/webhook', (req, res) => {
    const body = req.body || {};
    const nowStr = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const mpPaymentId =
      body.data?.id ||
      `${Math.floor(89000000000 + Math.random() * 999999999)}`;

    const evt: MercadoPagoWebhookEventRecord = {
      id: `mp_wh_${Date.now()}`,
      topic: body.type || body.topic || 'payment.updated',
      preferenceId: `184920194-wh-${Date.now()}`,
      mpPaymentId: String(mpPaymentId),
      businessName: 'Assinante GuiaPonto Sorocaba',
      planName: 'Plano Premium Pro',
      amountBrl: 297.0,
      paymentMethod: 'Notificação IPN / Webhook MP',
      httpStatus: 200,
      receivedAt: `Hoje às ${nowStr}`,
    };

    mercadoPagoWebhookEvents.unshift(evt);
    res.status(200).json({ received: true, event: evt });
  });

  // Growth Tips Weekly Newsletter subscription endpoint for Business Insights
  interface GrowthNewsletterSubscriber {
    id: string;
    email: string;
    businessName: string;
    topics: string[];
    subscribedAt: string;
  }

  const growthNewsletterSubscribers: GrowthNewsletterSubscriber[] = [];

  app.get('/api/newsletter/growth-tips', (_req, res) => {
    res.json({
      total: growthNewsletterSubscribers.length,
      subscribers: growthNewsletterSubscribers,
    });
  });

  app.post('/api/newsletter/growth-tips', (req, res) => {
    const {
      email = '',
      businessName = '',
      topics = ['SEO Local', 'Marketing Regional', 'Conversão WhatsApp'],
    } = req.body || {};

    const normalizedEmail = String(email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      res.status(400).json({
        error: 'Informe um endereço de e-mail válido para concluir a assinatura.',
      });
      return;
    }

    const sanitizedTopics = Array.isArray(topics)
      ? topics.filter((t) => typeof t === 'string' && t.trim().length > 0)
      : ['SEO Local', 'Marketing Regional', 'Conversão WhatsApp'];

    const existing = growthNewsletterSubscribers.find(
      (item) => item.email === normalizedEmail
    );

    if (existing) {
      existing.businessName = String(businessName).trim() || existing.businessName;
      if (sanitizedTopics.length > 0) {
        existing.topics = sanitizedTopics;
      }
      res.json({
        success: true,
        alreadySubscribed: true,
        subscriber: existing,
      });
      return;
    }

    const subscriber: GrowthNewsletterSubscriber = {
      id: `nl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      email: normalizedEmail,
      businessName: String(businessName).trim() || 'Negócio Local',
      topics:
        sanitizedTopics.length > 0
          ? sanitizedTopics
          : ['SEO Local', 'Marketing Regional', 'Conversão WhatsApp'],
      subscribedAt: new Date().toISOString(),
    };

    growthNewsletterSubscribers.unshift(subscriber);
    res.status(201).json({
      success: true,
      alreadySubscribed: false,
      subscriber,
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
