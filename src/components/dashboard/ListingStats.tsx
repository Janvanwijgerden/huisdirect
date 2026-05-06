"use client";

import { useEffect, useState } from "react";

type Stats = {
  views: number;
  favorites: number;
  shares: number;
  leads: number;
};

export default function ListingStats({ listingId }: { listingId: string }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`/api/listing-events?listingId=${listingId}`);
      const data = await res.json();

      if (data?.totals) {
        setStats(data.totals);
      }
    };

    fetchStats();
  }, [listingId]);

  if (!stats) return null;

  return (
    <div className="mt-4 p-4 rounded-xl border bg-white shadow-sm">
      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-lg font-semibold">{stats.views}</div>
          <div className="text-xs text-gray-500">bekeken</div>
        </div>

        <div>
          <div className="text-lg font-semibold">{stats.favorites}</div>
          <div className="text-xs text-gray-500">opgeslagen</div>
        </div>

        <div>
          <div className="text-lg font-semibold">{stats.shares}</div>
          <div className="text-xs text-gray-500">gedeeld</div>
        </div>

        <div>
          <div className="text-lg font-semibold">{stats.leads}</div>
          <div className="text-xs text-gray-500">leads</div>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500 text-center">
        Actief delen = meer bereik = sneller verkocht
      </div>
    </div>
  );
}