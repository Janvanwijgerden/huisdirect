"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  listingId: string;
  initialCount?: number;
  isLoggedIn: boolean;
};

export default function FavoriteButton({
  listingId,
  initialCount = 0,
  isLoggedIn,
}: Props) {
  const router = useRouter();

  const [active, setActive] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const res = await fetch(`/api/listing-favorites?listingId=${listingId}`);
        const data = await res.json();

        setActive(Boolean(data.active));
        setCount(Number(data.count ?? initialCount));
      } catch {
        setCount(initialCount);
      }
    };

    fetchFavoriteStatus();
  }, [listingId, initialCount]);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push(`/login?redirect=/listings/${listingId}`);
      return;
    }

    if (loading) return;

    setLoading(true);

    const nextActive = !active;

    setActive(nextActive);
    setCount((current) => {
      if (nextActive) return current + 1;
      return Math.max(0, current - 1);
    });

    try {
      const res = await fetch("/api/listing-favorites", {
        method: nextActive ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Favoriet aanpassen mislukt.");
      }

      setActive(Boolean(data.active));
      setCount(Number(data.count ?? 0));
    } catch {
      setActive(active);
      setCount((current) => {
        if (nextActive) return Math.max(0, current - 1);
        return current + 1;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="absolute right-4 top-4 z-20 flex items-center gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        aria-label={active ? "Woning verwijderen uit favorieten" : "Woning opslaan"}
className={`rounded-full p-3 shadow transition transform active:scale-95 ${          active
            ? "bg-red-100 text-red-600 hover:bg-red-200"
            : "bg-white text-neutral-900 hover:bg-red-50 hover:text-red-500"
        } ${loading ? "cursor-not-allowed opacity-70" : ""}`}
      >
<Heart
  className={`h-5 w-5 transition-transform duration-150 ${
    active ? "fill-red-500 scale-110" : "scale-100"
  }`}
/>      </button>

      <div className="rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white">
        {count}
      </div>
    </div>
  );
}