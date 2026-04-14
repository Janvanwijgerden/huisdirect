"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Euro,
  MapPin,
  Sparkles,
} from "lucide-react";

declare global {
  interface Window {
    google: any;
    initGooglePlacesAutocomplete?: () => void;
  }

  namespace JSX {
    interface IntrinsicElements {
      "gmp-place-autocomplete": any;
    }
  }
}

type Props = {
  action: any;
};

function fireMetaEvent(eventName: string, eventData?: Record<string, unknown>) {
  try {
    if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
      (window as any).fbq("track", eventName, eventData);
      console.log(`Meta event fired: ${eventName}`);
    }
  } catch (error) {
    console.error("Meta tracking error:", error);
  }
}

type SelectedAddress = {
  street: string;
  houseNumber: string;
  houseNumberAddition: string;
  postalCode: string;
  city: string;
  province: string;
  lat: string;
  lng: string;
  formattedAddress: string;
};

type BagData = {
  street?: string;
  city?: string;
  postal_code?: string;
  house_number?: string;
  house_number_addition?: string;
  house_letter?: string;
  plot_size?: number | string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;

  living_area?: number | string | null;
  year_built?: number | string | null;
  property_type?: string | null;

  bag_address_id?: string | null;
  bag_object_id?: string | null;
  bag_pand_id?: string | null;

  wozWaarde?: number | string;
  estimatedValueLow?: number | string;
  estimatedValueMid?: number | string;
  estimatedValueHigh?: number | string;
  valuationPricePerM2?: number | string;
  valuationConfidence?: number | string;
  valuationSource?: string;
  valuationModelVersion?: string;
};

type BagResponse = {
  success?: boolean;
  source?: string;
  data?: BagData | null;
};

function getAddressComponent(
  components: Array<{ longText?: string; shortText?: string; types: string[] }>,
  type: string,
  useShortText = false
) {
  const component = components.find((item) => item.types.includes(type));
  if (!component) return "";
  return useShortText
    ? component.shortText || component.longText || ""
    : component.longText || component.shortText || "";
}

