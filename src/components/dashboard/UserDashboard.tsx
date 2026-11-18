/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, MessageSquare, QrCode, Copy, CheckCircle2, ArrowUpRight, RefreshCw, Layers, ShieldCheck, Share2, LogOut, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { WhatsAppConversionChartsPanel } from './WhatsAppConversionChartsPanel';
import { BusinessAnalyticsDashboard } from './BusinessAnalyticsDashboard';

interface UserDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  publishedAd: any;
}

export function UserDashboard({ isOpen, onClose, publishedAd }: UserDashboardProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'cacilda' | 'versions'>('overview');
  
  const [analyticsData] = useState([
    { month: 'Jun', impressions: 3200, clicks: 180, ctr: 5.6 },
    { month: 'Jul', impressions: 4100, clicks: 240, ctr: 5.8 },
    { month: 'Ago', impressions: 5300, clicks: 310, ctr: 5.8 },
    { month: 'Set', impressions: 6800, clicks: 420, ctr: 6.2 },
    { month: 'Out', impressions: 8400, clicks: 510, ctr: 6.1 },
    { month: 'Nov', impressions: 10200, clicks: 680, ctr: 6.7 },
  ]);

  const [versions, setVersions] = useState([
    { id: 1, name: 'Versão 1 — Oferta Padrão', status: 'Ativo', date: 'Hoje' },
    { id: 2, name: 'Versão 2 — Campanha Black Friday', status: 'Rascunho', date: 'Agendado' },
  ]);
  const [cacildaMessage, setCacildaMessage] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'cacilda', text: 'Seu anúncio está rodando lindo! Quer preparar uma versão para o Natal ou Black Friday?' }
  ]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText('https://www.guiaponto.com.br/anuncio/sabor-e-fogo');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCacildaChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cacildaMessage.trim()) return;

    const newLog = [...chatLog, { sender: 'user' as const, text: cacildaMessage }];
    setChatLog(newLog);
    setCacildaMessage('');

    setTimeout(() => {
      setChatLog([
        ...newLog,
        { sender: 'cacilda', text: 'Com certeza! Já criei uma nova versão com essa alteração. Você pode revisá-la na aba "Versões do Anúncio".' }
      ]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden relative flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-slate-900 p-6 sm:p-8 text-white relative shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FE3A18] text-white flex items-center justify-center shadow-lg font-black text-xl">
              GP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold bg-[#FE3A18]/20 text-[#FE3A18] px-2.5 py-0.5 rounded-full">
                  Painel do Anunciante
                </span>
                <span className="text-xs text-slate-400">GuiaPonto IA</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mt-1">
                {publishedAd?.title || 'Restaurante Sabor & Fogo'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair do Painel</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 px-6 sm:px-8 py-2.5 border-b border-slate-200 flex items-center gap-3 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview' ? 'bg-white text-[#FE3A18] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Visão Geral & Métricas
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'analytics' ? 'bg-white text-[#FE3A18] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-[#FE3A18]" />
            Performance Analytics
          </button>
          <button
            onClick={() => setActiveTab('cacilda')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cacilda' ? 'bg-white text-[#FE3A18] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FE3A18]" />
            Conversar com Cacilda (IA)
          </button>
          <button
            onClick={() => setActiveTab('versions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'versions' ? 'bg-white text-[#FE3A18] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Versões do Anúncio (Campanhas)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-50">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recharts Visual Analytics Panel */}
              <WhatsAppConversionChartsPanel
                businessName={publishedAd?.title || 'Restaurante Sabor & Fogo'}
                compact
              />

              {/* Share & QR Code section */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-4">
                  <h4 className="text-lg font-bold text-slate-900">Compartilhe sua Vitrine Digital</h4>
                  <p className="text-sm text-slate-600">
                    Copie o link público do seu anúncio para colocar na bio das suas redes sociais ou utilize o QR Code para materiais impressos e cartões de visita.
                  </p>

                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-3">
                    <span className="text-sm font-medium text-slate-700 truncate flex-1 pl-2">
                      https://www.guiaponto.com.br/anuncio/sabor-e-fogo
                    </span>
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2.5 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
                    </button>
                  </div>
                </div>

                <div className="md:col-span-4 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                  <div className="w-28 h-28 bg-white border border-slate-300 rounded-xl p-2 shadow-inner flex items-center justify-center mb-3">
                    <QrCode className="w-24 h-24 text-slate-900" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">QR Code Oficial</span>
                  <span className="text-[10px] text-slate-400">Baixar para impressão</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PERFORMANCE ANALYTICS (RECHARTS) */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <BusinessAnalyticsDashboard
                businessName={publishedAd?.title || 'Restaurante Sabor & Fogo'}
              />
            </div>
          )}

          {/* TAB 3: CACILDA CHAT */}
          {activeTab === 'cacilda' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col h-[450px]">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#FE3A18] text-white flex items-center justify-center font-bold">
                  C
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Cacilda — Agente Contínuo de IA</h4>
                  <p className="text-xs text-slate-500">Converse para atualizar preços, criar ofertas de Natal/Black Friday ou otimizar SEO.</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
                {chatLog.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 text-sm ${msg.sender === 'user' ? 'bg-[#FE3A18] text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleCacildaChat} className="flex gap-3 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="Ex: Cacilda, quero preparar meu anúncio para o Natal..."
                  value={cacildaMessage}
                  onChange={(e) => setCacildaMessage(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#FE3A18] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  Enviar
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: VERSIONS */}
          {activeTab === 'versions' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Versionamento de Campanhas</h4>
                  <p className="text-xs text-slate-500">Mantenha a URL principal e altere ofertas sazonais facilmente.</p>
                </div>
                <button
                  onClick={() => setVersions([...versions, { id: versions.length + 1, name: `Versão ${versions.length + 1} — Sazonal`, status: 'Rascunho', date: 'Agora' }])}
                  className="px-4 py-2.5 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  + Criar Nova Versão c/ Cacilda
                </button>
              </div>

              <div className="space-y-3">
                {versions.map((ver) => (
                  <div key={ver.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50">
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">{ver.name}</h5>
                      <span className="text-xs text-slate-500">Criado em: {ver.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${ver.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                        {ver.status}
                      </span>
                      <button className="text-xs font-bold text-[#FE3A18] hover:underline cursor-pointer">Restaurar / Editar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
