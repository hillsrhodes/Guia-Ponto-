/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Megaphone, 
  BarChart3, 
  Settings, 
  Plus, 
  Search, 
  Trash2, 
  PauseCircle, 
  PlayCircle, 
  MousePointerClick, 
  TrendingUp, 
  CheckCircle2, 
  X, 
  Menu,
  Upload, 
  ArrowLeft,
  Sparkles,
  Bot,
  User,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Phone,
  Edit3,
  Camera,
  Save,
  Check,
  Award,
  Trophy,
  Star,
  Bell,
  Download,
  Clock,
  Calendar,
  Zap,
  Sun,
  Moon,
  Users,
  MapPin,
  Globe,
  DollarSign,
  Calculator,
  Copy,
  ExternalLink,
  Sliders,
  CheckCheck,
  Video,
  Play,
  Film,
  Share2,
  Eye,
  Flame,
  Target,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  GripVertical,
  Layers,
  Mail,
  Send
} from 'lucide-react';
import { AdminVideoSpotlight } from './AdminVideoSpotlight';
import { ReviewManagementSection } from './ReviewManagementSection';
import { EncryptedBackupManager } from './EncryptedBackupManager';
import { BadgeShowcase } from './BadgeShowcase';
import { ReferLocalBusinessProgram } from './ReferLocalBusinessProgram';
import { AILocalTrendsDashboard } from './AILocalTrendsDashboard';
import { AchievementCelebration, triggerAchievementCelebration } from './AchievementCelebration';
import { MonetizationStrategyHub } from './MonetizationStrategyHub';
import { SorocabaGrowthHeatmap } from './SorocabaGrowthHeatmap';
import {
  MerchantEmailNotificationHub,
  dispatchOwnerLeadEmailNotification
} from './MerchantEmailNotificationHub';
import { WhatsAppConversionChartsPanel } from './WhatsAppConversionChartsPanel';

export interface CalendarSlotSchedule {
  id: string;
  adId: string;
  adTitle: string;
  adCategory: string;
  day: 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sáb' | 'Dom';
  timeSlotId: string; // 'morning', 'lunch', 'afternoon', 'dinner', 'night'
  boostMultiplier: string;
  status: 'Ativo' | 'Pausado';
  expectedClicks: number;
}

export interface HighTrafficTimeSlotDef {
  id: string;
  name: string;
  hours: string;
  trafficIntensity: 'Ultra Alto' | 'Alto' | 'Médio-Alto';
  trafficIndex: number;
  badge: string;
  description: string;
  suggestedBoost: string;
  isPeak: boolean;
  accentColor: string;
}

export const HIGH_TRAFFIC_TIME_SLOTS: HighTrafficTimeSlotDef[] = [
  {
    id: 'morning',
    name: 'Manhã & Abertura Comercial',
    hours: '07:30 - 09:30',
    trafficIntensity: 'Alto',
    trafficIndex: 78,
    badge: 'Comercial',
    description: 'A caminho do trabalho e buscas matinais por serviços locais',
    suggestedBoost: '+20% Lance IA',
    isPeak: false,
    accentColor: 'from-blue-500/20 to-sky-500/10 border-blue-500/30 text-blue-300'
  },
  {
    id: 'lunch',
    name: 'Pico de Almoço Executivo',
    hours: '11:30 - 14:00',
    trafficIntensity: 'Ultra Alto',
    trafficIndex: 96,
    badge: '🔥 Pico Máximo (+85%)',
    description: 'Decisão de almoço, delivery rápido e reuniões executivas',
    suggestedBoost: '+35% Lance IA',
    isPeak: true,
    accentColor: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-300'
  },
  {
    id: 'afternoon',
    name: 'Tarde Comercial & Serviços',
    hours: '14:30 - 17:00',
    trafficIntensity: 'Médio-Alto',
    trafficIndex: 72,
    badge: 'Comercial',
    description: 'Pesquisas de serviços, agendamentos e orçamentos no WhatsApp',
    suggestedBoost: '+15% Lance IA',
    isPeak: false,
    accentColor: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-300'
  },
  {
    id: 'dinner',
    name: 'Pico Noturno & Happy Hour',
    hours: '18:00 - 20:30',
    trafficIntensity: 'Ultra Alto',
    trafficIndex: 94,
    badge: '🔥 Pico Máximo (+90%)',
    description: 'Volta do trabalho, lazer, jantares e reservas imediatas',
    suggestedBoost: '+40% Lance IA',
    isPeak: true,
    accentColor: 'from-rose-500/20 to-[#FE3A18]/10 border-rose-500/40 text-rose-300'
  },
  {
    id: 'night',
    name: 'Lazer Noturno & Fechamento',
    hours: '20:30 - 23:00',
    trafficIntensity: 'Alto',
    trafficIndex: 82,
    badge: 'Noturno',
    description: 'Pedidos de entrega noturna e agendamentos para o dia seguinte',
    suggestedBoost: '+25% Lance IA',
    isPeak: false,
    accentColor: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300'
  }
];

export const CALENDAR_DAYS: Array<{ id: 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sáb' | 'Dom'; label: string; full: string }> = [
  { id: 'Seg', label: 'Seg', full: 'Segunda-feira' },
  { id: 'Ter', label: 'Ter', full: 'Terça-feira' },
  { id: 'Qua', label: 'Qua', full: 'Quarta-feira' },
  { id: 'Qui', label: 'Qui', full: 'Quinta-feira' },
  { id: 'Sex', label: 'Sex', full: 'Sexta-feira' },
  { id: 'Sáb', label: 'Sáb', full: 'Sábado' },
  { id: 'Dom', label: 'Dom', full: 'Domingo' }
];

export interface IndustryTrendTip {
  id: string;
  title: string;
  action: string;
  impact: string;
  impactType: 'high' | 'conversion' | 'lead';
  suggestedTweak: string;
}

export interface IndustryTrendsResult {
  category: string;
  location: string;
  demandScore: number;
  demandTrend: string;
  sentiment: string;
  trendingKeywords: string[];
  actionableTips: IndustryTrendTip[];
  suggestedHeadline: string;
  suggestedDescription: string;
  suggestedCta: string;
  bestPostingHours: string;
  marketSummary: string;
}

function generateSimulatedIndustryTrends(category: string, location: string): IndustryTrendsResult {
  const loc = location || 'Campolim, Sorocaba - SP';
  const cat = (category || 'Restaurantes & Gastronomia').toLowerCase();

  if (cat.includes('restaurante') || cat.includes('gastronomia') || cat.includes('comida') || cat.includes('culinária')) {
    return {
      category: 'Restaurantes & Gastronomia',
      location: loc,
      demandScore: 94,
      demandTrend: 'Alta Demanda (+42% nesta semana)',
      sentiment: 'Consumidores locais e executivos em Sorocaba e Campolim buscam cardápio executivo rápido, pratos com valor transparente e atendimento direto no WhatsApp.',
      trendingKeywords: [
        '#AlmoçoExecutivo (+55%)',
        '#PratoDoDiaSorocaba (+42%)',
        '#CardápioNoWhatsApp (+48%)',
        '#MenuComSobremesa (+36%)',
        '#OpçãoSemGlúten (+24%)'
      ],
      actionableTips: [
        {
          id: 'tip-1',
          title: 'Gancho de Agilidade no Título',
          action: 'Destaque o formato de almoço executivo ou rapidez de preparo nas primeiras palavras do anúncio.',
          impact: '+38% no CTR',
          impactType: 'high',
          suggestedTweak: 'Restaurante Sabor & Fogo | Almoço Executivo Rápido no Campolim'
        },
        {
          id: 'tip-2',
          title: 'Transparência de Preço e Cortesia',
          action: 'Exibir a faixa de preço inicial e menção a cortesia (café expresso ou sobremesa) acelera o fechamento.',
          impact: '+29% Conversão',
          impactType: 'conversion',
          suggestedTweak: 'Pratos executivos completos a partir de R$ 39,90 com sobremesa artesanal inclusa'
        },
        {
          id: 'tip-3',
          title: 'CTA Direto para Cardápio no WhatsApp',
          action: 'Substitua botões genéricos por link que já entrega o cardápio do dia no WhatsApp instantaneamente.',
          impact: 'Mais Leads no WhatsApp',
          impactType: 'lead',
          suggestedTweak: 'Ver Cardápio do Dia no WhatsApp (Resposta em 2 min)'
        }
      ],
      suggestedHeadline: 'Restaurante Sabor & Fogo | Almoço Executivo Gourmet no Campolim Sorocaba',
      suggestedDescription: 'Almoço executivo rápido com carnes nobres grelhadas na brasa, buffet fresco e sobremesa cortesia. Salão climatizado ou delivery rápido no WhatsApp.',
      suggestedCta: 'Receber Cardápio do Dia no WhatsApp',
      bestPostingHours: '11:15 - 13:45 (Pico de Almoço) & 18:30 - 20:30 (Jantar & Happy Hour)',
      marketSummary: 'No segmento gastronômico do Campolim e Sorocaba, 78% dos cliques ocorrem entre 11h20 e 13h15. Anúncios com preço e cardápio visível convertem 2.4x mais leads diretos.'
    };
  }

  if (cat.includes('repouso') || cat.includes('cuidado') || cat.includes('sênior') || cat.includes('idoso')) {
    return {
      category: 'Casa de Repouso & Cuidado',
      location: loc,
      demandScore: 91,
      demandTrend: 'Demanda Crescente (+31% em agendamentos)',
      sentiment: 'Famílias buscam acolhimento humanizado, segurança com equipe de enfermagem 24 horas e visitas agendadas sem burocracia.',
      trendingKeywords: [
        '#ResidencialSênior (+45%)',
        '#Enfermagem24Horas (+38%)',
        '#VisitaAgendada (+52%)',
        '#AcolhimentoHumanizado (+30%)'
      ],
      actionableTips: [
        {
          id: 'tip-1',
          title: 'Reforço de Segurança & Enfermagem 24h',
          action: 'Destaque a equipe multidisciplinar de enfermagem e acompanhamento médico permanente no título.',
          impact: '+34% no CTR',
          impactType: 'high',
          suggestedTweak: 'Residencial Sênior Acolher | Enfermagem 24h e Acolhimento Humanizado'
        },
        {
          id: 'tip-2',
          title: 'Agendamento de Visita sem Compromisso',
          action: 'Convide os familiares para um café e tour guiado pelas instalações para construir vínculo de confiança.',
          impact: 'Mais Leads Qualificados',
          impactType: 'lead',
          suggestedTweak: 'Agende uma visita guiada para conhecer nossa estrutura e equipe médica'
        },
        {
          id: 'tip-3',
          title: 'Destaque de Atividades e Conforto',
          action: 'Foque a mensagem em oficinas de memória, jardim e alimentação balanceada por nutricionistas.',
          impact: '+25% Confiança',
          impactType: 'conversion',
          suggestedTweak: 'Ambiente planejado com atividades cognitivas diárias e nutricionista'
        }
      ],
      suggestedHeadline: 'Residencial Sênior Acolher | Enfermagem 24h, Conforto e Cuidado Humanizado',
      suggestedDescription: 'Estrutura completa com suítes privativas, acompanhamento médico, fisioterapia e nutrição especializada. Agende um tour pelo WhatsApp.',
      suggestedCta: 'Agendar Visita Guiada no WhatsApp',
      bestPostingHours: '09:00 - 11:30 & 14:00 - 17:00 (Dias úteis)',
      marketSummary: 'Decisões familiares demandam alta credibilidade. 82% das conversões acontecem após agendamento de visita presencial via WhatsApp.'
    };
  }

  if (cat.includes('oficina') || cat.includes('auto') || cat.includes('mecânica') || cat.includes('carro')) {
    return {
      category: 'Oficinas & Automotivo',
      location: loc,
      demandScore: 89,
      demandTrend: 'Alta Procura (+27% por revisões)',
      sentiment: 'Motoristas priorizam orçamento prévio por foto/vídeo no WhatsApp, prazo garantido no mesmo dia e garantia formal de peças.',
      trendingKeywords: [
        '#RevisãoPreventiva (+41%)',
        '#MecânicoDeConfiança (+35%)',
        '#OrçamentoWhatsApp (+49%)',
        '#TrocaDeÓleoRápida (+28%)'
      ],
      actionableTips: [
        {
          id: 'tip-1',
          title: 'Pré-Diagnóstico por Foto/Áudio no WhatsApp',
          action: 'Informe que o cliente pode mandar foto ou áudio do problema pelo WhatsApp para estimativa ágil.',
          impact: '+44% Leads WhatsApp',
          impactType: 'lead',
          suggestedTweak: 'Envie foto ou barulho do carro no WhatsApp para pré-diagnóstico grátis'
        },
        {
          id: 'tip-2',
          title: 'Garantia por Escrito em Peças & Serviços',
          action: 'Remova o medo do cliente anunciando garantia explícita de até 1 ano em serviços mecânicos.',
          impact: '+31% Fechamento',
          impactType: 'conversion',
          suggestedTweak: 'Diagnóstico computadorizado de injeção e suspensão com garantia de 1 ano'
        },
        {
          id: 'tip-3',
          title: 'Prazo Express de Entrega',
          action: 'Destaque que revisões básicas e troca de óleo são concluídas no mesmo dia.',
          impact: '+22% no CTR',
          impactType: 'high',
          suggestedTweak: 'Revisão automotiva completa com entrega no mesmo dia em Sorocaba'
        }
      ],
      suggestedHeadline: 'Precision Car | Mecânica Especializada & Revisão Preventiva Express',
      suggestedDescription: 'Diagnóstico computadorizado, troca de óleo, freios e suspensão com garantia de 1 ano. Envie mensagem no WhatsApp e receba pré-orçamento imediato.',
      suggestedCta: 'Pedir Pré-Orçamento no WhatsApp',
      bestPostingHours: '07:30 - 09:30 & 16:30 - 19:00',
      marketSummary: 'Picos acontecem antes de finais de semana e feriados. Clientes convertem 3x mais quando há promessa de pré-orçamento ágil no WhatsApp.'
    };
  }

  return {
    category: category,
    location: loc,
    demandScore: 88,
    demandTrend: 'Demanda Estável (+25% em engajamento local)',
    sentiment: `Clientes em ${loc} priorizam atendimento ágil no WhatsApp, clareza sobre diferenciais e avaliações com nota 4.8+.`,
    trendingKeywords: [
      `#${category.replace(/[^a-zA-Z0-9]/g, '')}Local (+38%)`,
      '#AtendimentoWhatsApp (+44%)',
      '#QualidadeGarantida (+29%)',
      `#MelhorDe${loc.split(',')[0]} (+35%)`
    ],
    actionableTips: [
      {
        id: 'tip-1',
        title: 'Geolocalização Explícita no Título',
        action: `Inclua o nome do bairro (${loc.split(',')[0]}) no título para dobrar o CTR local.`,
        impact: '+32% no CTR',
        impactType: 'high',
        suggestedTweak: `${category} com Destaque e Confiança em ${loc.split(',')[0]}`
      },
      {
        id: 'tip-2',
        title: 'Clareza na Proposta de Valor',
        action: 'Explique em uma frase o que você entrega melhor do que os concorrentes da região.',
        impact: '+26% Conversão',
        impactType: 'conversion',
        suggestedTweak: 'Atendimento prioritário, suporte dedicado e excelente custo-benefício garantido'
      },
      {
        id: 'tip-3',
        title: 'Canal Direto de WhatsApp com Resposta em Minutos',
        action: 'Prometa agilidade no atendimento para evitar que o lead procure outro concorrente.',
        impact: 'Mais Leads no WhatsApp',
        impactType: 'lead',
        suggestedTweak: 'Fale com nosso especialista agora pelo WhatsApp com resposta imediata'
      }
    ],
    suggestedHeadline: `Destaque em ${category} em ${loc.split(',')[0]} | Atendimento de Excelência`,
    suggestedDescription: `Referência em ${category} na região de ${loc}. Atendimento personalizado, alta aprovação de clientes e condições especiais pelo WhatsApp.`,
    suggestedCta: 'Falar com Atendente no WhatsApp',
    bestPostingHours: '09:00 - 12:00 & 14:00 - 18:00',
    marketSummary: `Buscas locais para ${category} em ${loc} valorizam proximidade, reputação acima de 4.8 estrelas e canal de contato direto.`
  };
}

async function askGeminiIndustryTrends(category: string, location: string): Promise<IndustryTrendsResult> {
  try {
    const prompt = `Você é um analista sênior de inteligência de mercado e tráfego local na plataforma de anúncios GuiaPonto.
Analise as tendências atuais do mercado local para a seguinte categoria e região:
Categoria: ${category}
Localização: ${location}

Retorne um JSON estrito com o seguinte formato exato:
{
  "category": "${category}",
  "location": "${location}",
  "demandScore": 94,
  "demandTrend": "Alta Demanda (+42% nesta semana)",
  "sentiment": "Resumo do comportamento dos consumidores locais em 1 frase",
  "trendingKeywords": ["#Termo1 (+50%)", "#Termo2 (+35%)", "#Termo3 (+28%)", "#Termo4 (+20%)"],
  "actionableTips": [
    {
      "id": "tip-1",
      "title": "Ajuste de Título",
      "action": "O que fazer",
      "impact": "+35% no CTR",
      "impactType": "high",
      "suggestedTweak": "Exemplo prático de frase"
    },
    {
      "id": "tip-2",
      "title": "Ajuste de Preço e Oferta",
      "action": "O que fazer",
      "impact": "+28% Conversão",
      "impactType": "conversion",
      "suggestedTweak": "Exemplo prático de frase"
    },
    {
      "id": "tip-3",
      "title": "Chamada para WhatsApp",
      "action": "O que fazer",
      "impact": "Mais Leads no WhatsApp",
      "impactType": "lead",
      "suggestedTweak": "Exemplo prático de frase"
    }
  ],
  "suggestedHeadline": "Título completo otimizado para o anúncio",
  "suggestedDescription": "Descrição de alta conversão para o anúncio (140-180 caracteres)",
  "suggestedCta": "Texto do botão de ação WhatsApp",
  "bestPostingHours": "Horários de pico ideais para impulsionamento",
  "marketSummary": "Visão analítica de 1 a 2 frases sobre os concorrentes e comportamento de compra local"
}`;

    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, responseMimeType: 'application/json' })
    });
    if (!res.ok) return generateSimulatedIndustryTrends(category, location);
    const data = await res.json();

    if (data?.text) {
      const parsed = JSON.parse(data.text);
      return {
        category: parsed.category || category,
        location: parsed.location || location,
        demandScore: parsed.demandScore || 92,
        demandTrend: parsed.demandTrend || 'Alta Demanda (+35%)',
        sentiment: parsed.sentiment || 'Consumidores locais buscando agilidade e atendimento via WhatsApp.',
        trendingKeywords: parsed.trendingKeywords || ['#DestaqueLocal', '#WhatsAppDireto'],
        actionableTips: parsed.actionableTips || [],
        suggestedHeadline: parsed.suggestedHeadline || `${category} em ${location}`,
        suggestedDescription: parsed.suggestedDescription || 'Atendimento rápido e qualidade garantida.',
        suggestedCta: parsed.suggestedCta || 'Falar no WhatsApp',
        bestPostingHours: parsed.bestPostingHours || '11:00 - 14:00 & 18:00 - 20:00',
        marketSummary: parsed.marketSummary || 'Alta concentração de buscas no horário comercial.'
      };
    }
    return generateSimulatedIndustryTrends(category, location);
  } catch (err) {
    return generateSimulatedIndustryTrends(category, location);
  }
}

interface SeoSuggestionResult {
  titles: string[];
  descriptions: string[];
  keywords: string[];
  score: number;
  recommendations: string[];
}

function generateSimulatedSeoResponse(adTitle: string, category: string, keywords: string[], location: string): SeoSuggestionResult {
  const brand = 'GuiaPonto';
  const loc = location || 'Sorocaba - SP';
  const kw1 = keywords[0] || 'Destaque Local';
  const kw2 = keywords[1] || 'Melhor Atendimento';

  return {
    titles: [
      `${adTitle.split(' - ')[0]} | ${kw1} em ${loc}`,
      `${kw1} e ${kw2} com Qualidade Garantida | ${brand}`,
      `Onde Encontrar ${kw1} em ${loc}? Conheça e Peça no WhatsApp!`
    ],
    descriptions: [
      `Procurando por ${kw1.toLowerCase()} em ${loc}? Atendimento diferenciado, excelente custo-benefício e contato direto no WhatsApp. Confira horários e avaliações!`,
      `Descubra as melhores opções de ${category.toLowerCase()} na região de ${loc}. ${adTitle}. Fale agora com nossa equipe e garanta condições especiais!`,
      `Referência em ${category.toLowerCase()} em ${loc}: ${kw1} com alta aprovação de clientes. Atendimento rápido e orçamento sem compromisso no WhatsApp.`
    ],
    keywords: keywords.length > 0 ? keywords : [kw1, kw2, 'Sorocaba', 'WhatsApp', 'GuiaPonto'],
    score: 96,
    recommendations: [
      'Meta title possui entre 50 e 60 caracteres (tamanho ideal para indexação no Google)',
      'Meta description inclui intenção local e chamada para ação no WhatsApp',
      'Palavra-chave principal posicionada no início do título para maior relevância de busca',
      'Rich snippet com estrelas de avaliação ativado na vitrine GuiaPonto'
    ]
  };
}

async function askGeminiSeo(adTitle: string, category: string, keywords: string[], location: string): Promise<SeoSuggestionResult> {
  try {
    const prompt = `Você é um especialista sênior em SEO Local e Google Search. Crie sugestões de Meta Title e Meta Description de alta conversão para o anúncio:
Título do Anúncio: ${adTitle}
Categoria: ${category}
Localização: ${location}
Palavras-chave informadas: ${keywords.join(', ')}

Retorne um JSON estrito no seguinte formato:
{
  "titles": ["Título 1 (50-60 caracteres)", "Título 2", "Título 3"],
  "descriptions": ["Descrição 1 (140-160 caracteres com CTA)", "Descrição 2", "Descrição 3"],
  "keywords": ["kw1", "kw2", "kw3"],
  "score": 95,
  "recommendations": ["dica 1", "dica 2", "dica 3"]
}`;

    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, responseMimeType: 'application/json' })
    });
    if (!res.ok) return generateSimulatedSeoResponse(adTitle, category, keywords, location);
    const data = await res.json();
    if (data?.text) {
      const parsed = JSON.parse(data.text);
      return {
        titles: parsed.titles || [],
        descriptions: parsed.descriptions || [],
        keywords: parsed.keywords || keywords,
        score: parsed.score || 94,
        recommendations: parsed.recommendations || []
      };
    }
    return generateSimulatedSeoResponse(adTitle, category, keywords, location);
  } catch (err) {
    return generateSimulatedSeoResponse(adTitle, category, keywords, location);
  }
}

