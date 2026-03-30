import Link from "next/link";
import Image from "next/image";
import { BedDouble, Ruler, MapPin } from "lucide-react";

import type { Listing } from "../../data/listings";
import {
  formatAddressLine,
  formatArea,
  formatPrice,
} from "../../lib/listing-format";

type Props = {
  listing: Listing;
};

export default function ListingCard({ listing }: Props) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          src={listing.image}
          alt={listing.headline}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
        />
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {listing.propertyType}
          </p>

          <h3 className="text-lg font-semibold text-stone-900">
            {listing.headline}
          </h3>

          <p className="flex items-start gap-2 text-sm text-stone-500">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{formatAddressLine(listing)}</span>
          </p>
        </div>

        <div className="text-2xl font-bold tracking-tight text-stone-900">
          {formatPrice(listing.price)}
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-stone-100 pt-4 text-sm text-stone-600">
          <div className="flex items-center gap-2">
            <BedDouble className="h-4 w-4" />
            <span>{listing.rooms} kamers</span>
          </div>

          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            <span>{formatArea(listing.size)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}