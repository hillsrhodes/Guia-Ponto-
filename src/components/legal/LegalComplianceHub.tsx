/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Cookie,
  FileText,
  Lock,
  CheckCircle2,
  X,
  Sliders,
  MapPin,
  BarChart3,
  Megaphone,
  Scale,
  UserCheck,
  Mail,
  Printer,
  Check,
  AlertCircle,
  Sparkles,
  Building2,
  ChevronRight
} from 'lucide-react';

export type LegalTabType = 'privacy' | 'terms' | 'cookies';

export interface CookiePreferences {
  essential: boolean;
  geolocation: boolean;
  analytics: boolean;
  marketing: boolean;
  consentedAt: string;
}

const COOKIE_STORAGE_KEY = 'guiaponto_lgpd_cookies_v1';

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  geolocation: true,
  analytics: true,
  marketing: true,
  consentedAt: ''
};

export function getStoredCookiePreferences(): CookiePreferences | null {
  try {
    const raw = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookiePreferences;
  } catch {
    return null;
  }
}

export function saveStoredCookiePreferences(prefs: CookiePreferences): void {
  try {
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage errors in restricted environments
  }
}

interface CookieConsentBannerProps {
  onOpenLegalModal: (tab: LegalTabType) => void;
}

export function CookieConsentBanner({ onOpenLegalModal }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showQuickCustomize, setShowQuickCustomize] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    essential: true,
    geolocation: true,
    analytics: true,
    marketing: false,
    consentedAt: ''
  });

  useEffect(() => {
    const stored = getStoredCookiePreferences();
    if (!stored) {
      setIsVisible(true);
    } else {
      setPrefs(stored);
    }

    const handleStorageUpdate = () => {
      const updated = getStoredCookiePreferences();
      if (updated) {
        setPrefs(updated);
        setIsVisible(false);
      }
    };

    window.addEventListener('guiaponto-cookies-updated', handleStorageUpdate);
    return () => window.removeEventListener('guiaponto-cookies-updated', handleStorageUpdate);
  }, []);

  const handleAcceptAll = () => {
    const updated: CookiePreferences = {
      essential: true,
      geolocation: true,
      analytics: true,
      marketing: true,
      consentedAt: new Date().toLocaleString('pt-BR')
    };
    saveStoredCookiePreferences(updated);
    setPrefs(updated);
    setIsVisible(false);
    window.dispatchEvent(new Event('guiaponto-cookies-updated'));
  };

  const handleRejectNonEssential = () => {
    const updated: CookiePreferences = {
      essential: true,
      geolocation: false,
      analytics: false,
      marketing: false,
      consentedAt: new Date().toLocaleString('pt-BR')
    };
    saveStoredCookiePreferences(updated);
    setPrefs(updated);
    setIsVisible(false);
    window.dispatchEvent(new Event('guiaponto-cookies-updated'));
  };

  const handleSaveCustom = () => {
    const updated: CookiePreferences = {
      ...prefs,
      essential: true,
      consentedAt: new Date().toLocaleString('pt-BR')
    };
    saveStoredCookiePreferences(updated);
    setPrefs(updated);
    setIsVisible(false);
    window.dispatchEvent(new Event('guiaponto-cookies-updated'));
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 28 }}
        className="fixed bottom-3 left-0 right-0 z-[90] pointer-events-none"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md text-slate-800 border border-slate-200/90 rounded-2xl px-4 py-3.5 sm:px-6 sm:py-4 shadow-xl shadow-slate-900/10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left: Clean Icon + Concise Copy */}
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#FE3A18]/10 border border-[#FE3A18]/20 flex items-center justify-center text-[#FE3A18] shrink-0">
                  <Cookie className="w-4 h-4" />
                </div>

                <div className="space-y-0.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      Cookies & Privacidade (LGPD)
                    </span>
                    <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      Sorocaba & Região
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Usamos cookies essenciais e de geolocalização local para exibir empresas próximas em Sorocaba. Consulte nossa{' '}
                    <button
                      type="button"
                      onClick={() => onOpenLegalModal('cookies')}
                      className="text-[#FE3A18] hover:underline font-bold cursor-pointer"
                    >
                      Política de Cookies
                    </button>
                    ,{' '}
                    <button
                      type="button"
                      onClick={() => onOpenLegalModal('privacy')}
                      className="text-slate-900 hover:text-[#FE3A18] hover:underline font-bold cursor-pointer"
                    >
                      Privacidade
                    </button>{' '}
                    e{' '}
                    <button
                      type="button"
                      onClick={() => onOpenLegalModal('terms')}
                      className="text-slate-900 hover:text-[#FE3A18] hover:underline font-bold cursor-pointer"
                    >
                      Termos de Uso
                    </button>
                    .
                  </p>
                </div>
              </div>

              {/* Right: Clean Action Buttons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowQuickCustomize(!showQuickCustomize)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#FE3A18]" />
                  <span>{showQuickCustomize ? 'Ocultar' : 'Preferências'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Apenas Essenciais
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-2 rounded-xl bg-[#FE3A18] hover:bg-[#e03212] text-white font-extrabold text-xs shadow-sm shadow-[#FE3A18]/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Aceitar Cookies</span>
                </button>
              </div>
            </div>

            {/* Expandable Quick Granular Controls (Clean White/Light Theme) */}
            <AnimatePresence>
              {showQuickCustomize && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3.5 pt-3.5 border-t border-slate-200/80 overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-emerald-600" />
                          Essenciais
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Sempre Ativo
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Segurança, sessão e registro de consentimento LGPD.
                      </p>
                    </div>

                    <label className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between gap-1.5 cursor-pointer hover:border-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#FE3A18]" />
                          Geolocalização Sorocaba
                        </span>
                        <input
                          type="checkbox"
                          checked={prefs.geolocation}
                          onChange={(e) => setPrefs({ ...prefs, geolocation: e.target.checked })}
                          className="h-4 w-4 accent-[#FE3A18] rounded cursor-pointer"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Memoriza seu bairro/cidade na região e raio em KM.
                      </p>
                    </label>

                    <label className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between gap-1.5 cursor-pointer hover:border-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                          Analíticos & Desempenho
                        </span>
                        <input
                          type="checkbox"
                          checked={prefs.analytics}
                          onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                          className="h-4 w-4 accent-[#FE3A18] rounded cursor-pointer"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Métricas anônimas para melhorar as buscas locais.
                      </p>
                    </label>

                    <label className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between gap-1.5 cursor-pointer hover:border-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                          <Megaphone className="w-3.5 h-3.5 text-amber-600" />
                          Marketing & Ofertas
                        </span>
                        <input
                          type="checkbox"
                          checked={prefs.marketing}
                          onChange={(e) => setPrefs({ ...prefs, marketing: e.target.checked })}
                          className="h-4 w-4 accent-[#FE3A18] rounded cursor-pointer"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Cupons promocionais e leitura de QR Codes locais.
                      </p>
                    </label>
                  </div>

                  <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenLegalModal('cookies')}
                      className="text-xs text-slate-600 hover:text-[#FE3A18] underline cursor-pointer"
                    >
                      Ver detalhes técnicos de Cookies e prazos de retenção →
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveCustom}
                      className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors cursor-pointer"
                    >
                      Salvar Minhas Escolhas
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface LegalCenterModalProps {
  activeTab: LegalTabType | null;
  onClose: () => void;
  onChangeTab: (tab: LegalTabType) => void;
}

