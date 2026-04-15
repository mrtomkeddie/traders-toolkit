// Premium animation helpers built on the `motion` package.
// All respect prefers-reduced-motion automatically via motion's reducedMotion support.

import React, { useRef, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useInView,
  useMotionValueEvent,
  type MotionProps,
} from 'motion/react';

// ─── Magnetic button ─────────────────────────────────────────────────
// Subtle pull toward cursor when hovering (within `strength` px radius).
export function Magnetic({
  children,
  strength = 0.25,
  className = '',
  ...rest
}: { children: React.ReactNode; strength?: number; className?: string } & MotionProps & Record<string, unknown>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ─── Reveal on scroll ────────────────────────────────────────────────
// Fade-up when element enters viewport. Triggers once.
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Parallax ────────────────────────────────────────────────────────
// Subtle translate-Y based on scroll progress through the viewport.
export function Parallax({
  children,
  offset = 60,
  className = '',
}: { children: React.ReactNode; offset?: number; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Count-up number ─────────────────────────────────────────────────
// Animates from 0 to `end` over `duration` when scrolled into view.
export function CountUp({
  end,
  duration = 1.6,
  suffix = '',
  prefix = '',
  className = '',
}: { end: number; duration?: number; suffix?: string; prefix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 });

  useEffect(() => {
    if (inView) mv.set(end);
  }, [inView, end, mv]);

  useMotionValueEvent(spring, 'change', (v) => {
    if (ref.current) ref.current.textContent = `${prefix}${Math.round(v)}${suffix}`;
  });

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

// ─── Tilt card ───────────────────────────────────────────────────────
// 3D-perspective tilt responding to cursor position.
export function TiltCard({
  children,
  className = '',
  max = 6,
}: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 16 });
  const sry = useSpring(ry, { stiffness: 180, damping: 16 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d', transformPerspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
