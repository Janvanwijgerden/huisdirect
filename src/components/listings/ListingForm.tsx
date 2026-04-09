"use client";

import { useRef, useTransition, useState, useEffect } from "react";
import { updateDraftListing } from "../../lib/actions/listings";
import {
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
}: {
  propertyType: string;
  city: string;
  livingArea: string;
  bedrooms: string;
  energyLabel: string;
  yearBuilt: string;
  plotSize: string;
}) {
  const typeLabel = propertyType?.trim()
    ? formatPropertyTypeLabel(propertyType)
    : "Woning";

  const cityLabel = city?.trim() || "de omgeving";

  return `Deze ${typeLabel.toLowerCase()} in ${cityLabel} biedt een fijne combinatie van ruimte, comfort en praktisch wonen. Met een woonoppervlakte van ${livingArea || "—"} m² en ${bedrooms || "—"} kamers is dit een woning met volop mogelijkheden.

De indeling is logisch en prettig, met voldoende leefruimte en lichtinval om een aangename woonomgeving te creëren.

Ook buiten is het goed toeven. ${plotSize ? `Met een perceel van ${plotSize} m² is er voldoende ruimte voor ontspanning.` : ""}

De woning is gebouwd in ${yearBuilt || "—"} en beschikt over energielabel ${energyLabel || "—"}, wat bijdraagt aan een comfortabel en energiezuinig geheel.

Gelegen in ${cityLabel}, met voorzieningen en bereikbaarheid binnen handbereik.

Kortom: een woning met comfort, ruimte en potentie.`;
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
};  const inputClass =
    "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

  const sectionClass = "rounded-3xl border border-stone-200 bg-white p-6 shadow-sm";

  return (
    <div className="space-y-6">
      {publishError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Publiceren lukt nog niet</h3>
              <p className="mt-1">{publishError}</p>
            </div>
          </div>
        </div>
      )}

      <form ref={formRef} action={handleSaveDraft} id="draft-form" className="space-y-6">
        {children}

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
                Opslaan & publiceren
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Sla je voortgang op als concept of zet je woning live zodra alles goed staat.
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
              {isPending ? "Bezig..." : "Zet woning live"}
            </button>
          </div>

          <p className="mt-4 text-xs text-stone-500">
            Wijzigingen worden automatisch opgeslagen. Later kun je alles nog aanpassen.
          </p>
        </section>
      </form>
    </div>
  );
}