"use client";

import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { DESKTOP_BREAKPOINT_PX } from "@/lib/responsive";
import { cn } from "@/lib/utils";

type ScrollRevealProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  delayMs?: number;
  distance?: number;
  direction?: "up" | "down" | "left" | "right";
  once?: boolean;
};

function getHiddenStateClassName(direction: ScrollRevealProps["direction"]) {
  switch (direction) {
    case "down":
      return "xl:translate-y-5";
    case "left":
      return "xl:-translate-x-5";
    case "right":
      return "xl:translate-x-5";
    case "up":
    default:
      return "xl:-translate-y-5";
  }
}

export function ScrollReveal({
  children,
  className,
  delayMs = 0,
  distance: _distance = 28,
  direction = "up",
  once = true,
  style,
  ...props
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia(`(max-width: ${DESKTOP_BREAKPOINT_PX - 1}px), (pointer: coarse)`).matches
    ) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);

          if (once) {
            observer.unobserve(entry.target);
          }
          return;
        }

        if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -4% 0px"
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "opacity-100 blur-0",
        "xl:transition-[opacity,transform,filter] xl:duration-500 xl:will-change-transform",
        isVisible
          ? "xl:translate-x-0 xl:translate-y-0 xl:scale-100"
          : cn("xl:opacity-0 xl:blur-[6px] xl:scale-[0.985]", getHiddenStateClassName(direction)),
        className
      )}
      style={{
        ...style,
        transitionDelay: `${delayMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
      }}
    >
      {children}
    </div>
  );
}
