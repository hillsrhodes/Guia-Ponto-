/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, Menu, X, ArrowRight, Building2, User, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenRegisterModal: () => void;
  onOpenLoginModal: () => void;
  onOpenExecutiveDashboard: () => void;
  onOpenDirectory?: () => void;
  activeTab: 'business' | 'consumer';
  setActiveTab: (tab: 'business' | 'consumer') => void;
}

export function Navbar({ onOpenRegisterModal, onOpenLoginModal, onOpenExecutiveDashboard, onOpenDirectory, activeTab, setActiveTab }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 border-b border-slate-200/80 transition-all duration-300 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Logo & Audience Switcher Pills */}
        <div className="flex items-center gap-6 sm:gap-8">
          <a href="https://www.guiaponto.com.br/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group shrink-0">
            <div
              style={{
                borderColor: '#ffffff',
                borderWidth: '0px',
                borderRadius: '0px',
                width: '150px',
                height: '48px',
              }}
              className="bg-white flex items-center justify-center p-1 group-hover:scale-105 transition-transform overflow-hidden"
            >
              <img
                src="https://www.guiaponto.com.br/images/layout/LOGO%20GUIAPONTO%20COM%20SIMBOLO.png"
                alt="GuiaPonto"
                className="h-full w-auto object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </a>

          {/* Audience Switcher Pills (Desktop & Tablet) */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/85 shadow-xs">
            <button
              onClick={() => setActiveTab('business')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'business'
                  ? 'bg-white text-[#FE3A18] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Para Negócios</span>
            </button>
            <button
              onClick={() => setActiveTab('consumer')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'consumer'
                  ? 'bg-white text-[#FE3A18] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Para Pessoas</span>
            </button>
          </div>
        </div>

        {/* Right Action Buttons (Clean & Uncluttered Desktop Nav) */}
        <div className="hidden md:flex items-center gap-3">
          {onOpenDirectory && (
            <button
              onClick={onOpenDirectory}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-extrabold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer hover:border-[#FE3A18]/40 group"
            >
              <Building2 className="w-4 h-4 text-[#FE3A18]" />
              <span>Vitrine de Negócios</span>
            </button>
          )}

          <button
            onClick={onOpenExecutiveDashboard}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-[#FE3A18]" />
            <span>Painel Executivo</span>
          </button>

          <button
            onClick={onOpenLoginModal}
            className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-[#FE3A18] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Entrar</span>
          </button>

          <button
            onClick={onOpenRegisterModal}
            className="px-6 py-3 rounded-2xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-extrabold text-sm shadow-xl shadow-[#FE3A18]/25 hover:shadow-[#FE3A18]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Cadastrar Grátis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger / Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenExecutiveDashboard}
            className="p-2.5 rounded-xl bg-slate-900 text-white shadow-sm flex items-center justify-center"
            title="Painel Executivo"
          >
            <Sparkles className="w-4 h-4 text-[#FE3A18]" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-200 shadow-2xl py-6 px-6 space-y-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-center bg-slate-100 p-1 rounded-full mb-4 border border-slate-200">
            <button
              onClick={() => { setActiveTab('business'); setMobileMenuOpen(false); }}
              className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'business' ? 'bg-white text-[#FE3A18] shadow-sm' : 'text-slate-600'
              }`}
            >
              Para Negócios
            </button>
            <button
              onClick={() => { setActiveTab('consumer'); setMobileMenuOpen(false); }}
              className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'consumer' ? 'bg-white text-[#FE3A18] shadow-sm' : 'text-slate-600'
              }`}
            >
              Para Pessoas
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {onOpenDirectory && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenDirectory(); }}
                className="w-full py-3.5 px-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs hover:border-[#FE3A18]/40"
              >
                <Building2 className="w-4 h-4 text-[#FE3A18]" />
                <span>Diretório de Negócios (Filtro AJAX)</span>
              </button>
            )}

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenExecutiveDashboard(); }}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4 text-[#FE3A18]" />
              <span>Painel Executivo</span>
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenLoginModal(); }}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Entrar na Conta</span>
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenRegisterModal(); }}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#FE3A18] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FE3A18]/30"
            >
              <span>Cadastrar Grátis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
