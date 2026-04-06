"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Euro,
  Home,
  MapPin,
  Ruler,
  Sparkles,
  Wallet,
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
  action: (formData: FormData) => void | Promise<void>;
};

type SelectedAddress = {
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  province: string;
  lat: string;
  lng: string;
  formattedAddress: string;
};

type BagData = {
  woonoppervlakte?: number | string;
  bouwjaar?: number | string;
  woningtype?: string;
  wozWaarde?: number | string;
  estimatedValueLow?: number | string;
  estimatedValueMid?: number | string;
  estimatedValueHigh?: number | string;
  valuationPricePerM2?: number | string;
  valuationConfidence?: number | string;
  valuationSource?: string;
  valuationModelVersion?: string;
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

  const fullStreet = `${selectedAddress.street} ${selectedAddress.houseNumber}`.trim();
  if (fullStreet && selectedAddress.city) {
    return `${fullStreet}, ${selectedAddress.city}`;
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

async function fetchBagData(postcode: string, huisnummer: string) {
  const res = await fetch(
    `/api/bag?postcode=${encodeURIComponent(postcode)}&huisnummer=${encodeURIComponent(
      huisnummer
    )}`
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error || "BAG data ophalen mislukt.");
  }

  return json;
}

export default function NewListingStartForm({ action }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [addressNeedsHouseNumber, setAddressNeedsHouseNumber] = useState(false);

  const [propertyType, setPropertyType] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [livingArea, setLivingArea] = useState("");

  const [yearBuilt, setYearBuilt] = useState("");
  const [bagData, setBagData] = useState<BagData | null>(null);
  const [bagLoading, setBagLoading] = useState(false);
  const [bagError, setBagError] = useState("");

  const generatedTitle = useMemo(() => {
    return buildGeneratedTitle(selectedAddress);
  }, [selectedAddress]);

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

          if (!houseNumber) {
            setSelectedAddress(null);
            setAddressNeedsHouseNumber(true);
            setGoogleError("");
            setBagData(null);
            setBagError("");
            setPropertyType("");
            setLivingArea("");
            setYearBuilt("");
            return;
          }

          setAddressNeedsHouseNumber(false);
          setGoogleError("");
          setSelectedAddress({
            street,
            houseNumber,
            postalCode,
            city,
            province,
            lat,
            lng,
            formattedAddress: place.formattedAddress || "",
          });

          if (postalCode && houseNumber) {
            try {
              setBagLoading(true);
              setBagError("");
              const bag = await fetchBagData(postalCode, houseNumber);
              const normalizedBagData: BagData | null = bag?.data || null;

              setBagData(normalizedBagData);

              if (normalizedBagData?.woningtype) {
                setPropertyType(String(normalizedBagData.woningtype));
              } else {
                setPropertyType("");
              }

              if (normalizedBagData?.woonoppervlakte) {
                setLivingArea(String(normalizedBagData.woonoppervlakte));
              } else {
                setLivingArea("");
              }

              if (normalizedBagData?.bouwjaar) {
                setYearBuilt(String(normalizedBagData.bouwjaar));
              } else {
                setYearBuilt("");
              }
            } catch (error) {
              console.error(error);
              setBagData(null);
              setBagError("Basisgegevens konden nog niet automatisch worden geladen.");
              setPropertyType("");
              setLivingArea("");
              setYearBuilt("");
            } finally {
              setBagLoading(false);
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

    if (window.google?.maps?.importLibrary) {
      initAutocomplete();
    } else {
      const existingScript = document.getElementById(
        "google-maps-script"
      ) as HTMLScriptElement | null;

      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&loading=async&callback=initGooglePlacesAutocomplete`;
        script.async = true;
        document.body.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (hostRef.current) {
        hostRef.current.innerHTML = "";
      }
      if (window.initGooglePlacesAutocomplete) {
        delete window.initGooglePlacesAutocomplete;
      }
    };
  }, []);

  const fullRecognizedAddress = selectedAddress
    ? [
        `${selectedAddress.street} ${selectedAddress.houseNumber}`.trim(),
        selectedAddress.postalCode,
        selectedAddress.city,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  const addressIsComplete =
    !!selectedAddress?.street &&
    !!selectedAddress?.houseNumber &&
    !!selectedAddress?.city;

  return (
    <div className="overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
      <div className="px-6 pb-6 pt-6 sm:px-10 sm:pb-10 sm:pt-10">
        <div className="mx-auto max-w-2xl">
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

          <form action={action} className="mt-8 space-y-6">
            <input type="hidden" name="title" value={generatedTitle} />
            <input type="hidden" name="street" value={selectedAddress?.street || ""} />
            <input
              type="hidden"
              name="house_number"
              value={selectedAddress?.houseNumber || ""}
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

            <div className="rounded-[28px] border border-neutral-200 bg-white p-4 sm:p-5">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-neutral-900">
                  Extra basisinfo
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Dit vullen we zo veel mogelijk automatisch voor je in.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label
                    htmlFor="property_type"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-700"
                  >
                    <Home className="h-4 w-4 text-neutral-400" />
                    Woningtype
                  </label>
                  <select
                    id="property_type"
                    name="property_type"
                    value={propertyType}
                    onChange={(event) => setPropertyType(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
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

                <div>
                  <label
                    htmlFor="asking_price"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-700"
                  >
                    <Wallet className="h-4 w-4 text-neutral-400" />
                    Vraagprijs
                  </label>
                  <input
                    id="asking_price"
                    name="asking_price"
                    type="text"
                    inputMode="numeric"
                    value={askingPrice}
                    onChange={(event) => setAskingPrice(event.target.value)}
                    placeholder="Bijv. 425000"
                    className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="living_area"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-700"
                  >
                    <Ruler className="h-4 w-4 text-neutral-400" />
                    Woonoppervlakte
                  </label>
                  <input
                    id="living_area"
                    name="living_area"
                    type="text"
                    inputMode="numeric"
                    value={livingArea}
                    onChange={(event) => setLivingArea(event.target.value)}
                    placeholder="Bijv. 136"
                    className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="year_built"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-700"
                  >
                    <Home className="h-4 w-4 text-neutral-400" />
                    Bouwjaar
                  </label>
                  <input
                    id="year_built"
                    name="year_built"
                    type="text"
                    inputMode="numeric"
                    value={yearBuilt}
                    onChange={(event) => setYearBuilt(event.target.value)}
                    placeholder="Bijv. 1998"
                    className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
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
                type="submit"
                disabled={!addressIsComplete || !generatedTitle}
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