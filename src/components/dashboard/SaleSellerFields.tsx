"use client";

import { useState } from "react";
import type { SaleSeller } from "../../types/database";
import HuisDateInput from "../ui/HuisDateInput";
import HuisSelect from "../ui/HuisSelect";

const IDENTIFICATION_TYPE_OPTIONS = [
  { value: "", label: "Selecteer legitimatie" },
  { value: "Paspoort", label: "Paspoort" },
  {
    value: "Nederlandse identiteitskaart",
    label: "Nederlandse identiteitskaart",
  },
  { value: "Rijbewijs", label: "Rijbewijs" },
  { value: "Verblijfsdocument", label: "Verblijfsdocument" },
  { value: "Vreemdelingenpaspoort", label: "Vreemdelingenpaspoort" },
  { value: "Vluchtelingenpaspoort", label: "Vluchtelingenpaspoort" },
];

const MARITAL_STATUS_OPTIONS = [
  { value: "", label: "Maak een keuze" },
  { value: "ongehuwd", label: "Ongehuwd" },
  { value: "gehuwd", label: "Gehuwd" },
  {
    value: "geregistreerd_partnerschap",
    label: "Geregistreerd partnerschap",
  },
  { value: "gescheiden", label: "Gescheiden" },
  { value: "weduwe_weduwnaar", label: "Weduwe/weduwnaar" },
];

const PROPERTY_REGIME_OPTIONS = [
  { value: "", label: "Maak een keuze" },
  {
    value: "gemeenschap_van_goederen",
    label: "Gemeenschap van goederen",
  },
  {
    value: "beperkte_gemeenschap_van_goederen",
    label: "Beperkte gemeenschap van goederen",
  },
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
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string | null;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-neutral-800">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        className="mt-2 h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function SellerCard({
  seller,
  order,
}: {
  seller?: SaleSeller | null;
  order: 1 | 2;
}) {
  const prefix = `seller_${order}`;

  return (
    <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
      <h3 className="text-base font-semibold text-neutral-950">
        Verkoper {order}
      </h3>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <TextField
          name={`${prefix}_first_name`}
          label="Voornamen"
          defaultValue={seller?.first_name}
        />
        <TextField
          name={`${prefix}_last_name`}
          label="Naam"
          defaultValue={seller?.last_name}
        />
        <TextField
          name={`${prefix}_initials`}
          label="Initialen"
          defaultValue={seller?.initials}
        />
        <TextField
          name={`${prefix}_birth_place`}
          label="Geboorteplaats"
          defaultValue={seller?.birth_place}
        />
        <HuisDateInput
          name={`${prefix}_birth_date`}
          label="Geboortedatum"
          defaultValue={formatDateForInput(seller?.birth_date)}
        />
        <TextField
          name={`${prefix}_email`}
          label="E-mailadres"
          type="email"
          defaultValue={seller?.email}
        />
        <TextField
          name={`${prefix}_phone`}
          label="Telefoon"
          defaultValue={seller?.phone}
        />
        <HuisSelect
          name={`${prefix}_marital_status`}
          label="Burgerlijke staat"
          defaultValue={seller?.marital_status}
          options={MARITAL_STATUS_OPTIONS}
        />
        <HuisSelect
          name={`${prefix}_matrimonial_property_regime`}
          label="Huwelijksgoederenrecht"
          defaultValue={seller?.matrimonial_property_regime}
          options={PROPERTY_REGIME_OPTIONS}
        />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <TextField
          name={`${prefix}_street`}
          label="Straat"
          defaultValue={seller?.street}
        />
        <TextField
          name={`${prefix}_house_number`}
          label="Huisnummer"
          defaultValue={seller?.house_number}
        />
        <TextField
          name={`${prefix}_postal_code`}
          label="Postcode"
          defaultValue={seller?.postal_code}
        />
        <TextField
          name={`${prefix}_city`}
          label="Woonplaats"
          defaultValue={seller?.city}
        />
        <HuisSelect
          name={`${prefix}_identification_type`}
          label="Soort legitimatie"
          defaultValue={seller?.identification_type}
          options={IDENTIFICATION_TYPE_OPTIONS}
        />
        <TextField
          name={`${prefix}_identification_number`}
          label="Documentnummer"
          defaultValue={seller?.identification_number}
        />
      </div>
    </div>
  );
}

export default function SaleSellerFields({ sellers }: { sellers: SaleSeller[] }) {
  const sellerOne =
    sellers.find((seller) => seller.seller_order === 1) ?? sellers[0];
  const sellerTwo =
    sellers.find((seller) => seller.seller_order === 2) ?? sellers[1];
  const [sellerMode, setSellerMode] = useState<"one" | "two">(
    sellerTwo ? "two" : "one"
  );

  return (
    <div className="mt-6 space-y-5">
      <input type="hidden" name="seller_count" value={sellerMode} />

      <div className="grid grid-cols-2 rounded-2xl border border-neutral-200 bg-neutral-100 p-1">
        <button
          type="button"
          onClick={() => setSellerMode("one")}
          aria-pressed={sellerMode === "one"}
          className={`min-h-11 rounded-xl px-3 text-sm font-semibold transition ${
            sellerMode === "one"
              ? "bg-white text-neutral-950 shadow-sm"
              : "text-neutral-600 hover:text-neutral-950"
          }`}
        >
          Een verkoper
        </button>
        <button
          type="button"
          onClick={() => setSellerMode("two")}
          aria-pressed={sellerMode === "two"}
          className={`min-h-11 rounded-xl px-3 text-sm font-semibold transition ${
            sellerMode === "two"
              ? "bg-white text-neutral-950 shadow-sm"
              : "text-neutral-600 hover:text-neutral-950"
          }`}
        >
          Twee verkopers
        </button>
      </div>

      <SellerCard seller={sellerOne} order={1} />
      {sellerMode === "two" ? <SellerCard seller={sellerTwo} order={2} /> : null}
    </div>
  );
}
