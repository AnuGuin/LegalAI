"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  showText?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "sidebar";
}

export function Logo({ 
  collapsed = false, 
  showText = true, 
  onClick, 
  className,
  variant = "default" 
}: LogoProps) {
  const isClickable = !!onClick;
  
  const content = (
    <motion.div
      className={cn(
        "flex items-center",
        variant === "sidebar" ? "gap-2" : "space-x-2",
        className
      )}
      whileHover={isClickable ? { scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div
        className={cn(
          "flex items-center justify-center rounded-lg relative overflow-hidden transition-all duration-300 ease-in-out",
          variant === "sidebar" ? "h-8 w-8" : "h-8 w-8",
          collapsed ? "bg-transparent shadow-none" : "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg"
        )}
        whileHover={isClickable ? { 
          scale: 1.05,
          rotate: collapsed ? 0 : 5 
        } : undefined}
        whileTap={isClickable ? { scale: 0.95 } : undefined}
        animate={{
          background: collapsed 
            ? "transparent" 
            : "linear-gradient(135deg, rgb(59 130 246), rgb(99 102 241))",
          boxShadow: collapsed 
            ? "0 0 0 0 rgba(0, 0, 0, 0)" 
            : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          scale: collapsed && isClickable ? [1, 1.02, 1] : 1
        }}
        transition={{
          scale: {
            duration: 2,
            repeat: collapsed && isClickable ? Infinity : 0,
            ease: "easeInOut"
          },
          background: { duration: 0.3 },
          boxShadow: { duration: 0.3 },
          default: { type: "spring", stiffness: 400, damping: 17 }
        }}
      >
        <AnimatePresence mode="wait">
          {collapsed ? (
            <motion.svg
              key="collapse-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "icon icon-tabler icons-tabler-outline icon-tabler-layout-sidebar-left-collapse",
                variant === "sidebar" ? "text-neutral-300" : "text-gray-600 dark:text-gray-300"
              )}
              initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
              transition={{ 
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
              <path d="M9 4v16" />
              <path d="M15 10l-2 2l2 2" />
            </motion.svg>
          ) : (
            <motion.svg
              key="gavel-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-gavel text-white"
              initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
              transition={{ 
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M13 10l7.383 7.418c.823 .82 .823 2.148 0 2.967a2.11 2.11 0 0 1 -2.976 0l-7.407 -7.385" />
              <path d="M6 9l4 4" />
              <path d="M13 10l-4 -4" />
              <path d="M3 21h7" />
              <path d="M6.793 15.793l-3.586 -3.586a1 1 0 0 1 0 -1.414l2.293 -2.293l.5 .5l3 -3l-.5 -.5l2.293 -2.293a1 1 0 0 1 1.414 0l3.586 3.586a1 1 0 0 1 0 1.414l-2.293 2.293l-.5 -.5l-3 3l.5 .5l-2.293 2.293a1 1 0 0 1 -1.414 0z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
      
      <AnimatePresence>
        {showText && !collapsed && (
          <motion.span
            className={cn(
              "font-bold bg-gradient-to-r bg-clip-text text-transparent",
              variant === "sidebar" 
                ? "text-lg text-neutral-100" 
                : "text-xl from-gray-900 to-gray-600 dark:from-white dark:to-gray-300"
            )}
            initial={{ opacity: 0, x: -10, width: 0 }}
            animate={{ opacity: 1, x: 0, width: "auto" }}
            exit={{ opacity: 0, x: -10, width: 0 }}
            transition={{ 
              duration: 0.3,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            LegalAI
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (isClickable) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "relative z-20 flex items-center rounded-xl text-sm font-medium transition-all duration-300 ease-in-out",
          variant === "sidebar" 
            ? "text-neutral-100 hover:bg-neutral-700 p-2" 
            : "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        )}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {content}
      </button>
    );
  }

  return content;
}