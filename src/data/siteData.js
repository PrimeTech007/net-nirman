/* ═══════════════════════════════════════════════════════════════
 * NET NIRMAN — SITE DATA / CMS CONFIG
 * ═══════════════════════════════════════════════════════════════
 * This file is the SINGLE SOURCE OF TRUTH for all website content.
 * Edit any value here to update the live site.
 * The built-in admin panel also reads/writes from localStorage,
 * falling back to these defaults.
 * ═══════════════════════════════════════════════════════════════ */

// ─── SITE CONFIG ────────────────────────────────────────────
export const siteConfig = {
  name: "Net Nirman",
  tagline: "Grow Your Business Online",
  email: "hello@netnirman.com",
  whatsapp: "+91 9876543210",
  phone: "+91 9876543210",
  adminPassword: "netnirman2024", // Change this!
  socialLinks: {
    twitter: "https://twitter.com/netnirman",
    linkedin: "https://linkedin.com/company/netnirman",
    github: "https://github.com/netnirman",
    instagram: "https://instagram.com/netnirman",
  },
};

// ─── HERO SECTION ───────────────────────────────────────────
export const heroData = {
  badge: "🚀 Trusted by Growing Businesses",
  headline: "Get More Customers For Your Business With a High-Converting Website",
  subtext:
    "I build fast, modern websites that help you grow online — designed to turn every visitor into a paying customer.",
  ctaPrimary: "Get Free Demo",
  ctaSecondary: "View Work",
  ctaPrimaryLink: "#contact",
  ctaSecondaryLink: "#projects",
  // Stats shown below hero
  stats: [
    { value: "50+", label: "Businesses Helped" },
    { value: "3x", label: "Avg. Traffic Increase" },
    { value: "< 2s", label: "Page Load Time" },
    { value: "24/7", label: "Support" },
  ],
};

// ─── PROBLEM → SOLUTION ────────────────────────────────────
export const problemSolutionData = {
  sectionTitle: "Is Your Business Invisible Online?",
  sectionSubtitle:
    "Most small businesses lose customers every day because of these problems:",
  problems: [
    {
      icon: "noWebsite",
      title: "No Website = No Customers",
      description:
        "If your business isn't online, customers can't find you. Your competitors are stealing them right now.",
    },
    {
      icon: "slowSite",
      title: "Slow Website = Lost Trust",
      description:
        "53% of visitors leave if your site takes more than 3 seconds to load. That's money walking out the door.",
    },
    {
      icon: "uglyDesign",
      title: "Outdated Design = No Credibility",
      description:
        "94% of first impressions are design-related. An old website makes your business look unreliable.",
    },
    {
      icon: "noLeads",
      title: "No Strategy = No Leads",
      description:
        "A pretty website without conversion strategy is just a digital brochure collecting dust.",
    },
  ],
  solutionTitle: "I Fix This For You",
  solutionSubtitle:
    "Every website I build is designed with one goal: growing your business.",
  solutions: [
    {
      icon: "lightning",
      title: "Lightning-Fast Websites",
      description:
        "Your site loads in under 2 seconds — keeping visitors engaged and boosting your Google ranking.",
      benefit: "More visitors stay → More sales",
    },
    {
      icon: "conversion",
      title: "Conversion-Optimized Design",
      description:
        "Every button, headline, and layout is strategically placed to guide visitors toward taking action.",
      benefit: "More clicks → More customers",
    },
    {
      icon: "mobile",
      title: "Perfect on Every Device",
      description:
        "70% of your customers are on mobile. Your site will look stunning on phones, tablets, and desktops.",
      benefit: "More reach → More opportunities",
    },
    {
      icon: "seo",
      title: "Built-In SEO",
      description:
        "Technical SEO baked into every page so Google sends you free, organic traffic every month.",
      benefit: "Free traffic → Free leads",
    },
  ],
};

// ─── FREE DEMO OFFER ───────────────────────────────────────
export const freeDemoData = {
  sectionTitle: "Try Before You Pay",
  headline: "I Will Create a FREE Demo Website For Your Business",
  subtext:
    "No risk, no commitment. I'll build a working preview of your website so you can see exactly what you're getting — before spending a single rupee.",
  features: [
    "Custom design tailored to your business",
    "Fully functional demo you can test",
    "No upfront payment required",
    "Ready in 3-5 business days",
    "100% satisfaction guarantee",
  ],
  ctaText: "Get Your Free Demo Now",
  ctaLink: "#contact",
};

