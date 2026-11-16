/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'qrcode';
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  Clock,
  Check,
  CheckCircle2,
  Share2,
  Camera,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Sparkles,
  Calendar,
  User,
  Mail,
  FileText,
  ChevronRight,
  ChevronDown,
  Award,
  Tag,
  Copy,
  ExternalLink,
  X,
  Image as ImageIcon,
  Sliders,
  Users,
  Send,
  Navigation,
  Building2,
  QrCode,
  Download,
  Printer,
  Smartphone
} from 'lucide-react';
import { DirectoryBusiness, isBusinessVerifiedSorocaba } from './BusinessDirectoryPage';
import {
  getPinnedBadgesForPublicProfile,
  Badge3DIcon,
  DigitalAchievementBadge
} from '../dashboard/BadgeShowcase';
import {
  dispatchOwnerLeadEmailNotification,
  getOwnerEmailPreferences,
  MerchantEmailNotificationHub
} from '../dashboard/MerchantEmailNotificationHub';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: string;
  highlight?: boolean;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  tag: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface CapturedLead {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  service: string;
  preferredDate: string;
  message: string;
  couponUsed?: string;
  createdAt: string;
  status: 'Novo' | 'Em Atendimento' | 'Convertido';
}

interface BusinessLandingPageProps {
  business: DirectoryBusiness;
  onBackToDirectory: () => void;
  onBackToHome: () => void;
  onContactWhatsApp: (businessName: string) => void;
  initialAdminMode?: boolean;
}

const PRESET_BANNERS = [
  {
    label: 'Arquitetura Comercial Premium',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80'
  },
  {
    label: 'Gastronomia & Ambiente Executivo',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80'
  },
  {
    label: 'Clínica & Saúde Moderna',
    url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80'
  },
  {
    label: 'Centro Automotivo & Performance',
    url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1600&q=80'
  }
];

const QR_PLACEMENT_PRESETS = [
  { id: 'balcao_sorocaba', label: 'Display de Balcão / Caixa', defaultCta: 'Escaneie no Balcão e Ganhe Desconto Exclusivo' },
  { id: 'mesa_cardapio', label: 'Prisma de Mesa / Catálogo', defaultCta: 'Acesse Nosso Cardápio & Serviços pelo Celular' },
  { id: 'vitrine_adesivo', label: 'Adesivo de Vitrine / Fachada', defaultCta: 'Aponte a Câmera para Ver Preços e Falar no WhatsApp' },
  { id: 'panfleto_cartao', label: 'Cartão de Visita / Panfleto Sorocaba', defaultCta: 'Conheça Nossa Estrutura e Avaliações em Sorocaba' },
  { id: 'sacola_delivery', label: 'Embalagem / Sacola Delivery', defaultCta: 'Peça Novamente com Benefício VIP pelo QR Code' }
];

const QR_COLOR_SCHEMES = [
  { id: 'slate', label: 'Preto Executivo', dark: '#0F172A', light: '#FFFFFF' },
  { id: 'brand', label: 'Laranja GuiaPonto', dark: '#FE3A18', light: '#FFFFFF' },
  { id: 'emerald', label: 'Verde Verificado Sorocaba', dark: '#047857', light: '#FFFFFF' },
  { id: 'navy', label: 'Azul Corporativo', dark: '#1E3A8A', light: '#FFFFFF' }
];

