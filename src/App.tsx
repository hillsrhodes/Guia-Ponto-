/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ScrollProgress } from './components/motion/ScrollProgress';
import { ParallaxBackground } from './components/motion/ParallaxBackground';
import { Navbar } from './components/sections/Navbar';
import { HeroSearch } from './components/sections/HeroSearch';
import { StatsBanner } from './components/sections/StatsBanner';
import { AIAdTechShowcase } from './components/sections/AIAdTechShowcase';
import { CategoryBentoGrid } from './components/sections/CategoryBentoGrid';
import { HowItWorksTimeline } from './components/sections/HowItWorksTimeline';
import { FeaturedBusinesses } from './components/sections/FeaturedBusinesses';
import { MobileAdMockupSection } from './components/sections/MobileAdMockupSection';
import { PricingSection } from './components/sections/PricingSection';
import { TestimonialsGoogleSection } from './components/sections/TestimonialsGoogleSection';
import { BusinessInsightsSection } from './components/sections/BusinessInsightsSection';
import { FAQSection } from './components/sections/FAQSection';
import { CTAFinal } from './components/sections/CTAFinal';
import { Footer } from './components/sections/Footer';
import { RegisterBusinessModal } from './components/ui/RegisterBusinessModal';
import { LoginModal } from './components/ui/LoginModal';
import { WhatsAppModal } from './components/ui/WhatsAppModal';
import { FloatingWhatsAppButton } from './components/ui/FloatingWhatsAppButton';
import { SimulatedEmailNotificationToast } from './components/ui/SimulatedEmailNotificationToast';
import { MercadoPagoCheckoutModal } from './components/ui/MercadoPagoCheckoutModal';
import { notifyOwnerOnWhatsAppButtonClick } from './services/notificationService';
import { CacildaAICreatorModal } from './components/dashboard/CacildaAICreatorModal';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { AlexandreDashboardSPA } from './components/dashboard/AlexandreDashboardSPA';
import { MasterAdminPanelSPA } from './components/dashboard/MasterAdminPanelSPA';
import { BusinessDirectoryPage, DIRECTORY_MOCK_DATA, DirectoryBusiness } from './components/directory/BusinessDirectoryPage';
import { BusinessLandingPage } from './components/directory/BusinessLandingPage';
import { CookieConsentBanner, LegalCenterModal, LegalTabType } from './components/legal/LegalComplianceHub';
import { ContributorProfileModal } from './components/contributor/ContributorProfileModal';

