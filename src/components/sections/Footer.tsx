/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Shield, ShieldCheck, ArrowUp, Mail, CheckCircle2, Loader2, Send, AlertCircle, Instagram, Linkedin, Facebook, Cookie, FileText } from 'lucide-react';
import { LegalTabType } from '../legal/LegalComplianceHub';

interface FooterProps {
  onOpenDirectory?: () => void;
  onOpenLegalModal?: (tab: LegalTabType) => void;
  onOpenAdminPanel?: () => void;
}

export function Footer({ onOpenDirectory, onOpenLegalModal, onOpenAdminPanel }: FooterProps = {}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setErrorMessage('Por favor, insira um e-mail válido.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    // Mock API request handler
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Subscription Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-900/80 rounded-3xl p-8 border border-slate-800 shadow-2xl mb-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FE3A18]/20 text-[#FE3A18] text-xs font-bold">
              <Mail className="w-4 h-4" />
              <span>Newsletter GuiaPonto</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Receba dicas de negócios locais e oportunidades em primeira mão
            </h3>
            <p className="text-sm text-slate-400 max-w-xl">
              Inscreva seu e-mail para receber novidades semanais sobre empreendedorismo, SEO local e ofertas exclusivas do GuiaPonto.
            </p>
          </div>

          <div className="w-full lg:w-auto min-w-[320px]">
            {status === 'success' ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-emerald-400 text-sm font-bold">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span>Inscrição realizada com sucesso! Verifique sua caixa de entrada.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    placeholder="Seu melhor e-mail..."
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    className="flex-1 px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FE3A18]"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-6 py-3.5 rounded-2xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-extrabold text-sm shadow-lg shadow-[#FE3A18]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 shrink-0"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Inscrever</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                {status === 'error' && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-400 pl-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info & Social Media */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 rounded-xl bg-white flex items-center justify-center shadow-lg p-2 border border-slate-800">
                <img
                  src="https://www.guiaponto.com.br/images/layout/LOGO%20GUIAPONTO%20COM%20SIMBOLO.png"
                  alt="GuiaPonto"
                  className="h-full w-auto object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              O guia digital que aproxima negócios locais de pessoas que estão procurando exatamente o que você oferece em Sorocaba e região. Sua empresa merece ser encontrada.
            </p>

            {/* Social Media Section */}
            <div className="space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-300">Redes Sociais Oficiais</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/guiaponto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#FE3A18] hover:border-[#FE3A18] hover:scale-110 transition-all duration-300 shadow-md cursor-pointer"
                  title="Instagram GuiaPonto"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com/company/guiaponto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#FE3A18] hover:border-[#FE3A18] hover:scale-110 transition-all duration-300 shadow-md cursor-pointer"
                  title="LinkedIn GuiaPonto"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com/guiaponto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#FE3A18] hover:border-[#FE3A18] hover:scale-110 transition-all duration-300 shadow-md cursor-pointer"
                  title="Facebook GuiaPonto"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Ambiente seguro, verificado e adequado à LGPD</span>
            </div>
          </div>

          {/* Links 1 */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Navegação</h4>
            <ul className="space-y-2 text-sm">
              {onOpenDirectory && (
                <li>
                  <button
                    onClick={onOpenDirectory}
                    className="text-[#FE3A18] hover:text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Diretório de Empresas (AJAX)</span>
                  </button>
                </li>
              )}
              <li><a href="#categorias" className="hover:text-white transition-colors">Categorias</a></li>
              <li><a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a></li>
              <li><a href="#destaques" className="hover:text-white transition-colors">Empresas Destaque</a></li>
              <li><a href="#planos" className="hover:text-white transition-colors">Planos & Preços</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Dúvidas Frequentes</a></li>
              {onOpenAdminPanel && (
                <li className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      onOpenAdminPanel();
                    }}
                    className="text-emerald-400 hover:text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Painel Admin</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Categorias Principais</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">Restaurantes & Gastronomia</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Casa de Repouso & Cuidado</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Imobiliárias & Arquitetura</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Oficinas & Automotivo</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Serviços Profissionais</span></li>
            </ul>
          </div>

          {/* Links 3: Legal & LGPD */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Legal, Privacidade & LGPD</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal?.('terms')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-[#FE3A18] shrink-0" />
                  <span>Termos de Uso</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal?.('privacy')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-left"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Política de Privacidade (LGPD)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal?.('cookies')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-left"
                >
                  <Cookie className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Política de Cookies</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal?.('cookies')}
                  className="mt-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Cookie className="w-3.5 h-3.5 text-[#FE3A18]" />
                  <span>Gerenciar Cookies</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} GuiaPonto Sorocaba & Região. Todos os direitos reservados.</p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400 font-semibold">
              <button
                type="button"
                onClick={() => onOpenLegalModal?.('privacy')}
                className="hover:text-white underline cursor-pointer"
              >
                Privacidade
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => onOpenLegalModal?.('terms')}
                className="hover:text-white underline cursor-pointer"
              >
                Termos de Uso
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => onOpenLegalModal?.('cookies')}
                className="hover:text-white underline cursor-pointer"
              >
                Política de Cookies
              </button>
              {onOpenAdminPanel && (
                <>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      onOpenAdminPanel();
                    }}
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-white underline cursor-pointer font-bold"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Painel Admin</span>
                  </button>
                </>
              )}
            </div>
          </div>
          
          <button
            onClick={scrollToTop}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
