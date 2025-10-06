"use client";

import { AuthPage } from "@/components/auth/auth-page";
import { motion, AnimatePresence } from "framer-motion";
import BounceLoader from "@/components/ui/bounce-loader";
import { usePageTransition } from "@/hooks/use-page-transition";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

export default function AuthenticationPage() {
  const { navigate, isNavigating } = usePageTransition();

  const handleAuthenticated = (userData: User) => {
    navigate("/ai");
  };

  return (
    <>
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

      <motion.div
        animate={{ 
          opacity: isNavigating ? 0 : 1,
          scale: isNavigating ? 0.95 : 1 
        }}
        transition={{ duration: 0.3 }}
      >
        <AuthPage onAuthenticated={handleAuthenticated} />
      </motion.div>
    </>
  );
}