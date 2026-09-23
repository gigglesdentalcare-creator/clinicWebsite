"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Clamps its content to a few lines, with a "Read more" toggle — but only when the content
// actually overflows, so short text (nothing hidden) doesn't get a pointless button.
// `clampClassName` must be a literal Tailwind class (e.g. "line-clamp-6") somewhere in the
// source, not built with string interpolation, or Tailwind won't generate the CSS for it.
export default function ReadMore({
  children,
  clampClassName = "line-clamp-6",
}: {
  children: ReactNode;
  clampClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    // Measured once, while still collapsed (initial state): scrollHeight is the full height of
    // the content, clientHeight is the clamped height, so a difference means text is hidden.
    const el = ref.current;
    if (!el) return;
    setOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, []);

  return (
    <div>
      <div ref={ref} className={expanded ? undefined : clampClassName}>
        {children}
      </div>
      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-2 text-sm font-semibold text-primary-text hover:underline"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}