export function LegalCenterModal({ activeTab, onClose, onChangeTab }: LegalCenterModalProps) {
  const [cookiePrefs, setCookiePrefs] = useState<CookiePreferences>(() => {
    return getStoredCookiePreferences() || DEFAULT_PREFERENCES;
  });
  const [savedToast, setSavedToast] = useState<string | null>(null);

  // LGPD Data Subject Request Form State
  const [dpoName, setDpoName] = useState('');
  const [dpoEmail, setDpoEmail] = useState('');
  const [dpoRequestType, setDpoRequestType] = useState('Relatório de Dados Pessoais (Art. 18 LGPD)');
  const [dpoMessage, setDpoMessage] = useState('');
  const [dpoSubmitted, setDpoSubmitted] = useState(false);

  useEffect(() => {
    if (activeTab) {
      const current = getStoredCookiePreferences();
      if (current) setCookiePrefs(current);
    }
  }, [activeTab]);

  if (!activeTab) return null;

  const handleSaveModalCookies = (override?: Partial<CookiePreferences>) => {
    const nextPrefs: CookiePreferences = {
      ...cookiePrefs,
      ...override,
      essential: true,
      consentedAt: new Date().toLocaleString('pt-BR')
    };
    setCookiePrefs(nextPrefs);
    saveStoredCookiePreferences(nextPrefs);
    window.dispatchEvent(new Event('guiaponto-cookies-updated'));
    setSavedToast('Preferências de Cookies e Privacidade salvas com sucesso!');
    setTimeout(() => setSavedToast(null), 4000);
  };

  const handleDpoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dpoName.trim() || !dpoEmail.trim()) return;
    setDpoSubmitted(true);
    setTimeout(() => {
      setDpoName('');
      setDpoEmail('');
      setDpoMessage('');
    }, 300);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Modal Header */}
          <div className="bg-slate-950 text-white px-6 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 shrink-0">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FE3A18]/20 border border-[#FE3A18]/40 text-orange-300 text-[11px] font-black uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FE3A18]" />
                <span>Central de Transparência, Conformidade Legal & LGPD</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                GuiaPonto Sorocaba & Região — Documentos Oficiais
              </h2>
              <p className="text-xs text-slate-400">
                Última atualização: 13 de Novembro de 2026 • Em conformidade com a Lei nº 13.709/2018 (LGPD) e Marco Civil da Internet (Lei nº 12.965/2014)
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Imprimir ou Salvar em PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Imprimir / PDF</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Fechar modal jurídico"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-slate-100 px-4 sm:px-8 py-3 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
            <button
              type="button"
              onClick={() => onChangeTab('privacy')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm inline-flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-[#FE3A18] text-white shadow-md shadow-[#FE3A18]/20'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Política de Privacidade (LGPD)</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeTab('terms')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm inline-flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-[#FE3A18] text-white shadow-md shadow-[#FE3A18]/20'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Termos e Condições de Uso</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeTab('cookies')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm inline-flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'cookies'
                  ? 'bg-[#FE3A18] text-white shadow-md shadow-[#FE3A18]/20'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Cookie className="w-4 h-4" />
              <span>Política & Gestão de Cookies</span>
            </button>
          </div>

          {/* Toast Feedback inside Modal */}
          <AnimatePresence>
            {savedToast && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 flex items-center justify-between text-emerald-900 text-xs sm:text-sm font-bold shrink-0"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{savedToast}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSavedToast(null)}
                  className="text-emerald-700 hover:text-emerald-950"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal Body Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-slate-700 leading-relaxed">
            {/* ================= TAB 1: POLÍTICA DE PRIVACIDADE (LGPD) ================= */}
            {activeTab === 'privacy' && (
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-orange-300">
                      Proteção de Dados Pessoais • Sorocaba/SP
                    </span>
                    <h3 className="text-lg sm:text-xl font-black">
                      Política de Privacidade e Tratamento de Dados (LGPD)
                    </h3>
                    <p className="text-xs text-slate-300 max-w-2xl">
                      Este documento detalha como o GuiaPonto coleta, utiliza, armazena e protege os dados pessoais de consumidores visitantes e empresas anunciantes na Região Metropolitana de Sorocaba.
                    </p>
                  </div>
                  <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-xs shrink-0">
                    <div className="font-bold text-white">Controlador de Dados</div>
                    <div className="text-slate-300">GuiaPonto Tecnologia Local Ltda.</div>
                    <div className="text-emerald-300 font-semibold mt-0.5">Foro: Sorocaba - SP</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FE3A18] flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-black text-slate-900">1. Geolocalização Local Segura</h4>
                    <p className="text-xs text-slate-600">
                      Quando você utiliza o seletor "Perto de Mim em Sorocaba", sua coordenada GPS é processada localmente no navegador via fórmula de Haversine para calcular a distância em KM até as empresas, sem histórico de deslocamento contínuo.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-black text-slate-900">2. Conexão Direta via WhatsApp</h4>
                    <p className="text-xs text-slate-600">
                      Ao solicitar orçamento, cupom ou clicar no botão de WhatsApp de uma empresa anunciante, seus dados de contato informados são encaminhados exclusivamente à empresa escolhida para atendimento comercial.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-black text-slate-900">3. Inteligência Artificial Ética</h4>
                    <p className="text-xs text-slate-600">
                      Recursos de IA (como otimização de anúncios e rascunhos de Auto-Follow-up no CRM) auxiliam o lojista a responder com agilidade, sempre mediante revisão do anunciante e sem venda de dados a terceiros.
                    </p>
                  </div>
                </div>

                <div className="space-y-5 text-xs sm:text-sm">
                  <section className="space-y-2">
                    <h4 className="text-base font-black text-slate-900">
                      1. Dados Coletados e Finalidades Legais (Art. 7º da LGPD)
                    </h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                      <li>
                        <strong className="text-slate-900">Visitantes e Consumidores:</strong> Coletamos termos de busca, bairro/cidade de preferência em Sorocaba e região (ex.: Campolim, Centro, Votorantim, Itu) e, mediante sua ação voluntária em formulários de orçamento ou resgate de cupons, nome, telefone/WhatsApp e e-mail (Base Legal: <em>Consentimento</em> e <em>Procedimentos Preliminares a Contrato</em>).
                      </li>
                      <li>
                        <strong className="text-slate-900">Empresas Anunciantes (Parceiros GuiaPonto):</strong> Coletamos Razão Social/Nome Fantasia, CNPJ, endereço comercial em Sorocaba e região, telefone, fotos da galeria, vídeos e métricas de desempenho dos anúncios para verificação do selo <em>"Verificado Sorocaba"</em> e execução do contrato de publicidade digital.
                      </li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-base font-black text-slate-900">
                      2. Compartilhamento e Retenção de Dados
                    </h4>
                    <p className="text-slate-600">
                      O GuiaPonto <strong>jamais comercializa listas de dados pessoais</strong>. Os leads gerados nas páginas individuais (Landing Pages) das empresas são disponibilizados unicamente ao respectivo estabelecimento anunciante. Dados analíticos são mantidos de forma agregada e anonimizada pelo período necessário ao cumprimento de obrigações legais (Art. 15 do Marco Civil da Internet — 6 meses para registros de aplicação).
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-base font-black text-slate-900">
                      3. Direitos do Titular de Dados (Art. 18 da LGPD)
                    </h4>
                    <p className="text-slate-600">
                      A qualquer momento, você pode solicitar gratuitamente ao nosso Encarregado de Proteção de Dados (DPO): (i) confirmação da existência de tratamento; (ii) acesso aos dados; (iii) correção de dados incompletos ou desatualizados; (iv) anonimização, bloqueio ou eliminação de dados desnecessários; e (v) revogação do consentimento de cookies e comunicações de marketing.
                    </p>
                  </section>
                </div>

                {/* Interactive DPO Request Form */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#FE3A18]" />
                        <span>Canal Direto com o Encarregado de Dados (DPO LGPD)</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Exerça seus direitos previstos no Art. 18 da LGPD ou tire dúvidas sobre privacidade: dpo@guiaponto.com.br
                      </p>
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 self-start sm:self-auto">
                      Prazo de Resposta: até 48h úteis
                    </span>
                  </div>

                  {dpoSubmitted ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-emerald-900 text-xs sm:text-sm font-bold">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>
                          Solicitação LGPD registrada com sucesso! Nosso Encarregado de Dados (DPO) enviará o protocolo para o seu e-mail.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDpoSubmitted(false)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-xs font-bold text-emerald-800 cursor-pointer"
                      >
                        Nova Solicitação
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleDpoSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Seu nome completo"
                        value={dpoName}
                        onChange={(e) => setDpoName(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#FE3A18]"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Seu e-mail de cadastro/contato"
                        value={dpoEmail}
                        onChange={(e) => setDpoEmail(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#FE3A18]"
                      />
                      <select
                        value={dpoRequestType}
                        onChange={(e) => setDpoRequestType(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FE3A18]"
                      >
                        <option value="Relatório de Dados Pessoais (Art. 18 LGPD)">Acesso / Relatório de Dados (Art. 18)</option>
                        <option value="Exclusão de Lead / Contato">Exclusão de Dados / Esquecimento</option>
                        <option value="Revogação de Consentimento de Marketing">Revogação de Marketing / Newsletter</option>
                        <option value="Dúvida Jurídica / DPO">Dúvida Geral ao DPO</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Detalhes adicionais da solicitação (opcional)..."
                        value={dpoMessage}
                        onChange={(e) => setDpoMessage(e.target.value)}
                        className="sm:col-span-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#FE3A18]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-colors cursor-pointer"
                      >
                        Enviar Protocolo LGPD
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* ================= TAB 2: TERMOS DE USO ================= */}
            {activeTab === 'terms' && (
              <div className="space-y-7 text-xs sm:text-sm">
                <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-orange-300">
                      Regras da Plataforma • Consumidores e Anunciantes
                    </span>
                    <h3 className="text-lg sm:text-xl font-black">
                      Termos e Condições Gerais de Uso do GuiaPonto
                    </h3>
                    <p className="text-xs text-slate-300 max-w-2xl">
                      Ao navegar no diretório, escanear QR Codes de empresas parceiras ou contratar planos de destaque publicitário em Sorocaba e região, você concorda com as disposições abaixo.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-300 shrink-0">
                    <Scale className="w-4 h-4" />
                    <span>Jurisdição: Comarca de Sorocaba/SP</span>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#FE3A18]" />
                      <span>1. Objeto da Plataforma e Diretório Regional</span>
                    </h4>
                    <p className="text-slate-600">
                      O <strong>GuiaPonto</strong> é uma plataforma de tecnologia publicitária, diretório comercial interativo com busca AJAX e gerador de Landing Pages corporativas voltado prioritariamente a empresas estabelecidas em <strong>Sorocaba e Região Metropolitana (Votorantim, Itu, Salto, Araçoiaba da Serra, Boituva e Porto Feliz)</strong>. O GuiaPonto atua como vitrine tecnológica e ponte de contato via WhatsApp, não participando como intermediário financeiro nas transações comerciais entre consumidores e estabelecimentos.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>2. Cadastro de Empresas e Selo "Verificado Sorocaba"</span>
                    </h4>
                    <p className="text-slate-600">
                      As empresas anunciantes são integralmente responsáveis pela veracidade das informações cadastradas (CNPJ, endereço físico, horário de funcionamento, galeria de fotos, serviços, preços e cupons promocionais). O selo <strong>"Verificado Sorocaba"</strong> atesta que a empresa possui presença local ativa na região de Sorocaba e dados cadastrais validados pela equipe GuiaPonto.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>3. Uso das Ferramentas de Inteligência Artificial e QR Codes</span>
                    </h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                      <li>
                        <strong>Criador de Anúncios IA (Cacilda IA) e Otimizador de Horários:</strong> As sugestões de títulos, descrições de SEO local, tendências de mercado em Sorocaba e agendamentos em horários de pico são geradas por algoritmos de apoio à decisão, cabendo ao anunciante aprovar o conteúdo antes da publicação.
                      </li>
                      <li>
                        <strong>Auto-Follow-up IA no CRM:</strong> Os rascunhos automáticos de e-mail por categoria visam acelerar o atendimento ao lead; o lojista compromete-se a utilizá-los em conformidade com as boas práticas anti-spam e respeito ao consumidor.
                      </li>
                      <li>
                        <strong>Compartilhamento via QR Code de Balcão:</strong> Os códigos QR gerados no modo administrador direcionam exclusivamente ao perfil público oficial da empresa dentro do GuiaPonto Sorocaba.
                      </li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="text-base font-black text-slate-900">
                      4. Propriedade Intelectual e Limitação de Responsabilidade
                    </h4>
                    <p className="text-slate-600">
                      A marca GuiaPonto, o layout do sistema, os algoritmos de ranqueamento por proximidade e o código-fonte são protegidos pela legislação brasileira de Propriedade Intelectual. Eventuais vícios na prestação de serviços ou produtos adquiridos diretamente junto às empresas anunciantes devem ser tratados diretamente com o respectivo estabelecimento fornecedor, nos termos do Código de Defesa do Consumidor.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: POLÍTICA E GESTÃO DE COOKIES ================= */}
            {activeTab === 'cookies' && (
              <div className="space-y-7">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-orange-300">
                      Controle Granular de Consentimento
                    </span>
                    <h3 className="text-lg sm:text-xl font-black">
                      Política de Cookies e Armazenamento Local
                    </h3>
                    <p className="text-xs text-slate-300 max-w-2xl">
                      Gerencie abaixo quais categorias de cookies você autoriza no navegador. Suas preferências ficam registradas localmente e podem ser alteradas a qualquer instante.
                    </p>
                  </div>

                  {cookiePrefs.consentedAt && (
                    <div className="bg-emerald-500/15 border border-emerald-400/30 rounded-xl px-4 py-2.5 text-xs text-emerald-200 shrink-0">
                      <div className="font-bold">Consentimento Ativo</div>
                      <div className="text-[11px] opacity-90">Atualizado em: {cookiePrefs.consentedAt}</div>
                    </div>
                  )}
                </div>

                {/* Interactive Cookie Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category 1 */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-900 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-emerald-600" />
                          1. Cookies Estritamente Necessários
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
                          Obrigatórios
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Indispensáveis para o funcionamento do site, autenticação segura do painel executivo, navegação entre páginas das empresas e armazenamento da sua escolha de privacidade LGPD.
                      </p>
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold border-t border-slate-200 pt-2.5">
                      Exemplos: <code>guiaponto_lgpd_cookies_v1</code>, <code>guiaponto_auth_session</code>
                    </div>
                  </div>

                  {/* Category 2 */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between gap-4 shadow-xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-900 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#FE3A18]" />
                          2. Cookies de Geolocalização Regional
                        </span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={cookiePrefs.geolocation}
                          onClick={() => setCookiePrefs(p => ({ ...p, geolocation: !p.geolocation }))}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                            cookiePrefs.geolocation ? 'bg-[#FE3A18]' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                              cookiePrefs.geolocation ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-xs text-slate-600">
                        Permitem memorizar a localização selecionada em Sorocaba e arredores (ex.: Campolim, Centro, Votorantim) e o raio de alcance (5km a 50km) para exibir empresas próximas sem precisar reconfigurar a cada visita.
                      </p>
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold border-t border-slate-100 pt-2.5">
                      Exemplos: <code>guiaponto_sorocaba_hub</code>, <code>guiaponto_radius_km</code>
                    </div>
                  </div>

                  {/* Category 3 */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between gap-4 shadow-xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-900 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-indigo-600" />
                          3. Cookies Analíticos e de Desempenho
                        </span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={cookiePrefs.analytics}
                          onClick={() => setCookiePrefs(p => ({ ...p, analytics: !p.analytics }))}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                            cookiePrefs.analytics ? 'bg-[#FE3A18]' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                              cookiePrefs.analytics ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-xs text-slate-600">
                        Contabilizam impressões e cliques em anúncios, horários de maior tráfego em Sorocaba e buscas mais populares, gerando relatórios estatísticos agregados para os comerciantes locais.
                      </p>
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold border-t border-slate-100 pt-2.5">
                      Exemplos: <code>guiaponto_ad_metrics</code>, <code>guiaponto_peak_heatmap</code>
                    </div>
                  </div>

                  {/* Category 4 */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between gap-4 shadow-xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-900 flex items-center gap-2">
                          <Megaphone className="w-4 h-4 text-amber-600" />
                          4. Cookies de Marketing, Cupons e QR Code
                        </span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={cookiePrefs.marketing}
                          onClick={() => setCookiePrefs(p => ({ ...p, marketing: !p.marketing }))}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                            cookiePrefs.marketing ? 'bg-[#FE3A18]' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                              cookiePrefs.marketing ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-xs text-slate-600">
                        Identificam acessos originados por QR Codes físicos nos estabelecimentos de Sorocaba (<code>?empresa=</code>) e habilitam cupons promocionais exclusivos nas Landing Pages das empresas.
                      </p>
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold border-t border-slate-100 pt-2.5">
                      Exemplos: <code>guiaponto_qr_scan_ref</code>, <code>guiaponto_coupon_wallet</code>
                    </div>
                  </div>
                </div>

                {/* Detailed Technical Cookie Inventory Table */}
                <div className="space-y-3">
                  <h4 className="text-sm font-black text-slate-900">
                    Inventário Técnico de Cookies Utilizados na Plataforma
                  </h4>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase">
                          <th className="py-3 px-4">Nome do Cookie / Chave</th>
                          <th className="py-3 px-4">Categoria</th>
                          <th className="py-3 px-4">Finalidade Específica</th>
                          <th className="py-3 px-4">Duração</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        <tr>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">guiaponto_lgpd_cookies_v1</td>
                          <td className="py-3 px-4">Essencial</td>
                          <td className="py-3 px-4">Armazena o registro de consentimento LGPD do usuário</td>
                          <td className="py-3 px-4">12 meses</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">guiaponto_sorocaba_hub</td>
                          <td className="py-3 px-4">Geolocalização</td>
                          <td className="py-3 px-4">Guarda o ponto de referência em Sorocaba/RMS e raio KM</td>
                          <td className="py-3 px-4">30 dias</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">guiaponto_ad_metrics</td>
                          <td className="py-3 px-4">Analítico</td>
                          <td className="py-3 px-4">Métricas agregadas de cliques e visualizações de anúncios</td>
                          <td className="py-3 px-4">90 dias</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">guiaponto_qr_scan_ref</td>
                          <td className="py-3 px-4">Marketing</td>
                          <td className="py-3 px-4">Atribuição de visita via QR Code de balcão e liberação de cupom</td>
                          <td className="py-3 px-4">14 dias</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleSaveModalCookies({
                        geolocation: false,
                        analytics: false,
                        marketing: false
                      })
                    }
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Manter Apenas Essenciais
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSaveModalCookies({
                        geolocation: true,
                        analytics: true,
                        marketing: true
                      })
                    }
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Ativar Todos os Cookies
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveModalCookies()}
                    className="px-6 py-2.5 rounded-xl bg-[#FE3A18] hover:bg-[#e03212] text-white font-black text-xs shadow-md shadow-[#FE3A18]/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Salvar Minhas Preferências</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
