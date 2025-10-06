"use client";

import { cn } from "@/lib/utils";
import { ArrowRight, Copy, Rocket, Zap } from "lucide-react";
import { useState } from "react";

export interface CardFlipProps {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  icon?: React.ComponentType<{ className?: string }>;
}

export default function CardFlip({
  title = "Build MVPs Fast",
  subtitle = "Launch your idea in record time",
  description = "Copy, paste, customize—and launch your MVP faster than ever with our developer-first component library.",
  features = [
    "Copy & Paste Ready",
    "Developer-First",
    "MVP Optimized",
    "Zero Setup Required",
  ],
  icon: IconComponent = Rocket,
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group relative h-[360px] w-full max-w-[300px] [perspective:2000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          'relative h-full w-full flip-inner',
          isFlipped ? 'is-flipped' : ''
        )}
      >
        {/* Front of card */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full",
            "[transform:rotateY(0deg)] [backface-visibility:hidden]",
            "overflow-hidden rounded-2xl",
            "bg-gradient-to-br from-white via-slate-50 to-slate-100",
            "dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800",
            "border border-slate-200 dark:border-zinc-800/50",
            "shadow-lg dark:shadow-xl",
            "transition-all duration-700 ease-in-out",
            "group-hover:shadow-xl dark:group-hover:shadow-2xl",
            "group-hover:border-blue-500/20 dark:group-hover:border-blue-500/30"
          )}
        >
          {/* Background gradient effect */}
          <div className="from-blue-500/5 dark:from-blue-500/10 absolute inset-0 bg-gradient-to-br via-transparent to-blue-500/5 dark:to-blue-500/10" />

          {/* Animated code blocks */}
          <div className="absolute inset-0 flex items-center justify-center pt-20">
            <div className="relative flex h-[100px] w-[200px] flex-col items-center justify-center gap-2">
              {/* Code blocks animation */}
              {[...Array(6)].map((_, i) => {
                // Use deterministic values based on index to avoid hydration mismatch
                const widths = [75, 85, 65, 90, 70, 80];
                const margins = [5, 12, 8, 15, 3, 10];

                return (
                  <div
                    key={i}
                    className={cn(
                      "h-3 w-full rounded-sm",
                      "from-blue-500/20 via-blue-500/30 to-blue-500/20 bg-gradient-to-r",
                      "animate-[slideIn_2s_ease-in-out_infinite]",
                      "opacity-0"
                    )}
                    style={{
                      width: `${widths[i]}%`,
                      animationDelay: `${i * 0.2}s`,
                      marginLeft: `${margins[i]}%`,
                    }}
                  />
                );
              })}

              {/* Central icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={cn(
                    "h-12 w-12 rounded-xl",
                    "from-blue-500 via-blue-500/90 to-blue-500/80 bg-gradient-to-br",
                    "flex items-center justify-center",
                    "shadow-blue-500/25 shadow-lg",
                    "animate-pulse",
                    "transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
                  )}
                >
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom content */}
          <div className="absolute right-0 bottom-0 left-0 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5">
                <h3 className="text-lg leading-snug font-semibold tracking-tight text-zinc-900 transition-all duration-500 ease-out group-hover:translate-y-[-4px] dark:text-white">
                  {title}
                </h3>
                <p className="line-clamp-2 text-sm tracking-tight text-zinc-600 transition-all delay-[50ms] duration-500 ease-out group-hover:translate-y-[-4px] dark:text-zinc-300">
                  {subtitle}
                </p>
              </div>
              <div className="group/icon relative">
                <div
                  className={cn(
                    "absolute inset-[-8px] rounded-lg transition-opacity duration-300",
                    "from-blue-500/20 via-blue-500/10 bg-gradient-to-br to-transparent",
                    "opacity-0 group-hover/icon:opacity-100"
                  )}
                />
                <Zap className="text-blue-500 relative z-10 h-5 w-5 transition-all duration-300 group-hover/icon:scale-110 group-hover/icon:rotate-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full",
            "[transform:rotateY(180deg)] [backface-visibility:hidden]",
            "rounded-2xl p-5",
            "bg-gradient-to-br from-white via-slate-50 to-slate-100",
            "dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800",
            "border border-slate-200 dark:border-zinc-800",
            "shadow-lg dark:shadow-xl",
            "flex flex-col",
            "transition-all duration-700 ease-in-out",
            "group-hover:shadow-xl dark:group-hover:shadow-2xl",
            "group-hover:border-blue-500/20 dark:group-hover:border-blue-500/30"
          )}
        >
          {/* Background gradient */}
          <div className="from-blue-500/5 dark:from-blue-500/10 absolute inset-0 rounded-2xl bg-gradient-to-br via-transparent to-blue-500/5 dark:to-blue-500/10" />

          <div className="relative z-10 flex-1 space-y-5">
            <div className="space-y-2">
              <div className="mb-2 flex items-center gap-2">
                <div className="from-blue-500 via-blue-500/90 to-blue-500/80 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br">
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg leading-snug font-semibold tracking-tight text-zinc-900 transition-all duration-500 ease-out group-hover:translate-y-[-2px] dark:text-white">
                  {title}
                </h3>
              </div>
              <p className="line-clamp-2 text-sm tracking-tight text-zinc-600 transition-all duration-500 ease-out group-hover:translate-y-[-2px] dark:text-zinc-400">
                {description}
              </p>
            </div>

            <div className="space-y-2.5">
              {features.map((feature, index) => {
                const icons = [Copy, IconComponent, Rocket, Zap];
                const FeatureIcon = icons[index % icons.length];

                return (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-sm text-zinc-700 transition-all duration-500 dark:text-zinc-300"
                    style={{
                      transform: isFlipped
                        ? "translateX(0)"
                        : "translateX(-10px)",
                      opacity: isFlipped ? 1 : 0,
                      transitionDelay: `${index * 100 + 200}ms`,
                    }}
                  >
                    <div className="bg-blue-500/10 dark:bg-blue-500/20 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md">
                      <FeatureIcon className="text-blue-500 h-3 w-3" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 mt-auto border-t border-slate-200 pt-4 dark:border-zinc-800">
            <div
              className={cn(
                "group/start relative",
                "flex items-center justify-between",
                "rounded-lg p-2.5",
                "transition-all duration-300",
                "bg-gradient-to-r from-slate-100 via-slate-100 to-slate-100",
                "dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-800",
                "hover:from-blue-500/10 hover:via-blue-500/5 hover:to-transparent",
                "dark:hover:from-blue-500/20 dark:hover:via-blue-500/10 dark:hover:to-transparent",
                "hover:scale-[1.02] hover:cursor-pointer",
                "hover:border-blue-500/20 border border-transparent"
              )}
            >
              <span className="group-hover/start:text-blue-500 text-sm font-semibold text-zinc-900 transition-colors duration-300 dark:text-white">
                Learn More
              </span>
              <div className="group/icon relative">
                <div
                  className={cn(
                    "absolute inset-[-6px] rounded-lg transition-all duration-300",
                    "from-blue-500/20 via-blue-500/10 bg-gradient-to-br to-transparent",
                    "scale-90 opacity-0 group-hover/start:scale-100 group-hover/start:opacity-100"
                  )}
                />
                <ArrowRight className="text-blue-500 relative z-10 h-4 w-4 transition-all duration-300 group-hover/start:translate-x-1 group-hover/start:scale-110" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* 3D flip styles */
        .group { perspective: 2000px; }

        .flip-inner {
          transform-style: preserve-3d;
          transition: transform 700ms cubic-bezier(.2,.9,.2,1);
          will-change: transform;
        }

        .flip-inner.is-flipped {
          transform: rotateY(180deg);
        }

        .card-face {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          transform: rotateY(0deg);
        }

        .card-face.back {
          transform: rotateY(180deg);
        }

        @keyframes slideIn {
          0% {
            transform: translateX(-100px);
            opacity: 0;
          }
          50% {
            transform: translateX(0);
            opacity: 0.8;
          }
          100% {
            transform: translateX(100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
