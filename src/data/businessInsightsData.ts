import seoLeadImg from '../assets/images/insights_local_seo_lead_1794995011720.jpg';
import digitalGrowthImg from '../assets/images/insights_digital_growth_1794995014134.jpg';
import localMarketingImg from '../assets/images/insights_local_marketing_1794995014281.jpg';
import authorityReviewsImg from '../assets/images/insights_authority_reviews_1794995013954.jpg';

export type InsightCategory = 'SEO Local' | 'Marketing' | 'Crescimento Digital';

export interface InsightArticleSection {
  heading: string;
  paragraphs: string[];
}

export type InsightSchemaType = 'BlogPosting' | 'Article' | 'HowTo';

export interface InsightArticleSeoConfig {
  metaTitle: string;
  metaDescription: string;
  focusKeywords: string[];
  schemaType: InsightSchemaType;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export interface InsightArticle {
  id: string;
  slug: string;
  category: InsightCategory;
  title: string;
  subtitle: string;
  excerpt: string;
  publishedAt: string;
  isoDate: string;
  readTime: string;
  author: {
    name: string;
    role: string;
  };
  coverImage: string;
  coverAlt: string;
  featured?: boolean;
  impactMetric: string;
  sections: InsightArticleSection[];
  actionChecklist: string[];
  seo?: InsightArticleSeoConfig;
}

export const BUSINESS_INSIGHTS_ARTICLES: InsightArticle[] = [
  {
    id: 'seo-local-pack-google-2026',
    slug: 'como-dominar-buscas-locais-e-aparecer-no-topo-do-google',
    category: 'SEO Local',
    title: 'Como Dominar o SEO Local e Colocar Seu Negócio nas Primeiras Buscas do Bairro',
    subtitle: 'Um guia técnico e direto sobre consistência de NAP, palavras-chave hiperlocais e sinais de relevância geográfica.',
    excerpt:
      'Entenda por que 78% das pesquisas locais em dispositivos móveis resultam em contato no mesmo dia e como estruturar o perfil do seu negócio para capturar essa demanda orgânica.',
    publishedAt: '18 Nov 2026',
    isoDate: '2026-11-18',
    readTime: '6 min de leitura',
    author: {
      name: 'Camila Vasconcelos',
      role: 'Estrategista de SEO Local'
    },
    coverImage: seoLeadImg,
    coverAlt: 'Empreendedora analisando métricas de busca local em notebook próximo à janela',
    featured: true,
    impactMetric: '+140% visibilidade orgânica em 90 dias',
    sections: [
      {
        heading: '1. Consistência de NAP (Nome, Endereço e Telefone)',
        paragraphs: [
          'Os mecanismos de busca cruzam informações do seu negócio em múltiplos diretórios regionais antes de exibir seu estabelecimento no topo do mapa. Qualquer divergência — como abreviações diferentes de rua ou números de WhatsApp antigos — reduz a confiança algorítmica do seu perfil.',
          'Padronize exatamente o mesmo Nome Comercial, CEP, logradouro e telefone em todas as plataformas, redes sociais e na sua página pública do GuiaPonto.'
        ]
      },
      {
        heading: '2. Palavras-chave Hiperlocais na Descrição de Serviços',
        paragraphs: [
          'Consumidores raramente buscam apenas pelo nome do serviço; eles combinam a necessidade com o bairro ou região onde estão. Termos como "clínica odontológica no Campolim" ou "oficina mecânica zona sul Sorocaba" possuem intenção de compra imediata e menor concorrência.',
          'Incorpore naturalmente os bairros atendidos, pontos de referência e especialidades no título principal e nos três primeiros parágrafos da sua vitrine digital.'
        ]
      },
      {
        heading: '3. Dados Estruturados e Sinais de Proximidade Real',
        paragraphs: [
          'Páginas comerciais com horários de atendimento atualizados, galeria de fotos reais do ponto físico e links diretos de rota geram sinais comportamentais positivos (cliques para ligar, traçar rota e enviar mensagem), impulsionando o ranqueamento orgânico ao longo do tempo.'
        ]
      }
    ],
    actionChecklist: [
      'Unificar Nome, Endereço e WhatsApp idênticos em todos os diretórios',
      'Incluir o bairro principal e cidades vizinhas na descrição do negócio',
      'Atualizar horários especiais de feriados e fins de semana',
      'Publicar ao menos 5 fotografias reais da fachada e atendimento'
    ],
    seo: {
      metaTitle: 'SEO Local para Negócios: Como Aparecer no Topo do Bairro',
      metaDescription:
        'Aprenda a dominar o SEO local com consistência de NAP, palavras-chave hiperlocais e sinais geográficos para atrair clientes no WhatsApp.',
      focusKeywords: ['SEO Local', 'busca orgânica', 'negócio local', 'NAP Google'],
      schemaType: 'HowTo'
    }
  },
  {
    id: 'marketing-local-autoridade-bairro',
    slug: 'marketing-de-proximidade-construindo-autoridade-no-seu-bairro',
    category: 'Marketing',
    title: 'Marketing de Proximidade: Como Transformar Buscas do Bairro em Clientes Fiéis',
    subtitle: 'Estratégias práticas para conectar a presença física da sua loja à descoberta digital sem depender apenas de mídia paga.',
    excerpt:
      'Descubra como negócios locais constroem autoridade duradoura combinando vitrine bem apresentada, ofertas sazonais e conteúdo direcionado ao público da vizinhança.',
    publishedAt: '12 Nov 2026',
    isoDate: '2026-11-12',
    readTime: '5 min de leitura',
    author: {
      name: 'Rafael Nogueira',
      role: 'Consultor de Marketing Regional'
    },
    coverImage: localMarketingImg,
    coverAlt: 'Fachada moderna de negócio local iluminada no fim de tarde em avenida arborizada',
    impactMetric: '3,2x mais retorno de clientes recorrentes',
    sections: [
      {
        heading: '1. Alinhamento entre Vitrine Física e Digital',
        paragraphs: [
          'Quando um morador pesquisa por um serviço próximo, ele avalia em segundos se o negócio transmite profissionalismo e clareza. Fotos datadas ou descrições genéricas afastam o cliente antes mesmo do primeiro contato.',
          'Mantenha sua página comercial atualizada com os diferenciais reais do seu atendimento: estacionamento próprio, acessibilidade, entrega rápida na região ou atendimento sem hora marcada.'
        ]
      },
      {
        heading: '2. Calendário Hiperlocal de Campanhas',
        paragraphs: [
          'Em vez de competir por atenção com grandes varejistas nacionais, alinhe suas promoções aos ciclos da sua cidade: eventos regionais, horários de pico do bairro (como almoço executivo ou pós-expediente) e parcerias com negócios complementares da mesma rua.'
        ]
      }
    ],
    actionChecklist: [
      'Destacar diferenciais práticos (estacionamento, entrega, horário estendido)',
      'Criar uma oferta exclusiva de primeira visita para clientes locais',
      'Estabelecer parceria cruzada com 2 negócios vizinhos não concorrentes'
    ],
    seo: {
      metaTitle: 'Marketing de Proximidade para Negócios Locais | GuiaPonto',
      metaDescription:
        'Transforme buscas do bairro em clientes recorrentes com vitrine atualizada, campanhas hiperlocais e parcerias estratégicas.',
      focusKeywords: ['marketing local', 'marketing de proximidade', 'autoridade de bairro'],
      schemaType: 'BlogPosting'
    }
  },
  {
    id: 'crescimento-digital-qr-code-whatsapp',
    slug: 'funil-whatsapp-e-qr-code-acelerando-crescimento-digital',
    category: 'Crescimento Digital',
    title: 'Do Balcão ao WhatsApp: Acelerando o Crescimento Digital com QR Codes e Agendamento',
    subtitle: 'Como reduzir o atrito entre a descoberta no celular e o fechamento do pedido em menos de três cliques.',
    excerpt:
      'Negócios que oferecem acesso direto ao WhatsApp e captura inteligente de pedidos no balcão convertem até 42% mais visitantes ocasionais em contatos recorrentes.',
    publishedAt: '05 Nov 2026',
    isoDate: '2026-11-05',
    readTime: '4 min de leitura',
    author: {
      name: 'Juliana Ferraz',
      role: 'Especialista em Conversão Digital'
    },
    coverImage: digitalGrowthImg,
    coverAlt: 'Balcão de loja moderna com placa de QR Code em madeira e celular com tela de agendamento',
    impactMetric: '+42% na taxa de conversão de visitantes',
    sections: [
      {
        heading: '1. Elimine Formulários Longos na Primeira Conversa',
        paragraphs: [
          'O consumidor local busca velocidade. Ao clicar no perfil do seu negócio, ele quer saber imediatamente se há disponibilidade hoje e qual o próximo passo. Botões diretos para WhatsApp com mensagem pré-preenchida reduzem drasticamente o abandono.',
          'Configure saudações claras que já identifiquem o serviço de interesse para que sua equipe responda com objetividade em menos de 5 minutos.'
        ]
      },
      {
        heading: '2. Ponte Offline-para-Online com QR Code no Ponto de Venda',
        paragraphs: [
          'Cada cliente que entra na sua loja física pode se tornar um promotor digital. Posicionar um display discreto no caixa convidando para salvar o catálogo, resgatar um benefício na próxima compra ou deixar uma avaliação cria um ciclo contínuo de crescimento orgânico.'
        ]
      }
    ],
    actionChecklist: [
      'Configurar link direto de WhatsApp com mensagem contextual por serviço',
      'Exibir QR Code da vitrine digital no balcão ou embalagem de entrega',
      'Medir semanalmente o volume de cliques e orçamentos iniciados'
    ],
    seo: {
      metaTitle: 'Funil WhatsApp e QR Code para Crescimento Digital Local',
      metaDescription:
        'Reduza o atrito entre a descoberta no celular e o pedido no WhatsApp usando QR Codes no balcão e atendimento rápido.',
      focusKeywords: ['crescimento digital', 'WhatsApp comercial', 'QR Code vitrine'],
      schemaType: 'HowTo'
    }
  },
  {
    id: 'autoridade-avaliacoes-reputacao-local',
    slug: 'gestao-de-reputacao-e-avaliacoes-para-autoridade-local',
    category: 'SEO Local',
    title: 'Avaliações Verificadas como Motor de Autoridade e Ranqueamento Orgânico',
    subtitle: 'Por que a frequência e a qualidade das suas respostas às avaliações influenciam diretamente o posicionamento nas buscas.',
    excerpt:
      'Veja o método estruturado para solicitar avaliações autênticas após o atendimento e transformar cada comentário em prova social que convence novos clientes.',
    publishedAt: '29 Out 2026',
    isoDate: '2026-10-29',
    readTime: '5 min de leitura',
    author: {
      name: 'Camila Vasconcelos',
      role: 'Estrategista de SEO Local'
    },
    coverImage: authorityReviewsImg,
    coverAlt: 'Atendente de padaria artesanal sorrindo e recebendo clientes no balcão',
    impactMetric: '4,9★ média de confiança entre negócios ativos',
    sections: [
      {
        heading: '1. Frequência Supera Volume Isolado',
        paragraphs: [
          'Receber 30 avaliações em um único dia e nenhuma nos seis meses seguintes parece artificial aos algoritmos de busca. O crescimento sustentável acontece quando o negócio conquista de 3 a 5 avaliações reais por semana de forma constante.',
          'Envie o link direto de avaliação no encerramento positivo do atendimento pelo WhatsApp, enquanto a boa experiência ainda está fresca na memória do cliente.'
        ]
      },
      {
        heading: '2. Respostas Estratégicas com Contexto Regional',
        paragraphs: [
          'Responder a todas as avaliações — positivas ou críticas — demonstra compromisso público. Quando adequado, mencione naturalmente o serviço prestado e o bairro na resposta, reforçando a relevância semântica do seu perfil com educação e transparência.'
        ]
      }
    ],
    actionChecklist: [
      'Criar mensagem curta de agradecimento pós-atendimento com link de avaliação',
      'Responder a 100% das avaliações recebidas em até 48 horas',
      'Fixar as principais conquistas e selos de verificação na vitrine pública'
    ],
    seo: {
      metaTitle: 'Avaliações Verificadas e Autoridade Orgânica Local',
      metaDescription:
        'Entenda como a frequência e a qualidade das respostas às avaliações melhoram seu posicionamento orgânico e conversão.',
      focusKeywords: ['avaliações verificadas', 'reputação local', 'SEO orgânico'],
      schemaType: 'BlogPosting'
    }
  }
];
