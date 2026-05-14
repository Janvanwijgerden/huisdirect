"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  Filter,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import ListingGrid from "./ListingGrid";

type ListingLike = {
  id: string;
  title?: string | null;
  city?: string | null;
  province?: string | null;
  street?: string | null;
  postal_code?: string | null;
  asking_price?: number | null;
  living_area?: number | null;
  plot_size?: number | null;
  bedrooms?: number | null;
  energy_label?: string | null;
  year_built?: number | null;
  property_type?: string | null;
  status?: string | null;
  features?: unknown;
  created_at?: string | null;
  [key: string]: unknown;
};

type Props = {
  listings: ListingLike[];
};

type Filters = {
  search: string;
  province: string;
  city: string;
  propertyTypes: string[];
  minPrice: string;
  maxPrice: string;
  minLivingArea: string;
  minPlotSize: string;
  minBedrooms: string;
  minBathrooms: string;
  energyLabels: string[];
  status: "active" | "sold" | "all";
  hasGarden: boolean;
  hasBalcony: boolean;
  hasRoofTerrace: boolean;
  hasGarage: boolean;
  hasDriveway: boolean;
  hasPrivateParking: boolean;
  hasEvCharger: boolean;
  hasSolarPanels: boolean;
  hasHeatPump: boolean;
  hasFloorHeating: boolean;
  hasAirco: boolean;
  gasFree: boolean;
  hasLift: boolean;
  hasVve: boolean;
  hasHomeOffice: boolean;
  hasFireplace: boolean;
  hasSwimmingPool: boolean;
  hasSauna: boolean;
  waterfront: boolean;
  freeView: boolean;
  childFriendly: boolean;
  nearSchools: boolean;
  nearShops: boolean;
  nearPublicTransport: boolean;
  nearForest: boolean;
  isMonument: boolean;
  hasErfpacht: boolean;
  sort: "newest" | "price_asc" | "price_desc" | "living_desc" | "area_desc";
};

const defaultFilters: Filters = {
  search: "",
  province: "",
  city: "",
  propertyTypes: [],
  minPrice: "",
  maxPrice: "",
  minLivingArea: "",
  minPlotSize: "",
  minBedrooms: "",
  minBathrooms: "",
  energyLabels: [],
  status: "active",
  hasGarden: false,
  hasBalcony: false,
  hasRoofTerrace: false,
  hasGarage: false,
  hasDriveway: false,
  hasPrivateParking: false,
  hasEvCharger: false,
  hasSolarPanels: false,
  hasHeatPump: false,
  hasFloorHeating: false,
  hasAirco: false,
  gasFree: false,
  hasLift: false,
  hasVve: false,
  hasHomeOffice: false,
  hasFireplace: false,
  hasSwimmingPool: false,
  hasSauna: false,
  waterfront: false,
  freeView: false,
  childFriendly: false,
  nearSchools: false,
  nearShops: false,
  nearPublicTransport: false,
  nearForest: false,
  isMonument: false,
  hasErfpacht: false,
  sort: "newest",
};

const propertyTypeOptions = [
  { value: "eengezinswoning", label: "Eengezinswoning" },
  { value: "appartement", label: "Appartement" },
  { value: "tussenwoning", label: "Tussenwoning" },
  { value: "hoekwoning", label: "Hoekwoning" },
  { value: "twee_onder_een_kap", label: "Twee-onder-een-kap" },
  { value: "vrijstaande_woning", label: "Vrijstaand" },
  { value: "vrijstaand", label: "Vrijstaand" },
  { value: "bungalow", label: "Bungalow" },
];

const energyLabelOptions = ["A++++", "A+++", "A++", "A+", "A", "B", "C", "D", "E", "F", "G"];

function parseFeatures(value: unknown): any {
  if (!value) return {};
  if (typeof value === "object") return value;

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }

  return {};
}

function bool(value: unknown): boolean {
  return value === true || value === "true" || value === 1 || value === "1";
}

