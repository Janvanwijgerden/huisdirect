import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { createClient } from "../../../../lib/supabase/server";

import ListingImageCarousel from "../../../../components/listings/ListingImageCarousel";
import ListingHighlights from "../../../../components/listings/ListingHighlights";
import ListingLeadForm from "../../../../components/listings/ListingLeadForm";
import ListingSidebarCard from "../../../../components/listings/ListingSidebarCard";
import ListingMap from "../../../../components/listings/ListingMap";
import ViewContentTracker from "../../../../components/tracking/ViewContentTracker";
import FavoriteButton from "../../../../components/listings/FavoriteButton";
import SocialProofCard from "../../../../components/listings/SocialProofCard";
import ListingSocialProof from "../../../../components/listings/ListingSocialProof";

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

type FeatureItem = {
  label: string;
  value: string;
};

type FeatureGroup = {
  title: string;
  items: FeatureItem[];
};

function formatPropertyType(value: string | null) {
  switch (value) {
    case "eengezinswoning":
      return "Eengezinswoning";
    case "appartement":
      return "Appartement";
    case "vrijstaande_woning":
    case "vrijstaand":
      return "Vrijstaande woning";
    case "twee_onder_een_kap":
    case "twee-onder-een-kap":
      return "Twee-onder-een-kap";
    case "hoekwoning":
      return "Hoekwoning";
    case "tussenwoning":
      return "Tussenwoning";
    case "bungalow":
      return "Bungalow";
    default:
      return value || "Woning";
  }
}

function splitIntoSentences(text: string) {
  return (
    text
      .replace(/\s+/g, " ")
      .trim()
      .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
      ?.map((sentence) => sentence.trim())
      .filter(Boolean) || []
  );
}

function chunkSentences(sentences: string[], size: number) {
  const chunks: string[] = [];

  for (let i = 0; i < sentences.length; i += size) {
    chunks.push(
      sentences
        .slice(i, i + size)
        .join(" ")
        .trim(),
    );
  }

  return chunks;
}

function parseFeatures(input: unknown): Record<string, any> {
  if (!input) return {};

  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  return typeof input === "object" ? (input as Record<string, any>) : {};
}

function isTrue(value: unknown) {
  return value === true || value === "true" || value === 1 || value === "1";
}

