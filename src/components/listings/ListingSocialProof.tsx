"use client";

import { useEffect, useState } from "react";

type Props = {
  listingId: string;
};

type ListingResponse = {
  favorites_count?: number | null;
  views?: number | null;
};

type EventsResponse = {
  totals?: {
    views?: number;
  };
};

export default function ListingSocialProof({ listingId }: Props) {
  const [views, setViews] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Haal listing op voor de echte favorites_count
        const listingRes = await fetch(`/api/listings/${listingId}`);
        if (listingRes.ok) {
          const listing: ListingResponse = await listingRes.json();
          setFavorites(Number(listing.favorites_count || 0));
        }

        // 2. Haal views op uit listing-events
        const eventsRes = await fetch(
          `/api/listing-events?listingId=${listingId}`,
        );

        if (eventsRes.ok) {
          const data: EventsResponse = await eventsRes.json();
          setViews(Number(data?.totals?.views || 0));
        }
      } catch (error) {
        console.error("Fout bij ophalen social proof:", error);
      }
    };

    fetchStats();
  }, [listingId]);

  // Niets tonen als er nog geen relevante data is
  if ((!views || views < 3) && (!favorites || favorites === 0)) {
    return null;
  }

  const favoriteLabel =
    favorites === 1 ? "1 geïnteresseerde" : `${favorites} geïnteresseerden`;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
      {views !== null && views >= 3 && (
        <div className="rounded-full bg-gray-100 px-3 py-1 text-gray-800">
          👁 {views} keer bekeken
        </div>
      )}

      {favorites !== null && favorites > 0 && (
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
          ❤️ {favoriteLabel}
        </div>
      )}
    </div>
  );
}