"use client";

import { useState } from "react";
import type { SaleBuyer } from "../../types/database";
import HuisDateInput from "../ui/HuisDateInput";
import HuisInfoTooltip from "../ui/HuisInfoTooltip";
import HuisSelect from "../ui/HuisSelect";

const IDENTIFICATION_TYPE_OPTIONS = [
  { value: "", label: "Selecteer legitimatie" },
  { value: "Paspoort", label: "Paspoort" },
  { value: "Nederlandse identiteitskaart", label: "Nederlandse identiteitskaart" },
  { value: "Rijbewijs", label: "Rijbewijs" },
  { value: "Verblijfsdocument", label: "Verblijfsdocument" },
  { value: "Vreemdelingenpaspoort", label: "Vreemdelingenpaspoort" },
  { value: "Vluchtelingenpaspoort", label: "Vluchtelingenpaspoort" },
];

const MARITAL_STATUS_OPTIONS = [
  { value: "", label: "Maak een keuze" },
  { value: "ongehuwd", label: "Ongehuwd" },
  { value: "gehuwd", label: "Gehuwd" },
  { value: "geregistreerd_partnerschap", label: "Geregistreerd partnerschap" },
  { value: "gescheiden", label: "Gescheiden" },
  { value: "weduwe_weduwnaar", label: "Weduwe/weduwnaar" },
];

const PROPERTY_REGIME_OPTIONS = [
  { value: "", label: "Maak een keuze" },
  { value: "gemeenschap_van_goederen", label: "Gemeenschap van goederen" },
  { value: "beperkte_gemeenschap_van_goederen", label: "Beperkte gemeenschap van goederen" },
  { value: "huwelijkse_voorwaarden", label: "Huwelijkse voorwaarden" },
  { value: "niet_van_toepassing", label: "Niet van toepassing" },
];