// ─── DEMO PROJECTS ─────────────────────────────────────────
export const projectsData = {
  sectionTitle: "See What's Possible",
  sectionSubtitle:
    "These demo projects show the quality and results-driven approach we bring to every client.",
  projects: [
    {
      id: 1,
      label: "Demo Project",
      title: "Restaurant Booking Platform",
      description:
        "A modern restaurant website designed to increase table bookings by 40% with an integrated reservation system and menu showcase.",
      businessBenefit: "Designed to increase bookings by 40%",
      features: [
        "Online Reservation System",
        "Digital Menu with Photos",
        "Customer Reviews Integration",
        "Google Maps & Directions",
      ],
      image: null,
      demoUrl: "#",
      accentColor: "#7c3aed",
    },
    {
      id: 2,
      label: "Demo Project",
      title: "Coaching Business Website",
      description:
        "A lead-generation focused website for a business coach, converting visitors into booked consultations through strategic design.",
      businessBenefit: "Designed to generate 50+ leads/month",
      features: [
        "Lead Capture Forms",
        "Testimonial Showcase",
        "Calendar Booking Integration",
        "Free Resource Downloads",
      ],
      image: null,
      demoUrl: "#",
      accentColor: "#22c55e",
    },
    {
      id: 3,
      label: "Demo Project",
      title: "E-Commerce Storefront",
      description:
        "A high-converting online store with seamless checkout flow, designed to maximize average order value and reduce cart abandonment.",
      businessBenefit: "Designed to reduce cart abandonment by 35%",
      features: [
        "One-Click Checkout",
        "Product Recommendations",
        "Inventory Management",
        "Payment Integration",
      ],
      image: null,
      demoUrl: "#",
      accentColor: "#38bdf8",
    },
  ],
};

// ─── PROCESS ───────────────────────────────────────────────
export const processData = {
  sectionTitle: "How It Works",
  sectionSubtitle:
    "A simple, transparent process designed to get your website live — fast.",
  steps: [
    {
      number: "01",
      title: "Requirement Discussion",
      description:
        "We hop on a call and I learn everything about your business, your customers, and your goals.",
      icon: "chat",
      duration: "Day 1",
    },
    {
      number: "02",
      title: "Free Demo Creation",
      description:
        "I build a working demo of your website — completely free. You see exactly what you're getting.",
      icon: "preview",
      duration: "Day 3-5",
    },
    {
      number: "03",
      title: "Review & Feedback",
      description:
        "You review the demo, share feedback, and we refine it until you're 100% satisfied.",
      icon: "review",
      duration: "Day 5-7",
    },
    {
      number: "04",
      title: "Final Development",
      description:
        "Once approved, I build the full production version with all features, SEO, and performance optimizations.",
      icon: "code",
      duration: "Day 7-14",
    },
    {
      number: "05",
      title: "Launch & Support",
      description:
        "Your website goes live. I handle deployment, domain setup, and provide ongoing support.",
      icon: "rocket",
      duration: "Day 14+",
    },
  ],
};

// ─── PRICING ───────────────────────────────────────────────
export const pricingData = {
  sectionTitle: "Simple, Transparent Pricing",
  sectionSubtitle:
    "No hidden fees. No surprises. Choose the plan that fits your business.",
  plans: [
    {
      name: "Starter",
      price: "₹9,999",
      period: "one-time",
      description:
        "Perfect for small businesses that need a professional online presence.",
      features: [
        "Single Page Website",
        "Mobile Responsive Design",
        "Contact Form",
        "Basic SEO Setup",
        "3 Design Revisions",
        "1 Month Free Support",
      ],
      highlighted: false,
      ctaText: "Get Started",
      ctaLink: "#contact",
    },
    {
      name: "Business",
      price: "₹24,999",
      period: "one-time",
      description:
        "For growing businesses that need a conversion-focused website.",
      features: [
        "Up to 5 Pages",
        "Custom UI/UX Design",
        "Advanced SEO Optimization",
        "Google Analytics Setup",
        "WhatsApp Integration",
        "Lead Capture System",
        "Unlimited Revisions",
        "3 Months Free Support",
      ],
      highlighted: true,
      badge: "Most Popular",
      ctaText: "Get Started",
      ctaLink: "#contact",
    },
    {
      name: "Advanced",
      price: "₹49,999",
      period: "one-time",
      description:
        "For businesses that need a full-featured web application.",
      features: [
        "Unlimited Pages",
        "E-Commerce / Dashboard",
        "Custom Backend & API",
        "Payment Gateway Integration",
        "Admin Panel",
        "Performance Optimization",
        "Priority Support",
        "6 Months Free Support",
      ],
      highlighted: false,
      ctaText: "Get Started",
      ctaLink: "#contact",
    },
  ],
};

