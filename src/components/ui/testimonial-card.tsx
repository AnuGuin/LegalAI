"use client";

import { cn } from "@/lib/utils";
import { Star, UserRound } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  className?: string;
}

export function TestimonialCard({
  name,
  role,
  company,
  content,
  rating,
  avatar,
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "relative group min-w-[320px] max-w-[400px] flex-shrink-0",
        "bg-card/50 backdrop-blur-sm border border-border/50",
        "rounded-xl p-6 shadow-sm",
        "hover:shadow-lg transition-all duration-300",
        "hover:border-primary/20 hover:bg-card/80",
        className
      )}
    >
      {/* Border beam effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-[borderBeam_2s_ease-in-out_infinite]" />
        <div className="absolute inset-0 rounded-xl bg-card/50 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-muted-foreground/30"
              )}
            />
          ))}
        </div>

        {/* Testimonial content */}
        <blockquote className="text-muted-foreground mb-6 leading-relaxed">
          "{content}"
        </blockquote>

        {/* Author info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary">
            <UserRound className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-foreground text-sm">{name}</div>
            <div className="text-muted-foreground text-xs">
              {role}, {company}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes borderBeam {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
