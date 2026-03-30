import Link from "next/link";
import { listings } from "../../../data/listings";
import { BedDouble, Ruler, MapPin } from "lucide-react";

export default function ListingsPage() {
  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-semibold text-stone-900">
          Woningen te koop
        </h1>

        <p className="mt-2 text-stone-500">
          Ontdek het actuele aanbod van woningen
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/listings/${listing.id}`}
              className="group rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm transition hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.headline}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />

                <div className="absolute left-3 top-3 rounded-lg bg-white/90 px-3 py-1 text-sm font-semibold text-stone-900 shadow">
                  € {listing.price.toLocaleString("nl-NL")}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-stone-900 group-hover:text-green-600 transition">
                  {listing.headline}
                </h2>

                <div className="mt-1 flex items-center gap-2 text-sm text-stone-500">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.city}</span>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm text-stone-600">
                  <div className="flex items-center gap-1">
                    <BedDouble className="h-4 w-4" />
                    <span>{listing.rooms}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Ruler className="h-4 w-4" />
                    <span>{listing.size} m²</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}