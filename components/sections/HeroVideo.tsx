"use client";

import { useEffect, useRef } from "react";

export type HeroVideoSource = { url: string; mimeType: string | null };

// Decorative full-bleed background: silent, looping and forced to black & white. An overlay in
// the page background colour keeps the headline readable in both light and dark mode — solid on
// mobile (text spans the full width), fading left-to-right on desktop so the footage shows on
// the right. Must sit inside a `relative isolate` parent.
export default function HeroVideo({ video }: { video: HeroVideoSource }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Visitors who ask for reduced motion get a still background: stop playback and abort
      // the download too, not just hide the element.
      el.pause();
      el.removeAttribute("autoplay");
      el.querySelectorAll("source").forEach((source) => source.remove());
      el.load();
      return;
    }

    // React sets `muted` as a DOM property after hydration rather than as an HTML attribute, so
    // the browser can attempt autoplay before it's muted and block it. Mute, then play explicitly.
    el.muted = true;
    el.play().catch(() => {
      // Autoplay blocked (e.g. low-power mode): the overlay over the page background is all
      // that shows, which is a fine fallback.
    });
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 motion-reduce:hidden">
      <video
        ref={ref}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        tabIndex={-1}
        className="size-full object-cover grayscale"
      >
        <source src={video.url} type={video.mimeType ?? undefined} />
      </video>
      <div className="absolute inset-0 bg-background/80 md:hidden" />
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(to right, var(--background) 25%, color-mix(in srgb, var(--background) 75%, transparent) 55%, color-mix(in srgb, var(--background) 35%, transparent))",
        }}
      />
    </div>
  );
}
