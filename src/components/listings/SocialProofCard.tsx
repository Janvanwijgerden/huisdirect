"use client";

import { useEffect, useState } from "react";
import { Eye, Heart, MessageCircle, Share2 } from "lucide-react";

type SocialProofStats = {
  views24h: number;
  favorites24h: number;
  leads24h: number;
  shares24h: number;
};

export default function SocialProofCard({ listingId }: { listingId: string }) {
  const [stats, setStats] = useState<SocialProofStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const res = await fetch(`/api/listing-events?listingId=${listingId}`, {
        cache: "no-store",
      });

      if (!res.ok) return;

      const data = await res.json();
      setStats(data);
    };

    loadStats();
  }, [listingId]);

  if (!stats) return null;

  const hasActivity =
    stats.views24h > 0 ||
    stats.favorites24h > 0 ||
    stats.leads24h > 0 ||
    stats.shares24h > 0;

  if (!hasActivity) return null;

  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
        Activiteit op deze woning
      </p>

      <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
        Deze woning krijgt aandacht
      </h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4">
          <Eye className="h-5 w-5 text-emerald-700" />
          <p className="mt-2 text-2xl font-semibold text-neutral-950">
            {stats.views24h}
          </p>
          <p className="text-sm text-neutral-500">keer bekeken vandaag</p>
        </div>

        <div className="rounded-2xl bg-white p-4">
          <Heart className="h-5 w-5 text-emerald-700" />
          <p className="mt-2 text-2xl font-semibold text-neutral-950">
            {stats.favorites24h}
          </p>
          <p className="text-sm text-neutral-500">keer opgeslagen vandaag</p>
        </div>

        <div className="rounded-2xl bg-white p-4">
          <Share2 className="h-5 w-5 text-emerald-700" />
          <p className="mt-2 text-2xl font-semibold text-neutral-950">
            {stats.shares24h}
          </p>
          <p className="text-sm text-neutral-500">keer gedeeld/geklikt</p>
        </div>

        <div className="rounded-2xl bg-white p-4">
          <MessageCircle className="h-5 w-5 text-emerald-700" />
          <p className="mt-2 text-2xl font-semibold text-neutral-950">
            {stats.leads24h}
          </p>
          <p className="text-sm text-neutral-500">contactmomenten vandaag</p>
        </div>
      </div>
    </div>
  );
}