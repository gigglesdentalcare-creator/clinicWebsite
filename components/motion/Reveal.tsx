"use client";

import type { Variants } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";

// Scroll-triggered fade-up. Elements fade in as they enter the viewport and fade out again
// when they leave it, so the animation replays on every scroll (set `once: true` to play it
// only the first time). Content is server-rendered hidden, so the no-JS fallback in
// app/(site)/layout.tsx targets [data-reveal].
const ease = [0.22, 1, 0.36, 1] as const;
const viewport = { once: false, margin: "0px 0px -80px 0px" } as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before starting, for hand-staggering neighbouring elements. */
  delay?: number;
  /** Distance in px the element travels upward while fading in. */
  y?: number;
};

export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  return (
    <m.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </m.div>
  );
}

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

/** Wrap a set of <RevealItem>s so they fade in one after another as the group scrolls into view. */
export function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      data-reveal
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      {children}
    </m.div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div data-reveal className={className} variants={itemVariants}>
      {children}
    </m.div>
  );
}
