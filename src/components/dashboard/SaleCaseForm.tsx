import { saveSaleCaseForm } from "../../lib/actions/sale-cases";
import type { SaleBuyer, SaleCase, SaleCondition } from "../../types/database";

function formatDateForInput(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

function formatNumberForInput(value?: number | null) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function CheckboxField({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-1 h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-600"
      />
      <span>
        <span className="block text-sm font-semibold text-neutral-950">
          {label}
        </span>
        {description ? (
          <span className="mt-1 block text-sm leading-6 text-neutral-600">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function TextField({
  name,
  label,
  type = "text",
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string | number | null;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-neutral-800">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function TextAreaField({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-neutral-800">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        rows={5}
        className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm leading-6 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function SelectField({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-neutral-800">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        className="mt-2 h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      >
        <option value="">Maak een keuze</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function SaleCaseForm({
  listingId,
  saleCase,
  saleCondition,
  buyer,
}: {
  listingId: string;
  saleCase: SaleCase;
  saleCondition: SaleCondition | null;
  buyer?: SaleBuyer | null;
}) {
  return (
    <form action={saveSaleCaseForm} className="space-y-6">
      <input type="hidden" name="listing_id" value={listingId} />
      <input type="hidden" name="sale_case_id" value={saleCase.id} />

      <section className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Stap 1
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
            Kopergegevens
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Vul hier de gegevens van de koper in. Dit wordt straks automatisch
            verwerkt in de koopovereenkomst.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <TextField
            name="buyer_1_first_name"
            label="Voornaam koper"
            defaultValue={buyer?.first_name}
            placeholder="Bijv. Jan"
          />
          <TextField
            name="buyer_1_last_name"
            label="Achternaam koper"
            defaultValue={buyer?.last_name}
            placeholder="Bijv. Jansen"
          />
          <TextField
            name="buyer_1_initials"
            label="Initialen"
            defaultValue={buyer?.initials}
            placeholder="Bijv. J."
          />
          <TextField
            name="buyer_1_birth_place"
            label="Geboorteplaats"
            defaultValue={buyer?.birth_place}
          />
          <TextField
            name="buyer_1_birth_date"
            label="Geboortedatum"
            type="date"
            defaultValue={formatDateForInput(buyer?.birth_date)}
          />
          <TextField
            name="buyer_1_email"
            label="E-mailadres"
            type="email"
            defaultValue={buyer?.email}
          />
          <TextField
            name="buyer_1_phone"
            label="Telefoonnummer"
            defaultValue={buyer?.phone}
          />
          <SelectField
            name="buyer_1_marital_status"
            label="Burgerlijke staat"
            defaultValue={buyer?.marital_status}
            options={[
              { value: "ongehuwd", label: "Ongehuwd" },
              { value: "gehuwd", label: "Gehuwd" },
              {
                value: "geregistreerd_partnerschap",
                label: "Geregistreerd partnerschap",
              },
              { value: "gescheiden", label: "Gescheiden" },
              { value: "weduwe_weduwnaar", label: "Weduwe/weduwnaar" },
            ]}
          />
          <SelectField
            name="buyer_1_matrimonial_property_regime"
            label="Huwelijksgoederenrecht"
            defaultValue={buyer?.matrimonial_property_regime}
            options={[
              {
                value: "gemeenschap_van_goederen",
                label: "Gemeenschap van goederen",
              },
              {
                value: "beperkte_gemeenschap_van_goederen",
                label: "Beperkte gemeenschap van goederen",
              },
              {
                value: "huwelijkse_voorwaarden",
                label: "Huwelijkse voorwaarden",
              },
              {
                value: "niet_van_toepassing",
                label: "Niet van toepassing",
              },
            ]}
          />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <TextField
            name="buyer_1_street"
            label="Straat"
            defaultValue={buyer?.street}
          />
          <TextField
            name="buyer_1_house_number"
            label="Huisnummer"
            defaultValue={buyer?.house_number}
          />
          <TextField
            name="buyer_1_postal_code"
            label="Postcode"
            defaultValue={buyer?.postal_code}
          />
          <TextField
            name="buyer_1_city"
            label="Woonplaats"
            defaultValue={buyer?.city}
          />
          <TextField
            name="buyer_1_identification_type"
            label="Soort legitimatie"
            defaultValue={buyer?.identification_type}
            placeholder="Bijv. paspoort of rijbewijs"
          />
          <TextField
            name="buyer_1_identification_number"
            label="Documentnummer"
            defaultValue={buyer?.identification_number}
          />
        </div>
      </section>

      <section className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Stap 2
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
            Prijs en overdracht
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Leg de verkoopprijs, overdrachtsdatum en waarde van roerende zaken
            vast.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <TextField
            name="agreed_price"
            label="Overeengekomen koopprijs"
            type="number"
            defaultValue={formatNumberForInput(saleCase.agreed_price)}
          />
          <TextField
            name="movable_goods_value"
            label="Waarde roerende zaken"
            type="number"
            defaultValue={formatNumberForInput(saleCase.movable_goods_value)}
          />
          <TextField
            name="acceptance_date"
            label="Datum akkoord"
            type="date"
            defaultValue={formatDateForInput(saleCase.acceptance_date)}
          />
          <TextField
            name="transfer_date"
            label="Leveringsdatum"
            type="date"
            defaultValue={formatDateForInput(saleCase.transfer_date)}
          />
        </div>
      </section>

      <section className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Stap 3
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
            Ontbindende voorwaarden
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Deze voorwaarden bepalen wanneer koper nog rechtsgeldig kan
            ontbinden.
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          <CheckboxField
            name="financing_required"
            label="Financieringsvoorbehoud opnemen"
            description="Gebruikelijk wanneer koper nog hypotheek moet regelen."
            defaultChecked={saleCondition?.financing_required ?? true}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              name="financing_amount"
              label="Financieringsbedrag"
              type="number"
              defaultValue={formatNumberForInput(saleCondition?.financing_amount)}
            />
            <TextField
              name="financing_deadline"
              label="Deadline financiering"
              type="date"
              defaultValue={formatDateForInput(saleCondition?.financing_deadline)}
            />
            <TextField
              name="max_interest_rate"
              label="Maximale rente (%)"
              type="number"
              defaultValue={formatNumberForInput(saleCondition?.max_interest_rate)}
            />
            <TextField
              name="max_gross_annual_cost"
              label="Maximale bruto jaarlast"
              type="number"
              defaultValue={formatNumberForInput(
                saleCondition?.max_gross_annual_cost
              )}
            />
          </div>

          <CheckboxField
            name="nhg_required"
            label="NHG-voorbehoud opnemen"
            defaultChecked={saleCondition?.nhg_required ?? false}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              name="nhg_deadline"
              label="Deadline NHG"
              type="date"
              defaultValue={formatDateForInput(saleCondition?.nhg_deadline)}
            />
          </div>

          <CheckboxField
            name="building_inspection_required"
            label="Voorbehoud bouwkundige keuring opnemen"
            description="Relevant als koper eerst een bouwkundige keuring wil laten uitvoeren."
            defaultChecked={saleCondition?.building_inspection_required ?? false}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              name="building_inspection_deadline"
              label="Deadline bouwkundige keuring"
              type="date"
              defaultValue={formatDateForInput(
                saleCondition?.building_inspection_deadline
              )}
            />
            <TextField
              name="max_repair_costs"
              label="Maximale herstelkosten"
              type="number"
              defaultValue={formatNumberForInput(saleCondition?.max_repair_costs)}
            />
          </div>

          <CheckboxField
            name="bank_guarantee_required"
            label="Bankgarantie of waarborgsom opnemen"
            description="Gebruikelijk is 10% van de koopsom."
            defaultChecked={saleCondition?.bank_guarantee_required ?? true}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              name="bank_guarantee_amount"
              label="Bedrag bankgarantie / waarborgsom"
              type="number"
              defaultValue={formatNumberForInput(
                saleCondition?.bank_guarantee_amount
              )}
            />
            <TextField
              name="bank_guarantee_deadline"
              label="Deadline bankgarantie"
              type="date"
              defaultValue={formatDateForInput(
                saleCondition?.bank_guarantee_deadline
              )}
            />
          </div>

          <CheckboxField
            name="registration_required"
            label="Koopovereenkomst laten inschrijven bij Kadaster"
            description="Dit is optioneel en loopt via de notaris."
            defaultChecked={saleCondition?.registration_required ?? false}
          />

          <TextAreaField
            name="additional_agreements"
            label="Aanvullende afspraken"
            defaultValue={saleCondition?.additional_agreements}
            placeholder="Bijv. afspraken over oplevering, roerende zaken of bijzonderheden."
          />
        </div>
      </section>

      <section className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Stap 4
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
            Notaris
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Vul de notarisgegevens in als deze al bekend zijn.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <TextField
            name="notary_office_name"
            label="Notariskantoor"
            defaultValue={saleCase.notary_office_name}
          />
          <TextField
            name="notary_city"
            label="Plaats notaris"
            defaultValue={saleCase.notary_city}
          />
          <TextField
            name="notary_email"
            label="E-mail notaris"
            type="email"
            defaultValue={saleCase.notary_email}
          />
          <TextField
            name="notary_phone"
            label="Telefoon notaris"
            defaultValue={saleCase.notary_phone}
          />
        </div>

        <div className="mt-6">
          <TextAreaField
            name="notes"
            label="Interne notities"
            defaultValue={saleCase.notes}
            placeholder="Alleen zichtbaar in het verkoopdossier."
          />
        </div>
      </section>

      <div className="sticky bottom-4 z-10 rounded-[24px] border border-neutral-200 bg-white/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-neutral-600">
            Sla je verkoopdossier tussentijds op. De koopovereenkomst genereren
            we pas in de volgende stap.
          </p>

          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Verkoopdossier opslaan
          </button>
        </div>
      </div>
    </form>
  );
}