function formatDateForInput(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

function TextField({
  name,
  label,
  type = "text",
  defaultValue,
  required,
  contractField,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string | null;
  required?: boolean;
  contractField?: string;
}) {
  return (
    <label
      className="block"
      data-contract-field={contractField}
      data-required-contract-field={required ? "true" : undefined}
    >
      <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-neutral-800">
        <span>{label}</span>
        {required ? (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            Verplicht
          </span>
        ) : null}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        className="mt-2 h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function BuyerCard({
  buyer,
  order,
  maxBirthDate,
  partnerOfFirst = false,
  inheritedMaritalStatus,
  inheritedPropertyRegime,
  onMaritalStatusChange,
  onPropertyRegimeChange,
}: {
  buyer?: SaleBuyer | null;
  order: 1 | 2;
  maxBirthDate: Date;
  partnerOfFirst?: boolean;
  inheritedMaritalStatus?: string;
  inheritedPropertyRegime?: string;
  onMaritalStatusChange?: (value: string) => void;
  onPropertyRegimeChange?: (value: string) => void;
}) {
  const prefix = `buyer_${order}`;
  const [maritalStatus, setMaritalStatus] = useState(
    buyer?.marital_status ?? ""
  );
  const [propertyRegime, setPropertyRegime] = useState(
    buyer?.matrimonial_property_regime ?? ""
  );
  const effectiveMaritalStatus = partnerOfFirst
    ? inheritedMaritalStatus ?? ""
    : maritalStatus;
  const effectivePropertyRegime = partnerOfFirst
    ? inheritedPropertyRegime ?? "niet_van_toepassing"
    : propertyRegime;
  const showPropertyRegime =
    effectiveMaritalStatus === "gehuwd" ||
    effectiveMaritalStatus === "geregistreerd_partnerschap";

  function handleMaritalStatusChange(value: string) {
    setMaritalStatus(value);
    onMaritalStatusChange?.(value);

    if (value !== "gehuwd" && value !== "geregistreerd_partnerschap") {
      setPropertyRegime("niet_van_toepassing");
      onPropertyRegimeChange?.("niet_van_toepassing");
    }
  }

  function handlePropertyRegimeChange(value: string) {
    setPropertyRegime(value);
    onPropertyRegimeChange?.(value);
  }

  return (
    <div className="w-full max-w-full min-w-0 rounded-3xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
      <h3 className="text-base font-semibold text-neutral-950">Koper {order}</h3>

      <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
        <TextField name={`${prefix}_first_name`} label="Voornaam" defaultValue={buyer?.first_name} required contractField={`${prefix}_first_name`} />
        <TextField name={`${prefix}_last_name`} label="Achternaam" defaultValue={buyer?.last_name} required contractField={`${prefix}_last_name`} />
        <TextField name={`${prefix}_initials`} label="Initialen" defaultValue={buyer?.initials} />
        <TextField name={`${prefix}_birth_place`} label="Geboorteplaats" defaultValue={buyer?.birth_place} required contractField={`${prefix}_birth_place`} />
        <div data-contract-field={`${prefix}_birth_date`}>
          <HuisDateInput
            name={`${prefix}_birth_date`}
            label="Geboortedatum"
            defaultValue={formatDateForInput(buyer?.birth_date)}
            maxDate={maxBirthDate}
            required
          />
        </div>
        <TextField name={`${prefix}_email`} label="E-mailadres" type="email" defaultValue={buyer?.email} />
        <TextField name={`${prefix}_phone`} label="Telefoonnummer" defaultValue={buyer?.phone} />
        {partnerOfFirst ? (
          <div className="min-w-0" data-contract-field={`${prefix}_marital_status`}>
            <input
              type="hidden"
              name={`${prefix}_marital_status`}
              value={effectiveMaritalStatus}
            />
            <input
              type="hidden"
              name={`${prefix}_matrimonial_property_regime`}
              value={showPropertyRegime ? effectivePropertyRegime : "niet_van_toepassing"}
            />
            <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-neutral-800">
              Burgerlijke staat
            </span>
            <div className="mt-2 min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600">
              Gelijk aan koper 1
            </div>
          </div>
        ) : (
          <>
            <div className="min-w-0" data-contract-field={`${prefix}_marital_status`}>
              <HuisSelect
                name={`${prefix}_marital_status`}
                label="Burgerlijke staat"
                defaultValue={buyer?.marital_status}
                options={MARITAL_STATUS_OPTIONS}
                required
                onChange={handleMaritalStatusChange}
              />
            </div>
            {showPropertyRegime ? (
              <HuisSelect
                name={`${prefix}_matrimonial_property_regime`}
                label="Huwelijksgoederenrecht"
                defaultValue={buyer?.matrimonial_property_regime}
                options={PROPERTY_REGIME_OPTIONS}
                onChange={handlePropertyRegimeChange}
              />
            ) : (
              <input
                type="hidden"
                name={`${prefix}_matrimonial_property_regime`}
                value="niet_van_toepassing"
              />
            )}
          </>
        )}
      </div>

      <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
        <TextField name={`${prefix}_street`} label="Straat" defaultValue={buyer?.street} required contractField={`${prefix}_street`} />
        <TextField name={`${prefix}_house_number`} label="Huisnummer" defaultValue={buyer?.house_number} required contractField={`${prefix}_house_number`} />
        <TextField name={`${prefix}_postal_code`} label="Postcode" defaultValue={buyer?.postal_code} required contractField={`${prefix}_postal_code`} />
        <TextField name={`${prefix}_city`} label="Woonplaats" defaultValue={buyer?.city} required contractField={`${prefix}_city`} />
        <div data-contract-field={`${prefix}_identification_type`}>
          <HuisSelect
            name={`${prefix}_identification_type`}
            label="Soort legitimatie"
            defaultValue={buyer?.identification_type}
            options={IDENTIFICATION_TYPE_OPTIONS}
            required
          />
        </div>
        <TextField
          name={`${prefix}_identification_number`}
          label="Documentnummer"
          defaultValue={buyer?.identification_number}
          required
          contractField={`${prefix}_identification_number`}
        />
      </div>
    </div>
  );
}

export default function SaleBuyerFields({ buyers }: { buyers: SaleBuyer[] }) {
  const buyerOne = buyers.find((buyer) => buyer.buyer_order === 1) ?? buyers[0];
  const buyerTwo = buyers.find((buyer) => buyer.buyer_order === 2) ?? buyers[1];
  const [buyerMode, setBuyerMode] = useState<"one" | "two">(
    buyerTwo ? "two" : "one"
  );
  const [buyerTwoIsPartner, setBuyerTwoIsPartner] = useState(false);
  const [buyerOneMaritalStatus, setBuyerOneMaritalStatus] = useState<string>(
    buyerOne?.marital_status ?? ""
  );
  const [buyerOnePropertyRegime, setBuyerOnePropertyRegime] = useState<string>(
    buyerOne?.matrimonial_property_regime ?? "niet_van_toepassing"
  );
  const today = new Date();

  return (
    <div className="mt-6 w-full max-w-full min-w-0 space-y-5">
      <input type="hidden" name="buyer_count" value={buyerMode} />

      <div className="grid grid-cols-2 rounded-2xl border border-neutral-200 bg-neutral-100 p-1">
        <button
          type="button"
          onClick={() => setBuyerMode("one")}
          aria-pressed={buyerMode === "one"}
          className={`min-h-11 rounded-xl px-3 text-sm font-semibold transition ${
            buyerMode === "one"
              ? "bg-white text-neutral-950 shadow-sm"
              : "text-neutral-600 hover:text-neutral-950"
          }`}
        >
          Een koper
        </button>
        <button
          type="button"
          onClick={() => setBuyerMode("two")}
          aria-pressed={buyerMode === "two"}
          className={`min-h-11 rounded-xl px-3 text-sm font-semibold transition ${
            buyerMode === "two"
              ? "bg-white text-neutral-950 shadow-sm"
              : "text-neutral-600 hover:text-neutral-950"
          }`}
        >
          Twee kopers
        </button>
      </div>

      <div className="flex items-start gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm leading-5 text-emerald-900 sm:p-4 sm:leading-6">
        <HuisInfoTooltip
          title="Kopergegevens"
          content="Deze gegevens worden rechtstreeks gebruikt voor de partijgegevens in de koopovereenkomst."
        />
        <p>Controleer de tenaamstelling en legitimatiegegevens zorgvuldig.</p>
      </div>

      <BuyerCard
        buyer={buyerOne}
        order={1}
        maxBirthDate={today}
        onMaritalStatusChange={setBuyerOneMaritalStatus}
        onPropertyRegimeChange={setBuyerOnePropertyRegime}
      />
      {buyerMode === "two" ? (
        <>
          <label className="flex min-w-0 items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-emerald-950 sm:p-4">
            <input
              type="checkbox"
              checked={buyerTwoIsPartner}
              onChange={(event) => setBuyerTwoIsPartner(event.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-600"
            />
            <span>Koper 2 is partner van koper 1</span>
          </label>
          <BuyerCard
            buyer={buyerTwo}
            order={2}
            maxBirthDate={today}
            partnerOfFirst={buyerTwoIsPartner}
            inheritedMaritalStatus={buyerOneMaritalStatus}
            inheritedPropertyRegime={buyerOnePropertyRegime}
          />
        </>
      ) : null}
    </div>
  );
}