async function askGeminiMentor(prompt: string) {
  try {
    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Você é o "GuiaPonto IA Mentor", um especialista sênior em marketing digital, anúncios locais e conversão para lojistas na plataforma GuiaPonto. Responda de forma prática, comercial e amigável em português do Brasil à pergunta: ${prompt}`
      })
    });
    if (!res.ok) return generateSimulatedMentorResponse(prompt);
    const data = await res.json();
    return data?.text || generateSimulatedMentorResponse(prompt);
  } catch (err) {
    return generateSimulatedMentorResponse(prompt);
  }
}

function generateSimulatedMentorResponse(prompt: string) {
  const p = prompt.toLowerCase();
  if (p.includes('restaurante') || p.includes('comida') || p.includes('almoço') || p.includes('conversão')) {
    return 'Para restaurantes e comércios locais, o segredo é destacar fotos reais dos produtos mais vendidos, garantir o botão direto para o WhatsApp e agendar campanhas de boost nos horários de pico (11:30 às 14:30). O GuiaPonto IA Studio pode gerar essa copy automaticamente para você!';
  } else if (p.includes('horário') || p.includes('pico') || p.includes('impulsionar') || p.includes('orçamento')) {
    return 'Utilize o nosso Otimizador Preditivo de Orçamento na aba Visão Geral! Ele detecta horários de alta intenção de busca na sua região e aplica um boost automático de orçamento nos momentos de maior conversão.';
  } else if (p.includes('reputação') || p.includes('score') || p.includes('nível') || p.includes('nivel')) {
    return 'Para subir seu Reputation Score e alcançar o nível Pro Legend, mantenha seus leads do WhatsApp respondidos em até 10 minutos, adicione fotos nítidas e complete as metas semanais de gamificação!';
  } else {
    return 'Excelente pergunta! Para maximizar seus resultados na GuiaPonto, foque em títulos claros com oferta irresistível, chamada para ação no WhatsApp e utilize o Cacilda AI Studio para refinar sua copy.';
  }
}

function generateSimulatedOptimizationResponse(metrics: any, ads: any[]) {
  return `### Relatório de Otimização IA GuiaPonto (Powered by Gemini)
1. **Melhoria de Copy (Anúncio: "${ads[0]?.title || 'Principal'}"):**
   - Atualize o título para incluir uma urgência de conversão: *"Avaliação Gratuita Hoje - Vagas Limitadas no WhatsApp"*. Isso eleva o CTR em até 32%.
2. **Ajuste de Público-Alvo & Raio:**
   - Reduza o raio geográfico para 3km em torno do seu estabelecimento durante o horário de almoço (11:30 - 14:00) para capturar usuários com intenção imediata de compra.
3. **Chamada para Ação (CTA):**
   - Substitua o botão genérico por *"Falar com Atendente no WhatsApp (Resposta em 5 min)"* para reter clientes indecisos e elevar a taxa de fechamento.`;
}

async function askGeminiOptimization(metrics: any, ads: any[]) {
  try {
    const prompt = `Você é o "GuiaPonto AI Ad Optimizer", um especialista sênior em anúncios locais e conversão. Analise as métricas do lojista:
- Total de Cliques: ${metrics.totalClicks}
- Total de Impressões: ${metrics.totalImpressions}
- Anúncios Ativos: ${metrics.activeAdsCount}
- Reputation Score: ${metrics.reputationScore}
- Lista de Anúncios: ${JSON.stringify(ads.map(a => ({ title: a.title, category: a.category, clicks: a.clicks, status: a.status })))}

Forneça um relatório detalhado com 3 melhorias específicas na copy dos anúncios e 2 ajustes precisos no público-alvo (geolocalização e horários de pico) para maximizar leads no WhatsApp em português do Brasil.`;

    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) return generateSimulatedOptimizationResponse(metrics, ads);
    const data = await res.json();
    return data?.text || generateSimulatedOptimizationResponse(metrics, ads);
  } catch (err) {
    return generateSimulatedOptimizationResponse(metrics, ads);
  }
}

interface AlexandreDashboardSPAProps {
  onBackToHome: () => void;
  onOpenAdminPanel?: () => void;
}

interface AdItem {
  id: string;
  title: string;
  category: string;
  price: string;
  status: 'Ativo' | 'Pausado' | 'Expirado';
  clicks: number;
  impressions: number;
  image: string;
  createdAt: string;
}

export interface LeadFollowUpDraft {
  subject: string;
  body: string;
  categoryUsed: string;
  tone: string;
  generatedAt: string;
  status: 'Rascunho IA Pronto' | 'Enviado';
  categoryStrategyNote: string;
}

interface LeadItem {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  adTitle: string;
  category: string;
  customerInquiry: string;
  timestamp: string;
  status: 'Novo' | 'Em Atendimento' | 'Convertido';
  aiFollowUpDraft?: LeadFollowUpDraft;
}

function generateCategoryFollowUpFallback(
  customerName: string,
  adTitle: string,
  category: string,
  businessName: string,
  tone: string,
  inquiry?: string
): { subject: string; body: string; categoryStrategyNote: string } {
  const firstName = customerName.split(' ')[0] || customerName;
  const isPromo = tone === 'Promocional com Cupom';
  const isFast = tone === 'Executivo Rápido';

  if (category.includes('Restaurantes') || category.includes('Gastronomia')) {
    return {
      subject: isPromo
        ? `🍽️ ${firstName}, sua reserva + Cortesia Exclusiva no ${adTitle.split(' - ')[0]} (Sorocaba)`
        : `🍽️ Olá ${firstName}! Cardápio atualizado e reserva rápida — ${adTitle}`,
      categoryStrategyNote: 'Foco em gastronomia local (Sorocaba/Campolim): destaca horários de pico, link de reserva imediata de mesa e gatilho sensorial.',
      body: isFast
        ? `Olá, ${firstName}! Tudo bem?\n\nVimos seu interesse em "${adTitle}" no GuiaPonto Sorocaba${inquiry ? ` (${inquiry})` : ''}.\n\nJá separamos as opções do nosso menu executivo e mesas disponíveis para hoje ou esta semana no Campolim.\n\nResponda este e-mail com o horário desejado ou confirme direto pelo nosso WhatsApp para garantirmos sua mesa sem fila!\n\nAtenciosamente,\nEquipe ${businessName}`
        : `Olá, ${customerName}! Tudo bem?\n\nRecebemos seu contato através do GuiaPonto Sorocaba referente ao anúncio "${adTitle}"${inquiry ? ` sobre: "${inquiry}"` : ''}.\n\nFicamos muito felizes com seu interesse! Na categoria de Gastronomia em Sorocaba, preparamos um atendimento prioritário para clientes do diretório:\n\n• Cardápio completo com opções de almoço executivo, cortes nobres e jantar;\n• Reserva antecipada sem tempo de espera na recepção;\n${isPromo ? '• CORTESIA ESPECIAL: Apresente o código GUIAPONTOVIP na chegada para ganhar 1 sobremesa artesanal ou bebida de boas-vindas!\n' : '• Estacionamento conveniado e ambiente climatizado no coração de Sorocaba.\n'}\nPara confirmar sua reserva ou tirar dúvidas sobre grupos e eventos, basta responder a este e-mail com a data e quantidade de pessoas.\n\nUm excelente dia e esperamos receber você em breve!\n\nAtenciosamente,\n${businessName}\nParceiro Verificado GuiaPonto Sorocaba`
    };
  }

  if (category.includes('Casa de Repouso') || category.includes('Cuidado')) {
    return {
      subject: `🤍 ${firstName}, informações de acolhimento e visita guiada — ${adTitle}`,
      categoryStrategyNote: 'Foco em empatia e confiança familiar: prioriza segurança médica 24h, acolhimento humanizado e agendamento de visita presencial em Sorocaba.',
      body: `Olá, ${customerName}. Como você está?\n\nAgradecemos a confiança em entrar em contato pelo GuiaPonto Sorocaba sobre "${adTitle}"${inquiry ? ` (${inquiry})` : ''}.\n\nSabemos que a escolha de um espaço de cuidado e convivência para quem amamos exige total transparência, carinho e segurança. Por isso, estruturamos os detalhes iniciais para sua família:\n\n• Equipe multidisciplinar 24h (Enfermagem, Médico Geriatra, Fisioterapia e Nutrição);\n• Suítes adaptadas, jardins ensolarados em Sorocaba e programação diária de estímulo cognitivo;\n• Modalidades flexíveis: Moradia Permanente, Pós-Operatório ou Day Care (Centro Dia).\n${isPromo ? '\n• CONDIÇÃO ESPECIAL GUIAPONTO: Avaliação multiprofissional geriátrica inicial 100% gratuita na sua primeira visita.\n' : ''}\nGostaria de agendar uma visita guiada sem compromisso (presencial em Sorocaba ou por videochamada) nesta semana para conhecer nossa estrutura e equipe?\n\nCom carinho e à inteira disposição,\nCoordenação de Acolhimento — ${businessName}`
    };
  }

  if (category.includes('Oficinas') || category.includes('Automotivo')) {
    return {
      subject: isPromo
        ? `🔧 ${firstName}, seu pré-orçamento + Check-up Computadorizado Grátis (${adTitle})`
        : `🔧 Olá ${firstName}! Agendamento prioritário de box e orçamento — ${adTitle}`,
      categoryStrategyNote: 'Foco em transparência técnica e agilidade: destaca diagnóstico computadorizado, garantia de peças e reserva de box em Sorocaba.',
      body: `Olá, ${customerName}! Tudo certo?\n\nRecebemos sua solicitação via GuiaPonto Sorocaba no anúncio "${adTitle}"${inquiry ? ` referente a: "${inquiry}"` : ''}.\n\nNossa equipe técnica já reservou prioridade na agenda da oficina para avaliar o seu veículo com precisão:\n\n• Diagnóstico computadorizado via scanner de última geração;\n• Orçamento transparente enviado com fotos e vídeo antes de qualquer serviço;\n• Peças originais/homologadas com garantia e entrega no mesmo dia para revisões preventivas.\n${isPromo ? '• BÔNUS GUIAPONTO SOROCABA: Check-up eletrônico de 30 itens + alinhamento com 20% OFF neste agendamento!\n' : ''}\nQual o modelo/ano do seu veículo e qual o melhor período (manhã ou tarde) para deixá-lo em nosso box em Sorocaba?\n\nForte abraço,\nEquipe Técnica — ${businessName}`
    };
  }

  if (category.includes('Imobiliárias') || category.includes('Arquitetura')) {
    return {
      subject: `🏡 ${firstName}, seleção exclusiva de imóveis e dossiê completo — ${adTitle}`,
      categoryStrategyNote: 'Foco consultivo patrimonial: valoriza localização em condomínios/bairros nobres de Sorocaba, potencial de valorização e visita privativa.',
      body: `Olá, ${customerName}! Tudo bem?\n\nIdentificamos seu interesse através do GuiaPonto Sorocaba no anúncio "${adTitle}"${inquiry ? ` ("${inquiry}")` : ''}.\n\nPreparamos uma curadoria personalizada considerando as regiões mais valorizadas de Sorocaba (Campolim, Jd. Faculdade, Santa Rosália e condomínios fechados):\n\n• Ficha técnica detalhada, plantas e tour virtual 360º;\n• Simulação comparativa de financiamento e análise documental prévia;\n${isPromo ? '• VANTAGEM EXCLUSIVA: Consultoria de viabilidade + Laudo de avaliação de mercado gratuito para clientes GuiaPonto.\n' : '• Atendimento privativo com corretor/arquiteto especialista na Zona Sul de Sorocaba.\n'}\nPodemos agendar uma apresentação rápida ou visita presencial aos imóveis selecionados entre hoje e amanhã?\n\nAtenciosamente,\nConsultoria Especializada — ${businessName}`
    };
  }

  if (category.includes('Saúde') || category.includes('Estética')) {
    return {
      subject: isPromo
        ? `✨ ${firstName}, horários disponíveis + Condição Especial de Avaliação (${adTitle})`
        : `✨ Olá ${firstName}! Informações sobre seu protocolo e agendamento — ${adTitle}`,
      categoryStrategyNote: 'Foco em bem-estar, biossegurança e horários flexíveis: destaca avaliação individualizada e tecnologia clínica em Sorocaba.',
      body: `Olá, ${customerName}! Tudo bem com você?\n\nRecebemos seu contato no GuiaPonto Sorocaba interessado(a) em "${adTitle}"${inquiry ? ` (${inquiry})` : ''}.\n\nPara proporcionarmos o melhor resultado com total segurança e conforto em nossa clínica em Sorocaba, reservamos horários especiais na agenda desta semana:\n\n• Avaliação clínica personalizada com especialistas habilitados;\n• Protocolos modernos com equipamentos certificados pela ANVISA;\n${isPromo ? '• BENEFÍCIO GUIAPONTO: Ganhe 15% de desconto no protocolo completo ou dermoanálise facial de cortesia na sua consulta inicial!\n' : '• Horários estendidos (incluindo final de tarde) e estacionamento próprio.\n'}\nQual dia da semana e período (manhã, tarde ou início da noite) fica mais confortável para você?\n\nUm abraço,\nRecepção Clínica — ${businessName}`
    };
  }

  return {
    subject: `🚀 Olá ${firstName}! Retorno prioritário sobre "${adTitle}" — ${businessName}`,
    categoryStrategyNote: `Personalização adaptada para ${category} em Sorocaba com proposta de valor direta e CTA de resposta rápida.`,
    body: `Olá, ${customerName}! Tudo bem?\n\nRecebemos seu contato pelo diretório GuiaPonto Sorocaba referente a "${adTitle}" na categoria ${category}${inquiry ? ` (${inquiry})` : ''}.\n\nJá estamos com tudo pronto para atender sua solicitação com prioridade e condições exclusivas para clientes da região de Sorocaba.\n\nResponda a este e-mail informando sua preferência de horário ou dúvida principal para avançarmos agora mesmo!\n\nAtenciosamente,\n${businessName}`
  };
}

async function askGeminiLeadFollowUp(
  customerName: string,
  adTitle: string,
  category: string,
  businessName: string,
  tone: string,
  inquiry?: string
): Promise<{ subject: string; body: string; categoryStrategyNote: string }> {
  const fallback = generateCategoryFollowUpFallback(customerName, adTitle, category, businessName, tone, inquiry);

  try {
    const prompt = `Você é o assistente de CRM Inteligente do GuiaPonto Sorocaba.
Redija um e-mail de Auto-Follow-up altamente persuasivo e personalizado em Português do Brasil para um novo lead que acabou de demonstrar interesse em um anúncio local.

Dados do Lead e Empresa:
- Nome do Cliente (Lead): ${customerName}
- Anúncio de Interesse: ${adTitle}
- Categoria do Negócio: ${category}
- Dúvida/Contexto do Lead: ${inquiry || 'Solicitou contato e informações pelo diretório GuiaPonto Sorocaba'}
- Nome da Empresa Anunciante: ${businessName}
- Cidade/Região: Sorocaba - SP
- Tom da Resposta: ${tone}

Retorne APENAS um JSON válido com as chaves:
{
  "subject": "Assunto de e-mail atraente com 1 emoji e nome do cliente",
  "body": "Corpo do e-mail completo, com saudação, 3 bullet points de valor específicos para a categoria '${category}' em Sorocaba, e chamada para ação (CTA) clara no final",
  "categoryStrategyNote": "Explicação curta (1 frase) de como o e-mail foi adaptado especificamente para a categoria '${category}'"
}`;

    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, responseMimeType: 'application/json' })
    });
    if (!res.ok) return fallback;
    const data = await res.json();

    if (data?.text) {
      const parsed = JSON.parse(data.text);
      if (parsed.subject && parsed.body) {
        return {
          subject: parsed.subject,
          body: parsed.body,
          categoryStrategyNote: parsed.categoryStrategyNote || fallback.categoryStrategyNote
        };
      }
    }
    return fallback;
  } catch (err) {
    console.warn('Fallback ativado para Auto-Follow-up IA:', err);
    return fallback;
  }
}

export function AlexandreDashboardSPA({ onBackToHome, onOpenAdminPanel }: AlexandreDashboardSPAProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'ads' | 'aiStudio' | 'leads' | 'reviews' | 'reports' | 'billing' | 'gamification' | 'settings' | 'accountSettings' | 'aiSuggestions' | 'partners' | 'seoOptimizer'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [dashboardMobileMenuOpen, setDashboardMobileMenuOpen] = useState(false);
  const [activeMerchantPlan, setActiveMerchantPlan] = useState<'gratuito' | 'premium' | 'enterprise'>('premium');

  // Estimated Revenue Projection State
  const [projectionTicket, setProjectionTicket] = useState<number>(180);
  const [projectionClosingRate, setProjectionClosingRate] = useState<number>(22); // 22%
  const [projectionMonthlyImpressions, setProjectionMonthlyImpressions] = useState<number>(24000);
  const [projectionAiTurbo, setProjectionAiTurbo] = useState<boolean>(false);

  // SEO Optimizer Widget State
  const [seoSelectedAdId, setSeoSelectedAdId] = useState<string>('1');
  const [seoKeywords, setSeoKeywords] = useState<string[]>([
    'Restaurante Campolim',
    'Almoço Executivo Sorocaba',
    'Comida Caseira',
    'Delivery WhatsApp'
  ]);
  const [seoNewKeywordInput, setSeoNewKeywordInput] = useState<string>('');
  const [seoLocation, setSeoLocation] = useState<string>('Campolim, Sorocaba - SP');
  const [seoGeneratedResult, setSeoGeneratedResult] = useState<SeoSuggestionResult | null>({
    titles: [
      'Restaurante Sabor & Fogo | Almoço Executivo no Campolim Sorocaba',
      'O Melhor Almoço Executivo do Campolim | Restaurante Sabor & Fogo',
      'Almoço Executivo e Carnes na Brasa em Sorocaba | Peça no WhatsApp'
    ],
    descriptions: [
      'Procurando almoço executivo no Campolim? Pratos gourmet preparados na hora, ambiente climatizado e reserva direta no WhatsApp. Conheça nosso cardápio!',
      'Restaurante Sabor & Fogo: o melhor da gastronomia no Campolim, Sorocaba. Almoço executivo rápido, carnes nobres e sobremesas artesanais. Fale conosco!',
      'Almoço Executivo com qualidade e rapidez em Sorocaba. Desconto exclusivo para clientes da rede GuiaPonto. Peça pelo WhatsApp agora mesmo!'
    ],
    keywords: ['Restaurante Campolim', 'Almoço Executivo Sorocaba', 'Comida Caseira', 'Delivery WhatsApp'],
    score: 96,
    recommendations: [
      'Meta title possui 56 caracteres (comprimento ideal para o Google)',
      'Meta description persuasiva com chamada clara para o WhatsApp',
      'Palavra-chave principal e geolocalização no início do título',
      'Rich snippet com estrelas 4.9 ativado na vitrine GuiaPonto'
    ]
  });
  const [isGeneratingSeo, setIsGeneratingSeo] = useState<boolean>(false);
  const [selectedMetaTitleIndex, setSelectedMetaTitleIndex] = useState<number>(0);
  const [selectedMetaDescIndex, setSelectedMetaDescIndex] = useState<number>(0);
  const [seoCopiedToast, setSeoCopiedToast] = useState<string | null>(null);
  const [seoAppliedSuccess, setSeoAppliedSuccess] = useState<boolean>(false);

  // Partner Directory Search State
  const [partnerSearchQuery, setPartnerSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Todas');
  
  const [partnerBusinesses, setPartnerBusinesses] = useState([
    { id: 'p1', name: 'Restaurante Sabor & Fogo Co', category: 'Restaurantes & Gastronomia', rating: 4.9, location: 'Campolim, Sorocaba - SP', whatsapp: '(15) 98888-1111', verified: true, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80' },
    { id: 'p2', name: 'Residencial Sênior Acolher', category: 'Casa de Repouso & Cuidado', rating: 4.8, location: 'Santa Rosália, Sorocaba - SP', whatsapp: '(15) 97777-2222', verified: true, image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=400&q=80' },
    { id: 'p3', name: 'Imobiliária Nova Era Prime', category: 'Imobiliárias & Arquitetura', rating: 4.7, location: 'Campolim, Sorocaba - SP', whatsapp: '(15) 96666-3333', verified: true, image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80' },
    { id: 'p4', name: 'Oficina Mecânica Precision Car', category: 'Oficinas & Automotivo', rating: 4.9, location: 'Trujillo, Sorocaba - SP', whatsapp: '(15) 95555-4444', verified: true, image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80' },
    { id: 'p5', name: 'Clínica Sorria Mais Implantes', category: 'Saúde & Estética', rating: 5.0, location: 'Centro, Sorocaba - SP', whatsapp: '(15) 94444-5555', verified: true, image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=400&q=80' },
  ]);

  const filteredPartners = partnerBusinesses.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(partnerSearchQuery.toLowerCase()) || p.category.toLowerCase().includes(partnerSearchQuery.toLowerCase()) || p.location.toLowerCase().includes(partnerSearchQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'Todas' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Guided Tour State
  const [showGuidedTour, setShowGuidedTour] = useState<boolean>(() => {
    return !localStorage.getItem('guiaponto_tour_seen');
  });
  const [tourStep, setTourStep] = useState<number>(1);
  const totalTourSteps = 4;

  const handleFinishTour = () => {
    localStorage.setItem('guiaponto_tour_seen', 'true');
    setShowGuidedTour(false);
    addXp(150, 'Conclusão do Tour Guiado Executive Suite');
  };

  // AI Ad Optimization Suggestions State
  const [aiOptimizationSuggestions, setAiOptimizationSuggestions] = useState<string>('');
  const [isAnalyzingOptimization, setIsAnalyzingOptimization] = useState<boolean>(false);

  const fetchOptimizationSuggestions = async () => {
    setIsAnalyzingOptimization(true);
    const metrics = { totalClicks, totalImpressions, activeAdsCount, reputationScore: reputationData.score };
    const suggestions = await askGeminiOptimization(metrics, ads);
    setAiOptimizationSuggestions(suggestions);
    setIsAnalyzingOptimization(false);
    addXp(120, 'Análise de Otimização de Anúncios com Gemini');
  };

  // User Profile State
  const [userProfile, setUserProfile] = useState({
    name: 'Alexandre Santos',
    email: 'alexandre@guiaponto.com',
    phone: '(15) 99999-8888',
    businessName: 'GuiaPonto Destaques & Serviços',
    bio: 'Empreendedor e anunciante verificado na rede GuiaPonto.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    savedSuccess: false,
  });

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Novo Marco Atingido!', desc: 'Seu Reputation Score atingiu 94 pontos (Nível Elite Ouro).', time: 'Há 5 min', unread: true, type: 'badge' },
    { id: '2', title: 'Novo Lead no WhatsApp', desc: 'Marcos Vinicius demonstrou interesse no anúncio "Restaurante Sabor & Fogo".', time: 'Há 22 min', unread: true, type: 'lead' },
    { id: '3', title: 'Pico de Cliques Detectado', desc: 'Seu anúncio ultrapassou 500 cliques esta semana!', time: 'Há 2 horas', unread: false, type: 'click' },
    { id: '4', title: 'Cacilda AI Studio', desc: 'Sugestão de otimização de copy gerada para seus anúncios ativos.', time: 'Ontem', unread: false, type: 'ai' },
  ]);
  const [notifOpen, setNotifOpen] = useState(false);

  // Real-time Simulation Notifications State
  const [liveAlertToast, setLiveAlertToast] = useState<{ id: string; title: string; desc: string; time: string } | null>({
    id: 'live-init',
    title: 'Top 5 da Categoria!',
    desc: 'Seu anúncio está entre os 5 mais vistos da sua categoria hoje!',
    time: 'Agora mesmo'
  });

  const simulateRealtimeAlert = () => {
    const alerts = [
      { title: 'Top 5 da Categoria!', desc: 'Seu anúncio está entre os 5 mais vistos da sua categoria hoje!' },
      { title: 'Pico de Tráfego Detectado!', desc: 'Alta intenção de busca por restaurantes no Campolim.' },
      { title: 'Novo Lead WhatsApp!', desc: 'Cliente interessado enviou mensagem para o Residencial Sênior.' },
      { title: 'Recompensa XP Desbloqueada!', desc: 'Você ganhou +150 XP por otimizar sua copy com IA.' },
    ];
    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    const newNotif = {
      id: String(Date.now()),
      title: randomAlert.title,
      desc: randomAlert.desc,
      time: 'Agora',
      unread: true,
      type: 'live'
    };

    setNotifications(prev => [newNotif, ...prev]);
    setLiveAlertToast({ id: newNotif.id, title: newNotif.title, desc: newNotif.desc, time: 'Agora' });
    addXp(30, 'Simulação de Alerta em Tempo Real');

    setTimeout(() => {
      setLiveAlertToast(null);
    }, 6000);
  };

  // GuiaPonto IA Mentor Chat State
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [mentorMessages, setMentorMessages] = useState<Array<{ id: string; sender: 'ai' | 'user'; text: string; time: string }>>([
    { id: '1', sender: 'ai', text: 'Olá Alexandre! Sou o seu GuiaPonto IA Mentor (Powered by Gemini). Como posso te ajudar a otimizar seus anúncios e aumentar seus leads hoje?', time: 'Agora' }
  ]);
  const [mentorInput, setMentorInput] = useState('');
  const [isMentorLoading, setIsMentorLoading] = useState(false);

  const handleSendMentorMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mentorInput.trim() || isMentorLoading) return;

    const userText = mentorInput.trim();
    const userMsg = { id: String(Date.now()), sender: 'user' as const, text: userText, time: 'Agora' };
    setMentorMessages(prev => [...prev, userMsg]);
    setMentorInput('');
    setIsMentorLoading(true);

    const replyText = await askGeminiMentor(userText);

    const aiMsg = { id: String(Date.now() + 1), sender: 'ai' as const, text: replyText, time: 'Agora' };
    setMentorMessages(prev => [...prev, aiMsg]);
    setIsMentorLoading(false);
    addXp(20, 'Consultoria com GuiaPonto IA Mentor');
  };

  // Account Settings State
  const [accountSettingsData, setAccountSettingsData] = useState({
    businessName: 'GuiaPonto Destaques & Serviços',
    cnpj: '45.890.123/0001-99',
    category: 'Restaurantes & Gastronomia',
    address: 'Av. Antônio Carlos Comitre, 1200 - Campolim, Sorocaba - SP',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailWeeklyReports: true,
    emailAiTips: true,
    emailWhatsappLeads: true,
    emailNewsletter: false,
    savedSuccess: false,
    passwordSuccess: false,
  });

  const handleSaveAccountSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setAccountSettingsData(prev => ({ ...prev, savedSuccess: true }));
    addXp(50, 'Atualização de Configurações de Conta');
    setTimeout(() => {
      setAccountSettingsData(prev => ({ ...prev, savedSuccess: false }));
    }, 4000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountSettingsData.newPassword || accountSettingsData.newPassword !== accountSettingsData.confirmPassword) {
      alert('As senhas não coincidem ou estão vazias.');
      return;
    }
    setAccountSettingsData(prev => ({ ...prev, passwordSuccess: true, currentPassword: '', newPassword: '', confirmPassword: '' }));
    setTimeout(() => {
      setAccountSettingsData(prev => ({ ...prev, passwordSuccess: false }));
    }, 4000);
  };

  // PDF Export State
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfExportSuccess, setPdfExportSuccess] = useState(false);

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    setTimeout(() => {
      setIsExportingPDF(false);
      setPdfExportSuccess(true);
      window.print();
      addXp(200, 'Exportação de Relatório Executivo PDF');
      setTimeout(() => setPdfExportSuccess(false), 4000);
    }, 1200);
  };

  // Reputation & Milestones State
  const [reputationData, setReputationData] = useState({
    score: 94,
    level: 'Elite Ouro',
    milestones: [
      { id: 1, title: 'Primeiro Anúncio Criado com IA', progress: 100, status: 'Concluído' },
      { id: 2, title: '100 Leads Respondidos no WhatsApp', progress: 85, status: 'Em andamento (85/100)' },
      { id: 3, title: 'Perfil 100% Completo com Foto', progress: 100, status: 'Concluído' },
      { id: 4, title: 'Média 4.8+ de Avaliações', progress: 98, status: 'Quase lá (4.9)' },
      { id: 5, title: 'Campanha Sazonal com IA Ativa', progress: 100, status: 'Concluído' },
    ]
  });

  // Initial ads state for Alexandre
  const [ads, setAds] = useState<AdItem[]>([
    {
      id: '1',
      title: 'Restaurante Sabor & Fogo - Almoço Executivo',
      category: 'Restaurantes & Gastronomia',
      price: 'R$ 39,90',
      status: 'Ativo',
      clicks: 412,
      impressions: 8900,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
      createdAt: '10/10/2026'
    },
    {
      id: '2',
      title: 'Residencial Sênior Acolher - Vagas Disponíveis',
      category: 'Casa de Repouso & Cuidado',
      price: 'Sob Consulta',
      status: 'Ativo',
      clicks: 184,
      impressions: 4200,
      image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
      createdAt: '15/10/2026'
    },
    {
      id: '3',
      title: 'Oficina Mecânica Precision Car - Revisão Completa',
      category: 'Oficinas & Automotivo',
      price: 'R$ 150,00',
      status: 'Pausado',
      clicks: 95,
      impressions: 2100,
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
      createdAt: '01/09/2026'
    },
    {
      id: '4',
      title: 'Imobiliária Nova Era Prime - Lançamento Centro',
      category: 'Imobiliárias & Arquitetura',
      price: 'R$ 450.000',
      status: 'Expirado',
      clicks: 530,
      impressions: 9300,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
      createdAt: '12/08/2026'
    },
  ]);

  // CRM Leads simulated state + Auto-Follow-up AI Engine
  const [autoFollowUpEnabled, setAutoFollowUpEnabled] = useState<boolean>(true);
  const [followUpCategoryMode, setFollowUpCategoryMode] = useState<string>('lead'); // 'lead' | 'account' | specific category
  const [followUpTone, setFollowUpTone] = useState<'Consultivo & Acolhedor' | 'Promocional com Cupom' | 'Executivo Rápido'>('Consultivo & Acolhedor');
  const [selectedLeadIdForFollowUp, setSelectedLeadIdForFollowUp] = useState<string>('l1');
  const [isGeneratingFollowUpId, setIsGeneratingFollowUpId] = useState<string | null>(null);
  const [followUpBannerFeedback, setFollowUpBannerFeedback] = useState<string | null>(null);
  const [copiedFollowUpId, setCopiedFollowUpId] = useState<string | null>(null);

  const [leads, setLeads] = useState<LeadItem[]>(() => {
    const initialDraft1 = generateCategoryFollowUpFallback(
      'Marcos Vinicius',
      'Restaurante Sabor & Fogo - Almoço Executivo',
      'Restaurantes & Gastronomia',
      'GuiaPonto Destaques & Serviços',
      'Consultivo & Acolhedor',
      'Reserva de mesa para 6 pessoas no almoço executivo no Campolim'
    );
    const initialDraft2 = generateCategoryFollowUpFallback(
      'Camila Rodrigues',
      'Residencial Sênior Acolher',
      'Casa de Repouso & Cuidado',
      'GuiaPonto Destaques & Serviços',
      'Consultivo & Acolhedor',
      'Informações sobre estadia centro-dia e acompanhamento médico 24h'
    );
    const initialDraft4 = generateCategoryFollowUpFallback(
      'Dr. Henrique Vasconcelos',
      'Imobiliária Prime Sorocaba - Alto Padrão',
      'Imobiliárias & Arquitetura',
      'GuiaPonto Destaques & Serviços',
      'Consultivo & Acolhedor',
      'Interesse em visita privativa a sobrado em condomínio na Zona Sul'
    );

    return [
      {
        id: 'l1',
        customerName: 'Marcos Vinicius',
        email: 'marcos.vinicius@sorocabacorp.com.br',
        phone: '(15) 98765-4321',
        adTitle: 'Restaurante Sabor & Fogo - Almoço Executivo',
        category: 'Restaurantes & Gastronomia',
        customerInquiry: 'Reserva de mesa para 6 pessoas no almoço executivo no Campolim',
        timestamp: 'Hoje, 14:20',
        status: 'Novo',
        aiFollowUpDraft: {
          subject: initialDraft1.subject,
          body: initialDraft1.body,
          categoryUsed: 'Restaurantes & Gastronomia',
          tone: 'Consultivo & Acolhedor',
          generatedAt: 'Gerado automaticamente há 2 min',
          status: 'Rascunho IA Pronto',
          categoryStrategyNote: initialDraft1.categoryStrategyNote
        }
      },
      {
        id: 'l4',
        customerName: 'Dr. Henrique Vasconcelos',
        email: 'henrique.vasconcelos@medsorocaba.com.br',
        phone: '(15) 99144-7788',
        adTitle: 'Imobiliária Prime Sorocaba - Alto Padrão',
        category: 'Imobiliárias & Arquitetura',
        customerInquiry: 'Interesse em visita privativa a sobrado em condomínio na Zona Sul',
        timestamp: 'Hoje, 13:05',
        status: 'Novo',
        aiFollowUpDraft: {
          subject: initialDraft4.subject,
          body: initialDraft4.body,
          categoryUsed: 'Imobiliárias & Arquitetura',
          tone: 'Consultivo & Acolhedor',
          generatedAt: 'Gerado automaticamente há 1h',
          status: 'Rascunho IA Pronto',
          categoryStrategyNote: initialDraft4.categoryStrategyNote
        }
      },
      {
        id: 'l2',
        customerName: 'Camila Rodrigues',
        email: 'camila.rodrigues88@gmail.com',
        phone: '(15) 97123-8899',
        adTitle: 'Residencial Sênior Acolher',
        category: 'Casa de Repouso & Cuidado',
        customerInquiry: 'Informações sobre estadia centro-dia e acompanhamento médico 24h',
        timestamp: 'Ontem, 18:45',
        status: 'Em Atendimento',
        aiFollowUpDraft: {
          subject: initialDraft2.subject,
          body: initialDraft2.body,
          categoryUsed: 'Casa de Repouso & Cuidado',
          tone: 'Consultivo & Acolhedor',
          generatedAt: 'Ontem, 18:46',
          status: 'Enviado',
          categoryStrategyNote: initialDraft2.categoryStrategyNote
        }
      },
      {
        id: 'l3',
        customerName: 'Roberto Silveira',
        email: 'roberto.silveira@industria-itu.com.br',
        phone: '(15) 96543-1122',
        adTitle: 'Restaurante Sabor & Fogo - Almoço Executivo',
        category: 'Restaurantes & Gastronomia',
        customerInquiry: 'Confraternização corporativa para 20 pessoas na sexta-feira',
        timestamp: '10 Nov, 12:10',
        status: 'Convertido'
      },
    ];
  });

  const resolveEffectiveCategory = (lead: LeadItem, modeOverride?: string) => {
    const mode = modeOverride ?? followUpCategoryMode;
    if (mode === 'lead') return lead.category || accountSettingsData.category;
    if (mode === 'account') return accountSettingsData.category;
    return mode;
  };

  const handleGenerateFollowUpForLead = async (
    lead: LeadItem,
    customTone?: 'Consultivo & Acolhedor' | 'Promocional com Cupom' | 'Executivo Rápido',
    customCategoryMode?: string
  ) => {
    const activeTone = customTone || followUpTone;
    const targetCategory = resolveEffectiveCategory(lead, customCategoryMode);
    setIsGeneratingFollowUpId(lead.id);
    setSelectedLeadIdForFollowUp(lead.id);

    const generated = await askGeminiLeadFollowUp(
      lead.customerName,
      lead.adTitle,
      targetCategory,
      accountSettingsData.businessName,
      activeTone,
      lead.customerInquiry
    );

    const newDraft: LeadFollowUpDraft = {
      subject: generated.subject,
      body: generated.body,
      categoryUsed: targetCategory,
      tone: activeTone,
      generatedAt: 'Agora mesmo via Gemini IA',
      status: 'Rascunho IA Pronto',
      categoryStrategyNote: generated.categoryStrategyNote
    };

    setLeads(prev =>
      prev.map(item => (item.id === lead.id ? { ...item, aiFollowUpDraft: newDraft } : item))
    );
    setIsGeneratingFollowUpId(null);
    setFollowUpBannerFeedback(`Rascunho personalizado gerado para ${lead.customerName} (${targetCategory})!`);
    setTimeout(() => setFollowUpBannerFeedback(null), 4000);
  };

  const handleToggleAutoFollowUp = async () => {
    const nextState = !autoFollowUpEnabled;
    setAutoFollowUpEnabled(nextState);

    if (nextState) {
      setFollowUpBannerFeedback('Auto-Follow-up IA Ativado! Novos leads receberão rascunhos personalizados por categoria automaticamente.');
      // Automatically draft for any lead without a draft
      const pendingLeads = leads.filter(l => !l.aiFollowUpDraft);
      for (const lead of pendingLeads) {
        const targetCategory = resolveEffectiveCategory(lead);
        const generated = generateCategoryFollowUpFallback(
          lead.customerName,
          lead.adTitle,
          targetCategory,
          accountSettingsData.businessName,
          followUpTone,
          lead.customerInquiry
        );
        setLeads(prev =>
          prev.map(item =>
            item.id === lead.id
              ? {
                  ...item,
                  aiFollowUpDraft: {
                    subject: generated.subject,
                    body: generated.body,
                    categoryUsed: targetCategory,
                    tone: followUpTone,
                    generatedAt: 'Gerado pelo Auto-Follow-up IA',
                    status: 'Rascunho IA Pronto',
                    categoryStrategyNote: generated.categoryStrategyNote
                  }
                }
              : item
          )
        );
      }
    } else {
      setFollowUpBannerFeedback('Auto-Follow-up IA Pausado. Os rascunhos de e-mail agora só serão gerados sob demanda.');
    }
    setTimeout(() => setFollowUpBannerFeedback(null), 4500);
  };

  const handleUpdateDraftContent = (leadId: string, field: 'subject' | 'body', value: string) => {
    setLeads(prev =>
      prev.map(lead => {
        if (lead.id !== leadId || !lead.aiFollowUpDraft) return lead;
        return {
          ...lead,
          aiFollowUpDraft: {
            ...lead.aiFollowUpDraft,
            [field]: value
          }
        };
      })
    );
  };

  const handleApproveAndSendFollowUp = (leadId: string) => {
    const targetLead = leads.find(l => l.id === leadId);
    if (!targetLead || !targetLead.aiFollowUpDraft) return;

    setLeads(prev =>
      prev.map(lead => {
        if (lead.id !== leadId || !lead.aiFollowUpDraft) return lead;
        return {
          ...lead,
          status: lead.status === 'Novo' ? 'Em Atendimento' : lead.status,
          aiFollowUpDraft: {
            ...lead.aiFollowUpDraft,
            status: 'Enviado',
            generatedAt: 'Enviado agora para ' + lead.email
          }
        };
      })
    );
    addXp(80, `Auto-Follow-up IA Enviado (${targetLead.customerName})`);
    setFollowUpBannerFeedback(`E-mail de Follow-up enviado com sucesso para ${targetLead.customerName} (${targetLead.email})!`);
    setTimeout(() => setFollowUpBannerFeedback(null), 4500);
  };

  const handleCopyFollowUpDraft = (lead: LeadItem) => {
    if (!lead.aiFollowUpDraft) return;
    const fullText = `Assunto: ${lead.aiFollowUpDraft.subject}\n\n${lead.aiFollowUpDraft.body}`;
    navigator.clipboard.writeText(fullText);
    setCopiedFollowUpId(lead.id);
    setTimeout(() => setCopiedFollowUpId(null), 2500);
  };

  const handleSimulateIncomingLead = async () => {
    const sampleIncomingLeads = [
      {
        customerName: 'Juliana M. Fontes',
        email: 'juliana.fontes@sorocaba.net.br',
        phone: '(15) 99812-3344',
        adTitle: 'Centro Automotivo Premium - Revisão Completa',
        category: 'Oficinas & Automotivo',
        customerInquiry: 'Orçamento de revisão de 40.000km + alinhamento 3D para SUV'
      },
      {
        customerName: 'Patrícia Alencar',
        email: 'patricia.alencar@estetica-sorocaba.com',
        phone: '(15) 99601-5522',
        adTitle: 'Clínica Lumina Estética & Laser Campolim',
        category: 'Saúde & Estética',
        customerInquiry: 'Disponibilidade para avaliação de harmonização e bioestimulador nesta quinta'
      },
      {
        customerName: 'Eduardo C. Tavares',
        email: 'eduardo.tavares@grupovotorantim.com.br',
        phone: '(15) 99744-9010',
        adTitle: 'Restaurante Sabor & Fogo - Almoço Executivo',
        category: 'Restaurantes & Gastronomia',
        customerInquiry: 'Reserva de mesa no terraço para jantar de aniversário (8 convidados)'
      },
      {
        customerName: 'Sônia & Família Almeida',
        email: 'sonia.almeida.sro@gmail.com',
        phone: '(15) 99108-6262',
        adTitle: 'Residencial Sênior Acolher',
        category: 'Casa de Repouso & Cuidado',
        customerInquiry: 'Gostaria de agendar visita presencial para conhecer a ala de reabilitação'
      }
    ];

    const pick = sampleIncomingLeads[leads.length % sampleIncomingLeads.length];
    const newId = `l_${Date.now()}`;
    const newLead: LeadItem = {
      id: newId,
      customerName: pick.customerName,
      email: pick.email,
      phone: pick.phone,
      adTitle: pick.adTitle,
      category: pick.category,
      customerInquiry: pick.customerInquiry,
      timestamp: 'Agora mesmo',
      status: 'Novo'
    };

    setLeads(prev => [newLead, ...prev]);
    setSelectedLeadIdForFollowUp(newId);

    void dispatchOwnerLeadEmailNotification({
      businessName: accountSettingsData.businessName,
      channel: leads.length % 2 === 0 ? 'Formulário de WhatsApp' : 'Formulário da Landing Page',
      leadName: newLead.customerName,
      leadPhone: newLead.phone,
      leadEmail: newLead.email,
      serviceOrSubject: newLead.adTitle,
      message: newLead.customerInquiry,
      neighborhood: accountSettingsData.address
    });

    if (autoFollowUpEnabled) {
      setIsGeneratingFollowUpId(newId);
      const targetCategory = resolveEffectiveCategory(newLead);
      const generated = await askGeminiLeadFollowUp(
        newLead.customerName,
        newLead.adTitle,
        targetCategory,
        accountSettingsData.businessName,
        followUpTone,
        newLead.customerInquiry
      );
      const autoDraft: LeadFollowUpDraft = {
        subject: generated.subject,
        body: generated.body,
        categoryUsed: targetCategory,
        tone: followUpTone,
        generatedAt: 'Gerado automaticamente no recebimento (Auto-Follow-up IA)',
        status: 'Rascunho IA Pronto',
        categoryStrategyNote: generated.categoryStrategyNote
      };
      setLeads(prev =>
        prev.map(item => (item.id === newId ? { ...item, aiFollowUpDraft: autoDraft } : item))
      );
      setIsGeneratingFollowUpId(null);
      setFollowUpBannerFeedback(
        `Novo lead capturado (${newLead.customerName})! O Auto-Follow-up IA já redigiu a resposta para "${targetCategory}".`
      );
      setTimeout(() => setFollowUpBannerFeedback(null), 5000);
    } else {
      setFollowUpBannerFeedback(
        `Novo lead capturado (${newLead.customerName}). Ative o Auto-Follow-up IA ou clique em "Gerar E-mail IA" para redigir a resposta.`
      );
      setTimeout(() => setFollowUpBannerFeedback(null), 4500);
    }
  };

  // High-traffic Campaign Scheduling State (Leveraging Real-Time Platform Data)
  const [campaignSchedules, setCampaignSchedules] = useState([
    { id: '1', adTitle: 'Restaurante Sabor & Fogo - Almoço Executivo', peakHours: '11:30 - 14:30', days: 'Segunda a Sexta (Pico de Almoço)', boostMultiplier: '+35% Orçamento IA nos Picos', status: 'Ativo' },
    { id: '2', adTitle: 'Residencial Sênior Acolher - Vagas', peakHours: '18:00 - 21:00', days: 'Todos os Dias (Pico Noturno)', boostMultiplier: '+25% Orçamento IA nos Picos', status: 'Ativo' },
  ]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newScheduleAdId, setNewScheduleAdId] = useState('1');
  const [newScheduleTime, setNewScheduleTime] = useState('11:30 - 14:30 (Pico de Almoço)');
  const [newScheduleDays, setNewScheduleDays] = useState('Segunda a Sexta');
  const [newScheduleBoost, setNewScheduleBoost] = useState('+35% Orçamento Inteligente');

  // Leveling System & GuiaPonto Pro Status Tiers XP State
  const [userXp, setUserXp] = useState(2450);
  const [userLevel, setUserLevel] = useState(7);
  const [xpToNextLevel, setXpToNextLevel] = useState(3000);
  const [xpToast, setXpToast] = useState<{ message: string; points: number } | null>(null);

  const addXp = (points: number, actionName: string) => {
    const newXp = userXp + points;
    setUserXp(newXp);
    if (newXp >= xpToNextLevel) {
      const nextLvl = userLevel + 1;
      setUserLevel(nextLvl);
      setXpToNextLevel(prev => prev + 1000);
      triggerAchievementCelebration({
        type: 'level_up',
        title: `Nível ${nextLvl} Alcançado • GuiaPonto Pro!`,
        subtitle: `Marco de Evolução: ${newXp.toLocaleString('pt-BR')} XP Acumulados`,
        description: `Parabéns! Sua empresa subiu para o Nível ${nextLvl} no ecossistema GuiaPonto Sorocaba após concluir: "${actionName}".`,
        xpEarned: points,
        rarity: 'Lendário',
        trustBoostLabel: '+35% Prioridade nas Buscas Locais'
      });
    }
    setXpToast({ message: actionName, points });
    setTimeout(() => setXpToast(null), 4000);
  };

  const handleCompleteMilestone = (milestoneId: number) => {
    const targetMilestone = reputationData.milestones.find(m => m.id === milestoneId);
    if (!targetMilestone) return;

    const wasAlreadyCompleted = targetMilestone.progress === 100;
    const bonusXp = wasAlreadyCompleted ? 150 : 350;

    if (!wasAlreadyCompleted) {
      setReputationData(prev => ({
        ...prev,
        score: Math.min(100, prev.score + 2),
        milestones: prev.milestones.map(m =>
          m.id === milestoneId
            ? { ...m, progress: 100, status: 'Concluído • Auditado' }
            : m
        )
      }));
    }

    const newXp = userXp + bonusXp;
    setUserXp(newXp);
    if (newXp >= xpToNextLevel) {
      setUserLevel(prev => prev + 1);
      setXpToNextLevel(prev => prev + 1000);
    }
    setXpToast({ message: `Marco Concluído: ${targetMilestone.title}`, points: bonusXp });
    setTimeout(() => setXpToast(null), 4000);

    triggerAchievementCelebration({
      type: 'milestone',
      title: targetMilestone.title,
      subtitle: 'Meta Oficial do Lojista Concluída (100%)',
      description: `Sua empresa atingiu 100% da meta "${targetMilestone.title}" em Sorocaba, elevando seu Score de Reputação e visibilidade orgânica!`,
      xpEarned: bonusXp,
      rarity: 'Ouro',
      trustBoostLabel: '+20% Destaque no Diretório Sorocaba'
    });
  };

  const statusTiers = [
    { level: 3, name: 'GuiaPonto Pro Bronze', xpRequired: 1000, reward: 'Selo de Anunciante Verificado & Suporte Prioritário', unlocked: true, icon: '🥉' },
    { level: 5, name: 'GuiaPonto Pro Silver', xpRequired: 2000, reward: 'Badge Exclusiva "Top Creator" + 2x Visibilidade', unlocked: true, icon: '🥈' },
    { level: 7, name: 'GuiaPonto Pro Gold', xpRequired: 2450, reward: 'Badge "AI Master" + Prioridade Máxima no Google', unlocked: true, icon: '🥇' },
    { level: 10, name: 'GuiaPonto Pro Legend & VIP', xpRequired: 4000, reward: 'Selo Diamante Regional + Gerente de Conta Dedicado', unlocked: false, icon: '💎' },
  ];

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAd = ads.find(a => a.id === newScheduleAdId) || ads[0];
    const newSched = {
      id: String(Date.now()),
      adTitle: selectedAd ? selectedAd.title : 'Campanha de Alta Performance',
      peakHours: newScheduleTime,
      days: newScheduleDays,
      boostMultiplier: newScheduleBoost,
      status: 'Ativo' as const
    };
    setCampaignSchedules([newSched, ...campaignSchedules]);
    setShowScheduleModal(false);
    addXp(100, 'Agendamento Inteligente de Pico');
  };

  const toggleScheduleStatus = (id: string) => {
    setCampaignSchedules(campaignSchedules.map(s => s.id === id ? { ...s, status: s.status === 'Ativo' ? 'Pausado' : 'Ativo' } : s));
  };

  const deleteSchedule = (id: string) => {
    setCampaignSchedules(campaignSchedules.filter(s => s.id !== id));
  };

  // Industry Trends (Gemini IA) Widget State & Handlers
  const [trendCategory, setTrendCategory] = useState<string>('Restaurantes & Gastronomia');
  const [isAnalyzingTrends, setIsAnalyzingTrends] = useState<boolean>(false);
  const [industryTrendsData, setIndustryTrendsData] = useState<IndustryTrendsResult>(() =>
    generateSimulatedIndustryTrends('Restaurantes & Gastronomia', 'Campolim, Sorocaba - SP')
  );
  const [trendCopyToast, setTrendCopyToast] = useState<string | null>(null);
  const [trendAppliedToast, setTrendAppliedToast] = useState<boolean>(false);

  const handleRefreshTrends = async (cat?: string) => {
    const targetCat = cat || trendCategory;
    setIsAnalyzingTrends(true);
    try {
      const result = await askGeminiIndustryTrends(targetCat, 'Campolim, Sorocaba - SP');
      setIndustryTrendsData(result);
      addXp(100, `Análise de Tendências Gemini (${targetCat})`);
    } catch {
      setIndustryTrendsData(generateSimulatedIndustryTrends(targetCat, 'Campolim, Sorocaba - SP'));
    } finally {
      setIsAnalyzingTrends(false);
    }
  };

  const handleApplyTrendToActiveAd = () => {
    if (!industryTrendsData) return;
    setAds(prev => prev.map((ad, idx) => {
      if (idx === 0) {
        return {
          ...ad,
          title: industryTrendsData.suggestedHeadline
        };
      }
      return ad;
    }));
    setTrendAppliedToast(true);
    addXp(120, 'Otimização do Anúncio com Tendências Gemini');
    setTimeout(() => {
      setTrendAppliedToast(false);
    }, 4500);
  };

  const handleCopyTrendText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setTrendCopyToast(`${label} copiado com sucesso!`);
    setTimeout(() => {
      setTrendCopyToast(null);
    }, 3000);
  };

  // ================= VISUAL CALENDAR-STYLE SCHEDULER STATE & HANDLERS =================
  const [calendarSchedules, setCalendarSchedules] = useState<CalendarSlotSchedule[]>([
    {
      id: 'cs-1',
      adId: '1',
      adTitle: 'Restaurante Sabor & Fogo - Almoço Executivo',
      adCategory: 'Restaurantes & Gastronomia',
      day: 'Seg',
      timeSlotId: 'lunch',
      boostMultiplier: '+35% Orçamento IA',
      status: 'Ativo',
      expectedClicks: 145
    },
    {
      id: 'cs-2',
      adId: '1',
      adTitle: 'Restaurante Sabor & Fogo - Almoço Executivo',
      adCategory: 'Restaurantes & Gastronomia',
      day: 'Qua',
      timeSlotId: 'lunch',
      boostMultiplier: '+35% Orçamento IA',
      status: 'Ativo',
      expectedClicks: 160
    },
    {
      id: 'cs-3',
      adId: '1',
      adTitle: 'Restaurante Sabor & Fogo - Almoço Executivo',
      adCategory: 'Restaurantes & Gastronomia',
      day: 'Sex',
      timeSlotId: 'dinner',
      boostMultiplier: '+40% Orçamento IA',
      status: 'Ativo',
      expectedClicks: 195
    },
    {
      id: 'cs-4',
      adId: '2',
      adTitle: 'Residencial Sênior Acolher - Vagas Disponíveis',
      adCategory: 'Casa de Repouso & Cuidado',
      day: 'Ter',
      timeSlotId: 'morning',
      boostMultiplier: '+20% Orçamento IA',
      status: 'Ativo',
      expectedClicks: 90
    },
    {
      id: 'cs-5',
      adId: '3',
      adTitle: 'Oficina Mecânica Precision Car - Revisão Completa',
      adCategory: 'Oficinas & Automotivo',
      day: 'Qui',
      timeSlotId: 'morning',
      boostMultiplier: '+25% Orçamento IA',
      status: 'Ativo',
      expectedClicks: 115
    }
  ]);

  const [draggedAdId, setDraggedAdId] = useState<string | null>(null);
  const [dragOverCellKey, setDragOverCellKey] = useState<string | null>(null);
  const [calendarViewDay, setCalendarViewDay] = useState<string>('todos');
  const [calendarOnlyPeaks, setCalendarOnlyPeaks] = useState<boolean>(false);
  const [calendarToastMessage, setCalendarToastMessage] = useState<string | null>(null);
  const [quickAddModalSlot, setQuickAddModalSlot] = useState<{ day: 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sáb' | 'Dom'; slotId: string } | null>(null);

  const handleDragStart = (e: React.DragEvent, adId: string) => {
    setDraggedAdId(adId);
    e.dataTransfer.setData('text/plain', adId);
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  const handleDragEnd = () => {
    setDraggedAdId(null);
    setDragOverCellKey(null);
  };

  const handleDragOver = (e: React.DragEvent, cellKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (dragOverCellKey !== cellKey) {
      setDragOverCellKey(cellKey);
    }
  };

  const handleDragLeave = (cellKey: string) => {
    if (dragOverCellKey === cellKey) {
      setDragOverCellKey(null);
    }
  };

  const handleDropOnSlot = (day: 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sáb' | 'Dom', timeSlotId: string) => {
    setDragOverCellKey(null);
    if (!draggedAdId) return;

    const targetAd = ads.find(a => a.id === draggedAdId);
    if (!targetAd) {
      setDraggedAdId(null);
      return;
    }

    const exists = calendarSchedules.some(s => s.adId === targetAd.id && s.day === day && s.timeSlotId === timeSlotId);
    if (exists) {
      setCalendarToastMessage(`"${targetAd.title.split(' - ')[0]}" já está agendado neste horário!`);
      setTimeout(() => setCalendarToastMessage(null), 3000);
      setDraggedAdId(null);
      return;
    }

    const slotDef = HIGH_TRAFFIC_TIME_SLOTS.find(s => s.id === timeSlotId);
    const newSchedule: CalendarSlotSchedule = {
      id: `cs-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      adId: targetAd.id,
      adTitle: targetAd.title,
      adCategory: targetAd.category,
      day,
      timeSlotId,
      boostMultiplier: slotDef?.suggestedBoost || '+30% Orçamento IA',
      status: 'Ativo',
      expectedClicks: Math.round(110 + (slotDef?.trafficIndex || 70) * 0.8)
    };

    setCalendarSchedules(prev => [newSchedule, ...prev]);
    addXp(80, `Agendamento de "${targetAd.title.split(' - ')[0]}" em Horário de Pico (${day})`);
    setCalendarToastMessage(`Campanha "${targetAd.title.split(' - ')[0]}" agendada com sucesso para ${day} (${slotDef?.hours})! (+80 XP)`);
    setTimeout(() => setCalendarToastMessage(null), 4000);
    setDraggedAdId(null);
  };

  const handleAssignAdToSlot = (adId: string, day: 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sáb' | 'Dom', timeSlotId: string) => {
    const targetAd = ads.find(a => a.id === adId);
    if (!targetAd) return;

    const exists = calendarSchedules.some(s => s.adId === targetAd.id && s.day === day && s.timeSlotId === timeSlotId);
    if (exists) {
      setCalendarToastMessage(`"${targetAd.title.split(' - ')[0]}" já está agendado neste horário!`);
      setTimeout(() => setCalendarToastMessage(null), 3000);
      setQuickAddModalSlot(null);
      return;
    }

    const slotDef = HIGH_TRAFFIC_TIME_SLOTS.find(s => s.id === timeSlotId);
    const newSchedule: CalendarSlotSchedule = {
      id: `cs-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      adId: targetAd.id,
      adTitle: targetAd.title,
      adCategory: targetAd.category,
      day,
      timeSlotId,
      boostMultiplier: slotDef?.suggestedBoost || '+30% Orçamento IA',
      status: 'Ativo',
      expectedClicks: Math.round(110 + (slotDef?.trafficIndex || 70) * 0.8)
    };

    setCalendarSchedules(prev => [newSchedule, ...prev]);
    addXp(80, `Agendamento de "${targetAd.title.split(' - ')[0]}" em Horário de Pico (${day})`);
    setCalendarToastMessage(`Campanha "${targetAd.title.split(' - ')[0]}" agendada para ${day} (${slotDef?.hours})! (+80 XP)`);
    setTimeout(() => setCalendarToastMessage(null), 4000);
    setQuickAddModalSlot(null);
  };

  const handleDeleteCalendarSchedule = (scheduleId: string) => {
    setCalendarSchedules(prev => prev.filter(s => s.id !== scheduleId));
  };

  const handleToggleScheduleActive = (scheduleId: string) => {
    setCalendarSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, status: s.status === 'Ativo' ? 'Pausado' : 'Ativo' } : s));
  };

  const handleAutoScheduleAllWithAi = () => {
    const activeAds = ads.filter(a => a.status === 'Ativo');
    if (activeAds.length === 0) return;

    const optimalSchedules: CalendarSlotSchedule[] = [];
    activeAds.forEach((ad, i) => {
      if (ad.category.includes('Restaurante') || ad.category.includes('Gastronomia')) {
        (['Seg', 'Qua', 'Sex', 'Sáb', 'Dom'] as const).forEach(d => {
          optimalSchedules.push({
            id: `ai-sched-${d}-lunch-${ad.id}`,
            adId: ad.id,
            adTitle: ad.title,
            adCategory: ad.category,
            day: d,
            timeSlotId: 'lunch',
            boostMultiplier: '+35% Orçamento IA',
            status: 'Ativo',
            expectedClicks: 165
          });
          optimalSchedules.push({
            id: `ai-sched-${d}-dinner-${ad.id}`,
            adId: ad.id,
            adTitle: ad.title,
            adCategory: ad.category,
            day: d,
            timeSlotId: 'dinner',
            boostMultiplier: '+40% Orçamento IA',
            status: 'Ativo',
            expectedClicks: 190
          });
        });
      } else {
        (['Seg', 'Ter', 'Qui', 'Sex'] as const).forEach(d => {
          optimalSchedules.push({
            id: `ai-sched-${d}-peak-${ad.id}`,
            adId: ad.id,
            adTitle: ad.title,
            adCategory: ad.category,
            day: d,
            timeSlotId: i % 2 === 0 ? 'morning' : 'afternoon',
            boostMultiplier: '+25% Orçamento IA',
            status: 'Ativo',
            expectedClicks: 120
          });
        });
      }
    });

    setCalendarSchedules(optimalSchedules);
    addXp(150, 'Otimização Preditiva Completa do Calendário de Picos (IA)');
    setCalendarToastMessage('✨ Inteligência Artificial preencheu seu calendário semanal com distribuição ótima de lances para horários de pico! (+150 XP)');
    setTimeout(() => setCalendarToastMessage(null), 5000);
  };

  // Cacilda AI Studio & Editor State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState<'persuasivo' | 'direto' | 'divertido' | 'institucional'>('persuasivo');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);

  const [aiGeneratedAd, setAiGeneratedAd] = useState({
    title: 'Clínica Odontológica Sorria Mais - Implantes',
    category: 'Saúde & Estética',
    price: 'Avaliação Gratuita',
    description: 'Recupere sua autoestima com implantes dentários de última geração. Atendimento humanizado, parcelamento em até 12x e garantia total. Fale conosco no WhatsApp agora!',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
    tags: ['Implantes', 'Ortodontia', 'Urgência 24h']
  });

  const handleRunAiGeneration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsGeneratingAI(true);

    setTimeout(() => {
      let title = `${aiPrompt} - Destaque Exclusivo`;
      let cat = 'Serviços Profissionais';
      let price = 'Sob Consulta';
      let desc = `Oferecemos o melhor serviço em ${aiPrompt} com foco em excelência e satisfação do cliente. Entre em contato direto pelo WhatsApp e garanta condições especiais.`;
      let img = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80';

      const lower = aiPrompt.toLowerCase();
      if (lower.includes('pizzaria') || lower.includes('restaurante') || lower.includes('comida')) {
        title = 'Restaurante & Pizzaria Artesanal Sabor Total';
        cat = 'Restaurantes & Gastronomia';
        price = 'R$ 49,90';
        desc = 'Massas artesanais, forno a lenha e ingredientes selecionados. Peça já o seu delivery ou reserve sua mesa pelo WhatsApp!';
        img = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80';
      } else if (lower.includes('imóvel') || lower.includes('imobiliária')) {
        title = 'Imobiliária Prime - Apartamentos de Alto Padrão';
        cat = 'Imobiliárias & Arquitetura';
        price = 'A partir de R$ 420.000';
        desc = 'Encontre o imóvel ideal na melhor localização da cidade. Financiamento facilitado e atendimento personalizado.';
        img = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80';
      }

      setAiGeneratedAd({ title, category: cat, price, description: desc, image: img, tags: ['Alta Conversão', 'Verificado', 'WhatsApp'] });
      setIsGeneratingAI(false);
    }, 1200);
  };

  const startEditingAd = (ad: AdItem) => {
    setEditingAdId(ad.id);
    setAiGeneratedAd({
      title: ad.title,
      category: ad.category,
      price: ad.price,
      description: 'Anúncio otimizado para alta conversão na rede GuiaPonto.',
      image: ad.image,
      tags: ['Destaque', 'Verificado']
    });
    setAiPrompt(ad.title);
    setActiveTab('aiStudio');
  };

  const publishAiAd = () => {
    if (editingAdId) {
      setAds(ads.map(ad => ad.id === editingAdId ? {
        ...ad,
        title: aiGeneratedAd.title,
        category: aiGeneratedAd.category,
        price: aiGeneratedAd.price,
        image: aiGeneratedAd.image
      } : ad));
      setEditingAdId(null);
    } else {
      const newAdItem: AdItem = {
        id: String(Date.now()),
        title: aiGeneratedAd.title,
        category: aiGeneratedAd.category,
        price: aiGeneratedAd.price,
        status: 'Ativo',
        clicks: 0,
        impressions: 25,
        image: aiGeneratedAd.image,
        createdAt: 'Hoje'
      };
      setAds([newAdItem, ...ads]);
    }
    setActiveTab('ads');
    addXp(150, editingAdId ? 'Atualização de Copy de Anúncio com IA' : 'Criação de Anúncio com IA');
  };

  const toggleStatus = (id: string) => {
    setAds(ads.map(ad => {
      if (ad.id === id) {
        const nextStatus = ad.status === 'Ativo' ? 'Pausado' : 'Ativo';
        return { ...ad, status: nextStatus };
      }
      return ad;
    }));
  };

  const deleteAd = (id: string) => {
    setAds(ads.filter(ad => ad.id !== id));
  };

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) || ad.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || ad.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeAdsCount = ads.filter(a => a.status === 'Ativo').length;
  const totalClicks = ads.reduce((acc, curr) => acc + curr.clicks, 0);
  const totalImpressions = ads.reduce((acc, curr) => acc + curr.impressions, 0);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({ ...userProfile, savedSuccess: true });
    setTimeout(() => {
      setUserProfile(prev => ({ ...prev, savedSuccess: false }));
    }, 3000);
  };

  // Estimated Revenue Projection Calculations
  const historicalCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100) : 4.8;
  const effectiveCtr = projectionAiTurbo ? historicalCtr * 1.25 : historicalCtr;
  const projectedClicks = Math.round(projectionMonthlyImpressions * (effectiveCtr / 100));
  const clickToLeadRate = projectionAiTurbo ? 17.5 : 14.8;
  const projectedLeads = Math.round(projectedClicks * (clickToLeadRate / 100));
  const effectiveClosingRate = projectionAiTurbo ? Math.min(projectionClosingRate * 1.2, 85) : projectionClosingRate;
  const projectedClosedSales = Math.round(projectedLeads * (effectiveClosingRate / 100));
  const projectedMonthlyRevenue = projectedClosedSales * projectionTicket;
  const projectedAnnualRevenue = projectedMonthlyRevenue * 12;
  const planMonthlyCost = 99;
  const projectedRoi = projectedMonthlyRevenue > 0 ? Math.round(((projectedMonthlyRevenue - planMonthlyCost) / planMonthlyCost) * 100) : 0;

  // SEO Optimizer Handlers
  const handleRunSeoOptimizer = async () => {
    setIsGeneratingSeo(true);
    const selectedAd = ads.find(a => a.id === seoSelectedAdId) || ads[0];
    const result = await askGeminiSeo(selectedAd ? selectedAd.title : 'GuiaPonto Destaque', selectedAd ? selectedAd.category : 'Serviços', seoKeywords, seoLocation);
    setSeoGeneratedResult(result);
    setSelectedMetaTitleIndex(0);
    setSelectedMetaDescIndex(0);
    setIsGeneratingSeo(false);
    addXp(100, 'Geração de Otimização SEO com IA');
  };

  const handleAddSeoKeyword = (kw?: string) => {
    const val = (kw || seoNewKeywordInput).trim();
    if (val && !seoKeywords.includes(val)) {
      setSeoKeywords(prev => [...prev, val]);
      if (!kw) setSeoNewKeywordInput('');
    }
  };

  const handleRemoveSeoKeyword = (indexToRemove: number) => {
    setSeoKeywords(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleCopySeoText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setSeoCopiedToast(`${label} copiado para a área de transferência!`);
    setTimeout(() => setSeoCopiedToast(null), 3000);
  };

  const handleApplySeoToProfile = () => {
    setSeoAppliedSuccess(true);
    addXp(120, 'Aplicação de Meta Tags SEO no Perfil');
    setTimeout(() => setSeoAppliedSuccess(false), 4000);
  };

  return (
    <div className={`min-h-screen flex font-sans antialiased relative transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* 1) Sidebar de Escritório Completa - Oculta no Modo Foco */}
      {!isFocusMode && (
        <aside className={`w-72 flex flex-col justify-between hidden md:flex shrink-0 border-r transition-colors backdrop-blur-md ${isDarkMode ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-slate-900/95 border-slate-800 text-slate-300'}`}>
          <div>
            {/* Logo & Brand + Quick Back to Home */}
            <div className="p-6 border-b border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FE3A18] text-white flex items-center justify-center font-black text-base shadow-lg shadow-[#FE3A18]/30">
                    GP
                  </div>
                  <div>
                    <span className="text-lg font-extrabold text-white tracking-tight">GuiaPonto</span>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Escritório • Executive Suite</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-[#FE3A18] text-white border border-white/10 hover:border-[#FE3A18] text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar para a Home</span>
                </button>
                {onOpenAdminPanel && (
                  <button
                    type="button"
                    onClick={onOpenAdminPanel}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-indigo-950/90 hover:bg-indigo-900 text-emerald-300 border border-indigo-500/40 text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Abrir Painel Admin Master</span>
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="p-4 space-y-1.5">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'overview' ? 'bg-[#FE3A18] text-white shadow-lg shadow-[#FE3A18]/25' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Visão Geral & Gráficos</span>
              </button>

              <button
                onClick={() => setActiveTab('ads')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'ads' ? 'bg-[#FE3A18] text-white shadow-lg shadow-[#FE3A18]/25' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Megaphone className="w-5 h-5" />
                <span>Meus Anúncios</span>
                <span className="ml-auto bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-xs font-bold">{ads.length}</span>
              </button>

              <button
                onClick={() => { setEditingAdId(null); setActiveTab('aiStudio'); }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'aiStudio' ? 'bg-[#FE3A18] text-white shadow-lg shadow-[#FE3A18]/25' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span>Criador & Editor IA Studio</span>
                <span className="ml-auto bg-[#FE3A18]/20 text-[#FE3A18] px-1.5 py-0.5 rounded text-[10px] font-black uppercase">PRO</span>
              </button>

              <button
                onClick={() => setActiveTab('gamification')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'gamification' ? 'bg-[#FE3A18] text-white shadow-lg shadow-[#FE3A18]/25' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Award className="w-5 h-5" />
                <span>Reputação & Conquistas</span>
                <span className="ml-auto bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-xs font-bold">{reputationData.score} pts</span>
              </button>

              <button
                onClick={() => setActiveTab('leads')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'leads' ? 'bg-[#FE3A18] text-white shadow-lg shadow-[#FE3A18]/25' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Leads WhatsApp</span>
                <span className="ml-auto bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs font-bold">{leads.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'reviews' ? 'bg-[#FE3A18] text-white shadow-lg shadow-[#FE3A18]/25' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Star className="w-5 h-5 text-amber-400" />
                <span>Gestão de Avaliações</span>
                <span className="ml-auto bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">IA</span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'reports' ? 'bg-[#FE3A18] text-white shadow-lg shadow-[#FE3A18]/25' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Relatórios e Performance</span>
              </button>

              <button
                onClick={() => setActiveTab('billing')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'billing' ? 'bg-[#FE3A18] text-white shadow-lg shadow-[#FE3A18]/25' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Planos & Monetização</span>
                <span className="ml-auto bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded text-[10px] font-black uppercase">ROI</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'settings' ? 'bg-[#FE3A18] text-white shadow-lg shadow-[#FE3A18]/25' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Perfil e Foto</span>
              </button>

              <button
                onClick={() => setActiveTab('accountSettings')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'accountSettings' ? 'bg-[#FE3A18] text-white shadow-lg shadow-[#FE3A18]/25' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Configurações de Conta</span>
              </button>

              <button
                onClick={() => { setActiveTab('aiSuggestions'); if (!aiOptimizationSuggestions) fetchOptimizationSuggestions(); }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'aiSuggestions' ? 'bg-[#FE3A18] text-white shadow-lg shadow-[#FE3A18]/25' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>IA Sugestões de Otimização</span>
                <span className="ml-auto bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-black uppercase">GEMINI</span>
              </button>

              <button
                onClick={() => setActiveTab('partners')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'partners' ? 'bg-[#FE3A18] text-white shadow-lg shadow-[#FE3A18]/25' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-5 h-5 text-emerald-400" />
                <span>Indique & Parceiros</span>
                <span className="ml-auto bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded text-[10px] font-black uppercase">+500 XP</span>
              </button>

              <button
                onClick={() => setActiveTab('seoOptimizer')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'seoOptimizer' ? 'bg-[#FE3A18] text-white shadow-lg shadow-[#FE3A18]/25' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-5 h-5 text-sky-400" />
                <span>Otimizador de SEO</span>
                <span className="ml-auto bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded text-[10px] font-black uppercase">GOOGLE</span>
              </button>
            </nav>
          </div>

          {/* User Profile & Back to site */}
          <div className="p-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-3 px-3.5 py-3 bg-slate-800/60 rounded-2xl">
              <img src={userProfile.avatar} alt={userProfile.name} className="w-10 h-10 rounded-full object-cover border border-[#FE3A18]" />
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-white truncate">{userProfile.name}</span>
                <span className="block text-[10px] text-emerald-400 font-semibold truncate flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verificado
                </span>
              </div>
            </div>

            <button
              onClick={onBackToHome}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para a Home</span>
            </button>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header */}
        <header className={`border-b h-20 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30 shadow-xs backdrop-blur-md transition-colors ${isDarkMode ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white/80 border-slate-200/80 text-slate-900'}`}>
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Always-visible Back to Home Button in the Office Top Bar */}
            <button
              type="button"
              onClick={onBackToHome}
              className={`px-3.5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer border shadow-xs ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-[#FE3A18] text-white border-slate-700 hover:border-[#FE3A18]'
                  : 'bg-slate-100 hover:bg-[#FE3A18] text-slate-800 hover:text-white border-slate-200/80 hover:border-[#FE3A18]'
              }`}
              title="Voltar para a Home"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Voltar para a Home</span>
            </button>

            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setDashboardMobileMenuOpen(!dashboardMobileMenuOpen)}
                className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}
                title="Menu de Abas"
              >
                {dashboardMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Menu Dropdown for Dashboard Tabs */}
            {dashboardMobileMenuOpen && (
              <div className="md:hidden absolute top-20 left-0 right-0 bg-slate-900 border-b border-slate-800 text-white shadow-2xl z-50 p-6 space-y-2 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-black text-sm text-white">Menu Executivo GuiaPonto</span>
                  <button onClick={() => setDashboardMobileMenuOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-[#FE3A18] text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar para a Home</span>
                </button>
                <div className="space-y-1.5 pt-2 max-h-[70vh] overflow-y-auto">
                  {[
                    { id: 'overview', label: 'Visão Geral & Gráficos', icon: LayoutDashboard },
                    { id: 'ads', label: 'Meus Anúncios', icon: Megaphone },
                    { id: 'aiStudio', label: 'Criador & Editor IA Studio', icon: Sparkles },
                    { id: 'gamification', label: 'Reputação & Conquistas', icon: Award },
                    { id: 'leads', label: 'Leads WhatsApp', icon: MessageSquare },
                    { id: 'reviews', label: 'Gestão de Avaliações (IA)', icon: Star },
                    { id: 'reports', label: 'Relatórios e Performance', icon: BarChart3 },
                    { id: 'billing', label: 'Planos e Assinatura', icon: CreditCard },
                    { id: 'settings', label: 'Perfil e Foto', icon: Settings },
                    { id: 'accountSettings', label: 'Configurações de Conta', icon: Settings },
                    { id: 'aiSuggestions', label: 'IA Sugestões de Otimização', icon: Sparkles },
                    { id: 'partners', label: 'Rede de Parceiros', icon: Users },
                    { id: 'seoOptimizer', label: 'Otimizador de SEO', icon: Globe },
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id as any); setDashboardMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeTab === tab.id ? 'bg-[#FE3A18] text-white shadow-lg' : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div>
              <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {activeTab === 'overview' && 'Escritório Virtual • Visão Geral'}
                {activeTab === 'ads' && 'Gerenciamento de Anúncios'}
                {activeTab === 'aiStudio' && (editingAdId ? 'Editor de Anúncios com IA' : 'Criador de Anúncios com IA')}
                {activeTab === 'gamification' && 'Reputação e Conquistas do Lojista'}
                {activeTab === 'leads' && 'CRM de Leads WhatsApp'}
                {activeTab === 'reviews' && 'Gestão de Avaliações & Respostas IA'}
                {activeTab === 'reports' && 'Gráficos de Performance e Métricas'}
                {activeTab === 'billing' && 'Assinatura e Planos GuiaPonto'}
                {activeTab === 'settings' && 'Editor de Perfil e Foto do Usuário'}
                {activeTab === 'accountSettings' && 'Configurações de Conta e E-mail Marketing'}
                {activeTab === 'aiSuggestions' && 'IA Ad Optimization Suggestions • Gemini'}
                {activeTab === 'partners' && 'Diretório de Parceiros de Negócios'}
                {activeTab === 'seoOptimizer' && 'Otimizador de SEO & Google Search Snippets'}
              </h1>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Central executiva de alta performance para o seu negócio local.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Guided Tour Trigger Button */}
            <button
              onClick={() => { setTourStep(1); setShowGuidedTour(true); }}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-[#FE3A18]/20 border border-[#FE3A18]/30 hover:border-[#FE3A18] text-[#FE3A18] font-bold text-xs transition-all cursor-pointer shadow-sm"
              title="Iniciar Tour Guiado"
            >
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>✨ Tour Guiado</span>
            </button>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Noturno'}
              className={`p-3 rounded-2xl transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-amber-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification Bell Button */}
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className={`relative p-3 rounded-2xl transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
            >
              <Bell className="w-5 h-5" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#FE3A18] animate-ping" />
              )}
              {notifications.some(n => n.unread) && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#FE3A18]" />
              )}
            </button>

            {/* Notification Dropdown */}
            {notifOpen && (
              <div className="absolute right-0 top-16 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 p-6 space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-extrabold text-slate-900 text-sm">Notificações e Alertas</h4>
                  <button
                    onClick={() => { setNotifications(notifications.map(n => ({ ...n, unread: false }))); addXp(50, 'Interação com Notificações'); }}
                    className="text-xs font-bold text-[#FE3A18] hover:underline cursor-pointer"
                  >
                    Marcar lidas
                  </button>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-3.5 rounded-2xl border transition-colors ${n.unread ? 'bg-rose-50/40 border-rose-100' : 'bg-slate-50 border-slate-200/60'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 text-xs">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => { setEditingAdId(null); setActiveTab('aiStudio'); }}
              className="px-5 py-3 rounded-2xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-[#FE3A18]/30 hover:scale-[1.02] transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Criar Anúncio com IA</span>
            </button>
          </div>
        </header>

        {/* Dynamic Body Content */}
        <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* ================= 1. VISÃO GERAL & GRÁFICOS ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Real-Time Simulation Trigger Banner with Official Herói Robô GuiaPonto */}
              <div className="bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-emerald-500/10 border border-rose-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-rose-200 p-1.5 flex items-center justify-center shadow-md shrink-0">
                    <img
                      src="https://www.guiaponto.com.br/guia/wp-content/themes/guiaponto-guia/assets/img/heroi-robo-320.webp"
                      alt="Herói Robô GuiaPonto"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">Central Ao Vivo do Mascote GuiaPonto • Sorocaba</h4>
                    <p className="text-xs text-slate-600">Teste o sistema disparando alertas ao vivo como "Seu anúncio está entre os 5 mais vistos da sua categoria hoje!"</p>
                  </div>
                </div>
                <button
                  onClick={simulateRealtimeAlert}
                  className="px-6 py-3 rounded-2xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-extrabold text-xs shadow-xl shadow-[#FE3A18]/30 transition-all cursor-pointer shrink-0 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Disparar Alerta Ao Vivo (Simulação)</span>
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                <motion.div whileHover={{ y: -3 }} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-5 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Megaphone className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Anúncios Ativos</span>
                    <div className="text-3xl font-black text-slate-900 mt-1">{activeAdsCount}</div>
                    <span className="text-xs text-emerald-600 font-semibold mt-1 block">De {ads.length} cadastrados</span>
                  </div>
                </motion.div>

                <motion.div whileHover={{ y: -3 }} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-5 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-[#FE3A18]/10 text-[#FE3A18] flex items-center justify-center shrink-0 shadow-sm">
                    <MousePointerClick className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Cliques Totais</span>
                    <div className="text-3xl font-black text-slate-900 mt-1">{totalClicks.toLocaleString('pt-BR')}</div>
                    <span className="text-xs text-[#FE3A18] font-semibold mt-1 block">+18.4% vs mês anterior</span>
                  </div>
                </motion.div>

                <motion.div whileHover={{ y: -3 }} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-5 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Award className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Score de Reputação</span>
                    <div className="text-3xl font-black text-slate-900 mt-1">{reputationData.score}/100</div>
                    <span className="text-xs text-amber-600 font-bold mt-1 block">Nível: {reputationData.level}</span>
                  </div>
                </motion.div>

              </div>

              {/* Recharts Visual Analytics: Profile Views, Ad Clicks & WhatsApp Lead Conversion Rate */}
              <WhatsAppConversionChartsPanel businessName={accountSettingsData.businessName} />

              {/* Performance Chart Simulation (Executive Office Style) */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Gráfico de Desempenho (Últimos 7 Dias)</h3>
                    <p className="text-xs text-slate-500">Visualização de cliques e conversões na sua carteira de anúncios</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
                    Tempo Real
                  </span>
                </div>

                <div className="h-64 flex items-end justify-between gap-3 pt-8 px-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  {[
                    { day: 'Seg', clicks: 120, height: '40%' },
                    { day: 'Ter', clicks: 210, height: '65%' },
                    { day: 'Qua', clicks: 180, height: '55%' },
                    { day: 'Qui', clicks: 290, height: '85%' },
                    { day: 'Sex', clicks: 340, height: '95%' },
                    { day: 'Sáb', clicks: 380, height: '100%' },
                    { day: 'Dom', clicks: 250, height: '75%' },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.clicks} cliques
                      </span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: bar.height }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="w-full bg-gradient-to-t from-[#FE3A18] to-rose-500 rounded-t-xl shadow-md group-hover:scale-y-105 transition-transform"
                      />
                      <span className="text-xs font-bold text-slate-600 pb-2">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ================= INDUSTRY TRENDS & LOCAL MARKET INSIGHTS (GEMINI IA) ================= */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/90 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl space-y-6 border border-indigo-500/30">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FE3A18]/10 rounded-full blur-3xl pointer-events-none" />

                {/* Toast alerts for copy and apply */}
                <AnimatePresence>
                  {trendCopyToast && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{trendCopyToast}</span>
                    </motion.div>
                  )}
                  {trendAppliedToast && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Sugestão de conteúdo do Gemini aplicada com sucesso ao seu Anúncio Principal! (+120 XP)</span>
                      </div>
                      <span className="text-[11px] font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">Atualizado</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-white/10 pb-6">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FE3A18] to-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-900/40 shrink-0">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-400" />
                          Gemini 3.8 Flash • IA ao Vivo
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                          {industryTrendsData.location}
                        </span>
                      </div>
                      <h3 className="text-xl font-black mt-1 text-white flex items-center gap-2">
                        Tendências do Setor & Ajustes de Conteúdo
                      </h3>
                      <p className="text-xs text-slate-300">
                        Inteligência de mercado local para a categoria cadastrada: identifique padrões de busca e adapte seus anúncios.
                      </p>
                    </div>
                  </div>

                  {/* Category Switcher & Action */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative">
                      <select
                        value={trendCategory}
                        onChange={(e) => {
                          const newCat = e.target.value;
                          setTrendCategory(newCat);
                          handleRefreshTrends(newCat);
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 bg-slate-800/90 border border-indigo-400/30 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 pr-8 cursor-pointer"
                      >
                        <option value="Restaurantes & Gastronomia">🍽️ Restaurantes & Gastronomia (Principal)</option>
                        <option value="Casa de Repouso & Cuidado">🏡 Casa de Repouso & Cuidado</option>
                        <option value="Oficinas & Automotivo">🔧 Oficinas & Automotivo</option>
                        <option value="Imobiliárias & Arquitetura">🏢 Imobiliárias & Arquitetura</option>
                        <option value="Saúde & Estética">🩺 Saúde & Estética</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleRefreshTrends()}
                      disabled={isAnalyzingTrends}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-[#FE3A18] hover:from-indigo-500 hover:to-rose-500 text-white font-extrabold text-xs transition-all cursor-pointer shadow-lg shadow-indigo-950/50 flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzingTrends ? 'animate-spin' : ''}`} />
                      <span>{isAnalyzingTrends ? 'Analisando Tendências...' : 'Atualizar com Gemini'}</span>
                    </button>
                  </div>
                </div>

                {/* Demand Gauge & Market Sentiment Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-300">Índice de Demanda Local</span>
                      <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3 text-emerald-400" />
                        {industryTrendsData.demandScore}/100
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${industryTrendsData.demandScore}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-indigo-500 via-emerald-400 to-[#FE3A18] rounded-full"
                      />
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400 block">
                      {industryTrendsData.demandTrend}
                    </span>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:col-span-2 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Target className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-slate-300">Comportamento do Consumidor na Região</span>
                      <span className="ml-auto text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md">
                        {industryTrendsData.bestPostingHours}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      "{industryTrendsData.sentiment}"
                    </p>
                    <p className="text-[11px] text-slate-400 mt-2 italic">
                      💡 {industryTrendsData.marketSummary}
                    </p>
                  </div>
                </div>

                {/* Trending Keywords */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-400" />
                      Termos em Alta na Rede GuiaPonto ({industryTrendsData.category})
                    </span>
                    <span className="text-[11px] text-slate-400">Clique para copiar termo</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {industryTrendsData.trendingKeywords.map((kw, i) => (
                      <button
                        key={i}
                        onClick={() => handleCopyTrendText(kw.replace(/\s\(\+\d+%\)/, ''), 'Palavra-chave')}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-400/40 text-xs font-bold text-indigo-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Copiar palavra-chave"
                      >
                        <span>{kw}</span>
                        <Copy className="w-3 h-3 text-slate-400 opacity-60" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actionable Tips Grid */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    Dicas Práticas de Ajuste de Conteúdo (Recomendadas por IA)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {industryTrendsData.actionableTips.map((tip) => (
                      <div
                        key={tip.id}
                        className="bg-white/5 hover:bg-white/[0.08] transition-all border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-black text-xs text-white block">{tip.title}</span>
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                                tip.impactType === 'high'
                                  ? 'bg-[#FE3A18]/20 text-rose-300 border border-rose-500/30'
                                  : tip.impactType === 'conversion'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {tip.impact}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{tip.action}</p>
                        </div>
                        <div className="bg-slate-950/50 rounded-xl p-2.5 border border-white/5 space-y-1">
                          <span className="text-[10px] font-bold text-indigo-300 block uppercase tracking-wider">Ajuste sugerido:</span>
                          <p className="text-xs text-slate-200 italic">"{tip.suggestedTweak}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Ad Content & 1-Click Apply */}
                <div className="bg-slate-950/70 border border-indigo-500/30 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Copy Sugerida pelo Gemini para o Anúncio Ativo
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <button
                        onClick={() => {
                          const fullCopy = `Título: ${industryTrendsData.suggestedHeadline}\nDescrição: ${industryTrendsData.suggestedDescription}\nCTA: ${industryTrendsData.suggestedCta}`;
                          handleCopyTrendText(fullCopy, 'Copy Completa');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Copy</span>
                      </button>
                      <button
                        onClick={handleApplyTrendToActiveAd}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/40"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Aplicar ao Anúncio Ativo (+120 XP)</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                    <div className="md:col-span-5 bg-white/5 rounded-xl p-3 border border-white/5">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">Título de Alta Conversão</span>
                      <p className="font-extrabold text-white">{industryTrendsData.suggestedHeadline}</p>
                    </div>
                    <div className="md:col-span-5 bg-white/5 rounded-xl p-3 border border-white/5">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">Descrição Otimizada para WhatsApp</span>
                      <p className="text-slate-300 leading-snug">{industryTrendsData.suggestedDescription}</p>
                    </div>
                    <div className="md:col-span-2 bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">Botão CTA</span>
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-[#FE3A18] text-white font-black text-[11px] text-center">
                        {industryTrendsData.suggestedCta}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI-Powered Predictive Budget Optimizer & High-Traffic Campaign Scheduler */}
              <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl space-y-6 border border-emerald-500/30">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full">
                          IA Predictive Engine & Scheduler
                        </span>
                        <span className="text-xs text-slate-400">Otimização & Horários de Pico</span>
                      </div>
                      <h3 className="text-xl font-black mt-1">Otimizador Preditivo de Orçamento & Agendamento de Pico</h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveTab('aiSuggestions')}
                      className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer shadow-lg flex items-center gap-2 shrink-0 border border-white/10"
                    >
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      <span>Calendário Visual (Drag & Drop)</span>
                    </button>
                    <button
                      onClick={() => setShowScheduleModal(true)}
                      className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg flex items-center gap-2 shrink-0"
                    >
                      <Clock className="w-4 h-4" />
                      <span>+ Agendar para Horário de Pico (IA)</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Restaurante Sabor & Fogo</span>
                      <span className="text-xs font-black text-emerald-400">Sugerido: +R$ 15/dia</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Detectamos pico de intenção de busca por gastronomia na região para este final de semana. Aumentar o lance garante 1º lugar no ranking.
                    </p>
                    <button
                      onClick={() => alert('Orçamento otimizado com sucesso pela IA!')}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md"
                    >
                      Aplicar Sugestão de IA (1-Click)
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Residencial Sênior Acolher</span>
                      <span className="text-xs font-black text-amber-400">Manter Orçamento Atual</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Demanda estável e custo por clique otimizado. Recomendamos manter o orçamento atual para maximizar o retorno sem desperdício.
                    </p>
                    <span className="text-[10px] text-slate-400 block pt-2">Analisado há 10 minutos por Cacilda AI</span>
                  </div>
                </div>

                {/* Scheduled Campaigns for High-Traffic Hours Section */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-extrabold text-sm text-white">Campanhas Agendadas para Horários de Pico (Dados em Tempo Real)</h4>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      {campaignSchedules.length} Ativas
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {campaignSchedules.map((schedule) => (
                      <div key={schedule.id} className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-4">
                        <div className="space-y-1 min-w-0">
                          <span className="font-bold text-xs text-white block truncate">{schedule.adTitle}</span>
                          <div className="flex items-center gap-3 text-[11px] text-slate-300">
                            <span className="flex items-center gap-1 text-emerald-400 font-bold"><Clock className="w-3.5 h-3.5" /> {schedule.peakHours}</span>
                            <span>• {schedule.days}</span>
                          </div>
                          <span className="text-[10px] text-amber-400 font-bold block">{schedule.boostMultiplier}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => toggleScheduleStatus(schedule.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                              schedule.status === 'Ativo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {schedule.status}
                          </button>
                          <button
                            onClick={() => deleteSchedule(schedule.id)}
                            className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Schedule Campaign Modal */}
              {showScheduleModal && (
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white space-y-6 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base">Agendar Campanha para Horário de Pico</h3>
                          <p className="text-xs text-slate-400">Baseado em dados de tráfego em tempo real da rede GuiaPonto</p>
                        </div>
                      </div>
                      <button onClick={() => setShowScheduleModal(false)} className="p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleAddSchedule} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Selecionar Anúncio</label>
                        <select
                          value={newScheduleAdId}
                          onChange={(e) => setNewScheduleAdId(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                        >
                          {ads.map(ad => (
                            <option key={ad.id} value={ad.id}>{ad.title} ({ad.category})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Faixa Horária de Pico (IA)</label>
                        <select
                          value={newScheduleTime}
                          onChange={(e) => setNewScheduleTime(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="11:30 - 14:30 (Pico de Almoço / Gastronomia)">11:30 - 14:30 (Pico de Almoço / Gastronomia)</option>
                          <option value="18:00 - 21:30 (Pico Noturno / Alta Demanda)">18:00 - 21:30 (Pico Noturno / Alta Demanda)</option>
                          <option value="09:00 - 12:00 (Pico Matinal / Serviços)">09:00 - 12:00 (Pico Matinal / Serviços)</option>
                          <option value="14:00 - 18:00 (Pico da Tarde)">14:00 - 18:00 (Pico da Tarde)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Dias da Semana</label>
                        <select
                          value={newScheduleDays}
                          onChange={(e) => setNewScheduleDays(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="Segunda a Sexta (Dias Úteis)">Segunda a Sexta (Dias Úteis)</option>
                          <option value="Finais de Semana (Sáb & Dom)">Finais de Semana (Sáb & Dom)</option>
                          <option value="Todos os Dias">Todos os Dias</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Estratégia de Boost de Orçamento</label>
                        <select
                          value={newScheduleBoost}
                          onChange={(e) => setNewScheduleBoost(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="+35% Orçamento IA nos Picos">+35% Orçamento IA nos Picos (Máxima Conversão)</option>
                          <option value="+20% Orçamento IA nos Picos">+20% Orçamento IA nos Picos (Equilibrado)</option>
                          <option value="+50% Orçamento IA nos Picos">+50% Orçamento IA nos Picos (Liderança de Categoria)</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowScheduleModal(false)}
                          className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg"
                        >
                          Confirmar Agendamento Inteligente
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}

              {/* Reputation Summary & Milestones Card */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black">Reputação e Conquistas (Gamificação)</h3>
                      <p className="text-xs text-slate-300">Complete metas para subir de nível e ganhar destaque supremo na vitrine.</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab('gamification')} className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all cursor-pointer">
                    Ver Todas as Metas
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {reputationData.milestones.slice(0, 3).map((m) => (
                    <div key={m.id} className="bg-white/10 rounded-2xl p-4 border border-white/10 space-y-2.5 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-200">{m.title}</span>
                          <span className="text-amber-400">{m.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${m.progress}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="text-[10px] text-slate-400 block">{m.status}</span>
                        {m.progress < 100 ? (
                          <button
                            type="button"
                            onClick={() => handleCompleteMilestone(m.id)}
                            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-[#FE3A18] text-slate-950 font-black text-[10px] hover:brightness-110 transition-all cursor-pointer shadow-sm"
                          >
                            Concluir Meta 🎉
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleCompleteMilestone(m.id)}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 font-bold text-[10px] transition-all cursor-pointer"
                          >
                            Celebrar 🎉
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ================= SOROCABA GROWTH HEATMAP (REGIONAL USER ACTIVITY & NEIGHBORHOOD REACH) ================= */}
              <SorocabaGrowthHeatmap
                businessName={accountSettingsData.businessName}
                baseNeighborhood="Campolim"
                onAwardXp={addXp}
              />

              {/* ================= AI LOCAL TRENDS DASHBOARD (SOROCABA MONTHLY SEARCH VOLUME & GROWTH OPPORTUNITIES) ================= */}
              <AILocalTrendsDashboard
                defaultBusinessName={accountSettingsData.businessName}
                defaultCategory={accountSettingsData.category}
                onAwardXp={addXp}
              />

              {/* ================= ADMIN VIDEO SPOTLIGHT (CURATED VIDEO CARDS & TUTORIALS) ================= */}
              <AdminVideoSpotlight
                onAddXp={(points, reason) => {
                  setTimeout(() => {
                    addXp(points, reason);
                  }, 0);
                }}
                isDarkMode={isDarkMode}
              />

            </div>
          )}

          {/* ================= 2. MEUS ANÚNCIOS ================= */}
          {activeTab === 'ads' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar anúncio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#FE3A18] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {['Todos', 'Ativo', 'Pausado', 'Expirado'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        statusFilter === status
                          ? 'bg-[#FE3A18] text-white shadow-md shadow-[#FE3A18]/20'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                  <button
                    onClick={() => { setEditingAdId(null); setActiveTab('aiStudio'); }}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ml-auto sm:ml-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Criar com IA</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-4 px-6">Anúncio / Negócio</th>
                        <th className="py-4 px-6">Categoria</th>
                        <th className="py-4 px-6">Preço / Oferta</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6">Cliques</th>
                        <th className="py-4 px-6">Impressões</th>
                        <th className="py-4 px-6 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredAds.map((ad) => (
                        <tr key={ad.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img src={ad.image} alt={ad.title} className="w-12 h-12 rounded-xl object-cover shadow-xs shrink-0" />
                              <div>
                                <span className="font-bold text-slate-900 line-clamp-1">{ad.title}</span>
                                <span className="text-xs text-slate-400">Criado em: {ad.createdAt}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-600 text-xs font-semibold">{ad.category}</td>
                          <td className="py-4 px-6 font-bold text-slate-900">{ad.price}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              ad.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600' :
                              ad.status === 'Pausado' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                ad.status === 'Ativo' ? 'bg-emerald-500' :
                                ad.status === 'Pausado' ? 'bg-amber-500' : 'bg-rose-500'
                              }`} />
                              {ad.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-semibold text-slate-700">{ad.clicks}</td>
                          <td className="py-4 px-6 text-slate-600">{ad.impressions.toLocaleString('pt-BR')}</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => startEditingAd(ad)}
                                title="Editar com IA"
                                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toggleStatus(ad.id)}
                                title={ad.status === 'Ativo' ? 'Pausar' : 'Ativar'}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                              >
                                {ad.status === 'Ativo' ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => deleteAd(ad.id)}
                                title="Deletar"
                                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ================= 3. CRIADOR & EDITOR IA STUDIO ================= */}
          {activeTab === 'aiStudio' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: AI Prompt Form & Studio Controls */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-[#FE3A18]/40 p-1.5 flex items-center justify-center shadow-lg shrink-0">
                      <img
                        src="https://www.guiaponto.com.br/guia/wp-content/themes/guiaponto-guia/assets/img/robo-480.webp"
                        alt="Robô GuiaPonto IA"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg">
                        {editingAdId ? 'Editor de Anúncios com Assistência IA' : 'Criador de Anúncios com Assistência IA'}
                      </h3>
                      <p className="text-xs text-slate-500">Crie ou aprimore textos, títulos e conversão com o Robô Assistente GuiaPonto IA.</p>
                    </div>
                  </div>
                  {editingAdId && (
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">
                      Modo Edição
                    </span>
                  )}
                </div>

                <form onSubmit={handleRunAiGeneration} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Descreva seu negócio ou o que deseja alterar no anúncio *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Ex: Criar uma oferta imperdível para o rodízio de sushi com desconto no WhatsApp..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#FE3A18] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Tom de Comunicação da IA
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'persuasivo', label: 'Persuasivo' },
                        { id: 'direto', label: 'Direto & Comercial' },
                        { id: 'divertido', label: 'Divertido' },
                        { id: 'institucional', label: 'Institucional' },
                      ].map((tone) => (
                        <button
                          key={tone.id}
                          type="button"
                          onClick={() => setAiTone(tone.id as any)}
                          className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                            aiTone === tone.id
                              ? 'bg-[#FE3A18] text-white border-[#FE3A18] shadow-md shadow-[#FE3A18]/25'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {tone.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isGeneratingAI}
                    className="w-full py-4 rounded-2xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-extrabold text-base shadow-xl shadow-[#FE3A18]/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {isGeneratingAI ? (
                      <>
                        <Bot className="w-5 h-5 animate-spin" />
                        <span>Processando IA...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Gerar / Atualizar com Inteligência Artificial</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Right Column: Live Ad Preview & Publish */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#FE3A18]" />
                      <h3 className="font-extrabold text-slate-900 text-base">Prévia do Anúncio</h3>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      Pronto para Publicar
                    </span>
                  </div>

                  {/* Card Mockup Preview */}
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="relative h-48 bg-slate-200">
                      <img src={aiGeneratedAd.image} alt={aiGeneratedAd.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-[#FE3A18] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
                        Destaque IA
                      </span>
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">{aiGeneratedAd.category}</span>
                        <span className="text-xs font-black text-slate-900 bg-amber-50 px-2 py-0.5 rounded text-amber-700">
                          {aiGeneratedAd.price}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 leading-tight">
                        {aiGeneratedAd.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {aiGeneratedAd.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={publishAiAd}
                      className="w-full py-4 rounded-2xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-bold text-sm shadow-xl shadow-[#FE3A18]/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{editingAdId ? 'Salvar Alterações do Anúncio' : 'Publicar Anúncio no GuiaPonto'}</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= 4. REPUTAÇÃO E CONQUISTAS (GAMIFICATION) ================= */}
          {activeTab === 'gamification' && (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Score de Reputação: {reputationData.score}/100</h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Nível atual: <strong className="text-amber-600 font-extrabold">{reputationData.level}</strong> • Mantenha o engajamento alto para desbloquear o selo Diamante.</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                    <span className="block text-[10px] font-bold text-amber-700 uppercase tracking-wider">Benefício Ativo</span>
                    <span className="text-xs font-extrabold text-slate-900 mt-1 block">Prioridade nas Buscas do Google</span>
                  </div>
                </div>

                {/* Leveling System & GuiaPonto Pro Status Tiers Widget */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl space-y-6 border border-amber-500/30">
                  <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg text-2xl">
                        ⭐
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full">
                            Sistema de Níveis & XP
                          </span>
                          <span className="text-xs text-slate-400">GuiaPonto Pro Status Tiers</span>
                        </div>
                        <h3 className="text-xl font-black mt-1">Nível {userLevel} • GuiaPonto Pro Gold</h3>
                      </div>
                    </div>

                    <div className="bg-white/10 border border-white/10 rounded-2xl p-3.5 text-right min-w-[160px]">
                      <span className="block text-[10px] text-slate-400 uppercase font-bold">Progresso de XP</span>
                      <span className="text-base font-black text-amber-400">{userXp} / {xpToNextLevel} XP</span>
                    </div>
                  </div>

                  {/* XP Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>Progresso para o Nível {userLevel + 1}</span>
                      <span>{Math.round((userXp / xpToNextLevel) * 100)}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/10">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-[#FE3A18] rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (userXp / xpToNextLevel) * 100)}%` }} />
                    </div>
                  </div>

                  {/* Status Tiers Grid */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <h4 className="font-extrabold text-sm text-white">Status Tiers & Recompensas Exclusivas</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {statusTiers.map((tier) => (
                        <div key={tier.level} className={`p-4 rounded-2xl border space-y-2 flex flex-col justify-between transition-all ${
                          tier.unlocked ? 'bg-white/10 border-amber-500/40 shadow-md' : 'bg-white/5 border-white/10 opacity-60 grayscale'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">{tier.icon}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tier.unlocked ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                              Nível {tier.level}
                            </span>
                          </div>
                          <div>
                            <h5 className="font-bold text-xs text-white">{tier.name}</h5>
                            <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">{tier.reward}</p>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 pt-2 block border-t border-white/10">
                            {tier.unlocked ? '✓ Desbloqueado' : `Req: ${tier.xpRequired} XP`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Community Leaderboard Widget */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
                        🏆
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900">Leaderboard da Comunidade GuiaPonto</h4>
                        <p className="text-xs text-slate-500">Ranking semanal de lojistas baseado em XP e engajamento na plataforma</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-extrabold rounded-full">
                      Competição Ativa
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                          <th className="py-4 px-6">Posição</th>
                          <th className="py-4 px-6">Lojista / Negócio</th>
                          <th className="py-4 px-6">Nível GuiaPonto Pro</th>
                          <th className="py-4 px-6 text-right">XP Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {[
                          { name: 'Juliana Mendes', business: 'Moda & Estilo Campolim', xp: 4820, level: 12, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', isYou: false },
                          { name: 'Carlos Eduardo', business: 'Auto Mecânica Premium', xp: 3950, level: 10, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', isYou: false },
                          { name: userProfile.name, business: userProfile.businessName, xp: userXp, level: userLevel, avatar: userProfile.avatar, isYou: true },
                          { name: 'Beatriz Lima', business: 'Cafeteria & Confeitaria Sabor', xp: 2100, level: 6, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', isYou: false },
                          { name: 'Marcos Vinicius', business: 'Imobiliária Prime Central', xp: 1850, level: 5, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', isYou: false },
                        ].sort((a, b) => b.xp - a.xp).slice(0, 5).map((user, idx) => {
                          const calculatedRank = idx + 1;
                          return (
                            <tr key={user.name} className={`transition-colors ${user.isYou ? 'bg-amber-50/70 font-semibold' : 'hover:bg-slate-50/50'}`}>
                              <td className="py-4 px-6">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                                  calculatedRank === 1 ? 'bg-amber-400 text-slate-950 shadow-md' :
                                  calculatedRank === 2 ? 'bg-slate-300 text-slate-800' :
                                  calculatedRank === 3 ? 'bg-amber-700/20 text-amber-800' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  #{calculatedRank}
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs shrink-0" />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-extrabold text-slate-900 text-sm">{user.name}</span>
                                      {user.isYou && (
                                        <span className="bg-[#FE3A18] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Você</span>
                                      )}
                                    </div>
                                    <span className="text-xs text-slate-500">{user.business}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-extrabold text-xs">
                                  Nível {user.level} • Pro Gold
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <span className="font-black text-slate-900 text-sm">{user.xp.toLocaleString('pt-BR')} XP</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900">Metas e Conquistas do Lojista</h4>
                      <p className="text-xs text-slate-500">Ao atingir 100% em uma meta ou desbloquear uma insígnia 3D, uma celebração com confetes é disparada!</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reputationData.milestones.map((m) => (
                      <div key={m.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">{m.title}</span>
                          <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">{m.progress}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-500 to-[#FE3A18] rounded-full transition-all duration-500" style={{ width: `${m.progress}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1">
                          <span>Status: {m.status}</span>
                          {m.progress === 100 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Concluído</span>
                              <button
                                type="button"
                                onClick={() => handleCompleteMilestone(m.id)}
                                className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-extrabold text-[11px] transition-all cursor-pointer"
                              >
                                Celebrar 🎉
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleCompleteMilestone(m.id)}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FE3A18] to-amber-500 hover:brightness-110 text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Concluir Meta (+350 XP) 🎉</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive 3D Collectible Digital Badges Showcase */}
                <div className="pt-6 border-t border-slate-100">
                  <BadgeShowcase
                    businessName={userProfile.businessName}
                    onAwardXp={addXp}
                  />
                </div>

                {/* Refer-a-Local-Business Sorocaba Expansion Program */}
                <div className="pt-6 border-t border-slate-100">
                  <ReferLocalBusinessProgram
                    referrerBusinessName={userProfile.businessName}
                    referrerOwnerName={userProfile.name}
                    onAwardXp={addXp}
                    onNewPartnerRegistered={(newPartner) =>
                      setPartnerBusinesses((prev) => [newPartner, ...prev])
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= 4B. GESTÃO DE AVALIAÇÕES & RESPOSTAS IA (REVIEW MANAGEMENT) ================= */}
          {activeTab === 'reviews' && (
            <ReviewManagementSection
              businessName={accountSettingsData.businessName}
              isDarkMode={isDarkMode}
              onAwardXp={addXp}
            />
          )}

          {/* ================= 5. LEADS WHATSAPP & AUTO-FOLLOW-UP IA (CRM) ================= */}
          {activeTab === 'leads' && (() => {
            const selectedLead = leads.find(l => l.id === selectedLeadIdForFollowUp) || leads[0];
            const readyDraftsCount = leads.filter(l => l.aiFollowUpDraft?.status === 'Rascunho IA Pronto').length;
            const sentDraftsCount = leads.filter(l => l.aiFollowUpDraft?.status === 'Enviado').length;

            return (
              <div className="space-y-6">
                {/* Top Control Panel: Auto-Follow-up Toggle & Category Engine */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
                  <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-[#FE3A18]/10 blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-wider text-orange-300">
                        <Sparkles className="w-3.5 h-3.5 text-[#FE3A18]" />
                        <span>Automação de CRM • Gemini IA Sorocaba</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5 flex-wrap">
                        <span>Auto-Follow-up Inteligente por Categoria</span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-extrabold uppercase tracking-wider ${
                            autoFollowUpEnabled
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                              : 'bg-slate-700/60 text-slate-300 border border-slate-600'
                          }`}
                        >
                          {autoFollowUpEnabled ? '● Ativo para Novos Leads' : '○ Pausado'}
                        </span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Quando ativado, o sistema identifica automaticamente a categoria de negócio do anúncio ou da sua conta (<span className="text-white font-semibold">{accountSettingsData.category}</span>) e redige uma resposta de e-mail altamente persuasiva assim que um novo lead chega pelo diretório de Sorocaba.
                      </p>
                    </div>

                    {/* Interactive Toggle Switch Card */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                      <div className="flex items-center gap-3.5">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={autoFollowUpEnabled}
                          aria-label="Alternar Auto-Follow-up IA"
                          onClick={handleToggleAutoFollowUp}
                          className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            autoFollowUpEnabled ? 'bg-[#FE3A18]' : 'bg-slate-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                              autoFollowUpEnabled ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          >
                            <Bot className={`w-3.5 h-3.5 ${autoFollowUpEnabled ? 'text-[#FE3A18]' : 'text-slate-400'}`} />
                          </span>
                        </button>
                        <div>
                          <div className="text-sm font-black text-white">
                            Auto-Follow-up IA
                          </div>
                          <div className="text-[11px] text-slate-300">
                            {autoFollowUpEnabled
                              ? 'Rascunho automático ativado'
                              : 'Clique para ativar rascunhos IA'}
                          </div>
                        </div>
                      </div>

                      <div className="h-8 w-px bg-white/15 hidden sm:block" />

                      <button
                        type="button"
                        onClick={handleSimulateIncomingLead}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-orange-50 text-slate-900 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-[#FE3A18]" />
                        <span>Simular Novo Lead</span>
                      </button>
                    </div>
                  </div>

                  {/* Personalization Parameters Bar */}
                  <div className="relative z-10 mt-6 pt-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Critério de Categoria para o E-mail IA
                      </label>
                      <select
                        value={followUpCategoryMode}
                        onChange={(e) => setFollowUpCategoryMode(e.target.value)}
                        className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#FE3A18]"
                      >
                        <option value="lead">Automático (Usar Categoria do Anúncio do Lead)</option>
                        <option value="account">Usar Categoria da Conta ({accountSettingsData.category})</option>
                        <option value="Restaurantes & Gastronomia">Forçar: Restaurantes & Gastronomia</option>
                        <option value="Casa de Repouso & Cuidado">Forçar: Casa de Repouso & Cuidado</option>
                        <option value="Oficinas & Automotivo">Forçar: Oficinas & Automotivo</option>
                        <option value="Imobiliárias & Arquitetura">Forçar: Imobiliárias & Arquitetura</option>
                        <option value="Saúde & Estética">Forçar: Saúde & Estética</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Tom de Voz da Resposta IA
                      </label>
                      <select
                        value={followUpTone}
                        onChange={(e) => setFollowUpTone(e.target.value as 'Consultivo & Acolhedor' | 'Promocional com Cupom' | 'Executivo Rápido')}
                        className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#FE3A18]"
                      >
                        <option value="Consultivo & Acolhedor">Consultivo & Acolhedor (Recomendado)</option>
                        <option value="Promocional com Cupom">Promocional com Cupom / Bônus GuiaPonto</option>
                        <option value="Executivo Rápido">Executivo Rápido & Objetivo</option>
                      </select>
                    </div>

                    <div className="flex items-end gap-3">
                      <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">Rascunhos Prontos</div>
                          <div className="text-base font-black text-amber-300">{readyDraftsCount} leads</div>
                        </div>
                        <div className="h-6 w-px bg-white/10" />
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">E-mails Enviados</div>
                          <div className="text-base font-black text-emerald-400">{sentDraftsCount} leads</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Feedback Toast Banner */}
                <AnimatePresence>
                  {followUpBannerFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl px-5 py-3.5 flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{followUpBannerFeedback}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFollowUpBannerFeedback(null)}
                        className="text-emerald-700 hover:text-emerald-950 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main Split Workspace: CRM Leads List + AI Follow-up Email Studio */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                  {/* Left Column: CRM Table */}
                  <div className="xl:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-lg font-black text-slate-900">Leads Capturados em Sorocaba & Região</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Selecione um lead para revisar, personalizar ou disparar o e-mail de Auto-Follow-up IA.
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 self-start sm:self-auto">
                        <Users className="w-3.5 h-3.5 text-[#FE3A18]" />
                        <span>{leads.length} Contatos no Funil</span>
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            <th className="py-3.5 px-4">Cliente & Contato</th>
                            <th className="py-3.5 px-4">Anúncio & Categoria</th>
                            <th className="py-3.5 px-4">Status & Follow-up IA</th>
                            <th className="py-3.5 px-4 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {leads.map((lead) => {
                            const isSelected = selectedLead?.id === lead.id;
                            const isGeneratingThis = isGeneratingFollowUpId === lead.id;
                            return (
                              <tr
                                key={lead.id}
                                onClick={() => setSelectedLeadIdForFollowUp(lead.id)}
                                className={`transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-orange-50/70 hover:bg-orange-50'
                                    : 'hover:bg-slate-50/70'
                                }`}
                              >
                                <td className="py-4 px-4 align-top">
                                  <div className="font-bold text-slate-900 flex items-center gap-2">
                                    <span>{lead.customerName}</span>
                                    {lead.status === 'Novo' && (
                                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-orange-100 text-[#FE3A18]">
                                        Novo
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span className="truncate max-w-[190px]">{lead.email}</span>
                                  </div>
                                  <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 mt-1">
                                    <Phone className="w-3 h-3 shrink-0" />
                                    <span>{lead.phone}</span>
                                    <span className="text-slate-400 font-normal">• {lead.timestamp}</span>
                                  </div>
                                </td>

                                <td className="py-4 px-4 align-top">
                                  <div className="text-xs font-bold text-slate-800 line-clamp-1">{lead.adTitle}</div>
                                  <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                    {lead.category}
                                  </span>
                                  {lead.customerInquiry && (
                                    <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 italic">
                                      "{lead.customerInquiry}"
                                    </p>
                                  )}
                                </td>

                                <td className="py-4 px-4 align-top space-y-1.5">
                                  <div>
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-block ${
                                        lead.status === 'Novo'
                                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                          : lead.status === 'Em Atendimento'
                                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      }`}
                                    >
                                      {lead.status}
                                    </span>
                                  </div>

                                  {isGeneratingThis ? (
                                    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#FE3A18]">
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                      <span>Redigindo com IA...</span>
                                    </div>
                                  ) : lead.aiFollowUpDraft ? (
                                    <div
                                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                        lead.aiFollowUpDraft.status === 'Enviado'
                                          ? 'bg-emerald-100/80 text-emerald-800'
                                          : 'bg-orange-100/80 text-[#FE3A18]'
                                      }`}
                                    >
                                      <Sparkles className="w-3 h-3 shrink-0" />
                                      <span>{lead.aiFollowUpDraft.status}</span>
                                    </div>
                                  ) : (
                                    <div className="text-[11px] text-slate-400 font-medium">
                                      Sem rascunho IA
                                    </div>
                                  )}
                                </td>

                                <td className="py-4 px-4 align-top text-right">
                                  <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedLeadIdForFollowUp(lead.id);
                                        if (!lead.aiFollowUpDraft) {
                                          handleGenerateFollowUpForLead(lead);
                                        }
                                      }}
                                      className={`px-3 py-1.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                                        isSelected
                                          ? 'bg-[#FE3A18] text-white shadow-sm'
                                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                                      }`}
                                    >
                                      <Mail className="w-3.5 h-3.5" />
                                      <span>{lead.aiFollowUpDraft ? 'Ver E-mail IA' : 'Gerar E-mail IA'}</span>
                                    </button>

                                    <a
                                      href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm inline-flex items-center gap-1"
                                      title="Abrir conversa no WhatsApp"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                      <span className="hidden sm:inline">WhatsApp</span>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Column: AI Follow-up Email Draft Studio */}
                  <div className="xl:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
                    {selectedLead ? (
                      <>
                        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                          <div>
                            <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#FE3A18]">
                              <Bot className="w-3.5 h-3.5" />
                              <span>Estúdio de E-mail Auto-Follow-up IA</span>
                            </div>
                            <h4 className="text-lg font-black text-slate-900 mt-0.5">
                              Resposta para {selectedLead.customerName}
                            </h4>
                            <p className="text-xs text-slate-500">
                              Para: <span className="font-semibold text-slate-700">{selectedLead.email}</span>
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={isGeneratingFollowUpId === selectedLead.id}
                            onClick={() => handleGenerateFollowUpForLead(selectedLead)}
                            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingFollowUpId === selectedLead.id ? 'animate-spin text-[#FE3A18]' : ''}`} />
                            <span>{selectedLead.aiFollowUpDraft ? 'Regenerar IA' : 'Gerar Agora'}</span>
                          </button>
                        </div>

                        {/* Category Context & AI Strategy Box */}
                        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                              Categoria Aplicada pela IA:
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-indigo-100 text-indigo-800">
                              {selectedLead.aiFollowUpDraft?.categoryUsed || resolveEffectiveCategory(selectedLead)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <span className="font-bold text-slate-800">Estratégia da Categoria: </span>
                            {selectedLead.aiFollowUpDraft?.categoryStrategyNote ||
                              'A IA adapta automaticamente os argumentos de venda, gatilhos de confiança local em Sorocaba e chamada para ação conforme o segmento do anúncio.'}
                          </p>
                        </div>

                        {selectedLead.aiFollowUpDraft ? (
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-slate-700">
                                  Assunto do E-mail Personalizado
                                </label>
                                <span className="text-[11px] text-slate-400">
                                  {selectedLead.aiFollowUpDraft.generatedAt}
                                </span>
                              </div>
                              <input
                                type="text"
                                value={selectedLead.aiFollowUpDraft.subject}
                                onChange={(e) => handleUpdateDraftContent(selectedLead.id, 'subject', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:border-[#FE3A18] focus:outline-none"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-slate-700">
                                  Corpo da Resposta (Editável antes do envio)
                                </label>
                                <span className="text-[11px] font-semibold text-indigo-600">
                                  Tom: {selectedLead.aiFollowUpDraft.tone}
                                </span>
                              </div>
                              <textarea
                                rows={11}
                                value={selectedLead.aiFollowUpDraft.body}
                                onChange={(e) => handleUpdateDraftContent(selectedLead.id, 'body', e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs sm:text-sm text-slate-800 leading-relaxed focus:bg-white focus:border-[#FE3A18] focus:outline-none font-sans"
                              />
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
                              <button
                                type="button"
                                onClick={() => handleApproveAndSendFollowUp(selectedLead.id)}
                                className="flex-1 py-3 px-4 rounded-xl bg-[#FE3A18] hover:bg-[#e03212] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <Send className="w-4 h-4" />
                                <span>
                                  {selectedLead.aiFollowUpDraft.status === 'Enviado'
                                    ? 'Reenviar E-mail de Follow-up'
                                    : 'Aprovar & Disparar E-mail IA'}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCopyFollowUpDraft(selectedLead)}
                                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                {copiedFollowUpId === selectedLead.id ? (
                                  <>
                                    <Check className="w-4 h-4 text-emerald-600" />
                                    <span className="text-emerald-700">Copiado!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    <span>Copiar Texto</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FE3A18] flex items-center justify-center mx-auto">
                              <Mail className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                              <h5 className="text-sm font-black text-slate-900">
                                Rascunho ainda não gerado para este lead
                              </h5>
                              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                                Clique abaixo para que a IA crie uma resposta personalizada para a categoria <span className="font-bold text-slate-700">{resolveEffectiveCategory(selectedLead)}</span>.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleGenerateFollowUpForLead(selectedLead)}
                              className="px-5 py-2.5 rounded-xl bg-[#FE3A18] hover:bg-[#e03212] text-white font-black text-xs shadow-md inline-flex items-center gap-2 cursor-pointer"
                            >
                              <Sparkles className="w-4 h-4" />
                              <span>Gerar Rascunho de E-mail com IA</span>
                            </button>
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>
                </div>

                {/* Sistema de Notificação por E-mail para o Dono da Empresa (WhatsApp & Landing Page) */}
                <MerchantEmailNotificationHub businessName={accountSettingsData.businessName} />
              </div>
            );
          })()}

          {/* ================= 6. RELATÓRIOS E PERFORMANCE ================= */}
          {activeTab === 'reports' && (
            <div className="space-y-8">
              {/* Recharts Visual Analytics: Profile Views, Ad Clicks & WhatsApp Lead Conversion Rate */}
              <WhatsAppConversionChartsPanel businessName={accountSettingsData.businessName} />

              {/* AI Local Trends Dashboard: Sorocaba Monthly Search Volume & Growth Opportunities */}
              <AILocalTrendsDashboard
                defaultBusinessName={accountSettingsData.businessName}
                defaultCategory={accountSettingsData.category}
                onAwardXp={addXp}
              />

              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Relatório Executivo de Desempenho</h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Análise detalhada de impressões, cliques e conversões na plataforma.</p>
                  </div>
                  <button
                    onClick={handleExportPDF}
                    disabled={isExportingPDF}
                    className="px-6 py-3.5 rounded-2xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-extrabold text-sm shadow-xl shadow-[#FE3A18]/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {isExportingPDF ? (
                      <>
                        <Bot className="w-5 h-5 animate-spin" />
                        <span>Gerando PDF Executivo...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Exportar Relatório em PDF</span>
                      </>
                    )}
                  </button>
                </div>

                {pdfExportSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>Relatório PDF gerado e pronto para download / impressão!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Taxa de Conversão Média</span>
                    <div className="text-4xl font-black text-slate-900">14.8%</div>
                    <p className="text-xs text-emerald-600 font-semibold">+3.2% acima da média da categoria</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Contatos no WhatsApp</span>
                    <div className="text-4xl font-black text-slate-900">328</div>
                    <p className="text-xs text-[#FE3A18] font-semibold">Leads qualificados gerados este mês</p>
                  </div>
                </div>
              </div>

              {/* Sorocaba Growth Heatmap: Regional User Activity & High-Traffic Neighborhood Reach */}
              <SorocabaGrowthHeatmap
                businessName={accountSettingsData.businessName}
                baseNeighborhood="Campolim"
                onAwardXp={addXp}
              />

              {/* Estimated Revenue Projection Widget */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-500/30 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-lg shrink-0">
                      <DollarSign className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Calculator className="w-3 h-3" /> Algoritmo Preditivo de ROI
                        </span>
                        <span className="text-xs text-slate-400">Baseado em CTR Histórico (4.8%)</span>
                      </div>
                      <h3 className="text-2xl font-black mt-1">Projeção Estimada de Faturamento (Revenue Forecast)</h3>
                      <p className="text-xs text-slate-300 mt-1">
                        Estime seus ganhos mensais e anuais na GuiaPonto ajustando o valor médio de venda por lead e taxa de conversão.
                      </p>
                    </div>
                  </div>

                  {/* AI Turbo Boost Toggle */}
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 shrink-0 self-start lg:self-center">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    <div className="text-left">
                      <span className="block text-[10px] font-bold uppercase text-slate-300">Cacilda AI Turbo Boost</span>
                      <span className="block text-xs font-black text-amber-400">+25% Clicks & +20% Conversão</span>
                    </div>
                    <button
                      onClick={() => setProjectionAiTurbo(!projectionAiTurbo)}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ml-2 ${
                        projectionAiTurbo ? 'bg-[#FE3A18]' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          projectionAiTurbo ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Quick Business Presets */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Selecione um Modelo de Negócio Rápido:</span>
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { label: '🍕 Restaurante & Gastronomia', ticket: 65, closing: 35 },
                      { label: '💼 Serviços & Consultoria', ticket: 380, closing: 20 },
                      { label: '🏢 Imóveis & Arquitetura', ticket: 1500, closing: 10 },
                      { label: '🩺 Saúde & Clínica', ticket: 280, closing: 26 },
                      { label: '🚗 Oficinas & Automotivo', ticket: 220, closing: 30 },
                    ].map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => {
                          setProjectionTicket(preset.ticket);
                          setProjectionClosingRate(preset.closing);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          projectionTicket === preset.ticket && projectionClosingRate === preset.closing
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders Input Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300">Ticket Médio por Lead Concluído</label>
                      <span className="text-base font-black text-emerald-400">R$ {projectionTicket.toLocaleString('pt-BR')}</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="3000"
                      step="10"
                      value={projectionTicket}
                      onChange={(e) => setProjectionTicket(Number(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                      <span>R$ 20</span>
                      <span>R$ 1.500</span>
                      <span>R$ 3.000+</span>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300">Taxa de Fechamento de Vendas</label>
                      <span className="text-base font-black text-amber-400">{projectionClosingRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="1"
                      value={projectionClosingRate}
                      onChange={(e) => setProjectionClosingRate(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                      <span>5% (Mínimo)</span>
                      <span>25% (Padrão)</span>
                      <span>60% (Alto)</span>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300">Impressões / Mês na Rede</label>
                      <span className="text-base font-black text-sky-400">{projectionMonthlyImpressions.toLocaleString('pt-BR')}</span>
                    </div>
                    <input
                      type="range"
                      min="5000"
                      max="80000"
                      step="1000"
                      value={projectionMonthlyImpressions}
                      onChange={(e) => setProjectionMonthlyImpressions(Number(e.target.value))}
                      className="w-full accent-sky-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                      <span>5.000</span>
                      <span>40.000</span>
                      <span>80.000+</span>
                    </div>
                  </div>
                </div>

                {/* Conversion Funnel Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">1. Cliques Estimados</span>
                    <div className="text-2xl font-black text-white mt-1">{projectedClicks.toLocaleString('pt-BR')}</div>
                    <span className="text-[11px] text-emerald-400 font-semibold mt-0.5 block">CTR: {effectiveCtr.toFixed(1)}%</span>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">2. Leads no WhatsApp</span>
                    <div className="text-2xl font-black text-white mt-1">{projectedLeads.toLocaleString('pt-BR')}</div>
                    <span className="text-[11px] text-[#FE3A18] font-semibold mt-0.5 block">{clickToLeadRate}% de clique-para-lead</span>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">3. Vendas Fechadas</span>
                    <div className="text-2xl font-black text-amber-400 mt-1">{projectedClosedSales.toLocaleString('pt-BR')}</div>
                    <span className="text-[11px] text-slate-300 font-semibold mt-0.5 block">Conversão: {effectiveClosingRate.toFixed(0)}%</span>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl p-4 border border-emerald-400/40">
                    <span className="text-[10px] uppercase font-black text-emerald-300 block">4. Faturamento Mensal</span>
                    <div className="text-2xl font-black text-emerald-400 mt-1">R$ {projectedMonthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <span className="text-[11px] text-emerald-200 font-bold mt-0.5 block">Anual: R$ {projectedAnnualRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
                  </div>
                </div>

                {/* ROI & Key Takeaway Banner */}
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-extrabold text-white">Retorno sobre Investimento (ROI Estimado): +{projectedRoi.toLocaleString('pt-BR')}%</h4>
                      <p className="text-xs text-slate-300">
                        Investindo apenas R$ 99/mês no Plano Master GuiaPonto, sua empresa pode alcançar mais de R$ {projectedMonthlyRevenue.toLocaleString('pt-BR')} em novos negócios todos os meses.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('aiStudio');
                      addXp(50, 'Otimização com Turbo Boost IA');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shrink-0 cursor-pointer"
                  >
                    Otimizar Anúncios para Bater a Meta
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= 7. PLANOS, ASSINATURA & ESTRATÉGIA DE MONETIZAÇÃO ================= */}
          {activeTab === 'billing' && (
            <MonetizationStrategyHub
              currentPlan={activeMerchantPlan}
              onSelectPlan={(plan) => setActiveMerchantPlan(plan)}
              onAwardXp={addXp}
            />
          )}

          {/* ================= 8. PERFIL E FOTO DO USUÁRIO ================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Editor de Perfil e Foto do Usuário</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Atualize suas informações pessoais, dados do escritório e foto de perfil.</p>
                </div>

                {userProfile.savedSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>Perfil e foto atualizados com sucesso!</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
                  {/* Avatar Upload / URL Preview */}
                  <div className="flex items-center gap-6">
                    <img src={userProfile.avatar} alt={userProfile.name} className="w-20 h-20 rounded-full object-cover border-2 border-[#FE3A18] shadow-md" />
                    <div className="space-y-2 flex-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">URL da Foto de Perfil</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          value={userProfile.avatar}
                          onChange={(e) => setUserProfile({ ...userProfile, avatar: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">E-mail Profissional</label>
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">WhatsApp de Contato</label>
                    <input
                      type="text"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Biografia / Resumo Profissional</label>
                    <textarea
                      rows={3}
                      value={userProfile.bio}
                      onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-extrabold text-sm shadow-xl shadow-[#FE3A18]/30 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Alterações do Perfil</span>
                  </button>
                </form>
              </div>

              {/* Interactive 3D Badge Showcase with Public Landing Page Pinning */}
              <BadgeShowcase
                businessName={userProfile.businessName}
                onAwardXp={addXp}
              />

              {/* Automatic Company Data Backup & Encrypted JSON Export */}
              <EncryptedBackupManager
                accountData={accountSettingsData}
                ads={ads}
                leads={leads}
                schedules={calendarSchedules}
                onAwardXp={addXp}
              />
            </div>
          )}

          {/* ================= 9. CONFIGURAÇÕES DE CONTA ================= */}
          {activeTab === 'accountSettings' && (
            <div className="space-y-8 max-w-6xl">
              
              {/* Company Data Settings */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Dados da Empresa e Negócio Local</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Atualize as informações corporativas exibidas na vitrine pública da GuiaPonto.</p>
                </div>

                {accountSettingsData.savedSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>Dados da empresa e preferências salvos com sucesso! (+50 XP)</span>
                  </div>
                )}

                <form onSubmit={handleSaveAccountSettings} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Nome do Negócio / Empresa</label>
                      <input
                        type="text"
                        value={accountSettingsData.businessName}
                        onChange={(e) => setAccountSettingsData({ ...accountSettingsData, businessName: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">CNPJ / Registro Comercial</label>
                      <input
                        type="text"
                        value={accountSettingsData.cnpj}
                        onChange={(e) => setAccountSettingsData({ ...accountSettingsData, cnpj: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Categoria Principal</label>
                      <input
                        type="text"
                        value={accountSettingsData.category}
                        onChange={(e) => setAccountSettingsData({ ...accountSettingsData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Endereço Completo</label>
                      <input
                        type="text"
                        value={accountSettingsData.address}
                        onChange={(e) => setAccountSettingsData({ ...accountSettingsData, address: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                      />
                    </div>
                  </div>

                  {/* Email Marketing & Notification Preferences */}
                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <h4 className="font-extrabold text-slate-900 text-sm">Configurações de E-mail Marketing & Alertas</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'emailWeeklyReports', label: 'Receber Relatórios Semanais de Performance e ROI por e-mail' },
                        { key: 'emailAiTips', label: 'Receber Dicas Exclusivas de Otimização geradas pela Cacilda AI' },
                        { key: 'emailWhatsappLeads', label: 'Alertas instantâneos por e-mail de novos Leads do WhatsApp' },
                        { key: 'emailNewsletter', label: 'Newsletter mensal da rede GuiaPonto com tendências de mercado' },
                      ].map((pref) => (
                        <label key={pref.key} className="flex items-center gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={(accountSettingsData as any)[pref.key]}
                            onChange={(e) => setAccountSettingsData({ ...accountSettingsData, [pref.key]: e.target.checked })}
                            className="w-4 h-4 rounded text-[#FE3A18] focus:ring-[#FE3A18]"
                          />
                          <span className="text-xs font-medium text-slate-700">{pref.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-extrabold text-sm shadow-xl shadow-[#FE3A18]/30 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Dados da Empresa e Preferências</span>
                  </button>
                </form>
              </div>

              {/* Password Change Settings */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Segurança e Troca de Senha</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Mantenha sua conta protegida alterando sua senha periodicamente.</p>
                </div>

                {accountSettingsData.passwordSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>Senha alterada com sucesso!</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-6 max-w-xl">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Senha Atual</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={accountSettingsData.currentPassword}
                      onChange={(e) => setAccountSettingsData({ ...accountSettingsData, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Nova Senha</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={accountSettingsData.newPassword}
                      onChange={(e) => setAccountSettingsData({ ...accountSettingsData, newPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Confirmar Nova Senha</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={accountSettingsData.confirmPassword}
                      onChange={(e) => setAccountSettingsData({ ...accountSettingsData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-xl flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Atualizar Senha de Acesso</span>
                  </button>
                </form>
              </div>

              {/* Automatic Company Data Backup & Encrypted JSON Export */}
              <EncryptedBackupManager
                accountData={accountSettingsData}
                ads={ads}
                leads={leads}
                schedules={calendarSchedules}
                onAwardXp={addXp}
              />

            </div>
          )}

          {/* ================= 10. AI AD OPTIMIZATION SUGGESTIONS (GEMINI SIDEBAR) ================= */}
          {activeTab === 'aiSuggestions' && (
            <div className="space-y-8 max-w-6xl">
              {/* AI Local Trends Dashboard: Sorocaba Monthly Search Volume & Growth Opportunities */}
              <AILocalTrendsDashboard
                defaultBusinessName={accountSettingsData.businessName}
                defaultCategory={accountSettingsData.category}
                onAwardXp={addXp}
              />
              
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl space-y-6 border border-indigo-500/30">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-[#FE3A18] text-white flex items-center justify-center font-black shadow-xl shrink-0">
                      <Sparkles className="w-7 h-7 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full">
                          Gemini AI Engine • Active
                        </span>
                        <span className="text-xs text-slate-400">Análise Preditiva de Desempenho</span>
                      </div>
                      <h3 className="text-2xl font-black mt-1">AI Ad Optimization Suggestions</h3>
                    </div>
                  </div>

                  <button
                    onClick={fetchOptimizationSuggestions}
                    disabled={isAnalyzingOptimization}
                    className="px-6 py-3.5 rounded-2xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-extrabold text-xs shadow-xl shadow-[#FE3A18]/30 transition-all cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    <Sparkles className={`w-4 h-4 ${isAnalyzingOptimization ? 'animate-spin' : ''}`} />
                    <span>{isAnalyzingOptimization ? 'Analisando Métricas...' : 'Atualizar Análise com IA'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total de Cliques Analisados</span>
                    <div className="text-2xl font-black text-white mt-1">{totalClicks.toLocaleString('pt-BR')}</div>
                    <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">CTR Médio: 4.8%</span>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Anúncios Ativos Monitorados</span>
                    <div className="text-2xl font-black text-white mt-1">{activeAdsCount} de {ads.length}</div>
                    <span className="text-[11px] text-amber-400 font-semibold mt-1 block">Otimização recomendada</span>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Reputação GuiaPonto Pro</span>
                    <div className="text-2xl font-black text-white mt-1">{reputationData.score}/100 pts</div>
                    <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">Nível {reputationData.level}</span>
                  </div>
                </div>
              </div>

              {/* AI Report Card */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <Bot className="w-6 h-6 text-[#FE3A18]" />
                    <h4 className="font-black text-slate-900 text-base">Relatório e Sugestões da IA para seus Anúncios</h4>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                    +120 XP por Análise
                  </span>
                </div>

                {isAnalyzingOptimization ? (
                  <div className="py-16 text-center space-y-4">
                    <Sparkles className="w-10 h-10 text-[#FE3A18] animate-spin mx-auto" />
                    <p className="text-sm font-bold text-slate-700">O Gemini está analisando suas campanhas, cliques e público-alvo...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                      {aiOptimizationSuggestions || 'Clique no botão acima para gerar a primeira análise de otimização de anúncios com inteligência artificial.'}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setAiPrompt('Restaurante Sabor & Fogo - Almoço Executivo com Urgência');
                          setActiveTab('aiStudio');
                          addXp(80, 'Aplicação de Sugestão IA no Studio');
                        }}
                        className="px-6 py-3 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Aplicar Sugestões de Copy no AI Studio</span>
                      </button>

                      <button
                        onClick={fetchOptimizationSuggestions}
                        className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all cursor-pointer"
                      >
                        Gerar Novas Sugestões
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Toast for Calendar Operations */}
              <AnimatePresence>
                {calendarToastMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-gradient-to-r from-emerald-500/20 via-slate-900 to-indigo-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-bold flex items-center justify-between gap-3 shadow-xl"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{calendarToastMessage}</span>
                    </div>
                    <button
                      onClick={() => setCalendarToastMessage(null)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ================= VISUAL CALENDAR-STYLE SCHEDULER (DRAG & DROP) ================= */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl space-y-6 border border-emerald-500/30">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FE3A18]/10 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-white/10 pb-6 relative z-10">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-[#FE3A18] text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-950/50 shrink-0">
                      <Calendar className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Zap className="w-3 h-3 text-emerald-400" />
                          Agendador Visual Drag & Drop
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Horários de Pico Baseados em Dados de Tráfego Local
                        </span>
                      </div>
                      <h3 className="text-2xl font-black mt-1 text-white">
                        Calendário Semanal de Campanhas em Horários de Pico
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Arraste e solte seus anúncios nos blocos de maior tráfego para maximizar o retorno dos lances com inteligência preditiva.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      onClick={handleAutoScheduleAllWithAi}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg shadow-emerald-950/40 flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>Distribuir Lances com IA (+150 XP)</span>
                    </button>
                  </div>
                </div>

                {/* Metrics Summary Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Agendamentos Ativos</span>
                    <div className="text-xl sm:text-2xl font-black text-white mt-1">
                      {calendarSchedules.filter(s => s.status === 'Ativo').length} slots
                    </div>
                    <span className="text-[11px] text-emerald-400 font-semibold mt-0.5 block">
                      {calendarSchedules.length} agendados no total
                    </span>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Cobertura de Pico</span>
                    <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">94%</div>
                    <span className="text-[11px] text-slate-300 font-semibold mt-0.5 block">
                      Almoço & Jantar cobertos
                    </span>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Aumento Estimado de CTR</span>
                    <div className="text-xl sm:text-2xl font-black text-[#FE3A18] mt-1">+38%</div>
                    <span className="text-[11px] text-slate-300 font-semibold mt-0.5 block">
                      Vs. campanhas contínuas
                    </span>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Cliques Previstos (Semana)</span>
                    <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
                      {calendarSchedules.reduce((acc, s) => acc + s.expectedClicks, 0).toLocaleString('pt-BR')}
                    </div>
                    <span className="text-[11px] text-slate-300 font-semibold mt-0.5 block">
                      Em horários de alta conversão
                    </span>
                  </div>
                </div>

                {/* Active Campaigns Tray (Draggable Dock) */}
                <div className="bg-slate-950/60 rounded-2xl p-5 border border-white/10 space-y-3 relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-extrabold text-sm text-white">
                        Bandeja de Campanhas Ativas (Arraste para os blocos do calendário)
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      💡 Segure e arraste um card até o dia e horário desejado, ou clique no card para agendar
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ads.filter(a => a.status === 'Ativo').map(ad => {
                      const isBeingDragged = draggedAdId === ad.id;
                      const schedulesCount = calendarSchedules.filter(s => s.adId === ad.id).length;
                      return (
                        <div
                          key={ad.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, ad.id)}
                          onDragEnd={handleDragEnd}
                          className={`group p-3.5 rounded-xl border transition-all cursor-grab active:cursor-grabbing select-none relative ${
                            isBeingDragged
                              ? 'bg-emerald-500/20 border-emerald-400 scale-95 shadow-xl ring-2 ring-emerald-400/50'
                              : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-emerald-500/40'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1 text-slate-400 group-hover:text-emerald-400 transition-colors shrink-0">
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <img
                              src={ad.image}
                              alt={ad.title}
                              className="w-11 h-11 rounded-lg object-cover shrink-0 border border-white/10"
                            />
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <span className="font-bold text-xs text-white block truncate group-hover:text-emerald-300 transition-colors">
                                {ad.title}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <span>{ad.category.split(' & ')[0]}</span>
                                <span>•</span>
                                <span className="text-emerald-400 font-bold">{ad.price}</span>
                              </div>
                              <div className="flex items-center justify-between text-[10px] pt-1">
                                <span className="text-slate-400">{ad.clicks} cliques</span>
                                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                  {schedulesCount} {schedulesCount === 1 ? 'horário' : 'horários'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Filters & Calendar Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-white/10 relative z-10">
                  {/* Day View Selectors */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Dias:
                    </span>
                    {[
                      { id: 'todos', label: 'Todos os 7 Dias' },
                      { id: 'uteis', label: 'Seg - Sex (Úteis)' },
                      { id: 'fds', label: 'Fim de Semana' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setCalendarViewDay(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          calendarViewDay === tab.id
                            ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                    <div className="h-4 w-[1px] bg-white/20 mx-1 hidden md:block" />
                    {CALENDAR_DAYS.map(day => (
                      <button
                        key={day.id}
                        onClick={() => setCalendarViewDay(day.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          calendarViewDay === day.id
                            ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                            : 'bg-white/5 hover:bg-white/10 text-slate-400'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>

                  {/* Peak toggle */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => setCalendarOnlyPeaks(!calendarOnlyPeaks)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        calendarOnlyPeaks
                          ? 'bg-[#FE3A18] text-white shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>{calendarOnlyPeaks ? 'Exibindo Apenas Picos Máximos' : 'Todos os Horários'}</span>
                    </button>
                  </div>
                </div>

                {/* Calendar Grid Matrix */}
                {(() => {
                  const visibleDays = CALENDAR_DAYS.filter(d => {
                    if (calendarViewDay === 'todos') return true;
                    if (calendarViewDay === 'uteis') return ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].includes(d.id);
                    if (calendarViewDay === 'fds') return ['Sáb', 'Dom'].includes(d.id);
                    return d.id === calendarViewDay;
                  });

                  const visibleSlots = HIGH_TRAFFIC_TIME_SLOTS.filter(s => {
                    if (calendarOnlyPeaks) return s.isPeak;
                    return true;
                  });

                  return (
                    <div className="overflow-x-auto pb-4 relative z-10">
                      <div className="min-w-[760px] space-y-4">
                        {/* Time Slots Rows */}
                        {visibleSlots.map(slot => (
                          <div
                            key={slot.id}
                            className="bg-slate-950/40 rounded-2xl border border-white/10 p-4 space-y-3"
                          >
                            {/* Slot Header Banner */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-white bg-white/10 px-3 py-1 rounded-xl">
                                  {slot.hours}
                                </span>
                                <div>
                                  <span className="font-extrabold text-sm text-white">{slot.name}</span>
                                  <span className="text-xs text-slate-400 block sm:inline sm:ml-2">
                                    • {slot.description}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${slot.accentColor}`}>
                                  {slot.badge}
                                </span>
                                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                  {slot.suggestedBoost}
                                </span>
                              </div>
                            </div>

                            {/* Days Grid for this Slot */}
                            <div className={`grid gap-3 ${
                              visibleDays.length === 1
                                ? 'grid-cols-1'
                                : visibleDays.length === 2
                                ? 'grid-cols-2'
                                : visibleDays.length <= 5
                                ? 'grid-cols-5'
                                : 'grid-cols-7'
                            }`}>
                              {visibleDays.map(day => {
                                const cellKey = `${day.id}-${slot.id}`;
                                const isDropOver = dragOverCellKey === cellKey;
                                const matchingSchedules = calendarSchedules.filter(
                                  s => s.day === day.id && s.timeSlotId === slot.id
                                );

                                return (
                                  <div
                                    key={day.id}
                                    onDragOver={(e) => handleDragOver(e, cellKey)}
                                    onDragLeave={() => handleDragLeave(cellKey)}
                                    onDrop={() => handleDropOnSlot(day.id, slot.id)}
                                    className={`rounded-xl p-2.5 transition-all min-h-[110px] flex flex-col justify-between border ${
                                      isDropOver
                                        ? 'bg-emerald-500/25 border-emerald-400 ring-2 ring-emerald-400/40 scale-[1.02]'
                                        : matchingSchedules.length > 0
                                        ? 'bg-white/5 border-white/10'
                                        : 'bg-white/[0.02] border-dashed border-white/10 hover:border-white/20'
                                    }`}
                                  >
                                    {/* Cell Day Header */}
                                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pb-1.5 border-b border-white/5">
                                      <span className="text-slate-300 font-extrabold">{day.label}</span>
                                      <button
                                        onClick={() => setQuickAddModalSlot({ day: day.id, slotId: slot.id })}
                                        className="text-[10px] text-emerald-400 hover:text-emerald-300 cursor-pointer p-0.5 rounded hover:bg-white/5"
                                        title="Adicionar anúncio neste horário"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </button>
                                    </div>

                                    {/* Scheduled Campaigns List in this Cell */}
                                    <div className="space-y-1.5 py-1.5 flex-1">
                                      {matchingSchedules.map(sched => (
                                        <div
                                          key={sched.id}
                                          className={`p-2 rounded-lg border text-left transition-all space-y-1 ${
                                            sched.status === 'Ativo'
                                              ? 'bg-emerald-500/15 border-emerald-500/30'
                                              : 'bg-slate-800/80 border-slate-700 opacity-60'
                                          }`}
                                        >
                                          <div className="flex items-start justify-between gap-1">
                                            <span className="font-extrabold text-[11px] text-white block truncate leading-tight">
                                              {sched.adTitle.split(' - ')[0]}
                                            </span>
                                            <div className="flex items-center gap-1 shrink-0">
                                              <button
                                                onClick={() => handleToggleScheduleActive(sched.id)}
                                                className="text-slate-400 hover:text-white cursor-pointer"
                                                title={sched.status === 'Ativo' ? 'Pausar agendamento' : 'Ativar agendamento'}
                                              >
                                                {sched.status === 'Ativo' ? (
                                                  <PauseCircle className="w-3 h-3 text-emerald-400" />
                                                ) : (
                                                  <PlayCircle className="w-3 h-3 text-amber-400" />
                                                )}
                                              </button>
                                              <button
                                                onClick={() => handleDeleteCalendarSchedule(sched.id)}
                                                className="text-slate-400 hover:text-rose-400 cursor-pointer"
                                                title="Remover agendamento"
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </button>
                                            </div>
                                          </div>
                                          <div className="flex items-center justify-between text-[9px] text-slate-300">
                                            <span className="text-emerald-300 font-bold">{sched.boostMultiplier}</span>
                                            <span>~{sched.expectedClicks} cliq.</span>
                                          </div>
                                        </div>
                                      ))}

                                      {/* Drop Target Helper when empty or drag active */}
                                      {matchingSchedules.length === 0 && (
                                        <div
                                          onClick={() => setQuickAddModalSlot({ day: day.id, slotId: slot.id })}
                                          className="h-full min-h-[60px] rounded-lg border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-2 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/40 cursor-pointer transition-colors"
                                        >
                                          {isDropOver ? (
                                            <span className="text-[10px] font-black text-emerald-300 animate-pulse">
                                              Solte para agendar!
                                            </span>
                                          ) : (
                                            <>
                                              <Plus className="w-3.5 h-3.5 mb-0.5" />
                                              <span className="text-[9px] font-bold">Arraste ou clique</span>
                                            </>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Quick Add Modal */}
                {quickAddModalSlot && (
                  <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-7 max-w-md w-full text-white space-y-5 shadow-2xl"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-base">Agendar em Horário de Pico</h4>
                            <p className="text-xs text-slate-400">
                              {CALENDAR_DAYS.find(d => d.id === quickAddModalSlot.day)?.full} •{' '}
                              {HIGH_TRAFFIC_TIME_SLOTS.find(s => s.id === quickAddModalSlot.slotId)?.hours}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setQuickAddModalSlot(null)}
                          className="text-slate-400 hover:text-white cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-300 block">
                          Selecione o Anúncio Ativo para este Horário:
                        </label>
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {ads.filter(a => a.status === 'Ativo').map(ad => (
                            <button
                              key={ad.id}
                              onClick={() => handleAssignAdToSlot(ad.id, quickAddModalSlot.day, quickAddModalSlot.slotId)}
                              className="w-full p-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 transition-all text-left flex items-center gap-3 cursor-pointer group"
                            >
                              <img
                                src={ad.image}
                                alt={ad.title}
                                className="w-10 h-10 rounded-lg object-cover shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <span className="font-bold text-xs text-white block truncate group-hover:text-emerald-300">
                                  {ad.title}
                                </span>
                                <span className="text-[10px] text-slate-400 block">
                                  {ad.category} • {ad.price}
                                </span>
                              </div>
                              <Plus className="w-4 h-4 text-emerald-400 shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end pt-2 border-t border-white/10">
                        <button
                          onClick={() => setQuickAddModalSlot(null)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 cursor-pointer"
                        >
                          Fechar
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ================= 11. REDE DE PARCEIROS & PROGRAMA DE INDICAÇÃO LOCAL ================= */}
          {activeTab === 'partners' && (
            <div className="space-y-8 max-w-6xl">
              
              {/* Refer-a-Local-Business Sorocaba Expansion Program */}
              <ReferLocalBusinessProgram
                referrerBusinessName={userProfile.businessName}
                referrerOwnerName={userProfile.name}
                onAwardXp={addXp}
                onNewPartnerRegistered={(newPartner) =>
                  setPartnerBusinesses((prev) => [newPartner, ...prev])
                }
              />

              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl space-y-6 border border-emerald-500/30">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-xl shrink-0">
                      <Users className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full">
                          Diretório Oficial GuiaPonto
                        </span>
                        <span className="text-xs text-slate-400">Rede de Negócios Verificados</span>
                      </div>
                      <h3 className="text-2xl font-black mt-1">Busca de Parceiros e Negócios na Plataforma</h3>
                    </div>
                  </div>
                </div>

                {/* Search Bar & Category Filters */}
                <div className="space-y-4 pt-2">
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Pesquisar parceiros por nome, categoria ou região..."
                      value={partnerSearchQuery}
                      onChange={(e) => setPartnerSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-sm text-white placeholder:text-slate-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {['Todas', 'Restaurantes & Gastronomia', 'Casa de Repouso & Cuidado', 'Imobiliárias & Arquitetura', 'Oficinas & Automotivo', 'Saúde & Estética'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategoryFilter(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedCategoryFilter === cat ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPartners.length === 0 ? (
                  <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
                    <Search className="w-10 h-10 text-slate-400 mx-auto" />
                    <h4 className="font-extrabold text-slate-900 text-base">Nenhum parceiro encontrado</h4>
                    <p className="text-xs text-slate-500">Tente buscar por outro termo ou categoria no diretório GuiaPonto.</p>
                  </div>
                ) : (
                  filteredPartners.map(partner => (
                    <motion.div
                      key={partner.id}
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-48 relative overflow-hidden bg-slate-100">
                          <img src={partner.image} alt={partner.name} className="w-full h-full object-cover" />
                          <span className="absolute top-3 right-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-emerald-400 text-xs font-black rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verificado
                          </span>
                        </div>
                        <div className="p-6 space-y-3">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#FE3A18] bg-rose-50 px-2.5 py-0.5 rounded-full inline-block">
                            {partner.category}
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-base leading-snug">{partner.name}</h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{partner.location}</span>
                          </p>
                        </div>
                      </div>

                      <div className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-slate-100 mt-4">
                        <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>{partner.rating} / 5.0</span>
                        </span>
                        <a
                          href={`https://wa.me/55${partner.whatsapp.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(partner.name)},%20encontrei%20sua%20empresa%20no%20diretório%20de%20parceiros%20da%20GuiaPonto!`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => addXp(40, 'Conexão com Parceiro de Negócios')}
                          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* ================= 12. SEO OPTIMIZER WIDGET (GEMINI & GOOGLE SEARCH) ================= */}
          {activeTab === 'seoOptimizer' && (
            <div className="space-y-8 max-w-6xl">
              
              {/* Header Hero Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl space-y-6 border border-sky-500/30">
                <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 text-white flex items-center justify-center font-black shadow-xl shrink-0">
                      <Globe className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-400 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-sky-400" /> Google Search SERP Optimizer
                        </span>
                        <span className="text-xs text-slate-400">Powered by Gemini AI</span>
                      </div>
                      <h3 className="text-2xl font-black mt-1">SEO Optimizer: Meta Titles & Descriptions com IA</h3>
                      <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                        Insira as palavras-chave do seu negócio e obtenha recomendações automáticas de títulos e descrições otimizados para indexação orgânica de alta conversão no Google.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleRunSeoOptimizer}
                    disabled={isGeneratingSeo}
                    className="px-6 py-3.5 rounded-2xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-extrabold text-xs shadow-xl shadow-[#FE3A18]/30 transition-all cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    <Sparkles className={`w-4 h-4 ${isGeneratingSeo ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingSeo ? 'Gerando com Gemini...' : 'Gerar Novas Sugestões SEO'}</span>
                  </button>
                </div>

                {/* Status Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">SEO Quality Score</span>
                    <div className="text-2xl font-black text-sky-400 mt-1">{seoGeneratedResult?.score || 96}/100</div>
                    <span className="text-[11px] text-emerald-400 font-semibold mt-0.5 block">Nível Ouro de Relevância</span>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Palavras-Chave Ativas</span>
                    <div className="text-2xl font-black text-white mt-1">{seoKeywords.length} tags</div>
                    <span className="text-[11px] text-slate-300 font-semibold mt-0.5 block">Foco em busca regional</span>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Visibilidade Estimada</span>
                    <div className="text-2xl font-black text-emerald-400 mt-1">+48% no Google</div>
                    <span className="text-[11px] text-slate-300 font-semibold mt-0.5 block">Rich Snippets ativos</span>
                  </div>
                </div>
              </div>

              {/* Toast Feedback */}
              {seoCopiedToast && (
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 text-sm font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCheck className="w-5 h-5 text-sky-600" />
                  <span>{seoCopiedToast}</span>
                </div>
              )}

              {seoAppliedSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>Configurações de SEO e Meta Tags aplicadas com sucesso ao seu perfil público GuiaPonto! (+120 XP)</span>
                </div>
              )}

              {/* Interactive Settings and Keywords Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Form: Inputs & Keywords (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
                    <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#FE3A18]" />
                      <span>Configurações do Anúncio Base</span>
                    </h4>

                    {/* Ad Select */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Selecione o Anúncio para Otimizar
                      </label>
                      <select
                        value={seoSelectedAdId}
                        onChange={(e) => setSeoSelectedAdId(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FE3A18]"
                      >
                        {ads.map((ad) => (
                          <option key={ad.id} value={ad.id}>
                            {ad.title} ({ad.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Location Input */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Localização / Bairro Alvo (SEO Local)
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={seoLocation}
                          onChange={(e) => setSeoLocation(e.target.value)}
                          placeholder="Ex: Campolim, Sorocaba - SP"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FE3A18]"
                        />
                      </div>
                    </div>

                    {/* Keywords Tag Manager */}
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Palavras-Chave de Busca (Keywords)
                      </label>

                      {/* Add Keyword Input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={seoNewKeywordInput}
                          onChange={(e) => setSeoNewKeywordInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddSeoKeyword();
                            }
                          }}
                          placeholder="Digite uma palavra-chave..."
                          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FE3A18]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddSeoKeyword()}
                          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shrink-0"
                        >
                          + Adicionar
                        </button>
                      </div>

                      {/* Keywords Chips */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {seoKeywords.map((kw, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold"
                          >
                            <span>{kw}</span>
                            <button
                              onClick={() => handleRemoveSeoKeyword(idx)}
                              className="text-sky-400 hover:text-sky-700 cursor-pointer text-xs"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Quick Suggestions */}
                      <div className="pt-2">
                        <span className="block text-[11px] font-bold text-slate-400 mb-2">Sugestões rápidas de palavras-chave:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'Melhor Restaurante Sorocaba',
                            'Almoço Executivo Preço',
                            'Delivery WhatsApp Rápido',
                            'Ambiente Climatizado',
                            'Menu Executivo Campolim'
                          ].map((suggestion, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => handleAddSeoKeyword(suggestion)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              + {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleRunSeoOptimizer}
                      disabled={isGeneratingSeo}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FE3A18] to-rose-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-[#FE3A18]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className={`w-4 h-4 ${isGeneratingSeo ? 'animate-spin' : ''}`} />
                      <span>{isGeneratingSeo ? 'Otimizando com IA...' : 'Atualizar Sugestões com IA'}</span>
                    </button>
                  </div>
                </div>

                {/* Right Form: Live Google SERP Preview & Suggestions (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Google SERP Preview Card */}
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                        <h4 className="font-extrabold text-slate-900 text-sm">Visualização em Tempo Real no Google Search (SERP)</h4>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        Preview Desktop / Mobile
                      </span>
                    </div>

                    {/* Google Search Mockup Box */}
                    <div className="bg-[#f8f9fa] border border-slate-200 rounded-2xl p-5 space-y-2 font-sans text-left">
                      {/* URL Line */}
                      <div className="flex items-center gap-2 text-xs text-[#202124]">
                        <div className="w-5 h-5 rounded-full bg-[#FE3A18] text-white flex items-center justify-center text-[10px] font-black">
                          GP
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-xs leading-none text-[#202124]">GuiaPonto Brasil</span>
                          <span className="text-[11px] text-[#4d5156] leading-none mt-0.5">https://www.guiaponto.com.br › empresas › destaque</span>
                        </div>
                      </div>

                      {/* SERP Title */}
                      <h4 className="text-lg font-normal text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                        {seoGeneratedResult?.titles[selectedMetaTitleIndex] || 'Restaurante Sabor & Fogo | Almoço Executivo no Campolim Sorocaba'}
                      </h4>

                      {/* Google Rich Snippet (Rating stars) */}
                      <div className="flex items-center gap-2 text-xs text-[#70757a]">
                        <span className="text-amber-500 flex items-center gap-0.5">
                          ★★★★★
                        </span>
                        <span className="font-medium text-[#4d5156]">Classificação: 4.9 · 142 avaliações · Aberto agora</span>
                      </div>

                      {/* SERP Description */}
                      <p className="text-xs text-[#4d5156] leading-relaxed pt-0.5">
                        {seoGeneratedResult?.descriptions[selectedMetaDescIndex] || 'Procurando almoço executivo no Campolim? Pratos gourmet preparados na hora, ambiente climatizado e reserva direta no WhatsApp. Conheça nosso cardápio!'}
                      </p>
                    </div>
                  </div>

                  {/* Generated Meta Titles Selector */}
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <span>1. Sugestões de Meta Title</span>
                        <span className="text-[10px] text-slate-400 font-semibold">(Ideal: 50 a 60 caracteres)</span>
                      </h4>
                      <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full">
                        3 Opções Geradas
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {seoGeneratedResult?.titles.map((title, tIdx) => {
                        const len = title.length;
                        const isIdeal = len >= 45 && len <= 65;
                        const isSelected = selectedMetaTitleIndex === tIdx;
                        return (
                          <div
                            key={tIdx}
                            onClick={() => setSelectedMetaTitleIndex(tIdx)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              isSelected
                                ? 'border-[#FE3A18] bg-rose-50/30 shadow-sm'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${
                                isSelected ? 'bg-[#FE3A18] text-white' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {tIdx + 1}
                              </span>
                              <span className="text-xs font-bold text-slate-900 leading-relaxed">
                                {title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isIdeal ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {len} caracteres
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopySeoText(title, 'Meta Title');
                                }}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                                title="Copiar Título"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Generated Meta Descriptions Selector */}
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <span>2. Sugestões de Meta Description</span>
                        <span className="text-[10px] text-slate-400 font-semibold">(Ideal: 140 a 160 caracteres)</span>
                      </h4>
                      <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full">
                        Com CTA WhatsApp
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {seoGeneratedResult?.descriptions.map((desc, dIdx) => {
                        const len = desc.length;
                        const isIdeal = len >= 120 && len <= 165;
                        const isSelected = selectedMetaDescIndex === dIdx;
                        return (
                          <div
                            key={dIdx}
                            onClick={() => setSelectedMetaDescIndex(dIdx)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                              isSelected
                                ? 'border-[#FE3A18] bg-rose-50/30 shadow-sm'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${
                                isSelected ? 'bg-[#FE3A18] text-white' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {dIdx + 1}
                              </span>
                              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                {desc}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isIdeal ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {len} caracteres
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopySeoText(desc, 'Meta Description');
                                }}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                                title="Copiar Descrição"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SEO Audit Checklist & Apply Action */}
                  <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Checklist de Otimização Orgânica</span>
                      </h4>
                      <span className="text-xs font-black text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full">
                        100% Validado
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                      {seoGeneratedResult?.recommendations.map((rec, rIdx) => (
                        <div key={rIdx} className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        onClick={handleApplySeoToProfile}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Aplicar Meta Tags ao Meu Perfil Público (+120 XP)</span>
                      </button>

                      <button
                        onClick={() => {
                          const title = seoGeneratedResult?.titles[selectedMetaTitleIndex] || '';
                          const desc = seoGeneratedResult?.descriptions[selectedMetaDescIndex] || '';
                          handleCopySeoText(`<!-- Meta Tags GuiaPonto -->\n<title>${title}</title>\n<meta name="description" content="${desc}">`, 'Tags HTML');
                        }}
                        className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copiar Tags HTML</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>
      </div>

      {/* Real-time Simulated Notification Banner (Framer Motion) */}
      <AnimatePresence>
        {liveAlertToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-6 z-50 bg-gradient-to-r from-slate-900 to-slate-950 border border-[#FE3A18]/50 text-white p-5 rounded-3xl shadow-2xl max-w-sm w-full space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FE3A18] animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FE3A18]">Alerta em Tempo Real</span>
              </div>
              <button onClick={() => setLiveAlertToast(null)} className="text-slate-400 hover:text-white text-xs cursor-pointer">✕</button>
            </div>
            <div>
              <h5 className="font-extrabold text-sm text-white">{liveAlertToast.title}</h5>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{liveAlertToast.desc}</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-slate-400">
              <span>GuiaPonto Live Engine</span>
              <span className="text-emerald-400 font-bold">+30 XP ganhos</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating XP Gain Toast */}
      <AnimatePresence>
        {xpToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/50 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
              +{xpToast.points}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">XP Ganho!</span>
              <p className="text-xs font-semibold text-slate-200">{xpToast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GuiaPonto IA Mentor Floating Chat Widget */}
      <div className="fixed bottom-6 left-6 z-50">
        {!isMentorOpen ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMentorOpen(true)}
            className="bg-gradient-to-r from-[#FE3A18] to-rose-600 text-white pl-3 pr-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 font-extrabold text-sm cursor-pointer border border-white/20"
          >
            <img
              src="https://www.guiaponto.com.br/guia/wp-content/themes/guiaponto-guia/assets/img/robo-480.webp"
              alt="GuiaPonto IA Mentor"
              referrerPolicy="no-referrer"
              className="w-10 h-10 object-contain drop-shadow-md"
            />
            <span>GuiaPonto IA Mentor</span>
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-80 sm:w-96 flex flex-col h-[500px] overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-[#FE3A18]/40 p-1 flex items-center justify-center shadow-md shrink-0">
                  <img
                    src="https://www.guiaponto.com.br/guia/wp-content/themes/guiaponto-guia/assets/img/robo-480.webp"
                    alt="GuiaPonto IA Mentor"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">GuiaPonto IA Mentor</h4>
                  <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" /> Powered by Gemini
                  </p>
                </div>
              </div>
              <button onClick={() => setIsMentorOpen(false)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
              {mentorMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#FE3A18] text-white rounded-br-xs shadow-md'
                      : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-xs'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isMentorLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3.5 rounded-2xl rounded-bl-xs border border-slate-200 shadow-xs flex items-center gap-2 text-xs text-slate-500">
                    <Bot className="w-4 h-4 animate-spin text-[#FE3A18]" />
                    <span>Gemini IA está pensando...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-2 bg-slate-100/80 border-t border-slate-200 flex gap-2 overflow-x-auto text-[11px] scrollbar-none">
              {[
                'Como melhorar conversão?',
                'Melhor horário para impulsionar',
                'Como subir de nível?',
                'Escrever título para anúncio'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => { setMentorInput(chip); }}
                  className="px-3 py-1 bg-white hover:bg-rose-50 text-slate-700 hover:text-[#FE3A18] rounded-full border border-slate-200 whitespace-nowrap font-medium transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMentorMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Pergunte ao IA Mentor..."
                value={mentorInput}
                onChange={(e) => setMentorInput(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#FE3A18] focus:outline-none"
              />
              <button
                type="submit"
                disabled={isMentorLoading || !mentorInput.trim()}
                className="p-2.5 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white transition-colors cursor-pointer disabled:opacity-50 shadow-md"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </div>

      {/* Guided Tour Modal */}
      <AnimatePresence>
        {showGuidedTour && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 text-white border border-slate-800 rounded-3xl max-w-xl w-full p-8 shadow-2xl relative space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FE3A18] text-white flex items-center justify-center font-black">
                    {tourStep}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#FE3A18]">Tour Guiado • Executive Suite</span>
                    <h3 className="text-xl font-black text-white">
                      {tourStep === 1 && 'Bem-vindo ao Escritório Virtual'}
                      {tourStep === 2 && 'AI Ad Optimizer & Gemini'}
                      {tourStep === 3 && 'Gráficos de Performance e Métricas'}
                      {tourStep === 4 && 'Reputação e Níveis Pro'}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setShowGuidedTour(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                {tourStep === 1 && (
                  <p>
                    Olá, Alexandre! Esta é a sua central de alta performance na rede <strong>GuiaPonto</strong>. Aqui você gerencia anúncios, atende leads do WhatsApp em tempo real e monitora sua reputação comercial.
                  </p>
                )}
                {tourStep === 2 && (
                  <p>
                    Acesse a aba <strong>IA Sugestões de Otimização</strong> para utilizar o poder do Gemini na análise de suas campanhas, recebendo sugestões automáticas de melhorias na copy e público-alvo!
                  </p>
                )}
                {tourStep === 3 && (
                  <p>
                    Acompanhe métricas em tempo real, simule ganhos no novo <strong>Estimated Revenue Projection</strong> (previsão mensal baseada em CTR e ticket médio) e potencialize sua indexação no Google com o <strong>Otimizador de SEO</strong>!
                  </p>
                )}
                {tourStep === 4 && (
                  <p>
                    Ganhe XP completando tarefas, respondendo leads rapidamente e desbloqueie o status <strong>GuiaPonto Pro Legend</strong> com selos exclusivos e prioridade máxima!
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4].map(s => (
                    <div
                      key={s}
                      className={`h-2 rounded-full transition-all ${
                        s === tourStep ? 'w-8 bg-[#FE3A18]' : 'w-2 bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  {tourStep > 1 && (
                    <button
                      onClick={() => setTourStep(prev => prev - 1)}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Anterior
                    </button>
                  )}
                  {tourStep < totalTourSteps ? (
                    <button
                      onClick={() => setTourStep(prev => prev + 1)}
                      className="px-6 py-2.5 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-extrabold text-xs shadow-lg shadow-[#FE3A18]/30 transition-all cursor-pointer"
                    >
                      Próximo
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishTour}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/35 transition-all cursor-pointer"
                    >
                      Concluir Tour (+150 XP)
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Confetti & 3D Badge / Milestone Achievement Celebration Modal */}
      <AchievementCelebration />

    </div>
  );
}
