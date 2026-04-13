"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ListingCard from "./ListingCard";

type Props = {
  listings: any[];
  emptyMessage?: string;
};

export default function ListingGrid({ listings, emptyMessage }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 8);
  }

  useEffect(() => {
    updateScrollState();

    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => updateScrollState();
    const handleResize = () => updateScrollState();

    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [listings]);

  function scrollByAmount(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;

    const cardWidth = 344;
    const gap = 24;
    const amount = cardWidth + gap;

    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    if (!el) return;

    isDraggingRef.current = true;
    startXRef.current = event.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  }

  function handleMouseLeave() {
    isDraggingRef.current = false;
  }

  function handleMouseUp() {
    isDraggingRef.current = false;
  }

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const el = scrollRef.current;
    if (!el || !isDraggingRef.current) return;

    event.preventDefault();

    const x = event.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.1;
    el.scrollLeft = scrollLeftRef.current - walk;
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center">
        <p className="text-gray-500">
          {emptyMessage || "Er zijn momenteel geen woningen beschikbaar."}
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByAmount("left")}
          className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-800 shadow-md transition hover:scale-105 md:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByAmount("right")}
          className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-800 shadow-md transition hover:scale-105 md:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex gap-6 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none scrollbar-none"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {listings.map((listing, index) => (
          <div
            key={listing.id}
            className="w-[280px] min-w-[280px] sm:w-[320px] sm:min-w-[320px] flex-shrink-0"
          >
            <ListingCard listing={listing} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}