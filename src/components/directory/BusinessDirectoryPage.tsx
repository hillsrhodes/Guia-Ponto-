/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  MapPin,
  Star,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  Clock,
  Phone,
  ArrowLeft,
  X,
  Check,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Navigation,
  DollarSign,
  Building2,
  RefreshCw,
  Share2,
  Award,
  Zap,
  Info,
  LocateFixed,
  Compass,
  Loader2
} from 'lucide-react';
import {
  SOROCABA_REGIONAL_HUBS,
  calculateHaversineDistanceKm,
  estimateTravelTimeMinutes,
  SorocabaHubPoint
} from '../../utils/sorocabaGeolocation';
import { useSorocabaGeolocationCenter } from '../../hooks/useSorocabaGeolocationCenter';

export interface DirectoryBusiness {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  rating: number;
  reviewsCount: number;
  location: string;
  city: string;
  neighborhood: string;
  address: string;
  distanceKm: number;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  openNow: boolean;
  closingTime: string;
  whatsapp: string;
  phone: string;
  image: string;
  gallery: string[];
  description: string;
  featured: boolean;
  verified: boolean;
  tags: string[];
  amenities: string[];
  popularServices: Array<{ name: string; price: string }>;
}

export const DIRECTORY_MOCK_DATA: DirectoryBusiness[] = [
  {
    id: 'b1',
    name: 'Restaurante Sabor & Fogo Co.',
    category: 'Restaurantes & Gastronomia',
    subcategory: 'Grelhados & Almoço Executivo',
    rating: 4.9,
    reviewsCount: 238,
    location: 'Sorocaba, SP - Campolim',
    city: 'Sorocaba',
    neighborhood: 'Campolim',
    address: 'Av. Antônio Carlos Comitre, 1240 - Campolim, Sorocaba - SP',
    distanceKm: 0.8,
    priceLevel: '$$$',
    openNow: true,
    closingTime: '23:00',
    whatsapp: '5515999998888',
    phone: '(15) 3234-7700',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Carnes nobres na brasa, buffet executivo contemporâneo e sobremesas artesanais. Ambiente climatizado no Campolim e atendimento expresso no WhatsApp.',
    featured: true,
    verified: true,
    tags: ['Almoço Executivo', 'Carnes Nobres', 'Delivery WhatsApp', 'Adega Climatizada'],
    amenities: ['Wi-Fi Grátis', 'Ar-Condicionado', 'Valet Estacionamento', 'Acessibilidade'],
    popularServices: [
      { name: 'Almoço Executivo Completo', price: 'R$ 58,00' },
      { name: 'Bife de Chorizo na Brasa 400g', price: 'R$ 96,00' },
      { name: 'Petit Gâteau Artesanal', price: 'R$ 28,00' }
    ]
  },
  {
    id: 'b2',
    name: 'Residencial Sênior Acolher',
    category: 'Casa de Repouso & Cuidado',
    subcategory: 'Residência Assistida & Cuidados 24h',
    rating: 5.0,
    reviewsCount: 84,
    location: 'Sorocaba, SP - Santa Rosália',
    city: 'Sorocaba',
    neighborhood: 'Santa Rosália',
    address: 'Av. Pereira da Silva, 680 - Santa Rosália, Sorocaba - SP',
    distanceKm: 2.4,
    priceLevel: '$$$$',
    openNow: true,
    closingTime: '24 Horas',
    whatsapp: '5515977772222',
    phone: '(15) 3233-2200',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Instituição de acolhimento humanizado para a terceira idade em Santa Rosália com equipe médica permanente, enfermagem 24 horas e fisioterapia geriátrica.',
    featured: true,
    verified: true,
    tags: ['Enfermagem 24h', 'Fisioterapia', 'Nutricionista', 'Visitas Liberadas'],
    amenities: ['Jardim Terapêutico', 'Suítes Climatizadas', 'Monitoramento 24h', 'Atividades Diárias'],
    popularServices: [
      { name: 'Diária Assistida com Cuidados', price: 'Sob Consulta' },
      { name: 'Avaliação Médica Multidisciplinar', price: 'Incluso no Plano' },
      { name: 'Oficinas de Memória e Cognição', price: 'Incluso no Plano' }
    ]
  },
  {
    id: 'b3',
    name: 'Imobiliária Nova Era Prime',
    category: 'Imobiliárias & Arquitetura',
    subcategory: 'Venda & Locação Alto Padrão',
    rating: 4.8,
    reviewsCount: 156,
    location: 'Sorocaba, SP - Campolim',
    city: 'Sorocaba',
    neighborhood: 'Campolim',
    address: 'Av. Professora Izoraida Marques Peres, 920 - Campolim, Sorocaba - SP',
    distanceKm: 1.6,
    priceLevel: '$$$',
    openNow: true,
    closingTime: '19:00',
    whatsapp: '5515966663333',
    phone: '(15) 3211-4400',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Assessoria completa na compra, venda e locação de imóveis residenciais e comerciais de alto padrão em Sorocaba, Parque Campolim e Votorantim.',
    featured: true,
    verified: true,
    tags: ['Alto Padrão', 'Locação sem Fiador', 'Tour Virtual 3D', 'Financiamento'],
    amenities: ['Atendimento VIP', 'Estacionamento Próprio', 'Consultoria Jurídica', 'Cafeteria'],
    popularServices: [
      { name: 'Avaliação Imobiliária Certificada', price: 'Gratuita' },
      { name: 'Gestão Completa de Locação', price: '8% s/ aluguel' },
      { name: 'Assessoria de Financiamento', price: 'Incluso na Compra' }
    ]
  },
  {
    id: 'b4',
    name: 'Oficina Mecânica Precision Car',
    category: 'Oficinas & Automotivo',
    subcategory: 'Diagnóstico & Revisão Mecânica',
    rating: 4.9,
    reviewsCount: 312,
    location: 'Sorocaba, SP - Trujillo',
    city: 'Sorocaba',
    neighborhood: 'Trujillo',
    address: 'Av. General Osório, 2140 - Trujillo, Sorocaba - SP',
    distanceKm: 3.1,
    priceLevel: '$$',
    openNow: true,
    closingTime: '18:30',
    whatsapp: '5515955554444',
    phone: '(15) 3221-8900',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Oficina mecânica especializada em injeção eletrônica, freios ABS, suspensão e câmbio automático. Orçamento prévio pelo WhatsApp com foto e garantia de 1 ano.',
    featured: false,
    verified: true,
    tags: ['Injeção Eletrônica', 'Troca de Óleo Rápida', 'Garantia 1 Ano', 'Revisão Preventiva'],
    amenities: ['Sala de Espera VIP', 'Wi-Fi', 'Leva e Traz', 'Cartão até 10x'],
    popularServices: [
      { name: 'Revisão Preventiva 40 Itens', price: 'R$ 180,00' },
      { name: 'Troca de Óleo Sintético + Filtro', price: 'A partir de R$ 195,00' },
      { name: 'Alinhamento 3D e Balanceamento', price: 'R$ 120,00' }
    ]
  },
  {
    id: 'b5',
    name: 'Clínica Odontológica Sorria Mais',
    category: 'Saúde & Estética',
    subcategory: 'Implantes & Ortodontia Estética',
    rating: 5.0,
    reviewsCount: 198,
    location: 'Sorocaba, SP - Centro',
    city: 'Sorocaba',
    neighborhood: 'Centro',
    address: 'Rua Barão de Tatuí, 754 - Centro, Sorocaba - SP',
    distanceKm: 1.2,
    priceLevel: '$$$',
    openNow: true,
    closingTime: '20:00',
    whatsapp: '5515944445555',
    phone: '(15) 3231-9000',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Centro odontológico de excelência na Barão de Tatuí, especializado em implantes guiados sem corte, alinhadores invisíveis e clareamento a laser.',
    featured: true,
    verified: true,
    tags: ['Implantes Dentários', 'Invisalign Doctor', 'Facetas de Porcelana', 'Urgência'],
    amenities: ['Sedação Consciente', 'Raio-X Panorâmico no Local', 'Estacionamento Conveniado'],
    popularServices: [
      { name: 'Avaliação Digital 3D', price: 'Gratuita' },
      { name: 'Clareamento Dental a Laser', price: 'R$ 490,00' },
      { name: 'Implante Titânio Neodent', price: 'A partir de R$ 1.200,00' }
    ]
  },
  {
    id: 'b6',
    name: 'Mendonça & Associados Advocacia',
    category: 'Serviços Profissionais',
    subcategory: 'Direito Trabalhista & Empresarial',
    rating: 4.9,
    reviewsCount: 112,
    location: 'Sorocaba, SP - Mangal',
    city: 'Sorocaba',
    neighborhood: 'Mangal',
    address: 'Rua Professor Toledo, 418 - Mangal, Sorocaba - SP',
    distanceKm: 2.8,
    priceLevel: '$$$$',
    openNow: true,
    closingTime: '18:00',
    whatsapp: '5515933332222',
    phone: '(15) 3232-8800',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Banca jurídica corporativa com mais de 15 anos em Sorocaba, atuando em assessoria contratual, contencioso cível e defesas trabalhistas preventivas.',
    featured: false,
    verified: true,
    tags: ['Direito Corporativo', 'Contratos', 'Trabalhista', 'Compliance'],
    amenities: ['Sala de Reuniões Climatizada', 'Consulta Híbrida/Online', 'Estacionamento'],
    popularServices: [
      { name: 'Consulta Diagnóstica Inicial', price: 'Sob Agendamento' },
      { name: 'Auditoria Contratual Preventiva', price: 'Sob Proposta' },
      { name: 'Assessoria Jurídica Mensal (PMEs)', price: 'A partir de R$ 950/mês' }
    ]
  },
  {
    id: 'b7',
    name: 'Padaria Artesanal & Café Pão d’Ouro',
    category: 'Restaurantes & Gastronomia',
    subcategory: 'Pães de Fermentação Natural & Cafeteria',
    rating: 4.8,
    reviewsCount: 290,
    location: 'Sorocaba, SP - Além Ponte',
    city: 'Sorocaba',
    neighborhood: 'Além Ponte',
    address: 'Av. São Paulo, 1530 - Além Ponte, Sorocaba - SP',
    distanceKm: 0.5,
    priceLevel: '$$',
    openNow: true,
    closingTime: '21:00',
    whatsapp: '5515922221111',
    phone: '(15) 3227-1144',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Pães artesanais de levain, croissants folhados franceses, cafés especiais moídos na hora e brunch aos sábados e domingos na tradicional Av. São Paulo em Sorocaba.',
    featured: false,
    verified: true,
    tags: ['Fermentação Natural', 'Croissant', 'Cafés Especiais', 'Brunch'],
    amenities: ['Mesas ao Ar Livre', 'Pet Friendly', 'Wi-Fi Grátis', 'Tomadas para Notebook'],
    popularServices: [
      { name: 'Sourdough Tradicional 600g', price: 'R$ 24,00' },
      { name: 'Croissant Francês com Manteiga', price: 'R$ 14,00' },
      { name: 'Café Filtrado Especial V60', price: 'R$ 12,00' }
    ]
  },
  {
    id: 'b8',
    name: 'Pet Care & Hospital Veterinário 24h',
    category: 'Saúde & Estética',
    subcategory: 'Veterinária & Banho/Tosa',
    rating: 4.9,
    reviewsCount: 165,
    location: 'Sorocaba, SP - Wanel Ville',
    city: 'Sorocaba',
    neighborhood: 'Wanel Ville',
    address: 'Av. Paulo Emanuel de Almeida, 840 - Wanel Ville, Sorocaba - SP',
    distanceKm: 2.1,
    priceLevel: '$$$',
    openNow: true,
    closingTime: '24 Horas',
    whatsapp: '5515911110000',
    phone: '(15) 3229-8899',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Pronto-atendimento veterinário 24h na Zona Oeste de Sorocaba, internação com monitoramento contínuo, centro cirúrgico completo e estética canina.',
    featured: true,
    verified: true,
    tags: ['Veterinário 24h', 'Cirurgia Pet', 'Banho & Tosa', 'Exames Rápidos'],
    amenities: ['Ambulância Pet', 'Farmácia Veterinária', 'Estacionamento', 'Leva e Traz'],
    popularServices: [
      { name: 'Consulta Veterinária Geral', price: 'R$ 140,00' },
      { name: 'Banho Terapêutico + Tosa Higiênica', price: 'R$ 85,00' },
      { name: 'Ultrassom Abdominal Pet', price: 'R$ 220,00' }
    ]
  },
  {
    id: 'b9',
    name: 'Studio Bella Donna Cabelo & Estética',
    category: 'Saúde & Estética',
    subcategory: 'Salão de Beleza & Spa Urbano',
    rating: 4.8,
    reviewsCount: 142,
    location: 'Sorocaba, SP - Campolim',
    city: 'Sorocaba',
    neighborhood: 'Campolim',
    address: 'Rua José Maria Hannickel, 320 - Campolim, Sorocaba - SP',
    distanceKm: 0.9,
    priceLevel: '$$$',
    openNow: false,
    closingTime: 'Fecha às 20:00 (Abre amanhã 09:00)',
    whatsapp: '5515900009999',
    phone: '(15) 3234-3322',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Salão de beleza boutique no Campolim com especialistas em mechas loiras, corte visagista, tratamentos capilares e maquiagem profissional para eventos.',
    featured: false,
    verified: true,
    tags: ['Mechas & Loiros', 'Corte Visagista', 'Manicure & Pedicure', 'Spa dos Pés'],
    amenities: ['Espaço Café & Drinks', 'Wi-Fi', 'Climatização', 'Ambiente Relaxante'],
    popularServices: [
      { name: 'Corte Feminino com Escova', price: 'R$ 160,00' },
      { name: 'Tratamento Reconstrutor Kérastase', price: 'R$ 220,00' },
      { name: 'Mechas Balayage Personalizada', price: 'A partir de R$ 480,00' }
    ]
  },
  {
    id: 'b10',
    name: 'Nexus Coworking & Salas Privativas',
    category: 'Serviços Profissionais',
    subcategory: 'Espaço de Trabalho Compartilhado & Eventos',
    rating: 4.9,
    reviewsCount: 98,
    location: 'Sorocaba, SP - Centro',
    city: 'Sorocaba',
    neighborhood: 'Centro',
    address: 'Rua XV de Novembro, 550 - Centro, Sorocaba - SP',
    distanceKm: 1.4,
    priceLevel: '$$',
    openNow: true,
    closingTime: '22:00',
    whatsapp: '5515988880000',
    phone: '(15) 3231-7788',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Estações de coworking compartilhadas, salas de reunião com TV para videoconferência e escritórios privativos no Centro histórico de Sorocaba.',
    featured: false,
    verified: true,
    tags: ['Internet Fibra 1Gbps', 'Salas de Reunião', 'Endereço Fiscal', 'Café Liberado'],
    amenities: ['Cabines Acústicas', 'Copa Equipada', 'Bicicletário', 'Acesso 24/7 p/ membros'],
    popularServices: [
      { name: 'Diária Day Pass Coworking', price: 'R$ 49,00' },
      { name: 'Hora em Sala de Reunião (6 pessoas)', price: 'R$ 65,00' },
      { name: 'Plano Endereço Fiscal Mensal', price: 'R$ 120/mês' }
    ]
  },
  {
    id: 'b11',
    name: 'Alpha Fit Academia & Performance',
    category: 'Saúde & Estética',
    subcategory: 'Musculação, CrossFit & Personal Trainer',
    rating: 4.7,
    reviewsCount: 220,
    location: 'Sorocaba, SP - Santa Rosália',
    city: 'Sorocaba',
    neighborhood: 'Santa Rosália',
    address: 'Av. Pereira da Silva, 1200 - Santa Rosália, Sorocaba - SP',
    distanceKm: 3.4,
    priceLevel: '$$',
    openNow: true,
    closingTime: '23:00',
    whatsapp: '5515977771111',
    phone: '(15) 3233-5500',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Academia completa em Santa Rosália com maquinário importado Hammer Strength, espaço funcional de CrossFit, spinning e bioimpedância.',
    featured: false,
    verified: true,
    tags: ['Musculação', 'Spinning', 'Cross Training', 'Bioimpedância'],
    amenities: ['Vestiários com Sauna', 'Estacionamento 2h Grátis', 'Armários com Chave'],
    popularServices: [
      { name: 'Plano Mensal Livre', price: 'R$ 139,90/mês' },
      { name: 'Avaliação Física Completa', price: 'R$ 60,00' },
      { name: 'Pacote 10 Aulas com Personal', price: 'R$ 650,00' }
    ]
  },
  {
    id: 'b12',
    name: 'Auto Elétrica & Baterias Forte',
    category: 'Oficinas & Automotivo',
    subcategory: 'Baterias, Alternadores & Ar-Condicionado',
    rating: 4.8,
    reviewsCount: 180,
    location: 'Votorantim, SP - Centro',
    city: 'Votorantim',
    neighborhood: 'Votorantim',
    address: 'Av. 31 de Março, 450 - Centro, Votorantim - SP',
    distanceKm: 5.8,
    priceLevel: '$$',
    openNow: true,
    closingTime: '18:00',
    whatsapp: '5515966662222',
    phone: '(15) 3243-3344',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Entrega e instalação de baterias automotivas em até 40 minutos em domicílio em Sorocaba e Votorantim. Higienização de ar com ozônio e alternadores.',
    featured: false,
    verified: true,
    tags: ['Entrega de Baterias', 'Instalação Grátis', 'Ar-Condicionado Automotivo', 'Diagnóstico Elétrico'],
    amenities: ['Atendimento em Domicílio', 'Cartão até 12x', 'Garantia de Fábrica'],
    popularServices: [
      { name: 'Bateria Moura 60Ah com Instalação', price: 'R$ 440,00' },
      { name: 'Higienização de Ar com Ozônio', price: 'R$ 90,00' },
      { name: 'Teste de Carga do Alternador', price: 'Gratuito' }
    ]
  },
  {
    id: 'b13',
    name: 'Villa Moda & Conceito Sorocaba',
    category: 'Lojas & Comércio Local',
    subcategory: 'Moda Feminina, Masculina & Acessórios',
    rating: 4.9,
    reviewsCount: 174,
    location: 'Sorocaba, SP - Campolim',
    city: 'Sorocaba',
    neighborhood: 'Campolim',
    address: 'Av. Antônio Carlos Comitre, 890 - Campolim, Sorocaba - SP',
    distanceKm: 1.1,
    priceLevel: '$$$',
    openNow: true,
    closingTime: '20:00',
    whatsapp: '5515991112233',
    phone: '(15) 3234-9911',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Loja conceito no Campolim com curadoria de marcas nacionais, alfaiataria contemporânea, consultoria de estilo e entrega expressa por motoboy em Sorocaba.',
    featured: true,
    verified: true,
    tags: ['Moda Campolim', 'Consultoria de Imagem', 'Delivery Express Sorocaba', 'Lançamentos'],
    amenities: ['Provador VIP', 'Estacionamento na Porta', 'Espaço Café', 'Atendimento no WhatsApp'],
    popularServices: [
      { name: 'Consultoria de Looks Personalizada', price: 'Cortesia' },
      { name: 'Malinha Delivery em Sorocaba', price: 'Frete Grátis' },
      { name: 'Ajuste de Bainha Express', price: 'Incluso' }
    ]
  },
  {
    id: 'b14',
    name: 'ClimaTech Engenharia & Manutenção',
    category: 'Assistência & Manutenção',
    subcategory: 'Ar-Condicionado, Elétrica & Energia Solar',
    rating: 4.9,
    reviewsCount: 205,
    location: 'Sorocaba, SP - Além Ponte',
    city: 'Sorocaba',
    neighborhood: 'Além Ponte',
    address: 'Av. São Paulo, 2190 - Além Ponte, Sorocaba - SP',
    distanceKm: 3.8,
    priceLevel: '$$',
    openNow: true,
    closingTime: '19:00',
    whatsapp: '5515992223344',
    phone: '(15) 3227-4500',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Instalação e manutenção de ar-condicionado inverter, limpeza química PMOC, reparos elétricos residenciais e projetos fotovoltaicos em Sorocaba e Votorantim.',
    featured: false,
    verified: true,
    tags: ['Ar-Condicionado Sorocaba', 'Higienização Split', 'Energia Solar', 'Plantão Técnico'],
    amenities: ['Visita Técnica no Mesmo Dia', 'Laudo PMOC', 'Garantia de 90 Dias', 'Parcelamento 10x'],
    popularServices: [
      { name: 'Higienização Completa Ar Split', price: 'R$ 150,00' },
      { name: 'Instalação de Ar Inverter 9.000/12.000 BTUs', price: 'R$ 480,00' },
      { name: 'Visita Técnica e Diagnóstico Elétrico', price: 'R$ 80,00' }
    ]
  },
  {
    id: 'b15',
    name: 'Quinta da Serra Gastronomia & Eventos',
    category: 'Restaurantes & Gastronomia',
    subcategory: 'Culinária Caipira Gourmet & Almoço de Fim de Semana',
    rating: 4.9,
    reviewsCount: 162,
    location: 'Araçoiaba da Serra, SP',
    city: 'Araçoiaba da Serra',
    neighborhood: 'Araçoiaba da Serra',
    address: 'Rod. Raposo Tavares, Km 115 - Araçoiaba da Serra - SP',
    distanceKm: 14.5,
    priceLevel: '$$$',
    openNow: true,
    closingTime: '17:30',
    whatsapp: '5515993334455',
    phone: '(15) 3281-3300',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Gastronomia regional ao ar livre a 15 minutos do Campolim. Cortes na parrilla, fogão a lenha, espaço kids monitorado e área verde na Região Metropolitana de Sorocaba.',
    featured: false,
    verified: true,
    tags: ['Almoço Familiar', 'Espaço Kids', 'Região de Sorocaba', 'Pet Friendly'],
    amenities: ['Estacionamento Amplo Grátis', 'Área Verde', 'Recreação Infantil', 'Acessibilidade'],
    popularServices: [
      { name: 'Buffet Completo Fogão a Lenha & Parrilla', price: 'R$ 89,00' },
      { name: 'Reserva de Mesa para Aniversários', price: 'Sem Taxa' }
    ]
  },
  {
    id: 'b16',
    name: ' Solar de Itu Arquitetura & Condomínios',
    category: 'Imobiliárias & Arquitetura',
    subcategory: 'Casas de Campo & Condomínios Fechados',
    rating: 4.8,
    reviewsCount: 94,
    location: 'Itu, SP - Condomínios',
    city: 'Itu',
    neighborhood: 'Itu',
    address: 'Av. Tiradentes, 1100 - Parque Industrial, Itu - SP',
    distanceKm: 22.0,
    priceLevel: '$$$$',
    openNow: true,
    closingTime: '18:30',
    whatsapp: '5515994445566',
    phone: '(15) 4013-2200',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Especialistas em residências de alto padrão e terrenos nos principais condomínios entre Sorocaba, Itu e eixo Castelo Branco.',
    featured: false,
    verified: true,
    tags: ['Condomínios Fechados', 'Eixo Sorocaba-Itu', 'Alto Padrão', 'Projetos Arquitetônicos'],
    amenities: ['Visita Guiada nos Condomínios', 'Assessoria Jurídica', 'Atendimento Personalizado'],
    popularServices: [
      { name: 'Tour Presencial em Condomínios', price: 'Agendamento Grátis' },
      { name: 'Avaliação Patrimonial de Imóvel', price: 'Sob Consulta' }
    ]
  }
];

