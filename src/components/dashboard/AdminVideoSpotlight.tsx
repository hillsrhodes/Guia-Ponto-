/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video,
  Play,
  Pause,
  Film,
  Share2,
  Eye,
  CheckCircle2,
  Plus,
  X,
  Search,
  Clock,
  Award,
  Sparkles,
  Maximize2,
  Volume2,
  VolumeX,
  BookOpen,
  Check,
  ChevronRight,
  ExternalLink,
  Trash2
} from 'lucide-react';

export interface SpotlightVideo {
  id: string;
  title: string;
  category: 'Tutoriais & Guia' | 'Novidades da Plataforma' | 'Dicas de Conversão' | 'Atualização do Algoritmo' | 'Comunicado Geral';
  videoUrl: string;
  thumbnail: string;
  duration: string;
  date: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  description: string;
  views: number;
  watched: boolean;
  featured?: boolean;
  badge?: string;
  keyTakeaways: string[];
}

export interface AdminVideoSpotlightProps {
  onAddXp?: (points: number, reason: string) => void;
  isDarkMode?: boolean;
}

const INITIAL_SPOTLIGHT_VIDEOS: SpotlightVideo[] = [
  {
    id: 'spotlight-1',
    title: 'Tutorial Completo: Como Dominar o Otimizador de SEO e o Simulador de Faturamento',
    category: 'Tutoriais & Guia',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
    duration: '05:42',
    date: 'Hoje, 10:15',
    author: 'Alexandre Santos',
    authorRole: 'Fundador & Admin GuiaPonto',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    description: 'Neste tutorial oficial detalhado, o admin Alexandre demonstra como gerar meta tags com IA para ranquear no topo do Google e como utilizar a Projeção de Faturamento Preditivo.',
    views: 524,
    watched: false,
    featured: true,
    badge: 'Novo & Essencial',
    keyTakeaways: [
      'Como selecionar as melhores palavras-chave com base na sua localização',
      'Configuração da taxa de conversão do WhatsApp para estimar ganhos mensais',
      'Ativação do selo 5 estrelas do GuiaPonto nas buscas orgânicas'
    ]
  },
  {
    id: 'spotlight-2',
    title: 'Novidades da Versão: Conheça o Tour Guiado Interativo e o Otimizador de Anúncios Gemini',
    category: 'Novidades da Plataforma',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    duration: '04:18',
    date: 'Ontem',
    author: 'Alexandre Santos',
    authorRole: 'Fundador & Admin GuiaPonto',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    description: 'Apresentação das ferramentas lançadas na última atualização da plataforma para potencializar o Escritório Virtual dos lojistas.',
    views: 940,
    watched: true,
    badge: 'Atualização',
    keyTakeaways: [
      'Novo fluxo guiado passo a passo para novos parceiros',
      'Análise preditiva de copy com recomendações geradas por IA',
      'Integração direta com métricas de cliques e conversão'
    ]
  },
  {
    id: 'spotlight-3',
    title: 'Dicas de Conversão: Como responder leads do WhatsApp em menos de 5 minutos e fechar 3x mais',
    category: 'Dicas de Conversão',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    duration: '06:30',
    date: '09 Nov 2026',
    author: 'Alexandre Santos',
    authorRole: 'Fundador & Admin GuiaPonto',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    description: 'Estratégias práticas de atendimento humanizado e scripts prontos para transformar cliques de anúncios em vendas imediatas no WhatsApp.',
    views: 1420,
    watched: true,
    badge: 'Alta Conversão',
    keyTakeaways: [
      'Scripts de boas-vindas com foco em fechamento imediato',
      'Como evitar que o cliente procure outro concorrente na mesma região',
      'Configuração de horários de pico para aumentar a taxa de resposta'
    ]
  },
  {
    id: 'spotlight-4',
    title: 'Atualização do Algoritmo de Busca Local: Critérios para Alcançar o Top 3 da sua Cidade',
    category: 'Atualização do Algoritmo',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    duration: '03:55',
    date: '06 Nov 2026',
    author: 'Alexandre Santos',
    authorRole: 'Fundador & Admin GuiaPonto',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    description: 'Entenda os novos fatores de rankeamento do GuiaPonto: Reputation Score, avaliações recentes e fotos de alta resolução.',
    views: 1850,
    watched: false,
    badge: 'Algoritmo 2026',
    keyTakeaways: [
      'Peso do Reputation Score no posicionamento de anúncios',
      'Como o selo GuiaPonto Pro Legend dobra as impressões diárias',
      'Penalizações por respostas atrasadas no CRM de leads'
    ]
  },
  {
    id: 'spotlight-5',
    title: 'Comunicado Geral: Nova Central de Parcerias entre Lojistas e Expansão Regional',
    category: 'Comunicado Geral',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    duration: '04:50',
    date: '03 Nov 2026',
    author: 'Alexandre Santos',
    authorRole: 'Fundador & Admin GuiaPonto',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    description: 'Oportunidades de cross-selling entre comerciantes cadastrados na plataforma e planos de ampliação para novas cidades no próximo trimestre.',
    views: 2100,
    watched: false,
    badge: 'Institucional',
    keyTakeaways: [
      'Rede de indicações mútuas com descontos para clientes finais',
      'Campanhas cooperadas de marketing com apoio técnico da GuiaPonto',
      'Calendário de webinars ao vivo com o time de especialistas'
    ]
  }
];