// ─── TRUST / WHY CHOOSE ────────────────────────────────────
export const trustData = {
  sectionTitle: "Why Businesses Trust Net Nirman",
  sectionSubtitle:
    "Here's what makes working with me different.",
  points: [
    {
      icon: "demo",
      title: "Free Demo Before Payment",
      description:
        "See a working demo of your website before you spend anything. Zero risk.",
    },
    {
      icon: "speed",
      title: "Fast Delivery",
      description:
        "Your website goes live in 7-14 days — not weeks or months.",
    },
    {
      icon: "communication",
      title: "Direct Communication",
      description:
        "Talk to me directly on WhatsApp. No middlemen, no support tickets.",
    },
    {
      icon: "affordable",
      title: "Affordable Premium Quality",
      description:
        "Enterprise-grade websites at prices small businesses can actually afford.",
    },
    {
      icon: "custom",
      title: "100% Custom Websites",
      description:
        "No templates, no page builders. Every website is built from scratch for your brand.",
    },
    {
      icon: "support",
      title: "Post-Launch Support",
      description:
        "I don't disappear after delivery. Free support included with every plan.",
    },
  ],
};

// ─── ABOUT ─────────────────────────────────────────────────
export const aboutData = {
  sectionTitle: "About Net Nirman",
  heading: "I'm Building Net Nirman to Help Small Businesses Grow Online",
  paragraphs: [
    "Most small businesses can't afford the agencies that charge lakhs for a website. And the cheap alternatives? They deliver templates that look like everyone else's.",
    "That's why I started Net Nirman — to bridge the gap. I build premium, custom websites at prices that actually make sense for growing businesses.",
    "My approach is simple: I build you a free demo first. If you love it, we move forward. If not, no hard feelings. Your success is my success.",
  ],
  stats: [
    { value: "50+", label: "Projects Delivered" },
    { value: "100%", label: "Client Satisfaction" },
    { value: "< 2s", label: "Avg. Load Time" },
    { value: "24/7", label: "Support Available" },
  ],
};

// ─── CLIENT REVIEWS (PLACEHOLDERS) ─────────────────────────
export const reviewsData = {
  sectionTitle: "What Our Clients Say",
  sectionSubtitle: "Reviews coming soon — we're just getting started!",
  reviews: [
    {
      id: 1,
      name: "Client Name",
      role: "Business Owner",
      content:
        "Your review will appear here. We're currently onboarding our first clients.",
      rating: 5,
      avatar: null,
      isPlaceholder: true,
    },
    {
      id: 2,
      name: "Client Name",
      role: "Startup Founder",
      content:
        "Your review will appear here. We're currently onboarding our first clients.",
      rating: 5,
      avatar: null,
      isPlaceholder: true,
    },
    {
      id: 3,
      name: "Client Name",
      role: "Restaurant Owner",
      content:
        "Your review will appear here. We're currently onboarding our first clients.",
      rating: 5,
      avatar: null,
      isPlaceholder: true,
    },
  ],
};

// ─── CONTACT ───────────────────────────────────────────────
export const contactData = {
  sectionTitle: "Let's Grow Your Business",
  sectionSubtitle:
    "Ready to get more customers? Book a free consultation today.",
  highlights: [
    "🎯 Free consultation — no obligation",
    "⚡ Reply within 24 hours",
    "🎁 Get a free demo website",
  ],
  formFields: {
    name: "Your Name",
    email: "Your Email",
    message: "Tell me about your business and goals...",
  },
  submitText: "Book Free Consultation",
  whatsappText: "Chat on WhatsApp",
};

// ─── NAVIGATION ────────────────────────────────────────────
export const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Work", href: "#projects" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
