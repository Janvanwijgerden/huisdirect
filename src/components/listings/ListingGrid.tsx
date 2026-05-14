"use client";

import ListingCard from "./ListingCard";

type Props = {
  listings: any[];
  emptyMessage?: string;
};

export default function ListingGrid({ listings, emptyMessage }: Props) {
  if (!listings || listings.length === 0) {
    return (
      <div className="rounded-[28px] border border-stone-200 bg-white px-6 py-16 text-center shadow-[0_14px_40px_rgba(28,25,23,0.05)]">
        <p className="text-base font-medium text-stone-900">
          {emptyMessage || "Er zijn momenteel geen woningen beschikbaar."}
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
          Pas eventueel je filters aan of kom later terug voor nieuw aanbod.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
      {listings.map((listing, index) => (
        <ListingCard key={listing.id} listing={listing} index={index} />
      ))}
    </div>
  );
}
