"use client";

import { ChevronsLeftRight } from "lucide-react";
import { Image } from "next-sanity/image";
import { useRef, useState, type PointerEvent } from "react";

type Photo = { src: string; alt: string };

// Before/after comparison: the "before" photo sits on top of the "after" one, clipped to the
// left of a divider that can be dragged sideways (mouse or touch, anywhere on the photo) or
// moved with the arrow keys via a visually hidden range input. `touch-pan-y` keeps vertical
// page scrolling working on phones while horizontal drags move the divider.
export default function BeforeAfterSlider({ before, after, sizes }: { before: Photo; after: Photo; sizes: string }) {
  const [position, setPosition] = useState(50);
  const container = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const moveTo = (clientX: number) => {
    const rect = container.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    setPosition(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    moveTo(event.clientX);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(event.clientX);
  };
  const stopDragging = () => {
    dragging.current = false;
  };

  return (
    <div
      ref={container}
      className="relative aspect-[4/3] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-card bg-primary/5"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      <Image src={after.src} alt={after.alt} width={1200} height={900} sizes={sizes} draggable={false} className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={before.src} alt={before.alt} width={1200} height={900} sizes={sizes} draggable={false} className="size-full object-cover" />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-navy/75 px-3 py-1 text-xs font-semibold text-white">Before</span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-navy/75 px-3 py-1 text-xs font-semibold text-white">After</span>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(position)}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-label="Before and after comparison (higher shows more of the before photo)"
        className="peer sr-only"
      />
      {/* Divider + handle; the handle shows the focus ring when the hidden input has keyboard focus. */}
      <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_8px_rgba(0,0,0,0.35)]" style={{ left: `${position}%` }} />
      <div
        className="pointer-events-none absolute top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-lg peer-focus-visible:ring-4 peer-focus-visible:ring-primary"
        style={{ left: `${position}%` }}
      >
        <ChevronsLeftRight size={20} aria-hidden />
      </div>
    </div>
  );
}
