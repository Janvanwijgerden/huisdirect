"use client";

import { BadgeCheck, Lightbulb } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  saveSaleCaseDraft,
  saveSaleCaseForm,
} from "../../lib/actions/sale-cases";
import type {
  Json,
  SaleBuyer,
  SaleCase,
  SaleCondition,
  SaleMovableItem,
  SaleSeller,
} from "../../types/database";
import SaleBuyerFields from "./SaleBuyerFields";
import SaleMovableItemsForm from "./SaleMovableItemsForm";
import SaleSellerFields from "./SaleSellerFields";
import HuisDateInput from "../ui/HuisDateInput";
import HuisDisclosure from "../ui/HuisDisclosure";
import HuisInfoTooltip from "../ui/HuisInfoTooltip";
import HuisSelect from "../ui/HuisSelect";

declare global {
  interface Window {
    huisDirectSaveSaleCaseDraft?: () => Promise<void>;
  }
}

function formatDateForInput(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

function formatNumberForInput(value?: number | null) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function formatCurrency(value?: number | null) {
  if (value === null || value === undefined) return "Nog niet berekend";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateTenPercent(value?: number | null) {
  if (value === null || value === undefined) return null;
  return Math.round(value * 0.1);
}

type SaleCaseListing = {
  features?: Json | null;
};

type ApartmentContractFields = {
  apartment_index_number?: string | null;
  apartment_complex_name?: string | null;
  vve_name?: string | null;
  monthly_service_costs?: string | number | null;
  reserve_fund?: string | number | null;
  mjop_available?: boolean | null;
};

type LeaseholdFields = {
  is_leasehold: boolean;
  erfpacht_owner_name?: string | null;
  erfpacht_conditions?: string | null;
  erfpacht_end_date?: string | null;
  erfpacht_revision_date?: string | null;
  erfpacht_canon_prepaid_until?: string | null;
  erfpacht_canon_amount?: string | null;
  erfpacht_canon_period?: string | null;
  erfpacht_canon_adjustment_date?: string | null;
  erfpacht_canon_indexation_date?: string | null;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function stringValue(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function readApartmentFields(
  listing?: SaleCaseListing | null
): ApartmentContractFields {
  const features = asRecord(listing?.features);
  const contractFields = asRecord(features.apartment_contract);
  const vve = asRecord(features.vve);

  return {
    apartment_index_number: stringValue(contractFields.apartment_index_number),
    apartment_complex_name: stringValue(contractFields.apartment_complex_name),
    vve_name: stringValue(contractFields.vve_name),
    monthly_service_costs: stringValue(
      contractFields.monthly_service_costs ?? vve.monthlyCosts
    ),
    reserve_fund: stringValue(contractFields.reserve_fund ?? vve.reserveFund),
    mjop_available:
      typeof contractFields.mjop_available === "boolean"
        ? contractFields.mjop_available
        : typeof vve.hasMjop === "boolean"
        ? vve.hasMjop
        : null,
  };
}

function readLeaseholdFields(listing?: SaleCaseListing | null): LeaseholdFields {
  const leasehold = asRecord(asRecord(listing?.features).leasehold);

  return {
    is_leasehold: leasehold.is_leasehold === true,
    erfpacht_owner_name: stringValue(leasehold.erfpacht_owner_name),
    erfpacht_conditions: stringValue(leasehold.erfpacht_conditions),
    erfpacht_end_date: stringValue(leasehold.erfpacht_end_date),
    erfpacht_revision_date: stringValue(leasehold.erfpacht_revision_date),
    erfpacht_canon_prepaid_until: stringValue(
      leasehold.erfpacht_canon_prepaid_until
    ),
    erfpacht_canon_amount: stringValue(leasehold.erfpacht_canon_amount),
    erfpacht_canon_period: stringValue(leasehold.erfpacht_canon_period),
    erfpacht_canon_adjustment_date: stringValue(
      leasehold.erfpacht_canon_adjustment_date
    ),
    erfpacht_canon_indexation_date: stringValue(
      leasehold.erfpacht_canon_indexation_date
    ),
  };
}

function LabelWithInfo({
  label,
  title,
  content,
}: {
  label: string;
  title?: string;
  content?: string;
}) {
  return (
    <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-neutral-800">
      <span className="min-w-0">{label}</span>
      {content ? <HuisInfoTooltip title={title ?? label} content={content} /> : null}
    </span>
  );
}

function TextField({
  name,
  label,
  type = "text",
  defaultValue,
  placeholder,
  inputMode,
  infoText,
  required,
  contractField,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  inputMode?: "decimal" | "numeric" | "text";
  infoText?: string;
  required?: boolean;
  contractField?: string;
}) {
  return (
    <label
      className="block min-w-0"
      data-contract-field={contractField}
      data-required-contract-field={required ? "true" : undefined}
    >
      <span className="flex min-w-0 items-center gap-2">
        <LabelWithInfo label={label} content={infoText} />
        {required ? (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            Verplicht
          </span>
        ) : null}
      </span>
      <input
        name={name}
        type={type}
        inputMode={inputMode}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="mt-2 h-12 w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function TextAreaField({
  name,
  label,
  defaultValue,
  placeholder,
  infoText,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
  infoText?: string;
}) {
  return (
    <label className="block min-w-0">
      <LabelWithInfo label={label} content={infoText} />
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        rows={5}
        className="mt-2 w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm leading-6 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function CheckboxField({
  name,
  label,
  description,
  defaultChecked,
  infoText,
}: {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
  infoText?: string;
}) {
  return (
    <label className="flex min-w-0 gap-2 rounded-2xl border border-neutral-200 bg-white p-3 sm:gap-3 sm:p-4">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-1 h-4 w-4 shrink-0 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-600"
      />
      <span className="min-w-0">
        <span className="flex min-w-0 items-start gap-2 text-sm font-semibold leading-5 text-neutral-950">
          <span className="min-w-0">{label}</span>
          {infoText ? <HuisInfoTooltip title={label} content={infoText} /> : null}
        </span>
        {description ? (
          <span className="mt-1 block text-sm leading-5 text-neutral-600 sm:leading-6">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function ReadOnlySummary({
  name,
  label,
  value,
  displayValue,
  helperText,
  infoText,
}: {
  name?: string;
  label: string;
  value?: string | number | null;
  displayValue: string;
  helperText?: string;
  infoText?: string;
}) {
  return (
    <div className="block min-w-0">
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <LabelWithInfo label={label} content={infoText} />
      <div className="mt-2 flex min-h-12 w-full items-center rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-semibold text-neutral-950">
        {displayValue}
      </div>
      {helperText ? (
        <p className="mt-2 text-sm leading-6 text-neutral-500">{helperText}</p>
      ) : null}
    </div>
  );
}

function AdviceBlock({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 sm:p-4">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm sm:h-9 sm:w-9">
          <Lightbulb className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-emerald-950">
            HuisDirect advies
          </p>
          <p className="mt-1 text-sm leading-5 text-emerald-900 sm:leading-6">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SaleCaseForm({
  listingId,
  listing,
  saleCase,
  saleCondition,
  buyers,
  buyer,
  sellers,
  movableItems,
}: {
  listingId: string;
  listing?: SaleCaseListing | null;
  saleCase: SaleCase;
  saleCondition: SaleCondition | null;
  buyers?: SaleBuyer[];
  buyer?: SaleBuyer | null;
  sellers?: SaleSeller[];
  movableItems?: SaleMovableItem[];
}) {
  const buyerRows = buyers?.length ? buyers : buyer ? [buyer] : [];
  const bankGuaranteeAmount = calculateTenPercent(saleCase.agreed_price);
  const isApartment = saleCase.template_type === "appartement";
  const apartmentFields = readApartmentFields(listing);
  const leaseholdFields = readLeaseholdFields(listing);
  const formRef = useRef<HTMLFormElement>(null);
  const debounceRef = useRef<number | null>(null);
  const saveChainRef = useRef<Promise<void>>(Promise.resolve());
  const saveSequenceRef = useRef(0);
  const [leaseholdRequired, setLeaseholdRequired] = useState(
    leaseholdFields.is_leasehold
  );
  const [saveStatus, setSaveStatus] = useState<
    "saved" | "dirty" | "saving" | "error"
  >("saved");

  const clearPendingAutosave = useCallback(() => {
    if (!debounceRef.current) return;
    window.clearTimeout(debounceRef.current);
    debounceRef.current = null;
  }, []);

  const queueSave = useCallback(async () => {
    const sequence = saveSequenceRef.current + 1;
    saveSequenceRef.current = sequence;
    setSaveStatus("saving");

    saveChainRef.current = saveChainRef.current
      .catch(() => undefined)
      .then(async () => {
        const form = formRef.current;
        if (!form) return;

        await saveSaleCaseDraft(new FormData(form));

        if (saveSequenceRef.current === sequence) {
          setSaveStatus("saved");
        }
      });

    try {
      await saveChainRef.current;
    } catch (error) {
      if (saveSequenceRef.current === sequence) {
        setSaveStatus("error");
      }

      saveChainRef.current = Promise.resolve();
      throw error;
    }
  }, []);

  const scheduleAutosave = useCallback(() => {
    clearPendingAutosave();
    setSaveStatus("dirty");
    debounceRef.current = window.setTimeout(() => {
      debounceRef.current = null;
      void queueSave().catch(() => undefined);
    }, 1500);
  }, [clearPendingAutosave, queueSave]);

  const handleFormChange = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      const target = event.target as HTMLInputElement | HTMLSelectElement | null;

      if (target?.name === "is_leasehold" && target instanceof HTMLInputElement) {
        setLeaseholdRequired(target.checked);
      }

      scheduleAutosave();
    },
    [scheduleAutosave]
  );

  useEffect(() => {
    window.huisDirectSaveSaleCaseDraft = async () => {
      clearPendingAutosave();
      await queueSave();
    };

    return () => {
      clearPendingAutosave();
      if (window.huisDirectSaveSaleCaseDraft) {
        delete window.huisDirectSaveSaleCaseDraft;
      }
    };
  }, [clearPendingAutosave, queueSave]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearPendingAutosave();

    try {
      await queueSave();
    } catch {
      // Status is handled by queueSave; keep the form on the page.
    }
  }

  const saveStatusLabel =
    saveStatus === "saving"
      ? "Opslaan..."
      : saveStatus === "dirty"
      ? "Niet opgeslagen"
      : saveStatus === "error"
      ? "Opslaan mislukt"
      : "Wijzigingen opgeslagen";

  return (
    <form
      ref={formRef}
      id="sale-case-form"
      action={saveSaleCaseForm}
      onChange={handleFormChange}
      onInput={scheduleAutosave}
      onSubmit={handleSubmit}
      className="w-full max-w-full min-w-0 space-y-6"
    >
      <input type="hidden" name="listing_id" value={listingId} />
      <input type="hidden" name="sale_case_id" value={saleCase.id} />

      {isApartment ? (
        <section className="w-full max-w-full min-w-0 rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
              Appartement
            </p>
            <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold tracking-tight text-neutral-950">
              Appartement en VvE
              <HuisInfoTooltip
                title="Appartement en VvE"
                content="Deze gegevens zijn alleen zichtbaar bij een appartementsdossier en helpen om appartement-specifieke gegevens alvast vast te leggen."
              />
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Vul aan wat bekend is. Deze velden zijn nu nog niet verplicht.
            </p>
          </div>

          <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              name="apartment_index_number"
              label="Appartementsindex"
              defaultValue={apartmentFields.apartment_index_number}
              infoText="Het indexnummer van het appartementsrecht, als dit al bekend is."
              contractField="apartment_index_number"
            />
            <TextField
              name="apartment_complex_name"
              label="Naam complex"
              defaultValue={apartmentFields.apartment_complex_name}
            />
            <TextField
              name="vve_name"
              label="Naam VvE"
              defaultValue={apartmentFields.vve_name}
            />
            <TextField
              name="monthly_service_costs"
              label="Servicekosten per maand"
              inputMode="decimal"
              defaultValue={apartmentFields.monthly_service_costs}
            />
            <TextField
              name="reserve_fund"
              label="Reservefonds"
              inputMode="decimal"
              defaultValue={apartmentFields.reserve_fund}
            />
            <HuisSelect
              name="mjop_available"
              label="MJOP beschikbaar"
              defaultValue={
                apartmentFields.mjop_available === null
                  ? ""
                  : apartmentFields.mjop_available
                  ? "true"
                  : "false"
              }
              options={[
                { value: "", label: "Nog niet bekend" },
                { value: "true", label: "Ja" },
                { value: "false", label: "Nee" },
              ]}
            />
          </div>
        </section>
      ) : null}

      <section className="w-full max-w-full min-w-0 rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Optioneel
          </p>
          <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold tracking-tight text-neutral-950">
            Erfpacht
            <HuisInfoTooltip
              title="Erfpacht"
              content="Vul dit alleen in als de woning of het appartement op erfpachtgrond staat."
            />
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Deze gegevens zijn alleen verplicht wanneer de woning of het
            appartement op erfpachtgrond staat.
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          <CheckboxField
            name="is_leasehold"
            label="Deze woning staat op erfpachtgrond"
            defaultChecked={leaseholdFields.is_leasehold}
            infoText="Zet dit aan wanneer de grond niet in volle eigendom is, maar in erfpacht is uitgegeven."
          />

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              name="erfpacht_owner_name"
              label="Eigenaar bloot eigendom"
              defaultValue={leaseholdFields.erfpacht_owner_name}
              required={leaseholdRequired}
              contractField="erfpacht_owner_name"
            />
            <TextField
              name="erfpacht_conditions"
              label="Erfpachtvoorwaarden"
              defaultValue={leaseholdFields.erfpacht_conditions}
              required={leaseholdRequired}
              contractField="erfpacht_conditions"
            />
            <div data-contract-field="erfpacht_end_date">
              <HuisDateInput
                name="erfpacht_end_date"
                label="Einddatum erfpacht"
                defaultValue={formatDateForInput(
                  leaseholdFields.erfpacht_end_date
                )}
                required={leaseholdRequired}
              />
            </div>
            <div data-contract-field="erfpacht_revision_date">
              <HuisDateInput
                name="erfpacht_revision_date"
                label="Herzieningsdatum"
                defaultValue={formatDateForInput(
                  leaseholdFields.erfpacht_revision_date
                )}
                required={leaseholdRequired}
              />
            </div>
            <div data-contract-field="erfpacht_canon_prepaid_until">
              <HuisDateInput
                name="erfpacht_canon_prepaid_until"
                label="Canon afgekocht tot"
                defaultValue={formatDateForInput(
                  leaseholdFields.erfpacht_canon_prepaid_until
                )}
                required={leaseholdRequired}
              />
            </div>
            <TextField
              name="erfpacht_canon_amount"
              label="Canonbedrag"
              inputMode="decimal"
              defaultValue={leaseholdFields.erfpacht_canon_amount}
              required={leaseholdRequired}
              contractField="erfpacht_canon_amount"
            />
            <TextField
              name="erfpacht_canon_period"
              label="Canonperiode"
              defaultValue={leaseholdFields.erfpacht_canon_period}
              placeholder="Bijv. per jaar"
              required={leaseholdRequired}
              contractField="erfpacht_canon_period"
            />
            <div data-contract-field="erfpacht_canon_adjustment_date">
              <HuisDateInput
                name="erfpacht_canon_adjustment_date"
                label="Datum canonaanpassing"
                defaultValue={formatDateForInput(
                  leaseholdFields.erfpacht_canon_adjustment_date
                )}
                required={leaseholdRequired}
              />
            </div>
            <div data-contract-field="erfpacht_canon_indexation_date">
              <HuisDateInput
                name="erfpacht_canon_indexation_date"
                label="Datum canonindexatie"
                defaultValue={formatDateForInput(
                  leaseholdFields.erfpacht_canon_indexation_date
                )}
                required={leaseholdRequired}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-full min-w-0 rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Stap 1
          </p>
          <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold tracking-tight text-neutral-950">
            Verkopergegevens
            <HuisInfoTooltip
              title="Verkopergegevens"
              content="Deze gegevens worden gebruikt om de verkoper of verkopers correct op te nemen in de koopovereenkomst."
            />
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Leg vast namens welke verkoper of verkopers de koopovereenkomst
            wordt opgesteld.
          </p>
        </div>

        <SaleSellerFields sellers={sellers ?? []} />
      </section>

      <section className="w-full max-w-full min-w-0 rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Stap 2
          </p>
          <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold tracking-tight text-neutral-950">
            Kopergegevens
            <HuisInfoTooltip
              title="Kopergegevens"
              content="Deze gegevens worden rechtstreeks gebruikt voor de partijgegevens in de koopovereenkomst."
            />
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Vul hier de gegevens van de koper in. Dit wordt straks automatisch
            verwerkt in de koopovereenkomst.
          </p>
        </div>

        <SaleBuyerFields buyers={buyerRows} />
      </section>

      <section className="w-full max-w-full min-w-0 rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Stap 3
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
            Prijs en overdracht
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Leg de verkoopprijs, overdrachtsdatum en waarde van roerende zaken
            vast.
          </p>
        </div>

        <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
          <TextField
            name="agreed_price"
            label="Overeengekomen koopsom"
            inputMode="decimal"
            defaultValue={formatNumberForInput(saleCase.agreed_price)}
            infoText="Dit is de afgesproken verkoopprijs van de woning. Bij bestaande woningen is dit meestal exclusief kosten koper."
            required
            contractField="agreed_price"
          />
          <ReadOnlySummary
            name="movable_goods_value"
            label="Waarde roerende zaken"
            value={formatNumberForInput(saleCase.movable_goods_value)}
            displayValue={formatCurrency(saleCase.movable_goods_value)}
            infoText="Dit bedrag is de totale waarde van alle roerende zaken die koper overneemt. Het wordt automatisch berekend op basis van de zaken die 'Ter overname' staan."
          />
          <div data-contract-field="acceptance_date">
            <HuisDateInput
              name="acceptance_date"
              label="Datum akkoord"
              defaultValue={formatDateForInput(saleCase.acceptance_date)}
              infoText="Datum waarop koper en verkoper overeenstemming hebben bereikt."
              required
            />
          </div>
          <div data-contract-field="transfer_date">
            <HuisDateInput
              name="transfer_date"
              label="Leveringsdatum"
              defaultValue={formatDateForInput(saleCase.transfer_date)}
              infoText="Datum waarop de woning juridisch wordt geleverd bij de notaris."
              required
            />
          </div>
          <div data-contract-field="transfer_costs_paid_by">
            <HuisSelect
              name="transfer_costs_paid_by"
              label="Kosten overdracht"
              defaultValue={saleCase.transfer_costs_paid_by ?? "buyer"}
              options={[
                { value: "buyer", label: "Kosten koper" },
                { value: "seller", label: "Vrij op naam" },
                { value: "custom", label: "Afwijkende afspraak" },
              ]}
              infoText="Bij bestaande woningen is 'kosten koper' gebruikelijk. Dan betaalt koper onder andere overdrachtsbelasting, notariskosten en kadasterkosten."
              required
            />
          </div>
        </div>

        <SaleMovableItemsForm
          saleCaseId={saleCase.id}
          items={movableItems ?? []}
        />

        <div className="mt-5">
          <AdviceBlock>
            Controleer de koopsom, roerende zaken en leveringsdatum goed met
            koper. Deze gegevens komen rechtstreeks terug in de koopovereenkomst.
          </AdviceBlock>
        </div>
      </section>

      <section className="w-full max-w-full min-w-0 rounded-[28px] border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Stap 4
          </p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-neutral-950 sm:text-xl">
            Ontbindende voorwaarden
          </h2>
          <p className="mt-2 text-sm leading-5 text-neutral-600 sm:leading-6">
            Deze voorwaarden bepalen wanneer koper nog rechtsgeldig kan
            ontbinden.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4">
          <AdviceBlock>
            Gebruik ontbindende voorwaarden alleen als koper en verkoper dit
            duidelijk hebben afgesproken. Vooral financiering en bouwkundige
            keuring zijn belangrijke afspraken.
          </AdviceBlock>

          <CheckboxField
            name="financing_required"
            label="Financieringsvoorbehoud opnemen"
            description="Gebruikelijk wanneer koper nog hypotheek moet regelen."
            defaultChecked={saleCondition?.financing_required ?? true}
            infoText="Met dit voorbehoud kan koper de koop ontbinden als hij de hypotheek niet rond krijgt voor de afgesproken deadline."
          />

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
            <TextField
              name="financing_amount"
              label="Financieringsbedrag"
              inputMode="decimal"
              defaultValue={formatNumberForInput(saleCondition?.financing_amount)}
              infoText="Het bedrag waarvoor koper financiering mag proberen te krijgen."
              required={saleCondition?.financing_required ?? false}
              contractField="financing_amount"
            />
            <div data-contract-field="financing_deadline">
              <HuisDateInput
                name="financing_deadline"
                label="Deadline financiering"
                defaultValue={formatDateForInput(saleCondition?.financing_deadline)}
                infoText="Uiterste datum waarop koper financiering moet regelen."
                required={saleCondition?.financing_required ?? false}
              />
            </div>
          </div>

          <HuisDisclosure
            title="Geavanceerde financieringsvoorwaarden"
            helperText="Optioneel, alleen bij expliciete afspraken."
          >
            <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
              <TextField
                name="max_interest_rate"
                label="Maximale rente (%)"
                inputMode="decimal"
                defaultValue={formatNumberForInput(saleCondition?.max_interest_rate)}
                infoText="Optioneel. Hiermee spreek je af tot welke maximale hypotheekrente koper de financiering moet accepteren. Bijvoorbeeld: 5,0%."
              />
              <TextField
                name="max_gross_annual_cost"
                label="Maximale bruto jaarlast"
                inputMode="decimal"
                defaultValue={formatNumberForInput(
                  saleCondition?.max_gross_annual_cost
                )}
                infoText="Vrijwel nooit gebruikt. Hiermee kan een maximale bruto hypotheeklast per jaar worden afgesproken. Bijvoorbeeld: EUR 24.000 per jaar."
              />
            </div>
          </HuisDisclosure>

          <CheckboxField
            name="nhg_required"
            label="NHG-voorbehoud opnemen"
            defaultChecked={saleCondition?.nhg_required ?? false}
            infoText="Met dit voorbehoud kan koper de koop ontbinden als Nationale Hypotheek Garantie niet wordt verstrekt voor de afgesproken deadline."
          />

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
            <div data-contract-field="nhg_deadline">
              <HuisDateInput
                name="nhg_deadline"
                label="Deadline NHG"
                defaultValue={formatDateForInput(saleCondition?.nhg_deadline)}
                infoText="Alleen relevant als NHG is afgesproken."
                required={saleCondition?.nhg_required ?? false}
              />
            </div>
          </div>

          <CheckboxField
            name="building_inspection_required"
            label="Voorbehoud bouwkundige keuring opnemen"
            description="Relevant als koper eerst een bouwkundige keuring wil laten uitvoeren."
            defaultChecked={saleCondition?.building_inspection_required ?? false}
            infoText="Met dit voorbehoud kan koper de koop ontbinden als uit de bouwkundige keuring blijkt dat noodzakelijke herstelkosten hoger zijn dan het afgesproken maximumbedrag."
          />

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
            <div data-contract-field="building_inspection_deadline">
              <HuisDateInput
                name="building_inspection_deadline"
                label="Deadline bouwkundige keuring"
                defaultValue={formatDateForInput(
                  saleCondition?.building_inspection_deadline
                )}
                infoText="Alleen relevant als een bouwkundige keuring is afgesproken."
                required={saleCondition?.building_inspection_required ?? false}
              />
            </div>
            <TextField
              name="max_repair_costs"
              label="Maximale herstelkosten"
              inputMode="decimal"
              defaultValue={formatNumberForInput(saleCondition?.max_repair_costs)}
              infoText="Het maximale bedrag aan noodzakelijke herstelkosten waarbij koper nog mag ontbinden."
              required={saleCondition?.building_inspection_required ?? false}
              contractField="max_repair_costs"
            />
          </div>

          <input type="hidden" name="bank_guarantee_required" value="true" />
          <section className="rounded-2xl border border-emerald-100 bg-white p-3 shadow-sm sm:p-4">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-neutral-950">
                Bankgarantie / waarborgsom
              </h3>
              <HuisInfoTooltip
                title="Bankgarantie / waarborgsom"
                content="Een bankgarantie of waarborgsom geeft verkoper zekerheid als koper zijn verplichtingen niet nakomt. Meestal gaat het om 10% van de koopsom."
              />
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                <BadgeCheck className="h-3.5 w-3.5" />
                Standaard opgenomen
              </span>
            </div>
            <p className="mt-2 text-sm leading-5 text-neutral-600 sm:leading-6">
              Gebruikelijk bij vrijwel iedere woningverkoop en geeft verkoper
              extra zekerheid.
            </p>
            <div className="mt-4">
              <AdviceBlock>
                Wij nemen deze standaardclausule op omdat dit gebruikelijk is en
                verkoper beschermt als koper zijn verplichtingen niet nakomt.
              </AdviceBlock>
            </div>
            <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
              <ReadOnlySummary
                label="Bedrag bankgarantie / waarborgsom"
                displayValue={formatCurrency(bankGuaranteeAmount)}
                infoText="Dit bedrag wordt standaard berekend als 10% van de overeengekomen koopsom."
              />
              <div data-contract-field="bank_guarantee_deadline">
                <HuisDateInput
                  name="bank_guarantee_deadline"
                  label="Deadline bankgarantie"
                  defaultValue={formatDateForInput(
                    saleCondition?.bank_guarantee_deadline
                  )}
                  infoText="Datum waarop koper zekerheid bij de notaris moet regelen."
                  required
                />
              </div>
            </div>
          </section>

          <CheckboxField
            name="registration_required"
            label="Koopovereenkomst laten inschrijven bij Kadaster"
            defaultChecked={saleCondition?.registration_required ?? false}
            infoText="Door inschrijving van de koopovereenkomst in het Kadaster wordt koper extra beschermd, bijvoorbeeld tegen beslag, faillissement of dubbele verkoop voor levering. Dit loopt via de notaris en brengt meestal extra kosten met zich mee."
          />
          <AdviceBlock>
            Deze inschrijving is vooral bedoeld om koper extra te beschermen.
            Overleg met de notaris of dit nodig is.
          </AdviceBlock>

          <TextAreaField
            name="additional_agreements"
            label="Aanvullende afspraken"
            defaultValue={saleCondition?.additional_agreements}
            placeholder="Bijv. afspraken over oplevering, roerende zaken of bijzonderheden."
            infoText="Gebruik dit veld voor afspraken die niet goed in de standaardvelden passen."
          />
        </div>
      </section>

      <section className="w-full max-w-full min-w-0 rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Stap 5
          </p>
          <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold tracking-tight text-neutral-950">
            Notaris
            <HuisInfoTooltip
              title="Notarisgegevens"
              content="De notaris verzorgt de juridische levering. Vul dit in zodra bekend."
            />
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Vul de notarisgegevens in als deze al bekend zijn.
          </p>
        </div>

        <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
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

      <div className="sticky bottom-20 z-10 rounded-[24px] border border-neutral-200 bg-white/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur sm:bottom-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-neutral-600">
            Sla je verkoopdossier tussentijds op. De koopovereenkomst genereren
            we pas in de volgende stap.
            <span
              className={`mt-1 block text-xs font-semibold ${
                saveStatus === "error" ? "text-red-600" : "text-neutral-500"
              }`}
            >
              {saveStatusLabel}
            </span>
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
