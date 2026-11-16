/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  Sparkles,
  Bot,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Search,
  Filter,
  Copy,
  Check,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  MapPin,
  Plus,
  X,
  Award,
  TrendingUp
} from 'lucide-react';

export type ReviewSentiment = 'Positivo' | 'Neutro' | 'Crítico / Negativo';

export type ReviewResponseTone =
  | 'Empático & Solucionador (Recomendado)'
  | 'Agradecimento VIP + Convite de Retorno'
  | 'Gestão de Crise + Cupom de Retratação'
  | 'Institucional & Objetivo (SEO Local)';

export interface ReviewAIDraft {
  replyText: string;
  strategyNote: string;
  tone: ReviewResponseTone;
  generatedAt: string;
  sentAt?: string;
}

export interface CustomerReviewItem {
  id: string;
  customerName: string;
  customerAvatar: string;
  neighborhood: string;
  adTitle: string;
  category: string;
  rating: 1 | 2 | 3 | 4 | 5;
  sentiment: ReviewSentiment;
  comment: string;
  date: string;
  verifiedCustomer: boolean;
  source: 'Diretório GuiaPonto' | 'QR Code Balcão' | 'Google Meu Negócio Sync';
  highlights: string[];
  responseStatus: 'Pendente' | 'Rascunho IA Pronto' | 'Respondido';
  aiResponseDraft?: ReviewAIDraft;
}

function generateReviewResponseFallback(
  review: CustomerReviewItem,
  businessName: string,
  tone: ReviewResponseTone
): { replyText: string; strategyNote: string } {
  const firstName = review.customerName.split(' ')[0] || review.customerName;
  const isPositive = review.rating >= 4;
  const isNeutral = review.rating === 3;
  const isVoucherTone = tone === 'Gestão de Crise + Cupom de Retratação';
  const isVipTone = tone === 'Agradecimento VIP + Convite de Retorno';

  if (isPositive) {
    return {
      strategyNote: `Avaliação Positiva (${review.rating}★): Reforça os elogios citados pelo cliente, inclui palavras-chave de SEO local em Sorocaba (${review.neighborhood}) e incentiva a recorrência.`,
      replyText: isVipTone
        ? `Olá, ${firstName}! Que alegria ler sua avaliação de ${review.rating} estrelas! 🌟\n\nToda a nossa equipe do ${businessName} fica imensamente grata pelo carinho ao destacar nosso atendimento e qualidade referente a "${review.adTitle}". Trabalhamos todos os dias para oferecer a melhor experiência para clientes de ${review.neighborhood} e de toda Sorocaba.\n\nNa sua próxima visita ou contato pelo GuiaPonto Sorocaba, informe o código CLIENTEVIP5 para receber um mimo especial preparado para você!\n\nUm grande abraço,\nEquipe ${businessName}`
        : `Olá, ${review.customerName}! Muito obrigado pela avaliação de ${review.rating} estrelas e por compartilhar sua experiência conosco no GuiaPonto Sorocaba! 🙏✨\n\nFicamos muito felizes em saber que atendemos suas expectativas em "${review.adTitle}". Seu reconhecimento motiva nossa equipe a manter o padrão de excelência para todos os clientes de ${review.neighborhood} e região.\n\nSerá um prazer receber você novamente muito em breve!\n\nAtenciosamente,\nDiretoria — ${businessName}`
    };
  }

  if (isNeutral) {
    return {
      strategyNote: `Avaliação Neutra (3★): Agradece o feedback equilibrado, demonstra abertura genuína para evoluir nos pontos observados e convida para uma nova experiência superior.`,
      replyText: `Olá, ${review.customerName}! Agradecemos por dedicar seu tempo para avaliar nosso atendimento em "${review.adTitle}".\n\nValorizamos muito sua opinião sincera. Ficamos felizes pelos pontos positivos, mas já repassamos suas observações para nossa coordenação em Sorocaba para aprimorarmos a agilidade e os detalhes que você mencionou.\n${
        isVoucherTone
          ? '\nGostaríamos muito de proporcionar uma experiência 5 estrelas na sua próxima visita: reservamos um voucher especial de cortesia (código RETORNO10) em seu nome.\n'
          : '\nEsperamos ter a oportunidade de surpreender você positivamente em breve!\n'
      }\nCordialmente,\nGestão de Qualidade — ${businessName}`
    };
  }

  // Negative / Critical Review (1 or 2 stars)
  return {
    strategyNote: `Recuperação de Cliente Crítico (${review.rating}★): Aplica técnica de desescalada empática sem postura defensiva, assume compromisso imediato de correção e oferece canal direto com a gerência.`,
    replyText: `Olá, ${review.customerName}. Primeiramente, pedimos sinceras desculpas pela experiência abaixo do esperado que você relatou referente a "${review.adTitle}".\n\nNo ${businessName}, levamos cada apontamento muito a sério e esse definitivamente não é o padrão de qualidade e pontualidade pelo qual somos reconhecidos em Sorocaba. Já acionamos nossa gerência operacional para corrigir imediatamente a falha mencionada.\n${
      isVoucherTone
        ? '\nQueremos reverter essa impressão pessoalmente: liberamos um crédito/cortesia integral de retratação em seu CPF/cadastro (código CUIDADO100) e nossa gerência está à disposição no WhatsApp prioritário para atendê-lo(a).\n'
        : '\nGostaríamos de conversar diretamente com você para solucionar a questão da melhor forma possível. Poderia nos chamar no WhatsApp da gerência ou responder por aqui no seu melhor horário?\n'
    }\nAtenciosamente e com total compromisso,\nGerência Executiva — ${businessName}`
  };
}

