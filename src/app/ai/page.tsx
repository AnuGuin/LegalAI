"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { motion, AnimatePresence } from "framer-motion";
import BounceLoader from "@/components/ui/bounce-loader";
import { usePageTransition } from "@/hooks/use-page-transition";
import { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

export default function AIPage() {
  const { navigate, isNavigating } = usePageTransition();
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const authToken = localStorage.getItem("authToken");
    
    console.log("AI Page: Checking authentication...", { 
      hasUser: !!storedUser, 
      hasToken: !!authToken 
    });
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("AI Page: User found and parsed successfully", parsedUser);
        setUser(parsedUser);
      
        setTimeout(() => {
          setIsCheckingAuth(false);
        }, 300);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        navigate("/auth");
        return;
      }
    } else {
      console.log("AI Page: No user found in localStorage, redirecting to auth");
      navigate("/auth");
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    navigate("/", () => {
      localStorage.removeItem("user");
      setUser(null);
    });
  };

  // Show loader while checking auth or navigating
  if (isCheckingAuth || isNavigating || !user) {
    return (
      <AnimatePresence mode="wait">
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
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ChatInterface user={user} onLogout={handleLogout} />
    </motion.div>
  );
}
