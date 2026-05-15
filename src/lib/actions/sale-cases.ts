"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { generateSaleContractDocx } from "../contracts/generate-sale-contract";
import type { SaleCase, SaleCondition, SaleTemplateType } from "../../types/database";

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

function sanitizeStorageFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
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

export async function saveSaleCaseForm(formData: FormData): Promise<void> {
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
    .select("id, listing_id, seller_user_id")
    .eq("id", saleCaseId)
    .eq("listing_id", listingId)
    .eq("seller_user_id", user.id)
    .single();

  if (saleCaseError || !saleCase) {
    throw new Error("Verkoopdossier niet gevonden of geen toegang.");
  }

  const agreedPrice = numberOrNull(formData.get("agreed_price"));
  const movableGoodsValue = numberOrNull(formData.get("movable_goods_value"));

  const { error: updateSaleCaseError } = await supabase
    .from("sale_cases")
    .update({
      agreed_price: agreedPrice,
      movable_goods_value: movableGoodsValue ?? 0,
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
        bank_guarantee_required: booleanFromForm(
          formData.get("bank_guarantee_required")
        ),
        bank_guarantee_amount: numberOrNull(formData.get("bank_guarantee_amount")),
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

  await supabase.from("sale_buyers").delete().eq("sale_case_id", saleCaseId);

  const buyerOneFirstName = stringOrNull(formData.get("buyer_1_first_name"));
  const buyerOneLastName = stringOrNull(formData.get("buyer_1_last_name"));

  if (buyerOneFirstName || buyerOneLastName) {
    const { error: buyerError } = await supabase.from("sale_buyers").insert({
      sale_case_id: saleCaseId,
      buyer_order: 1,
      first_name: buyerOneFirstName,
      last_name: buyerOneLastName,
      initials: stringOrNull(formData.get("buyer_1_initials")),
      birth_place: stringOrNull(formData.get("buyer_1_birth_place")),
      birth_date: dateOrNull(formData.get("buyer_1_birth_date")),
      street: stringOrNull(formData.get("buyer_1_street")),
      house_number: stringOrNull(formData.get("buyer_1_house_number")),
      postal_code: stringOrNull(formData.get("buyer_1_postal_code")),
      city: stringOrNull(formData.get("buyer_1_city")),
      email: stringOrNull(formData.get("buyer_1_email")),
      phone: stringOrNull(formData.get("buyer_1_phone")),
      marital_status: stringOrNull(formData.get("buyer_1_marital_status")) as any,
      matrimonial_property_regime: stringOrNull(
        formData.get("buyer_1_matrimonial_property_regime")
      ) as any,
      identification_type: stringOrNull(formData.get("buyer_1_identification_type")),
      identification_number: stringOrNull(
        formData.get("buyer_1_identification_number")
      ),
    });

    if (buyerError) {
      throw new Error(`Koper opslaan mislukt: ${buyerError.message}`);
    }
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

  redirect(`/dashboard/verkoopdossier/${listingId}?saved=1`);
}

export async function openSaleCase(listingId: string): Promise<void> {
  await getOrCreateSaleCase(listingId);
  redirect(`/dashboard/verkoopdossier/${listingId}`);
}

export async function generateSaleContract(
  saleCaseId: string
): Promise<{ publicUrl: string; version: number }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Niet ingelogd.");
  }

  const { data: saleCase, error: saleCaseError } = await supabase
    .from("sale_cases")
    .select("id, listing_id, seller_user_id")
    .eq("id", saleCaseId)
    .eq("seller_user_id", user.id)
    .single();

  if (saleCaseError || !saleCase) {
    throw new Error("Verkoopdossier niet gevonden of geen toegang.");
  }

  const { data: latestDocument, error: latestDocumentError } = await supabase
    .from("sale_documents")
    .select("version")
    .eq("sale_case_id", saleCase.id)
    .eq("document_type", SALE_CONTRACT_DOCX_TYPE)
    .order("version", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestDocumentError) {
    throw new Error(
      `Laatste documentversie ophalen mislukt: ${latestDocumentError.message}`
    );
  }

  const nextVersion = (latestDocument?.version ?? 0) + 1;
  const generatedContract = await generateSaleContractDocx(saleCase.id);
  const storageFileName = sanitizeStorageFileName(generatedContract.fileName);
  const storagePath = `${user.id}/${saleCase.id}/v${nextVersion}-${Date.now()}-${storageFileName}`;

  const { error: uploadError } = await supabase.storage
    .from(SALE_CONTRACTS_BUCKET)
    .upload(storagePath, generatedContract.buffer, {
      contentType: DOCX_CONTENT_TYPE,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Koopovereenkomst uploaden mislukt: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(SALE_CONTRACTS_BUCKET)
    .getPublicUrl(storagePath);

  const publicUrl = publicUrlData.publicUrl;

  const { error: documentInsertError } = await supabase
    .from("sale_documents")
    .insert({
      sale_case_id: saleCase.id,
      document_type: SALE_CONTRACT_DOCX_TYPE,
      version: nextVersion,
      storage_bucket: SALE_CONTRACTS_BUCKET,
      storage_path: storagePath,
      public_url: publicUrl,
      generated_by: user.id,
    });

  if (documentInsertError) {
    await supabase.storage.from(SALE_CONTRACTS_BUCKET).remove([storagePath]);
    throw new Error(
      `Documentmetadata opslaan mislukt: ${documentInsertError.message}`
    );
  }

  const { error: saleCaseUpdateError } = await supabase
    .from("sale_cases")
    .update({ status: "generated" })
    .eq("id", saleCase.id)
    .eq("seller_user_id", user.id);

  if (saleCaseUpdateError) {
    throw new Error(
      `Verkoopdossierstatus bijwerken mislukt: ${saleCaseUpdateError.message}`
    );
  }

  await supabase.from("sale_activity_log").insert({
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

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/verkoopdossier/${saleCase.listing_id}`);

  return {
    publicUrl,
    version: nextVersion,
  };
}
