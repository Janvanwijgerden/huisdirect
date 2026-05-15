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

export async function generateSaleContractDocx(
  saleCaseId: string
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
    .select(
      "id, title, street, house_number, postal_code, city, asking_price, property_type, living_area, plot_size, year_built"
    )
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const templateType =
    saleCase.template_type === "appartement" ? "appartement" : "woning";

  const templatePath = getTemplatePath(templateType);
  assertTemplateExists(templatePath);

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
    buyers: buyers ?? [],
    sellerName: profile?.full_name ?? user.email ?? null,
    sellerEmail: user.email ?? null,
  });

  doc.render(contractData);

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
}