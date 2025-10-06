"use client";

import CardFlip from "@/components/ui/card-flip";
import { TestimonialCard } from "@/components/ui/testimonial-card";

import { Brain, FileText, Shield } from "lucide-react";
import { useGSAP } from "@/hooks/use-gsap";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      title: "AI-Powered Analysis",
      subtitle: "Instant legal insights",
      description:
        "Get instant insights and analysis of complex legal documents with our advanced AI technology.",
      features: [
        "Document Analysis",
        "Risk Assessment",
        "Legal Research",
        "Case Precedents",
      ],
      icon: Brain,
    },
    {
      title: "Document Generation",
      subtitle: "Smart legal templates",
      description:
        "Create professional legal documents quickly with our intelligent template system.",
      features: [
        "Smart Templates",
        "Auto-Fill Data",
        "Version Control",
        "Collaboration Tools",
      ],
      icon: FileText,
    },
    {
      title: "Secure & Compliant",
      subtitle: "Enterprise-grade security",
      description:
        "Enterprise-grade security with full compliance to legal industry standards and regulations.",
      features: [
        "End-to-End Encryption",
        "GDPR Compliant",
        "Audit Trails",
        "Access Controls",
      ],
      icon: Shield,
    },
  ];

  useGSAP(() => {
    if (!sectionRef.current || !headerRef.current || !cardsRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // Set initial states for better performance
    gsap.set(headerRef.current.children, {
      y: 30,
      opacity: 0,
      force3D: true,
    });

    gsap.set(cardsRef.current.children, {
      y: 40,
      opacity: 0,
      scale: 0.95,
      force3D: true,
    });

    // Header animation - optimized
    gsap.to(headerRef.current.children, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
      force3D: true,
      scrollTrigger: {
        trigger: headerRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
    });

    // Cards animation - optimized
    gsap.to(cardsRef.current.children, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.75,
      stagger: 0.12,
      ease: "power3.out",
      force3D: true,
      scrollTrigger: {
        trigger: cardsRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="min-h-screen w-full py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative px-4 sm:px-6 lg:px-8 overflow-hidden will-change-transform"
      style={{ transform: "translateZ(0)" }}
    >
      {/* Top Fade Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div ref={headerRef} className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent">
            Powerful Features for Everyone
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Discover how LegalAI transforms your legal workflow with
            cutting-edge AI technology
          </p>
        </div>

        <div ref={cardsRef} className="flex flex-wrap justify-center gap-8">
          {features.map((feature, index) => (
            <CardFlip
              key={index}
              title={feature.title}
              subtitle={feature.subtitle}
              description={feature.description}
              features={feature.features}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonial() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      name: "Pramit Jana",
      role: "Senior Partner",
      company: "Smith & Associates",
      content:
        "LegalAI has revolutionized how we handle document review. What used to take hours now takes minutes.",
      rating: 5,
      avatar: "PJ",
    },
    {
      name: "Saptashwa Ghosh",
      role: "Corporate Lawyer",
      company: "TechCorp",
      content:
        "The AI-powered contract analysis is incredibly accurate. It's like having a senior associate available 24/7.",
      rating: 5,
      avatar: "SG",
    },
    {
      name: "Sujoy Kumar Guin",
      role: "Legal Director",
      company: "StartupLaw",
      content:
        "LegalAI helps us provide better service to our clients while reducing costs. It's a game-changer.",
      rating: 5,
      avatar: "SG",
    },
    {
      name: "Anindya Guin",
      role: "Managing Partner",
      company: "Chen & Partners",
      content:
        "The document generation feature has streamlined our workflow significantly. Our team is more productive than ever.",
      rating: 5,
      avatar: "AG",
    },
    {
      name: "Debojyoti Sarkar",
      role: "Associate",
      company: "Rodriguez Law Firm",
      content:
        "As a young lawyer, LegalAI has been invaluable in helping me research cases and draft documents efficiently.",
      rating: 5,
      avatar: "ER",
    },
    {
      name: "Agnijit Basu",
      role: "General Counsel",
      company: "Thompson Industries",
      content:
        "The compliance features ensure we never miss important regulatory requirements. It's peace of mind.",
      rating: 5,
      avatar: "AB",
    },
    {
      name: "Soumarya Pal",
      role: "IP Attorney",
      company: "Wang IP Law",
      content:
        "LegalAI's patent analysis capabilities have transformed how we approach intellectual property cases.",
      rating: 5,
      avatar: "SP",
    },
    {
      name: "Debosmita Ghosh",
      role: "Criminal Defense Attorney",
      company: "Miller Defense",
      content:
        "The case research functionality helps me build stronger defenses for my clients. Highly recommended.",
      rating: 5,
      avatar: "DG",
    },
    {
      name: "Piyasa Chatterjee",
      role: "Family Law Attorney",
      company: "Foster Family Law",
      content:
        "LegalAI makes complex family law cases more manageable. The document templates are excellent.",
      rating: 5,
      avatar: "AF",
    },
    {
      name: "Soumajit Halder",
      role: "Tax Attorney",
      company: "Park Tax Law",
      content:
        "The tax code analysis feature is incredibly thorough. It catches details I might have missed.",
      rating: 5,
      avatar: "SH",
    },
  ];

  // Split testimonials into two rows
  const firstRow = testimonials.slice(0, 5);
  const secondRow = testimonials.slice(5, 10);

  useGSAP(() => {
    if (
      !sectionRef.current ||
      !headerRef.current ||
      !row1Ref.current ||
      !row2Ref.current
    )
      return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Header animation
    gsap.fromTo(
      headerRef.current.children,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Row animations with stagger
    gsap.fromTo(
      [row1Ref.current, row2Ref.current],
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonial"
      className="relative py-20 overflow-hidden scroll-container gpu-accelerated w-full"
    >
      {/* Full-width background with extended blur */}
      <div className="absolute inset-0 w-screen left-1/2 transform -translate-x-1/2 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30 dark:from-blue-950/30 dark:via-transparent dark:to-indigo-950/30" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent mt-8 p-2">
            Trusted by Legal Professionals
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            See what our clients say about transforming their legal practice
            with LegalAI
          </p>
        </div>

        <div className="relative space-y-1 h-[600px] w-full">
          {/* Enhanced fade masks for full width coverage */}
          <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-background via-background/90 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-background via-background/90 to-transparent z-20 pointer-events-none" />

          {/* First row - Left to Right */}
          <div className="relative overflow-hidden h-[295px] flex items-center w-full">
            <div
              ref={row1Ref}
              className="testimonial-scroll-left flex gap-6"
              style={{ width: "max-content" }}
            >
              {/* Create seamless loop with 6 copies for smoother animation */}
              {Array.from({ length: 6 }, (_, setIndex) =>
                firstRow.map((testimonial, index) => (
                  <TestimonialCard
                    key={`row1-set${setIndex}-${index}`}
                    name={testimonial.name}
                    role={testimonial.role}
                    company={testimonial.company}
                    content={testimonial.content}
                    rating={testimonial.rating}
                    avatar={testimonial.avatar}
                  />
                ))
              )}
            </div>
          </div>

          {/* Second row - Right to Left */}
          <div className="relative overflow-hidden h-[295px] flex items-center w-full">
            <div
              ref={row2Ref}
              className="testimonial-scroll-right flex gap-6"
              style={{ width: "max-content" }}
            >
              {/* Create seamless loop with 6 copies for smoother animation */}
              {Array.from({ length: 6 }, (_, setIndex) =>
                secondRow.map((testimonial, index) => (
                  <TestimonialCard
                    key={`row2-set${setIndex}-${index}`}
                    name={testimonial.name}
                    role={testimonial.role}
                    company={testimonial.company}
                    content={testimonial.content}
                    rating={testimonial.rating}
                    avatar={testimonial.avatar}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes testimonialScrollLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-16.666%, 0, 0);
          }
        }

        @keyframes testimonialScrollRight {
          0% {
            transform: translate3d(-16.666%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        .testimonial-scroll-left {
          animation: testimonialScrollLeft 30s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        .testimonial-scroll-right {
          animation: testimonialScrollRight 30s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        .testimonial-scroll-left:hover,
        .testimonial-scroll-right:hover {
          animation-play-state: paused;
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .testimonial-scroll-left,
          .testimonial-scroll-right {
            animation: none;
          }
        }

        /* Performance optimizations */
        .testimonial-scroll-left,
        .testimonial-scroll-right {
          contain: layout style paint;
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
        }
      `}</style>
    </section>
  );
}

export function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !headerRef.current || !cardsRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // Set initial states for better performance
    gsap.set(headerRef.current.children, {
      y: 30,
      opacity: 0,
      force3D: true,
    });

    gsap.set(cardsRef.current.children, {
      y: 40,
      opacity: 0,
      scale: 0.98,
      force3D: true,
    });

    // Header animation - optimized
    gsap.to(headerRef.current.children, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
      force3D: true,
      scrollTrigger: {
        trigger: headerRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
    });

    // Cards animation - optimized
    gsap.to(cardsRef.current.children, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: "power3.out",
      force3D: true,
      scrollTrigger: {
        trigger: cardsRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden will-change-transform"
      style={{ transform: "translateZ(0)" }}
    >
      {/* Enhanced background with beams effect */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/40 via-indigo-50/20 to-blue-100/40 dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-blue-900/40" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(45deg, rgba(59, 130, 246, 0.05) 0%, transparent 25%, transparent 75%, rgba(99, 102, 241, 0.05) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose the plan that fits your practice. All plans include our core
            AI features.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          <div className="bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-border/50 hover:shadow-xl hover:border-blue-200/50 dark:hover:border-blue-800/50 transition-all duration-300 group">
            <h3 className="text-2xl font-bold text-card-foreground mb-4 group-hover:text-blue-600 transition-colors">
              Starter
            </h3>
            <div className="mb-6">
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Free
              </span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Up to 50 documents/month
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Basic AI analysis
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Email support
              </li>
            </ul>
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Get Started
            </button>
          </div>

          <div className="bg-card/90 backdrop-blur-sm p-8 rounded-xl shadow-xl border-2 border-blue-500/50 relative transform scale-105 hover:scale-110 transition-all duration-300 group">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                Most Popular
              </span>
            </div>
            <h3 className="text-2xl font-bold text-card-foreground mb-4 group-hover:text-blue-600 transition-colors">
              Professional
            </h3>
            <div className="mb-6">
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ₹4,999
              </span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Up to 1,000 documents/month
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Advanced AI analysis
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Priority support
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Custom templates
              </li>
            </ul>
            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Get Started
            </button>
          </div>

          <div className="bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-border/50 hover:shadow-xl hover:border-indigo-200/50 dark:hover:border-indigo-800/50 transition-all duration-300 group">
            <h3 className="text-2xl font-bold text-card-foreground mb-4 group-hover:text-indigo-600 transition-colors">
              Enterprise
            </h3>
            <div className="mb-6">
              <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ₹89,999
              </span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-indigo-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Unlimited documents
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-indigo-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Premium AI features
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-indigo-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                24/7 phone support
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-indigo-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Custom integrations
              </li>
            </ul>
            <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CallToAction() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !contentRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // Content animation
    gsap.fromTo(
      contentRef.current.children,
      {
        y: 80,
        opacity: 0,
        scale: 0.9,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
    >
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div ref={contentRef} className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Ready to Transform Your{" "}
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent">
              Legal Practice?
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed max-w-3xl mx-auto">
            Join thousands of legal professionals who are already using LegalAI
            to streamline their workflow and deliver better results for their
            clients.
          </p>

          <div className="flex justify-center items-center">
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 min-w-[200px]">
              Start Free Trial
            </button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/60">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