export default function App() {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [cacildaModalOpen, setCacildaModalOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [executiveDashboardOpen, setExecutiveDashboardOpen] = useState(false);
  const [masterAdminOpen, setMasterAdminOpen] = useState(false);
  const [publishedAd, setPublishedAd] = useState<any>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [activeWhatsAppBusiness, setActiveWhatsAppBusiness] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'business' | 'consumer'>('business');
  const [legalModalTab, setLegalModalTab] = useState<LegalTabType | null>(null);
  const [mercadoPagoModalOpen, setMercadoPagoModalOpen] = useState<boolean>(false);
  const [mercadoPagoPlanId, setMercadoPagoPlanId] = useState<'premium' | 'enterprise'>('premium');
  const [contributorProfileOpen, setContributorProfileOpen] = useState<boolean>(false);
  
  // Directory & Individual Business Landing Page View States
  const [currentView, setCurrentView] = useState<'home' | 'directory' | 'business-landing'>('home');
  const [selectedLandingBusiness, setSelectedLandingBusiness] = useState<DirectoryBusiness | null>(null);
  const [landingInitialAdminMode, setLandingInitialAdminMode] = useState<boolean>(false);
  const [directoryInitialCategory, setDirectoryInitialCategory] = useState<string>('Todos');
  const [directoryInitialSearch, setDirectoryInitialSearch] = useState<string>('');
  const [directoryInitialRadius, setDirectoryInitialRadius] = useState<number>(25);

  // Automatically route to a business public Landing Page when accessed via QR Code (?empresa=b1) or Legal tabs (?legal=privacidade)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const empresaId = params.get('empresa');
    if (empresaId) {
      const targetBiz = DIRECTORY_MOCK_DATA.find((b) => b.id === empresaId);
      if (targetBiz) {
        setSelectedLandingBusiness(targetBiz);
        setLandingInitialAdminMode(false);
        setCurrentView('business-landing');
      }
    }

    const adminParam = params.get('admin');
    if (adminParam === 'true' || adminParam === '1') {
      setMasterAdminOpen(true);
    }

    const legalParam = params.get('legal');
    if (legalParam === 'privacidade' || legalParam === 'privacy') {
      setLegalModalTab('privacy');
    } else if (legalParam === 'termos' || legalParam === 'terms') {
      setLegalModalTab('terms');
    } else if (legalParam === 'cookies') {
      setLegalModalTab('cookies');
    }
  }, []);

  const handleOpenDirectory = (category?: string, search?: string, radiusKm?: number) => {
    if (category) setDirectoryInitialCategory(category);
    if (search !== undefined) setDirectoryInitialSearch(search);
    if (radiusKm !== undefined) setDirectoryInitialRadius(radiusKm);
    setCurrentView('directory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBusinessLanding = (business: DirectoryBusiness, adminMode = false) => {
    setSelectedLandingBusiness(business);
    setLandingInitialAdminMode(adminMode);
    setCurrentView('business-landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBusinessLandingById = (businessId: string, adminMode = false) => {
    const found = DIRECTORY_MOCK_DATA.find((b) => b.id === businessId) || DIRECTORY_MOCK_DATA[0];
    handleOpenBusinessLanding(found, adminMode);
  };

  const handleSelectCategory = (categoryName: string, radiusKm?: number) => {
    handleOpenDirectory(categoryName, '', radiusKm);
  };

  const handleSelectPlan = (planName: string) => {
    if (planName.toLowerCase().includes('enterprise')) {
      setMercadoPagoPlanId('enterprise');
      setMercadoPagoModalOpen(true);
      return;
    }
    if (planName.toLowerCase().includes('premium') || planName.toLowerCase().includes('pro')) {
      setMercadoPagoPlanId('premium');
      setMercadoPagoModalOpen(true);
      return;
    }
    setRegisterModalOpen(true);
  };

  const handleTriggerWhatsAppContact = (businessName: string) => {
    setActiveWhatsAppBusiness(businessName);
    void notifyOwnerOnWhatsAppButtonClick({
      businessName
    });
  };

  // If Master Admin Console is open, render MasterAdminPanelSPA
  if (masterAdminOpen) {
    return (
      <>
        <MasterAdminPanelSPA
          onBackToHome={() => setMasterAdminOpen(false)}
          onSwitchToMerchantDashboard={() => {
            setMasterAdminOpen(false);
            setExecutiveDashboardOpen(true);
          }}
        />
        <SimulatedEmailNotificationToast />
      </>
    );
  }

  // If executive dashboard is open, render Alexandre's full executive office SPA
  if (executiveDashboardOpen) {
    return (
      <>
        <AlexandreDashboardSPA
          onBackToHome={() => setExecutiveDashboardOpen(false)}
          onOpenAdminPanel={() => {
            setExecutiveDashboardOpen(false);
            setMasterAdminOpen(true);
          }}
        />
        <SimulatedEmailNotificationToast />
      </>
    );
  }

  // If individual Business Landing Page view is active
  if (currentView === 'business-landing' && selectedLandingBusiness) {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#FE3A18] selection:text-white relative">
        <BusinessLandingPage
          business={selectedLandingBusiness}
          initialAdminMode={landingInitialAdminMode}
          onBackToDirectory={() => {
            setCurrentView('directory');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBackToHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onContactWhatsApp={(biz) => handleTriggerWhatsAppContact(biz)}
          onOpenContributorProfile={() => setContributorProfileOpen(true)}
        />

        <Footer
          onOpenDirectory={() => handleOpenDirectory()}
          onOpenLegalModal={(tab) => setLegalModalTab(tab)}
          onOpenAdminPanel={() => setMasterAdminOpen(true)}
        />

        <WhatsAppModal
          businessName={activeWhatsAppBusiness}
          onClose={() => setActiveWhatsAppBusiness(null)}
        />

        <ContributorProfileModal
          isOpen={contributorProfileOpen}
          onClose={() => setContributorProfileOpen(false)}
          onExploreDirectoryToReview={() => handleOpenDirectory()}
        />

        <SimulatedEmailNotificationToast />

        <CookieConsentBanner onOpenLegalModal={(tab) => setLegalModalTab(tab)} />
        <LegalCenterModal
          activeTab={legalModalTab}
          onClose={() => setLegalModalTab(null)}
          onChangeTab={(tab) => setLegalModalTab(tab)}
        />
      </div>
    );
  }

  // If directory view is active, render the full Business Directory Page with AJAX filters
  if (currentView === 'directory') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-[#FE3A18] selection:text-white relative">
        <BusinessDirectoryPage
          onBackToHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenRegisterModal={() => setRegisterModalOpen(true)}
          onOpenLoginModal={() => setLoginModalOpen(true)}
          onOpenExecutiveDashboard={() => setExecutiveDashboardOpen(true)}
          onContactWhatsApp={(biz) => handleTriggerWhatsAppContact(biz)}
          onOpenBusinessLanding={handleOpenBusinessLanding}
          onOpenContributorProfile={() => setContributorProfileOpen(true)}
          initialCategory={directoryInitialCategory}
          initialSearch={directoryInitialSearch}
          initialRadius={directoryInitialRadius}
        />

        <Footer
          onOpenDirectory={() => handleOpenDirectory()}
          onOpenLegalModal={(tab) => setLegalModalTab(tab)}
          onOpenAdminPanel={() => setMasterAdminOpen(true)}
        />

        {/* WhatsApp Modal */}
        <WhatsAppModal
          businessName={activeWhatsAppBusiness}
          onClose={() => setActiveWhatsAppBusiness(null)}
        />

        {/* Simplified Entry & Company Registration Modal */}
        <RegisterBusinessModal
          isOpen={registerModalOpen}
          onClose={() => setRegisterModalOpen(false)}
          onCompleteRegistration={() => {
            setRegisterModalOpen(false);
            setExecutiveDashboardOpen(true);
          }}
        />

        {/* AI Creator Modal (Accessible when explicitly creating ads) */}
        <CacildaAICreatorModal
          isOpen={cacildaModalOpen}
          onClose={() => setCacildaModalOpen(false)}
          onPublishSuccess={(ad) => {
            setPublishedAd(ad);
            setDashboardOpen(true);
          }}
        />

        {/* Login Modal */}
        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => {
            setLoginModalOpen(false);
            setExecutiveDashboardOpen(true);
          }}
          onLoginAdmin={() => {
            setLoginModalOpen(false);
            setMasterAdminOpen(true);
          }}
          onLoginContributor={() => {
            setLoginModalOpen(false);
            setContributorProfileOpen(true);
          }}
        />

        <ContributorProfileModal
          isOpen={contributorProfileOpen}
          onClose={() => setContributorProfileOpen(false)}
          onExploreDirectoryToReview={() => handleOpenDirectory()}
        />

        <CookieConsentBanner onOpenLegalModal={(tab) => setLegalModalTab(tab)} />
        <LegalCenterModal
          activeTab={legalModalTab}
          onClose={() => setLegalModalTab(null)}
          onChangeTab={(tab) => setLegalModalTab(tab)}
        />
        <SimulatedEmailNotificationToast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#FE3A18] selection:text-white relative">
      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Navigation */}
      <Navbar
        onOpenRegisterModal={() => setRegisterModalOpen(true)}
        onOpenLoginModal={() => setLoginModalOpen(true)}
        onOpenExecutiveDashboard={() => setExecutiveDashboardOpen(true)}
        onOpenDirectory={() => handleOpenDirectory()}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="relative">
        <ParallaxBackground />

        {/* Hero Section */}
        <HeroSearch
          onOpenRegisterModal={() => setRegisterModalOpen(true)}
          onOpenDirectory={(search) => handleOpenDirectory('Todos', search)}
          onSelectCategory={(category) => handleOpenDirectory(category, '')}
          onSelectBusiness={(business) => handleOpenBusinessLanding(business)}
          onOpenContributorProfile={() => setContributorProfileOpen(true)}
          activeTab={activeTab}
        />

        {/* Stats & Proof Social */}
        <StatsBanner />

        {/* AI Ad Tech Showcase Section (Disruptive AI emphasis) */}
        <AIAdTechShowcase onOpenRegisterModal={() => setRegisterModalOpen(true)} />

        {/* Bento Grid Categories */}
        <CategoryBentoGrid onSelectCategory={handleSelectCategory} />

        {/* Scrollytelling Timeline / How it works */}
        <HowItWorksTimeline onOpenRegisterModal={() => setRegisterModalOpen(true)} />

        {/* Featured Businesses & Direct WhatsApp */}
        <FeaturedBusinesses
          onContactWhatsApp={(biz) => handleTriggerWhatsAppContact(biz)}
          onOpenDirectory={(category) => handleOpenDirectory(category)}
          onOpenBusinessLanding={handleOpenBusinessLandingById}
        />

        {/* Mobile Ad Mockup Section */}
        <MobileAdMockupSection
          onOpenRegisterModal={() => setRegisterModalOpen(true)}
          onContactWhatsApp={(biz) => handleTriggerWhatsAppContact(biz)}
        />

        {/* Pricing Plans */}
        <PricingSection onSelectPlan={handleSelectPlan} />

        {/* Google Style Testimonials Section */}
        <TestimonialsGoogleSection />

        {/* Business Insights Editorial Hub (Marketing, Local SEO & Digital Growth) */}
        <BusinessInsightsSection onOpenRegisterModal={() => setRegisterModalOpen(true)} />

        {/* FAQ / Objection Handling */}
        <FAQSection />

        {/* Final Conversion CTA */}
        <CTAFinal onOpenRegisterModal={() => setRegisterModalOpen(true)} />
      </main>

      {/* Footer */}
      <Footer
        onOpenDirectory={() => handleOpenDirectory()}
        onOpenLegalModal={(tab) => setLegalModalTab(tab)}
        onOpenAdminPanel={() => setMasterAdminOpen(true)}
      />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsAppButton onClick={() => handleTriggerWhatsAppContact('GuiaPonto Atendimento & Suporte')} />

      {/* Simplified Entry & Company Registration Modal */}
      <RegisterBusinessModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onCompleteRegistration={() => {
          setRegisterModalOpen(false);
          setExecutiveDashboardOpen(true);
        }}
      />

      {/* PRD AI Creator Modal (Cacilda) */}
      <CacildaAICreatorModal
        isOpen={cacildaModalOpen}
        onClose={() => setCacildaModalOpen(false)}
        onPublishSuccess={(ad) => {
          setPublishedAd(ad);
          setDashboardOpen(true);
        }}
      />

      {/* User Dashboard */}
      <UserDashboard
        isOpen={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        publishedAd={publishedAd}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => {
          setLoginModalOpen(false);
          setExecutiveDashboardOpen(true);
        }}
        onLoginAdmin={() => {
          setLoginModalOpen(false);
          setMasterAdminOpen(true);
        }}
        onLoginContributor={() => {
          setLoginModalOpen(false);
          setContributorProfileOpen(true);
        }}
      />

      {/* Contribuidor GuiaPonto Profile (Badges & Levels) */}
      <ContributorProfileModal
        isOpen={contributorProfileOpen}
        onClose={() => setContributorProfileOpen(false)}
        onExploreDirectoryToReview={() => handleOpenDirectory()}
      />

      {/* WhatsApp Modal */}
      <WhatsAppModal
        businessName={activeWhatsAppBusiness}
        onClose={() => setActiveWhatsAppBusiness(null)}
      />

      {/* Mercado Pago Checkout Modal */}
      <MercadoPagoCheckoutModal
        isOpen={mercadoPagoModalOpen}
        onClose={() => setMercadoPagoModalOpen(false)}
        initialPlanId={mercadoPagoPlanId}
      />

      <SimulatedEmailNotificationToast />

      {/* LGPD Cookie Banner & Legal Compliance Hub Modal */}
      <CookieConsentBanner onOpenLegalModal={(tab) => setLegalModalTab(tab)} />
      <LegalCenterModal
        activeTab={legalModalTab}
        onClose={() => setLegalModalTab(null)}
        onChangeTab={(tab) => setLegalModalTab(tab)}
      />
    </div>
  );
}
