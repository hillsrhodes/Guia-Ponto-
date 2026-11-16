/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  QrCode,
  FileText,
  Lock,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  Building2,
  User,
  Mail,
  Tag,
  Activity,
  Webhook,
  DollarSign,
  Wallet
} from 'lucide-react';

export type PaymentGatewayProvider = 'mercadopago' | 'stripe';

export interface StripeGatewayTransaction {
  id: string;
  gateway?: PaymentGatewayProvider;
  sessionId: string;
  paymentIntentId: string;
  businessName: string;
  customerName: string;
  customerEmail: string;
  cnpj?: string;
  planId: 'premium' | 'enterprise';
  planName: 'Plano Premium Pro' | 'Enterprise Regional';
  billingCycle: 'annual' | 'monthly';
  paymentMethod: 'card' | 'pix' | 'boleto' | 'account_money';
  amountBrl: number;
  monthlyEquivalentBrl: number;
  discountAppliedPct: number;
  couponCode?: string;
  status: 'succeeded' | 'approved' | 'trialing_7d' | 'awaiting_pix' | 'processing';
  receiptNumber: string;
  createdAt: string;
}

export interface StripeWebhookEventRecord {
  id: string;
  type?: string;
  topic?: string;
  sessionId?: string;
  preferenceId?: string;
  mpPaymentId?: string;
  businessName: string;
  planName: string;
  amountBrl: number;
  paymentMethod: string;
  httpStatus: 200;
  receivedAt: string;
}

export interface GatewayConfigResponse {
  gatewayActive: boolean;
  mode: 'live_api' | 'sandbox_ready';
  sdkVersion: string;
  region: string;
  currency: string;
  supportedMethods: string[];
  webhookEndpoint: string;
  transactions: any[];
  webhookEvents: StripeWebhookEventRecord[];
}

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGateway?: PaymentGatewayProvider;
  initialPlanId?: 'premium' | 'enterprise';
  initialBillingCycle?: 'annual' | 'monthly';
  defaultBusinessName?: string;
  defaultCustomerName?: string;
  defaultCustomerEmail?: string;
  onSubscriptionCompleted?: (transaction: StripeGatewayTransaction) => void;
}

