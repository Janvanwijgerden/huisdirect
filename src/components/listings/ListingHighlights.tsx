import {
  Calendar,
  Home,
  Leaf,
  Ruler,
  Bath,
  BedDouble,
  Building2,
  Car,
  Sun,
  Trees,
  Waves,
} from "lucide-react";

type Props = {
  listing: any;
};

type HighlightItem = {
  icon: any;
  label: string;
  value: string;
};

function hasValue(value: any) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function formatPropertyType(value?: string | null) {
  switch (value) {
    case "eengezinswoning":
      return "Eengezinswoning";
    case "tussenwoning":
      return "Tussenwoning";
    case "hoekwoning":
      return "Hoekwoning";
    case "appartement":
      return "Appartement";
    case "vrijstaande_woning":
      return "Vrijstaande woning";
    case "twee_onder_een_kap":
      return "Twee-onder-een-kap";
    case "bungalow":
      return "Bungalow";
    default:
      return value || "Woning";
  }
}

function formatOrientation(value?: string) {
  if (!value) return "";
  return value.replace(/_/g, "-");
}

export default function ListingHighlights({ listing }: Props) {
  const features =
    typeof listing.features === "string"
      ? JSON.parse(listing.features || "{}")
      : listing.features || {};

  const items: HighlightItem[] = [];

  // Basis
  if (hasValue(listing.property_type)) {
    items.push({
      icon: Home,
      label: "Type woning",
      value: formatPropertyType(listing.property_type),
    });
  }

  if (hasValue(listing.year_built)) {
    items.push({
      icon: Calendar,
      label: "Bouwjaar",
      value: String(listing.year_built),
    });
  }

  if (hasValue(listing.energy_label)) {
    items.push({
      icon: Leaf,
      label: "Energielabel",
      value: listing.energy_label,
    });
  }

  if (hasValue(listing.living_area)) {
    items.push({
      icon: Ruler,
      label: "Woonoppervlakte",
      value: `${listing.living_area} m²`,
    });
  }

  if (hasValue(listing.plot_size)) {
    items.push({
      icon: Trees,
      label: "Perceel",
      value: `${listing.plot_size} m²`,
    });
  }

  // Indeling
  if (hasValue(features?.layout?.rooms)) {
    items.push({
      icon: Building2,
      label: "Aantal kamers",
      value: String(features.layout.rooms),
    });
  }

  if (hasValue(features?.layout?.bathrooms)) {
    items.push({
      icon: Bath,
      label: "Badkamers",
      value: String(features.layout.bathrooms),
    });
  }

  if (hasValue(listing.bedrooms)) {
    items.push({
      icon: BedDouble,
      label: "Slaapkamers",
      value: String(listing.bedrooms),
    });
  }

  if (hasValue(features?.layout?.floors)) {
    items.push({
      icon: Building2,
      label: "Woonlagen",
      value: String(features.layout.floors),
    });
  }

  // Buitenruimte
  if (features?.outdoor?.garden?.hasGarden) {
    let text = "Aanwezig";

    if (hasValue(features?.outdoor?.garden?.orientation)) {
      text += ` (${formatOrientation(
        features.outdoor.garden.orientation,
      )})`;
    }

    items.push({
      icon: Trees,
      label: "Tuin",
      value: text,
    });
  }

  if (features?.outdoor?.balcony?.hasBalcony) {
    items.push({
      icon: Sun,
      label: "Balkon",
      value: "Aanwezig",
    });
  }

  if (features?.outdoor?.roofTerrace?.hasRoofTerrace) {
    items.push({
      icon: Sun,
      label: "Dakterras",
      value: "Aanwezig",
    });
  }

  // Energie & comfort
  if (features?.energy?.solarPanels) {
    items.push({
      icon: Sun,
      label: "Zonnepanelen",
      value: "Ja",
    });
  }

  if (features?.energy?.heatPump) {
    items.push({
      icon: Leaf,
      label: "Warmtepomp",
      value: "Ja",
    });
  }

  if (features?.energy?.airco) {
    items.push({
      icon: Sun,
      label: "Airconditioning",
      value: "Ja",
    });
  }

  // Parkeren
  if (features?.parking?.hasDriveway) {
    items.push({
      icon: Car,
      label: "Oprit",
      value: "Ja",
    });
  }

  if (features?.garage?.hasGarage) {
    items.push({
      icon: Car,
      label: "Garage",
      value: "Ja",
    });
  }

  // Ligging
  if (features?.location?.waterfront) {
    items.push({
      icon: Waves,
      label: "Ligging",
      value: "Aan water",
    });
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="mb-6 text-2xl font-semibold text-stone-900">
        Belangrijkste kenmerken
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={`${item.label}-${item.value}`}
              className="rounded-2xl border border-stone-200 bg-white p-4"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon className="h-5 w-5" />
              </div>

              <p className="text-xs font-medium uppercase tracking-[0.12em] text-stone-500">
                {item.label}
              </p>

              <p className="mt-1 text-sm font-semibold text-stone-900">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}