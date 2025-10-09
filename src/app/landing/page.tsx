"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features, Testimonial, Pricing, CallToAction } from "@/components/landing/sections";
import { Footer } from "@/components/landing/footer";
import BounceLoader from "@/components/ui/bounce-loader";
import { usePageTransition } from "@/hooks/use-page-transition";

export default function LandingPage() {
  const { navigate, isNavigating } = usePageTransition();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <>
      {/* Bounce Loader during transitions */}
      <AnimatePresence mode="wait">
        {isNavigating && (
          <motion.div
            key="loader"
            className="fixed inset-0 flex items-center justify-center bg-background z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BounceLoader />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main landing content */}
      <motion.div
        animate={{ 
          opacity: isNavigating ? 0 : 1,
          scale: isNavigating ? 0.98 : 1 
        }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-background scroll-smooth"
      >
        <Navbar animate={true} />
        <main className="scroll-container">
          <section id="home">
            <Hero onGetStarted={handleGetStarted} />
          </section>
          <section id="features">
            <Features />
          </section>
          <section id="testimonial">
            <Testimonial />
          </section>
          <section id="pricing">
            <Pricing />
          </section>
          <section id="cta">
            <CallToAction />
          </section>
        </main>
        <Footer />
      </motion.div>
    </>
  );
}