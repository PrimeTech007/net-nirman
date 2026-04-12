import { Routes, Route } from 'react-router-dom';
import { CmsProvider } from './data/cmsProvider';
import Navbar from './components/Navbar';
import PageLoader from './components/PageLoader';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import ClientsPage from './pages/ClientsPage';
import ProjectPage from './pages/ProjectPage';
import HeroSection from './sections/HeroSection';
import ProblemSolutionSection from './sections/ProblemSolutionSection';
import FreeDemoSection from './sections/FreeDemoSection';
import ProjectsSection from './sections/ProjectsSection';
import ProcessSection from './sections/ProcessSection';
import PricingSection from './sections/PricingSection';
import TrustSection from './sections/TrustSection';
import AboutSection from './sections/AboutSection';
import ReviewsSection from './sections/ReviewsSection';
import TeamSection from './sections/TeamSection';
import ContactSection from './sections/ContactSection';
import Chatbot from './components/Chatbot';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '72px' }}>
        {children}
      </main>
      <Chatbot />
      <Footer />
    </>
  );
}

function Home() {
  return (
    <Layout>
      <HeroSection />
      <ProblemSolutionSection />
      <FreeDemoSection />
      <ProjectsSection />
      <ProcessSection />
      <TrustSection />
      <ReviewsSection />
      <div style={{ paddingBottom: '60px' }}></div>
    </Layout>
  );
}

function About() {
  return (
    <Layout>
      <AboutSection />
      <TeamSection />
    </Layout>
  );
}

function Pricing() {
  return (
    <Layout>
      <PricingSection />
    </Layout>
  );
}

function Contact() {
  return (
    <Layout>
      <ContactSection />
    </Layout>
  );
}

function Work() {
  return (
    <Layout>
      <ProjectsSection />
    </Layout>
  );
}

export default function App() {
  return (
    <CmsProvider>
      <div className="noise-overlay">
        <PageLoader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/work" element={<Work />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/dashboard/clients" element={<ClientsPage />} />
          <Route path="/dashboard/project/:id" element={<ProjectPage />} />
        </Routes>
      </div>
    </CmsProvider>
  );
}
