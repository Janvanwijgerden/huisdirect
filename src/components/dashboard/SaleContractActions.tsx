"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Download, Eye, FileText, RefreshCw, X } from "lucide-react";
import {
  generateSaleContract,
  saveSaleCaseDraft,
} from "../../lib/actions/sale-cases";
import {
  type ContractValidationData,
  type ContractValidationError,
  validateSaleContractData,
} from "../../lib/contracts/sale-contract-validation";
import type { SaleBuyer, SaleCondition, SaleSeller } from "../../types/database";

type LatestContractDocument = {
  public_url: string | null;
  version: number;
  created_at: string;
};

declare global {
  interface Window {
    huisDirectSaveSaleCaseDraft?: () => Promise<void>;
  }
}

function formatGeneratedDate(value: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatPrice(value?: number | null) {
  if (value === null || value === undefined) return "Nog niet ingevuld";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string | null) {
  if (!value) return "Nog niet ingevuld";
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function clearValidationMarks() {
  document
    .querySelectorAll("[data-contract-validation-message]")
    .forEach((element) => element.remove());

  document.querySelectorAll("[data-contract-field]").forEach((element) => {
    element.classList.remove(
      "rounded-2xl",
      "ring-4",
      "ring-red-100",
      "outline",
      "outline-1",
      "outline-red-300"
    );
  });
}

function markValidationErrors(errors: ContractValidationError[]) {
  clearValidationMarks();

  errors.forEach((error) => {
    const wrapper = document.querySelector(
      `[data-contract-field="${error.field}"]`
    );

    if (!wrapper) return;

    wrapper.classList.add(
      "rounded-2xl",
      "ring-4",
      "ring-red-100",
      "outline",
      "outline-1",
      "outline-red-300"
    );

    const message = document.createElement("p");
    message.dataset.contractValidationMessage = "true";
    message.className = "mt-2 text-sm leading-5 text-red-600";
    message.textContent = error.message;
    wrapper.appendChild(message);
  });
}

function scrollToFirstError(errors: ContractValidationError[]) {
  const firstError = errors[0];
  if (!firstError) return;

  const wrapper = document.querySelector(
    `[data-contract-field="${firstError.field}"]`
  ) as HTMLElement | null;

  if (!wrapper) return;

  wrapper.scrollIntoView({ behavior: "smooth", block: "center" });

  const focusable = wrapper.querySelector(
    "input, textarea, button"
  ) as HTMLElement | null;

  window.setTimeout(() => focusable?.focus(), 350);
}

function getPersonName(person?: { first_name: string | null; last_name: string | null } | null) {
  const name = `${person?.first_name || ""} ${person?.last_name || ""}`.trim();
  return name || "Nog niet ingevuld";
}

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function formNumber(formData: FormData, key: string) {
  const value = formString(formData, key);
  if (!value) return null;
  const number = Number(value.replace(",", "."));
  return Number.isFinite(number) ? number : null;
}

function formBoolean(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true";
}

function recordValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function leaseholdFromForm(formData: FormData) {
  return {
    is_leasehold: formBoolean(formData, "is_leasehold"),
    erfpacht_owner_name: formString(formData, "erfpacht_owner_name"),
    erfpacht_conditions: formString(formData, "erfpacht_conditions"),
    erfpacht_end_date: formString(formData, "erfpacht_end_date"),
    erfpacht_revision_date: formString(formData, "erfpacht_revision_date"),
    erfpacht_canon_prepaid_until: formString(
      formData,
      "erfpacht_canon_prepaid_until"
    ),
    erfpacht_canon_amount: formString(formData, "erfpacht_canon_amount"),
    erfpacht_canon_period: formString(formData, "erfpacht_canon_period"),
    erfpacht_canon_adjustment_date: formString(
      formData,
      "erfpacht_canon_adjustment_date"
    ),
    erfpacht_canon_indexation_date: formString(
      formData,
      "erfpacht_canon_indexation_date"
    ),
  };
}

function sellerFromForm(
  formData: FormData,
  existing: SaleSeller | null,
  order: 1 | 2
): SaleSeller {
  const prefix = `seller_${order}`;

  return {
    ...(existing ?? {}),
    id: existing?.id ?? "",
    sale_case_id: existing?.sale_case_id ?? "",
    seller_order: order,
    first_name: formString(formData, `${prefix}_first_name`),
    last_name: formString(formData, `${prefix}_last_name`),
    initials: formString(formData, `${prefix}_initials`),
    birth_place: formString(formData, `${prefix}_birth_place`),
    birth_date: formString(formData, `${prefix}_birth_date`),
    street: formString(formData, `${prefix}_street`),
    house_number: formString(formData, `${prefix}_house_number`),
    postal_code: formString(formData, `${prefix}_postal_code`),
    city: formString(formData, `${prefix}_city`),
    email: formString(formData, `${prefix}_email`),
    phone: formString(formData, `${prefix}_phone`),
    marital_status: formString(formData, `${prefix}_marital_status`) as
      | SaleSeller["marital_status"]
      | null,
    matrimonial_property_regime: formString(
      formData,
      `${prefix}_matrimonial_property_regime`
    ) as SaleSeller["matrimonial_property_regime"] | null,
    identification_type: formString(formData, `${prefix}_identification_type`),
    identification_number: formString(
      formData,
      `${prefix}_identification_number`
    ),
    created_at: existing?.created_at ?? "",
    updated_at: existing?.updated_at ?? "",
  };
}

function buyerFromForm(
  formData: FormData,
  existing: SaleBuyer | null,
  order: 1 | 2
): SaleBuyer {
  const prefix = `buyer_${order}`;

  return {
    ...(existing ?? {}),
    id: existing?.id ?? "",
    sale_case_id: existing?.sale_case_id ?? "",
    buyer_order: order,
    first_name: formString(formData, `${prefix}_first_name`),
    last_name: formString(formData, `${prefix}_last_name`),
    initials: formString(formData, `${prefix}_initials`),
    birth_place: formString(formData, `${prefix}_birth_place`),
    birth_date: formString(formData, `${prefix}_birth_date`),
    street: formString(formData, `${prefix}_street`),
    house_number: formString(formData, `${prefix}_house_number`),
    postal_code: formString(formData, `${prefix}_postal_code`),
    city: formString(formData, `${prefix}_city`),
    email: formString(formData, `${prefix}_email`),
    phone: formString(formData, `${prefix}_phone`),
    marital_status: formString(formData, `${prefix}_marital_status`) as
      | SaleBuyer["marital_status"]
      | null,
    matrimonial_property_regime: formString(
      formData,
      `${prefix}_matrimonial_property_regime`
    ) as SaleBuyer["matrimonial_property_regime"] | null,
    identification_type: formString(formData, `${prefix}_identification_type`),
    identification_number: formString(
      formData,
      `${prefix}_identification_number`
    ),
    created_at: existing?.created_at ?? "",
    updated_at: existing?.updated_at ?? "",
  };
}

function validationDataFromForm(
  baseData: ContractValidationData,
  form: HTMLFormElement | null
): ContractValidationData {
  if (!form) return baseData;

  const formData = new FormData(form);
  const sellerOne =
    baseData.sellers.find((seller) => seller.seller_order === 1) ??
    baseData.sellers[0] ??
    null;
  const sellerTwo =
    baseData.sellers.find((seller) => seller.seller_order === 2) ??
    baseData.sellers[1] ??
    null;
  const buyerOne =
    baseData.buyers.find((buyer) => buyer.buyer_order === 1) ??
    baseData.buyers[0] ??
    null;
  const buyerTwo =
    baseData.buyers.find((buyer) => buyer.buyer_order === 2) ??
    baseData.buyers[1] ??
    null;
  const sellerCount = formString(formData, "seller_count") === "two" ? "two" : "one";
  const buyerCount = formString(formData, "buyer_count") === "two" ? "two" : "one";
  const listingFeatures = recordValue(baseData.listing?.features);

  return {
    ...baseData,
    listing: {
      ...baseData.listing,
      is_leasehold: formBoolean(formData, "is_leasehold"),
      features: {
        ...listingFeatures,
        leasehold: {
          ...recordValue(listingFeatures.leasehold),
          ...leaseholdFromForm(formData),
        },
      },
    },
    saleCase: {
      ...baseData.saleCase,
      agreed_price: formNumber(formData, "agreed_price"),
      acceptance_date: formString(formData, "acceptance_date"),
      transfer_date: formString(formData, "transfer_date"),
      transfer_costs_paid_by:
        (formString(
          formData,
          "transfer_costs_paid_by"
        ) as ContractValidationData["saleCase"]["transfer_costs_paid_by"]) ??
        baseData.saleCase.transfer_costs_paid_by,
    },
    saleCondition: {
      ...((baseData.saleCondition ?? {}) as SaleCondition),
      financing_required: formBoolean(formData, "financing_required"),
      financing_amount: formNumber(formData, "financing_amount"),
      financing_deadline: formString(formData, "financing_deadline"),
      nhg_required: formBoolean(formData, "nhg_required"),
      nhg_deadline: formString(formData, "nhg_deadline"),
      building_inspection_required: formBoolean(
        formData,
        "building_inspection_required"
      ),
      building_inspection_deadline: formString(
        formData,
        "building_inspection_deadline"
      ),
      max_repair_costs: formNumber(formData, "max_repair_costs"),
      bank_guarantee_deadline: formString(
        formData,
        "bank_guarantee_deadline"
      ),
    },
    sellers:
      sellerCount === "two"
        ? [
            sellerFromForm(formData, sellerOne, 1),
            sellerFromForm(formData, sellerTwo, 2),
          ]
        : [sellerFromForm(formData, sellerOne, 1)],
    buyers:
      buyerCount === "two"
        ? [buyerFromForm(formData, buyerOne, 1), buyerFromForm(formData, buyerTwo, 2)]
        : [buyerFromForm(formData, buyerOne, 1)],
    partyCounts: {
      sellerCount,
      buyerCount,
    },
  };
}

function partyCountsFromForm(form: HTMLFormElement) {
  const formData = new FormData(form);

  return {
    sellerCount: formString(formData, "seller_count") === "two" ? "two" : "one",
    buyerCount: formString(formData, "buyer_count") === "two" ? "two" : "one",
  } as const;
}

async function saveCurrentDraft(form: HTMLFormElement) {
  if (window.huisDirectSaveSaleCaseDraft) {
    await window.huisDirectSaveSaleCaseDraft();
    return;
  }

  await saveSaleCaseDraft(new FormData(form));
}

export default function SaleContractActions({
  saleCaseId,
  latestDocument,
  validationData,
}: {
  saleCaseId: string;
  latestDocument: LatestContractDocument | null;
  validationData: ContractValidationData;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [technicalError, setTechnicalError] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState<
    "idle" | "saving" | "generating"
  >("idle");
  const [currentValidationData, setCurrentValidationData] =
    useState<ContractValidationData>(validationData);
  const [validationErrors, setValidationErrors] = useState<
    ContractValidationError[]
  >([]);
  const [showPreview, setShowPreview] = useState(false);
  const hasDocument = Boolean(latestDocument);

  useEffect(() => {
    const form = document.getElementById("sale-case-form") as HTMLFormElement | null;

    function updateFromForm() {
      setCurrentValidationData(validationDataFromForm(validationData, form));
    }

    updateFromForm();

    if (!form) return;

    form.addEventListener("input", updateFromForm);
    form.addEventListener("change", updateFromForm);

    return () => {
      form.removeEventListener("input", updateFromForm);
      form.removeEventListener("change", updateFromForm);
    };
  }, [validationData]);

  const completion = useMemo(
    () => validateSaleContractData(currentValidationData),
    [currentValidationData]
  );

  function handleValidationFailure(errors: ContractValidationError[]) {
    setValidationErrors(errors);
    setError("Vul eerst de gemarkeerde verplichte velden in.");
    setTechnicalError(null);
    markValidationErrors(errors);
    scrollToFirstError(errors);
  }

  function validateBeforeAction() {
    const form = document.getElementById("sale-case-form") as HTMLFormElement | null;
    const latestValidationData = validationDataFromForm(validationData, form);
    setCurrentValidationData(latestValidationData);
    const current = validateSaleContractData(latestValidationData);

    if (current.errors.length > 0) {
      handleValidationFailure(current.errors);
      return false;
    }

    clearValidationMarks();
    setValidationErrors([]);
    setError(null);
    setTechnicalError(null);
    return true;
  }

  async function handlePreview() {
    const form = document.getElementById("sale-case-form") as HTMLFormElement | null;
    if (!form) {
      setError("Verkoopdossierformulier niet gevonden.");
      setTechnicalError("Kon #sale-case-form niet vinden in de pagina.");
      return;
    }

    try {
      await saveCurrentDraft(form);
    } catch (err) {
      setError("Verkoopdossier opslaan mislukt.");
      setTechnicalError(err instanceof Error ? err.message : null);
      return;
    }

    if (!validateBeforeAction()) return;
    setShowPreview(true);
  }

  async function handleDownload() {
    if (!latestDocument?.public_url) return;

    const form = document.getElementById("sale-case-form") as HTMLFormElement | null;
    if (!form) {
      setError("Verkoopdossierformulier niet gevonden.");
      setTechnicalError("Kon #sale-case-form niet vinden in de pagina.");
      return;
    }

    try {
      await saveCurrentDraft(form);
    } catch (err) {
      setError("Verkoopdossier opslaan mislukt.");
      setTechnicalError(err instanceof Error ? err.message : null);
      return;
    }

    if (!validateBeforeAction()) return;
    window.open(latestDocument.public_url, "_blank", "noopener,noreferrer");
  }

  function handleGenerate() {
    startTransition(async () => {
      setGenerationStep("saving");
      try {
        const form = document.getElementById(
          "sale-case-form"
        ) as HTMLFormElement | null;

        if (!form) {
          setError("Verkoopdossierformulier niet gevonden.");
          setTechnicalError("Kon #sale-case-form niet vinden in de pagina.");
          return;
        }

        await saveCurrentDraft(form);
        if (!validateBeforeAction()) return;

        setGenerationStep("generating");
        const result = await generateSaleContract(
          saleCaseId,
          partyCountsFromForm(form)
        );

        if (!result.success) {
          if (result.type === "validation") {
            handleValidationFailure(result.errors);
            return;
          }

          if (result.type === "docx_generation") {
            setError(result.message);
            setTechnicalError(result.technicalMessage);
            return;
          }

          if (result.type === "persistence") {
            setError(result.message);
            setTechnicalError(result.technicalMessage);
            return;
          }

          setError(result.message);
          setTechnicalError(null);
          return;
        }

        router.refresh();
        window.open(result.publicUrl, "_blank", "noopener,noreferrer");
      } catch (err) {
        const message = err instanceof Error ? err.message : "";
        setError(
          message && message !== "Multi error"
            ? message
            : "Koopovereenkomst genereren mislukt. Controleer het verkoopdossier en probeer opnieuw."
        );
        setTechnicalError(null);
      }
      finally {
        setGenerationStep("idle");
      }
    });
  }

  const bankGuaranteeAmount = validationData.saleCase.agreed_price
    ? Math.round(validationData.saleCase.agreed_price * 0.1)
    : null;
  const primarySeller = validationData.sellers[0] ?? null;
  const primaryBuyer = validationData.buyers[0] ?? null;
  const notaryOffice =
    validationData.saleCase.notary_office_name || "nader op te geven";
  const notaryCity = validationData.saleCase.notary_city || "nader op te geven";

  return (
    <div className="mt-5 space-y-3">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-neutral-950">
            Verkoopdossier compleet: {completion.percentage}%
          </p>
          <p className="text-xs font-semibold text-neutral-500">
            {completion.completed}/{completion.total}
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all"
            style={{ width: `${completion.percentage}%` }}
          />
        </div>
        <p className="mt-2 text-xs leading-5 text-neutral-600">
          {completion.completed} van {completion.total} verplichte gegevens
          ingevuld.
        </p>
      </div>

      {hasDocument && latestDocument?.public_url ? (
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Download className="h-4 w-4" />
          Koopovereenkomst downloaden
        </button>
      ) : null}

      <button
        type="button"
        onClick={handlePreview}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-950 transition hover:border-emerald-300 hover:bg-emerald-50"
      >
        <Eye className="h-4 w-4" />
        Controleer concept
      </button>

      <button
        type="button"
        disabled={isPending}
        onClick={handleGenerate}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-950 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-70"
      >
        {hasDocument ? (
          <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
        ) : (
          <FileText className="h-4 w-4" />
        )}
        {isPending
          ? generationStep === "saving"
            ? "Dossier opslaan..."
            : "Koopovereenkomst genereren..."
          : hasDocument
          ? "Opnieuw genereren"
          : "Koopovereenkomst genereren"}
      </button>

      {latestDocument ? (
        <p className="text-xs leading-5 text-neutral-500">
          Laatste versie: v{latestDocument.version}, gegenereerd op{" "}
          {formatGeneratedDate(latestDocument.created_at)}.
        </p>
      ) : (
        <p className="text-xs leading-5 text-neutral-500">
          Er is nog geen koopovereenkomst gegenereerd voor dit dossier.
        </p>
      )}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
          <p className="font-semibold">{error}</p>
          {validationErrors.length > 0 ? (
            <p className="mt-1">{validationErrors[0].message}</p>
          ) : null}
          {technicalError ? (
            <pre className="mt-3 max-h-44 overflow-auto whitespace-pre-wrap rounded-xl border border-red-200 bg-white/80 p-3 font-mono text-[11px] leading-5 text-red-800">
              {technicalError}
            </pre>
          ) : null}
        </div>
      ) : null}

      {showPreview ? (
        <div className="fixed inset-0 z-[90] flex items-end bg-black/30 p-4 sm:items-center sm:justify-center">
          <div className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-neutral-200 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-neutral-950">
                  Conceptcontrole
                </h3>
                <p className="mt-1 text-sm leading-6 text-neutral-600">
                  Controleer de belangrijkste gegevens voordat je de DOCX
                  genereert.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200 text-neutral-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 text-sm">
              <PreviewRow label="Verkoper" value={getPersonName(primarySeller)} />
              <PreviewRow label="Koper" value={getPersonName(primaryBuyer)} />
              <PreviewRow
                label="Woning"
                value={`${validationData.listing?.street || ""} ${
                  validationData.listing?.house_number || ""
                }, ${validationData.listing?.city || ""}`.trim()}
              />
              <PreviewRow
                label="Koopsom"
                value={formatPrice(validationData.saleCase.agreed_price)}
              />
              <PreviewRow
                label="Roerende zaken totaal"
                value={formatPrice(validationData.saleCase.movable_goods_value)}
              />
              <PreviewRow
                label="Leveringsdatum"
                value={formatDate(validationData.saleCase.transfer_date)}
              />
              <PreviewRow
                label="Bankgarantie 10%"
                value={formatPrice(bankGuaranteeAmount)}
              />
              <PreviewRow
                label="Financieringsvoorbehoud"
                value={
                  validationData.saleCondition?.financing_required ? "Ja" : "Nee"
                }
              />
              <PreviewRow label="Notariskantoor" value={notaryOffice} />
              <PreviewRow label="Plaats notaris" value={notaryCity} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
        {label}
      </p>
      <p className="mt-1 break-words font-semibold text-neutral-950">
        {value || "Nog niet ingevuld"}
      </p>
    </div>
  );
}
