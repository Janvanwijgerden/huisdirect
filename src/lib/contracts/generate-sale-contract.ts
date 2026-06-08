import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { createClient } from "../supabase/server";
import { buildSaleContractData } from "./build-sale-contract-data";

type GeneratedSaleContract = {
  fileName: string;
  buffer: Buffer;
  templateType: "woning" | "appartement";
};

export class DocxGenerationError extends Error {
  technicalMessage: string;
  placeholderNames: string[];

  constructor(technicalMessage: string, placeholderNames: string[] = []) {
    super("Kon koopovereenkomst niet genereren.");
    this.name = "DocxGenerationError";
    this.technicalMessage = technicalMessage;
    this.placeholderNames = placeholderNames;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function collectPlaceholderNames(text: string) {
  return Array.from(text.matchAll(/\{[#/^]?[a-zA-Z0-9_.-]+\}/g)).map(
    (match) => match[0]
  );
}

function normalizeDocxGenerationError(error: unknown) {
  const message =
    error instanceof Error ? error.message : String(error || "Onbekende fout");
  const technicalParts = [`Templatefout: ${message}`];
  const placeholders = new Set<string>(collectPlaceholderNames(message));

  const properties = isRecord(error) ? error.properties : null;
  const nestedErrors =
    isRecord(properties) && Array.isArray(properties.errors)
      ? properties.errors
      : [];

  nestedErrors.forEach((nestedError) => {
    const nestedRecord = isRecord(nestedError) ? nestedError : {};
    const nestedProperties = isRecord(nestedRecord.properties)
      ? nestedRecord.properties
      : {};

    const nestedMessage =
      stringValue(nestedRecord.message) ||
      stringValue(nestedProperties.explanation) ||
      stringValue(nestedProperties.id) ||
      "Onbekende templatefout";

    const placeholder =
      stringValue(nestedProperties.xtag) ||
      stringValue(nestedProperties.tag) ||
      stringValue(nestedProperties.value);

    if (placeholder) {
      placeholders.add(placeholder.startsWith("{") ? placeholder : `{${placeholder}}`);
    }

    collectPlaceholderNames(nestedMessage).forEach((name) =>
      placeholders.add(name)
    );

    technicalParts.push(
      placeholder ? `- ${nestedMessage} (${placeholder})` : `- ${nestedMessage}`
    );
  });

  const placeholderList = Array.from(placeholders);

  if (placeholderList.length > 0) {
    technicalParts.push(
      `Betrokken placeholder(s): ${placeholderList.join(", ")}`
    );
  }

  return new DocxGenerationError(
    technicalParts.join("\n"),
    placeholderList
  );
}

function slugifyFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 80);
}

function getTemplateFileName(templateType: "woning" | "appartement") {
  if (templateType === "appartement") {
    return "koopovereenkomst-appartement.docx";
  }

  return "koopovereenkomst-woning.docx";
}

function getTemplatePath(templateType: "woning" | "appartement") {
  return path.join(
    process.cwd(),
    "src",
    "templates",
    "contracts",
    getTemplateFileName(templateType)
  );
}

function assertTemplateExists(templatePath: string) {
  if (!fs.existsSync(templatePath)) {
    throw new Error(
      `Templatebestand niet gevonden: ${templatePath}. Controleer of het bestand in src/templates/contracts staat.`
    );
  }
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function replaceCoreProperty(xml: string, tagName: string, value: string) {
  const escapedValue = escapeXml(value);
  const tagPattern = new RegExp(
    `<${tagName}([^>]*)>[\\s\\S]*?<\\/${tagName}>`
  );

  if (tagPattern.test(xml)) {
    return xml.replace(tagPattern, `<${tagName}$1>${escapedValue}</${tagName}>`);
  }

  return xml.replace("</cp:coreProperties>", `<${tagName}>${escapedValue}</${tagName}></cp:coreProperties>`);
}

function setDocxCoreProperties(zip: PizZip, templateType: "woning" | "appartement") {
  const corePath = "docProps/core.xml";
  const coreFile = zip.file(corePath);

  if (!coreFile) return;

  let xml = coreFile.asText();
  const title =
    templateType === "appartement"
      ? "Koopovereenkomst appartement"
      : "Koopovereenkomst woning";

  xml = replaceCoreProperty(xml, "dc:title", title);
  xml = replaceCoreProperty(xml, "dc:subject", "Concept koopovereenkomst HuisDirect");
  xml = replaceCoreProperty(xml, "dc:creator", "HuisDirect");
  xml = replaceCoreProperty(
    xml,
    "dc:description",
    "Automatisch gegenereerde conceptkoopovereenkomst"
  );

  zip.file(corePath, xml);
}

export async function generateSaleContractDocx(
  saleCaseId: string,
  partyCounts?: {
    sellerCount?: "one" | "two";
    buyerCount?: "one" | "two";
  }
): Promise<GeneratedSaleContract> {
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

  const { data: movableItems, error: movableItemsError } = await supabase
    .from("sale_movable_items")
    .select("*")
    .eq("sale_case_id", saleCase.id)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (movableItemsError) {
    throw new Error(
      `Roerende zaken ophalen mislukt: ${movableItemsError.message}`
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const templateType =
    saleCase.template_type === "appartement" ? "appartement" : "woning";

  const templatePath = getTemplatePath(templateType);
  assertTemplateExists(templatePath);

  try {
    const templateBinary = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(templateBinary);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      nullGetter() {
        return "........................";
      },
    });

    const contractData = buildSaleContractData({
      listing: listing as any,
      saleCase,
      saleCondition,
      buyers:
        partyCounts?.buyerCount === "one" ? (buyers ?? []).slice(0, 1) : buyers ?? [],
      sellers:
        partyCounts?.sellerCount === "one"
          ? (sellers ?? []).slice(0, 1)
          : sellers ?? [],
      movableItems: movableItems ?? [],
      sellerName: profile?.full_name ?? user.email ?? null,
      sellerEmail: user.email ?? null,
    });

    doc.render(contractData);

    setDocxCoreProperties(doc.getZip(), templateType);

    const buffer = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    const addressPart = slugifyFileName(
      `${listing.street || "woning"}_${listing.house_number || ""}_${listing.city || ""}`
    );

    const datePart = new Date().toISOString().slice(0, 10);

    const fileName = `HuisDirect_Koopovereenkomst_${addressPart}_${datePart}.docx`;

    return {
      fileName,
      buffer,
      templateType,
    };
  } catch (error) {
    throw normalizeDocxGenerationError(error);
  }
}
