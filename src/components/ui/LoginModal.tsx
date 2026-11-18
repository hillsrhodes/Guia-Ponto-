/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Mail, Lock, ArrowRight, MapPin, ShieldCheck, Building2, Award } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginAdmin?: () => void;
  onLoginContributor?: () => void;
}

export function LoginModal({ isOpen, onClose, onLoginAdmin, onLoginContributor }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'merchant' | 'contributor' | 'admin'>('merchant');
  const [loggedIn, setLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggedIn(true);
    setTimeout(() => {
      setLoggedIn(false);
      if (role === 'admin' && onLoginAdmin) {
        onLoginAdmin();
      } else if (role === 'contributor' && onLoginContributor) {
        onLoginContributor();
      } else {
        onClose();
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative"
      >
        <div className="bg-gradient-to-r from-[#FE3A18] to-rose-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-xl font-black">GuiaPonto</span>
          </div>
          <h3 className="text-2xl font-black">Acesse sua Conta</h3>
          <p className="text-rose-100 text-sm">Escolha o perfil de acesso ao ecossistema Sorocaba.</p>
        </div>

        <div className="p-6">
          {loggedIn ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-[#FE3A18] flex items-center justify-center mx-auto animate-pulse">
                <MapPin className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Login realizado com sucesso!</h4>
              <p className="text-sm text-slate-500">
                {role === 'admin'
                  ? 'Carregando Console Admin Master...'
                  : role === 'contributor'
                  ? 'Abrindo Perfil Contribuidor GuiaPonto (Badges & Níveis)...'
                  : 'Carregando Painel Executivo do Lojista...'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Role Switcher */}
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setRole('merchant')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    role === 'merchant'
                      ? 'bg-white text-[#FE3A18] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Negócios</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('contributor')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    role === 'contributor'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span>Contribuidor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    role === 'admin'
                      ? 'bg-indigo-950 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Admin</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  E-mail
                </label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FE3A18]">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder={role === 'admin' ? 'admin@guiaponto.com.br' : 'seu@email.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Senha
                </label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FE3A18]">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 rounded-xl text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  role === 'admin'
                    ? 'bg-indigo-950 hover:bg-indigo-900 shadow-indigo-950/25'
                    : 'bg-[#FE3A18] hover:bg-[#e33315] shadow-[#FE3A18]/25'
                }`}
              >
                <span>
                  {role === 'admin'
                    ? 'Entrar no Painel Admin Master'
                    : role === 'contributor'
                    ? 'Acessar Perfil de Contribuidor'
                    : 'Entrar no Painel de Negócios'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