export function StripeCheckoutModal({
  isOpen,
  onClose,
  initialGateway = 'mercadopago',
  initialPlanId = 'premium',
  initialBillingCycle = 'annual',
  defaultBusinessName = 'Restaurante Sabor & Fogo Co.',
  defaultCustomerName = 'Alexandre Santos',
  defaultCustomerEmail = 'alexandre@guiaponto.com',
  onSubscriptionCompleted
}: StripeCheckoutModalProps) {
  const [gateway, setGateway] =
    useState<PaymentGatewayProvider>(initialGateway);
  const [planId, setPlanId] = useState<'premium' | 'enterprise'>(initialPlanId);
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>(
    initialBillingCycle
  );
  const [paymentMethod, setPaymentMethod] = useState<
    'pix' | 'card' | 'account_money' | 'boleto'
  >('pix');

  const [businessName, setBusinessName] = useState(defaultBusinessName);
  const [customerName, setCustomerName] = useState(defaultCustomerName);
  const [customerEmail, setCustomerEmail] = useState(defaultCustomerEmail);
  const [cnpj, setCnpj] = useState('42.819.301/0001-88');
  const [couponCode, setCouponCode] = useState('');

  // Card inputs
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8842');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('842');
  const [installments, setInstallments] = useState('12');

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTx, setCompletedTx] =
    useState<StripeGatewayTransaction | null>(null);
  const [pixPayload, setPixPayload] = useState<string>('');
  const [boletoLine, setBoletoLine] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    setGateway(initialGateway);
  }, [initialGateway]);

  useEffect(() => {
    setPlanId(initialPlanId);
  }, [initialPlanId]);

  useEffect(() => {
    setBillingCycle(initialBillingCycle);
  }, [initialBillingCycle]);

  // If switching to Stripe and 'account_money' was selected, switch to 'pix'
  useEffect(() => {
    if (gateway === 'stripe' && paymentMethod === 'account_money') {
      setPaymentMethod('pix');
    }
  }, [gateway, paymentMethod]);

  if (!isOpen) return null;

  const isMP = gateway === 'mercadopago';

  const baseAmount =
    planId === 'enterprise'
      ? billingCycle === 'annual'
        ? 1788.0
        : 199.0
      : billingCycle === 'annual'
      ? 297.0
      : 49.9;

  const normalizedCoupon = couponCode.trim().toUpperCase();
  const extraDiscountPct =
    normalizedCoupon === 'SOROCABA50' || normalizedCoupon === 'PRO50'
      ? 15
      : normalizedCoupon === 'CAMPOLIM20' || normalizedCoupon === 'SOROCABA15'
      ? 10
      : 0;

  const finalAmount = Number(
    (baseAmount * (1 - extraDiscountPct / 100)).toFixed(2)
  );
  const monthlyEquivalent =
    billingCycle === 'annual'
      ? Number((finalAmount / 12).toFixed(2))
      : finalAmount;

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const endpoint = isMP
        ? '/api/mercadopago/create-preference'
        : '/api/stripe/create-checkout-session';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          billingCycle,
          paymentMethod,
          businessName,
          customerName,
          customerEmail,
          cnpj,
          couponCode: normalizedCoupon
        })
      });

      const data = await res.json();
      if (data?.transaction) {
        const normalizedTx: StripeGatewayTransaction = {
          ...data.transaction,
          gateway,
          sessionId:
            data.transaction.sessionId ||
            data.transaction.preferenceId ||
            `pref_${Date.now()}`,
          paymentIntentId:
            data.transaction.paymentIntentId ||
            data.transaction.mpPaymentId ||
            `pay_${Date.now()}`
        };

        setCompletedTx(normalizedTx);
        setPixPayload(data.pixCopiaECola || '');
        setBoletoLine(data.boletoLinhaDigitavel || '');

        try {
          localStorage.setItem(
            'guiaponto_active_subscription',
            JSON.stringify(normalizedTx)
          );
          window.dispatchEvent(
            new CustomEvent('guiaponto-stripe-subscription-updated', {
              detail: normalizedTx
            })
          );
        } catch {
          // ignore storage errors
        }

        confetti({
          particleCount: 75,
          spread: 65,
          origin: { y: 0.6 }
        });

        if (onSubscriptionCompleted) {
          onSubscriptionCompleted(normalizedTx);
        }
      }
    } catch {
      // Fallback local completion
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleResetAndClose = () => {
    setCompletedTx(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Top Gateway Header with Mercado Pago vs Stripe Switcher */}
        <div className="bg-slate-950 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg transition-colors ${
                isMP
                  ? 'bg-[#009EE3] shadow-[#009EE3]/30'
                  : 'bg-[#635BFF] shadow-[#635BFF]/30'
              }`}
            >
              {isMP ? 'MP' : 'S'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-xs font-black tracking-wider uppercase ${
                    isMP ? 'text-[#38BDF8]' : 'text-[#A5B4FC]'
                  }`}
                >
                  {isMP
                    ? 'Mercado Pago Checkout Pro & PIX Transparente'
                    : 'Stripe Checkout Brasil · Gateway Global'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  TLS 1.3 · Moeda BRL (R$)
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Checkout de Assinatura GuiaPonto Sorocaba
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* Gateway Selector Pills */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setGateway('mercadopago')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  isMP
                    ? 'bg-[#009EE3] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mercado Pago
              </button>
              <button
                type="button"
                onClick={() => setGateway('stripe')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  !isMP
                    ? 'bg-[#635BFF] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Stripe
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 sm:p-8">
          {completedTx ? (
            <div className="max-w-xl mx-auto text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    completedTx.gateway === 'mercadopago'
                      ? 'bg-[#009EE3]/15 text-[#009EE3]'
                      : 'bg-[#635BFF]/10 text-[#635BFF]'
                  }`}
                >
                  {completedTx.gateway === 'mercadopago'
                    ? 'Mercado Pago Aprovado'
                    : 'Stripe Session Confirmada'}{' '}
                  • Recibo #{completedTx.receiptNumber}
                </span>
                <h4 className="text-2xl font-black text-slate-900 pt-1">
                  {completedTx.planName} Ativado com Sucesso!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  O webhook{' '}
                  <code className="font-mono text-slate-900">
                    {completedTx.gateway === 'mercadopago'
                      ? 'payment.updated (approved)'
                      : 'checkout.session.completed'}
                  </code>{' '}
                  liberou todos os benefícios Pro para{' '}
                  <strong>{completedTx.businessName}</strong>.
                </p>
              </div>

              {/* Transaction Metadata Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Gateway Processador:</span>
                  <span className="font-black text-slate-900">
                    {completedTx.gateway === 'mercadopago'
                      ? 'Mercado Pago Brasil (MLB)'
                      : 'Stripe Brasil'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    {completedTx.gateway === 'mercadopago'
                      ? 'Preference ID:'
                      : 'Stripe Session ID:'}
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {completedTx.sessionId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    {completedTx.gateway === 'mercadopago'
                      ? 'Pagamento MP ID:'
                      : 'PaymentIntent ID:'}
                  </span>
                  <span
                    className={`font-mono font-bold ${
                      completedTx.gateway === 'mercadopago'
                        ? 'text-[#009EE3]'
                        : 'text-[#635BFF]'
                    }`}
                  >
                    {completedTx.paymentIntentId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Plano & Ciclo:</span>
                  <span className="font-bold text-slate-900">
                    {completedTx.planName} (
                    {completedTx.billingCycle === 'annual' ? 'Anual' : 'Mensal'}
                    )
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Valor Processado (BRL):</span>
                  <span className="font-mono font-black text-emerald-700 text-sm">
                    R$ {completedTx.amountBrl.toFixed(2).replace('.', ',')} (eq. R${' '}
                    {completedTx.monthlyEquivalentBrl
                      .toFixed(2)
                      .replace('.', ',')}
                    /mês)
                  </span>
                </div>
              </div>

              {/* PIX or Boleto Code if applicable */}
              {completedTx.paymentMethod === 'pix' && pixPayload && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      Código PIX{' '}
                      {completedTx.gateway === 'mercadopago'
                        ? 'Mercado Pago'
                        : 'Stripe'}{' '}
                      (Copia e Cola)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(pixPayload)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3 h-3" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copiar PIX
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-mono text-[10px] text-emerald-800 break-all bg-white p-2.5 rounded-xl border border-emerald-200">
                    {pixPayload}
                  </p>
                </div>
              )}

              {completedTx.paymentMethod === 'boleto' && boletoLine && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-amber-600" />
                      Linha Digitável Boleto{' '}
                      {completedTx.gateway === 'mercadopago'
                        ? 'Mercado Pago'
                        : 'Stripe'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(boletoLine)}
                      className="px-2.5 py-1 rounded-lg bg-amber-600 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3 h-3" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copiar Linha
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-mono text-xs text-amber-900 bg-white p-2.5 rounded-xl border border-amber-200">
                    {boletoLine}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm cursor-pointer transition-colors"
              >
                Concluir e Voltar à Plataforma
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmitCheckout}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Left Column: Plan Summary & Pricing Breakdown */}
              <div className="lg:col-span-5 bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 space-y-5">
                <div className="space-y-2">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      isMP ? 'text-[#38BDF8]' : 'text-[#A5B4FC]'
                    }`}
                  >
                    1. Escolha o Plano e Ciclo
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPlanId('premium')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        planId === 'premium'
                          ? 'bg-[#FE3A18]/15 border-[#FE3A18] text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-black">Premium Pro</div>
                      <div className="text-[11px] font-mono text-amber-400">
                        R$ 24,75/mês
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlanId('enterprise')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        planId === 'enterprise'
                          ? 'bg-[#009EE3]/20 border-[#009EE3] text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-black">Enterprise VIP</div>
                      <div className="text-[11px] font-mono text-sky-300">
                        R$ 149,00/mês
                      </div>
                    </button>
                  </div>

                  {/* Cycle Switcher */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setBillingCycle('annual')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        billingCycle === 'annual'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      Anual (50% OFF)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle('monthly')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        billingCycle === 'monthly'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      Mensal Avulso
                    </button>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">
                      Equivalente Mensal:
                    </span>
                    <span className="text-2xl font-black text-white font-mono">
                      R$ {monthlyEquivalent.toFixed(2).replace('.', ',')}/mês
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300 border-t border-slate-800 pt-2">
                    <span>
                      Total {billingCycle === 'annual' ? 'Anual' : 'Mensal'}:
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      R$ {finalAmount.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  {extraDiscountPct > 0 && (
                    <div className="text-[11px] text-amber-400 font-bold">
                      ✓ Cupom {normalizedCoupon} aplicado (-{extraDiscountPct}%
                      extra!)
                    </div>
                  )}
                </div>

                {/* Coupon Field */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Cupom Promocional (Ex: SOROCABA50 ou CAMPOLIM20)
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800">
                    <Tag className="w-4 h-4 text-amber-400 shrink-0" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Digite seu cupom..."
                      className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none uppercase font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-300 pt-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      Compra Garantida{' '}
                      {isMP ? 'Mercado Pago Brasil' : 'Stripe Brasil'} (7 dias)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      Liberação instantânea via Webhook{' '}
                      {isMP ? '/api/mercadopago/webhook' : '/api/stripe/webhook'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Customer Info & Payment Methods */}
              <div className="lg:col-span-7 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Empresa em Sorocaba *
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      CNPJ / CPF Comercial *
                    </label>
                    <input
                      type="text"
                      required
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Responsável *
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      E-mail para Comprovante & NF *
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-3">
                  <label className="block text-[11px] font-bold uppercase text-slate-600">
                    Meio de Pagamento no{' '}
                    {isMP ? 'Mercado Pago Brasil' : 'Stripe Brasil'}
                  </label>
                  <div
                    className={`grid gap-2.5 ${
                      isMP ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === 'pix'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-black'
                          : 'bg-slate-50 border-slate-200 text-slate-600 font-semibold'
                      }`}
                    >
                      <QrCode className="w-5 h-5" />
                      <span className="text-xs">PIX Instantâneo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? isMP
                            ? 'bg-[#009EE3]/10 border-[#009EE3] text-[#009EE3] font-black'
                            : 'bg-[#635BFF]/10 border-[#635BFF] text-[#635BFF] font-black'
                          : 'bg-slate-50 border-slate-200 text-slate-600 font-semibold'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span className="text-xs">Cartão até 12x</span>
                    </button>

                    {isMP && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('account_money')}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          paymentMethod === 'account_money'
                            ? 'bg-[#009EE3]/15 border-[#009EE3] text-[#009EE3] font-black'
                            : 'bg-slate-50 border-slate-200 text-slate-600 font-semibold'
                        }`}
                      >
                        <Wallet className="w-5 h-5" />
                        <span className="text-xs">Saldo Conta MP</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('boleto')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === 'boleto'
                          ? 'bg-amber-50 border-amber-500 text-amber-800 font-black'
                          : 'bg-slate-50 border-slate-200 text-slate-600 font-semibold'
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                      <span className="text-xs">Boleto B2B</span>
                    </button>
                  </div>
                </div>

                {/* Method Specific Fields */}
                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Número do Cartão (
                        {isMP ? 'Mercado Pago Transparente' : 'Stripe Elements'}
                        )
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-900"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Validade
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Parcelamento
                        </label>
                        <select
                          value={installments}
                          onChange={(e) => setInstallments(e.target.value)}
                          className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        >
                          <option value="1">
                            1x de R$ {finalAmount.toFixed(2).replace('.', ',')}
                          </option>
                          <option value="6">
                            6x de R${' '}
                            {(finalAmount / 6).toFixed(2).replace('.', ',')}
                          </option>
                          <option value="12">
                            12x de R${' '}
                            {(finalAmount / 12).toFixed(2).replace('.', ',')}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'pix' && (
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <div className="font-black flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      <span>
                        PIX Oficial via{' '}
                        {isMP ? 'Mercado Pago (Aprovação em 2s)' : 'Stripe Brasil'}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      Gera QR Code dinâmico e código Copia e Cola com confirmação
                      automática via Webhook para liberar sua vitrine Pro na hora.
                    </p>
                  </div>
                )}

                {paymentMethod === 'account_money' && (
                  <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 space-y-1">
                    <div className="font-black flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-[#009EE3]" />
                      <span>
                        Saldo em Conta Mercado Pago / Linha de Crédito MP
                      </span>
                    </div>
                    <p className="text-[11px] text-sky-800">
                      Pague usando o saldo disponível na carteira digital Mercado Pago
                      da sua empresa com cashback e aprovação instantânea.
                    </p>
                  </div>
                )}

                {paymentMethod === 'boleto' && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <div className="font-black flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span>
                        Boleto Registrado{' '}
                        {isMP ? 'Mercado Pago / Lotérica PEC' : 'Stripe B2B'}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Emite linha digitável registrada no CNPJ informado com envio
                      automático para o e-mail financeiro.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-2xl text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isMP
                      ? 'bg-[#009EE3] hover:bg-[#0089c7] shadow-[#009EE3]/25'
                      : 'bg-[#635BFF] hover:bg-[#5249e6] shadow-[#635BFF]/25'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>
                        Processando no{' '}
                        {isMP ? 'Mercado Pago...' : 'Gateway Stripe...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Pagar com {isMP ? 'Mercado Pago' : 'Stripe'} · R${' '}
                        {finalAmount.toFixed(2).replace('.', ',')}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function StripeGatewayStatusPanel({
  onOpenCheckout
}: {
  onOpenCheckout?: (
    planId?: 'premium' | 'enterprise',
    gateway?: PaymentGatewayProvider
  ) => void;
}) {
  const [activeProviderTab, setActiveProviderTab] =
    useState<PaymentGatewayProvider>('mercadopago');
  const [mpConfig, setMpConfig] = useState<GatewayConfigResponse | null>(null);
  const [stripeConfig, setStripeConfig] =
    useState<GatewayConfigResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);

  const fetchGatewaysStatus = async () => {
    setIsLoading(true);
    try {
      const [mpRes, stRes] = await Promise.all([
        fetch('/api/mercadopago/config'),
        fetch('/api/stripe/config')
      ]);
      if (mpRes.ok) {
        setMpConfig(await mpRes.json());
      }
      if (stRes.ok) {
        setStripeConfig(await stRes.json());
      }
    } catch {
      // ignore offline
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchGatewaysStatus();
    const handleSubUpdated = () => {
      void fetchGatewaysStatus();
    };
    window.addEventListener(
      'guiaponto-stripe-subscription-updated',
      handleSubUpdated
    );
    return () =>
      window.removeEventListener(
        'guiaponto-stripe-subscription-updated',
        handleSubUpdated
      );
  }, []);

  const handleSimulateWebhook = async () => {
    setIsSimulatingWebhook(true);
    try {
      const endpoint =
        activeProviderTab === 'mercadopago'
          ? '/api/mercadopago/simulate-webhook'
          : '/api/stripe/simulate-webhook';

      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: 'Restaurante Sabor & Fogo Co.',
          planName: 'Plano Premium Pro (Anual)',
          amountBrl: 297.0,
          paymentMethod:
            activeProviderTab === 'mercadopago'
              ? 'PIX Mercado Pago'
              : 'PIX Instantâneo Stripe'
        })
      });
      await fetchGatewaysStatus();
    } finally {
      setIsSimulatingWebhook(false);
    }
  };

  const isMP = activeProviderTab === 'mercadopago';
  const currentConfig = isMP ? mpConfig : stripeConfig;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#009EE3]/10 text-[#009EE3] text-xs font-black">
              <Activity className="w-3.5 h-3.5" />
              <span>Mercado Pago Brasil Ativo</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#635BFF]/10 text-[#635BFF] text-xs font-black">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Stripe Brasil Ativo</span>
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900">
            Central Multi-Gateway de Pagamentos: Mercado Pago & Stripe
          </h3>
          <p className="text-xs text-slate-500">
            Alterne entre o gateway <strong>Mercado Pago</strong> (
            <code className="font-mono">/api/mercadopago/*</code>) e{' '}
            <strong>Stripe</strong> (<code className="font-mono">/api/stripe/*</code>
            ) para inspecionar preferências, PIX, cartões e webhooks em tempo real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Provider Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveProviderTab('mercadopago')}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                isMP
                  ? 'bg-[#009EE3] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mercado Pago
            </button>
            <button
              type="button"
              onClick={() => setActiveProviderTab('stripe')}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                !isMP
                  ? 'bg-[#635BFF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stripe
            </button>
          </div>

          <button
            type="button"
            onClick={handleSimulateWebhook}
            disabled={isSimulatingWebhook}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Webhook
              className={`w-3.5 h-3.5 ${
                isMP ? 'text-[#009EE3]' : 'text-[#635BFF]'
              } ${isSimulatingWebhook ? 'animate-spin' : ''}`}
            />
            <span>
              Testar Webhook {isMP ? 'Mercado Pago' : 'Stripe'}
            </span>
          </button>

          {onOpenCheckout && (
            <button
              type="button"
              onClick={() => onOpenCheckout('premium', activeProviderTab)}
              className={`px-4 py-2.5 rounded-xl text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer transition-all ${
                isMP
                  ? 'bg-[#009EE3] hover:bg-[#0089c7] shadow-[#009EE3]/20'
                  : 'bg-[#635BFF] hover:bg-[#5249e6] shadow-[#635BFF]/20'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>
                Abrir Checkout {isMP ? 'Mercado Pago' : 'Stripe'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Status KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-400 block">
            Gateway Selecionado
          </span>
          <div className="text-base font-black text-emerald-600 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isMP ? 'Mercado Pago (MLB)' : 'Stripe Brasil (BR)'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono block mt-0.5 truncate">
            {currentConfig?.sdkVersion ||
              (isMP ? 'mercadopago-nodejs v2' : 'stripe-node v22')}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-400 block">
            Meios Habilitados
          </span>
          <div className="text-base font-black text-slate-900 mt-1">
            {isMP
              ? 'PIX, Cartão, Saldo MP & Boleto'
              : 'Cartão 12x, PIX & Boleto'}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
            Liquidação Instantânea em BRL (R$)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-400 block">
            Transações Confirmadas
          </span>
          <div
            className={`text-base font-black font-mono mt-1 ${
              isMP ? 'text-[#009EE3]' : 'text-[#635BFF]'
            }`}
          >
            {currentConfig?.transactions?.length || 2} pagamentos aprovados
          </div>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            Conciliação automática ativa
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-400 block">
            Endpoint de Webhook / IPN
          </span>
          <div className="text-sm font-black text-slate-900 font-mono mt-1">
            POST {currentConfig?.webhookEndpoint || '/api/mercadopago/webhook'}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
            HTTP 200 OK · Tempo Real
          </span>
        </div>
      </div>

      {/* Recent Transactions & Webhooks */}
      {!isLoading && currentConfig && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Últimos Pagamentos {isMP ? 'Mercado Pago' : 'Stripe'}
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {currentConfig.transactions.map((tx: any) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">
                      {tx.businessName}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono truncate">
                      {tx.preferenceId || tx.sessionId} · {tx.planName}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono font-black text-emerald-700">
                      R$ {Number(tx.amountBrl).toFixed(2).replace('.', ',')}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {tx.createdAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Webhook
                className={`w-3.5 h-3.5 ${
                  isMP ? 'text-[#009EE3]' : 'text-[#635BFF]'
                }`}
              />
              Notificações Webhook / IPN {isMP ? 'Mercado Pago' : 'Stripe'}
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {currentConfig.webhookEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-2xl bg-slate-950 text-white border border-slate-800 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                        200 OK
                      </span>
                      <span
                        className={`font-mono font-bold truncate ${
                          isMP ? 'text-[#38BDF8]' : 'text-[#A5B4FC]'
                        }`}
                      >
                        {evt.topic || evt.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {evt.businessName} — {evt.paymentMethod}
                    </div>
                  </div>
                  <div className="text-right shrink-0 font-mono text-[11px] text-slate-300">
                    <div>R$ {evt.amountBrl.toFixed(2).replace('.', ',')}</div>
                    <div className="text-[10px] text-slate-500">
                      {evt.receivedAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