async function askGeminiReviewResponse(
  review: CustomerReviewItem,
  businessName: string,
  tone: ReviewResponseTone
): Promise<{ replyText: string; strategyNote: string }> {
  const fallback = generateReviewResponseFallback(review, businessName, tone);

  try {
    const prompt = `Você é um Especialista em Gestão de Reputação, Customer Success e SEO Local do GuiaPonto Sorocaba.
Redija uma resposta profissional, humana e altamente estratégica em Português do Brasil para a seguinte avaliação de cliente:

- Nome do Cliente: ${review.customerName}
- Bairro/Cidade do Cliente: ${review.neighborhood}
- Nota da Avaliação: ${review.rating} de 5 estrelas (${review.sentiment})
- Anúncio/Serviço Avaliado: ${review.adTitle} (${review.category})
- Comentário do Cliente: "${review.comment}"
- Nome da Empresa: ${businessName}
- Tom de Voz Escolhido: ${tone}

Diretrizes:
1. Se a avaliação for POSITIVA (4 ou 5 estrelas): agradeça pelo nome, mencione especificamente o ponto elogiado pelo cliente, reforce a autoridade local em Sorocaba e convide para retornar.
2. Se a avaliação for NEGATIVA ou CRÍTICA (1 ou 2 estrelas) ou NEUTRA (3 estrelas): demonstre empatia imediata sem ser defensivo, peça desculpas pelo transtorno específico citado, explique que a gerência já tomou providências e ofereça uma solução prática/canal direto para recuperar a confiança do cliente.

Retorne APENAS um JSON válido com o formato:
{
  "replyText": "Texto completo da resposta pronta para envio ao cliente",
  "strategyNote": "Resumo em 1 frase da estratégia psicológica e de reputação utilizada nesta resposta"
}`;

    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        responseMimeType: 'application/json'
      })
    });

    if (!res.ok) return fallback;
    const data = await res.json();
    if (data?.text) {
      const parsed = JSON.parse(data.text);
      if (parsed.replyText) {
        return {
          replyText: parsed.replyText,
          strategyNote: parsed.strategyNote || fallback.strategyNote
        };
      }
    }
    return fallback;
  } catch (err) {
    console.warn('Fallback ativado para Resposta de Avaliação IA:', err);
    return fallback;
  }
}

interface ReviewManagementSectionProps {
  businessName: string;
  isDarkMode?: boolean;
  onAwardXp?: (amount: number, reason: string) => void;
}

