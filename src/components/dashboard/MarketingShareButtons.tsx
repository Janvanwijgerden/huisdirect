"use client";

import {
  CheckCircle2,
  Copy,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

type Props = {
  listingId: string;
  shareUrl: string;
};

const shareText = "Bekijk deze woning op HuisDirect:";

export default function MarketingShareButtons({ listingId, shareUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const trackShare = async (source: string) => {
    await fetch("/api/listing-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listingId,
        eventType: "share_click",
        source,
      }),
    });
  };

  const openShare = async (source: string, url: string) => {
    await trackShare(source);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const copyShareUrl = async (source = "copy") => {
    await navigator.clipboard.writeText(shareUrl);
    await trackShare(source);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
      <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
        Deel je woning
      </h2>

      <p className="mt-3 text-sm leading-6 text-neutral-600">
        Deel je woning met je partner, familie, vrienden, collega’s of buurtapp.
        Elke klik via deze link wordt meegeteld in je dashboard.
      </p>

      <div className="mt-6 grid grid-cols-5 gap-3">
        <button
          type="button"
          onClick={() =>
            openShare(
              "whatsapp",
              `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
            )
          }
          className="group flex flex-col items-center gap-2"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-sm transition group-hover:scale-105">
            <MessageCircle className="h-6 w-6" />
          </span>
          <span className="text-xs font-medium text-neutral-600">WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={() =>
            openShare(
              "facebook",
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                shareUrl
              )}`
            )
          }
          className="group flex flex-col items-center gap-2"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1877F2] text-white shadow-sm transition group-hover:scale-105">
            <Facebook className="h-6 w-6" />
          </span>
          <span className="text-xs font-medium text-neutral-600">Facebook</span>
        </button>

        <button
          type="button"
          onClick={() =>
            openShare(
              "linkedin",
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                shareUrl
              )}`
            )
          }
          className="group flex flex-col items-center gap-2"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A66C2] text-white shadow-sm transition group-hover:scale-105">
            <Linkedin className="h-6 w-6" />
          </span>
          <span className="text-xs font-medium text-neutral-600">LinkedIn</span>
        </button>

        <button
          type="button"
          onClick={async () => {
            await copyShareUrl("instagram");
            window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
          }}
          className="group flex flex-col items-center gap-2"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white shadow-sm transition group-hover:scale-105">
            <Instagram className="h-6 w-6" />
          </span>
          <span className="text-xs font-medium text-neutral-600">Instagram</span>
        </button>

        <button
          type="button"
          onClick={() => copyShareUrl("copy")}
          className="group flex flex-col items-center gap-2"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-950 shadow-sm transition group-hover:scale-105 group-hover:bg-neutral-50">
            {copied ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-700" />
            ) : (
              <Copy className="h-6 w-6" />
            )}
          </span>
          <span className="text-xs font-medium text-neutral-600">
            {copied ? "Gekopieerd" : "Kopieer"}
          </span>
        </button>
      </div>

      <p className="mt-5 rounded-2xl bg-neutral-50 px-4 py-3 text-xs leading-5 text-neutral-500">
        Instagram ondersteunt geen gewone directe deel-link zoals WhatsApp,
        Facebook en LinkedIn. Daarom kopiëren we de link en openen Instagram.
      </p>
    </div>
  );
}