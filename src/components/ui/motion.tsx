import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Whether an entrance should start from nothing.
 *
 * Every reveal on this site begins at opacity 0 and is carried to 1 when an
 * IntersectionObserver says the element is on screen. In a tab nobody is
 * looking at, that callback may never arrive and the frame loop that would
 * finish the animation is not running either — so a page loaded out of sight
 * paints its headings, its copy and its sections at zero opacity and leaves
 * them there. It has happened twice: once through Framer's own frame loop, and
 * again through a CSS keyframe that looked like a way around it.
 *
 * The rule that prevents a third time is that content is visible unless
 * somebody is there to watch it appear. `initial={false}` mounts an element at
 * the end of its animation, so this returning false — on the server, and in a
 * hidden tab — means the markup is simply shown. When the tab is looked at, the
 * subscription fires and the reveals behave as designed from there down.
 */
function useEntrance() {
  return useSyncExternalStore(
    (notify) => {
      document.addEventListener("visibilitychange", notify);
      return () => document.removeEventListener("visibilitychange", notify);
    },
    () => document.visibilityState === "visible",
    () => false,
  );
}

/**
 * Scroll-triggered reveal. Fires once.
 *
 * Reduced motion is handled by MotionConfig in components/ui/motion-provider,
 * not by the CSS media query — Framer writes inline styles, which that query
 * cannot reach.
 */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const MotionTag = motion[as];
  const entrance = useEntrance();
  return (
    <MotionTag
      className={className}
      initial={entrance ? { opacity: 0, y } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

/** Parent that staggers its Reveal-like children. */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

export function Stagger({
  children,
  className,
  amount = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
}) {
  const entrance = useEntrance();
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial={entrance ? "hidden" : false}
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerChild} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Counts up when scrolled into view. Handles "1,200+", "4.9" and "100%" by
 * animating the numeric part and keeping the affixes intact.
 */
export function Counter({
  value,
  className,
  duration = 1.6,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState("0");

  const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const numeric = match?.[2] ?? value;
  const suffix = match?.[3] ?? "";
  const target = parseFloat(numeric.replace(/,/g, ""));
  const decimals = numeric.includes(".") ? numeric.split(".")[1].length : 0;
  // Values with no digits at all ("None") have nothing to count — render as-is.
  const countable = Number.isFinite(target);

  useEffect(() => {
    // Reduced motion skips the animation entirely — the value is derived at
    // render below instead, so there is no setState in this effect.
    if (!inView || !countable || reduceMotion) return;
    let raf = 0;
    const start = performance.now();
    const ms = duration * 1000;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = target * eased;
      setDisplay(
        decimals > 0
          ? current.toFixed(decimals)
          : Math.round(current).toLocaleString("en-IN"),
      );
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, countable, target, decimals, duration, reduceMotion]);

  if (!countable) {
    return (
      <span ref={ref} className={cn("tnum", className)}>
        {value}
      </span>
    );
  }

  // Counting up is motion, so users who asked for less of it get the final
  // number immediately rather than a value that ticks.
  const text = reduceMotion
    ? decimals > 0
      ? target.toFixed(decimals)
      : target.toLocaleString("en-IN")
    : display;

  return (
    <span ref={ref} className={cn("tnum", className)}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}

/** Card that tilts subtly toward the cursor. Pointer devices only. */
export function TiltCard({
  children,
  className,
  strength = 6,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(y, { stiffness: 180, damping: 22 });
  const ry = useSpring(x, { stiffness: 180, damping: 22 });

  return (
    <motion.div
      ref={ref}
      className={cn("[transform-style:preserve-3d]", className)}
      style={{ rotateX: rx, rotateY: ry }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(px * strength * 2);
        y.set(-py * strength * 2);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