export function ReviewManagementSection({
  businessName,
  onAwardXp
}: ReviewManagementSectionProps) {
  const [selectedTone, setSelectedTone] = useState<ReviewResponseTone>(
    'Empático & Solucionador (Recomendado)'
  );
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [filterSentiment, setFilterSentiment] = useState<
    'Todos' | 'Pendentes' | 'Positivos' | 'Negativos'
  >('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGeneratingId, setIsGeneratingId] = useState<string | null>(null);
  const [isBatchGenerating, setIsBatchGenerating] = useState<boolean>(false);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [reviews, setReviews] = useState<CustomerReviewItem[]>(() => {
    const initialList: CustomerReviewItem[] = [
      {
        id: 'rev-1',
        customerName: 'Mariana Costa Moura',
        customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        neighborhood: 'Parque Campolim, Sorocaba',
        adTitle: 'Restaurante Sabor & Fogo - Almoço Executivo',
        category: 'Restaurantes & Gastronomia',
        rating: 5,
        sentiment: 'Positivo',
        comment:
          'Experiência impecável no almoço executivo! Encontrei pelo GuiaPonto Sorocaba, fiz a reserva pelo WhatsApp e quando cheguei a mesa já estava pronta. O bife ancho estava no ponto perfeito e a sobremesa de cortesia ganhou meu coração.',
        date: 'Hoje, 13:40',
        verifiedCustomer: true,
        source: 'Diretório GuiaPonto',
        highlights: ['Atendimento Rápido', 'Ponto da Carne', 'Reserva WhatsApp'],
        responseStatus: 'Rascunho IA Pronto'
      },
      {
        id: 'rev-2',
        customerName: 'Carlos Eduardo Nogueira',
        customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        neighborhood: 'Trujillo, Sorocaba',
        adTitle: 'Restaurante Sabor & Fogo - Almoço Executivo',
        category: 'Restaurantes & Gastronomia',
        rating: 2,
        sentiment: 'Crítico / Negativo',
        comment:
          'A comida é muito saborosa, porém na sexta-feira o meu pedido demorou quase 45 minutos para sair na hora do almoço e eu precisava voltar para o escritório no Centro. Além disso, o ar-condicionado perto da janela estava fraco.',
        date: 'Ontem, 15:15',
        verifiedCustomer: true,
        source: 'QR Code Balcão',
        highlights: ['Tempo de Espera no Pico', 'Climatização', 'Sabor Elogiado'],
        responseStatus: 'Rascunho IA Pronto'
      },
      {
        id: 'rev-3',
        customerName: 'Beatriz & Família Mello',
        customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        neighborhood: 'Santa Rosália, Sorocaba',
        adTitle: 'Residencial Sênior Acolher',
        category: 'Casa de Repouso & Cuidado',
        rating: 5,
        sentiment: 'Positivo',
        comment:
          'Não tenho palavras para agradecer o carinho da equipe de enfermagem e fisioterapia com a minha avó. Estrutura impecável em Santa Rosália, jardins lindos e total transparência com a família todos os dias.',
        date: 'Há 2 dias',
        verifiedCustomer: true,
        source: 'Diretório GuiaPonto',
        highlights: ['Cuidado Humanizado', 'Enfermagem 24h', 'Segurança Familiar'],
        responseStatus: 'Respondido'
      },
      {
        id: 'rev-4',
        customerName: 'Rafael Arruda Vieira',
        customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        neighborhood: 'Centro, Votorantim',
        adTitle: 'Imobiliária Prime Sorocaba - Alto Padrão',
        category: 'Imobiliárias & Arquitetura',
        rating: 1,
        sentiment: 'Crítico / Negativo',
        comment:
          'Solicitei informações de dois sobrados em condomínio na Zona Sul no sábado à tarde e o corretor plantonista demorou até segunda-feira de manhã para enviar a ficha técnica prometida.',
        date: 'Há 3 dias',
        verifiedCustomer: true,
        source: 'Google Meu Negócio Sync',
        highlights: ['Demora no Plantão', 'Envio de Ficha Técnica'],
        responseStatus: 'Pendente'
      },
      {
        id: 'rev-5',
        customerName: 'Fernanda L. Camargo',
        customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        neighborhood: 'Wanel Ville, Sorocaba',
        adTitle: 'Restaurante Sabor & Fogo - Almoço Executivo',
        category: 'Restaurantes & Gastronomia',
        rating: 4,
        sentiment: 'Positivo',
        comment:
          'Pratos muito bem servidos e preço justo para a região do Campolim. Só sugiro ampliar as opções de sucos naturais sem açúcar no cardápio executivo. Voltarei com certeza!',
        date: 'Há 4 dias',
        verifiedCustomer: true,
        source: 'QR Code Balcão',
        highlights: ['Custo-Benefício', 'Sugestão de Cardápio'],
        responseStatus: 'Pendente'
      },
      {
        id: 'rev-6',
        customerName: 'Dr. Gustavo Penteado',
        customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        neighborhood: 'Mangal, Sorocaba',
        adTitle: 'Imobiliária Prime Sorocaba - Alto Padrão',
        category: 'Imobiliárias & Arquitetura',
        rating: 3,
        sentiment: 'Neutro',
        comment:
          'As opções de imóveis apresentadas no portal são excelentes, mas senti falta de um tour virtual 360º em alguns anúncios antes de agendar a visita presencial.',
        date: 'Há 5 dias',
        verifiedCustomer: true,
        source: 'Diretório GuiaPonto',
        highlights: ['Curadoria de Imóveis', 'Sugestão Tour 360º'],
        responseStatus: 'Pendente'
      }
    ];

    return initialList.map((item) => {
      if (item.responseStatus === 'Pendente') return item;
      const generated = generateReviewResponseFallback(
        item,
        businessName,
        'Empático & Solucionador (Recomendado)'
      );
      return {
        ...item,
        aiResponseDraft: {
          replyText: generated.replyText,
          strategyNote: generated.strategyNote,
          tone: 'Empático & Solucionador (Recomendado)',
          generatedAt: item.responseStatus === 'Respondido' ? 'Respondido há 2 dias' : 'Rascunho IA gerado automaticamente',
          sentAt: item.responseStatus === 'Respondido' ? 'Publicado no Perfil' : undefined
        }
      };
    });
  });

  const [selectedReviewId, setSelectedReviewId] = useState<string>('rev-2');

  // Aggregated Star-Rating Breakdown & Metrics
  const ratingAnalytics = useMemo(() => {
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = total > 0 ? sum / total : 5.0;

    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
    });

    const positiveCount = reviews.filter((r) => r.rating >= 4).length;
    const negativeCount = reviews.filter((r) => r.rating <= 2).length;
    const answeredCount = reviews.filter((r) => r.responseStatus === 'Respondido').length;
    const readyDraftsCount = reviews.filter((r) => r.responseStatus === 'Rascunho IA Pronto').length;
    const pendingCount = reviews.filter((r) => r.responseStatus !== 'Respondido').length;

    return {
      total,
      average,
      counts,
      positiveCount,
      negativeCount,
      answeredCount,
      readyDraftsCount,
      pendingCount,
      responseRate: total > 0 ? Math.round((answeredCount / total) * 100) : 100
    };
  }, [reviews]);

  // Filtered reviews list
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (filterRating !== 'all' && r.rating !== filterRating) return false;
      if (filterSentiment === 'Pendentes' && r.responseStatus === 'Respondido') return false;
      if (filterSentiment === 'Positivos' && r.rating < 4) return false;
      if (filterSentiment === 'Negativos' && r.rating > 2) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          r.customerName.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q) ||
          r.adTitle.toLowerCase().includes(q) ||
          r.neighborhood.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [reviews, filterRating, filterSentiment, searchQuery]);

  const selectedReview = useMemo(() => {
    return (
      reviews.find((r) => r.id === selectedReviewId) ||
      filteredReviews[0] ||
      reviews[0]
    );
  }, [reviews, selectedReviewId, filteredReviews]);

  const handleGenerateResponseForReview = async (
    review: CustomerReviewItem,
    customTone?: ReviewResponseTone
  ) => {
    const activeTone = customTone || selectedTone;
    setIsGeneratingId(review.id);
    setSelectedReviewId(review.id);

    const generated = await askGeminiReviewResponse(review, businessName, activeTone);

    setReviews((prev) =>
      prev.map((item) =>
        item.id === review.id
          ? {
              ...item,
              responseStatus:
                item.responseStatus === 'Respondido' ? 'Respondido' : 'Rascunho IA Pronto',
              aiResponseDraft: {
                replyText: generated.replyText,
                strategyNote: generated.strategyNote,
                tone: activeTone,
                generatedAt: 'Gerado agora via Gemini IA'
              }
            }
          : item
      )
    );
    setIsGeneratingId(null);
    setFeedbackBanner(
      `Resposta IA (${review.rating}★ • ${review.sentiment}) gerada para ${review.customerName}!`
    );
    setTimeout(() => setFeedbackBanner(null), 4000);
  };

  const handleBatchDraftAllPending = async () => {
    setIsBatchGenerating(true);
    const pendingList = reviews.filter((r) => !r.aiResponseDraft);
    for (const rev of pendingList) {
      const generated = generateReviewResponseFallback(rev, businessName, selectedTone);
      setReviews((prev) =>
        prev.map((item) =>
          item.id === rev.id
            ? {
                ...item,
                responseStatus: 'Rascunho IA Pronto',
                aiResponseDraft: {
                  replyText: generated.replyText,
                  strategyNote: generated.strategyNote,
                  tone: selectedTone,
                  generatedAt: 'Gerado em lote pela IA'
                }
              }
            : item
        )
      );
    }
    setIsBatchGenerating(false);
    onAwardXp?.(60, 'Rascunhos IA em Lote para Avaliações');
    setFeedbackBanner('Todos os feedbacks pendentes receberam rascunhos personalizados da IA!');
    setTimeout(() => setFeedbackBanner(null), 4000);
  };

  const handleUpdateDraftText = (reviewId: string, newText: string) => {
    setReviews((prev) =>
      prev.map((item) => {
        if (item.id !== reviewId) return item;
        const currentDraft = item.aiResponseDraft || {
          replyText: newText,
          strategyNote: 'Resposta editada manualmente pelo gestor.',
          tone: selectedTone,
          generatedAt: 'Editado agora'
        };
        return {
          ...item,
          aiResponseDraft: {
            ...currentDraft,
            replyText: newText
          }
        };
      })
    );
  };

  const handlePublishReviewResponse = (reviewId: string) => {
    const target = reviews.find((r) => r.id === reviewId);
    if (!target || !target.aiResponseDraft) return;

    setReviews((prev) =>
      prev.map((item) =>
        item.id === reviewId && item.aiResponseDraft
          ? {
              ...item,
              responseStatus: 'Respondido',
              aiResponseDraft: {
                ...item.aiResponseDraft,
                generatedAt: 'Publicado oficialmente agora',
                sentAt: 'Visível no Diretório Sorocaba'
              }
            }
          : item
      )
    );
    onAwardXp?.(90, `Avaliação ${target.rating}★ Respondida (${target.customerName})`);
    setFeedbackBanner(
      `Resposta publicada com sucesso para ${target.customerName}! Sua taxa de resposta no GuiaPonto Sorocaba subiu.`
    );
    setTimeout(() => setFeedbackBanner(null), 4500);
  };

  const handleCopyResponse = (review: CustomerReviewItem) => {
    if (!review.aiResponseDraft) return;
    navigator.clipboard.writeText(review.aiResponseDraft.replyText);
    setCopiedId(review.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSimulateIncomingReview = async (type: 'positive' | 'negative') => {
    const newId = `rev-${Date.now()}`;
    const newReview: CustomerReviewItem =
      type === 'positive'
        ? {
            id: newId,
            customerName: 'Luciana T. Ferraz',
            customerAvatar:
              'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
            neighborhood: 'Além Ponte, Sorocaba',
            adTitle: 'Restaurante Sabor & Fogo - Almoço Executivo',
            category: 'Restaurantes & Gastronomia',
            rating: 5,
            sentiment: 'Positivo',
            comment:
              'Melhor descoberta da semana pelo GuiaPonto! Escaneamos o QR Code no balcão, fomos super bem atendidos pelo garçom e o prato executivo estava divino.',
            date: 'Agora mesmo',
            verifiedCustomer: true,
            source: 'QR Code Balcão',
            highlights: ['QR Code Balcão', 'Atendimento Nota 10', 'Sabor Excelente'],
            responseStatus: 'Rascunho IA Pronto'
          }
        : {
            id: newId,
            customerName: 'Marcelo H. Domingues',
            customerAvatar:
              'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
            neighborhood: 'Campolim, Sorocaba',
            adTitle: 'Restaurante Sabor & Fogo - Almoço Executivo',
            category: 'Restaurantes & Gastronomia',
            rating: 2,
            sentiment: 'Crítico / Negativo',
            comment:
              'Tentei estacionar no convênio informado no anúncio às 12h30 e estava lotado, acabei perdendo 20 minutos procurando vaga na avenida e meu prato chegou morno.',
            date: 'Agora mesmo',
            verifiedCustomer: true,
            source: 'Diretório GuiaPonto',
            highlights: ['Estacionamento no Pico', 'Temperatura do Prato'],
            responseStatus: 'Rascunho IA Pronto'
          };

    const generated = await askGeminiReviewResponse(newReview, businessName, selectedTone);
    newReview.aiResponseDraft = {
      replyText: generated.replyText,
      strategyNote: generated.strategyNote,
      tone: selectedTone,
      generatedAt: 'Gerado automaticamente ao receber avaliação'
    };

    setReviews((prev) => [newReview, ...prev]);
    setSelectedReviewId(newId);
    setFilterRating('all');
    setFilterSentiment('Todos');
    setFeedbackBanner(
      type === 'positive'
        ? 'Nova avaliação 5★ recebida! A IA já preparou um rascunho de agradecimento VIP.'
        : 'Nova avaliação crítica (2★) detectada! A IA já preparou uma resposta de contenção e recuperação do cliente.'
    );
    setTimeout(() => setFeedbackBanner(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner + Star-Rating Breakdown Dashboard */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>Central de Avaliações & Gestão de Reputação IA</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Feedback de Clientes & Respostas Inteligentes (Positivas e Críticas)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Monitore todas as avaliações recebidas em Sorocaba e região, analise a distribuição por estrelas e utilize o Gemini IA para responder elogios ou reverter avaliações negativas com rapidez.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleSimulateIncomingReview('positive')}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ Simular Elogio (5★)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSimulateIncomingReview('negative')}
              className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ThumbsDown className="w-3.5 h-3.5 text-rose-600" />
              <span>+ Simular Crítica (2★)</span>
            </button>

            <button
              type="button"
              disabled={isBatchGenerating}
              onClick={handleBatchDraftAllPending}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#FE3A18] text-white font-black text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isBatchGenerating ? 'animate-spin' : 'text-amber-400'}`} />
              <span>Gerar Rascunhos IA Pendentes</span>
            </button>
          </div>
        </div>

        {/* Star-Rating Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Overall Score Card */}
          <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Nota Geral Consolidada
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Verificado Sorocaba
              </span>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-black tracking-tight text-white">
                {ratingAnalytics.average.toFixed(1)}
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(ratingAnalytics.average)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-300 font-semibold">
                  Baseado em {ratingAnalytics.total} avaliações reais
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
              <div className="bg-white/5 rounded-xl p-2">
                <div className="text-sm font-black text-emerald-400">{ratingAnalytics.positiveCount}</div>
                <div className="text-[10px] text-slate-400 font-bold">Positivas (4-5★)</div>
              </div>
              <div className="bg-white/5 rounded-xl p-2">
                <div className="text-sm font-black text-rose-400">{ratingAnalytics.negativeCount}</div>
                <div className="text-[10px] text-slate-400 font-bold">Críticas (1-2★)</div>
              </div>
              <div className="bg-white/5 rounded-xl p-2">
                <div className="text-sm font-black text-amber-300">{ratingAnalytics.responseRate}%</div>
                <div className="text-[10px] text-slate-400 font-bold">Respondidas</div>
              </div>
            </div>
          </div>

          {/* Center: Interactive 5-Star to 1-Star Breakdown Bars */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-3xl p-5 space-y-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                Distribuição por Estrelas (Clique para filtrar)
              </span>
              {filterRating !== 'all' && (
                <button
                  type="button"
                  onClick={() => setFilterRating('all')}
                  className="text-xs font-bold text-[#FE3A18] hover:underline cursor-pointer"
                >
                  Mostrar todas ({ratingAnalytics.total})
                </button>
              )}
            </div>

            {[5, 4, 3, 2, 1].map((starLevel) => {
              const count = ratingAnalytics.counts[starLevel] || 0;
              const pct =
                ratingAnalytics.total > 0
                  ? Math.round((count / ratingAnalytics.total) * 100)
                  : 0;
              const isSelectedStar = filterRating === starLevel;

              const barColor =
                starLevel >= 4
                  ? 'bg-emerald-500'
                  : starLevel === 3
                  ? 'bg-amber-400'
                  : 'bg-rose-500';

              return (
                <button
                  key={starLevel}
                  type="button"
                  onClick={() =>
                    setFilterRating(isSelectedStar ? 'all' : starLevel)
                  }
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    isSelectedStar
                      ? 'bg-white ring-2 ring-[#FE3A18] shadow-xs'
                      : 'hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center gap-1 w-16 shrink-0 text-xs font-extrabold text-slate-800">
                    <span>{starLevel}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>

                  <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="w-20 text-right text-xs font-bold text-slate-600 shrink-0">
                    {count} <span className="text-slate-400">({pct}%)</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: AI Response Strategy & Tone Controls */}
          <div className="lg:col-span-3 bg-gradient-to-br from-orange-50/80 via-white to-amber-50/50 border border-orange-200/70 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-[#FE3A18] font-black text-xs uppercase tracking-wider">
              <Bot className="w-4 h-4" />
              <span>Motor de Resposta IA</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                Tom Padrão das Respostas IA:
              </label>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value as ReviewResponseTone)}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FE3A18]"
              >
                <option value="Empático & Solucionador (Recomendado)">
                  Empático & Solucionador (Padrão)
                </option>
                <option value="Agradecimento VIP + Convite de Retorno">
                  Agradecimento VIP + Mimo Retorno
                </option>
                <option value="Gestão de Crise + Cupom de Retratação">
                  Gestão de Crise + Voucher Retratação
                </option>
                <option value="Institucional & Objetivo (SEO Local)">
                  Institucional & Foco em SEO Local
                </option>
              </select>
            </div>

            <div className="bg-white/90 rounded-2xl p-3 border border-orange-100 text-[11px] text-slate-600 leading-relaxed">
              <strong className="text-slate-900 block mb-0.5">Dica de SEO Local Sorocaba:</strong>
              Responder avaliações críticas (1–2★) em até 24h aumenta em <strong>+38%</strong> a conversão de novos clientes que leem os comentários no diretório.
            </div>
          </div>
        </div>
      </div>

      {/* Live Feedback Banner */}
      <AnimatePresence>
        {feedbackBanner && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl px-5 py-3.5 flex items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackBanner(null)}
              className="text-emerald-700 hover:text-emerald-950 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Split Workspace: Customer Reviews Feed + AI Response Composer */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customer Reviews List */}
        <div className="xl:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'Todos', label: `Todas (${reviews.length})` },
                  {
                    id: 'Pendentes',
                    label: `Pendentes (${ratingAnalytics.pendingCount})`
                  },
                  {
                    id: 'Positivos',
                    label: `Positivas 4-5★ (${ratingAnalytics.positiveCount})`
                  },
                  {
                    id: 'Negativos',
                    label: `Críticas 1-2★ (${ratingAnalytics.negativeCount})`
                  }
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterSentiment(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterSentiment === tab.id
                      ? 'bg-[#FE3A18] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar cliente ou comentário..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#FE3A18]"
              />
            </div>
          </div>

          {/* Reviews Cards Feed */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">
                  Nenhuma avaliação encontrada para este filtro.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilterRating('all');
                    setFilterSentiment('Todos');
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold text-[#FE3A18] underline cursor-pointer"
                >
                  Limpar filtros de avaliação
                </button>
              </div>
            ) : (
              filteredReviews.map((rev) => {
                const isSelected = selectedReview?.id === rev.id;
                const isCritical = rev.rating <= 2;
                const isPositive = rev.rating >= 4;

                return (
                  <div
                    key={rev.id}
                    onClick={() => setSelectedReviewId(rev.id)}
                    className={`rounded-2xl p-5 border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-orange-50/40 border-[#FE3A18] ring-2 ring-[#FE3A18]/15 shadow-sm'
                        : isCritical
                        ? 'bg-rose-50/20 hover:bg-rose-50/40 border-rose-200/80'
                        : 'bg-white hover:bg-slate-50/80 border-slate-200/80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.customerAvatar}
                          alt={rev.customerName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-black text-slate-900">
                              {rev.customerName}
                            </h4>
                            {rev.verifiedCustomer && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <ShieldCheck className="w-3 h-3" />
                                Cliente Verificado
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#FE3A18]" />
                            <span>{rev.neighborhood}</span>
                            <span>•</span>
                            <span>{rev.date}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-600">{rev.source}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        {/* Star Badge */}
                        <div
                          className={`px-2.5 py-1 rounded-xl flex items-center gap-1 text-xs font-black border ${
                            isPositive
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : isCritical
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : 'bg-slate-100 text-slate-800 border-slate-200'
                          }`}
                        >
                          <span>{rev.rating}.0</span>
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        </div>

                        {/* Response Status Pill */}
                        <span
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold ${
                            rev.responseStatus === 'Respondido'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rev.responseStatus === 'Rascunho IA Pronto'
                              ? 'bg-orange-100 text-[#FE3A18]'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {rev.responseStatus}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs font-bold text-slate-500">
                      Anúncio avaliado: <span className="text-slate-800">{rev.adTitle}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white/80 p-3.5 rounded-xl border border-slate-100">
                      "{rev.comment}"
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {rev.highlights.map((tag, i) => (
                          <span
                            key={i}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isCritical
                                ? 'bg-rose-100/80 text-rose-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReviewId(rev.id);
                          if (!rev.aiResponseDraft) {
                            handleGenerateResponseForReview(rev);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FE3A18] text-white shadow-xs'
                            : 'bg-slate-900 hover:bg-[#FE3A18] text-white'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {rev.responseStatus === 'Respondido'
                            ? 'Ver / Editar Resposta'
                            : rev.aiResponseDraft
                            ? 'Revisar Rascunho IA'
                            : 'Redigir Resposta IA'}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: AI-Powered Review Response Studio */}
        <div className="xl:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5 sticky top-24">
          {selectedReview ? (
            <>
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#FE3A18]">
                    <Bot className="w-3.5 h-3.5" />
                    <span>Estúdio de Resposta IA • Gemini</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mt-0.5">
                    Responder a {selectedReview.customerName}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= selectedReview.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${
                        selectedReview.rating >= 4
                          ? 'bg-emerald-50 text-emerald-700'
                          : selectedReview.rating === 3
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      Feedback {selectedReview.sentiment}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isGeneratingId === selectedReview.id}
                  onClick={() => handleGenerateResponseForReview(selectedReview)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      isGeneratingId === selectedReview.id ? 'animate-spin text-[#FE3A18]' : ''
                    }`}
                  />
                  <span>{selectedReview.aiResponseDraft ? 'Regenerar IA' : 'Gerar IA'}</span>
                </button>
              </div>

              {/* Selected Customer Comment Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                  <span>Avaliação Original ({selectedReview.neighborhood})</span>
                  <span>{selectedReview.date}</span>
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{selectedReview.comment}"
                </p>
              </div>

              {/* Quick Tone Switcher for this specific review */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Personalizar Abordagem da IA para esta Resposta:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      {
                        tone: 'Empático & Solucionador (Recomendado)',
                        short: 'Empático & Solucionador'
                      },
                      {
                        tone: 'Agradecimento VIP + Convite de Retorno',
                        short: 'Agradecimento VIP + Mimo'
                      },
                      {
                        tone: 'Gestão de Crise + Cupom de Retratação',
                        short: 'Contenção + Voucher'
                      },
                      {
                        tone: 'Institucional & Objetivo (SEO Local)',
                        short: 'Institucional & SEO'
                      }
                    ] as const
                  ).map((item) => {
                    const isActiveTone =
                      (selectedReview.aiResponseDraft?.tone || selectedTone) === item.tone;
                    return (
                      <button
                        key={item.tone}
                        type="button"
                        onClick={() => {
                          setSelectedTone(item.tone);
                          handleGenerateResponseForReview(selectedReview, item.tone);
                        }}
                        className={`px-3 py-2 rounded-xl text-[11px] font-bold text-left border transition-all cursor-pointer ${
                          isActiveTone
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.short}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Strategy Explanation */}
              {selectedReview.aiResponseDraft && (
                <div
                  className={`rounded-2xl p-3.5 border text-xs leading-relaxed ${
                    selectedReview.rating <= 2
                      ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                      : 'bg-indigo-50/70 border-indigo-100 text-indigo-950'
                  }`}
                >
                  <span className="font-black block mb-0.5">
                    Estratégia Aplicada pela IA:
                  </span>
                  {selectedReview.aiResponseDraft.strategyNote}
                </div>
              )}

              {/* Draft Editor */}
              {selectedReview.aiResponseDraft ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Rascunho da Resposta (Editável antes de publicar)
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {selectedReview.aiResponseDraft.generatedAt}
                      </span>
                    </div>
                    <textarea
                      rows={9}
                      value={selectedReview.aiResponseDraft.replyText}
                      onChange={(e) =>
                        handleUpdateDraftText(selectedReview.id, e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs sm:text-sm text-slate-800 leading-relaxed focus:bg-white focus:border-[#FE3A18] focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handlePublishReviewResponse(selectedReview.id)}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#FE3A18] hover:bg-[#e03212] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {selectedReview.responseStatus === 'Respondido'
                          ? 'Atualizar Resposta Publicada'
                          : 'Aprovar & Publicar Resposta'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyResponse(selectedReview)}
                      className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedId === selectedReview.id ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center space-y-3">
                  <Sparkles className="w-7 h-7 text-[#FE3A18] mx-auto" />
                  <div className="space-y-1">
                    <h5 className="text-sm font-black text-slate-900">
                      Pronto para redigir a resposta ideal com IA
                    </h5>
                    <p className="text-xs text-slate-500">
                      A IA analisará o sentimento ({selectedReview.sentiment}) e criará uma resposta sob medida para {selectedReview.customerName}.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGenerateResponseForReview(selectedReview)}
                    className="px-5 py-2.5 rounded-xl bg-[#FE3A18] hover:bg-[#e03212] text-white font-black text-xs shadow-md inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Gerar Resposta Personalizada IA</span>
                  </button>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
