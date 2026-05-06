"use client";

import { useEffect, useState } from "react";

type Props = {
  listingId: string;
};

export default function ListingSocialProof({ listingId }: Props) {
  const [views, setViews] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/listing-events?listingId=${listingId}`);
        const data = await res.json();

        if (data?.totals) {
          setViews(data.totals.views ?? 0);
          setFavorites(data.totals.favorites ?? 0);
        }
      } catch (err) {
        console.error("Fout bij ophalen stats:", err);
      }
    };

    fetchStats();
  }, [listingId]);

  // 👉 niks tonen als er nog geen relevante data is (belangrijk voor conversie)
  if ((!views || views < 3) && (!favorites || favorites === 0)) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
      
      {/* Views */}
      {views !== null && views >= 3 && (
        <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
          👁 {views} keer bekeken
        </div>
      )}

      {/* Favorites */}
      {favorites !== null && favorites > 0 && (
        <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
          ❤️ {favorites} geïnteresseerden
        </div>
      )}

    </div>
  );
}