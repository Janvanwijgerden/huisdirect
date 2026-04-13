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

type DescriptionSection = {
  title?: string;
  paragraphs: string[];
  bullets?: string[];
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

function splitIntoSentences(text: string) {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
    ?.map((sentence) => sentence.trim())
    .filter(Boolean) || [];
}

function chunkSentences(sentences: string[], size: number) {
  const chunks: string[] = [];

  for (let i = 0; i < sentences.length; i += size) {
    chunks.push(sentences.slice(i, i + size).join(" ").trim());
  }

  return chunks;
}

function renderDescription(description?: string | null) {
  if (!description || !description.trim()) {
    return <p className="text-[16px] leading-7 text-neutral-700">Geen omschrijving beschikbaar.</p>;
  }

  const rawLines = description
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  const bulletLines = rawLines
    .filter(
      (line) =>
        line.startsWith("- ") ||
        line.startsWith("• ") ||
        line.startsWith("* ")
    )
    .map((line) => line.replace(/^[-•*]\s+/, "").trim())
    .filter(Boolean);

  const nonBulletText = rawLines
    .filter(
      (line) =>
        !line.startsWith("- ") &&
        !line.startsWith("• ") &&
        !line.startsWith("* ")
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const sentences = splitIntoSentences(nonBulletText);

  if (sentences.length === 0 && bulletLines.length === 0) {
    return <p className="text-[16px] leading-7 text-neutral-700">Geen omschrijving beschikbaar.</p>;
  }

  const sections: DescriptionSection[] = [];
  const usedSentenceIndexes = new Set<number>();

  const introSentences = sentences.slice(0, Math.min(2, sentences.length));
  if (introSentences.length > 0) {
    introSentences.forEach((_, index) => usedSentenceIndexes.add(index));
    sections.push({
      paragraphs: [introSentences.join(" ")],
    });
  }

  const groups = [
    {
      title: "Indeling en ruimte",
      keywords: [
        "woonoppervlakte",
        "kamer",
        "kamers",
        "slaapkamer",
        "slaapkamers",
        "indeling",
        "woonruimte",
        "eethoek",
        "lichte",
        "licht",
        "raampartijen",
        "leefruimte",
        "hobbyruimte",
        "thuiskantoor",
        "thuiswerken",
        "gezin",
        "praktisch",
        "ruimt",
      ],
    },
    {
      title: "Buitenruimte",
      keywords: [
        "tuin",
        "perceel",
        "buiten",
        "buitenruimte",
        "terras",
        "groen",
        "buitenleven",
        "ontspanning",
        "speelgelegenheid",
      ],
    },
    {
      title: "Ligging",
      keywords: [
        "gelegen",
        "locatie",
        "omgeving",
        "voorzieningen",
        "bereik",
        "rustig",
        "ligging",
        "buurt",
        "nabij",
        "handbereik",
      ],
    },
    {
      title: "Duurzaamheid en bouwjaar",
      keywords: [
        "bouwjaar",
        "energielabel",
        "energiezuinig",
        "duurzaam",
        "toekomst",
        "solide",
      ],
    },
  ];

  for (const group of groups) {
    const matchedSentences: string[] = [];

    sentences.forEach((sentence, index) => {
      if (usedSentenceIndexes.has(index)) {
        return;
      }

      const lower = sentence.toLowerCase();
      const isMatch = group.keywords.some((keyword) => lower.includes(keyword));

      if (isMatch) {
        matchedSentences.push(sentence);
        usedSentenceIndexes.add(index);
      }
    });

    if (matchedSentences.length > 0) {
      sections.push({
        title: group.title,
        paragraphs: chunkSentences(matchedSentences, 2),
      });
    }
  }

  const remainingSentences = sentences.filter((_, index) => !usedSentenceIndexes.has(index));
  if (remainingSentences.length > 0) {
    sections.push({
      title: "Meer over deze woning",
      paragraphs: chunkSentences(remainingSentences, 2),
    });
  }

  if (bulletLines.length > 0) {
    sections.push({
      title: "Belangrijkste kenmerken",
      paragraphs: [],
      bullets: bulletLines,
    });
  }

  return (
    <div className="space-y-8">
      {sections.map((section, sectionIndex) => (
        <div key={`section-${sectionIndex}`} className="space-y-4">
          {section.title ? (
            <h3 className="text-lg font-semibold text-neutral-900">
              {section.title}
            </h3>
          ) : null}

          {section.paragraphs.map((paragraph, paragraphIndex) => (
            <p
              key={`section-${sectionIndex}-paragraph-${paragraphIndex}`}
              className="text-[16px] leading-7 text-neutral-700"
            >
              {paragraph}
            </p>
          ))}

          {section.bullets && section.bullets.length > 0 ? (
            <ul className="space-y-2 pl-5 text-[16px] leading-7 text-neutral-700">
              {section.bullets.map((item, bulletIndex) => (
                <li
                  key={`section-${sectionIndex}-bullet-${bulletIndex}`}
                  className="list-disc"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
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

  const isOwner = listing.user_id === user?.id;
  const isPublicVisible = listing.status === "active" || listing.status === "sold";

  if (!isPublicVisible && !isOwner) {
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
              status={listing.status}
            />

            <ListingHighlights
              propertyType={formatPropertyType(listing.property_type)}
              yearBuilt={listing.year_built || 0}
              energyLabel={listing.energy_label || "-"}
              plotSize={listing.plot_size || 0}
            />

            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-2xl font-semibold text-neutral-900">
                Omschrijving
              </h2>

              <div className="max-w-3xl">
                {renderDescription(listing.description)}
              </div>

              {listing.latitude && listing.longitude && (
                <div className="mt-10">
                  <ListingMap
                    address={listing.street || "Onbekend adres"}
                    city={listing.city || ""}
                    lat={listing.latitude}
                    lng={listing.longitude}
                  />
                </div>
              )}
            </section>

            {listing.status !== "sold" && (
              <ListingLeadForm
                listingId={listing.id}
                listingTitle={listing.title || ""}
              />
            )}
          </div>

          <div className="min-w-0">
            <ListingSidebarCard
              price={listing.asking_price}
              bedrooms={listing.bedrooms || undefined}
              livingArea={listing.living_area || undefined}
              plotArea={listing.plot_size || undefined}
              yearBuilt={listing.year_built || undefined}
              energyLabel={listing.energy_label || undefined}
              status={listing.status}
            />
          </div>
        </div>
      </div>
    </main>
  );
}