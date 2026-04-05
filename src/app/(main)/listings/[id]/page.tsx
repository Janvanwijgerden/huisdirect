import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { createClient } from "../../../../lib/supabase/server";

import ListingImageCarousel from "../../../../components/listings/ListingImageCarousel";
import ListingHighlights from "../../../../components/listings/ListingHighlights";
import ListingLeadForm from "../../../../components/listings/ListingLeadForm";
import ListingSidebarCard from "../../../../components/listings/ListingSidebarCard";
import ListingMap from "../../../../components/listings/ListingMap";

type ListingPageProps = {
  params: {
    id: string;
  };
};

function formatPropertyType(value: string | null) {
  switch (value) {
    case "eengezinswoning":
      return "Eengezinswoning";
    case "appartement":
      return "Appartement";
    case "vrijstaande_woning":
      return "Vrijstaande woning";
    case "twee_onder_een_kap":
      return "Twee-onder-een-kap";
    case "hoekwoning":
      return "Hoekwoning";
    case "bungalow":
      return "Bungalow";
    default:
      return value || "Woning";
  }
}

function renderDescription(description?: string | null) {
  if (!description || !description.trim()) {
    return <p>Geen omschrijving beschikbaar.</p>;
  }

  const lines = description
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  const elements: React.ReactNode[] = [];
  let bulletBuffer: string[] = [];
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      elements.push(
        <p key={`p-${elements.length}`}>
          {paragraphBuffer.join(" ")}
        </p>
      );
      paragraphBuffer = [];
    }
  };

  const flushBullets = () => {
    if (bulletBuffer.length > 0) {
      elements.push(
        <ul
          key={`ul-${elements.length}`}
          className="space-y-2 pl-5"
        >
          {bulletBuffer.map((item, index) => (
            <li key={`li-${elements.length}-${index}`} className="list-disc">
              {item}
            </li>
          ))}
        </ul>
      );
      bulletBuffer = [];
    }
  };

  for (const line of lines) {
    const isBullet =
      line.startsWith("- ") ||
      line.startsWith("• ") ||
      line.startsWith("* ");

    if (isBullet) {
      flushParagraph();
      bulletBuffer.push(line.replace(/^[-•*]\s+/, ""));
    } else {
      flushBullets();
      paragraphBuffer.push(line);
    }
  }

  flushParagraph();
  flushBullets();

  return elements;
}

export default async function ListingDetailPage({
  params,
}: ListingPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: listing, error } = await supabase
    .from("listings")
    .select("*, listing_images(*)")
    .eq("id", params.id)
    .single();

  if (error || !listing) {
    notFound();
  }

  if (listing.status !== "active" && listing.user_id !== user?.id) {
    notFound();
  }

  const sortedImages = (listing.listing_images || []).sort((a: any, b: any) => {
    if (a.is_cover) return -1;
    if (b.is_cover) return 1;
    return (a.position ?? 0) - (b.position ?? 0);
  });

  const galleryImages =
    sortedImages.length > 0
      ? sortedImages.map((img: any) => img.public_url)
      : [
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=80",
        ];

  return (
    <main className="min-h-screen bg-neutral-50 pb-16">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-neutral-900 sm:text-4xl">
            {listing.title}
          </h1>

          <div className="mt-2 flex items-center gap-2 text-neutral-600">
            <MapPin className="h-5 w-5 shrink-0" />
            <span className="text-lg">
              {listing.street ? `${listing.street}, ` : ""}
              {listing.city}
            </span>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="min-w-0 space-y-10">
            <ListingImageCarousel
              images={galleryImages}
              title={listing.title || "Woning"}
            />

            <ListingHighlights
              propertyType={formatPropertyType(listing.property_type)}
              yearBuilt={listing.year_built || 0}
              energyLabel={listing.energy_label || "-"}
              plotSize={listing.plot_size || 0}
            />

            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
                Omschrijving
              </h2>

              <div className="space-y-4 text-base leading-8 text-neutral-700">
                {renderDescription(listing.description)}
              </div>
            </section>

            {listing.latitude && listing.longitude && (
              <ListingMap
                address={listing.street || "Onbekend adres"}
                city={listing.city || ""}
                lat={listing.latitude}
                lng={listing.longitude}
              />
            )}

            <ListingLeadForm
              listingId={listing.id}
              listingTitle={listing.title || ""}
            />
          </div>

          <div className="min-w-0">
            <ListingSidebarCard
              price={listing.asking_price}
              bedrooms={listing.bedrooms || undefined}
              livingArea={listing.living_area || undefined}
              plotArea={listing.plot_size || undefined}
              yearBuilt={listing.year_built || undefined}
              energyLabel={listing.energy_label || undefined}
            />
          </div>
        </div>
      </div>
    </main>
  );
}