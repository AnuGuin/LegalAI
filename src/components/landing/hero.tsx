"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
interface HeroProps {
  onGetStarted?: () => void
}

export function Hero({ onGetStarted }: HeroProps = {}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const simplifiedRef = useRef<HTMLSpanElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const sparkleRef = useRef<HTMLDivElement>(null);

  console.log("Hero component rendered with onGetStarted:", typeof onGetStarted);

  useEffect(() => {
    // Only run animations if elements exist
    if (!titleRef.current || !buttonRef.current || !simplifiedRef.current || !paragraphRef.current || !sparkleRef.current)
      return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef.current, paragraphRef.current, buttonRef.current], {
        y: 50,
        opacity: 0,
      });
      gsap.set(sparkleRef.current, { opacity: 0 });

      // Create animation timeline
      const tl = gsap.timeline({
        delay: 0.5,
      });

      // Animate elements with stagger
      tl.to([titleRef.current, paragraphRef.current, buttonRef.current], {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Animate sparkle effect to fade in
      tl.to(sparkleRef.current, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut",
      }, "-=1.2"); // Starts 1.2s before the end of the previous animation

      // Shimmer effect for "Simplified" text
      gsap.to(simplifiedRef.current, {
        backgroundPosition: "-200% center",
        duration: 6,
        ease: "power2.inOut",
        repeat: -1,
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section id="home" className="min-h-screen w-full bg-[#0f102a] relative" >
      {/* Blue Radial Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle 900px at 60% 60%, rgba(59,130,246,0.4), transparent)`,
        }}
      />
      
      {/* Diagonal Fade Grid Background - Top Left */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #374151 1px, transparent 1px),
            linear-gradient(to bottom, #374151 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 70% at 0% 0%, #000 50%, transparent 80%)",
          maskImage:
            "radial-gradient(ellipse 70% 70% at 0% 0%, #000 50%, transparent 80%)",
        }}
      />
      
      {/* Diagonal Fade Grid Background - Top Right */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #374151 1px, transparent 1px),
            linear-gradient(to bottom, #374151 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 70% at 100% 0%, #000 50%, transparent 80%)",
          maskImage:
            "radial-gradient(ellipse 70% 70% at 100% 0%, #000 50%, transparent 80%)",
        }}
      />
      
      {/* Gradient transition to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-5"
        style={{
          background: "radial-gradient(to bottom, transparent, rgba(15, 23, 42, 0.8), rgb(15, 23, 42))"
        }}
      />

     

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-4xl w-full text-center transform translate-y-0 mt-16">
          <h1
            ref={titleRef}
            className="relative z-10 mt- text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold"
          >
            Your Legal Queries{" "}
            <span
              ref={simplifiedRef}
              className="inline-block relative bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-[length:200%_100%] bg-clip-text text-transparent"
              style={{
                backgroundPosition: "200% center",
              }}
            >
              Simplified
            </span>
          </h1>

          <p 
            ref={paragraphRef}
            className="text-xl md:text-2xl text-white/80 mb-4 leading-relaxed"
          >
            Transform your legal practice with AI-powered solutions.
            Streamline document analysis, generate contracts, and get instant
            legal insights.
          </p>

          <div ref={sparkleRef} className="relative flex justify-center mb-6">
            <div className="w-full h-40 relative">
              {/* Parabolic Gradients */}
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm"
                style={{
                  clipPath: "ellipse(75% 100% at 50% 0%)"
                }}
              />
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4"
                style={{
                  clipPath: "ellipse(75% 100% at 50% 0%)"
                }}
              />
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/2 blur-sm"
                style={{
                  clipPath: "ellipse(60% 100% at 50% 0%)"
                }}
              />
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/2"
                style={{
                  clipPath: "ellipse(60% 100% at 50% 0%)"
                }}
              />
    
              
              <div className="absolute inset-0 w-full h-full bg-blend-color [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>

              {/* Get Started Button */}
              <div ref={buttonRef} className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10">
                <Button
                  size="lg"
                  onClick={() => {
                    console.log("Button clicked, onGetStarted:", onGetStarted);
                    if (onGetStarted) {
                      onGetStarted();
                    } else {
                      console.log("onGetStarted is not defined");
                    }
                  }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 text-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 min-w-[200px]"
                >
                  Get Started 
                </Button>
              </div>
            </div>
          </div>
          
      </div>
    </div>
    </section>
  );
}