function hasValue(value: unknown) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function prettifyValue(value: unknown): string {
    if (!hasValue(value)) return "";
  if (typeof value === "boolean") return value ? "Ja" : "Nee";
  if (Array.isArray(value))
    return value.map(prettifyValue).filter(Boolean).join(", ");

  return String(value)
    .replace(/_/g, " ")
    .replace(/-/g, "-")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatM2(value: unknown) {
  if (!hasValue(value)) return "";
  return `${String(value).trim()} m²`;
}

function formatM3(value: unknown) {
  if (!hasValue(value)) return "";
  return `${String(value).trim()} m³`;
}

function formatEuroPerMonth(value: unknown) {
  if (!hasValue(value)) return "";
  const amount = Number(String(value).replace(/[^0-9]/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) return "";

  return (
    new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount) + " per maand"
  );
}

function pushText(items: FeatureItem[], label: string, value: unknown) {
  if (!hasValue(value)) return;
  items.push({ label, value: prettifyValue(value) });
}

function pushRaw(items: FeatureItem[], label: string, value: unknown) {
  if (!hasValue(value)) return;
  items.push({ label, value: String(value) });
}

function pushYes(items: FeatureItem[], label: string, value: unknown) {
  if (!isTrue(value)) return;
  items.push({ label, value: "Ja" });
}

function pushFormatted(items: FeatureItem[], label: string, value: string) {
  if (!hasValue(value)) return;
  items.push({ label, value });
}

function getOldOrNewBoolean(oldValue: unknown, newValue: unknown) {
  return isTrue(newValue) || oldValue === true;
}

function buildFeatureGroups(listing: any): FeatureGroup[] {
  const features = parseFeatures(listing.features);
  const groups: FeatureGroup[] = [];

  const layout = features.layout || {};
  const areas = features.areas || {};
  const general = features.general || {};
  const outdoor = features.outdoor || {};
  const energy = features.energy || {};
  const garage = features.garage || {};
  const parking = features.parking || {};
  const vve = features.vve || {};
  const kitchen = features.kitchen || {};
  const bathroom = features.bathroom || {};
  const comfort = features.comfort || {};
  const location = features.location || {};
  const accessibility = features.accessibility || {};
  const legal = features.legal || {};
  const marketing = features.marketing || {};

  const layoutItems: FeatureItem[] = [];
  pushRaw(layoutItems, "Kamers", layout.rooms);
  pushRaw(layoutItems, "Slaapkamers", layout.bedrooms || listing.bedrooms);
  pushRaw(layoutItems, "Badkamers", layout.bathrooms);
  pushRaw(layoutItems, "Toiletten", layout.toilets);
  pushRaw(layoutItems, "Woonlagen", layout.floors);
  pushFormatted(layoutItems, "Inhoud", formatM3(areas.volume));
  pushYes(layoutItems, "Zolder", layout.hasAttic);
  pushYes(layoutItems, "Kelder", layout.hasBasement);
  pushYes(
    layoutItems,
    "Berging",
    layout.hasStorage || features.storage?.hasStorage,
  );

  if (layoutItems.length > 0) {
    groups.push({ title: "Indeling en ruimte", items: layoutItems });
  }

  const generalItems: FeatureItem[] = [];
  pushText(generalItems, "Soort bouw", general.constructionType);
  pushText(generalItems, "Staat van onderhoud", general.condition);
  pushText(generalItems, "Onderhoud binnen", general.maintenanceInside);
  pushText(generalItems, "Onderhoud buiten", general.maintenanceOutside);
  pushText(generalItems, "Beschikbaarheid", general.availability);

  if (generalItems.length > 0) {
    groups.push({ title: "Bouw en staat", items: generalItems });
  }

  const outdoorItems: FeatureItem[] = [];
  const garden = outdoor.garden || {};
  const balcony = outdoor.balcony;
  const roofTerrace = outdoor.roofTerrace;

  const hasGarden = isTrue(garden.hasGarden);
  const hasBalcony =
    typeof balcony === "object" ? isTrue(balcony?.hasBalcony) : isTrue(balcony);
  const hasRoofTerrace =
    typeof roofTerrace === "object"
      ? isTrue(roofTerrace?.hasRoofTerrace)
      : isTrue(roofTerrace);

  if (hasGarden) {
    outdoorItems.push({ label: "Tuin", value: "Ja" });
    pushText(outdoorItems, "Type tuin", garden.type);
    pushText(outdoorItems, "Ligging tuin", garden.orientation);
    pushFormatted(outdoorItems, "Tuinoppervlakte", formatM2(garden.size));
    pushYes(outdoorItems, "Achterom", garden.hasBackEntrance);
    pushYes(outdoorItems, "Veranda", garden.hasVeranda);
    pushYes(outdoorItems, "Tuinhuis", garden.hasGardenHouse);
  }

  if (hasBalcony) {
    outdoorItems.push({ label: "Balkon", value: "Ja" });
    if (typeof balcony === "object") {
      pushRaw(outdoorItems, "Aantal balkons", balcony.count);
      pushText(outdoorItems, "Ligging balkon", balcony.orientation);
      pushFormatted(outdoorItems, "Balkonoppervlakte", formatM2(balcony.size));
    }
  }

  if (hasRoofTerrace) {
    outdoorItems.push({ label: "Dakterras", value: "Ja" });
    if (typeof roofTerrace === "object") {
      pushText(outdoorItems, "Ligging dakterras", roofTerrace.orientation);
      pushFormatted(
        outdoorItems,
        "Dakterrasoppervlakte",
        formatM2(roofTerrace.size),
      );
    }
  }

  if (outdoorItems.length > 0) {
    groups.push({ title: "Buitenruimte", items: outdoorItems });
  }

  const energyItems: FeatureItem[] = [];
  pushText(energyItems, "Energielabel", energy.label || listing.energy_label);
  pushText(energyItems, "Verwarming", energy.heating);
  pushText(energyItems, "Warm water", energy.hotWater);
  pushText(energyItems, "Isolatie", energy.insulation);
  pushYes(
    energyItems,
    "Zonnepanelen",
    energy.solarPanels || features.extras?.solarPanels,
  );
  pushRaw(energyItems, "Aantal zonnepanelen", energy.solarPanelCount);
  pushText(energyItems, "Eigendom zonnepanelen", energy.solarPanelOwnership);
  pushYes(energyItems, "Warmtepomp", energy.heatPump);
  pushYes(energyItems, "Hybride warmtepomp", energy.hybridHeatPump);
  pushYes(energyItems, "Vloerverwarming", energy.floorHeating);
  pushYes(
    energyItems,
    "Airconditioning",
    energy.airco || features.extras?.airco,
  );
  pushYes(energyItems, "Gasloos", energy.gasFree);
  pushRaw(energyItems, "Bouwjaar cv-ketel", energy.boilerYear);

  if (energyItems.length > 0) {
    groups.push({ title: "Energie en duurzaamheid", items: energyItems });
  }

  const parkingItems: FeatureItem[] = [];
  pushText(parkingItems, "Parkeren", parking.type);
  pushRaw(parkingItems, "Aantal parkeerplaatsen", parking.spaces);
  pushYes(parkingItems, "Eigen parkeerplaats", parking.hasPrivateParking);
  pushYes(parkingItems, "Oprit", parking.hasDriveway);
  pushYes(parkingItems, "Carport", parking.hasCarport);
  pushYes(parkingItems, "Parkeervergunning nodig", parking.parkingPermitNeeded);
  pushYes(
    parkingItems,
    "Garage",
    garage.hasGarage || features.garage?.hasGarage,
  );
  pushText(parkingItems, "Type garage", garage.type);
  pushRaw(parkingItems, "Capaciteit garage", garage.capacity);
  pushFormatted(parkingItems, "Garageoppervlakte", formatM2(garage.area));
  pushYes(parkingItems, "Elektrische garagedeur", garage.hasElectricDoor);
  pushYes(
    parkingItems,
    "Laadpaal",
    parking.hasEvCharger || garage.hasEvCharger,
  );

  if (parkingItems.length > 0) {
    groups.push({ title: "Parkeren en garage", items: parkingItems });
  }

  const vveItems: FeatureItem[] = [];
  pushYes(vveItems, "VvE", vve.hasVve);
  pushFormatted(vveItems, "VvE-bijdrage", formatEuroPerMonth(vve.monthlyCosts));
  pushText(vveItems, "Reservefonds", vve.reserveFund);
  pushYes(vveItems, "MJOP aanwezig", vve.hasMjop);
  pushYes(vveItems, "Lift", vve.hasLift || features.extras?.elevator);
  pushRaw(vveItems, "Gelegen op verdieping", vve.locatedOnFloor);
  pushRaw(vveItems, "Verdiepingen gebouw", vve.totalBuildingFloors);
  pushYes(vveItems, "Gedeelde tuin", vve.hasSharedGarden);
  pushYes(vveItems, "Fietsenberging", vve.hasSharedBicycleStorage);
  pushYes(vveItems, "KvK-inschrijving", vve.chamberOfCommerce);

  if (vveItems.length > 0) {
    groups.push({ title: "Appartement en VvE", items: vveItems });
  }

  const kitchenBathroomItems: FeatureItem[] = [];
  pushText(kitchenBathroomItems, "Keuken", kitchen.type);
  pushText(kitchenBathroomItems, "Staat keuken", kitchen.condition);
  pushYes(kitchenBathroomItems, "Kookeiland", kitchen.kitchenIsland);
  pushYes(kitchenBathroomItems, "Inductie", kitchen.induction);
  pushYes(kitchenBathroomItems, "Gasfornuis", kitchen.gasCooking);
  pushYes(kitchenBathroomItems, "Vaatwasser", kitchen.dishwasher);
  pushYes(kitchenBathroomItems, "Oven", kitchen.oven);
  pushYes(kitchenBathroomItems, "Koelkast", kitchen.fridge);
  pushYes(kitchenBathroomItems, "Vriezer", kitchen.freezer);
  pushYes(kitchenBathroomItems, "Quooker", kitchen.quooker);
  pushYes(kitchenBathroomItems, "Ligbad", bathroom.hasBath);
  pushYes(kitchenBathroomItems, "Inloopdouche", bathroom.walkInShower);
  pushYes(kitchenBathroomItems, "Dubbele wastafel", bathroom.doubleSink);
  pushYes(kitchenBathroomItems, "Tweede badkamer", bathroom.secondBathroom);
  pushRaw(
    kitchenBathroomItems,
    "Renovatiejaar badkamer",
    bathroom.bathroomRenovationYear,
  );

  if (kitchenBathroomItems.length > 0) {
    groups.push({ title: "Keuken en badkamer", items: kitchenBathroomItems });
  }

  const comfortItems: FeatureItem[] = [];
  pushYes(
    comfortItems,
    "Open haard",
    comfort.fireplace || features.extras?.fireplace,
  );
  pushYes(comfortItems, "Houtkachel", comfort.woodStove);
  pushYes(comfortItems, "Kantoorruimte", comfort.homeOffice);
  pushYes(comfortItems, "Wasruimte", comfort.laundryRoom);
  pushYes(comfortItems, "Inloopkast", comfort.walkInCloset);
  pushYes(comfortItems, "Sauna", comfort.sauna);
  pushYes(comfortItems, "Jacuzzi", comfort.jacuzzi);
  pushYes(
    comfortItems,
    "Zwembad",
    comfort.swimmingPool || features.extras?.swimmingPool,
  );
  pushYes(comfortItems, "Glasvezel", comfort.fiberInternet);
  pushYes(comfortItems, "Alarmsysteem", comfort.alarm);
  pushYes(comfortItems, "Camerabeveiliging", comfort.cameraSecurity);
  pushYes(comfortItems, "Smart home", comfort.smartHome);

  if (comfortItems.length > 0) {
    groups.push({ title: "Comfort en luxe", items: comfortItems });
  }

  const locationItems: FeatureItem[] = [];
  pushText(locationItems, "Ligging", location.type);
  pushText(locationItems, "Nabij", location.nearby);
  pushYes(locationItems, "Aan water", location.waterfront);
  pushYes(locationItems, "Vrij uitzicht", location.freeView);
  pushYes(locationItems, "Bosrijke omgeving", location.nearForest);
  pushYes(locationItems, "Rustige ligging", location.quietLocation);
  pushYes(locationItems, "Kindvriendelijk", location.childFriendly);
  pushYes(locationItems, "Nabij winkels", location.nearShops);
  pushYes(locationItems, "Nabij scholen", location.nearSchools);
  pushYes(locationItems, "Nabij OV", location.nearPublicTransport);
  pushYes(locationItems, "Nabij snelweg", location.nearHighway);

  if (locationItems.length > 0) {
    groups.push({ title: "Ligging en omgeving", items: locationItems });
  }

  const accessibilityItems: FeatureItem[] = [];
  pushYes(
    accessibilityItems,
    "Gelijkvloers wonen",
    accessibility.singleFloorLiving,
  );
  pushYes(
    accessibilityItems,
    "Rolstoeltoegankelijk",
    accessibility.wheelchairAccessible,
  );
  pushYes(accessibilityItems, "Brede deuren", accessibility.wideDoors);
  pushYes(accessibilityItems, "Drempelvrij", accessibility.noThresholds);
  pushYes(
    accessibilityItems,
    "Slaapkamer begane grond",
    accessibility.bedroomOnGroundFloor,
  );
  pushYes(
    accessibilityItems,
    "Badkamer begane grond",
    accessibility.bathroomOnGroundFloor,
  );

  if (accessibilityItems.length > 0) {
    groups.push({ title: "Toegankelijkheid", items: accessibilityItems });
  }

  const legalItems: FeatureItem[] = [];
  pushYes(legalItems, "Erfpacht", legal.hasErfpacht);
  pushYes(legalItems, "Erfpacht afgekocht", legal.erfpachtBoughtOff);
  pushRaw(legalItems, "Einddatum erfpacht", legal.erfpachtEndDate);
  pushRaw(legalItems, "Canon per jaar", legal.erfpachtYearlyCosts);
  pushYes(legalItems, "Monument", legal.isMonument);
  pushText(legalItems, "Type monument", legal.monumentType);
  pushYes(legalItems, "Asbest bekend", legal.asbestosKnown);
  pushYes(legalItems, "Funderingsrapport", legal.foundationReportAvailable);
  pushYes(legalItems, "Bodemrapport", legal.soilReportAvailable);

  if (legalItems.length > 0) {
    groups.push({ title: "Juridisch en bijzonderheden", items: legalItems });
  }

  const marketingItems: FeatureItem[] = [];
  pushRaw(marketingItems, "Favoriete plek", marketing.favoritePlace);
  pushRaw(marketingItems, "Ideaal voor", marketing.idealFor);
  pushRaw(marketingItems, "Pluspunten", marketing.sellingPoints);
  pushRaw(marketingItems, "Aandachtspunten", marketing.attentionPoints);

  if (marketingItems.length > 0) {
    groups.push({ title: "Persoonlijke verkoopkracht", items: marketingItems });
  }

  return groups;
}

function ListingFeatureGroups({ groups }: { groups: FeatureGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900">Kenmerken</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-500">
          De belangrijkste details van deze woning overzichtelijk op een rij.
        </p>
      </div>

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="text-lg font-semibold text-neutral-900">
              {group.title}
            </h3>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {group.items.map((item) => (
                <div
                  key={`${group.title}-${item.label}-${item.value}`}
                  className="rounded-2xl border border-stone-100 bg-stone-50/70 px-4 py-3"
                >
                  <dt className="text-xs font-medium uppercase tracking-[0.12em] text-stone-400">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-stone-900">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}

function renderDescription(description?: string | null) {
  if (!description || !description.trim()) {
    return (
      <p className="text-[16px] leading-7 text-neutral-700">
        Geen omschrijving beschikbaar.
      </p>
    );
  }

  const rawLines = description
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  const bulletLines = rawLines
    .filter(
      (line) =>
        line.startsWith("- ") || line.startsWith("• ") || line.startsWith("* "),
    )
    .map((line) => line.replace(/^[-•*]\s+/, "").trim())
    .filter(Boolean);

  const nonBulletText = rawLines
    .filter(
      (line) =>
        !line.startsWith("- ") &&
        !line.startsWith("• ") &&
        !line.startsWith("* "),
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const sentences = splitIntoSentences(nonBulletText);

  if (sentences.length === 0 && bulletLines.length === 0) {
    return (
      <p className="text-[16px] leading-7 text-neutral-700">
        Geen omschrijving beschikbaar.
      </p>
    );
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

  const remainingSentences = sentences.filter(
    (_, index) => !usedSentenceIndexes.has(index),
  );
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

export default async function ListingDetailPage({ params }: ListingPageProps) {
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
  const isPublicVisible =
    listing.status === "active" || listing.status === "sold";

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

  const featureGroups = buildFeatureGroups(listing);

  return (
    <main className="min-h-screen bg-neutral-50 pb-16">
      <ViewContentTracker listingId={listing.id} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-neutral-900 sm:text-4xl">
            {listing.title}
          </h1>

          <ListingSocialProof listingId={listing.id} />

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
            <div className="relative">
              <FavoriteButton
                listingId={listing.id}
                initialCount={listing.favorites_count || 0}
                isLoggedIn={!!user}
              />

              <ListingImageCarousel
                images={galleryImages}
                title={listing.title || "Woning"}
                status={listing.status}
              />
            </div>

            <SocialProofCard listingId={listing.id} />

            <ListingHighlights
              propertyType={formatPropertyType(listing.property_type)}
              yearBuilt={listing.year_built || 0}
              energyLabel={listing.energy_label || "-"}
              plotSize={listing.plot_size || 0}
            />

            <ListingFeatureGroups groups={featureGroups} />

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
