"use client";

import { useEffect, useRef, useState } from "react";
import type { Content } from "@/content";

// A blush bubble that follows the pointer over elements marked data-cursor.
export default function CursorLabel({ labels }: { labels: Content["cursor"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      if (ref.current) ref.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      const target = (e.target as Element).closest<HTMLElement>("[data-cursor]");
      const key = target?.dataset.cursor as keyof typeof labels | undefined;
      setLabel(key ? (labels[key] ?? null) : null);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [labels]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[80] hidden md:block">
      <span
        className={`headline flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blush px-2 text-center text-sm text-maroon shadow-lg transition-[scale,opacity] duration-300 ease-editorial ${
          label ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
