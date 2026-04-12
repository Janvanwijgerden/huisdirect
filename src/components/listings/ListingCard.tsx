import Link from 'next/link';
import Image from 'next/image';
import { BedDouble, Ruler, MapPin, ArrowUpRight } from 'lucide-react';
import type { Listing } from '../../types/database';
import { formatPrice, formatArea, formatAddressLine } from '../../lib/listing-format';

type Props = {
  listing: Listing;
  index?: number;
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=80';

export default function ListingCard({ listing, index = 0 }: Props) {
  const coverImage =
    listing.listing_images?.find((img: any) => img.is_cover)?.public_url ||
    listing.listing_images?.[0]?.public_url ||
    FALLBACK_IMAGE;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block overflow-hidden rounded-[28px] border border-stone-200/80 bg-white shadow-[0_10px_30px_rgba(28,25,23,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(28,25,23,0.12)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          src={coverImage}
          alt={listing.title || 'Woning'}
          fill
          priority={index < 2}
          loading={index < 2 ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />

        {listing.status === 'sold' ? (
          <div className="absolute left-4 top-4 rounded-full bg-stone-950/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-md">
            Verkocht
          </div>
        ) : listing.is_featured ? (
          <div className="absolute left-4 top-4 rounded-full bg-emerald-600/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-md">
            Uitgelicht
          </div>
        ) : null}

        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/92 text-stone-900 shadow-sm transition duration-300 group-hover:scale-105 group-hover:bg-white">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="space-y-2">
          {listing.property_type && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
              {listing.property_type}
            </p>
          )}

          <h3 className="font-sans text-[32px] font-bold tracking-tight text-stone-950">
            {listing.asking_price ? formatPrice(listing.asking_price) : 'Prijs op aanvraag'}
          </h3>

          <h4 className="font-sans text-xl font-semibold leading-tight text-stone-900">
            {listing.title || 'Concept Woning'}
          </h4>

          <p className="flex items-start gap-2 text-sm text-stone-500">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
            <span>{formatAddressLine(listing) || 'Nog geen locatie'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-stone-100 pt-5">
          {listing.bedrooms != null && (
            <div className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-2 text-sm font-medium text-stone-700">
              <BedDouble className="h-4 w-4 text-stone-500" />
              <span>{listing.bedrooms} kamers</span>
            </div>
          )}

          {listing.living_area != null && (
            <div className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-2 text-sm font-medium text-stone-700">
              <Ruler className="h-4 w-4 text-stone-500" />
              <span>{formatArea(listing.living_area)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}