function buildGeneratedTitle(selectedAddress: SelectedAddress | null) {
  if (!selectedAddress) return "";

  const streetLine = [
    selectedAddress.street,
    selectedAddress.houseNumber,
    selectedAddress.houseNumberAddition,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (streetLine && selectedAddress.city) {
    return `${streetLine}, ${selectedAddress.city}`;
  }

  return "";
}

function formatPrice(value?: string | number) {
  const amount = Number(value);
  if (!amount) return "";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function normalizeCoordinate(value?: string | number | null) {
  if (value === null || value === undefined || value === "") return "";
  const parsed = Number(value);
  return Number.isFinite(parsed) ? String(parsed) : "";
}

function normalizePropertyTypeForForm(value?: string | null) {
  const input = String(value || "").trim().toLowerCase();

  if (!input) return "";
  if (input === "vrijstaande_woning") return "vrijstaand";
  if (input === "twee_onder_een_kap") return "twee-onder-een-kap";
  if (input === "hoek_woning") return "hoekwoning";
  if (input === "tussen_woning") return "tussenwoning";
  return input;
}

function buildRecognizedAddress(selectedAddress: SelectedAddress | null) {
  if (!selectedAddress) return "";

  const streetLine = [
    selectedAddress.street,
    selectedAddress.houseNumber,
    selectedAddress.houseNumberAddition,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return [streetLine, selectedAddress.postalCode, selectedAddress.city]
    .filter(Boolean)
    .join(", ");
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatNumberInput(value: string) {
  const digits = digitsOnly(value);
  if (!digits) return "";
  return new Intl.NumberFormat("nl-NL").format(Number(digits));
}

function parseFormattedNumber(value: string) {
  const digits = digitsOnly(value);
  if (!digits) return null;

  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : null;
}

async function fetchBagData(
  postcode: string,
  huisnummer: string,
  houseNumberAddition?: string
): Promise<BagResponse> {
  const params = new URLSearchParams({
    postcode,
    huisnummer,
  });

  if (houseNumberAddition?.trim()) {
    params.set("house_number_addition", houseNumberAddition.trim());
  }

  const res = await fetch(`/api/bag?${params.toString()}`);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.details || json?.error || "BAG data ophalen mislukt.");
  }

  return json;
}

export default function NewListingStartForm({ action }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [addressNeedsHouseNumber, setAddressNeedsHouseNumber] = useState(false);

  const [propertyType, setPropertyType] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [livingArea, setLivingArea] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [plotSize, setPlotSize] = useState("");

  const [bagData, setBagData] = useState<BagData | null>(null);
  const [bagLoading, setBagLoading] = useState(false);
  const [bagError, setBagError] = useState("");

  const [askingPriceTouched, setAskingPriceTouched] = useState(false);
  const [livingAreaTouched, setLivingAreaTouched] = useState(false);
  const [plotSizeTouched, setPlotSizeTouched] = useState(false);
  const [yearBuiltTouched, setYearBuiltTouched] = useState(false);

  const generatedTitle = useMemo(() => {
    return buildGeneratedTitle(selectedAddress);
  }, [selectedAddress]);

  const askingPriceNumber = useMemo(
    () => parseFormattedNumber(askingPrice),
    [askingPrice]
  );
  const livingAreaNumber = useMemo(
    () => parseFormattedNumber(livingArea),
    [livingArea]
  );
  const plotSizeNumber = useMemo(
    () => parseFormattedNumber(plotSize),
    [plotSize]
  );
  const yearBuiltNumber = useMemo(
    () => parseFormattedNumber(yearBuilt),
    [yearBuilt]
  );

  const askingPriceError =
    askingPriceTouched && askingPrice
      ? askingPriceNumber === null
        ? "Voer een geldig bedrag in."
        : askingPriceNumber < 100000
        ? "Minimaal € 100.000."
        : askingPriceNumber % 1000 !== 0
        ? "Gebruik hele duizenden, bijvoorbeeld € 425.000."
        : null
      : null;

  const livingAreaError =
    livingAreaTouched && livingArea
      ? livingAreaNumber === null
        ? "Voer een geldig aantal m² in."
        : livingAreaNumber < 10
        ? "Minimaal 10 m²."
        : null
      : null;

  const plotSizeError =
    plotSizeTouched && plotSize
      ? plotSizeNumber === null
        ? "Voer een geldig aantal m² in."
        : plotSizeNumber < 10
        ? "Minimaal 10 m²."
        : null
      : null;

  const currentYear = new Date().getFullYear();

  const yearBuiltError =
    yearBuiltTouched && yearBuilt
      ? yearBuiltNumber === null
        ? "Voer een geldig bouwjaar in."
        : yearBuiltNumber < 1700 || yearBuiltNumber > currentYear + 1
        ? `Kies een bouwjaar tussen 1700 en ${currentYear + 1}.`
        : null
      : null;

  const formHasValidationErrors = Boolean(
    askingPriceError || livingAreaError || plotSizeError || yearBuiltError
  );

  useEffect(() => {
    let cancelled = false;

    const initAutocomplete = async () => {
      try {
        if (!window.google?.maps?.importLibrary || !hostRef.current) {
          throw new Error("Google Maps library is niet beschikbaar.");
        }

        const placesLibrary = await window.google.maps.importLibrary("places");
        if (cancelled || !hostRef.current) return;

        const PlaceAutocompleteElement =
          placesLibrary.PlaceAutocompleteElement ||
          window.google.maps.places.PlaceAutocompleteElement;

        if (!PlaceAutocompleteElement) {
          throw new Error("PlaceAutocompleteElement is niet beschikbaar.");
        }

        hostRef.current.innerHTML = "";

        const placeAutocomplete = new PlaceAutocompleteElement();
        placeAutocomplete.placeholder = "Bijv. Dorpsstraat 12, Giessenburg";
        placeAutocomplete.includedRegionCodes = ["nl"];

        placeAutocomplete.style.setProperty("width", "100%");
        placeAutocomplete.style.setProperty("display", "block");
        placeAutocomplete.style.setProperty("background", "transparent");
        placeAutocomplete.style.setProperty("border", "0");
        placeAutocomplete.style.setProperty("border-radius", "18px");
        placeAutocomplete.style.setProperty("color-scheme", "light");

        placeAutocomplete.style.setProperty("--gmp-mat-color-surface", "#ffffff");
        placeAutocomplete.style.setProperty("--gmp-mat-color-on-surface", "#0f172a");
        placeAutocomplete.style.setProperty(
          "--gmp-mat-color-on-surface-variant",
          "#64748b"
        );
        placeAutocomplete.style.setProperty("--gmp-mat-color-primary", "#059669");
        placeAutocomplete.style.setProperty(
          "--gmp-mat-color-outline-decorative",
          "#d1d5db"
        );
        placeAutocomplete.style.setProperty(
          "--gmp-mat-color-secondary-container",
          "#ecfdf5"
        );
        placeAutocomplete.style.setProperty(
          "--gmp-mat-color-on-secondary-container",
          "#065f46"
        );
        placeAutocomplete.style.setProperty("--gmp-mat-font-family", "inherit");

        placeAutocomplete.addEventListener("gmp-select", async (event: any) => {
          const placePrediction = event.placePrediction;
          if (!placePrediction) return;

          const place = placePrediction.toPlace();

          await place.fetchFields({
            fields: ["formattedAddress", "location", "addressComponents"],
          });

          const components = Array.isArray(place.addressComponents)
            ? place.addressComponents
            : [];

          const street = getAddressComponent(components, "route");
          const houseNumber = getAddressComponent(components, "street_number");
          const postalCode = getAddressComponent(components, "postal_code");
          const city =
            getAddressComponent(components, "locality") ||
            getAddressComponent(components, "postal_town") ||
            getAddressComponent(components, "administrative_area_level_2");
          const province = getAddressComponent(
            components,
            "administrative_area_level_1"
          );

          const lat =
            place.location && typeof place.location.lat === "function"
              ? String(place.location.lat())
              : "";
          const lng =
            place.location && typeof place.location.lng === "function"
              ? String(place.location.lng())
              : "";

          const baseAddress: SelectedAddress = {
            street,
            houseNumber,
            houseNumberAddition: "",
            postalCode,
            city,
            province,
            lat,
            lng,
            formattedAddress: place.formattedAddress || "",
          };

          if (!houseNumber) {
            setSelectedAddress(null);
            setAddressNeedsHouseNumber(true);
            setGoogleError("");
            setBagData(null);
            setBagError("");
            setPropertyType("");
            setAskingPrice("");
            setLivingArea("");
            setYearBuilt("");
            setPlotSize("");
            return;
          }

          setAddressNeedsHouseNumber(false);
          setGoogleError("");
          setBagError("");
          setSelectedAddress(baseAddress);

          if (postalCode && houseNumber) {
            try {
              setBagLoading(true);

              const bag = await fetchBagData(postalCode, houseNumber);
              const normalizedBagData: BagData | null = bag?.data || null;

              if (cancelled) return;

              setBagData(normalizedBagData);

              if (normalizedBagData) {
                setSelectedAddress({
                  street: normalizedBagData.street || street,
                  houseNumber: String(normalizedBagData.house_number || houseNumber),
                  houseNumberAddition: String(
                    normalizedBagData.house_number_addition || ""
                  ),
                  postalCode: String(
                    normalizedBagData.postal_code || postalCode
                  ).toUpperCase(),
                  city: normalizedBagData.city || city,
                  province,
                  lat: normalizeCoordinate(normalizedBagData.latitude) || lat,
                  lng: normalizeCoordinate(normalizedBagData.longitude) || lng,
                  formattedAddress: place.formattedAddress || "",
                });

                if (normalizedBagData.property_type) {
                  setPropertyType(
                    normalizePropertyTypeForForm(normalizedBagData.property_type)
                  );
                } else {
                  setPropertyType("");
                }

                if (
                  normalizedBagData.living_area !== null &&
                  normalizedBagData.living_area !== undefined &&
                  normalizedBagData.living_area !== ""
                ) {
                  setLivingArea(formatNumberInput(String(normalizedBagData.living_area)));
                } else {
                  setLivingArea("");
                }

                if (
                  normalizedBagData.year_built !== null &&
                  normalizedBagData.year_built !== undefined &&
                  normalizedBagData.year_built !== ""
                ) {
                  setYearBuilt(String(normalizedBagData.year_built));
                } else {
                  setYearBuilt("");
                }

                if (
                  normalizedBagData.plot_size !== null &&
                  normalizedBagData.plot_size !== undefined &&
                  normalizedBagData.plot_size !== ""
                ) {
                  setPlotSize(formatNumberInput(String(normalizedBagData.plot_size)));
                } else {
                  setPlotSize("");
                }
              } else {
                setBagData(null);
                setPropertyType("");
                setLivingArea("");
                setYearBuilt("");
                setPlotSize("");
              }
            } catch (error) {
              console.error(error);
              if (cancelled) return;
              setBagData(null);
              setBagError("Basisgegevens konden nog niet automatisch worden geladen.");
              setPropertyType("");
              setLivingArea("");
              setYearBuilt("");
              setPlotSize("");
            } finally {
              if (!cancelled) {
                setBagLoading(false);
              }
            }
          }
        });

        hostRef.current.appendChild(placeAutocomplete);
        setGoogleReady(true);
      } catch (error) {
        console.error(error);
        setGoogleError(
          "Google adreszoeking kon niet geladen worden. Controleer je key en instellingen."
        );
      }
    };

    window.initGooglePlacesAutocomplete = initAutocomplete;

const existingScript = document.getElementById("google-maps-script");

if (window.google?.maps?.importLibrary) {
  initAutocomplete();
} else if (!existingScript) {
  const script = document.createElement("script");
  script.id = "google-maps-script";
  script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
  script.async = true;

  script.onload = () => {
    initAutocomplete();
  };

  document.body.appendChild(script);
} else {
  existingScript.addEventListener("load", initAutocomplete);
}    return () => {
      cancelled = true;
      if (hostRef.current) {
        hostRef.current.innerHTML = "";
      }
      if (window.initGooglePlacesAutocomplete) {
        delete window.initGooglePlacesAutocomplete;
      }
    };
  }, []);

  const fullRecognizedAddress = buildRecognizedAddress(selectedAddress);

  const addressIsComplete =
    !!selectedAddress?.street &&
    !!selectedAddress?.houseNumber &&
    !!selectedAddress?.city;

  const fieldClass =
    "h-14 w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 text-base text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

  const fieldErrorClass =
    "border-red-300 focus:border-red-400 focus:ring-red-100";

const handleManualSubmit = () => {
  setAskingPriceTouched(true);
  setLivingAreaTouched(true);
  setPlotSizeTouched(true);
  setYearBuiltTouched(true);

  if (!addressIsComplete || !generatedTitle || formHasValidationErrors) return;
};
  return (
    <div className="overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
      <div className="px-6 pb-6 pt-6 sm:px-10 sm:pb-10 sm:pt-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
            <MapPin className="h-6 w-6 text-emerald-600" />
          </div>

          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" />
              Nieuwe woning starten
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Om welke woning gaat het?
            </h1>

            <p className="mt-4 text-base leading-7 text-neutral-600 sm:text-lg">
              Vul je adres in en wij helpen je op weg. Je hoeft nu nog niet alles te
              weten — je kunt later alles rustig aanpassen.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500">
              <span>Dit duurt maar 30 seconden</span>
              <span className="hidden h-1 w-1 rounded-full bg-neutral-300 sm:block" />
              <span>We vullen zo veel mogelijk automatisch voor je in</span>
            </div>
          </div>

          <form
            ref={formRef}
            action={action}
            className="mt-8 space-y-6"
            onKeyDownCapture={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
              }
            }}
onSubmit={(event) => {
  if (!addressIsComplete || !generatedTitle || formHasValidationErrors) {
    event.preventDefault();
    return;
  }

  fireMetaEvent("CompleteRegistration", {
    source: "new_listing_start_form_submit",
    address_completed: true,
    has_asking_price: !!askingPriceNumber,
    has_living_area: !!livingAreaNumber,
    has_plot_size: !!plotSizeNumber,
    has_year_built: !!yearBuiltNumber,
    property_type: propertyType || "unknown",
  });
}}          >
            <input type="hidden" name="title" value={generatedTitle} />
            <input type="hidden" name="street" value={selectedAddress?.street || ""} />
            <input
              type="hidden"
              name="house_number"
              value={selectedAddress?.houseNumber || ""}
            />
            <input
              type="hidden"
              name="house_number_addition"
              value={selectedAddress?.houseNumberAddition || ""}
            />
            <input
              type="hidden"
              name="postal_code"
              value={selectedAddress?.postalCode || ""}
            />
            <input type="hidden" name="city" value={selectedAddress?.city || ""} />
            <input
              type="hidden"
              name="province"
              value={selectedAddress?.province || ""}
            />
            <input type="hidden" name="lat" value={selectedAddress?.lat || ""} />
            <input type="hidden" name="lng" value={selectedAddress?.lng || ""} />

            <input type="hidden" name="property_type" value={propertyType} />
            <input
              type="hidden"
              name="asking_price"
              value={askingPriceNumber ? String(askingPriceNumber) : ""}
            />
            <input
              type="hidden"
              name="living_area"
              value={digitsOnly(livingArea)}
            />
            <input
              type="hidden"
              name="plot_size"
              value={digitsOnly(plotSize)}
            />
            <input
              type="hidden"
              name="year_built"
              value={digitsOnly(yearBuilt)}
            />

            <input
              type="hidden"
              name="bag_address_id"
              value={bagData?.bag_address_id || ""}
            />
            <input
              type="hidden"
              name="bag_object_id"
              value={bagData?.bag_object_id || ""}
            />
            <input
              type="hidden"
              name="bag_pand_id"
              value={bagData?.bag_pand_id || ""}
            />

            <input
              type="hidden"
              name="source_street"
              value={bagData?.street || selectedAddress?.street || ""}
            />
            <input
              type="hidden"
              name="source_house_number"
              value={bagData?.house_number || selectedAddress?.houseNumber || ""}
            />
            <input
              type="hidden"
              name="source_house_number_addition"
              value={
                bagData?.house_number_addition ||
                selectedAddress?.houseNumberAddition ||
                ""
              }
            />
            <input
              type="hidden"
              name="source_postal_code"
              value={bagData?.postal_code || selectedAddress?.postalCode || ""}
            />
            <input
              type="hidden"
              name="source_city"
              value={bagData?.city || selectedAddress?.city || ""}
            />
            <input
              type="hidden"
              name="source_lat"
              value={
                normalizeCoordinate(bagData?.latitude) || selectedAddress?.lat || ""
              }
            />
            <input
              type="hidden"
              name="source_lng"
              value={
                normalizeCoordinate(bagData?.longitude) || selectedAddress?.lng || ""
              }
            />
            <input
              type="hidden"
              name="source_build_year"
              value={bagData?.year_built || ""}
            />
            <input
              type="hidden"
              name="source_living_area"
              value={digitsOnly(livingArea)}
            />
            <input
              type="hidden"
              name="source_property_type"
              value={bagData?.property_type || ""}
            />

            <input
              type="hidden"
              name="source_woz_value"
              value={bagData?.wozWaarde || ""}
            />
            <input
              type="hidden"
              name="estimated_value_low"
              value={bagData?.estimatedValueLow || ""}
            />
            <input
              type="hidden"
              name="estimated_value_mid"
              value={bagData?.estimatedValueMid || ""}
            />
            <input
              type="hidden"
              name="estimated_value_high"
              value={bagData?.estimatedValueHigh || ""}
            />
            <input
              type="hidden"
              name="valuation_price_per_m2"
              value={bagData?.valuationPricePerM2 || ""}
            />
            <input
              type="hidden"
              name="valuation_confidence"
              value={bagData?.valuationConfidence || ""}
            />
            <input
              type="hidden"
              name="valuation_source"
              value={bagData?.valuationSource || ""}
            />
            <input
              type="hidden"
              name="valuation_model_version"
              value={bagData?.valuationModelVersion || ""}
            />

            <div className="rounded-[28px] border border-neutral-200 bg-neutral-50/70 p-4 sm:p-5">
              <label className="mb-3 block text-sm font-medium text-neutral-800">
                Adres
              </label>

              <div className="relative rounded-2xl border border-neutral-300 bg-white px-4 py-3 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                  <MapPin className="h-5 w-5 text-neutral-400" />
                </div>

                <div className="pl-8">
                  <div ref={hostRef} />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                <span>Je kunt ook beginnen met postcode + huisnummer.</span>

                {addressIsComplete ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Adres herkend
                  </span>
                ) : null}

                {bagLoading ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-neutral-600">
                    Basisdata laden...
                  </span>
                ) : null}
              </div>

              {addressIsComplete ? (
                <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700/80">
                        Herkende basisinfo
                      </div>
                      <div className="mt-2 text-sm font-medium text-neutral-900">
                        {fullRecognizedAddress || selectedAddress?.formattedAddress}
                      </div>
                      <div className="mt-1 text-sm text-neutral-600">
                        {selectedAddress?.province || "Nederland"}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                        Werktitel voorstel
                      </div>
                      <div className="mt-1 text-sm font-medium text-neutral-900">
                        {generatedTitle}
                      </div>
                    </div>
                  </div>

                  {bagError ? (
                    <div className="mt-4 text-sm text-amber-700">{bagError}</div>
                  ) : null}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-neutral-300 bg-white/80 p-3">
                  <div className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">
                    Slimme volgende stap
                  </div>
                  <div className="mt-2 text-sm text-neutral-600">
                    Kies een echt adres uit de suggesties en wij vullen straat,
                    huisnummer, postcode en plaats automatisch voor je in.
                  </div>

                  {!googleReady && !googleError ? (
                    <div className="mt-2 text-sm text-neutral-500">
                      Adreszoeking wordt geladen...
                    </div>
                  ) : null}

                  {addressNeedsHouseNumber ? (
                    <div className="mt-2 text-sm text-amber-700">
                      Typ ook het huisnummer en kies daarna een volledig adres uit de
                      suggesties.
                    </div>
                  ) : null}

                  {googleError ? (
                    <div className="mt-2 text-sm text-red-600">{googleError}</div>
                  ) : null}
                </div>
              )}
            </div>

            <div className="rounded-[28px] border border-neutral-200 bg-white p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="text-sm font-semibold text-neutral-900">
                  Extra basisinfo
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Dit vullen we zo veel mogelijk automatisch voor je in.
                </p>
              </div>

              <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-12">
                <div className="sm:col-span-1 lg:col-span-4">
                  <label
                    htmlFor="property_type"
                    className="mb-2 block text-sm font-medium text-neutral-700"
                  >
                    Woningtype
                  </label>
                  <select
                    id="property_type"
                    value={propertyType}
                    onChange={(event) => setPropertyType(event.target.value)}
                    className={fieldClass}
                  >
                    <option value="">Kies later</option>
                    <option value="eengezinswoning">Eengezinswoning</option>
                    <option value="appartement">Appartement</option>
                    <option value="vrijstaand">Vrijstaand</option>
                    <option value="twee-onder-een-kap">Twee-onder-een-kap</option>
                    <option value="hoekwoning">Hoekwoning</option>
                    <option value="tussenwoning">Tussenwoning</option>
                  </select>
                </div>

                <div className="sm:col-span-1 lg:col-span-4">
                  <label
                    htmlFor="living_area"
                    className="mb-2 block text-sm font-medium text-neutral-700"
                  >
                    Woonoppervlakte
                  </label>
                  <input
                    id="living_area"
                    type="text"
                    inputMode="numeric"
                    value={livingArea}
                    onChange={(event) => setLivingArea(formatNumberInput(event.target.value))}
                    onBlur={() => setLivingAreaTouched(true)}
                    placeholder="Bijv. 136"
                    className={`${fieldClass} ${livingAreaError ? fieldErrorClass : ""}`}
                  />
                  {livingAreaError ? (
                    <div className="mt-2 text-xs leading-5 text-red-600">
                      {livingAreaError}
                    </div>
                  ) : (
                    <div className="mt-2 text-xs leading-5 text-neutral-500">
                      Alleen cijfers. Minimaal 10 m².
                    </div>
                  )}
                </div>

                <div className="sm:col-span-1 lg:col-span-4">
                  <label
                    htmlFor="year_built"
                    className="mb-2 block text-sm font-medium text-neutral-700"
                  >
                    Bouwjaar
                  </label>
                  <input
                    id="year_built"
                    type="text"
                    inputMode="numeric"
                    value={yearBuilt}
                    onChange={(event) => setYearBuilt(digitsOnly(event.target.value).slice(0, 4))}
                    onBlur={() => setYearBuiltTouched(true)}
                    placeholder="Bijv. 1998"
                    className={`${fieldClass} ${yearBuiltError ? fieldErrorClass : ""}`}
                  />
                  {yearBuiltError ? (
                    <div className="mt-2 text-xs leading-5 text-red-600">
                      {yearBuiltError}
                    </div>
                  ) : (
                    <div className="mt-2 text-xs leading-5 text-neutral-500">
                      Vier cijfers, logisch bouwjaar.
                    </div>
                  )}
                </div>

                <div className="sm:col-span-1 lg:col-span-6">
                  <label
                    htmlFor="asking_price"
                    className="mb-2 block text-sm font-medium text-neutral-700"
                  >
                    Vraagprijs
                  </label>
                  <input
                    id="asking_price"
                    type="text"
                    inputMode="numeric"
                    value={askingPrice}
                    onChange={(event) =>
                      setAskingPrice(formatNumberInput(digitsOnly(event.target.value)))
                    }
                    onBlur={() => setAskingPriceTouched(true)}
                    placeholder="Bijv. 425000"
                    className={`${fieldClass} ${askingPriceError ? fieldErrorClass : ""}`}
                  />
                  {askingPriceError ? (
                    <div className="mt-2 text-xs leading-5 text-red-600">
                      {askingPriceError}
                    </div>
                  ) : null}
                </div>

                <div className="sm:col-span-1 lg:col-span-6">
                  <label
                    htmlFor="plot_size"
                    className="mb-2 block text-sm font-medium text-neutral-700"
                  >
                    Perceeloppervlakte
                  </label>
                  <input
                    id="plot_size"
                    type="text"
                    inputMode="numeric"
                    value={plotSize}
                    onChange={(event) => setPlotSize(formatNumberInput(event.target.value))}
                    onBlur={() => setPlotSizeTouched(true)}
                    placeholder={
                      propertyType === "vrijstaand"
                        ? "Bijv. 600"
                        : propertyType === "tussenwoning"
                        ? "Bijv. 140"
                        : "Bijv. 250"
                    }
                    className={`${fieldClass} ${plotSizeError ? fieldErrorClass : ""}`}
                  />
                  {plotSizeError ? (
                    <div className="mt-2 text-xs leading-5 text-red-600">
                      {plotSizeError}
                    </div>
                  ) : !plotSize ? (
                    <div className="mt-2 text-xs leading-5 text-neutral-500">
                      Perceel onbekend — schatting is prima.
                    </div>
                  ) : (
                    <div className="mt-2 text-xs leading-5 text-neutral-500">
                      Alleen cijfers. Minimaal 10 m².
                    </div>
                  )}
                </div>
              </div>
            </div>

            {bagData?.estimatedValueMid ? (
              <div className="rounded-[28px] border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                    <Euro className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700/80">
                      Geschatte woningwaarde
                    </div>

                    <div className="mt-2 text-2xl font-semibold text-neutral-950">
                      {formatPrice(bagData.estimatedValueMid)}
                    </div>

                    <div className="mt-2 text-sm text-neutral-700">
                      Verwachte range:{" "}
                      <span className="font-medium">
                        {formatPrice(bagData.estimatedValueLow)} –{" "}
                        {formatPrice(bagData.estimatedValueHigh)}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-neutral-600">
                      WOZ-indicatie:{" "}
                      <span className="font-medium">
                        {formatPrice(bagData.wozWaarde)}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-neutral-500">
                      Eerste indicatie op basis van adres, woningtype en
                      woonoppervlakte.
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-4 rounded-[28px] border border-neutral-200 bg-neutral-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  Je start gewoon met een concept
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  Je woning wordt pas zichtbaar als jij klaar bent om live te gaan.
                </p>
              </div>

              <button
                type="button"
                disabled={!addressIsComplete || !generatedTitle || formHasValidationErrors}
                onClick={handleManualSubmit}
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                {addressIsComplete ? "Verder met dit adres" : "Kies eerst een volledig adres"}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}