import React, { useCallback, useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Building2,
  MapPin,
  Phone,
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Briefcase,
  LayoutDashboard,
} from 'lucide-react';
import {
  getOwnerEmailPreferences,
  saveOwnerEmailPreferences,
} from '../../services/notificationService';
import { SmartCategorySuggestion } from './SmartCategorySuggestion';

export interface RegisteredBusinessProfile {
  ownerName: string;
  email: string;
  businessName: string;
  category: string;
  document: string;
  cityRegion: string;
  address: string;
  whatsapp: string;
  openingHours: string;
  description: string;
  createdAt: string;
}

interface RegisterBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteRegistration?: (profile: RegisteredBusinessProfile) => void;
}

const CATEGORIES = [
  'Restaurantes & Gastronomia',
  'Oficinas & Centros Automotivos',
  'Clínicas & Saúde',
  'Salões de Beleza & Barbearias',
  'Imobiliárias & Construção',
  'Pet Shops & Veterinárias',
  'Moda, Calçados & Varejo',
  'Academias & Esportes',
  'Serviços Profissionais & B2B',
  'Educação & Cursos',
];

const SOROCABA_REGIONS = [
  'Campolim - Sorocaba/SP',
  'Centro - Sorocaba/SP',
  'Santa Rosália - Sorocaba/SP',
  'Wanel Ville - Sorocaba/SP',
  'Éden / Zona Industrial - Sorocaba/SP',
  'Vila Hortência - Sorocaba/SP',
  'Jardim Faculdade - Sorocaba/SP',
  'Trujillo / Além Ponte - Sorocaba/SP',
  'Votorantim - Região Metropolitana',
  'Itu / Salto - Região Metropolitana',
];