export function BusinessLandingPage({
  business,
  onBackToDirectory,
  onBackToHome,
  onContactWhatsApp,
  initialAdminMode = false
}: BusinessLandingPageProps) {
  // Admin Mode State
  const [isAdminMode, setIsAdminMode] = useState<boolean>(initialAdminMode);
  const [activeAdminTab, setActiveAdminTab] = useState<'banner' | 'gallery' | 'conversion' | 'leads' | 'qrcode'>('banner');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pinnedAchievements, setPinnedAchievements] = useState<DigitalAchievementBadge[]>(() =>
    getPinnedBadgesForPublicProfile()
  );
  const [hoveredPublicBadgeId, setHoveredPublicBadgeId] = useState<string | null>(null);

  useEffect(() => {
    const syncBadges = () => {
      setPinnedAchievements(getPinnedBadgesForPublicProfile());
    };
    window.addEventListener('guiaponto-badges-updated', syncBadges);
    window.addEventListener('storage', syncBadges);
    return () => {
      window.removeEventListener('guiaponto-badges-updated', syncBadges);
      window.removeEventListener('storage', syncBadges);
    };
  }, []);

  // Editable Landing Page Content State (Admin Customizable)
  const [bannerUrl, setBannerUrl] = useState<string>(business.image);
  const [customBannerInput, setCustomBannerInput] = useState<string>('');
  const [heroHeadline, setHeroHeadline] = useState<string>(
    `${business.name}: Referência em ${business.subcategory} em ${business.city}`
  );
  const [heroSubtitle, setHeroSubtitle] = useState<string>(
    `${business.description} Atendimento prioritário para moradores e empresas de ${business.neighborhood}, ${business.city} e toda a Região Metropolitana de Sorocaba.`
  );
  const [primaryCtaLabel, setPrimaryCtaLabel] = useState<string>('Solicitar Orçamento no WhatsApp');
  const [responseTimeBadge, setResponseTimeBadge] = useState<string>('Resposta média em 4 minutos');
  const [whatsappNumber, setWhatsappNumber] = useState<string>(business.phone);

  // Promotional Coupon / Lead Magnet State
  const [promoEnabled, setPromoEnabled] = useState<boolean>(true);
  const [promoTitle, setPromoTitle] = useState<string>('Condição Exclusiva para Clientes GuiaPonto Sorocaba');
  const [promoDiscount, setPromoDiscount] = useState<string>('15% OFF ou Avaliação Técnica Cortesia');
  const [promoCode, setPromoCode] = useState<string>('SOROCABA15');
  const [promoValidity, setPromoValidity] = useState<string>('Válido para agendamentos realizados nesta semana');
  const [copiedCoupon, setCopiedCoupon] = useState<boolean>(false);

  // Dynamic QR Code Offline Marketing State
  const [qrPlacement, setQrPlacement] = useState<string>('balcao_sorocaba');
  const [qrTargetAction, setQrTargetAction] = useState<'perfil' | 'cupom' | 'orcamento'>('cupom');
  const [qrColorId, setQrColorId] = useState<string>('slate');
  const [qrCustomHeadline, setQrCustomHeadline] = useState<string>(
    'Escaneie para ver nosso Catálogo e Ganhar Benefício Exclusivo'
  );
  const [qrIncludeCouponBadge, setQrIncludeCouponBadge] = useState<boolean>(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedQrLink, setCopiedQrLink] = useState<boolean>(false);

  // Gallery State (Admin can add, edit, delete photos)
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(() => {
    const initialUrls = business.gallery && business.gallery.length > 0 ? business.gallery : [business.image];
    const defaultCaptions = [
      'Fachada e recepção principal em Sorocaba',
      'Ambiente interno climatizado e preparado para atendimento',
      'Equipe especializada em atendimento de alto padrão',
      'Detalhes técnicos e estrutura completa'
    ];
    const defaultTags = ['Estrutura', 'Ambiente', 'Equipe', 'Serviços'];

    return initialUrls.map((url, idx) => ({
      id: `photo-${idx + 1}`,
      url,
      caption: defaultCaptions[idx % defaultCaptions.length],
      tag: defaultTags[idx % defaultTags.length]
    }));
  });

  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
  const [newPhotoCaption, setNewPhotoCaption] = useState<string>('');
  const [newPhotoTag, setNewPhotoTag] = useState<string>('Estrutura');
  const [selectedGalleryFilter, setSelectedGalleryFilter] = useState<string>('Todas');
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);

  // Services / Catalog State (Admin can add/remove)
  const [services, setServices] = useState<ServiceItem[]>(() =>
    business.popularServices.map((srv, idx) => ({
      id: `srv-${idx + 1}`,
      name: srv.name,
      description: `Atendimento completo com garantia de qualidade em ${business.neighborhood}, ${business.city}.`,
      price: srv.price,
      highlight: idx === 0
    }))
  );
  const [newServiceName, setNewServiceName] = useState<string>('');
  const [newServicePrice, setNewServicePrice] = useState<string>('');
  const [newServiceDesc, setNewServiceDesc] = useState<string>('');

  // FAQ State
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: 'faq-1',
      question: `Como funciona o agendamento ou orçamento rápido em ${business.city}?`,
      answer: `Você pode preencher o formulário de orçamento nesta página ou clicar no botão do WhatsApp para falar diretamente com nosso especialista em ${business.neighborhood}. Respondemos em poucos minutos.`
    },
    {
      id: 'faq-2',
      question: 'Como utilizar o cupom de desconto exclusivo do GuiaPonto?',
      answer: `Basta copiar o código ${promoCode} nesta Landing Page ou mencioná-lo ao iniciar a conversa pelo WhatsApp ou formulário de contato.`
    },
    {
      id: 'faq-3',
      question: 'Quais formas de pagamento e garantias são oferecidas?',
      answer: 'Aceitamos PIX com desconto, cartões de crédito em até 12x, cartões de débito e faturamento corporativo para empresas de Sorocaba e Votorantim.'
    }
  ]);
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // Lead Capture Form State
  const [leadName, setLeadName] = useState<string>('');
  const [leadWhatsapp, setLeadWhatsapp] = useState<string>('');
  const [leadEmail, setLeadEmail] = useState<string>('');
  const [leadService, setLeadService] = useState<string>(
    business.popularServices[0]?.name || 'Orçamento Geral'
  );
  const [leadDate, setLeadDate] = useState<string>('');
  const [leadMessage, setLeadMessage] = useState<string>('');
  const [applyCouponInForm, setApplyCouponInForm] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  // Captured Leads Inbox (Visible in Admin Mode)
  const [capturedLeads, setCapturedLeads] = useState<CapturedLead[]>([
    {
      id: 'lead-101',
      name: 'Ricardo Almeida',
      whatsapp: '(15) 99124-8830',
      email: 'ricardo.almeida@sorocaba.br',
      service: business.popularServices[0]?.name || 'Atendimento Principal',
      preferredDate: 'Amanhã - Período da Tarde',
      message: 'Olá! Vi a página de vocês no GuiaPonto Sorocaba e gostaria de agendar uma visita.',
      couponUsed: 'SOROCABA15',
      createdAt: 'Há 18 minutos',
      status: 'Novo'
    },
    {
      id: 'lead-102',
      name: 'Fernanda Oliveira',
      whatsapp: '(15) 99741-2099',
      email: 'fernanda.campolim@empresa.com.br',
      service: business.popularServices[1]?.name || 'Orçamento Personalizado',
      preferredDate: 'Sexta-feira às 14:00',
      message: 'Gostaria de saber disponibilidade para esta semana no bairro Campolim.',
      couponUsed: 'SOROCABA15',
      createdAt: 'Há 2 horas',
      status: 'Em Atendimento'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle File Upload (Base64 Preview) for Banner or Gallery
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setBannerUrl(reader.result);
        showToast('Novo banner enviado e atualizado com sucesso!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const newPhoto: GalleryPhoto = {
          id: `photo-${Date.now()}`,
          url: reader.result,
          caption: newPhotoCaption.trim() || `${business.name} - Foto enviada pelo Admin`,
          tag: newPhotoTag
        };
        setGalleryPhotos((prev) => [newPhoto, ...prev]);
        setNewPhotoCaption('');
        showToast('Foto adicionada à galeria da empresa!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddGalleryPhotoByUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;
    const newPhoto: GalleryPhoto = {
      id: `photo-${Date.now()}`,
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || `${business.name} - Galeria Oficial`,
      tag: newPhotoTag
    };
    setGalleryPhotos((prev) => [newPhoto, ...prev]);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    showToast('Nova foto adicionada à galeria!');
  };

  const handleRemoveGalleryPhoto = (id: string) => {
    setGalleryPhotos((prev) => prev.filter((p) => p.id !== id));
    showToast('Foto removida da galeria.');
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim() || !newServicePrice.trim()) return;
    const item: ServiceItem = {
      id: `srv-${Date.now()}`,
      name: newServiceName.trim(),
      price: newServicePrice.trim(),
      description:
        newServiceDesc.trim() ||
        `Serviço especializado realizado em ${business.neighborhood}, ${business.city}.`,
      highlight: false
    };
    setServices((prev) => [...prev, item]);
    setNewServiceName('');
    setNewServicePrice('');
    setNewServiceDesc('');
    showToast('Novo serviço/oferta adicionado à Landing Page!');
  };

  const handleRemoveService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    showToast('Serviço removido do catálogo.');
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(promoCode);
    setCopiedCoupon(true);
    showToast(`Cupom ${promoCode} copiado! Use no formulário ou WhatsApp.`);
    setTimeout(() => setCopiedCoupon(false), 3000);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!leadName.trim() || leadName.trim().length < 3) {
      setFormError('Por favor, informe seu nome completo.');
      return;
    }

    const cleanPhone = leadWhatsapp.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Informe um número de WhatsApp válido com DDD (ex: 15 99123-4567).');
      return;
    }

    const newLead: CapturedLead = {
      id: `lead-${Date.now()}`,
      name: leadName.trim(),
      whatsapp: leadWhatsapp.trim(),
      email: leadEmail.trim() || 'Não informado',
      service: leadService,
      preferredDate: leadDate.trim() || 'O mais breve possível',
      message: leadMessage.trim() || 'Solicitação de orçamento via Landing Page',
      couponUsed: applyCouponInForm && promoEnabled ? promoCode : undefined,
      createdAt: 'Agora mesmo',
      status: 'Novo'
    };

    setCapturedLeads((prev) => [newLead, ...prev]);
    setFormSuccess(true);

    const ownerPrefs = getOwnerEmailPreferences();
    await dispatchOwnerLeadEmailNotification({
      businessName: business.name,
      channel: 'Formulário da Landing Page',
      leadName: newLead.name,
      leadPhone: newLead.whatsapp,
      leadEmail: newLead.email,
      serviceOrSubject: `${newLead.service} (${newLead.preferredDate})`,
      message: newLead.message,
      couponUsed: newLead.couponUsed,
      neighborhood: `${business.neighborhood}, ${business.city}`
    });

    setLeadName('');
    setLeadWhatsapp('');
    setLeadEmail('');
    setLeadDate('');
    setLeadMessage('');
    showToast(
      `Solicitação enviada! O proprietário (${ownerPrefs.ownerEmail}) acaba de receber um alerta por e-mail.`
    );
  };

  const galleryTags = ['Todas', ...Array.from(new Set(galleryPhotos.map((p) => p.tag)))];
  const filteredGallery =
    selectedGalleryFilter === 'Todas'
      ? galleryPhotos
      : galleryPhotos.filter((p) => p.tag === selectedGalleryFilter);

  const isLocalVerified = isBusinessVerifiedSorocaba(business);

  // Selected QR color scheme
  const activeQrScheme = useMemo(
    () => QR_COLOR_SCHEMES.find((s) => s.id === qrColorId) || QR_COLOR_SCHEMES[0],
    [qrColorId]
  );

  // Dynamically constructed public URL encoded into the QR code
  const dynamicPublicProfileUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://guiaponto.com.br';
    const params = new URLSearchParams();
    params.set('empresa', business.id);
    params.set('utm_source', qrPlacement);
    params.set('utm_medium', 'qrcode_offline_sorocaba');
    if (qrTargetAction === 'cupom' && promoEnabled && promoCode) {
      params.set('cupom', promoCode);
    }
    const hash = qrTargetAction === 'orcamento' ? '#orcamento' : '';
    return `${origin}/?${params.toString()}${hash}`;
  }, [business.id, qrPlacement, qrTargetAction, promoEnabled, promoCode]);

  // Generate dynamic QR Code image whenever parameters or colors change
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(dynamicPublicProfileUrl, {
      width: 520,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: activeQrScheme.dark,
        light: activeQrScheme.light
      }
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [dynamicPublicProfileUrl, activeQrScheme]);

  const handleCopyQrPublicUrl = () => {
    navigator.clipboard.writeText(dynamicPublicProfileUrl);
    setCopiedQrLink(true);
    showToast('Link público do QR Code copiado para a área de transferência!');
    setTimeout(() => setCopiedQrLink(false), 3000);
  };

  const handleDownloadQrOnly = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `qrcode-${business.id}-${qrPlacement}-sorocaba.png`;
    link.href = qrDataUrl;
    link.click();
    showToast(`QR Code de ${business.name} baixado em alta resolução!`);
  };

  const handleDownloadPrintableStandee = () => {
    if (!qrDataUrl) return;
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const qrImg = new Image();
    qrImg.onload = () => {
      // Background
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Top Brand Accent Bar
      ctx.fillStyle = '#FE3A18';
      ctx.fillRect(0, 0, canvas.width, 18);

      // Inner White Card
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(60, 70, 780, 1020, 32);
      ctx.fill();

      // Header Verification Pill text
      ctx.fillStyle = '#047857';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `✓ EMPRESA VERIFICADA SOROCABA · ${business.neighborhood.toUpperCase()}`,
        canvas.width / 2,
        140
      );

      // Business Name
      ctx.fillStyle = '#0F172A';
      ctx.font = '900 40px sans-serif';
      ctx.fillText(business.name.slice(0, 34), canvas.width / 2, 205);

      // Category & City
      ctx.fillStyle = '#64748B';
      ctx.font = '600 22px sans-serif';
      ctx.fillText(`${business.subcategory} · ${business.city} - SP`, canvas.width / 2, 245);

      // Custom Offline CTA Headline
      ctx.fillStyle = '#FE3A18';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(qrCustomHeadline.slice(0, 48), canvas.width / 2, 310);

      // QR Code Frame
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 4;
      ctx.strokeRect(220, 350, 460, 460);
      ctx.drawImage(qrImg, 235, 365, 430, 430);

      // Coupon Badge if active
      if (qrIncludeCouponBadge && promoEnabled) {
        ctx.fillStyle = '#ECFDF5';
        ctx.fillRect(160, 845, 580, 85);
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.strokeRect(160, 845, 580, 85);

        ctx.fillStyle = '#065F46';
        ctx.font = 'bold 24px monospace';
        ctx.fillText(`CUPOM ATIVO: ${promoCode} (${promoDiscount.slice(0, 26)})`, canvas.width / 2, 896);
      }

      // Footer instructions
      ctx.fillStyle = '#334155';
      ctx.font = '600 22px sans-serif';
      ctx.fillText(
        'Aponte a câmera do celular para acessar nosso perfil público oficial',
        canvas.width / 2,
        995
      );

      ctx.fillStyle = '#94A3B8';
      ctx.font = '500 18px monospace';
      ctx.fillText(`GuiaPonto Sorocaba & Região · ${whatsappNumber}`, canvas.width / 2, 1045);

      const link = document.createElement('a');
      link.download = `placa-qr-${business.id}-sorocaba.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Placa de Balcão / Vitrine pronta para impressão baixada com sucesso!');
    };
    qrImg.src = qrDataUrl;
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#FE3A18] selection:text-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-5 right-5 z-50 bg-slate-950 text-white px-5 py-3 rounded-xl shadow-xl border border-slate-800 flex items-center gap-2.5 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= TOP BAR CONTRACT (3 ZONES) ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single Brand / Back Lockup */}
          <button
            type="button"
            onClick={onBackToDirectory}
            className="text-base font-bold tracking-tight text-slate-900 hover:text-[#FE3A18] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#FE3A18]" />
            <span>{business.name}</span>
          </button>

          {/* Zone 2: 5 Single-Line Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="#sobre"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Visão Geral
            </a>
            <a
              href="#servicos"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Serviços & Preços
            </a>
            <a
              href="#galeria"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Galeria de Fotos
            </a>
            <a
              href="#avaliacoes"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Depoimentos
            </a>
            <a
              href="#orcamento"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Orçamento Rápido
            </a>
          </nav>

          {/* Zone 3: 1 Primary Conversion Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => onContactWhatsApp(business.name)}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{primaryCtaLabel}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= ADMIN MODE WORKSPACE BAR (BELOW HEADER) ================= */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-slate-300">
              Painel do Proprietário · Gestão da Landing Page:
            </span>
            <span className="text-slate-400 hidden lg:inline">
              Personalize o banner de capa, adicione fotos na galeria e gerencie elementos de conversão de leads.
            </span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center p-1 bg-slate-800 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => setIsAdminMode(false)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  !isAdminMode
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Visão do Cliente</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAdminMode(true)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isAdminMode
                    ? 'bg-[#FE3A18] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Modo Admin da Empresa (Editar Página)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsAdminMode(true);
                setActiveAdminTab('qrcode');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-[#FE3A18]" />
              <span>Compartilhar via QR Code</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsAdminMode(true);
                setActiveAdminTab('leads');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 tabular-nums"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Leads ({capturedLeads.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= INTERACTIVE ADMIN STUDIO DRAWER / PANEL ================= */}
      <AnimatePresence>
        {isAdminMode && (
          <motion.section
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-950 text-white border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-[#FE3A18]" />
                    <span>Editor da Landing Page & Conversão — {business.name}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Todas as alterações feitas abaixo são aplicadas instantaneamente na Landing Page da sua empresa.
                  </p>
                </div>

                {/* Admin Studio Sub-Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('banner')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      activeAdminTab === 'banner'
                        ? 'bg-[#FE3A18] text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    1. Banner & Capa Hero
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('gallery')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                      activeAdminTab === 'gallery'
                        ? 'bg-[#FE3A18] text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    2. Galeria de Fotos ({galleryPhotos.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('conversion')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      activeAdminTab === 'conversion'
                        ? 'bg-[#FE3A18] text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    3. Cupom & Catálogo de Serviços
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('leads')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                      activeAdminTab === 'leads'
                        ? 'bg-emerald-600 text-white'
                        : 'text-emerald-400 hover:text-white'
                    }`}
                  >
                    4. Leads Capturados ({capturedLeads.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('qrcode')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      activeAdminTab === 'qrcode'
                        ? 'bg-[#FE3A18] text-white'
                        : 'text-amber-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>5. Compartilhar via QR Code</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: BANNER & HERO CUSTOMIZER */}
              {activeAdminTab === 'banner' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 space-y-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-white">
                      Personalizar Textos de Conversão & CTA Principal
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-400 block mb-1">
                          Título Principal (Headline de Impacto)
                        </label>
                        <input
                          type="text"
                          value={heroHeadline}
                          onChange={(e) => setHeroHeadline(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#FE3A18]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-slate-400 block mb-1">
                          Subtítulo / Proposta de Valor Local
                        </label>
                        <textarea
                          rows={2}
                          value={heroSubtitle}
                          onChange={(e) => setHeroSubtitle(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#FE3A18]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-slate-400 block mb-1">
                            Texto do Botão Principal (CTA)
                          </label>
                          <input
                            type="text"
                            value={primaryCtaLabel}
                            onChange={(e) => setPrimaryCtaLabel(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#FE3A18]"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-400 block mb-1">
                            Selo de Tempo de Resposta
                          </label>
                          <input
                            type="text"
                            value={responseTimeBadge}
                            onChange={(e) => setResponseTimeBadge(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#FE3A18]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-white">
                      Imagem do Banner de Capa (16:9)
                    </h3>

                    <div className="space-y-3">
                      {/* Upload from device */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <label className="flex-1 py-2.5 px-4 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-semibold text-xs text-center cursor-pointer transition-colors flex items-center justify-center gap-2">
                          <Camera className="w-4 h-4" />
                          <span>Enviar Banner do Computador</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBannerFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Paste custom URL */}
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="Ou cole a URL de uma imagem de capa..."
                          value={customBannerInput}
                          onChange={(e) => setCustomBannerInput(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FE3A18]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customBannerInput.trim()) {
                              setBannerUrl(customBannerInput.trim());
                              setCustomBannerInput('');
                              showToast('Banner atualizado via URL!');
                            }
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
                        >
                          Aplicar URL
                        </button>
                      </div>

                      {/* Preset Banners */}
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-2">
                          Sugestões de Banners Profissionais:
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {PRESET_BANNERS.map((preset, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setBannerUrl(preset.url);
                                showToast(`Banner "${preset.label}" aplicado!`);
                              }}
                              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left flex items-center gap-2 transition-colors cursor-pointer"
                            >
                              <img
                                src={preset.url}
                                alt={preset.label}
                                referrerPolicy="no-referrer"
                                className="w-10 h-7 rounded object-cover shrink-0"
                              />
                              <span className="text-[11px] font-medium text-slate-300 truncate">
                                {preset.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PHOTO GALLERY MANAGER */}
              {activeAdminTab === 'gallery' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 space-y-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-white">
                      Adicionar Nova Foto na Galeria
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-400 block mb-1">
                          Legenda da Foto (ex: Sala de Atendimento, Prato Executivo)
                        </label>
                        <input
                          type="text"
                          placeholder="Descreva o que aparece na foto..."
                          value={newPhotoCaption}
                          onChange={(e) => setNewPhotoCaption(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FE3A18]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-slate-400 block mb-1">
                          Categoria / Ambiente da Foto
                        </label>
                        <select
                          value={newPhotoTag}
                          onChange={(e) => setNewPhotoTag(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FE3A18]"
                        >
                          <option value="Estrutura">Estrutura & Fachada</option>
                          <option value="Ambiente">Ambiente Interno</option>
                          <option value="Serviços">Produtos & Serviços</option>
                          <option value="Equipe">Equipe & Atendimento</option>
                        </select>
                      </div>

                      {/* Upload file button */}
                      <label className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs text-center cursor-pointer transition-colors flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        <span>Enviar Foto do Computador / Celular</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleGalleryFileUpload}
                          className="hidden"
                        />
                      </label>

                      <form onSubmit={handleAddGalleryPhotoByUrl} className="flex gap-2 pt-1">
                        <input
                          type="url"
                          placeholder="Ou cole a URL da foto..."
                          value={newPhotoUrl}
                          onChange={(e) => setNewPhotoUrl(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FE3A18]"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
                        >
                          Adicionar
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-3 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white tabular-nums">
                        Fotos Ativas na Galeria ({galleryPhotos.length})
                      </h3>
                      <span className="text-xs text-slate-400">
                        Clique no ícone de lixeira para remover uma foto
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
                      {galleryPhotos.map((photo) => (
                        <div
                          key={photo.id}
                          className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 h-28"
                        >
                          <img
                            src={photo.url}
                            alt={photo.caption}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-medium text-slate-200 bg-black/60 px-2 py-0.5 rounded">
                                {photo.tag}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryPhoto(photo.id)}
                                className="p-1 rounded bg-red-600/90 hover:bg-red-600 text-white cursor-pointer"
                                title="Remover foto"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-[11px] text-white font-medium truncate">
                              {photo.caption}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CONVERSION ELEMENTS (COUPON & SERVICES) */}
              {activeAdminTab === 'conversion' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Coupon / Lead Magnet Config */}
                  <div className="lg:col-span-5 space-y-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">
                        Oferta / Cupom de Conversão de Leads
                      </h3>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={promoEnabled}
                          onChange={(e) => setPromoEnabled(e.target.checked)}
                          className="rounded accent-[#FE3A18]"
                        />
                        <span>Exibir Oferta</span>
                      </label>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-400 block mb-1">
                          Benefício / Desconto Principal
                        </label>
                        <input
                          type="text"
                          value={promoDiscount}
                          onChange={(e) => setPromoDiscount(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FE3A18]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-slate-400 block mb-1">
                            Código do Cupom
                          </label>
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 focus:outline-none focus:border-[#FE3A18]"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-400 block mb-1">
                            Regra de Validade
                          </label>
                          <input
                            type="text"
                            value={promoValidity}
                            onChange={(e) => setPromoValidity(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FE3A18]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Add/Edit Services & Prices */}
                  <div className="lg:col-span-7 space-y-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-sm font-bold text-white">
                      Gerenciar Catálogo de Serviços / Produtos em Destaque
                    </h3>

                    <form onSubmit={handleAddService} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <input
                        type="text"
                        placeholder="Nome do Serviço / Produto..."
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        className="sm:col-span-5 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FE3A18]"
                      />
                      <input
                        type="text"
                        placeholder="Preço (ex: R$ 120,00)"
                        value={newServicePrice}
                        onChange={(e) => setNewServicePrice(e.target.value)}
                        className="sm:col-span-3 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FE3A18]"
                      />
                      <button
                        type="submit"
                        className="sm:col-span-4 py-2 px-3 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar Serviço</span>
                      </button>
                    </form>

                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {services.map((srv) => (
                        <div
                          key={srv.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                        >
                          <div className="min-w-0 pr-3">
                            <span className="font-semibold text-white block truncate">{srv.name}</span>
                            <span className="text-slate-400 text-[11px] truncate block">{srv.description}</span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-mono font-semibold text-emerald-400 tabular-nums">
                              {srv.price}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveService(srv.id)}
                              className="text-slate-500 hover:text-red-400 cursor-pointer p-1"
                              title="Remover serviço"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CAPTURED LEADS INBOX */}
              {activeAdminTab === 'leads' && (
                <div className="space-y-6">
                  <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          Central de Leads Capturados na Landing Page
                        </h3>
                        <p className="text-xs text-slate-400">
                          Contatos gerados pelo formulário de orçamento e cupom exclusivo da página (com disparo automático de e-mail para o proprietário).
                        </p>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 tabular-nums">
                        Taxa de Conversão da Página: 14,8% (Sorocaba & Região)
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="py-2.5 px-3 font-medium">Cliente / Horário</th>
                            <th className="py-2.5 px-3 font-medium">WhatsApp / E-mail</th>
                            <th className="py-2.5 px-3 font-medium">Serviço Solicitado</th>
                            <th className="py-2.5 px-3 font-medium">Cupom</th>
                            <th className="py-2.5 px-3 font-medium">Status E-mail Dono</th>
                            <th className="py-2.5 px-3 font-medium">Ação Direta</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                          {capturedLeads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-950/60">
                              <td className="py-3 px-3">
                                <div className="font-semibold text-white">{lead.name}</div>
                                <div className="text-[11px] text-slate-400">{lead.createdAt} · {lead.preferredDate}</div>
                              </td>
                              <td className="py-3 px-3 font-mono tabular-nums">
                                <div className="text-emerald-400 font-semibold">{lead.whatsapp}</div>
                                <div className="text-[11px] text-slate-400">{lead.email}</div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-medium text-slate-200">{lead.service}</div>
                                <div className="text-[11px] text-slate-400 max-w-xs truncate">{lead.message}</div>
                              </td>
                              <td className="py-3 px-3 font-mono text-[11px] text-amber-300">
                                {lead.couponUsed || '—'}
                              </td>
                              <td className="py-3 px-3">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                  <Mail className="w-3 h-3" />
                                  <span>E-mail Enviado (250 OK)</span>
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <button
                                  type="button"
                                  onClick={() => onContactWhatsApp(`${lead.name} (${lead.whatsapp})`)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>Responder Lead</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Embedded Email Notification Log & Preview */}
                  <MerchantEmailNotificationHub businessName={business.name} compact />
                </div>
              )}

              {/* TAB 5: SHARE VIA QR CODE (OFFLINE MARKETING SOROCABA) */}
              {activeAdminTab === 'qrcode' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left 7 Columns: Dynamic QR Configuration & Offline Marketing Controls */}
                  <div className="lg:col-span-7 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-5">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-[#FE3A18]">
                        Marketing Offline em Sorocaba & Região
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        Gerador de QR Code Dinâmico da Empresa
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Gere códigos QR personalizados para colocar no balcão, mesas, vitrine ou panfletos em {business.neighborhood}, {business.city}. Quando o cliente escaneia com a câmera do celular, abre diretamente o perfil público da sua empresa.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* 1. Offline Placement Preset */}
                      <div>
                        <label className="text-xs font-medium text-slate-300 block mb-2">
                          Onde este QR Code será utilizado em {business.city}? (Rastreamento Offline)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {QR_PLACEMENT_PRESETS.map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => {
                                setQrPlacement(preset.id);
                                setQrCustomHeadline(preset.defaultCta);
                              }}
                              className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                                qrPlacement === preset.id
                                  ? 'bg-[#FE3A18]/15 border-[#FE3A18] text-white'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <span className="truncate">{preset.label}</span>
                              {qrPlacement === preset.id && (
                                <Check className="w-3.5 h-3.5 text-[#FE3A18] shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. Target Conversion Action on Scan */}
                      <div>
                        <label className="text-xs font-medium text-slate-300 block mb-2">
                          Destino imediato ao escanear o QR Code
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {[
                            { id: 'cupom', label: `Perfil + Cupom (${promoCode})` },
                            { id: 'perfil', label: 'Perfil Público Completo' },
                            { id: 'orcamento', label: 'Direto no Orçamento Rápido' }
                          ].map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setQrTargetAction(opt.id as any)}
                              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                                qrTargetAction === opt.id
                                  ? 'bg-emerald-600 border-emerald-500 text-white'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 3. Custom Call-to-Action & Color Scheme */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-7">
                          <label className="text-xs font-medium text-slate-300 block mb-1.5">
                            Frase de Chamada na Placa Impressa
                          </label>
                          <input
                            type="text"
                            value={qrCustomHeadline}
                            onChange={(e) => setQrCustomHeadline(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FE3A18]"
                          />
                        </div>

                        <div className="sm:col-span-5">
                          <label className="text-xs font-medium text-slate-300 block mb-1.5">
                            Estilo de Cor do QR Code
                          </label>
                          <select
                            value={qrColorId}
                            onChange={(e) => setQrColorId(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FE3A18]"
                          >
                            {QR_COLOR_SCHEMES.map((scheme) => (
                              <option key={scheme.id} value={scheme.id}>
                                {scheme.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* 4. Dynamic URL Box + Copy */}
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>URL Dinâmica Codificada no QR Code:</span>
                          <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={qrIncludeCouponBadge}
                              onChange={(e) => setQrIncludeCouponBadge(e.target.checked)}
                              className="rounded accent-emerald-500"
                            />
                            <span>Imprimir selo do cupom na placa</span>
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={dynamicPublicProfileUrl}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleCopyQrPublicUrl}
                            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedQrLink ? 'Link Copiado!' : 'Copiar Link'}</span>
                          </button>
                        </div>
                      </div>

                      {/* 5. Download & Test Actions */}
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={handleDownloadPrintableStandee}
                          className="px-5 py-3 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-bold text-xs shadow-lg shadow-[#FE3A18]/25 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Baixar Placa de Balcão Pronta p/ Impressão (PNG)</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDownloadQrOnly}
                          className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Download className="w-4 h-4 text-emerald-400" />
                          <span>Baixar Apenas QR Code (PNG)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsAdminMode(false);
                            showToast(`Simulando leitura do QR Code pelo cliente em ${business.city}!`);
                          }}
                          className="px-4 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Smartphone className="w-4 h-4 text-amber-400" />
                          <span>Simular Scan do Cliente</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right 5 Columns: Live Printable Counter Display Preview */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <div className="w-full max-w-sm bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border-t-8 border-[#FE3A18] space-y-4 text-center">
                      <div className="text-[11px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>EMPRESA VERIFICADA SOROCABA · {business.neighborhood.toUpperCase()}</span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xl font-black text-slate-900 leading-tight">
                          {business.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {business.subcategory} · {business.city} - SP
                        </p>
                      </div>

                      <div className="text-xs font-bold text-[#FE3A18] px-2">
                        {qrCustomHeadline}
                      </div>

                      {/* Dynamic QR Code Image */}
                      <div className="mx-auto w-52 h-52 p-3 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center shadow-inner">
                        {qrDataUrl ? (
                          <img
                            src={qrDataUrl}
                            alt={`QR Code ${business.name}`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-xs text-slate-400">Gerando QR Code...</div>
                        )}
                      </div>

                      {qrIncludeCouponBadge && promoEnabled && (
                        <div className="py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono font-bold">
                          CUPOM ATIVO: {promoCode} · {promoDiscount}
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                        <div className="font-semibold text-slate-700">
                          Aponte a câmera do celular para acessar nosso perfil público
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">
                          GuiaPonto Sorocaba & Região · {whatsappNumber}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ================= 1. HERO SECTION (16:9 HIGH-IMPACT BANNER) ================= */}
      <section id="sobre" className="relative bg-slate-950 text-white overflow-hidden">
        {/* Background 16:9 Banner Image with Measured Contrast Scrim */}
        <div className="absolute inset-0">
          <img
            src={bannerUrl}
            alt={business.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-55"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = business.image;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            {/* Left Column: Main Value Proposition */}
            <div className="lg:col-span-8 space-y-6">
              {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-slate-300">
                <span className="text-[#FE3A18] font-semibold">{business.category}</span>
                <span aria-hidden="true">·</span>
                <span>{business.subcategory}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  {isLocalVerified ? 'Empresa Verificada Sorocaba' : 'Cadastro Oficial GuiaPonto'}
                </span>
                <span aria-hidden="true">·</span>
                <span>{business.neighborhood}, {business.city} - SP</span>
              </div>

              {/* Display Headline */}
              <h1
                className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] max-w-3xl"
                style={{ textWrap: 'balance' }}
              >
                {heroHeadline}
              </h1>

              {/* Subtitle / Value Proposition */}
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
                {heroSubtitle}
              </p>

              {/* Single Dominant Primary CTA + Secondary Anchor */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onContactWhatsApp(business.name)}
                  className="px-7 py-4 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-bold text-sm sm:text-base shadow-xl shadow-[#FE3A18]/25 transition-all flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>{primaryCtaLabel}</span>
                </button>

                <a
                  href="#orcamento"
                  className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0"
                >
                  Agendar ou Pedir Orçamento Online
                </a>

                {!isAdminMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminMode(true);
                      setActiveAdminTab('banner');
                    }}
                    className="px-4 py-2.5 rounded-lg bg-black/50 hover:bg-black/70 text-slate-200 border border-white/15 text-xs font-medium flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#FE3A18]" />
                    <span>Trocar Banner / Editar Página</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Trust & Quantitative Proof Card */}
            <div className="lg:col-span-4">
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400 block">Reputação Verificada</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-3xl font-black text-white font-mono tabular-nums">
                        {business.rating.toFixed(1)}
                      </span>
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono tabular-nums">
                    <span className="text-lg font-bold text-white block">{business.reviewsCount}</span>
                    <span className="text-xs text-slate-400">avaliações reais</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Status de Atendimento:</span>
                    <span className="font-semibold text-emerald-400">
                      {business.openNow ? `Aberto agora · Até ${business.closingTime}` : `Abre às 08:00`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Tempo de Resposta:</span>
                    <span className="font-semibold text-white">{responseTimeBadge}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Telefone Direto:</span>
                    <span className="font-mono font-semibold text-white tabular-nums">{whatsappNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Localização:</span>
                    <span className="font-semibold text-white">{business.neighborhood}, {business.city}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width Quantitative KPI Strip Below Hero Split */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums">
                +1.400
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">
                Atendimentos realizados em {business.city} e Região nos últimos 12 meses
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tabular-nums">
                98,4%
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">
                Índice de aprovação de clientes verificados pelo GuiaPonto
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums">
                ~4 min
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">
                Tempo médio para retorno de orçamentos via WhatsApp comercial
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums">
                DDD (15)
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">
                Operação local certificada em {business.neighborhood}, {business.city} - SP
              </div>
            </div>
          </div>

          {/* Pinned 3D Digital Achievements Showcase (Synced from AlexandreDashboardSPA Profile) */}
          {pinnedAchievements.length > 0 && (
            <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <Award className="w-4 h-4 text-[#FE3A18]" />
                  <span>Conquistas Digitais 3D Fixadas pelo Lojista ({pinnedAchievements.length})</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Insígnias auditadas na rede GuiaPonto Sorocaba · Passe o mouse para interagir em 3D
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {pinnedAchievements.map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onMouseEnter={() => setHoveredPublicBadgeId(badge.id)}
                    onMouseLeave={() => setHoveredPublicBadgeId(null)}
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/15 hover:border-amber-400/50 transition-all shadow-lg"
                  >
                    <div className="shrink-0">
                      <Badge3DIcon
                        iconType={badge.iconType}
                        palette={badge.palette}
                        size="sm"
                        isHovered={hoveredPublicBadgeId === badge.id}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${badge.palette.badgeText} block`}>
                        {badge.rarity}
                      </span>
                      <h3 className="text-xs sm:text-sm font-black text-white truncate">
                        {badge.title}
                      </h3>
                      <span className="text-[11px] font-semibold text-emerald-400 block truncate">
                        {badge.trustBoostLabel}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= 2. EXCLUSIVE LEAD MAGNET / COUPON BAR ================= */}
      {promoEnabled && (
        <section className="bg-slate-900 text-white border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-amber-400">
                {promoTitle} · {promoValidity}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {promoDiscount} para contatos iniciados por esta página
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <span className="text-xs text-slate-400">Cupom:</span>
                <span className="font-mono font-bold text-sm text-emerald-400 tracking-wider">
                  {promoCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCoupon}
                  className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCoupon ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              <a
                href="#orcamento"
                onClick={() => setApplyCouponInForm(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0"
              >
                Resgatar Benefício no Orçamento
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ================= 3. SERVICES, CATALOG & DIFFERENTIALS (ASYMMETRIC BENTO) ================= */}
      <section id="servicos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#FE3A18]">
              Catálogo Oficial · {business.name}
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
              Serviços, Soluções e Valores de Referência
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
              Selecione o serviço desejado para solicitar atendimento prioritário via WhatsApp ou agendar diretamente pelo formulário.
            </p>
          </div>

          {!isAdminMode && (
            <button
              type="button"
              onClick={() => {
                setIsAdminMode(true);
                setActiveAdminTab('conversion');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 self-start md:self-auto"
            >
              <Plus className="w-3.5 h-3.5 text-[#FE3A18]" />
              <span>Admin: Adicionar ou Editar Serviços</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Numbered Editorial Services List (8 Columns) */}
          <div className="lg:col-span-8 space-y-4">
            {services.map((srv, index) => (
              <div
                key={srv.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono font-bold text-[#FE3A18]">
                      {String(index + 1).padStart(2, '0')}.
                    </span>
                    <span>Disponível em {business.neighborhood}, {business.city}</span>
                    {srv.highlight && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-emerald-700">Mais Solicitado</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{srv.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{srv.description}</p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-400 block">Investimento / Valor</span>
                    <span className="text-lg font-black text-slate-900 font-mono tabular-nums">
                      {srv.price}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setLeadService(srv.name);
                      const el = document.getElementById('orcamento');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-[#FE3A18] text-white font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Solicitar Este Serviço
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column (4 Columns): Amenities, Structure & Local Trust */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
              <h3 className="text-base font-bold text-slate-900">
                Diferenciais e Comodidades no Local
              </h3>
              <ul className="space-y-3 text-sm text-slate-700">
                {business.amenities.map((amenity, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{amenity}</span>
                  </li>
                ))}
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Atendimento via WhatsApp sem fila de espera</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Orçamento transparente para Sorocaba e região</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                <div className="font-semibold text-slate-900">Especialidades Cadastradas:</div>
                <p className="leading-relaxed">
                  {business.tags.join(' · ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. INTERACTIVE PHOTO GALLERY & ADMIN UPLOAD ================= */}
      <section id="galeria" className="py-20 bg-slate-50 border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#FE3A18]">
                Portfólio Visual & Estrutura Física
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
                Galeria de Fotos — {business.name}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
                Conheça de perto nossas instalações, equipe e padrão de entrega em {business.neighborhood}, {business.city}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl">
                {galleryTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedGalleryFilter(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedGalleryFilter === tag
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAdminMode(true);
                  setActiveAdminTab('gallery');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Camera className="w-3.5 h-3.5 text-[#FE3A18]" />
                <span>Adicionar Fotos</span>
              </button>
            </div>
          </div>

          {/* Bento Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setLightboxPhoto(photo)}
                className={`group relative rounded-2xl overflow-hidden bg-slate-200 border border-slate-200 cursor-pointer ${
                  index === 0 && filteredGallery.length >= 3 ? 'sm:col-span-2 sm:h-80 h-64' : 'h-64'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity p-5 flex flex-col justify-end">
                  <div className="text-xs text-slate-300">
                    {photo.tag} · Clique para ampliar
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                    {photo.caption}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 5. ATTRIBUTABLE SOCIAL PROOF & LOCAL TESTIMONIALS ================= */}
      <section id="avaliacoes" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-emerald-700">
              Prova Social Verificada · Clientes de Sorocaba e Votorantim
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
              Resultados Comprovados por Quem Já Contratou
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
              Avaliações reais de clientes que encontraram {business.name} através do diretório GuiaPonto em Sorocaba.
            </p>
          </div>

          <div className="text-left md:text-right font-mono tabular-nums">
            <div className="text-2xl font-black text-slate-900">
              {business.rating.toFixed(1)} / 5.0 ★
            </div>
            <div className="text-xs text-slate-500">
              Baseado em {business.reviewsCount} avaliações auditadas
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Marcelo Henrique Costa',
              role: 'Diretor de Operações · Parque Campolim, Sorocaba',
              service: business.popularServices[0]?.name || 'Atendimento Especializado',
              quote: `Precisávamos de atendimento rápido no Campolim e encontramos a página da ${business.name} no GuiaPonto. Fomos respondidos no WhatsApp em 3 minutos e o serviço superou todas as expectativas de prazo e qualidade.`
            },
            {
              name: 'Patrícia Vasconcelos',
              role: 'Arquiteta · Santa Rosália, Sorocaba',
              service: business.popularServices[1]?.name || 'Serviço Premium',
              quote: `Utilizei o cupom ${promoCode} disponível nesta página e consegui um excelente desconto logo no primeiro orçamento. Estrutura impecável e equipe extremamente atenciosa.`
            },
            {
              name: 'Eduardo Martins Neto',
              role: 'Empresário · Centro, Votorantim',
              service: business.popularServices[2]?.name || 'Consultoria & Execução',
              quote: `A transparência de preços e a galeria de fotos da página me deram total segurança antes mesmo de ir até o local em ${business.neighborhood}. Hoje indico para toda a minha rede em Sorocaba.`
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-amber-500">5.0 ★ Compra Verificada</span>
                  <span>{item.service}</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="font-bold text-sm text-slate-900">{item.name}</div>
                <div className="text-xs text-slate-500">{item.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 6. LEAD CAPTURE FORM, FAQ & LOCATION ================= */}
      <section id="orcamento" className="py-20 bg-slate-950 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left 7 Columns: High-Converting Lead Capture Form */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-emerald-400">
                Atendimento Prioritário · Sorocaba & Região
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Solicite Seu Orçamento ou Agende um Horário
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Preencha seus dados abaixo para receber o contato imediato da equipe da <strong>{business.name}</strong> no seu WhatsApp.
              </p>
            </div>

            {formSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 space-y-4">
                <div className="flex items-center gap-3 text-emerald-300 font-bold text-base">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <span>Recebemos sua solicitação com prioridade!</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Seus dados e o benefício <strong>{promoCode}</strong> já foram registrados no painel da empresa <strong>{business.name}</strong>.
                </p>
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-200">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Alerta por E-mail Disparado:</strong> O proprietário da empresa acaba de receber uma notificação instantânea por e-mail com os dados do seu orçamento e link direto para te chamar no WhatsApp.
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onContactWhatsApp(business.name)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Adiantamento Imediato no WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormSuccess(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    Enviar Outra Solicitação
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-medium">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João Carlos Silva"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FE3A18]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Seu WhatsApp com DDD *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: (15) 99123-4567"
                      value={leadWhatsapp}
                      onChange={(e) => setLeadWhatsapp(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FE3A18]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Serviço ou Produto de Interesse
                    </label>
                    <select
                      value={leadService}
                      onChange={(e) => setLeadService(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#FE3A18]"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name} ({s.price})
                        </option>
                      ))}
                      <option value="Orçamento Personalizado">Outro / Orçamento Personalizado</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Melhor Dia / Período para Atendimento
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Hoje à tarde ou Quinta às 10h"
                      value={leadDate}
                      onChange={(e) => setLeadDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FE3A18]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Detalhes da Sua Necessidade (Opcional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Conte brevemente o que você precisa para agilizarmos seu orçamento..."
                    value={leadMessage}
                    onChange={(e) => setLeadMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FE3A18]"
                  />
                </div>

                {promoEnabled && (
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyCouponInForm}
                      onChange={(e) => setApplyCouponInForm(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span>
                      Aplicar cupom <strong className="font-mono text-emerald-400">{promoCode}</strong> ({promoDiscount}) nesta solicitação
                    </span>
                  </label>
                )}

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-[#FE3A18] hover:bg-[#e33315] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#FE3A18]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Garantir Atendimento Prioritário Agora</span>
                </button>
              </form>
            )}
          </div>

          {/* Right 5 Columns: Address, Hours & FAQ */}
          <div className="lg:col-span-5 space-y-8">
            {/* Location & Contact Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white">
                Localização e Canais de Atendimento
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#FE3A18] shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-white">{business.address}</div>
                    <div className="text-slate-400">{business.neighborhood}, {business.city} - SP</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-mono font-semibold text-white tabular-nums">{whatsappNumber}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Segunda a Sexta das 08:00 às {business.closingTime} · Sábados até 18:00
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${business.name} ${business.address}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs text-center flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Traçar Rota no Google Maps</span>
                </a>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">
                Perguntas Frequentes sobre {business.name}
              </h3>

              <div className="space-y-2.5">
                {faqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-white cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                            isOpen ? 'rotate-180 text-[#FE3A18]' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUIET FOOTER ================= */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-10 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Página Oficial de <strong className="text-white">{business.name}</strong> no Diretório Comercial GuiaPonto Sorocaba & Região.
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={onBackToDirectory}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Voltar ao Diretório
            </button>
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Página Inicial GuiaPonto
            </button>
          </div>
        </div>
      </footer>

      {/* ================= LIGHTBOX MODAL FOR GALLERY PHOTOS ================= */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxPhoto(null)}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="relative h-[60vh] bg-black">
                <img
                  src={lightboxPhoto.url}
                  alt={lightboxPhoto.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => setLightboxPhoto(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 flex items-center justify-between gap-4 text-white">
                <div>
                  <span className="text-xs text-emerald-400 font-semibold">{lightboxPhoto.tag}</span>
                  <h4 className="text-sm font-bold">{lightboxPhoto.caption}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLightboxPhoto(null);
                    onContactWhatsApp(business.name);
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
                >
                  Falar com a Empresa
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