function numberValue(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function text(value: unknown): string {
  return String(value || "").trim().toLowerCase();
}

function includesNormalized(source: unknown, query: string) {
  if (!query) return true;
  return text(source).includes(query);
}

function getBathroomCount(features: any) {
  return numberValue(features?.layout?.bathrooms) || 0;
}

function getHasGarden(features: any) {
  return bool(features?.outdoor?.garden?.hasGarden);
}

function getHasBalcony(features: any) {
  const balcony = features?.outdoor?.balcony;
  if (typeof balcony === "boolean" || typeof balcony === "string") return bool(balcony);
  return bool(balcony?.hasBalcony);
}

function getHasRoofTerrace(features: any) {
  const roofTerrace = features?.outdoor?.roofTerrace;
  if (typeof roofTerrace === "boolean" || typeof roofTerrace === "string") return bool(roofTerrace);
  return bool(roofTerrace?.hasRoofTerrace);
}

function getHasAirco(features: any) {
  return bool(features?.energy?.airco) || bool(features?.extras?.airco);
}

function getHasSolarPanels(features: any) {
  return bool(features?.energy?.solarPanels) || bool(features?.extras?.solarPanels);
}

function getHasLift(features: any) {
  return bool(features?.vve?.hasLift) || bool(features?.extras?.elevator);
}

function getListingDate(listing: ListingLike) {
  const value = listing.created_at ? new Date(listing.created_at).getTime() : 0;
  return Number.isFinite(value) ? value : 0;
}

function uniqueSorted(values: Array<string | null | undefined>) {
  return Array.from(
    new Set(values.map((value) => String(value || "").trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "nl"));
}

function toggleArrayValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function countActiveFilters(filters: Filters) {
  let count = 0;

  if (filters.search) count += 1;
  if (filters.province) count += 1;
  if (filters.city) count += 1;
  if (filters.propertyTypes.length) count += 1;
  if (filters.minPrice) count += 1;
  if (filters.maxPrice) count += 1;
  if (filters.minLivingArea) count += 1;
  if (filters.minPlotSize) count += 1;
  if (filters.minBedrooms) count += 1;
  if (filters.minBathrooms) count += 1;
  if (filters.energyLabels.length) count += 1;
  if (filters.status !== "active") count += 1;

  const booleanKeys: Array<keyof Filters> = [
    "hasGarden",
    "hasBalcony",
    "hasRoofTerrace",
    "hasGarage",
    "hasDriveway",
    "hasPrivateParking",
    "hasEvCharger",
    "hasSolarPanels",
    "hasHeatPump",
    "hasFloorHeating",
    "hasAirco",
    "gasFree",
    "hasLift",
    "hasVve",
    "hasHomeOffice",
    "hasFireplace",
    "hasSwimmingPool",
    "hasSauna",
    "waterfront",
    "freeView",
    "childFriendly",
    "nearSchools",
    "nearShops",
    "nearPublicTransport",
    "nearForest",
    "isMonument",
    "hasErfpacht",
  ];

  for (const key of booleanKeys) {
    if (filters[key]) count += 1;
  }

  return count;
}

function filterListings(listings: ListingLike[], filters: Filters) {
  const query = filters.search.trim().toLowerCase();
  const minPrice = numberValue(filters.minPrice);
  const maxPrice = numberValue(filters.maxPrice);
  const minLivingArea = numberValue(filters.minLivingArea);
  const minPlotSize = numberValue(filters.minPlotSize);
  const minBedrooms = numberValue(filters.minBedrooms);
  const minBathrooms = numberValue(filters.minBathrooms);

  return listings
    .filter((listing) => {
      const features = parseFeatures(listing.features);
      const searchableLocation = [
        listing.title,
        listing.city,
        listing.province,
        listing.street,
        listing.postal_code,
        features?.location?.type,
      ].join(" ");

      if (query && !includesNormalized(searchableLocation, query)) return false;
      if (filters.province && listing.province !== filters.province) return false;
      if (filters.city && listing.city !== filters.city) return false;

      if (filters.status !== "all" && listing.status !== filters.status) return false;

      if (filters.propertyTypes.length > 0) {
        const type = String(listing.property_type || "");
        if (!filters.propertyTypes.includes(type)) return false;
      }

      if (minPrice !== null && Number(listing.asking_price || 0) < minPrice) return false;
      if (maxPrice !== null && Number(listing.asking_price || 0) > maxPrice) return false;
      if (minLivingArea !== null && Number(listing.living_area || 0) < minLivingArea) return false;
      if (minPlotSize !== null && Number(listing.plot_size || 0) < minPlotSize) return false;
      if (minBedrooms !== null && Number(listing.bedrooms || 0) < minBedrooms) return false;
      if (minBathrooms !== null && getBathroomCount(features) < minBathrooms) return false;

      if (filters.energyLabels.length > 0) {
        const label = String(listing.energy_label || features?.energy?.label || "");
        if (!filters.energyLabels.includes(label)) return false;
      }

      if (filters.hasGarden && !getHasGarden(features)) return false;
      if (filters.hasBalcony && !getHasBalcony(features)) return false;
      if (filters.hasRoofTerrace && !getHasRoofTerrace(features)) return false;

      if (filters.hasGarage && !bool(features?.garage?.hasGarage)) return false;
      if (filters.hasDriveway && !bool(features?.parking?.hasDriveway)) return false;
      if (filters.hasPrivateParking && !bool(features?.parking?.hasPrivateParking)) return false;
      if (filters.hasEvCharger && !bool(features?.parking?.hasEvCharger)) return false;

      if (filters.hasSolarPanels && !getHasSolarPanels(features)) return false;
      if (filters.hasHeatPump && !bool(features?.energy?.heatPump)) return false;
      if (filters.hasFloorHeating && !bool(features?.energy?.floorHeating)) return false;
      if (filters.hasAirco && !getHasAirco(features)) return false;
      if (filters.gasFree && !bool(features?.energy?.gasFree)) return false;

      if (filters.hasLift && !getHasLift(features)) return false;
      if (filters.hasVve && !bool(features?.vve?.hasVve)) return false;

      if (filters.hasHomeOffice && !bool(features?.comfort?.homeOffice)) return false;
      if (filters.hasFireplace && !bool(features?.comfort?.fireplace) && !bool(features?.extras?.fireplace)) return false;
      if (filters.hasSwimmingPool && !bool(features?.comfort?.swimmingPool) && !bool(features?.extras?.swimmingPool)) return false;
      if (filters.hasSauna && !bool(features?.comfort?.sauna)) return false;

      if (filters.waterfront && !bool(features?.location?.waterfront)) return false;
      if (filters.freeView && !bool(features?.location?.freeView)) return false;
      if (filters.childFriendly && !bool(features?.location?.childFriendly)) return false;
      if (filters.nearSchools && !bool(features?.location?.nearSchools)) return false;
      if (filters.nearShops && !bool(features?.location?.nearShops)) return false;
      if (filters.nearPublicTransport && !bool(features?.location?.nearPublicTransport)) return false;
      if (filters.nearForest && !bool(features?.location?.nearForest)) return false;

      if (filters.isMonument && !bool(features?.legal?.isMonument)) return false;
      if (filters.hasErfpacht && !bool(features?.legal?.hasErfpacht)) return false;

      return true;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case "price_asc":
          return Number(a.asking_price || Number.MAX_SAFE_INTEGER) - Number(b.asking_price || Number.MAX_SAFE_INTEGER);
        case "price_desc":
          return Number(b.asking_price || 0) - Number(a.asking_price || 0);
        case "living_desc":
          return Number(b.living_area || 0) - Number(a.living_area || 0);
        case "area_desc":
          return Number(b.plot_size || 0) - Number(a.plot_size || 0);
        case "newest":
        default:
          return getListingDate(b) - getListingDate(a);
      }
    });
}

function formatPropertyType(value: string) {
  const found = propertyTypeOptions.find((option) => option.value === value);
  return found?.label || value.replace(/_/g, " ");
}

function PillCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
        checked
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
      }`}
    >
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
      />
    </label>
  );
}

function FilterSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-stone-100 py-5 first:border-t-0 first:pt-0 last:pb-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="text-sm font-semibold text-stone-950">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-stone-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}


type SortOption = {
  value: Filters["sort"];
  label: string;
};

const sortOptions: SortOption[] = [
  { value: "newest", label: "Nieuwste eerst" },
  { value: "price_asc", label: "Prijs laag naar hoog" },
  { value: "price_desc", label: "Prijs hoog naar laag" },
  { value: "living_desc", label: "Grootste woonoppervlak" },
  { value: "area_desc", label: "Grootste perceel" },
];

function SortDropdown({
  value,
  onChange,
}: {
  value: Filters["sort"];
  onChange: (value: Filters["sort"]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected =
    sortOptions.find((option) => option.value === value) ?? sortOptions[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative min-w-[280px]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-full items-center justify-between rounded-2xl border border-emerald-300 bg-white px-4 text-sm font-medium text-stone-800 shadow-sm transition hover:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100"
      >
        <span>{selected.label}</span>
        <ChevronDown
          className={`h-4 w-4 text-stone-500 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-30 mt-2 w-full overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`flex w-full items-center px-4 py-3 text-left text-sm transition ${
                value === option.value
                  ? "bg-emerald-50 font-semibold text-emerald-800"
                  : "text-stone-700 hover:bg-stone-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function ListingsFilterClient({ listings }: Props) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const provinces = useMemo(
    () => uniqueSorted(listings.map((listing) => listing.province)),
    [listings]
  );

  const cities = useMemo(() => {
    return uniqueSorted(
      listings
        .filter((listing) => !filters.province || listing.province === filters.province)
        .map((listing) => listing.city)
    );
  }, [listings, filters.province]);

  const filteredListings = useMemo(
    () => filterListings(listings, filters),
    [listings, filters]
  );

  const activeFilterCount = countActiveFilters(filters);

  function setFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function resetFilters() {
    setFilters(defaultFilters);
  }

  const filterPanel = (
    <div className="rounded-[30px] border border-stone-200 bg-white p-5 shadow-[0_16px_50px_rgba(28,25,23,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-stone-950">Filters</p>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            Zoek gericht op locatie, woningtype en kenmerken.
          </p>
        </div>

        {activeFilterCount > 0 ? (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Wis
          </button>
        ) : null}
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
            Locatie
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              value={filters.search}
              onChange={(event) => setFilter("search", event.target.value)}
              placeholder="Plaats, wijk, straat, postcode..."
              className="h-12 w-full rounded-2xl border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <select
            value={filters.province}
            onChange={(event) => {
              setFilters((current) => ({
                ...current,
                province: event.target.value,
                city: "",
              }));
            }}
            className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="">Alle provincies</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>

          <select
            value={filters.city}
            onChange={(event) => setFilter("city", event.target.value)}
            className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="">Alle plaatsen</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <FilterSection title="Prijs en formaat" defaultOpen>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <input
            type="number"
            value={filters.minPrice}
            onChange={(event) => setFilter("minPrice", event.target.value)}
            placeholder="Min. prijs"
            className="h-12 rounded-2xl border border-stone-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(event) => setFilter("maxPrice", event.target.value)}
            placeholder="Max. prijs"
            className="h-12 rounded-2xl border border-stone-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
          <input
            type="number"
            value={filters.minLivingArea}
            onChange={(event) => setFilter("minLivingArea", event.target.value)}
            placeholder="Min. woonoppervlak m²"
            className="h-12 rounded-2xl border border-stone-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
          <input
            type="number"
            value={filters.minPlotSize}
            onChange={(event) => setFilter("minPlotSize", event.target.value)}
            placeholder="Min. perceel m²"
            className="h-12 rounded-2xl border border-stone-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
          <input
            type="number"
            value={filters.minBedrooms}
            onChange={(event) => setFilter("minBedrooms", event.target.value)}
            placeholder="Min. slaapkamers"
            className="h-12 rounded-2xl border border-stone-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
          <input
            type="number"
            value={filters.minBathrooms}
            onChange={(event) => setFilter("minBathrooms", event.target.value)}
            placeholder="Min. badkamers"
            className="h-12 rounded-2xl border border-stone-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </div>
      </FilterSection>

      <FilterSection title="Woningtype">
        <div className="space-y-2">
          {propertyTypeOptions
            .filter((option, index, array) => array.findIndex((item) => item.label === option.label) === index)
            .map((option) => (
              <PillCheckbox
                key={option.value}
                label={option.label}
                checked={filters.propertyTypes.includes(option.value)}
                onChange={() =>
                  setFilter("propertyTypes", toggleArrayValue(filters.propertyTypes, option.value))
                }
              />
            ))}
        </div>
      </FilterSection>

      <FilterSection title="Energielabel">
        <div className="grid grid-cols-3 gap-2">
          {energyLabelOptions.map((label) => (
            <button
              type="button"
              key={label}
              onClick={() => setFilter("energyLabels", toggleArrayValue(filters.energyLabels, label))}
              className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                filters.energyLabels.includes(label)
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Buitenruimte">
        <div className="space-y-2">
          <PillCheckbox label="Tuin" checked={filters.hasGarden} onChange={(value) => setFilter("hasGarden", value)} />
          <PillCheckbox label="Balkon" checked={filters.hasBalcony} onChange={(value) => setFilter("hasBalcony", value)} />
          <PillCheckbox label="Dakterras" checked={filters.hasRoofTerrace} onChange={(value) => setFilter("hasRoofTerrace", value)} />
        </div>
      </FilterSection>

      <FilterSection title="Parkeren">
        <div className="space-y-2">
          <PillCheckbox label="Garage" checked={filters.hasGarage} onChange={(value) => setFilter("hasGarage", value)} />
          <PillCheckbox label="Oprit" checked={filters.hasDriveway} onChange={(value) => setFilter("hasDriveway", value)} />
          <PillCheckbox label="Eigen parkeerplaats" checked={filters.hasPrivateParking} onChange={(value) => setFilter("hasPrivateParking", value)} />
          <PillCheckbox label="Laadpaal" checked={filters.hasEvCharger} onChange={(value) => setFilter("hasEvCharger", value)} />
        </div>
      </FilterSection>

      <FilterSection title="Duurzaamheid">
        <div className="space-y-2">
          <PillCheckbox label="Zonnepanelen" checked={filters.hasSolarPanels} onChange={(value) => setFilter("hasSolarPanels", value)} />
          <PillCheckbox label="Warmtepomp" checked={filters.hasHeatPump} onChange={(value) => setFilter("hasHeatPump", value)} />
          <PillCheckbox label="Vloerverwarming" checked={filters.hasFloorHeating} onChange={(value) => setFilter("hasFloorHeating", value)} />
          <PillCheckbox label="Airco" checked={filters.hasAirco} onChange={(value) => setFilter("hasAirco", value)} />
          <PillCheckbox label="Gasloos" checked={filters.gasFree} onChange={(value) => setFilter("gasFree", value)} />
        </div>
      </FilterSection>

      <FilterSection title="Comfort en ligging">
        <div className="space-y-2">
          <PillCheckbox label="Lift" checked={filters.hasLift} onChange={(value) => setFilter("hasLift", value)} />
          <PillCheckbox label="VvE" checked={filters.hasVve} onChange={(value) => setFilter("hasVve", value)} />
          <PillCheckbox label="Kantoorruimte" checked={filters.hasHomeOffice} onChange={(value) => setFilter("hasHomeOffice", value)} />
          <PillCheckbox label="Open haard" checked={filters.hasFireplace} onChange={(value) => setFilter("hasFireplace", value)} />
          <PillCheckbox label="Zwembad" checked={filters.hasSwimmingPool} onChange={(value) => setFilter("hasSwimmingPool", value)} />
          <PillCheckbox label="Sauna" checked={filters.hasSauna} onChange={(value) => setFilter("hasSauna", value)} />
          <PillCheckbox label="Aan water" checked={filters.waterfront} onChange={(value) => setFilter("waterfront", value)} />
          <PillCheckbox label="Vrij uitzicht" checked={filters.freeView} onChange={(value) => setFilter("freeView", value)} />
          <PillCheckbox label="Kindvriendelijk" checked={filters.childFriendly} onChange={(value) => setFilter("childFriendly", value)} />
          <PillCheckbox label="Nabij scholen" checked={filters.nearSchools} onChange={(value) => setFilter("nearSchools", value)} />
          <PillCheckbox label="Nabij winkels" checked={filters.nearShops} onChange={(value) => setFilter("nearShops", value)} />
          <PillCheckbox label="Nabij OV" checked={filters.nearPublicTransport} onChange={(value) => setFilter("nearPublicTransport", value)} />
          <PillCheckbox label="Nabij natuur" checked={filters.nearForest} onChange={(value) => setFilter("nearForest", value)} />
        </div>
      </FilterSection>

      <FilterSection title="Status en juridisch">
        <div className="space-y-3">
          <select
            value={filters.status}
            onChange={(event) => setFilter("status", event.target.value as Filters["status"])}
            className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="active">Alleen te koop</option>
            <option value="sold">Alleen verkocht</option>
            <option value="all">Alles tonen</option>
          </select>
          <PillCheckbox label="Monument" checked={filters.isMonument} onChange={(value) => setFilter("isMonument", value)} />
          <PillCheckbox label="Erfpacht" checked={filters.hasErfpacht} onChange={(value) => setFilter("hasErfpacht", value)} />
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="mt-8">
      <div className="mb-5 flex flex-col gap-4 rounded-[28px] border border-stone-200 bg-white p-4 shadow-[0_14px_40px_rgba(28,25,23,0.05)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-950">
              {filteredListings.length} {filteredListings.length === 1 ? "woning" : "woningen"} gevonden
            </p>
            <p className="text-sm text-stone-500">
              Filter op locatie, kenmerken en woonwensen.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SortDropdown
            value={filters.sort}
            onChange={(value) => setFilter("sort", value)}
          />

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-stone-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 ? (
              <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-28">{filterPanel}</div>
        </aside>

        <div className="min-w-0">
          <ListingGrid
            listings={filteredListings}
            emptyMessage="Geen woningen gevonden met deze filters. Pas je zoekopdracht aan."
          />
        </div>
      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-stone-50 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 bg-white px-5 py-4">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-stone-950">
                <Filter className="h-4 w-4 text-emerald-700" />
                Filters
              </div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100 text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">{filterPanel}</div>

            <div className="border-t border-stone-200 bg-white p-4">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Toon {filteredListings.length} {filteredListings.length === 1 ? "woning" : "woningen"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}