export const RegisterBusinessModal: React.FC<RegisterBusinessModalProps> = ({
  isOpen,
  onClose,
  onCompleteRegistration,
}) => {
  // Step 1: Simple Entry (Name + Email only)
  // Step 2: Complete Business Registration Form
  // Step 3: Registration Complete Confirmation
  const [step, setStep] = useState<'entry' | 'company_form' | 'completed'>('entry');

  // Step 1 fields
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [step1Error, setStep1Error] = useState('');

  // Step 2 fields
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [document, setDocument] = useState('');
  const [cityRegion, setCityRegion] = useState(SOROCABA_REGIONS[0]);
  const [address, setAddress] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [openingHours, setOpeningHours] = useState('Seg a Sex: 08h às 18h | Sáb: 09h às 13h');
  const [description, setDescription] = useState('');
  const [categoryLockedManually, setCategoryLockedManually] = useState(false);
  const [categorySuggestedByAi, setCategorySuggestedByAi] = useState(false);
  const [autoCategorizeSignal, setAutoCategorizeSignal] = useState(0);
  const [step2Error, setStep2Error] = useState('');
  const [savedProfile, setSavedProfile] = useState<RegisteredBusinessProfile | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('entry');
      setStep1Error('');
      setStep2Error('');
      setCategoryLockedManually(false);
      setCategorySuggestedByAi(false);
      setAutoCategorizeSignal(0);
    }
  }, [isOpen]);

  const handleApplySuggestedCategory = useCallback(
    (suggestedCat: string, source: 'auto' | 'manual_pick') => {
      setCategory(suggestedCat);
      setCategorySuggestedByAi(true);
      if (source === 'manual_pick') {
        setCategoryLockedManually(true);
      }
    },
    []
  );

  if (!isOpen) return null;

  const handleEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = ownerName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setStep1Error('Por favor, informe seu nome para continuar.');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setStep1Error('Por favor, informe um e-mail válido.');
      return;
    }

    setStep1Error('');
    // Persist initial user credentials so lead notifications use their email
    const currentPrefs = getOwnerEmailPreferences();
    saveOwnerEmailPreferences({
      ...currentPrefs,
      ownerEmail: trimmedEmail,
    });

    // Direct user immediately to the Complete Business Profile form (no ad creation)
    setStep('company_form');
  };

  const handleCompanyFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setStep2Error('Informe o nome da sua empresa.');
      return;
    }
    if (!whatsapp.trim()) {
      setStep2Error('Informe o WhatsApp comercial para receber contatos de clientes.');
      return;
    }

    setStep2Error('');

    const profile: RegisteredBusinessProfile = {
      ownerName: ownerName.trim(),
      email: email.trim(),
      businessName: businessName.trim(),
      category,
      document: document.trim(),
      cityRegion,
      address: address.trim() || cityRegion,
      whatsapp: whatsapp.trim(),
      openingHours: openingHours.trim(),
      description:
        description.trim() ||
        `${businessName.trim()} — Atendimento especializado em ${category} na região de ${cityRegion}.`,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('guiaponto_registered_business', JSON.stringify(profile));
    } catch {
      // Ignore storage error
    }

    setSavedProfile(profile);
    setStep('completed');
  };

  const handleGoToDashboard = () => {
    if (savedProfile && onCompleteRegistration) {
      onCompleteRegistration(savedProfile);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Progress Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              {step === 'entry' ? (
                <User className="w-5 h-5" />
              ) : step === 'company_form' ? (
                <Building2 className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
                  {step === 'entry'
                    ? 'Passo 1 de 2 • Acesso Rápido'
                    : step === 'company_form'
                    ? 'Passo 2 de 2 • Dados da Empresa'
                    : 'Cadastro Concluído'}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold">
                  100% Gratuito
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-white leading-tight mt-0.5">
                {step === 'entry'
                  ? 'Cadastre-se no GuiaPonto'
                  : step === 'company_form'
                  ? 'Completar Cadastro da Empresa'
                  : 'Empresa Cadastrada com Sucesso!'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/80 flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                step === 'entry'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {step === 'entry' ? '1' : '✓'}
            </span>
            <span
              className={`text-xs font-bold ${
                step === 'entry' ? 'text-slate-900' : 'text-emerald-700'
              }`}
            >
              Nome e E-mail
            </span>
          </div>

          <div className="flex-1 h-1 rounded-full bg-slate-200 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                step === 'entry'
                  ? 'w-1/3 bg-orange-500'
                  : step === 'company_form'
                  ? 'w-4/5 bg-orange-600'
                  : 'w-full bg-emerald-500'
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                step === 'company_form'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : step === 'completed'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step === 'completed' ? '✓' : '2'}
            </span>
            <span
              className={`text-xs font-bold ${
                step === 'company_form'
                  ? 'text-slate-900'
                  : step === 'completed'
                  ? 'text-emerald-700'
                  : 'text-slate-500'
              }`}
            >
              Ficha da Empresa
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* STEP 1: ONLY NAME AND EMAIL */}
          {step === 'entry' && (
            <form onSubmit={handleEntrySubmit} className="space-y-5">
              <div className="bg-orange-50/80 border border-orange-200/80 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Entrada Simplificada • Sem Criação de Anúncio Agora
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Comece informando apenas seu <strong>nome</strong> e <strong>e-mail</strong>. Em seguida, você será direcionado direto para o formulário de dados da sua empresa.
                  </p>
                </div>
              </div>

              {step1Error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                  {step1Error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Seu Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Ex: Alexandre Oliveira"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50/60 focus:bg-white text-slate-900 font-medium text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Seu E-mail Principal *
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: contato@suaempresa.com.br"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 bg-slate-50/60 focus:bg-white text-slate-900 font-medium text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Você receberá os alertas de novos clientes e contatos do WhatsApp neste e-mail.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Criar Conta e Preencher Dados da Empresa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 pt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Sem cartão de crédito
                </span>
                <span>•</span>
                <span>Leva menos de 1 minuto</span>
              </div>
            </form>
          )}

          {/* STEP 2: COMPLETE COMPANY REGISTRATION FORM */}
          {step === 'company_form' && (
            <form onSubmit={handleCompanyFormSubmit} className="space-y-4">
              {/* Pre-filled User Banner */}
              <div className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center">
                    {ownerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{ownerName}</p>
                    <p className="text-slate-500">{email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('entry')}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Alterar
                </button>
              </div>

              {step2Error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                  {step2Error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Nome Fantasia da Empresa *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      autoFocus
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Ex: Padaria Real Campolim, Auto Center Sorocaba..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-medium text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Descrição dos Serviços / Diferenciais do Negócio
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={() => {
                      if (description.trim().length >= 20) {
                        setAutoCategorizeSignal((prev) => prev + 1);
                      }
                    }}
                    placeholder="Ex: Oficina mecânica especializada em injeção eletrônica, alinhamento 3D e troca de óleo no Campolim..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <SmartCategorySuggestion
                    businessName={businessName}
                    description={description}
                    categories={CATEGORIES}
                    selectedCategory={category}
                    isCategoryLockedManually={categoryLockedManually}
                    autoTriggerSignal={autoCategorizeSignal}
                    onApplyCategory={handleApplySuggestedCategory}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Categoria Principal *
                    </label>
                    {categorySuggestedByAi && (
                      <span className="text-[11px] font-bold text-emerald-700">
                        Definida por IA
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setCategoryLockedManually(true);
                        setCategorySuggestedByAi(false);
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-medium text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    WhatsApp Comercial (Receber Clientes) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="(15) 99999-9999"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-medium text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Bairro / Região (Sorocaba e Região) *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={cityRegion}
                      onChange={(e) => setCityRegion(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-medium text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
                    >
                      {SOROCABA_REGIONS.map((reg) => (
                        <option key={reg} value={reg}>
                          {reg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    CNPJ ou CPF (Opcional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={document}
                      onChange={(e) => setDocument(e.target.value)}
                      placeholder="00.000.000/0001-00"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-medium text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Endereço Físico ou Área de Atendimento
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Av. Antônio Carlos Comitre, 500 - Campolim, Sorocaba/SP"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Horário de Funcionamento
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={openingHours}
                      onChange={(e) => setOpeningHours(e.target.value)}
                      placeholder="Ex: Seg a Sex: 08h às 18h | Sáb: 09h às 13h"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('entry')}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Concluir Cadastro da Empresa</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: COMPLETED CONFIRMATION */}
          {step === 'completed' && savedProfile && (
            <div className="text-center space-y-5 py-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
                  Ficha Empresarial Ativa no GuiaPonto
                </span>
                <h4 className="text-2xl font-extrabold text-slate-900">
                  Parabéns, {savedProfile.ownerName.split(' ')[0]}!
                </h4>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  O cadastro da empresa <strong>{savedProfile.businessName}</strong> foi concluído com sucesso e já está vinculado ao e-mail <strong>{savedProfile.email}</strong>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/70">
                  <span className="text-slate-500 font-medium">Empresa:</span>
                  <span className="font-bold text-slate-900">{savedProfile.businessName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/70">
                  <span className="text-slate-500 font-medium">Categoria:</span>
                  <span className="font-bold text-slate-800">{savedProfile.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/70">
                  <span className="text-slate-500 font-medium">Região:</span>
                  <span className="font-bold text-slate-800">{savedProfile.cityRegion}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">WhatsApp de Leads:</span>
                  <span className="font-bold text-emerald-700">{savedProfile.whatsapp}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Voltar ao Guia
                </button>
                <button
                  type="button"
                  onClick={handleGoToDashboard}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4 text-orange-400" />
                  <span>Acessar Painel da Minha Empresa</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
