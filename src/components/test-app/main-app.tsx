"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features, Testimonial, Pricing, CallToAction } from "@/components/landing/sections";
import { Footer } from "@/components/landing/footer";
import { AuthPage } from "@/components/auth/auth-page";
import { ChatInterface } from "@/components/chat/chat-interface";
import BounceLoader from "@/components/ui/bounce-loader";

type AppState = "landing" | "auth" | "chat";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

export function MainApp() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [user, setUser] = useState<User | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleGetStarted = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setAppState("auth");
      setIsTransitioning(false);
    }, 800);
  };

  const handleAuthenticated = (userData: User) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setUser(userData);
      setAppState("chat");
      setIsTransitioning(false);
    }, 800);
  };

  const handleLogout = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setUser(null);
      setAppState("landing");
      setIsTransitioning(false);
    }, 800);
  };

  return (
    <>
      {/* Loader only during transitions */}
      <AnimatePresence>
        {isTransitioning && (
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

      {/* Main app content */}
      {!isTransitioning && (
        <>
          {appState === "landing" && (
            <div className="min-h-screen bg-background scroll-smooth">
              <Navbar animate={true} />
              <main className="scroll-container">
                <Hero onGetStarted={handleGetStarted} />
                <Features />
                <Testimonial />
                <Pricing />
                <CallToAction />
              </main>
              <Footer />
            </div>
          )}

          {appState === "auth" && (
            <div>
              <AuthPage onAuthenticated={handleAuthenticated} />
            </div>
          )}

          {appState === "chat" && (
            <div>
              {user ? (
                <ChatInterface user={user} onLogout={handleLogout} />
              ) : (
                <AuthPage onAuthenticated={handleAuthenticated} />
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