export function AdminVideoSpotlight({ onAddXp, isDarkMode = false }: AdminVideoSpotlightProps) {
  const [videos, setVideos] = useState<SpotlightVideo[]>(INITIAL_SPOTLIGHT_VIDEOS);
  const [selectedVideoId, setSelectedVideoId] = useState<string>('spotlight-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals & Toasts
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [showCinemaModal, setShowCinemaModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Video Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<SpotlightVideo['category']>('Tutoriais & Guia');
  const [newUrl, setNewUrl] = useState('');
  const [newDuration, setNewDuration] = useState('04:30');
  const [newThumbnail, setNewThumbnail] = useState('https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80');
  const [newDescription, setNewDescription] = useState('');
  const [newTakeaway1, setNewTakeaway1] = useState('');
  const [newTakeaway2, setNewTakeaway2] = useState('');

  const activeVideo = videos.find(v => v.id === selectedVideoId) || videos[0];

  const categories = [
    'Todos',
    'Tutoriais & Guia',
    'Novidades da Plataforma',
    'Dicas de Conversão',
    'Atualização do Algoritmo',
    'Comunicado Geral'
  ];

  const filteredVideos = videos.filter(v => {
    const matchesCategory = activeCategory === 'Todos' || v.category === activeCategory;
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleMarkWatched = (videoId: string) => {
    const target = videos.find(v => v.id === videoId);
    if (target && !target.watched) {
      setTimeout(() => {
        onAddXp?.(50, `Assistiu ao vídeo: ${target.title.slice(0, 25)}...`);
      }, 0);
      showToast('Você ganhou +50 XP por assistir ao vídeo oficial!');
    }
    setVideos(prev => prev.map(v => v.id === videoId ? { ...v, watched: true, views: v.views + 1 } : v));
  };

  const handlePlayVideo = (video: SpotlightVideo) => {
    setSelectedVideoId(video.id);
    setIsPlaying(true);
    handleMarkWatched(video.id);
  };

  const handleCopyLink = (video: SpotlightVideo) => {
    const link = `${window.location.origin}#video-spotlight-${video.id}`;
    navigator.clipboard?.writeText(link);
    showToast(`Link copiado: ${video.title.slice(0, 32)}...`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDeleteVideo = (videoId: string) => {
    const nextVideos = videos.filter(v => v.id !== videoId);
    if (selectedVideoId === videoId && nextVideos.length > 0) {
      setSelectedVideoId(nextVideos[0].id);
    }
    setVideos(nextVideos);
    showToast('Vídeo removido da lista do Spotlight.');
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const createdVideo: SpotlightVideo = {
      id: 'spotlight-' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      videoUrl: newUrl.trim() || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: newThumbnail.trim() || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      duration: newDuration.trim() || '03:45',
      date: 'Agora mesmo',
      author: 'Alexandre Santos',
      authorRole: 'Fundador & Admin GuiaPonto',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      description: newDescription.trim() || 'Novo vídeo tutorial e comunicado postado pelo admin.',
      views: 1,
      watched: false,
      featured: true,
      badge: 'Recém Postado',
      keyTakeaways: [
        newTakeaway1.trim() || 'Orientação oficial para máxima performance no GuiaPonto',
        newTakeaway2.trim() || 'Recomendações técnicas diretas do administrador'
      ].filter(Boolean)
    };

    setVideos(prev => [createdVideo, ...prev]);
    setSelectedVideoId(createdVideo.id);
    setIsPlaying(true);
    setShowPostModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewUrl('');
    setNewTakeaway1('');
    setNewTakeaway2('');
    setTimeout(() => {
      onAddXp?.(150, 'Novo Vídeo Informativo Publicado no Admin Spotlight');
    }, 0);
    showToast('Vídeo publicado com sucesso! +150 XP adicionados.');
  };

  return (
    <div className={`rounded-3xl p-6 sm:p-8 border shadow-sm space-y-8 transition-colors ${
      isDarkMode 
        ? 'bg-slate-900 border-slate-800 text-white' 
        : 'bg-white border-slate-200/80 text-slate-900'
    }`}>
      
      {/* Spotlight Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b pb-6 border-slate-100 dark:border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-[#FE3A18] border border-[#FE3A18]/20 flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#FE3A18] animate-pulse" />
              Admin Video Spotlight • Canal Oficial
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Tutoriais & Atualizações em Vídeo
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
            Admin Video Spotlight
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Assista a tutoriais guiados, atualizações de algoritmo e comunicados do administrador Alexandre Santos diretamente no seu painel.
          </p>
        </div>

        {/* Search & Post Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar vídeos e tutoriais..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-2xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FE3A18] w-full sm:w-60"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowPostModal(true)}
            className="px-5 py-3 rounded-2xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-extrabold text-xs shadow-lg shadow-[#FE3A18]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Postar Vídeo (Admin)</span>
          </button>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const count = cat === 'Todos' ? videos.length : videos.filter(v => v.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>{cat}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                isActive 
                  ? 'bg-white/20 text-white dark:bg-slate-950/20 dark:text-slate-950' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Spotlight Video Showcase (Hero Player) */}
      <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Video Player Display (7 cols) */}
          <div className="lg:col-span-7 relative aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden">
            {isPlaying ? (
              <div className="w-full h-full relative flex flex-col justify-between bg-black">
                {/* Simulated HD Stream View */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={activeVideo.thumbnail}
                    alt={activeVideo.title}
                    className="w-full h-full object-cover opacity-35 blur-[1px]"
                  />
                  <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-[#FE3A18]/20 text-[#FE3A18] border border-[#FE3A18]/40 flex items-center justify-center animate-pulse shadow-lg">
                      <Play className="w-8 h-8 fill-[#FE3A18] ml-1" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      Reproduzindo Tutorial no Dashboard
                    </span>
                    <h4 className="text-sm sm:text-base font-extrabold text-white max-w-md line-clamp-2 px-2">
                      {activeVideo.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 max-w-sm">
                      Vídeo informativo de alta definição oficial do GuiaPonto.
                    </p>
                  </div>
                </div>

                {/* Video Controls Bar */}
                <div className="relative z-10 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex items-center justify-between text-white text-xs mt-auto">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(false)}
                      className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors"
                      title="Pausar"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                      title={isMuted ? 'Ativar Som' : 'Silenciar'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
                      <span className="text-emerald-400 font-bold">01:45</span>
                      <span>/</span>
                      <span>{activeVideo.duration}</span>
                    </div>
                  </div>

                  {/* Playback Progress Indicator */}
                  <div className="flex-1 mx-4 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                    <div className="h-full bg-[#FE3A18] w-2/5 animate-pulse" />
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Speed Selector */}
                    <button
                      onClick={() => setPlaybackSpeed(prev => prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1)}
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono font-bold text-slate-300 cursor-pointer"
                    >
                      {playbackSpeed}x
                    </button>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">
                      1080p
                    </span>
                    <button
                      onClick={() => setShowCinemaModal(true)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                      title="Modo Cinema / Tela Cheia"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => handlePlayVideo(activeVideo)}
                className="w-full h-full relative cursor-pointer group"
              >
                <img
                  src={activeVideo.thumbnail}
                  alt={activeVideo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FE3A18] text-white shadow-md">
                      {activeVideo.category}
                    </span>
                    {activeVideo.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                        {activeVideo.badge}
                      </span>
                    )}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/75 backdrop-blur-sm text-white flex items-center gap-1 border border-white/10 shadow-md">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {activeVideo.duration}
                  </span>
                </div>

                {/* Big Pulsing Play Button */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-18 h-18 rounded-full bg-[#FE3A18] group-hover:bg-[#e33315] group-hover:scale-110 flex items-center justify-center text-white shadow-2xl shadow-[#FE3A18]/60 transition-all duration-300">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                  <div className="mt-4 flex items-center gap-2 bg-slate-950/80 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-bold text-white">
                      Assistir Agora (+50 XP)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Video Information & Takeaways (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between text-white space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#FE3A18]">
                    Destaque do Administrador
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {activeVideo.views} visualizações
                  </span>
                </div>
                <h4 className="text-lg sm:text-xl font-black leading-tight text-white">
                  {activeVideo.title}
                </h4>
              </div>

              {/* Author Row */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <img
                  src={activeVideo.authorAvatar}
                  alt={activeVideo.author}
                  className="w-10 h-10 rounded-xl object-cover border border-[#FE3A18]"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-white">{activeVideo.author}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                  </div>
                  <span className="text-[10px] text-slate-400 block">{activeVideo.authorRole}</span>
                </div>
                <span className="ml-auto text-[10px] text-slate-400">{activeVideo.date}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeVideo.description}
              </p>

              {/* Key Takeaways */}
              {activeVideo.keyTakeaways && activeVideo.keyTakeaways.length > 0 && (
                <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3" />
                    Principais Tópicos Abordados
                  </span>
                  <ul className="space-y-1.5">
                    {activeVideo.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[11px] text-slate-300 leading-normal">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Video Action Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    if (!isPlaying) handleMarkWatched(activeVideo.id);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#FE3A18]/30 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{isPlaying ? 'Pausar' : 'Assistir no Dashboard'}</span>
                </button>
                <button
                  onClick={() => handleCopyLink(activeVideo)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 cursor-pointer transition-colors"
                  title="Copiar Link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {activeVideo.watched ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold text-xs flex items-center gap-1.5 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Assistido (+50 XP)
                  </span>
                ) : (
                  <button
                    onClick={() => handleMarkWatched(activeVideo.id)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-extrabold text-xs flex items-center gap-1.5 border border-amber-500/30 transition-colors cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    Marcar Assistido (+50 XP)
                  </button>
                )}

                {videos.length > 1 && (
                  <button
                    onClick={() => handleDeleteVideo(activeVideo.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                    title="Remover vídeo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Curated Spotlight Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-[#FE3A18]" />
            <h4 className="font-extrabold text-base tracking-tight">
              Todos os Vídeos do Admin ({filteredVideos.length})
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Clique em qualquer card para assistir instantaneamente
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((video) => {
            const isSelected = video.id === activeVideo.id;
            return (
              <motion.div
                key={video.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => handlePlayVideo(video)}
                className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all cursor-pointer group shadow-xs ${
                  isSelected
                    ? 'ring-2 ring-[#FE3A18] border-[#FE3A18] bg-rose-50/40 dark:bg-rose-950/20'
                    : isDarkMode 
                      ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80' 
                      : 'bg-white hover:bg-slate-50 border-slate-200/80'
                }`}
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FE3A18] text-white shadow-md">
                    {video.category}
                  </span>

                  {/* Duration Badge */}
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/80 text-white flex items-center gap-1 backdrop-blur-xs">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {video.duration}
                  </span>

                  {/* Hover Play Button Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <div className="w-12 h-12 rounded-full bg-[#FE3A18] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400">
                      <span>{video.date}</span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Eye className="w-3 h-3" />
                        {video.views} views
                      </span>
                    </div>

                    <h5 className="font-extrabold text-sm line-clamp-2 leading-snug group-hover:text-[#FE3A18] transition-colors">
                      {video.title}
                    </h5>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#FE3A18] font-bold group-hover:translate-x-1 transition-transform">
                      <span>Assistir</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>

                    {video.watched ? (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Assistido
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        +50 XP
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredVideos.length === 0 && (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
            <Film className="w-10 h-10 mx-auto text-slate-400" />
            <h5 className="font-extrabold text-base">Nenhum vídeo encontrado</h5>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tente buscar por outro termo ou selecione uma categoria diferente nos filtros acima.
            </p>
            <button
              onClick={() => { setActiveCategory('Todos'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-[#FE3A18] text-white font-bold text-xs"
            >
              Resetar Filtros
            </button>
          </div>
        )}
      </div>

      {/* Post New Video Modal */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 text-white border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FE3A18] text-white flex items-center justify-center font-black shadow-lg">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#FE3A18]">
                      Admin Spotlight • Publicação
                    </span>
                    <h3 className="text-lg font-black text-white">
                      Adicionar Novo Vídeo ou Tutorial
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Título do Vídeo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Como Criar Anúncios de Alta Conversão com o Gemini"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FE3A18]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Categoria *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#FE3A18]"
                    >
                      <option value="Tutoriais & Guia">Tutoriais & Guia</option>
                      <option value="Novidades da Plataforma">Novidades da Plataforma</option>
                      <option value="Dicas de Conversão">Dicas de Conversão</option>
                      <option value="Atualização do Algoritmo">Atualização do Algoritmo</option>
                      <option value="Comunicado Geral">Comunicado Geral</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Duração (mm:ss)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 05:20"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FE3A18]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    URL do Vídeo (YouTube, Vimeo ou MP4)
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FE3A18]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Imagem de Capa (Thumbnail URL)
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={newThumbnail}
                    onChange={(e) => setNewThumbnail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FE3A18]"
                  />
                  {/* Preset Buttons */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-[10px] text-slate-400">Presets:</span>
                    <button
                      type="button"
                      onClick={() => setNewThumbnail('https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80')}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    >
                      Dashboard & Tech
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewThumbnail('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80')}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    >
                      Vendas & Reunião
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewThumbnail('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80')}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    >
                      Métricas & Gráficos
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Descrição do Vídeo
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Resuma os principais aprendizados deste vídeo para os lojistas..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FE3A18] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Tópico Chave 1
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Como configurar o WhatsApp Business"
                      value={newTakeaway1}
                      onChange={(e) => setNewTakeaway1(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FE3A18]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Tópico Chave 2
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Dica de ouro para aumentar o CTR"
                      value={newTakeaway2}
                      onChange={(e) => setNewTakeaway2(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FE3A18]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-extrabold text-xs shadow-lg shadow-[#FE3A18]/30 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publicar no Spotlight (+150 XP)</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cinema / Fullscreen Modal */}
      <AnimatePresence>
        {showCinemaModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#FE3A18]">
                    Modo Cinema • GuiaPonto
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white">{activeVideo.title}</h4>
                </div>
                <button
                  onClick={() => setShowCinemaModal(false)}
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Player Area */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                <img
                  src={activeVideo.thumbnail}
                  alt={activeVideo.title}
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-[#FE3A18] text-white flex items-center justify-center shadow-2xl animate-pulse">
                    <Play className="w-10 h-10 fill-white ml-1" />
                  </div>
                  <span className="text-xs uppercase font-black tracking-wider text-emerald-400">
                    Transmissão Oficial em Alta Definição
                  </span>
                  <p className="text-xs text-slate-300 max-w-md">
                    {activeVideo.description}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">Autor: <strong className="text-white">{activeVideo.author}</strong></span>
                  <span className="text-xs text-slate-400">• Duração: <strong className="text-white">{activeVideo.duration}</strong></span>
                </div>
                <button
                  onClick={() => setShowCinemaModal(false)}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                >
                  Fechar Modo Cinema
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
