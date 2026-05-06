"use client";

import { CheckCircle2, Copy, Facebook, Instagram, Linkedin, MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";

type ShareMessages = {
  whatsapp: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  general: string;
};

export default function AIShareGenerator({
  listing,
  shareUrl,
}: {
  listing: any;
  shareUrl: string;
}) {
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [messages, setMessages] = useState<ShareMessages | null>(null);

  const generate = async () => {
    setLoading(true);

    const res = await fetch("/api/generate-share-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: listing.title,
        city: listing.city,
        price: listing.asking_price,
        bedrooms: listing.bedrooms,
        livingArea: listing.living_area,
        propertyType: listing.property_type,
        energyLabel: listing.energy_label,
        description: listing.description,
        url: shareUrl,
      }),
    });

    const data = await res.json();
    setMessages(data.messages || null);
    setLoading(false);
  };

  const copyText = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const cards = messages
    ? [
        {
          key: "whatsapp",
          title: "WhatsApp",
          description: "Laagdrempelig en makkelijk door te sturen.",
          icon: MessageCircle,
          text: messages.whatsapp,
        },
        {
          key: "linkedin",
          title: "LinkedIn",
          description: "Zakelijk en professioneel voor je netwerk.",
          icon: Linkedin,
          text: messages.linkedin,
        },
        {
          key: "facebook",
          title: "Facebook",
          description: "Warm, lokaal en geschikt voor groepen.",
          icon: Facebook,
          text: messages.facebook,
        },
        {
          key: "instagram",
          title: "Instagram",
          description: "Korter en caption-achtig bij foto’s of story.",
          icon: Instagram,
          text: messages.instagram,
        },
        {
          key: "general",
          title: "Algemeen",
          description: "Neutraal bericht voor elk kanaal.",
          icon: Copy,
          text: messages.general,
        },
      ]
    : [];

  return (
    <div className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
      <div className="flex items-start gap-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
          <Sparkles className="h-5 w-5 text-emerald-700" />
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
            AI deelberichten
          </h2>

          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Laat AI per platform een passend bericht maken. WhatsApp blijft makkelijk
            doorstuurbaar, LinkedIn zakelijker en Instagram korter.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={generate}
        disabled={loading}
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Sparkles className="h-4 w-4" />
        {loading ? "Berichten maken..." : "Maak AI deelberichten"}
      </button>

      {messages && (
        <div className="mt-6 space-y-4">
          {cards.map((card) => {
            const Icon = card.icon;
            const copied = copiedKey === card.key;

            return (
              <div
                key={card.key}
                className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-neutral-900 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-neutral-950">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      {card.description}
                    </p>
                  </div>
                </div>

                <textarea
                  value={card.text}
                  readOnly
                  className="mt-4 min-h-[150px] w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm leading-6 text-neutral-700 outline-none"
                />

                <button
                  type="button"
                  onClick={() => copyText(card.key, card.text)}
                  className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      Gekopieerd
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Kopieer {card.title}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}