const CATEGORIES_LIST = [
  'Todos',
  'Restaurantes & Gastronomia',
  'Saúde & Estética',
  'Casa de Repouso & Cuidado',
  'Imobiliárias & Arquitetura',
  'Oficinas & Automotivo',
  'Serviços Profissionais',
  'Lojas & Comércio Local',
  'Assistência & Manutenção'
];

const NEIGHBORHOODS_LIST = [
  'Todos os Bairros',
  'Campolim',
  'Centro',
  'Santa Rosália',
  'Além Ponte',
  'Wanel Ville',
  'Mangal',
  'Trujillo',
  'Votorantim',
  'Araçoiaba da Serra',
  'Itu'
];

const RADIUS_PRESETS = [
  { value: 2, label: 'Até 2 km (Bairro)' },
  { value: 5, label: 'Até 5 km (Sorocaba Urbano)' },
  { value: 10, label: 'Até 10 km (Sorocaba + Votorantim)' },
  { value: 25, label: 'Até 25 km (Região Metropolitana)' },
  { value: 50, label: 'Até 50 km (Toda a Região)' },
];

const BUSINESS_COORDINATES_MAP: Record<string, { lat: number; lng: number }> = {
  b1: { lat: -23.5329, lng: -47.4658 }, // Campolim, Sorocaba
  b2: { lat: -23.4892, lng: -47.4486 }, // Santa Rosália, Sorocaba
  b3: { lat: -23.5368, lng: -47.4631 }, // Parque Campolim, Sorocaba
  b4: { lat: -23.4932, lng: -47.4632 }, // Trujillo, Sorocaba
  b5: { lat: -23.5015, lng: -47.4581 }, // Centro, Sorocaba
  b6: { lat: -23.5467, lng: -47.4378 }, // Centro, Votorantim
  b7: { lat: -23.5042, lng: -47.5085 }, // Wanel Ville, Sorocaba
  b8: { lat: -23.5085, lng: -47.4352 }, // Além Ponte, Sorocaba
  b9: { lat: -23.5312, lng: -47.4679 }, // Campolim, Sorocaba
  b10: { lat: -23.5124, lng: -47.4689 }, // Mangal, Sorocaba
  b11: { lat: -23.4998, lng: -47.4562 }, // Centro, Sorocaba
  b12: { lat: -23.4875, lng: -47.4461 }, // Santa Rosália, Sorocaba
  b13: { lat: -23.5061, lng: -47.5112 }, // Wanel Ville, Sorocaba
  b14: { lat: -23.5056, lng: -47.6144 }, // Araçoiaba da Serra
  b15: { lat: -23.2642, lng: -47.2992 }, // Itu
  b16: { lat: -23.5432, lng: -47.4415 }, // Votorantim
};

