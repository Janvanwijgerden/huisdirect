"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import {
  DocxGenerationError,
  generateSaleContractDocx,
} from "../contracts/generate-sale-contract";
import { validateSaleContractData } from "../contracts/sale-contract-validation";
import type {
  SaleBuyer,
  SaleCase,
  SaleCondition,
  SaleMovableItem,
  SaleSeller,
  SaleTemplateType,
  TransferCostsPaidBy,
} from "../../types/database";

const SALE_CONTRACTS_BUCKET = "sale-contracts";
const SALE_CONTRACT_DOCX_TYPE = "koopovereenkomst_docx";
const DOCX_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function getTemplateType(propertyType?: string | null): SaleTemplateType {
  const value = (propertyType || "").toLowerCase();

  if (
    value.includes("appartement") ||
    value.includes("bovenwoning") ||
    value.includes("benedenwoning") ||
    value.includes("maisonnette")
  ) {
    return "appartement";
  }

  return "woning";
}

function stringOrNull(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text.length > 0 ? text : null;
}

function numberOrNull(value: FormDataEntryValue | null) {
  const text = String(value || "").replace(",", ".").trim();
  if (!text) return null;

  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

function dateOrNull(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text.length > 0 ? text : null;
}

function booleanFromForm(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

function booleanOrNullFromForm(value: FormDataEntryValue | null) {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function recordFromUnknown(value: unknown): Record<string, any> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? { ...(value as Record<string, any>) }
    : {};
}

function sanitizeDownloadFileNamePart(value?: string | null) {
  const normalized = (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || null;
}

function buildContractDownloadFileName({
  street,
  houseNumber,
  city,
  version,
}: {
  street?: string | null;
  houseNumber?: string | null;
  city?: string | null;
  version: number;
}) {
  const addressParts = [
    sanitizeDownloadFileNamePart(street),
    sanitizeDownloadFileNamePart(houseNumber),
    sanitizeDownloadFileNamePart(city),
  ].filter(Boolean);
  const address = addressParts.length > 0 ? addressParts.join("_") : "woning";

  return `Koopovereenkomst_${address}_v${version}.docx`;
}

function addDownloadFileNameToPublicUrl(publicUrl: string, fileName: string) {
  const separator = publicUrl.includes("?") ? "&" : "?";
  return `${publicUrl}${separator}download=${encodeURIComponent(fileName)}`;
}

function calculateBankGuaranteeAmount(agreedPrice: number | null) {
  return agreedPrice ? Math.round(agreedPrice * 0.1) : null;
}

async function calculateMovableGoodsTotal(
  supabase: ReturnType<typeof createClient>,
  saleCaseId: string
) {
  const { data: optionalItems, error } = await supabase
    .from("sale_movable_items")
    .select("agreed_price")
    .eq("sale_case_id", saleCaseId)
    .eq("item_status", "optional");

  if (error) {
    throw new Error(`Roerende zaken ophalen mislukt: ${error.message}`);
  }

  return (optionalItems || []).reduce(
    (sum, item) => sum + (item.agreed_price ?? 0),
    0
  );
}

async function getOwnedSaleCase(
  supabase: ReturnType<typeof createClient>,
  saleCaseId: string,
  userId: string
) {
  const { data: saleCase, error } = await supabase
    .from("sale_cases")
    .select("id, listing_id, seller_user_id")
    .eq("id", saleCaseId)
    .eq("seller_user_id", userId)
    .single();

  if (error || !saleCase) {
    throw new Error("Verkoopdossier niet gevonden of geen toegang.");
  }

  return saleCase;
}

async function updateMovableGoodsTotal(
  supabase: ReturnType<typeof createClient>,
  saleCaseId: string,
  sellerUserId: string
) {
  const total = await calculateMovableGoodsTotal(supabase, saleCaseId);
  const { error } = await supabase
    .from("sale_cases")
    .update({ movable_goods_value: total })
    .eq("id", saleCaseId)
    .eq("seller_user_id", sellerUserId);

  if (error) {
    throw new Error(`Waarde roerende zaken bijwerken mislukt: ${error.message}`);
  }

  return total;
}

function movableItemStatusFromForm(
  value: FormDataEntryValue | null
): SaleMovableItem["item_status"] {
  const text = String(value || "").trim();

  if (
    text === "included" ||
    text === "optional" ||
    text === "excluded" ||
    text === "not_present"
  ) {
    return text;
  }

  return "included";
}

function transferCostsPaidByFromForm(
  value: FormDataEntryValue | null
): TransferCostsPaidBy {
  const text = String(value || "").trim();

  if (text === "seller" || text === "custom") {
    return text;
  }

  return "buyer";
}

function hasSellerFormData(formData: FormData, prefix: "seller_1" | "seller_2") {
  return [
    "first_name",
    "last_name",
    "initials",
    "birth_place",
    "birth_date",
    "street",
    "house_number",
    "postal_code",
    "city",
    "email",
    "phone",
    "marital_status",
    "matrimonial_property_regime",
    "identification_type",
    "identification_number",
  ].some((field) => stringOrNull(formData.get(`${prefix}_${field}`)));
}

function hasBuyerFormData(formData: FormData, prefix: "buyer_1" | "buyer_2") {
  return [
    "first_name",
    "last_name",
    "initials",
    "birth_place",
    "birth_date",
    "street",
    "house_number",
    "postal_code",
    "city",
    "email",
    "phone",
    "marital_status",
    "matrimonial_property_regime",
    "identification_type",
    "identification_number",
  ].some((field) => stringOrNull(formData.get(`${prefix}_${field}`)));
}

function buildSellerPayload(
  formData: FormData,
  saleCaseId: string,
  sellerOrder: 1 | 2
): Omit<SaleSeller, "id" | "created_at" | "updated_at"> {
  const prefix = `seller_${sellerOrder}`;

  return {
    sale_case_id: saleCaseId,
    seller_order: sellerOrder,
    first_name: stringOrNull(formData.get(`${prefix}_first_name`)),
    last_name: stringOrNull(formData.get(`${prefix}_last_name`)),
    initials: stringOrNull(formData.get(`${prefix}_initials`)),
    birth_place: stringOrNull(formData.get(`${prefix}_birth_place`)),
    birth_date: dateOrNull(formData.get(`${prefix}_birth_date`)),
    street: stringOrNull(formData.get(`${prefix}_street`)),
    house_number: stringOrNull(formData.get(`${prefix}_house_number`)),
    postal_code: stringOrNull(formData.get(`${prefix}_postal_code`)),
    city: stringOrNull(formData.get(`${prefix}_city`)),
    email: stringOrNull(formData.get(`${prefix}_email`)),
    phone: stringOrNull(formData.get(`${prefix}_phone`)),
    marital_status: stringOrNull(formData.get(`${prefix}_marital_status`)) as
      | SaleSeller["marital_status"]
      | null,
    matrimonial_property_regime: stringOrNull(
      formData.get(`${prefix}_matrimonial_property_regime`)
    ) as SaleSeller["matrimonial_property_regime"] | null,
    identification_type: stringOrNull(
      formData.get(`${prefix}_identification_type`)
    ),
    identification_number: stringOrNull(
      formData.get(`${prefix}_identification_number`)
    ),
  };
}

function buildBuyerPayload(
  formData: FormData,
  saleCaseId: string,
  buyerOrder: 1 | 2
): Omit<SaleBuyer, "id" | "created_at" | "updated_at"> {
  const prefix = `buyer_${buyerOrder}`;

  return {
    sale_case_id: saleCaseId,
    buyer_order: buyerOrder,
    first_name: stringOrNull(formData.get(`${prefix}_first_name`)),
    last_name: stringOrNull(formData.get(`${prefix}_last_name`)),
    initials: stringOrNull(formData.get(`${prefix}_initials`)),
    birth_place: stringOrNull(formData.get(`${prefix}_birth_place`)),
    birth_date: dateOrNull(formData.get(`${prefix}_birth_date`)),
    street: stringOrNull(formData.get(`${prefix}_street`)),
    house_number: stringOrNull(formData.get(`${prefix}_house_number`)),
    postal_code: stringOrNull(formData.get(`${prefix}_postal_code`)),
    city: stringOrNull(formData.get(`${prefix}_city`)),
    email: stringOrNull(formData.get(`${prefix}_email`)),
    phone: stringOrNull(formData.get(`${prefix}_phone`)),
    marital_status: stringOrNull(formData.get(`${prefix}_marital_status`)) as
      | SaleBuyer["marital_status"]
      | null,
    matrimonial_property_regime: stringOrNull(
      formData.get(`${prefix}_matrimonial_property_regime`)
    ) as SaleBuyer["matrimonial_property_regime"] | null,
    identification_type: stringOrNull(
      formData.get(`${prefix}_identification_type`)
    ),
    identification_number: stringOrNull(
      formData.get(`${prefix}_identification_number`)
    ),
  };
}

async function saveBuyerPayload(
  supabase: ReturnType<typeof createClient>,
  saleCaseId: string,
  buyerOrder: 1 | 2,
  payload: Omit<SaleBuyer, "id" | "created_at" | "updated_at">
) {
  const { data: existingBuyer, error: existingBuyerError } = await supabase
    .from("sale_buyers")
    .select("id")
    .eq("sale_case_id", saleCaseId)
    .eq("buyer_order", buyerOrder)
    .maybeSingle();

  if (existingBuyerError) {
    throw new Error(`Koper ophalen mislukt: ${existingBuyerError.message}`);
  }

  const query = existingBuyer
    ? supabase.from("sale_buyers").update(payload).eq("id", existingBuyer.id)
    : supabase.from("sale_buyers").insert(payload);

  const { error } = await query;

  if (error) {
    throw new Error(`Koper ${buyerOrder} opslaan mislukt: ${error.message}`);
  }
}

export async function getOrCreateSaleCase(listingId: string): Promise<{
  saleCase: SaleCase;
  saleCondition: SaleCondition | null;
}> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Niet ingelogd.");
  }

  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("id, user_id, asking_price, property_type")
    .eq("id", listingId)
    .eq("user_id", user.id)
    .single();

  if (listingError || !listing) {
    throw new Error("Woning niet gevonden of geen toegang.");
  }

  const { data: existingSaleCase, error: existingError } = await supabase
    .from("sale_cases")
    .select("*")
    .eq("listing_id", listing.id)
    .eq("seller_user_id", user.id)
    .maybeSingle();

  if (existingError) {
    throw new Error(`Verkoopdossier ophalen mislukt: ${existingError.message}`);
  }

  if (existingSaleCase) {
    const { data: existingCondition, error: conditionError } = await supabase
      .from("sale_conditions")
      .select("*")
      .eq("sale_case_id", existingSaleCase.id)
      .maybeSingle();

    if (conditionError) {
      throw new Error(`Voorwaarden ophalen mislukt: ${conditionError.message}`);
    }

    return {
      saleCase: existingSaleCase,
      saleCondition: existingCondition,
    };
  }

  const templateType = getTemplateType(listing.property_type);

  const { data: newSaleCase, error: createError } = await supabase
    .from("sale_cases")
    .insert({
      listing_id: listing.id,
      seller_user_id: user.id,
      status: "draft",
      template_type: templateType,
      agreed_price: listing.asking_price ?? null,
      movable_goods_value: 0,
      transfer_costs_paid_by: "buyer",
    })
    .select("*")
    .single();

  if (createError || !newSaleCase) {
    throw new Error(`Verkoopdossier aanmaken mislukt: ${createError?.message}`);
  }

  const defaultBankGuaranteeAmount = listing.asking_price
    ? Math.round(Number(listing.asking_price) * 0.1)
    : null;

  const { data: newCondition, error: conditionCreateError } = await supabase
    .from("sale_conditions")
    .insert({
      sale_case_id: newSaleCase.id,
      financing_required: true,
      financing_amount: listing.asking_price ?? null,
      nhg_required: false,
      building_inspection_required: false,
      bank_guarantee_required: true,
      bank_guarantee_amount: defaultBankGuaranteeAmount,
      registration_required: false,
    })
    .select("*")
    .single();

  if (conditionCreateError) {
    throw new Error(
      `Verkoopvoorwaarden aanmaken mislukt: ${conditionCreateError.message}`
    );
  }

  await supabase.from("sale_activity_log").insert({
    sale_case_id: newSaleCase.id,
    actor_user_id: user.id,
    action: "sale_case_created",
    metadata: {
      listing_id: listing.id,
      template_type: templateType,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/verkoopdossier/${listing.id}`);

  return {
    saleCase: newSaleCase,
    saleCondition: newCondition,
  };
}

async function persistSaleCaseForm(
  formData: FormData,
  { redirectAfterSave }: { redirectAfterSave: boolean }
): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Niet ingelogd.");
  }

  const listingId = stringOrNull(formData.get("listing_id"));
  const saleCaseId = stringOrNull(formData.get("sale_case_id"));

  if (!listingId || !saleCaseId) {
    throw new Error("Verkoopdossier ontbreekt.");
  }

  const { data: saleCase, error: saleCaseError } = await supabase
    .from("sale_cases")
    .select("id, listing_id, seller_user_id, template_type")
    .eq("id", saleCaseId)
    .eq("listing_id", listingId)
    .eq("seller_user_id", user.id)
    .single();

  if (saleCaseError || !saleCase) {
    throw new Error("Verkoopdossier niet gevonden of geen toegang.");
  }

  const agreedPrice = numberOrNull(formData.get("agreed_price"));
  const movableGoodsValue = await calculateMovableGoodsTotal(
    supabase,
    saleCaseId
  );
  const bankGuaranteeAmount = calculateBankGuaranteeAmount(agreedPrice);

  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("features")
    .eq("id", listingId)
    .eq("user_id", user.id)
    .single();

  if (listingError) {
    throw new Error(`Woninggegevens ophalen mislukt: ${listingError.message}`);
  }

  const features = recordFromUnknown(listing?.features);
  const leasehold = {
    ...recordFromUnknown(features.leasehold),
    is_leasehold: booleanFromForm(formData.get("is_leasehold")),
    erfpacht_owner_name: stringOrNull(formData.get("erfpacht_owner_name")),
    erfpacht_conditions: stringOrNull(formData.get("erfpacht_conditions")),
    erfpacht_end_date: dateOrNull(formData.get("erfpacht_end_date")),
    erfpacht_revision_date: dateOrNull(formData.get("erfpacht_revision_date")),
    erfpacht_canon_prepaid_until: dateOrNull(
      formData.get("erfpacht_canon_prepaid_until")
    ),
    erfpacht_canon_amount: stringOrNull(
      formData.get("erfpacht_canon_amount")
    ),
    erfpacht_canon_period: stringOrNull(
      formData.get("erfpacht_canon_period")
    ),
    erfpacht_canon_adjustment_date: dateOrNull(
      formData.get("erfpacht_canon_adjustment_date")
    ),
    erfpacht_canon_indexation_date: dateOrNull(
      formData.get("erfpacht_canon_indexation_date")
    ),
  };
  let nextFeatures: Record<string, any> = {
    ...features,
    leasehold,
  };

  if (saleCase.template_type === "appartement") {
    const vve = recordFromUnknown(features.vve);

    const apartmentContract = {
      ...recordFromUnknown(features.apartment_contract),
      apartment_index_number: stringOrNull(
        formData.get("apartment_index_number")
      ),
      apartment_complex_name: stringOrNull(
        formData.get("apartment_complex_name")
      ),
      vve_name: stringOrNull(formData.get("vve_name")),
      monthly_service_costs: numberOrNull(
        formData.get("monthly_service_costs")
      ),
      reserve_fund: numberOrNull(formData.get("reserve_fund")),
      mjop_available: booleanOrNullFromForm(formData.get("mjop_available")),
    };
    const vveUpdates: Record<string, string | boolean> = {};

    if (apartmentContract.monthly_service_costs !== null) {
      vveUpdates.monthlyCosts = String(apartmentContract.monthly_service_costs);
    }

    if (apartmentContract.reserve_fund !== null) {
      vveUpdates.reserveFund = String(apartmentContract.reserve_fund);
    }

    if (apartmentContract.mjop_available !== null) {
      vveUpdates.hasMjop = apartmentContract.mjop_available;
    }

    nextFeatures = {
      ...nextFeatures,
      vve: {
        ...vve,
        ...vveUpdates,
      },
      apartment_contract: apartmentContract,
    };
  }

  const { error: listingUpdateError } = await supabase
    .from("listings")
    .update({ features: nextFeatures })
    .eq("id", listingId)
    .eq("user_id", user.id);

  if (listingUpdateError) {
    throw new Error(
      `Woninggegevens opslaan mislukt: ${listingUpdateError.message}`
    );
  }

  const { error: updateSaleCaseError } = await supabase
    .from("sale_cases")
    .update({
      agreed_price: agreedPrice,
      movable_goods_value: movableGoodsValue ?? 0,
      transfer_costs_paid_by: transferCostsPaidByFromForm(
        formData.get("transfer_costs_paid_by")
      ),
      acceptance_date: dateOrNull(formData.get("acceptance_date")),
      transfer_date: dateOrNull(formData.get("transfer_date")),
      notary_office_name: stringOrNull(formData.get("notary_office_name")),
      notary_city: stringOrNull(formData.get("notary_city")),
      notary_email: stringOrNull(formData.get("notary_email")),
      notary_phone: stringOrNull(formData.get("notary_phone")),
      notes: stringOrNull(formData.get("notes")),
      status: "draft",
    })
    .eq("id", saleCaseId)
    .eq("seller_user_id", user.id);

  if (updateSaleCaseError) {
    throw new Error(`Verkoopdossier opslaan mislukt: ${updateSaleCaseError.message}`);
  }

  const { error: updateConditionsError } = await supabase
    .from("sale_conditions")
    .upsert(
      {
        sale_case_id: saleCaseId,
        financing_required: booleanFromForm(formData.get("financing_required")),
        financing_amount: numberOrNull(formData.get("financing_amount")),
        financing_deadline: dateOrNull(formData.get("financing_deadline")),
        max_interest_rate: numberOrNull(formData.get("max_interest_rate")),
        max_gross_annual_cost: numberOrNull(formData.get("max_gross_annual_cost")),
        nhg_required: booleanFromForm(formData.get("nhg_required")),
        nhg_deadline: dateOrNull(formData.get("nhg_deadline")),
        building_inspection_required: booleanFromForm(
          formData.get("building_inspection_required")
        ),
        building_inspection_deadline: dateOrNull(
          formData.get("building_inspection_deadline")
        ),
        max_repair_costs: numberOrNull(formData.get("max_repair_costs")),
        bank_guarantee_required: true,
        bank_guarantee_amount: bankGuaranteeAmount,
        bank_guarantee_deadline: dateOrNull(formData.get("bank_guarantee_deadline")),
        registration_required: booleanFromForm(formData.get("registration_required")),
        additional_agreements: stringOrNull(formData.get("additional_agreements")),
      },
      {
        onConflict: "sale_case_id",
      }
    );

  if (updateConditionsError) {
    throw new Error(
      `Ontbindende voorwaarden opslaan mislukt: ${updateConditionsError.message}`
    );
  }

  const sellerCount =
    stringOrNull(formData.get("seller_count")) === "two" ? "two" : "one";

  if (hasSellerFormData(formData, "seller_1")) {
    const { error: sellerOneError } = await supabase
      .from("sale_sellers")
      .upsert(buildSellerPayload(formData, saleCaseId, 1), {
        onConflict: "sale_case_id,seller_order",
      });

    if (sellerOneError) {
      throw new Error(`Verkoper 1 opslaan mislukt: ${sellerOneError.message}`);
    }
  }

  if (sellerCount === "two" && hasSellerFormData(formData, "seller_2")) {
    const { error: sellerTwoError } = await supabase
      .from("sale_sellers")
      .upsert(buildSellerPayload(formData, saleCaseId, 2), {
        onConflict: "sale_case_id,seller_order",
      });

    if (sellerTwoError) {
      throw new Error(`Verkoper 2 opslaan mislukt: ${sellerTwoError.message}`);
    }
  }

  const buyerCount =
    stringOrNull(formData.get("buyer_count")) === "two" ? "two" : "one";

  if (hasBuyerFormData(formData, "buyer_1")) {
    await saveBuyerPayload(
      supabase,
      saleCaseId,
      1,
      buildBuyerPayload(formData, saleCaseId, 1)
    );
  }

  if (buyerCount === "two" && hasBuyerFormData(formData, "buyer_2")) {
    await saveBuyerPayload(
      supabase,
      saleCaseId,
      2,
      buildBuyerPayload(formData, saleCaseId, 2)
    );
  }

  await supabase.from("sale_activity_log").insert({
    sale_case_id: saleCaseId,
    actor_user_id: user.id,
    action: "sale_case_updated",
    metadata: {
      listing_id: listingId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/verkoopdossier/${listingId}`);

  if (redirectAfterSave) {
    redirect(`/dashboard/verkoopdossier/${listingId}?saved=1`);
  }
}

export async function saveSaleCaseForm(formData: FormData): Promise<void> {
  await persistSaleCaseForm(formData, { redirectAfterSave: true });
}

export async function saveSaleCaseDraft(formData: FormData): Promise<void> {
  await persistSaleCaseForm(formData, { redirectAfterSave: false });
}

export async function addMovableItem(formData: FormData): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Niet ingelogd.");
  }

  const saleCaseId = stringOrNull(formData.get("sale_case_id"));

  if (!saleCaseId) {
    throw new Error("Verkoopdossier ontbreekt.");
  }

  const saleCase = await getOwnedSaleCase(supabase, saleCaseId, user.id);
  const category = stringOrNull(formData.get("category"));
  const itemStatus = movableItemStatusFromForm(formData.get("item_status"));
  const itemName = stringOrNull(formData.get("item_name"));

  if (!category || (!itemName && category !== "Overig")) {
    throw new Error("Vul minimaal categorie, status en zaak in.");
  }

  const { data: latestItem, error: latestItemError } = await supabase
    .from("sale_movable_items")
    .select("position")
    .eq("sale_case_id", saleCaseId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestItemError) {
    throw new Error(`Laatste positie ophalen mislukt: ${latestItemError.message}`);
  }

  const { error } = await supabase.from("sale_movable_items").insert({
    sale_case_id: saleCaseId,
    category,
    item_name: itemName ?? "Overig",
    item_status: itemStatus,
    agreed_price:
      itemStatus === "optional" ? numberOrNull(formData.get("agreed_price")) : null,
    notes: stringOrNull(formData.get("notes")),
    position: (latestItem?.position ?? 0) + 1,
  });

  if (error) {
    throw new Error(`Roerende zaak toevoegen mislukt: ${error.message}`);
  }

  await updateMovableGoodsTotal(supabase, saleCaseId, user.id);
  revalidatePath(`/dashboard/verkoopdossier/${saleCase.listing_id}`);
}

export async function updateMovableItem(formData: FormData): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Niet ingelogd.");
  }

  const saleCaseId = stringOrNull(formData.get("sale_case_id"));
  const itemId = stringOrNull(formData.get("item_id"));

  if (!saleCaseId || !itemId) {
    throw new Error("Roerende zaak ontbreekt.");
  }

  const saleCase = await getOwnedSaleCase(supabase, saleCaseId, user.id);
  const category = stringOrNull(formData.get("category"));
  const itemStatus = movableItemStatusFromForm(formData.get("item_status"));
  const itemName = stringOrNull(formData.get("item_name"));

  if (!category || (!itemName && category !== "Overig")) {
    throw new Error("Vul minimaal categorie, status en zaak in.");
  }

  const { error } = await supabase
    .from("sale_movable_items")
    .update({
      category,
      item_name: itemName ?? "Overig",
      item_status: itemStatus,
      agreed_price:
        itemStatus === "optional"
          ? numberOrNull(formData.get("agreed_price"))
          : null,
      notes: stringOrNull(formData.get("notes")),
    })
    .eq("id", itemId)
    .eq("sale_case_id", saleCaseId);

  if (error) {
    throw new Error(`Roerende zaak bijwerken mislukt: ${error.message}`);
  }

  await updateMovableGoodsTotal(supabase, saleCaseId, user.id);
  revalidatePath(`/dashboard/verkoopdossier/${saleCase.listing_id}`);
}

