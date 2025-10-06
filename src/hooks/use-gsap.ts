import { useEffect, useRef, RefObject, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins
gsap.registerPlugin(ScrollTrigger);

export function useGSAP(
  callback: (context: gsap.Context) => void,
  dependencies: any[] = []
) {
  const contextRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    contextRef.current = gsap.context(callback);

    return () => {
      contextRef.current?.revert();
    };
  }, dependencies);

  return contextRef.current;
}

export function useStaggerAnimation(
  elements: RefObject<HTMLElement>[],
  options: {
    stagger?: number;
    delay?: number;
    duration?: number;
    ease?: string;
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
    trigger?: string | HTMLElement;
  } = {}
) {
  const {
    stagger = 0.2,
    delay = 0,
    duration = 1,
    ease = "power3.out",
    from = { x: -100, opacity: 0 },
    to = { x: 0, opacity: 1 },
    trigger,
  } = options;

  const animateElements = useCallback(() => {
    const validElements = elements
      .map((ref) => ref.current)
      .filter(Boolean) as HTMLElement[];

    if (validElements.length === 0) return null;

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(validElements, from);

      // Create staggered animation
      const tl = gsap.timeline({ delay });

      tl.to(validElements, {
        ...to,
        duration,
        ease,
        stagger,
        scrollTrigger: trigger
          ? {
              trigger,
              start: "top 80%",
              toggleActions: "play none none reverse",
            }
          : undefined,
      });
    });

    return ctx;
  }, [elements, stagger, delay, duration, ease, trigger]);

  useEffect(() => {
    const ctx = animateElements();
    return () => ctx?.revert();
  }, [animateElements]);
}

export function useFadeInAnimation(
  elementRef: RefObject<HTMLElement>,
  options: {
    direction?: "up" | "down" | "left" | "right";
    distance?: number;
    duration?: number;
    delay?: number;
    trigger?: string | HTMLElement;
  } = {}
) {
  const {
    direction = "up",
    distance = 50,
    duration = 1,
    delay = 0,
    trigger,
  } = options;

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    const getInitialProps = () => {
      switch (direction) {
        case "up":
          return { y: distance, opacity: 0 };
        case "down":
          return { y: -distance, opacity: 0 };
        case "left":
          return { x: distance, opacity: 0 };
        case "right":
          return { x: -distance, opacity: 0 };
        default:
          return { opacity: 0 };
      }
    };

    const ctx = gsap.context(() => {
      gsap.set(element, getInitialProps());

      gsap.to(element, {
        x: 0,
        y: 0,
        opacity: 1,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: trigger
          ? {
              trigger: trigger,
              start: "top 80%",
              toggleActions: "play none none reverse",
            }
          : undefined,
      });
    });

    return () => ctx.revert();
  }, [direction, distance, duration, delay, trigger]);
}
