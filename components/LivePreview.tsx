"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Content } from "@/content";

// Shown only while previewing drafts: reloads the page's data whenever the admin saves
// (autosave does this as you type), plus a small badge with a way out of preview mode.
export default function LivePreview({ locale, labels }: { locale: string; labels: Content["preview"] }) {
  const router = useRouter();
  const [origin, setOrigin] = useState<string | null>(null);
  useEffect(() => setOrigin(window.location.origin), []);

  return (
    <>
      {origin && <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={origin} />}
      <div className="eyebrow fixed bottom-4 left-4 z-[95] flex items-center gap-3 rounded-full bg-blush py-2 pl-4 pr-2 text-[0.7rem] text-maroon shadow-lg">
        {labels.label}
        <a
          href={`/next/exit-preview?path=/${locale}`}
          className="rounded-full bg-maroon px-3 py-1 text-blush transition-colors hover:bg-maroon-deep"
        >
          {labels.exit}
        </a>
      </div>
    </>
  );
}