export async function deleteMovableItem(formData: FormData): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Niet ingelogd.");
  }

  const saleCaseId = stringOrNull(formData.get("sale_case_id"));
  const itemId = stringOrNull(formData.get("item_id"));

  if (!saleCaseId || !itemId) {
    throw new Error("Roerende zaak ontbreekt.");
  }

  const saleCase = await getOwnedSaleCase(supabase, saleCaseId, user.id);
  const { error } = await supabase
    .from("sale_movable_items")
    .delete()
    .eq("id", itemId)
    .eq("sale_case_id", saleCaseId);

  if (error) {
    throw new Error(`Roerende zaak verwijderen mislukt: ${error.message}`);
  }

  await updateMovableGoodsTotal(supabase, saleCaseId, user.id);
  revalidatePath(`/dashboard/verkoopdossier/${saleCase.listing_id}`);
}

export async function openSaleCase(listingId: string): Promise<void> {
  await getOrCreateSaleCase(listingId);
  redirect(`/dashboard/verkoopdossier/${listingId}`);
}

export async function generateSaleContract(
  saleCaseId: string,
  partyCounts?: {
    sellerCount?: "one" | "two";
    buyerCount?: "one" | "two";
  }
): Promise<
  | { success: true; publicUrl: string; version: number }
  | {
      success: false;
      type: "validation";
      errors: { field: string; message: string }[];
    }
  | {
      success: false;
      type: "docx_generation";
      message: string;
      technicalMessage: string;
      placeholders?: string[];
    }
  | {
      success: false;
      type: "persistence";
      message: string;
      technicalMessage: string;
      source:
        | "storage.objects"
        | "sale_documents"
        | "sale_activity_log"
        | "sale_cases";
    }
  | { success: false; type: "error"; message: string }
> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Niet ingelogd.");
  }

  const { data: saleCase, error: saleCaseError } = await supabase
    .from("sale_cases")
    .select("*")
    .eq("id", saleCaseId)
    .eq("seller_user_id", user.id)
    .single();

  if (saleCaseError || !saleCase) {
    throw new Error("Verkoopdossier niet gevonden of geen toegang.");
  }

  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("*")
    .eq("id", saleCase.listing_id)
    .eq("user_id", user.id)
    .single();

  if (listingError || !listing) {
    throw new Error("Woning niet gevonden of geen toegang.");
  }

  const { data: saleCondition, error: conditionError } = await supabase
    .from("sale_conditions")
    .select("*")
    .eq("sale_case_id", saleCase.id)
    .maybeSingle();

  if (conditionError) {
    throw new Error(`Voorwaarden ophalen mislukt: ${conditionError.message}`);
  }

  const { data: buyers, error: buyersError } = await supabase
    .from("sale_buyers")
    .select("*")
    .eq("sale_case_id", saleCase.id)
    .order("buyer_order", { ascending: true });

  if (buyersError) {
    throw new Error(`Kopergegevens ophalen mislukt: ${buyersError.message}`);
  }

  const { data: sellers, error: sellersError } = await supabase
    .from("sale_sellers")
    .select("*")
    .eq("sale_case_id", saleCase.id)
    .order("seller_order", { ascending: true });

  if (sellersError) {
    throw new Error(`Verkopergegevens ophalen mislukt: ${sellersError.message}`);
  }

  const validation = validateSaleContractData({
    listing,
    saleCase,
    saleCondition,
    buyers: buyers ?? [],
    sellers: sellers ?? [],
    partyCounts,
  });

  if (validation.errors.length > 0) {
    return {
      success: false,
      type: "validation",
      errors: validation.errors,
    };
  }

  const { data: existingDocuments, error: existingDocumentsError } = await supabase
    .from("sale_documents")
    .select("id, version")
    .eq("sale_case_id", saleCase.id)
    .eq("document_type", SALE_CONTRACT_DOCX_TYPE)
    .order("version", { ascending: false })
    .order("created_at", { ascending: false });

  if (existingDocumentsError) {
    return {
      success: false,
      type: "persistence",
      source: "sale_documents",
      message: "Bestaande documentmetadata ophalen mislukt.",
      technicalMessage: `[sale_documents select] ${existingDocumentsError.message}`,
    };
  }

  const activeDocument = existingDocuments?.[0] ?? null;
  const nextVersion = (activeDocument?.version ?? 0) + 1;
  let generatedContract;

  try {
    generatedContract = await generateSaleContractDocx(saleCase.id, partyCounts);
  } catch (error) {
    if (error instanceof DocxGenerationError) {
      return {
        success: false,
        type: "docx_generation",
        message: "Kon koopovereenkomst niet genereren.",
        technicalMessage: error.technicalMessage,
        placeholders: error.placeholderNames,
      };
    }

    return {
      success: false,
      type: "error",
      message:
        error instanceof Error && error.message !== "Multi error"
          ? error.message
          : "Koopovereenkomst genereren mislukt. Controleer het verkoopdossier en probeer opnieuw.",
    };
  }
  const storagePath = `${user.id}/${saleCase.id}/koopovereenkomst.docx`;

  const { error: uploadError } = await supabase.storage
    .from(SALE_CONTRACTS_BUCKET)
    .upload(storagePath, generatedContract.buffer, {
      contentType: DOCX_CONTENT_TYPE,
      upsert: true,
    });

  if (uploadError) {
    return {
      success: false,
      type: "persistence",
      source: "storage.objects",
      message: "Koopovereenkomst uploaden mislukt.",
      technicalMessage: `[storage.objects upsert] ${uploadError.message}`,
    };
  }

  const { data: publicUrlData } = supabase.storage
    .from(SALE_CONTRACTS_BUCKET)
    .getPublicUrl(storagePath);

  const downloadFileName = buildContractDownloadFileName({
    street: listing.street,
    houseNumber: listing.house_number,
    city: listing.city,
    version: nextVersion,
  });
  const publicUrl = addDownloadFileNameToPublicUrl(
    publicUrlData.publicUrl,
    downloadFileName
  );

  const documentPayload = {
    sale_case_id: saleCase.id,
    document_type: SALE_CONTRACT_DOCX_TYPE,
    version: nextVersion,
    storage_bucket: SALE_CONTRACTS_BUCKET,
    storage_path: storagePath,
    public_url: publicUrl,
    generated_by: user.id,
  } as const;

  const metadataQuery = activeDocument
    ? supabase
        .from("sale_documents")
        .update(documentPayload)
        .eq("id", activeDocument.id)
        .select("id")
        .single()
    : supabase
        .from("sale_documents")
        .insert(documentPayload)
        .select("id")
        .single();

  const { data: savedDocument, error: documentSaveError } =
    await metadataQuery;

  if (documentSaveError || !savedDocument) {
    return {
      success: false,
      type: "persistence",
      source: "sale_documents",
      message: "Documentmetadata opslaan mislukt.",
      technicalMessage: `[sale_documents ${
        activeDocument ? "update" : "insert"
      }] ${
        documentSaveError?.message ?? "geen documentrecord teruggekregen"
      }`,
    };
  }

  const { error: staleDocumentsDeleteError } = await supabase
    .from("sale_documents")
    .delete()
    .eq("sale_case_id", saleCase.id)
    .eq("document_type", SALE_CONTRACT_DOCX_TYPE)
    .neq("id", savedDocument.id);

  if (staleDocumentsDeleteError) {
    return {
      success: false,
      type: "persistence",
      source: "sale_documents",
      message: "Oude documentmetadata opschonen mislukt.",
      technicalMessage: `[sale_documents delete stale] ${staleDocumentsDeleteError.message}`,
    };
  }

  const { error: saleCaseUpdateError } = await supabase
    .from("sale_cases")
    .update({ status: "generated" })
    .eq("id", saleCase.id)
    .eq("seller_user_id", user.id);

  if (saleCaseUpdateError) {
    return {
      success: false,
      type: "persistence",
      source: "sale_cases",
      message: "Verkoopdossierstatus bijwerken mislukt.",
      technicalMessage: `[sale_cases update] ${saleCaseUpdateError.message}`,
    };
  }

  const { error: activityLogError } = await supabase.from("sale_activity_log").insert({
    sale_case_id: saleCase.id,
    actor_user_id: user.id,
    action: "sale_contract_generated",
    metadata: {
      listing_id: saleCase.listing_id,
      document_type: SALE_CONTRACT_DOCX_TYPE,
      version: nextVersion,
      storage_bucket: SALE_CONTRACTS_BUCKET,
      storage_path: storagePath,
    },
  });

  if (activityLogError) {
    return {
      success: false,
      type: "persistence",
      source: "sale_activity_log",
      message: "Activiteitenlog opslaan mislukt.",
      technicalMessage: `[sale_activity_log insert] ${activityLogError.message}`,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/verkoopdossier/${saleCase.listing_id}`);

  return {
    success: true,
    publicUrl,
    version: nextVersion,
  };
}
