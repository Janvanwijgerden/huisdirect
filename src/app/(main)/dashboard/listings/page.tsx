import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Home, Plus, ChevronRight, Check, Pencil } from "lucide-react";
import { createClient } from "../../../../lib/supabase/server";
import { getUserListings } from "../../../../lib/actions/listings";
import ListingManagementActions from "../../../../components/dashboard/ListingManagementActions";

type Listing = {
  id: string;
  title?: string | null;
  image?: string | null;
  city?: string | null;
  street?: string | null;
  house_number?: string | null;
  slug?: string | null;
  asking_price?: number | null;
  description?: string | null;
  property_type?: string | null;
  status?: string | null;
  rejection_reason?: string | null;
  listing_images?:
    | Array<{
        id: string;
        public_url?: string | null;
        is_cover?: boolean | null;
      }>
    | null;
  created_at?: string | null;
};

function normalizeSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildPublicHousePath({
  slug,
  city,
  street,
  houseNumber,
  listingId,
}: {
  slug?: string | null;
  city?: string | null;
  street?: string | null;
  houseNumber?: string | null;
  listingId: string;
}) {
  if (slug && slug.trim()) {
    return `/huis/${slug}`;
  }

  if (city && street && houseNumber) {
    return `/huis/${normalizeSegment(city)}/${normalizeSegment(
      street
    )}/${normalizeSegment(houseNumber)}`;
  }

  return `/listings/${listingId}`;
}

function getCompletionPercentage(listing: Listing) {
  const hasPhotos = Boolean(
    listing.listing_images && listing.listing_images.length > 0
  );

  const hasDetails = Boolean(
    listing.description &&
      listing.description.length > 20 &&
      listing.property_type &&
      listing.city
  );

  const hasPrice = Boolean(
    listing.asking_price && Number(listing.asking_price) > 0
  );

  const total = [hasPhotos, hasDetails, hasPrice].filter(Boolean).length;

  return Math.round((total / 3) * 100);
}

export default async function DashboardListingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userListings: Listing[] = await getUserListings(user.id);
  const validListings = (userListings ?? []).filter((listing) => listing?.id);

  const activeCount = validListings.filter(
    (listing) => listing.status === "active"
  ).length;

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
              {validListings.length > 1 ? "Je woningen" : "Je woning"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-500">
              Beheer hier al je woningen vanuit één rustige omgeving. Je kunt
              concepten aanvullen, live advertenties bekijken, offline halen,
              verwijderen en nieuwe woningen toevoegen zonder dat de accountflow
              rommelig wordt.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
              {activeCount} live{activeCount === 1 ? " woning" : " woningen"}
            </div>

            <Link
              href="/listings/new"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Woning toevoegen
            </Link>
          </div>
        </section>

        {validListings.length === 0 ? (
          <section className="rounded-3xl border border-neutral-200 bg-white p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-500">
                <Home className="h-6 w-6" />
              </div>

              <h2 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-900">
                Nog geen woning toegevoegd
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                Start met je eerste woning. Daarna kun je de gegevens aanvullen,
                publiceren en alle aanvragen vanuit je account beheren.
              </p>

              <div className="mt-8">
                <Link
                  href="/listings/new"
                  className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  Start met je woning
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {validListings.map((listing) => {
              const isLive = listing.status === "active";
              const isPending = listing.status === "pending";
              const isRejected = listing.status === "rejected";
              const completionPercentage = getCompletionPercentage(listing);
              const publicPath = buildPublicHousePath({
                slug: listing.slug,
                city: listing.city,
                street: listing.street,
                houseNumber: listing.house_number,
                listingId: listing.id,
              });

              return (
                <article
                  key={listing.id}
                  className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
                >
                  <div className="relative h-56 bg-neutral-100">
                    {listing.image ? (
                      <Image
                        src={listing.image}
                        alt={listing.title || "Woning"}
                        fill
                        className="object-cover"
                        priority={false}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-neutral-400">
                        <Home className="h-10 w-10" />
                      </div>
                    )}

                    <div className="absolute left-4 top-4">
                      {isLive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-green-700 shadow-sm ring-1 ring-inset ring-green-600/20">
                          <Check className="h-3.5 w-3.5" />
                          Live
                        </span>
                      ) : isPending ? (
                        <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-amber-700 shadow-sm ring-1 ring-inset ring-amber-500/30">
                          In behandeling
                        </span>
                      ) : isRejected ? (
                        <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-red-700 shadow-sm ring-1 ring-inset ring-red-500/30">
                          Afgewezen
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm ring-1 ring-inset ring-neutral-400/20">
                          Concept
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    {isRejected && listing.rejection_reason && (
                      <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-semibold text-red-800">
                          Deze woning is afgewezen
                        </p>
                        <p className="mt-1 text-sm text-red-700">
                          {listing.rejection_reason}
                        </p>

                        <div className="mt-3">
                          <Link
                            href={`/listings/${listing.id}/edit`}
                            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                          >
                            Pas aan en dien opnieuw in
                          </Link>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="truncate text-xl font-semibold tracking-tight text-neutral-900">
                          {listing.title || "Concept woning"}
                        </h2>

                        <p className="mt-1 text-sm text-neutral-500">
                          {listing.city || "Locatie nog niet ingevuld"}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-xs uppercase tracking-[0.12em] text-neutral-400">
                          Voltooid
                        </p>
                        <p className="mt-1 text-sm font-semibold text-neutral-900">
                          {completionPercentage}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-2xl font-semibold text-neutral-900">
                        {listing.asking_price
                          ? `€ ${listing.asking_price.toLocaleString("nl-NL")} k.k.`
                          : "Vraagprijs nog niet ingesteld"}
                      </p>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500">Woning compleet</span>
                        <span className="font-medium text-neutral-900">
                          {completionPercentage}%
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200">
                        <div
                          className="h-full rounded-full bg-emerald-600 transition-all"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Link
                        href={`/listings/${listing.id}/edit`}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                      >
                        <Pencil className="h-4 w-4" />
                        Bewerken
                      </Link>

                      {isLive ? (
                        <Link
                          href={publicPath}
                          target="_blank"
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                        >
                          Bekijk advertentie
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <Link
                          href={`/listings/${listing.id}/edit`}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
                        >
                          {isRejected ? "Pas aan" : "Compleet maken"}
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>

                    <ListingManagementActions
                      listingId={listing.id}
                      isLive={isLive}
                    />
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}