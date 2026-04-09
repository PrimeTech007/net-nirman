import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CmsProvider } from './data/cmsProvider';
import Navbar from './components/Navbar';
import PageLoader from './components/PageLoader';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import HeroSection from './sections/HeroSection';
import ProblemSolutionSection from './sections/ProblemSolutionSection';
import FreeDemoSection from './sections/FreeDemoSection';
import ProjectsSection from './sections/ProjectsSection';
import ProcessSection from './sections/ProcessSection';
import PricingSection from './sections/PricingSection';
import TrustSection from './sections/TrustSection';
import AboutSection from './sections/AboutSection';
import ReviewsSection from './sections/ReviewsSection';
import ContactSection from './sections/ContactSection';
import Chatbot from './components/Chatbot';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

function MainWebsite() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSolutionSection />
        <FreeDemoSection />
        <ProjectsSection />
        <ProcessSection />
        <PricingSection />
        <TrustSection />
        <AboutSection />
        <ReviewsSection />
        <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
          <ContactSection />
        </GoogleReCaptchaProvider>
      </main>
      <Chatbot />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <CmsProvider>
      <div className="noise-overlay">
        <PageLoader />
        <Routes>
          <Route path="/" element={<MainWebsite />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </CmsProvider>
  );
}