export function isBusinessVerifiedSorocaba(biz: DirectoryBusiness): boolean {
  return biz.verified && (biz.city === 'Sorocaba' || biz.city === 'Votorantim');
}

function calculateSorocabaPriorityScore(biz: DirectoryBusiness, query: string): number {
  let score = 0;
  // Explicit priority for Sorocaba city proper
  if (biz.city === 'Sorocaba') score += 100;
  // Secondary priority for immediate conurbation (Votorantim) and RMS
  else if (biz.city === 'Votorantim') score += 75;
  else score += 45;

  // Official 'Verificado Sorocaba' seal boost
  if (isBusinessVerifiedSorocaba(biz)) score += 50;

  // Featured boost
  if (biz.featured) score += 25;

  // Proximity boost (closer to user's real/selected Sorocaba coordinates gets higher priority)
  score += Math.max(0, 35 - biz.distanceKm * 1.8);

  // Rating boost
  score += biz.rating * 5;

  // Query match boost on local terms
  if (query) {
    const q = query.toLowerCase();
    if (biz.name.toLowerCase().includes(q)) score += 40;
    if (biz.neighborhood.toLowerCase().includes(q) || biz.city.toLowerCase().includes(q)) score += 35;
    if (biz.tags.some(t => t.toLowerCase().includes(q))) score += 20;
  }

  return score;
}

