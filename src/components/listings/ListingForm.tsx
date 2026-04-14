"use client";

import { useRef, useTransition, useState, useEffect } from "react";
import { updateDraftListing } from "../../lib/actions/listings";
import PaymentModal from "../payments/PaymentModal";import {
  Save,
  CheckCircle2,
  AlertCircle,
  Globe,
  Home,
  MapPin,
  FileText,
  Camera,
  Ruler,
  Sparkles,
} from "lucide-react";

type Props = {
  listing: any;
  publishAction: () => Promise<{ error?: string } | void>;
  children: React.ReactNode;
};

function formatPropertyTypeLabel(value: string) {
  
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
    case "tussenwoning":
      return "Tussenwoning";
    case "bungalow":
      return "Bungalow";
    default:
      return value
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
function generateListingDescription({
  propertyType,
  city,
  livingArea,
  bedrooms,
  energyLabel,
  yearBuilt,
  plotSize,
  features,
}: {
  propertyType: string;
  city: string;
  livingArea: string;
  bedrooms: string;
  energyLabel: string;
  yearBuilt: string;
  plotSize: string;
  features: ListingFeatures;
}) {
    const typeLabel = propertyType?.trim()
    ? formatPropertyTypeLabel(propertyType)
    : "Woning";

  const cityLabel = city?.trim() || "de omgeving";
    const extras: string[] = [];

  if (features.general.condition) {
    extras.push(`De woning is in ${features.general.condition} staat.`);
  }

  if (features.layout.rooms) {
    extras.push(`De woning beschikt over ${features.layout.rooms} kamers.`);
  }

  if (features.layout.bathrooms) {
    extras.push(`${features.layout.bathrooms} badkamer(s) aanwezig.`);
  }

  if (features.outdoor.garden.hasGarden) {
    let gardenText = "Er is een tuin aanwezig";

    if (features.outdoor.garden.orientation) {
      gardenText += ` op het ${features.outdoor.garden.orientation}`;
    }

    if (features.outdoor.garden.size) {
      gardenText += ` van circa ${features.outdoor.garden.size} m²`;
    }

    extras.push(gardenText + ".");
  }

  if (features.extras.solarPanels) {
    extras.push("Voorzien van zonnepanelen.");
  }

  if (features.extras.airco) {
    extras.push("Uitgerust met airconditioning.");
  }

  if (features.extras.fireplace) {
    extras.push("Sfeervolle open haard aanwezig.");
  }

  const extrasText = extras.length ? "\n\n" + extras.join(" ") : "";

  return `Deze ${typeLabel.toLowerCase()} in ${cityLabel} biedt een fijne combinatie van ruimte, comfort en praktisch wonen. Met een woonoppervlakte van ${livingArea || "—"} m² en ${bedrooms || "—"} kamers is dit een woning met volop mogelijkheden.

De indeling is logisch en prettig, met voldoende leefruimte en lichtinval om een aangename woonomgeving te creëren.

Ook buiten is het goed toeven. ${plotSize ? `Met een perceel van ${plotSize} m² is er voldoende ruimte voor ontspanning.` : ""}

De woning is gebouwd in ${yearBuilt || "—"} en beschikt over energielabel ${energyLabel || "—"}, wat bijdraagt aan een comfortabel en energiezuinig geheel.

Gelegen in ${cityLabel}, met voorzieningen en bereikbaarheid binnen handbereik.

Kortom: een woning met comfort, ruimte en potentie.` + extrasText;
}
type ListingFeatures = {
  general: {
    condition: string;
    availability: string;
    constructionType: string;
  };
  layout: {
    rooms: string;
    bedrooms: string;
    bathrooms: string;
    floors: string;
  };
  areas: {
    livingArea: string;
    plotSize: string;
    volume: string;
  };
  energy: {
    label: string;
    insulation: string[];
    heating: string[];
    hotWater: string[];
  };
  outdoor: {
    garden: {
      hasGarden: boolean;
      orientation: string;
      size: string;
    };
    balcony: boolean;
    roofTerrace: boolean;
  };
  parking: {
    type: string[];
    spaces: string;
  };
  storage: {
    hasStorage: boolean;
    type: string;
  };
  garage: {
    hasGarage: boolean;
    type: string;
  };
  extras: {
    airco: boolean;
    solarPanels: boolean;
    elevator: boolean;
    swimmingPool: boolean;
    fireplace: boolean;
  };
  location: {
    type: string;
    nearby: string[];
  };
};

const defaultFeatures: ListingFeatures = {
  general: {
    condition: "",
    availability: "",
    constructionType: "",
  },
  layout: {
    rooms: "",
    bedrooms: "",
    bathrooms: "",
    floors: "",
  },
  areas: {
    livingArea: "",
    plotSize: "",
    volume: "",
  },
  energy: {
    label: "",
    insulation: [],
    heating: [],
    hotWater: [],
  },
  outdoor: {
    garden: {
      hasGarden: false,
      orientation: "",
      size: "",
    },
    balcony: false,
    roofTerrace: false,
  },
  parking: {
    type: [],
    spaces: "",
  },
  storage: {
    hasStorage: false,
    type: "",
  },
  garage: {
    hasGarage: false,
    type: "",
  },
  extras: {
    airco: false,
    solarPanels: false,
    elevator: false,
    swimmingPool: false,
    fireplace: false,
  },
  location: {
    type: "",
    nearby: [],
  },
};

function normalizeFeatures(input: any): ListingFeatures {
  return {
    general: {
      condition: input?.general?.condition || "",
      availability: input?.general?.availability || "",
      constructionType: input?.general?.constructionType || "",
    },
    layout: {
      rooms: input?.layout?.rooms ? String(input.layout.rooms) : "",
      bedrooms: input?.layout?.bedrooms ? String(input.layout.bedrooms) : "",
      bathrooms: input?.layout?.bathrooms ? String(input.layout.bathrooms) : "",
      floors: input?.layout?.floors ? String(input.layout.floors) : "",
    },
    areas: {
      livingArea: input?.areas?.livingArea ? String(input.areas.livingArea) : "",
      plotSize: input?.areas?.plotSize ? String(input.areas.plotSize) : "",
      volume: input?.areas?.volume ? String(input.areas.volume) : "",
    },
    energy: {
      label: input?.energy?.label || "",
      insulation: Array.isArray(input?.energy?.insulation) ? input.energy.insulation : [],
      heating: Array.isArray(input?.energy?.heating) ? input.energy.heating : [],
      hotWater: Array.isArray(input?.energy?.hotWater) ? input.energy.hotWater : [],
    },
    outdoor: {
      garden: {
        hasGarden: Boolean(input?.outdoor?.garden?.hasGarden),
        orientation: input?.outdoor?.garden?.orientation || "",
        size: input?.outdoor?.garden?.size ? String(input.outdoor.garden.size) : "",
      },
      balcony: Boolean(input?.outdoor?.balcony),
      roofTerrace: Boolean(input?.outdoor?.roofTerrace),
    },
    parking: {
      type: Array.isArray(input?.parking?.type) ? input.parking.type : [],
      spaces: input?.parking?.spaces ? String(input.parking.spaces) : "",
    },
    storage: {
      hasStorage: Boolean(input?.storage?.hasStorage),
      type: input?.storage?.type || "",
    },
    garage: {
      hasGarage: Boolean(input?.garage?.hasGarage),
      type: input?.garage?.type || "",
    },
    extras: {
      airco: Boolean(input?.extras?.airco),
      solarPanels: Boolean(input?.extras?.solarPanels),
      elevator: Boolean(input?.extras?.elevator),
      swimmingPool: Boolean(input?.extras?.swimmingPool),
      fireplace: Boolean(input?.extras?.fireplace),
    },
    location: {
      type: input?.location?.type || "",
      nearby: Array.isArray(input?.location?.nearby) ? input.location.nearby : [],
    },
  };
}

export default function ListingFormC({
  listing,
  publishAction,
  children,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const isSavingRef = useRef(false);
  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipFirstAutosaveRef = useRef(true);

  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [publishError, setPublishError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [titleManuallyEdited, setTitleManuallyEdited] = useState(
    Boolean(listing.title?.trim())
  );

  // Controlled fields for live UI + autosave
  const [title, setTitle] = useState(listing.title || "");
  const [propertyType, setPropertyType] = useState(listing.property_type || "");
  const [askingPrice, setAskingPrice] = useState(
    listing.asking_price !== null && listing.asking_price !== undefined
      ? String(listing.asking_price)
      : ""
  );
  const [street, setStreet] = useState(listing.street || "");
  const [city, setCity] = useState(listing.city || "");
  const [livingArea, setLivingArea] = useState(
    listing.living_area !== null && listing.living_area !== undefined
      ? String(listing.living_area)
      : ""
  );
  const [plotSize, setPlotSize] = useState(
    listing.plot_size !== null && listing.plot_size !== undefined
      ? String(listing.plot_size)
      : ""
  );
  const [bedrooms, setBedrooms] = useState(
    listing.bedrooms !== null && listing.bedrooms !== undefined
      ? String(listing.bedrooms)
      : ""
  );
  const [energyLabel, setEnergyLabel] = useState(listing.energy_label || "");
  const [yearBuilt, setYearBuilt] = useState(
    listing.year_built !== null && listing.year_built !== undefined
      ? String(listing.year_built)
      : ""
  );
  const [description, setDescription] = useState(listing.description || "");
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [features, setFeatures] = useState<ListingFeatures>(
    normalizeFeatures(listing.features || defaultFeatures)
  );

  // Slim titelvoorstel: alleen zolang gebruiker titel niet zelf heeft aangepast
  useEffect(() => {
    if (titleManuallyEdited) return;
    if (!propertyType.trim() || !city.trim()) return;

    const suggestedTitle = `${formatPropertyTypeLabel(propertyType)} in ${city.trim()}`;
    setTitle(suggestedTitle);
  }, [propertyType, city, titleManuallyEdited]);

  // Autosave met debounce
  useEffect(() => {
    if (skipFirstAutosaveRef.current) {
      skipFirstAutosaveRef.current = false;
      return;
    }

    if (!formRef.current) return;

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      const formData = new FormData(formRef.current!);
      if (isSavingRef.current) return;
isSavingRef.current = true;

      startTransition(async () => {
        setSaveStatus("saving");
        setPublishError(null);

try {
  const res = await updateDraftListing(listing.id, null, formData);

  if (res && res.error) {
    setSaveStatus("error");
    setPublishError(res.error);
  } else {
    setSaveStatus("saved");
    setTimeout(() => {
      setSaveStatus((current) => (current === "saved" ? "idle" : current));
    }, 2000);
  }
} finally {
  isSavingRef.current = false;
}      });
    }, 900);

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [
    listing.id,
    title,
    propertyType,
    askingPrice,
    street,
    city,
    livingArea,
    plotSize,
    bedrooms,
    energyLabel,
    yearBuilt,
    description,
  ]);

  const hasTitle = Boolean(title.trim());
  const hasType = Boolean(propertyType.trim());
  const hasPrice = Boolean(askingPrice.trim());
  const hasStreet = Boolean(street.trim());
  const hasCity = Boolean(city.trim());
  const hasDescription = Boolean(description.trim().length > 20);
  const hasImages = Boolean(listing.images?.length > 0);
  const hasLivingArea = Boolean(livingArea.trim());
  const hasBedrooms = Boolean(bedrooms.trim());
  const hasEnergyLabel = Boolean(energyLabel.trim());
  const hasYearBuilt = Boolean(yearBuilt.trim());

  const requiredItems = [
    {
      label: "Basisgegevens",
      helper: "Titel, woningtype en vraagprijs ontbreken nog.",
      done: hasTitle && hasType && hasPrice,
      icon: Home,
    },
    {
      label: "Locatie",
      helper: "Straat en woonplaats ontbreken nog.",
      done: hasStreet && hasCity,
      icon: MapPin,
    },
    {
      label: "Kenmerken",
      helper: "Woonoppervlak, slaapkamers, energielabel of bouwjaar ontbreken nog.",
      done: hasLivingArea && hasBedrooms && hasEnergyLabel && hasYearBuilt,
      icon: Ruler,
    },
    {
      label: "Beschrijving",
      helper: "Voeg een korte woningomschrijving toe.",
      done: hasDescription,
      icon: FileText,
    },
    {
      label: "Foto’s",
      helper: "Voeg minimaal één woningfoto toe.",
      done: hasImages,
      icon: Camera,
    },
  ];

  const doneCount = requiredItems.filter((item) => item.done).length;
  const progress = Math.round((doneCount / requiredItems.length) * 100);
const updateFeature = (
  category: keyof ListingFeatures,
  key: string,
  value: any
) => {
  setFeatures((prev) => ({
    ...prev,
    [category]: {
      ...prev[category],
      [key]: value,
    },
  }));
};
const updateNestedGardenFeature = (
  key: keyof ListingFeatures["outdoor"]["garden"],
  value: ListingFeatures["outdoor"]["garden"][typeof key]
) => {
  setFeatures((prev) => ({
    ...prev,
    outdoor: {
      ...prev.outdoor,
      garden: {
        ...prev.outdoor.garden,
        [key]: value,
      },
    },
  }));
};

const toggleArrayFeature = (
  category: "energy" | "parking" | "location",
  key: string,
  value: string
) => {
  setFeatures((prev) => {
    const currentValues = ((prev as any)[category][key] || []) as string[];
    const exists = currentValues.includes(value);

    return {
      ...prev,
      [category]: {
        ...(prev as any)[category],
        [key]: exists
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      },
    };
  });
};
const handleGenerateDescription = async () => {
  setIsGeneratingDescription(true);

  try {
    const res = await fetch("/api/generate-listing-description", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        propertyType,
        city,
        livingArea,
        bedrooms,
        energyLabel,
        yearBuilt,
        plotSize,
        features,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "AI generatie mislukt.");
    }

    if (data.text) {
      setDescription(data.text);
    }
  } catch (error) {
    console.error("AI fout:", error);
    alert("AI generatie mislukt.");
  } finally {
    setIsGeneratingDescription(false);
  }
};
  const handleSaveDraft = async (formData: FormData) => {if (isSavingRef.current) return;
isSavingRef.current = true;
    startTransition(async () => {
      setSaveStatus("saving");
      setPublishError(null);
try {
  const res = await updateDraftListing(listing.id, null, formData);

  if (res && res.error) {
    setSaveStatus("error");
    setPublishError(res.error);
  } else {
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 3000);
  }
} finally {
  isSavingRef.current = false;
}    });
  };

const handleSaveAndPublish = async () => {
  if (!listing.has_paid) {
    setShowPaymentModal(true);
    return;
  }

  const formElement = formRef.current;
  if (!formElement) return;
  if (isSavingRef.current) return;

  isSavingRef.current = true;

  startTransition(async () => {
    setPublishError(null);
    setSaveStatus("saving");

    try {
      const formData = new FormData(formElement);
      const res = await updateDraftListing(listing.id, null, formData);

      if (res && res.error) {
        setSaveStatus("error");
        setPublishError(`Opslaan vóór publicatie mislukt: ${res.error}`);
        return;
      }

      setSaveStatus("saved");

      try {
        await publishAction();
      } catch (err: any) {
        setPublishError(err.message);
      }
    } finally {
      isSavingRef.current = false;
    }
  });
};
const inputClass =
    "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

  const sectionClass = "rounded-3xl border border-stone-200 bg-white p-6 shadow-sm";

  return (
    <div className="space-y-6">
      {publishError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Indienen lukt nog niet</h3>
              <p className="mt-1">{publishError}</p>
            </div>
          </div>
        </div>
      )}

<form ref={formRef} action={handleSaveDraft} id="draft-form" className="space-y-6">
  {children}
  <input
    type="hidden"
    name="features"
    value={JSON.stringify(features)}
  />
        <section className={sectionClass}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
                Basisgegevens & locatie
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                De kern van je advertentie. Hoe completer dit is, hoe beter je woning gevonden en begrepen wordt.
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                hasTitle && hasType && hasPrice && hasStreet && hasCity
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {hasTitle && hasType && hasPrice && hasStreet && hasCity
                ? "Compleet"
                : "Nog nodig"}
            </span>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div className="xl:col-span-3">
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-stone-800">
                Titel
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setTitleManuallyEdited(true);
                }}
                placeholder="Bijv. Moderne gezinswoning met ruime tuin"
                className={inputClass}
              />
              {!titleManuallyEdited && propertyType.trim() && city.trim() ? (
                <p className="mt-2 text-xs text-emerald-700">
                  Titel wordt automatisch voorgesteld op basis van woningtype en woonplaats.
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="property_type" className="mb-2 block text-sm font-medium text-stone-800">
                Woningtype
              </label>
              <select
                id="property_type"
                name="property_type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className={inputClass}
              >
                <option value="">Nog niet gekozen</option>
                <option value="eengezinswoning">Eengezinswoning</option>
                <option value="appartement">Appartement</option>
                <option value="vrijstaande_woning">Vrijstaande woning</option>
                <option value="twee_onder_een_kap">Twee-onder-een-kap</option>
                <option value="hoekwoning">Hoekwoning</option>
                <option value="tussenwoning">Tussenwoning</option>
                <option value="bungalow">Bungalow</option>
              </select>
            </div>

            <div>
              <label htmlFor="asking_price" className="mb-2 block text-sm font-medium text-stone-800">
                Vraagprijs (€)
              </label>
              <input
                id="asking_price"
                name="asking_price"
                type="number"
                min="0"
                step="1000"
                value={askingPrice}
                onChange={(e) => setAskingPrice(e.target.value)}
                placeholder="Bijv. 450000"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="street" className="mb-2 block text-sm font-medium text-stone-800">
                Straat + huisnummer
              </label>
              <input
                id="street"
                name="street"
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Bijv. De Hoven 12"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="city" className="mb-2 block text-sm font-medium text-stone-800">
                Woonplaats / stad
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Bijv. Utrecht"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-stone-900">
                    Auto invullen komt hier later op
                  </p>
                  <p className="mt-1 text-sm leading-6 text-stone-600">
                    Zodra BAG / Kadaster goed gekoppeld is, kunnen straat, plaats en zoveel mogelijk basisdata automatisch worden voorgesteld of ingevuld.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={sectionClass}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
                Kenmerken
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Dit zijn de belangrijkste woningkenmerken die kopers vergelijken. Houd dit zo compleet mogelijk.
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                hasLivingArea && hasBedrooms && hasEnergyLabel && hasYearBuilt
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {hasLivingArea && hasBedrooms && hasEnergyLabel && hasYearBuilt
                ? "Sterke basis"
                : "Aanvullen"}
            </span>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label htmlFor="living_area" className="mb-2 block text-sm font-medium text-stone-800">
                Woonoppervlak (m²)
              </label>
              <input
                id="living_area"
                name="living_area"
                type="number"
                value={livingArea}
                onChange={(e) => setLivingArea(e.target.value)}
                placeholder="Bijv. 128"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="plot_size" className="mb-2 block text-sm font-medium text-stone-800">
                Perceel (m²)
              </label>
              <input
                id="plot_size"
                name="plot_size"
                type="number"
                value={plotSize}
                onChange={(e) => setPlotSize(e.target.value)}
                placeholder="Bijv. 265"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="bedrooms" className="mb-2 block text-sm font-medium text-stone-800">
                Slaapkamers
              </label>
              <input
                id="bedrooms"
                name="bedrooms"
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                placeholder="Bijv. 4"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="energy_label" className="mb-2 block text-sm font-medium text-stone-800">
                Energielabel
              </label>
              <select
                id="energy_label"
                name="energy_label"
                value={energyLabel}
                onChange={(e) => setEnergyLabel(e.target.value)}
                className={inputClass}
              >
                <option value="">Nog niet gekozen</option>
                <option value="A++++">A++++</option>
                <option value="A+++">A+++</option>
                <option value="A++">A++</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
              </select>
            </div>

            <div>
              <label htmlFor="year_built" className="mb-2 block text-sm font-medium text-stone-800">
                Bouwjaar
              </label>
              <input
                id="year_built"
                name="year_built"
                type="number"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(e.target.value)}
                placeholder="Bijv. 1998"
                className={inputClass}
              />
            </div>

            <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-medium text-stone-900">
                Later uitbreiden
              </p>
              <p className="mt-1 text-sm leading-6 text-stone-600">
                Zodra je database er klaar voor is, voegen we hier veilig velden toe zoals badkamers, woonlagen, buitenruimte, garage, berging, parkeren, isolatie en verwarming.
              </p>
            </div>
          </div>
        </section>
     <section className={sectionClass}>
  <div className="flex items-start justify-between gap-4">
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
        Extra kenmerken
      </h2>
      <p className="mt-2 text-sm leading-6 text-stone-500">
        Hoe meer relevante kenmerken je invult, hoe sterker je woning overkomt en hoe beter de AI straks een verkoopgerichte omschrijving kan schrijven.
      </p>
    </div>
    <span className="roundSed-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
      Belangrijk
    </span>
  </div>

  <div className="mt-6 space-y-8">
    <div>
      <h3 className="text-base font-semibold text-stone-900">Algemeen</h3>
      <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-800">
            Staat van onderhoud
          </label>
          <select
            value={features.general.condition}
            onChange={(e) =>
              updateFeature("general", "condition", e.target.value)
            }
            className={inputClass}
          >
            <option value="">Nog niet gekozen</option>
            <option value="uitstekend">Uitstekend</option>
            <option value="goed">Goed</option>
            <option value="redelijk">Redelijk</option>
            <option value="matig">Matig</option>
            <option value="te_renoveren">Te renoveren</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-800">
            Beschikbaarheid
          </label>
          <select
            value={features.general.availability}
            onChange={(e) =>
              updateFeature("general", "availability", e.target.value)
            }
            className={inputClass}
          >
            <option value="">Nog niet gekozen</option>
            <option value="direct">Direct beschikbaar</option>
            <option value="in_overleg">In overleg</option>
            <option value="op_termijn">Op termijn</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-800">
            Soort bouw
          </label>
          <select
            value={features.general.constructionType}
            onChange={(e) =>
              updateFeature("general", "constructionType", e.target.value)
            }
            className={inputClass}
          >
            <option value="">Nog niet gekozen</option>
            <option value="bestaande_bouw">Bestaande bouw</option>
            <option value="nieuwbouw">Nieuwbouw</option>
          </select>
        </div>
      </div>
    </div>

    <div>
      <h3 className="text-base font-semibold text-stone-900">Indeling</h3>
      <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-800">
            Aantal kamers
          </label>
          <input
            type="number"
            min="0"
            value={features.layout.rooms}
            onChange={(e) =>
              updateFeature("layout", "rooms", e.target.value)
            }
            placeholder="Bijv. 5"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-800">
            Badkamers
          </label>
          <input
            type="number"
            min="0"
            value={features.layout.bathrooms}
            onChange={(e) =>
              updateFeature("layout", "bathrooms", e.target.value)
            }
            placeholder="Bijv. 1"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-800">
            Woonlagen
          </label>
          <input
            type="number"
            min="0"
            value={features.layout.floors}
            onChange={(e) =>
              updateFeature("layout", "floors", e.target.value)
            }
            placeholder="Bijv. 2"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-800">
            Inhoud (m³)
          </label>
          <input
            type="number"
            min="0"
            value={features.areas.volume}
            onChange={(e) =>
              updateFeature("areas", "volume", e.target.value)
            }
            placeholder="Bijv. 450"
            className={inputClass}
          />
        </div>
      </div>
    </div>

    <div>
      <h3 className="text-base font-semibold text-stone-900">Buitenruimte</h3>
      <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800">
          <input
            type="checkbox"
            checked={features.outdoor.garden.hasGarden}
            onChange={(e) =>
              updateNestedGardenFeature("hasGarden", e.target.checked)
            }
            className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
          />
          Tuin aanwezig
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800">
          <input
            type="checkbox"
            checked={features.outdoor.balcony}
            onChange={(e) =>
              updateFeature("outdoor", "balcony", e.target.checked)
            }
            className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
          />
          Balkon
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800">
          <input
            type="checkbox"
            checked={features.outdoor.roofTerrace}
            onChange={(e) =>
              updateFeature("outdoor", "roofTerrace", e.target.checked)
            }
            className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
          />
          Dakterras
        </label>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-800">
            Ligging tuin
          </label>
          <select
            value={features.outdoor.garden.orientation}
            onChange={(e) =>
              updateNestedGardenFeature("orientation", e.target.value)
            }
            className={inputClass}
          >
            <option value="">Nog niet gekozen</option>
            <option value="noord">Noord</option>
            <option value="oost">Oost</option>
            <option value="zuid">Zuid</option>
            <option value="west">West</option>
            <option value="noordoost">Noordoost</option>
            <option value="zuidoost">Zuidoost</option>
            <option value="zuidwest">Zuidwest</option>
            <option value="noordwest">Noordwest</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-800">
            Tuingrootte (m²)
          </label>
          <input
            type="number"
            min="0"
            value={features.outdoor.garden.size}
            onChange={(e) =>
              updateNestedGardenFeature("size", e.target.value)
            }
            placeholder="Bijv. 85"
            className={inputClass}
          />
        </div>
      </div>
    </div>

    <div>
      <h3 className="text-base font-semibold text-stone-900">Extra’s</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800">
          <input
            type="checkbox"
            checked={features.extras.airco}
            onChange={(e) =>
              updateFeature("extras", "airco", e.target.checked)
            }
            className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
          />
          Airco
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800">
          <input
            type="checkbox"
            checked={features.extras.solarPanels}
            onChange={(e) =>
              updateFeature("extras", "solarPanels", e.target.checked)
            }
            className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
          />
          Zonnepanelen
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800">
          <input
            type="checkbox"
            checked={features.extras.fireplace}
            onChange={(e) =>
              updateFeature("extras", "fireplace", e.target.checked)
            }
            className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
          />
          Open haard
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800">
          <input
            type="checkbox"
            checked={features.extras.elevator}
            onChange={(e) =>
              updateFeature("extras", "elevator", e.target.checked)
            }
            className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
          />
          Lift
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800">
          <input
            type="checkbox"
            checked={features.extras.swimmingPool}
            onChange={(e) =>
              updateFeature("extras", "swimmingPool", e.target.checked)
            }
            className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
          />
          Zwembad
        </label>
      </div>
    </div>
  </div>
</section>   

<section className={sectionClass}>
  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
        Omschrijving
      </h2>
      <p className="mt-2 text-sm leading-6 text-stone-500">
        Laat automatisch een sterke woningomschrijving genereren op basis van de gegevens die je al hebt ingevuld.
      </p>
    </div>

    <button
      type="button"
      onClick={handleGenerateDescription}
      disabled={isGeneratingDescription}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
    >
      <Sparkles className="h-4 w-4" />
      {isGeneratingDescription ? "Genereren..." : "Genereer omschrijving"}
    </button>
  </div>

  <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
    <p className="text-sm font-medium text-stone-900">
      Slimme hulp voor sneller live zetten
    </p>
    <p className="mt-1 text-sm leading-6 text-stone-600">
      Deze knop maakt direct een nette basistekst. Daarna kun je hem zelf aanpassen.
    </p>
  </div>

  <div className="mt-6">
    <textarea
      id="description"
      name="description"
      rows={12}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Klik op 'Genereer omschrijving' of schrijf hier zelf jouw woningtekst."
      className="w-full resize-y rounded-xl border border-stone-200 p-5 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
    />
  </div>
</section>
        <section className={sectionClass}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
                Opslaan & indienen
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Sla je voortgang op als concept of dien je woning in voor controle zodra alles goed staat.
              </p>
            </div>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
              {progress}% compleet
            </span>
          </div>

          {publishError && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {publishError}
            </div>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <button
              type="button"
              disabled={isPending || saveStatus === "saving"}
              onClick={() => formRef.current?.requestSubmit()}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-semibold transition disabled:opacity-50 ${
                saveStatus === "saved"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : saveStatus === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-stone-200 bg-white text-stone-900 hover:bg-stone-50"
              }`}
            >
              {saveStatus === "saving" ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-stone-400 border-t-transparent" />
              ) : saveStatus === "saved" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : saveStatus === "error" ? (
                <AlertCircle className="h-5 w-5 text-red-600" />
              ) : (
                <Save className="h-5 w-5 text-stone-500" />
              )}
              {saveStatus === "saving"
                ? "Opslaan..."
                : saveStatus === "saved"
                ? "Opgeslagen"
                : saveStatus === "error"
                ? "Opslaan mislukt"
                : "Opslaan als concept"}
            </button>

            <button
              type="button"
              disabled={isPending || saveStatus === "saving"}
              onClick={handleSaveAndPublish}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {isPending ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Globe className="h-5 w-5" />
              )}
              {isPending ? "Bezig..." : "Dien woning in"}
            </button>
          </div>

          <p className="mt-4 text-xs text-stone-500">
            Wijzigingen worden automatisch opgeslagen. Na indienen controleren we je woning voordat deze live komt.
          </p>
        </section>
      </form>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
onStartPayment={async () => {
    setShowPaymentModal(false);
  setPublishError(null);

  try {
    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listingId: listing.id }),
    });

    const data = await res.json();

    if (!res.ok || !data.url) {
      throw new Error(data.error || "Kon Stripe checkout niet starten.");
    }

    window.location.href = data.url;
  } catch (error: any) {
    setPublishError(error.message || "Kon Stripe checkout niet starten.");
  }
}}      />
    </div>
  );
}