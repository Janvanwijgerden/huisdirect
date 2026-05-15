import type {
  SaleBuyer,
  SaleCase,
  SaleCondition,
  SaleSeller,
  TransferCostsPaidBy,
} from "../../types/database";

type ListingForContract = {
  id: string;
  title: string | null;
  street: string | null;
  house_number?: string | null;
  postal_code?: string | null;
  city: string | null;
  asking_price: number | null;
  property_type: string | null;
  living_area?: number | null;
  plot_size?: number | null;
  year_built?: number | null;
};

function valueOrDots(value?: string | number | null) {
  if (value === null || value === undefined || value === "") return "........................";
  return String(value);
}

function yesNo(value?: boolean | null) {
  return value ? "Ja" : "Nee";
}

function formatPrice(value?: number | null) {
  if (value === null || value === undefined) return "........................";

  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string | null) {
  if (!value) return "........................";

  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function buildFullAddress(listing: ListingForContract) {
  const streetLine = `${listing.street || ""} ${listing.house_number || ""}`.trim();
  const cityLine = `${listing.postal_code || ""} ${listing.city || ""}`.trim();

  if (!streetLine && !cityLine) return "........................";
  if (!cityLine) return streetLine;
  if (!streetLine) return cityLine;

  return `${streetLine}, ${cityLine}`;
}

function buildBuyerName(buyer?: SaleBuyer | null) {
  if (!buyer) return "........................";

  const name = `${buyer.first_name || ""} ${buyer.last_name || ""}`.trim();
  return name || "........................";
}

function buildBuyerAddress(buyer?: SaleBuyer | null) {
  if (!buyer) return "........................";

  const streetLine = `${buyer.street || ""} ${buyer.house_number || ""}`.trim();
  const cityLine = `${buyer.postal_code || ""} ${buyer.city || ""}`.trim();

  if (!streetLine && !cityLine) return "........................";
  if (!cityLine) return streetLine;
  if (!streetLine) return cityLine;

  return `${streetLine}, ${cityLine}`;
}

function buildSellerName(seller?: SaleSeller | null) {
  if (!seller) return "........................";

  const name = `${seller.first_name || ""} ${seller.last_name || ""}`.trim();
  return name || "........................";
}

function buildSellerAddress(seller?: SaleSeller | null) {
  if (!seller) return "........................";

  const streetLine = `${seller.street || ""} ${seller.house_number || ""}`.trim();
  const cityLine = `${seller.postal_code || ""} ${seller.city || ""}`.trim();

  if (!streetLine && !cityLine) return "........................";
  if (!cityLine) return streetLine;
  if (!streetLine) return cityLine;

  return `${streetLine}, ${cityLine}`;
}

function transferCostsText(value?: TransferCostsPaidBy | null) {
  if (value === "seller") return "kosten voor rekening van verkoper";
  if (value === "custom") return "afwijkende afspraak";
  return "kosten voor rekening van koper";
}

export function buildSaleContractData({
  listing,
  saleCase,
  saleCondition,
  buyers,
  sellers,
  sellerName,
  sellerEmail,
}: {
  listing: ListingForContract;
  saleCase: SaleCase;
  saleCondition: SaleCondition | null;
  buyers: SaleBuyer[];
  sellers?: SaleSeller[];
  sellerName?: string | null;
  sellerEmail?: string | null;
}) {
  const primaryBuyer = buyers[0] || null;
  const primarySeller = sellers?.[0] || null;
  const secondarySeller = sellers?.[1] || null;

  return {
    // Algemeen
    contract_type:
      saleCase.template_type === "appartement"
        ? "Koopovereenkomst appartementsrecht"
        : "Koopovereenkomst woning",

    dossier_status: saleCase.status,
    template_type: saleCase.template_type,

    // Woning
    listing_id: listing.id,
    listing_title: valueOrDots(listing.title),
    property_type: valueOrDots(listing.property_type),
    property_address: buildFullAddress(listing),
    property_street: valueOrDots(listing.street),
    property_house_number: valueOrDots(listing.house_number),
    property_postal_code: valueOrDots(listing.postal_code),
    property_city: valueOrDots(listing.city),
    living_area: listing.living_area ? `${listing.living_area} m²` : "........................",
    plot_size: listing.plot_size ? `${listing.plot_size} m²` : "........................",
    year_built: valueOrDots(listing.year_built),

    // Verkoper
    seller_name: valueOrDots(sellerName),
    seller_email: valueOrDots(sellerEmail),
    seller_1_name: primarySeller
      ? buildSellerName(primarySeller)
      : valueOrDots(sellerName),
    seller_1_first_name: valueOrDots(primarySeller?.first_name),
    seller_1_last_name: valueOrDots(primarySeller?.last_name),
    seller_1_initials: valueOrDots(primarySeller?.initials),
    seller_1_birth_place: valueOrDots(primarySeller?.birth_place),
    seller_1_birth_date: formatDate(primarySeller?.birth_date),
    seller_1_address: buildSellerAddress(primarySeller),
    seller_1_street: valueOrDots(primarySeller?.street),
    seller_1_house_number: valueOrDots(primarySeller?.house_number),
    seller_1_postal_code: valueOrDots(primarySeller?.postal_code),
    seller_1_city: valueOrDots(primarySeller?.city),
    seller_1_email: valueOrDots(primarySeller?.email ?? sellerEmail),
    seller_1_phone: valueOrDots(primarySeller?.phone),
    seller_1_marital_status: valueOrDots(primarySeller?.marital_status),
    seller_1_matrimonial_property_regime: valueOrDots(
      primarySeller?.matrimonial_property_regime
    ),
    seller_1_identification_type: valueOrDots(primarySeller?.identification_type),
    seller_1_identification_number: valueOrDots(
      primarySeller?.identification_number
    ),

    seller_2_name: buildSellerName(secondarySeller),
    seller_2_first_name: valueOrDots(secondarySeller?.first_name),
    seller_2_last_name: valueOrDots(secondarySeller?.last_name),
    seller_2_initials: valueOrDots(secondarySeller?.initials),
    seller_2_birth_place: valueOrDots(secondarySeller?.birth_place),
    seller_2_birth_date: formatDate(secondarySeller?.birth_date),
    seller_2_address: buildSellerAddress(secondarySeller),
    seller_2_street: valueOrDots(secondarySeller?.street),
    seller_2_house_number: valueOrDots(secondarySeller?.house_number),
    seller_2_postal_code: valueOrDots(secondarySeller?.postal_code),
    seller_2_city: valueOrDots(secondarySeller?.city),
    seller_2_email: valueOrDots(secondarySeller?.email),
    seller_2_phone: valueOrDots(secondarySeller?.phone),
    seller_2_marital_status: valueOrDots(secondarySeller?.marital_status),
    seller_2_matrimonial_property_regime: valueOrDots(
      secondarySeller?.matrimonial_property_regime
    ),
    seller_2_identification_type: valueOrDots(
      secondarySeller?.identification_type
    ),
    seller_2_identification_number: valueOrDots(
      secondarySeller?.identification_number
    ),

    // Koper 1
    buyer_1_name: buildBuyerName(primaryBuyer),
    buyer_1_first_name: valueOrDots(primaryBuyer?.first_name),
    buyer_1_last_name: valueOrDots(primaryBuyer?.last_name),
    buyer_1_initials: valueOrDots(primaryBuyer?.initials),
    buyer_1_birth_place: valueOrDots(primaryBuyer?.birth_place),
    buyer_1_birth_date: formatDate(primaryBuyer?.birth_date),
    buyer_1_address: buildBuyerAddress(primaryBuyer),
    buyer_1_street: valueOrDots(primaryBuyer?.street),
    buyer_1_house_number: valueOrDots(primaryBuyer?.house_number),
    buyer_1_postal_code: valueOrDots(primaryBuyer?.postal_code),
    buyer_1_city: valueOrDots(primaryBuyer?.city),
    buyer_1_email: valueOrDots(primaryBuyer?.email),
    buyer_1_phone: valueOrDots(primaryBuyer?.phone),
    buyer_1_marital_status: valueOrDots(primaryBuyer?.marital_status),
    buyer_1_matrimonial_property_regime: valueOrDots(
      primaryBuyer?.matrimonial_property_regime
    ),
    buyer_1_identification_type: valueOrDots(primaryBuyer?.identification_type),
    buyer_1_identification_number: valueOrDots(primaryBuyer?.identification_number),

    // Koopsom / levering
    asking_price: formatPrice(listing.asking_price),
    agreed_price: formatPrice(saleCase.agreed_price),
    movable_goods_value: formatPrice(saleCase.movable_goods_value),
    transfer_costs_paid_by: transferCostsText(saleCase.transfer_costs_paid_by),
    acceptance_date: formatDate(saleCase.acceptance_date),
    transfer_date: formatDate(saleCase.transfer_date),

    // Notaris
    notary_office_name: valueOrDots(saleCase.notary_office_name),
    notary_city: valueOrDots(saleCase.notary_city),
    notary_email: valueOrDots(saleCase.notary_email),
    notary_phone: valueOrDots(saleCase.notary_phone),

    // Ontbindende voorwaarden
    financing_required: yesNo(saleCondition?.financing_required),
    financing_amount: formatPrice(saleCondition?.financing_amount),
    financing_deadline: formatDate(saleCondition?.financing_deadline),
    max_interest_rate:
      saleCondition?.max_interest_rate !== null &&
      saleCondition?.max_interest_rate !== undefined
        ? `${saleCondition.max_interest_rate}%`
        : "........................",
    max_gross_annual_cost: formatPrice(saleCondition?.max_gross_annual_cost),

    nhg_required: yesNo(saleCondition?.nhg_required),
    nhg_deadline: formatDate(saleCondition?.nhg_deadline),

    building_inspection_required: yesNo(saleCondition?.building_inspection_required),
    building_inspection_deadline: formatDate(
      saleCondition?.building_inspection_deadline
    ),
    max_repair_costs: formatPrice(saleCondition?.max_repair_costs),

    bank_guarantee_required: yesNo(saleCondition?.bank_guarantee_required),
    bank_guarantee_amount: formatPrice(saleCondition?.bank_guarantee_amount),
    bank_guarantee_deadline: formatDate(saleCondition?.bank_guarantee_deadline),

    registration_required: yesNo(saleCondition?.registration_required),
    additional_agreements: valueOrDots(saleCondition?.additional_agreements),

    // Overig
    notes: valueOrDots(saleCase.notes),
    generated_date: formatDate(new Date().toISOString()),
  };
}
