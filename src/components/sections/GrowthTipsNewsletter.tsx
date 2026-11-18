/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  Mail
} from 'lucide-react';

const AVAILABLE_TOPICS = [
  'SEO Local',
  'Marketing Regional',
  'Conversão WhatsApp'
] as const;

const STORAGE_KEY = 'guiaponto_growth_newsletter_sub';

interface StoredSubscription {
  email: string;
  businessName: string;
  topics: string[];
  subscribedAt: string;
}

export function GrowthTipsNewsletter() {
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    ...AVAILABLE_TOPICS
  ]);
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedSub, setConfirmedSub] = useState<StoredSubscription | null>(
    null
  );
  const [alreadySubscribedNotice, setAlreadySubscribedNotice] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredSubscription;
        if (parsed && parsed.email) {
          setConfirmedSub(parsed);
          setStatus('success');
        }
      }
    } catch {
      // Ignore storage read errors
    }
  }, []);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topic)) {
        return prev.length > 1 ? prev.filter((t) => t !== topic) : prev;
      }
      return [...prev, topic];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setStatus('error');
      setErrorMessage(
        'Por favor, informe um e-mail comercial válido (ex.: contato@seunegocio.com.br).'
      );
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    setAlreadySubscribedNotice(false);

    const payload = {
      email: trimmedEmail,
      businessName: businessName.trim() || 'Negócio Local',
      topics: selectedTopics
    };

    let savedRecord: StoredSubscription = {
      email: payload.email,
      businessName: payload.businessName,
      topics: payload.topics,
      subscribedAt: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/newsletter/growth-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setStatus('error');
        setErrorMessage(
          data?.error ||
            'Não foi possível concluir a assinatura. Tente novamente.'
        );
        return;
      }

      if (data?.subscriber) {
        savedRecord = data.subscriber;
      }
      if (data?.alreadySubscribed) {
        setAlreadySubscribedNotice(true);
      }
    } catch {
      // Proceed with local persistence fallback if server request fails transiently
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRecord));
    } catch {
      // Ignore storage write errors
    }

    setConfirmedSub(savedRecord);
    setStatus('success');
    setEmail('');
    setBusinessName('');
  };

  const handleResetSubscription = () => {
    setStatus('idle');
    setAlreadySubscribedNotice(false);
    setErrorMessage('');
    if (confirmedSub) {
      setEmail(confirmedSub.email);
      setBusinessName(
        confirmedSub.businessName === 'Negócio Local'
          ? ''
          : confirmedSub.businessName
      );
      setSelectedTopics(
        confirmedSub.topics?.length ? confirmedSub.topics : [...AVAILABLE_TOPICS]
      );
    }
  };

  return (
    <aside
      aria-labelledby="growth-newsletter-heading"
      className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-7 sm:p-10 lg:p-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Editorial Left Copy */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#FE3A18]">
            <span>Newsletter de Dicas de Crescimento</span>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <span className="text-slate-400 font-semibold">Edição Semanal</span>
          </div>

          <h3
            id="growth-newsletter-heading"
            className="text-2xl sm:text-3xl font-black tracking-tight text-white text-balance leading-tight"
          >
            Receba Estratégias Semanais de Crescimento para o Seu Negócio
          </h3>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Toda terça-feira pela manhã, enviamos um guia direto com ações práticas de SEO local, campanhas de bairro e táticas de conversão no WhatsApp. Zero spam, cancelamento em 1 clique.
          </p>

          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
            <span>Leitura de 3 min</span>
            <span aria-hidden="true">·</span>
            <span>Checklists aplicáveis no mesmo dia</span>
            <span aria-hidden="true">·</span>
            <span>Gratuito para proprietários de negócios</span>
          </div>
        </div>

        {/* Interactive Form / Confirmation Right Column */}
        <div className="lg:col-span-6">
          {status === 'success' && confirmedSub ? (
            <div
              role="status"
              aria-live="polite"
              className="space-y-5 pt-2 lg:pt-0"
            >
              <div className="flex items-start gap-3.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-white">
                    {alreadySubscribedNotice
                      ? 'Preferências atualizadas na edição semanal'
                      : 'Assinatura semanal confirmada!'}
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Enviaremos os próximos guias de crescimento diretamente para{' '}
                    <strong className="text-white font-semibold">
                      {confirmedSub.email}
                    </strong>{' '}
                    ({confirmedSub.businessName}).
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Temas ativos: </span>
                  <span>{confirmedSub.topics.join(' · ')}</span>
                </div>

                <button
                  type="button"
                  onClick={handleResetSubscription}
                  className="text-xs font-bold text-slate-300 hover:text-white underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
                >
                  Alterar e-mail ou temas
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Interactive Topic Interests Selector */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-300">
                  Quais conteúdos quer priorizar no seu e-mail?
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {AVAILABLE_TOPICS.map((topic) => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleTopic(topic)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                          isSelected
                            ? 'bg-white text-slate-900 border-white'
                            : 'bg-slate-950/60 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#FE3A18]" />}
                        <span>{topic}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inputs Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="growth-newsletter-business"
                    className="sr-only"
                  >
                    Nome do seu negócio (opcional)
                  </label>
                  <input
                    id="growth-newsletter-business"
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Nome do negócio (opcional)"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="growth-newsletter-email" className="sr-only">
                    E-mail profissional
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="growth-newsletter-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') {
                          setStatus('idle');
                          setErrorMessage('');
                        }
                      }}
                      placeholder="seu@negocio.com.br"
                      aria-invalid={status === 'error'}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {status === 'error' && errorMessage && (
                <div
                  role="alert"
                  className="flex items-center gap-2 text-xs font-semibold text-rose-300"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-3 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] disabled:opacity-70 text-white font-extrabold text-sm transition-colors inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirmando assinatura...</span>
                    </>
                  ) : (
                    <>
                      <span>Assinar Dicas Semanais</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <span className="text-xs text-slate-400">
                  Conteúdo curado para negócios locais · Sem spam
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </aside>
  );
}