interface BusinessDirectoryPageProps {
  onBackToHome: () => void;
  onOpenRegisterModal: () => void;
  onOpenLoginModal: () => void;
  onOpenExecutiveDashboard: () => void;
  onContactWhatsApp: (businessName: string) => void;
  onOpenBusinessLanding?: (business: DirectoryBusiness, adminMode?: boolean) => void;
  initialCategory?: string;
  initialSearch?: string;
  initialRadius?: number;
}

export function BusinessDirectoryPage({
  onBackToHome,
  onOpenRegisterModal,
  onOpenLoginModal,
  onOpenExecutiveDashboard,
  onContactWhatsApp,
  onOpenBusinessLanding,
  initialCategory = 'Todos',
  initialSearch = '',
  initialRadius = 25
}: BusinessDirectoryPageProps) {
  // Filter States
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos os Bairros');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(initialRadius);
  const [prioritizeSorocaba, setPrioritizeSorocaba] = useState<boolean>(true);
  const [onlyVerifiedSorocaba, setOnlyVerifiedSorocaba] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [onlyOpenNow, setOnlyOpenNow] = useState<boolean>(false);
  const [selectedPriceLevel, setSelectedPriceLevel] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'reviews' | 'distance'>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showRegionalMap, setShowRegionalMap] = useState<boolean>(true);
  const [selectedMapPinBusinessId, setSelectedMapPinBusinessId] = useState<string>('b1');

  // Hook that forces centering of geolocation on the map and directory to Sorocaba & region coordinates by default
  const {
    userCoords,
    activeHubId,
    isLocating: isDetectingGps,
    statusMessage: gpsStatusNotice,
    forceLockRegion,
    mapEmbedUrl,
    forceCenterSorocaba,
    selectHub,
    refreshGpsWithSorocabaLock,
    setForceLockRegion
  } = useSorocabaGeolocationCenter({
    autoDetectOnMount: true,
    defaultHubId: 'campolim',
    enforceRegionLock: true
  });
  const [dismissedGpsNotice, setDismissedGpsNotice] = useState<boolean>(false);

  // Dynamically recalculate real Haversine distance (km) from user's active coordinates to every business
  const businessesWithLiveDistance = useMemo(() => {
    return DIRECTORY_MOCK_DATA.map((biz) => {
      const coords = BUSINESS_COORDINATES_MAP[biz.id];
      if (!coords) return biz;
      const liveDist = calculateHaversineDistanceKm(
        userCoords.lat,
        userCoords.lng,
        coords.lat,
        coords.lng
      );
      return {
        ...biz,
        distanceKm: Math.max(0.2, liveDist)
      };
    });
  }, [userCoords.lat, userCoords.lng]);

  // Top 3 nearest business suggestions based on real proximity to user's location
  const nearestSuggestions = useMemo(() => {
    return [...businessesWithLiveDistance]
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 3);
  }, [businessesWithLiveDistance]);

  // AJAX Simulation States
  const [isAjaxLoading, setIsAjaxLoading] = useState<boolean>(false);
  const [ajaxResponseTime, setAjaxResponseTime] = useState<number>(38);
  const [filteredResults, setFilteredResults] = useState<DirectoryBusiness[]>(DIRECTORY_MOCK_DATA);
  const [ajaxQueryCount, setAjaxQueryCount] = useState<number>(1);
  const [selectedBusinessForModal, setSelectedBusinessForModal] = useState<DirectoryBusiness | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Debounce ref for AJAX query
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Browser Geolocation API Handler powered by useSorocabaGeolocationCenter
  const handleActivateBrowserGeolocation = async () => {
    setDismissedGpsNotice(false);
    const result = await refreshGpsWithSorocabaLock();
    setSortBy('distance');
    setToastMessage(`Localização centralizada: ${result.nearestHub.name} (${result.nearestHub.city})`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Manual Regional Hub Anchor Handler
  const handleSelectSorocabaHub = (hub: SorocabaHubPoint) => {
    setDismissedGpsNotice(false);
    selectHub(hub);
    setToastMessage(`Diretório e mapa centralizados em ${hub.name} (${hub.city})!`);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // Force Immediate Centering on Sorocaba Default Coordinates
  const handleForceSorocabaDefaultCenter = () => {
    setDismissedGpsNotice(false);
    const forced = forceCenterSorocaba('campolim');
    setPrioritizeSorocaba(true);
    setToastMessage(`Centralização forçada aplicada: ${forced.label} (${forced.lat.toFixed(4)}, ${forced.lng.toFixed(4)})`);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Trigger simulated AJAX filter on state change
  useEffect(() => {
    setIsAjaxLoading(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const startTime = performance.now();

      let results = [...businessesWithLiveDistance];

      // 1. Text Search (Name, subcategory, description, tags, neighborhood, city)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        results = results.filter(b =>
          b.name.toLowerCase().includes(query) ||
          b.category.toLowerCase().includes(query) ||
          b.subcategory.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query) ||
          b.neighborhood.toLowerCase().includes(query) ||
          b.city.toLowerCase().includes(query) ||
          b.tags.some(t => t.toLowerCase().includes(query))
        );
      }

      // 2. Category Filter
      if (selectedCategory !== 'Todos') {
        results = results.filter(b => b.category === selectedCategory);
      }

      // 3. Neighborhood Filter
      if (selectedNeighborhood !== 'Todos os Bairros') {
        results = results.filter(b => b.neighborhood === selectedNeighborhood || b.city === selectedNeighborhood);
      }

      // 4. Radius Filter (Raio de Alcance em km a partir da localização atual do usuário)
      results = results.filter(b => b.distanceKm <= maxRadiusKm);

      // 5. Rating Filter
      if (minRating > 0) {
        results = results.filter(b => b.rating >= minRating);
      }

      // 6. Only Verified Sorocaba Seal
      if (onlyVerifiedSorocaba) {
        results = results.filter(b => isBusinessVerifiedSorocaba(b));
      }

      // 7. Only General Verified
      if (onlyVerified) {
        results = results.filter(b => b.verified);
      }

      // 8. Only Open Now
      if (onlyOpenNow) {
        results = results.filter(b => b.openNow);
      }

      // 9. Price Level
      if (selectedPriceLevel !== 'Todos') {
        results = results.filter(b => b.priceLevel === selectedPriceLevel);
      }

      // 10. Explicit Sorocaba & Region Prioritization + Sorting
      if (sortBy === 'rating') {
        results.sort((a, b) => {
          if (prioritizeSorocaba && a.city === 'Sorocaba' && b.city !== 'Sorocaba') return -1;
          if (prioritizeSorocaba && a.city !== 'Sorocaba' && b.city === 'Sorocaba') return 1;
          return b.rating - a.rating;
        });
      } else if (sortBy === 'reviews') {
        results.sort((a, b) => {
          if (prioritizeSorocaba && a.city === 'Sorocaba' && b.city !== 'Sorocaba') return -1;
          if (prioritizeSorocaba && a.city !== 'Sorocaba' && b.city === 'Sorocaba') return 1;
          return b.reviewsCount - a.reviewsCount;
        });
      } else if (sortBy === 'distance') {
        results.sort((a, b) => a.distanceKm - b.distanceKm);
      } else {
        // Relevance: Explicitly prioritize Sorocaba & Region registered businesses + 'Verificado Sorocaba' seal + real proximity
        results.sort((a, b) => {
          if (prioritizeSorocaba) {
            const scoreA = calculateSorocabaPriorityScore(a, searchQuery);
            const scoreB = calculateSorocabaPriorityScore(b, searchQuery);
            if (scoreB !== scoreA) return scoreB - scoreA;
          }
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
      }

      const endTime = performance.now();
      const calculatedDuration = Math.max(18, Math.round(endTime - startTime + Math.random() * 25));

      setFilteredResults(results);
      setAjaxResponseTime(calculatedDuration);
      setIsAjaxLoading(false);
      setAjaxQueryCount(prev => prev + 1);
    }, 180);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    businessesWithLiveDistance,
    searchQuery,
    selectedCategory,
    selectedNeighborhood,
    maxRadiusKm,
    prioritizeSorocaba,
    onlyVerifiedSorocaba,
    minRating,
    onlyVerified,
    onlyOpenNow,
    selectedPriceLevel,
    sortBy
  ]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todos');
    setSelectedNeighborhood('Todos os Bairros');
    setMaxRadiusKm(25);
    setPrioritizeSorocaba(true);
    setOnlyVerifiedSorocaba(false);
    setMinRating(0);
    setOnlyVerified(false);
    setOnlyOpenNow(false);
    setSelectedPriceLevel('Todos');
    setSortBy('relevance');
    setToastMessage('Filtros restaurados com prioridade para Sorocaba e Região!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShareBusiness = (biz: DirectoryBusiness) => {
    if (navigator.share) {
      navigator.share({
        title: biz.name,
        text: `${biz.name} no GuiaPonto: ${biz.description}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin}?empresa=${biz.id}`);
      setToastMessage(`Link de ${biz.name} copiado para a área de transferência!`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 text-xs font-bold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Navigation Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={onBackToHome}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              title="Voltar para a página inicial"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Início</span>
            </button>

            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onBackToHome(); }}
              className="flex items-center gap-2 group"
            >
              <div className="h-10 w-36 bg-white flex items-center justify-center overflow-hidden">
                <img
                  src="https://www.guiaponto.com.br/images/layout/LOGO%20GUIAPONTO%20COM%20SIMBOLO.png"
                  alt="GuiaPonto"
                  className="h-full w-auto object-contain"
                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                />
              </div>
            </a>

            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Diretório Comercial Oficial</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenExecutiveDashboard}
              className="hidden sm:flex px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FE3A18]" />
              <span>Painel Executivo</span>
            </button>

            <button
              onClick={onOpenRegisterModal}
              className="px-5 py-2.5 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-black text-xs shadow-lg shadow-[#FE3A18]/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>Anunciar Minha Empresa</span>
            </button>
          </div>
        </div>
      </header>

      {/* Directory Hero Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FE3A18]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-bold border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Empresas Verificadas em Sorocaba e Região Metropolitana</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Diretório de Empresas & Serviços
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Encontre comércios locais, restaurantes, clínicas e prestadores de serviço com contato direto via WhatsApp e avaliação verificada.
              </p>
            </div>

            {/* AJAX Live Query Badge */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shrink-0 self-start md:self-auto space-y-1.5 min-w-[240px]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isAjaxLoading ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                  Filtro AJAX Ativo
                </span>
                <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                  {ajaxResponseTime}ms
                </span>
              </div>
              <div className="text-xl font-black text-white">
                {filteredResults.length} empresas encontradas
              </div>
              <div className="text-[10px] text-slate-400">
                {isAjaxLoading ? 'Processando requisição assíncrona...' : `Consulta #${ajaxQueryCount} realizada com sucesso`}
              </div>
            </div>
          </div>

          {/* Search Bar Input (Instant AJAX Trigger) */}
          <div className="bg-white rounded-3xl p-3 shadow-2xl flex flex-col lg:flex-row items-center gap-3 border border-slate-100">
            <div className="relative flex-1 w-full flex items-center">
              <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
              <input
                type="text"
                placeholder="Busque em Sorocaba e região por empresa, serviço ou bairro (ex: Almoço Campolim, Dentista)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 text-slate-900 text-sm font-semibold placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-3 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="h-8 w-[1px] bg-slate-200 hidden lg:block" />

            {/* Quick Neighborhood Selector */}
            <div className="relative w-full lg:w-52 shrink-0 flex items-center">
              <MapPin className="w-4 h-4 text-[#FE3A18] ml-3 shrink-0" />
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="w-full px-2.5 py-3 text-slate-800 text-xs sm:text-sm font-bold bg-transparent focus:outline-none cursor-pointer"
              >
                {NEIGHBORHOODS_LIST.map((nh) => (
                  <option key={nh} value={nh} className="text-slate-900 font-medium">
                    {nh}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 hidden lg:block" />

            {/* Quick Reach Radius Selector */}
            <div className="relative w-full lg:w-56 shrink-0 flex items-center bg-slate-50 rounded-2xl border border-slate-200/80 px-2">
              <Navigation className="w-4 h-4 text-emerald-600 ml-2 shrink-0" />
              <select
                value={maxRadiusKm}
                onChange={(e) => setMaxRadiusKm(Number(e.target.value))}
                className="w-full px-2 py-2.5 text-slate-800 text-xs font-extrabold bg-transparent focus:outline-none cursor-pointer"
                title="Raio de Alcance a partir de Sorocaba"
              >
                {RADIUS_PRESETS.map((r) => (
                  <option key={r.value} value={r.value} className="text-slate-900 font-semibold">
                    Raio: {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear All or Status Button */}
            <div className="w-full lg:w-auto flex items-center gap-2">
              <button
                onClick={handleClearFilters}
                className="w-full lg:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                title="Limpar todos os filtros"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAjaxLoading ? 'animate-spin text-[#FE3A18]' : ''}`} />
                <span>Resetar</span>
              </button>
            </div>
          </div>

          {/* Automatic Location Selector (Browser Geolocation API + Sorocaba Regional Hubs) */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-white/15 space-y-3.5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  userCoords.isGpsActive
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-[#FE3A18]/20 text-[#FE3A18] border border-[#FE3A18]/30'
                }`}>
                  <LocateFixed className={`w-5 h-5 ${isDetectingGps ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      Seletor de Localização Automática (GPS Sorocaba & Região)
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      userCoords.isGpsActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                        : 'bg-white/10 text-slate-300'
                    }`}>
                      {userCoords.isGpsActive ? 'GPS do Navegador Ativo' : 'Ponto de Referência Local'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Origem atual: <strong className="text-white">{userCoords.label}</strong>{' '}
                    <span className="text-slate-400 font-mono text-[11px]">
                      ({userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)})
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleActivateBrowserGeolocation}
                  disabled={isDetectingGps}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-black text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isDetectingGps ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LocateFixed className="w-4 h-4" />
                  )}
                  <span>
                    {isDetectingGps
                      ? 'Detectando GPS...'
                      : userCoords.isGpsActive
                      ? 'Atualizar Meu GPS (Sorocaba)'
                      : 'Ativar Localização Automática (GPS)'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleForceSorocabaDefaultCenter}
                  className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Forçar centralização nas coordenadas padrão de Sorocaba (-23.5329, -47.4658)"
                >
                  <Compass className="w-4 h-4 text-[#FE3A18]" />
                  <span>Forçar Centro Sorocaba</span>
                </button>
              </div>
            </div>

            {gpsStatusNotice && !dismissedGpsNotice && (
              <div className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 rounded-xl px-3.5 py-2 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{gpsStatusNotice}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setDismissedGpsNotice(true)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Quick Sorocaba & Surroundings Reference Hubs */}
            <div className="pt-2 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#FE3A18]" />
                Centralizar em:
              </span>
              {SOROCABA_REGIONAL_HUBS.map((hub) => {
                const isSelected = activeHubId === hub.id;
                return (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => handleSelectSorocabaHub(hub)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-md font-black'
                        : 'bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    <span>{hub.name}</span>
                    {hub.city !== 'Sorocaba' && (
                      <span className="text-[9px] opacity-70">({hub.city})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Categories Pills Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-[#FE3A18] text-white shadow-lg shadow-[#FE3A18]/30 scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                }`}
              >
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area: Sidebar Filters & Results Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ================= LEFT SIDEBAR FILTERS (AJAX CONTROLS) ================= */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6 sticky top-28">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-black text-base">
                  <SlidersHorizontal className="w-4 h-4 text-[#FE3A18]" />
                  <span>Filtros AJAX</span>
                </div>
                {(selectedCategory !== 'Todos' || selectedNeighborhood !== 'Todos os Bairros' || maxRadiusKm !== 25 || onlyVerifiedSorocaba || minRating > 0 || onlyVerified || onlyOpenNow || selectedPriceLevel !== 'Todos' || searchQuery) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs font-bold text-[#FE3A18] hover:underline cursor-pointer"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* AJAX Query Indicator Pill */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Tempo de Busca:
                </span>
                <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                  {ajaxResponseTime} ms
                </span>
              </div>

              {/* Reach Radius Selector (Seletor de Raio de Alcance) */}
              <div className="space-y-3 pt-1 pb-2 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Raio de Alcance</span>
                  </label>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Até {maxRadiusKm} km
                  </span>
                </div>

                <input
                  type="range"
                  min={2}
                  max={50}
                  step={1}
                  value={maxRadiusKm}
                  onChange={(e) => setMaxRadiusKm(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FE3A18]"
                />

                <div className="grid grid-cols-5 gap-1">
                  {[2, 5, 10, 25, 50].map((km) => (
                    <button
                      key={km}
                      type="button"
                      onClick={() => setMaxRadiusKm(km)}
                      className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        maxRadiusKm === km
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {km}km
                    </button>
                  ))}
                </div>

                <p className="text-[11px] text-slate-500 leading-snug">
                  A partir de <strong className="text-slate-700">{userCoords.label.split(',')[0]}</strong>:{' '}
                  {maxRadiusKm <= 2 && 'Entorno imediato do bairro'}
                  {maxRadiusKm > 2 && maxRadiusKm <= 5 && 'Bairros urbanos de Sorocaba'}
                  {maxRadiusKm > 5 && maxRadiusKm <= 12 && 'Sorocaba + Votorantim'}
                  {maxRadiusKm > 12 && 'Sorocaba, Votorantim, Araçoiaba & Itu'}
                </p>
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Categoria
                </label>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {CATEGORIES_LIST.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors flex items-center justify-between cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#FE3A18]/10 text-[#FE3A18] font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      {selectedCategory === cat && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minimum Rating Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Avaliação Mínima
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { value: 0, label: 'Todas' },
                    { value: 4.5, label: '4.5+' },
                    { value: 4.8, label: '4.8+' },
                    { value: 5.0, label: '5.0 ★' }
                  ].map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setMinRating(r.value)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        minRating === r.value
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Level */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Faixa de Preço
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['Todos', '$', '$$', '$$$'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedPriceLevel(lvl)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedPriceLevel === lvl
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fast Toggles: Sorocaba Priority & Special Filters */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Prioridade Regional & Selos
                </label>

                <label className="flex items-center justify-between cursor-pointer group bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/80">
                  <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Selo Verificado Sorocaba</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={onlyVerifiedSorocaba}
                    onChange={(e) => setOnlyVerifiedSorocaba(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded accent-emerald-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FE3A18]" />
                    Priorizar Sorocaba na Busca
                  </span>
                  <input
                    type="checkbox"
                    checked={prioritizeSorocaba}
                    onChange={(e) => setPrioritizeSorocaba(e.target.checked)}
                    className="w-4 h-4 text-[#FE3A18] rounded accent-[#FE3A18] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    Aberto Agora
                  </span>
                  <input
                    type="checkbox"
                    checked={onlyOpenNow}
                    onChange={(e) => setOnlyOpenNow(e.target.checked)}
                    className="w-4 h-4 text-[#FE3A18] rounded accent-[#FE3A18] cursor-pointer"
                  />
                </label>
              </div>

              {/* Callout box to register business */}
              <div className="bg-gradient-to-br from-[#FE3A18]/10 via-rose-50 to-orange-50 rounded-2xl p-4 border border-[#FE3A18]/20 space-y-2.5">
                <div className="flex items-center gap-2 text-[#FE3A18] font-black text-xs uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Seja Encontrado</span>
                </div>
                <p className="text-xs text-slate-700 leading-snug">
                  Tem uma empresa em Sorocaba ou região? Receba o selo <strong>Verificado Sorocaba</strong> e ganhe destaque prioritário.
                </p>
                <button
                  onClick={onOpenRegisterModal}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  Cadastrar Empresa Grátis
                </button>
              </div>

            </div>
          </aside>

          {/* ================= RIGHT RESULTS COLUMN ================= */}
          <main className="lg:col-span-3 space-y-6">

            {/* Real-Proximity Suggestions Strip (Sugestões Baseadas na Proximidade Real em Sorocaba) */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 rounded-3xl p-5 text-white border border-slate-800 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-black tracking-tight flex items-center gap-2">
                      <span>Sugestões Mais Próximas de Você</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        Proximidade Real
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Calculado a partir de <strong className="text-slate-200">{userCoords.label}</strong>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSortBy('distance')}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                  <span>Ordenar diretório por menor distância</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {nearestSuggestions.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      onOpenBusinessLanding
                        ? onOpenBusinessLanding(item, false)
                        : setSelectedBusinessForModal(item)
                    }
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-3.5 transition-all cursor-pointer flex flex-col justify-between gap-2 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                          <Navigation className="w-2.5 h-2.5" />
                          {item.distanceKm.toFixed(1)} km • ~{estimateTravelTimeMinutes(item.distanceKm)} min
                        </span>
                        <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {item.rating.toFixed(1)}
                        </span>
                      </div>
                      <h3 className="text-xs font-extrabold text-white group-hover:text-[#FE3A18] transition-colors truncate pt-0.5">
                        {idx + 1}. {item.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate">
                        {item.neighborhood}, {item.city}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] font-bold">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Verificado Sorocaba
                      </span>
                      <span className="text-slate-300 group-hover:text-white underline">
                        Abrir Landing Page →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Sorocaba & Region Geolocation Map Panel (Forced Sorocaba Center) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#FE3A18]/20 border border-[#FE3A18]/40 flex items-center justify-center text-[#FE3A18] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-black tracking-tight text-white">
                        Mapa Regional Centralizado em Sorocaba & Região
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        {forceLockRegion ? 'Trava Geográfica Sorocaba Ativa' : 'Exploração Regional'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Coordenadas centralizadas: <strong className="text-white">{userCoords.label}</strong>{' '}
                      <span className="font-mono text-slate-400">
                        ({userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)})
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setForceLockRegion(!forceLockRegion)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                      forceLockRegion
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                        : 'bg-white/10 text-slate-300 border-white/15'
                    }`}
                  >
                    {forceLockRegion ? '● Fixado em Sorocaba' : '○ Fixar em Sorocaba'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowRegionalMap(!showRegionalMap)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    {showRegionalMap ? 'Recolher Mapa' : 'Expandir Mapa'}
                  </button>
                </div>
              </div>

              {showRegionalMap && (
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* Live Regional Map Centered on Sorocaba Coordinates */}
                  <div className="lg:col-span-7 relative min-h-[270px] bg-slate-100 border-b lg:border-b-0 lg:border-r border-slate-200">
                    <iframe
                      title="Mapa Regional Sorocaba e Região"
                      src={mapEmbedUrl}
                      className="w-full h-full min-h-[270px] border-0"
                      loading="lazy"
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-slate-950/85 backdrop-blur-md text-white px-3.5 py-2 rounded-xl border border-white/10 flex items-center justify-between gap-2 text-[11px]">
                      <span className="flex items-center gap-1.5 font-bold text-emerald-300">
                        <LocateFixed className="w-3.5 h-3.5" />
                        <span>Centro Ativo: {userCoords.label}</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleForceSorocabaDefaultCenter}
                        className="text-orange-300 hover:text-white font-black underline cursor-pointer"
                      >
                        Recentralizar Sorocaba
                      </button>
                    </div>
                  </div>

                  {/* Interactive Sorocaba Business Pins List */}
                  <div className="lg:col-span-5 p-4 bg-slate-50/70 flex flex-col justify-between space-y-3 max-h-[290px] overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                        Pontos Comerciais no Mapa ({filteredResults.length})
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        Padrão Local Ativo
                      </span>
                    </div>

                    <div className="space-y-2">
                      {filteredResults.slice(0, 5).map((biz) => {
                        const coords = BUSINESS_COORDINATES_MAP[biz.id] || { lat: -23.5329, lng: -47.4658 };
                        const isSelectedPin = selectedMapPinBusinessId === biz.id;
                        return (
                          <div
                            key={biz.id}
                            onClick={() => {
                              setSelectedMapPinBusinessId(biz.id);
                              selectHub({
                                id: biz.id,
                                name: biz.name,
                                neighborhood: biz.neighborhood,
                                city: biz.city,
                                label: `${biz.neighborhood}, ${biz.city} - SP`,
                                lat: coords.lat,
                                lng: coords.lng,
                                description: biz.category
                              });
                            }}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              isSelectedPin
                                ? 'bg-white border-[#FE3A18] shadow-xs'
                                : 'bg-white/80 hover:bg-white border-slate-200/80'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-extrabold text-slate-900 truncate flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[#FE3A18] shrink-0" />
                                <span className="truncate">{biz.name}</span>
                              </div>
                              <div className="text-[10px] text-slate-500 truncate pl-5">
                                {biz.neighborhood}, {biz.city} • {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                {biz.distanceKm.toFixed(1)} km
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onOpenBusinessLanding) {
                                    onOpenBusinessLanding(biz, false);
                                  } else {
                                    setSelectedBusinessForModal(biz);
                                  }
                                }}
                                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-[#FE3A18] text-white text-[10px] font-bold cursor-pointer"
                              >
                                Abrir
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Top Bar: Sort By, View Mode & Result Stats */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-500">
                    Exibindo <strong className="text-slate-900">{filteredResults.length}</strong> de {DIRECTORY_MOCK_DATA.length} empresas (Raio: <strong>até {maxRadiusKm} km</strong> de {userCoords.label.split(',')[0]})
                  </span>
                  {isAjaxLoading && (
                    <span className="text-xs text-[#FE3A18] font-bold flex items-center gap-1.5 animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Atualizando resultados...</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {/* Sort dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 hidden sm:inline">Ordenar:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="relevance">Prioridade Sorocaba & Relevância</option>
                      <option value="rating">Melhor Avaliados (Nota)</option>
                      <option value="reviews">Mais Populares (Avaliações)</option>
                      <option value="distance">Mais Próximos de Mim (km)</option>
                    </select>
                  </div>

                  {/* Grid / List View Toggle */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all cursor-pointer ${
                        viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                      }`}
                      title="Visualização em Grade"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all cursor-pointer ${
                        viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                      }`}
                      title="Visualização em Lista"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Sorocaba Prioritization & Quick Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPrioritizeSorocaba(!prioritizeSorocaba)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      prioritizeSorocaba
                        ? 'bg-[#FE3A18]/10 text-[#FE3A18] border-[#FE3A18]/30'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Priorização Sorocaba & Região: {prioritizeSorocaba ? 'ATIVA' : 'DESATIVADA'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOnlyVerifiedSorocaba(!onlyVerifiedSorocaba)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      onlyVerifiedSorocaba
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Apenas Selo &apos;Verificado Sorocaba&apos;</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-400 font-semibold">
                  DDD (15) • Distâncias calculadas em tempo real via Geolocation
                </span>
              </div>
            </div>

            {/* Empty State */}
            {filteredResults.length === 0 && !isAjaxLoading && (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Nenhuma empresa encontrada neste raio</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Não encontramos nenhuma empresa dentro do raio de {maxRadiusKm} km a partir de {userCoords.label} com os filtros selecionados. Tente ampliar o raio de alcance ou redefinir os filtros.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {maxRadiusKm < 50 && (
                    <button
                      onClick={() => setMaxRadiusKm(50)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Ampliar Raio para 50 km
                    </button>
                  )}
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-2.5 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Restaurar Todos os Filtros
                  </button>
                </div>
              </div>
            )}

            {/* Results Grid / List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredResults.map((biz) => {
                const isLocalVerified = isBusinessVerifiedSorocaba(biz);

                if (viewMode === 'list') {
                  return (
                    <motion.div
                      layout
                      key={biz.id}
                      className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center gap-6 group"
                    >
                      <div className="relative w-full sm:w-56 h-48 sm:h-44 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={biz.image}
                          alt={biz.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {biz.featured && (
                            <span className="bg-[#FE3A18] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md w-fit">
                              Destaque
                            </span>
                          )}
                          {isLocalVerified && (
                            <span className="bg-emerald-600/95 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 w-fit">
                              <ShieldCheck className="w-3 h-3" />
                              Verificado Sorocaba
                            </span>
                          )}
                        </div>
                        <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {biz.priceLevel}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 space-y-2 w-full">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-[#FE3A18]">{biz.category}</span>
                            {isLocalVerified && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                Verificado Sorocaba
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 bg-amber-500 text-white px-2 py-0.5 rounded-lg text-xs font-black shadow-xs">
                            <Star className="w-3.5 h-3.5 fill-white" />
                            <span>{biz.rating.toFixed(1)}</span>
                            <span className="opacity-80 text-[10px]">({biz.reviewsCount})</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-black text-slate-900 group-hover:text-[#FE3A18] transition-colors truncate">
                          {biz.name}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {biz.location}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-600 font-bold">{biz.distanceKm} km de Sorocaba Centro</span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {biz.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {biz.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 w-full sm:w-44 shrink-0 sm:border-l sm:border-slate-100 sm:pl-6">
                        <span className={`text-[11px] font-bold flex items-center gap-1.5 ${biz.openNow ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <Clock className="w-3.5 h-3.5" />
                          {biz.openNow ? 'Aberto Agora' : 'Fechado no momento'}
                        </span>

                        <button
                          onClick={() => onContactWhatsApp(biz.name)}
                          className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>

                        <button
                          onClick={() =>
                            onOpenBusinessLanding
                              ? onOpenBusinessLanding(biz, false)
                              : setSelectedBusinessForModal(biz)
                          }
                          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#FE3A18] text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Landing Page Completa</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                }

                // Grid View Card
                return (
                  <motion.div
                    layout
                    key={biz.id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between"
                  >
                    <div>
                      {/* Image header */}
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        <img
                          src={biz.image}
                          alt={biz.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {biz.featured && (
                            <span className="bg-[#FE3A18] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg w-fit">
                              Destaque
                            </span>
                          )}
                          {isLocalVerified && (
                            <span className="bg-emerald-600/95 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 w-fit border border-emerald-400/30">
                              <ShieldCheck className="w-3 h-3 text-emerald-200" />
                              Verificado Sorocaba
                            </span>
                          )}
                        </div>

                        <div className="absolute top-3 right-3 flex items-center gap-1">
                          <button
                            onClick={() => handleShareBusiness(biz)}
                            className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-white hover:text-slate-900 transition-colors"
                            title="Compartilhar empresa"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-black/50 backdrop-blur-md">
                            {biz.category.split(' & ')[0]}
                          </span>
                          <div className="flex items-center gap-1 bg-amber-500 text-white px-2 py-0.5 rounded-lg text-xs font-black shadow-xs">
                            <Star className="w-3.5 h-3.5 fill-white" />
                            <span>{biz.rating.toFixed(1)}</span>
                            <span className="opacity-80 text-[10px]">({biz.reviewsCount})</span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between text-xs gap-1">
                          <span className="text-slate-400 font-semibold truncate">{biz.subcategory}</span>
                          <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                            {biz.priceLevel}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-lg font-black text-slate-900 group-hover:text-[#FE3A18] transition-colors leading-snug line-clamp-1">
                            {biz.name}
                          </h3>
                          {isLocalVerified && (
                            <div className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>Empresa Local • Verificado Sorocaba</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{biz.location}</span>
                          <span className="text-emerald-600 font-bold shrink-0">({biz.distanceKm} km)</span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {biz.description}
                        </p>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {biz.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-5 pt-0 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-3 border-t border-slate-100">
                        <span className={`flex items-center gap-1 ${biz.openNow ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <Clock className="w-3 h-3" />
                          {biz.openNow ? 'Aberto Agora' : 'Fechado'}
                        </span>
                        <button
                          onClick={() => setSelectedBusinessForModal(biz)}
                          className="text-slate-600 hover:text-[#FE3A18] hover:underline cursor-pointer"
                        >
                          Resumo Rápido
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() =>
                            onOpenBusinessLanding
                              ? onOpenBusinessLanding(biz, false)
                              : setSelectedBusinessForModal(biz)
                          }
                          className="py-2.5 px-2.5 rounded-xl bg-slate-900 hover:bg-[#FE3A18] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Página Completa</span>
                        </button>

                        <button
                          onClick={() => onContactWhatsApp(biz.name)}
                          className="py-2.5 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Promotional Card */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-black uppercase tracking-wider text-[#FE3A18] bg-[#FE3A18]/20 px-3 py-1 rounded-full">
                  Guia Comercial GuiaPonto • Sorocaba & Região
                </span>
                <h3 className="text-2xl font-black">Sua empresa ainda não possui o selo Verificado Sorocaba?</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Cadastre seu estabelecimento em menos de 2 minutos, conquiste o selo oficial de verificação local e receba leads diretos no WhatsApp todos os dias.
                </p>
              </div>

              <button
                onClick={onOpenRegisterModal}
                className="px-6 py-3.5 rounded-2xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-black text-sm shadow-xl shadow-[#FE3A18]/30 transition-all shrink-0 cursor-pointer"
              >
                Cadastrar Minha Empresa
              </button>
            </div>

          </main>
        </div>
      </div>

      {/* ================= MODAL: FICHA COMPLETA DA EMPRESA ================= */}
      {selectedBusinessForModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl my-8 text-slate-900 space-y-0"
          >
            {/* Modal Cover Image */}
            <div className="relative h-64 bg-slate-900">
              <img
                src={selectedBusinessForModal.image}
                alt={selectedBusinessForModal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              
              <button
                onClick={() => setSelectedBusinessForModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold bg-[#FE3A18] px-2.5 py-0.5 rounded-full">
                    {selectedBusinessForModal.category}
                  </span>
                  {isBusinessVerifiedSorocaba(selectedBusinessForModal) ? (
                    <span className="text-xs font-extrabold bg-emerald-600 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verificado Sorocaba
                    </span>
                  ) : selectedBusinessForModal.verified ? (
                    <span className="text-xs font-bold bg-emerald-500/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verificado Região
                    </span>
                  ) : null}
                </div>
                <h3 className="text-2xl font-black">{selectedBusinessForModal.name}</h3>
                <p className="text-xs text-slate-300">{selectedBusinessForModal.subcategory}</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Rating & Quick Stats */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Avaliação</span>
                  <div className="text-lg font-black text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{selectedBusinessForModal.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{selectedBusinessForModal.reviewsCount} opiniões</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                  <div className="text-xs font-bold text-emerald-600 mt-1">
                    {selectedBusinessForModal.openNow ? 'Aberto Agora' : 'Fechado'}
                  </div>
                  <span className="text-[10px] text-slate-500">{selectedBusinessForModal.closingTime}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Preço</span>
                  <div className="text-sm font-black text-slate-900 mt-1">
                    {selectedBusinessForModal.priceLevel}
                  </div>
                  <span className="text-[10px] text-slate-500">Custo-benefício</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-extrabold text-slate-900">Sobre o Estabelecimento</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedBusinessForModal.description}
                </p>
              </div>

              {/* Address and Contact info */}
              <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#FE3A18] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">{selectedBusinessForModal.address}</span>
                    <span className="text-slate-500">{selectedBusinessForModal.neighborhood}, {selectedBusinessForModal.city}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-200/60">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-700">{selectedBusinessForModal.phone}</span>
                </div>
              </div>

              {/* Popular Services & Prices */}
              {selectedBusinessForModal.popularServices.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-extrabold text-slate-900">Destaques do Cardápio / Serviços</h4>
                  <div className="space-y-2">
                    {selectedBusinessForModal.popularServices.map((srv, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <span className="font-bold text-slate-800">{srv.name}</span>
                        <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                          {srv.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              <div className="space-y-2">
                <h4 className="text-sm font-extrabold text-slate-900">Comodidades & Diferenciais</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBusinessForModal.amenities.map((item, i) => (
                    <span key={i} className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 text-slate-700 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-3">
                {onOpenBusinessLanding && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      onClick={() => {
                        const target = selectedBusinessForModal;
                        setSelectedBusinessForModal(null);
                        onOpenBusinessLanding(target, false);
                      }}
                      className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-[#FE3A18] text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Abrir Landing Page Completa</span>
                    </button>

                    <button
                      onClick={() => {
                        const target = selectedBusinessForModal;
                        setSelectedBusinessForModal(null);
                        onOpenBusinessLanding(target, true);
                      }}
                      className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#FE3A18]" />
                      <span>Modo Admin (Banner & Galeria)</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const name = selectedBusinessForModal.name;
                      setSelectedBusinessForModal(null);
                      onContactWhatsApp(name);
                    }}
                    className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Falar Direto no WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleShareBusiness(selectedBusinessForModal)}
                    className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="Compartilhar"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
