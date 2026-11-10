"use client";

import { useState } from "react";
import { fill } from "@/i18n/config";

type Props = {
  colours: { hex: string; name: string }[];
  copyLabel: string;
  copiedLabel: string;
};

export default function Swatches({ colours, copyLabel, copiedLabel }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1600);
    } catch {
      // Clipboard can be blocked; the hex code is visible anyway.
    }
  };

  return (
    <ul className="flex flex-wrap gap-5 md:gap-6">
      {colours.map(({ hex, name }) => (
        <li key={hex}>
          <button
            type="button"
            onClick={() => copy(hex)}
            className="group block text-center"
            aria-label={fill(copyLabel, { name, hex })}
          >
            <span
              className="block h-24 w-24 border-[6px] border-white transition-transform duration-500 ease-editorial group-hover:-translate-y-1.5 group-hover:rotate-[-3deg] md:h-28 md:w-28"
              style={{ backgroundColor: hex }}
            />
            <span className="mt-4 block text-lg text-white/90">
              {copied === hex ? <span className="text-blush">{copiedLabel}</span> : hex}
            </span>
            <span className="eyebrow block text-[0.65rem] text-white/50">{name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
