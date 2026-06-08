import type {
  SaleBuyer,
  SaleCase,
  SaleCondition,
  SaleMovableItem,
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
  build_year?: number | null;
  year_built?: number | null;
  cadastral_description?: string | null;
  is_leasehold?: boolean | null;
  leasehold_details?: string | null;
  apartment_index_number?: string | null;
  apartment_complex_name?: string | null;
  vve_name?: string | null;
  monthly_service_costs?: number | null;
  reserve_fund?: number | string | null;
  mjop_available?: boolean | null;
  features?: Record<string, unknown> | null;
};

const DOTS = "........................";
const UNKNOWN = "Onbekend";
const TO_BE_SPECIFIED = "nader op te geven";
const TO_BE_DESCRIBED = "nader te omschrijven";
const TO_BE_AGREED = "nader overeen te komen";

function valueOrDots(value?: string | number | null) {
  if (value === null || value === undefined || value === "") return DOTS;
  return String(value);
}

function valueOrUnknown(value?: string | number | null) {
  if (value === null || value === undefined || value === "") return UNKNOWN;
  return String(value);
}

function valueOrToBeDescribed(value?: string | number | null) {
  if (value === null || value === undefined || value === "") {
    return TO_BE_DESCRIBED;
  }

  return String(value);
}

function valueOrToBeSpecified(value?: string | number | null) {
  if (value === null || value === undefined || value === "") {
    return TO_BE_SPECIFIED;
  }

  return String(value);
}

function valueOrDefault(value: unknown, fallback: string) {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

function yesNo(value?: boolean | null) {
  return value ? "Ja" : "Nee";
}

function recordValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function apartmentContractFeatures(listing: ListingForContract) {
  return recordValue(recordValue(listing.features).apartment_contract);
}

function vveFeatures(listing: ListingForContract) {
  return recordValue(recordValue(listing.features).vve);
}

function leaseholdFeatures(listing: ListingForContract) {
  return recordValue(recordValue(listing.features).leasehold);
}

function cadastreFeatures(listing: ListingForContract) {
  return recordValue(recordValue(listing.features).cadastre);
}

function apartmentStringValue(
  listing: ListingForContract,
  key: string,
  fallbackKey?: string
) {
  const contractValue = apartmentContractFeatures(listing)[key];
  const fallbackValue = fallbackKey ? vveFeatures(listing)[fallbackKey] : null;
  const value = contractValue ?? fallbackValue;

  if (value === null || value === undefined || value === "") return null;
  return String(value);
}

function cadastreStringValue(listing: ListingForContract, key: string) {
  const value = cadastreFeatures(listing)[key];

  if (value === null || value === undefined || value === "") return null;
  return String(value);
}

function cadastreNumberValue(listing: ListingForContract, key: string) {
  const value = cadastreStringValue(listing, key);
  if (!value) return null;

  const number = Number(value.replace(/[^\d.,-]/g, "").replace(",", "."));
  return Number.isFinite(number) ? number : null;
}

function buildCadastreDescription(listing: ListingForContract) {
  const explicitDescription = cadastreStringValue(
    listing,
    "cadastral_description"
  );
  if (explicitDescription) return explicitDescription;

  const municipality = cadastreStringValue(
    listing,
    "cadastral_municipality"
  );
  const section = cadastreStringValue(listing, "cadastral_section");
  const number =
    cadastreStringValue(listing, "cadastral_number") ??
    cadastreStringValue(listing, "parcel_id");
  const parts: string[] = [];

  if (municipality) parts.push(`gemeente ${municipality}`);
  if (section) parts.push(`sectie ${section}`);
  if (number) parts.push(`nummer ${number}`);

  return parts.length ? `kadastraal bekend ${parts.join(", ")}` : null;
}

function leaseholdStringValue(listing: ListingForContract, key: string) {
  const leaseholdValue = leaseholdFeatures(listing)[key];
  const apartmentValue = apartmentContractFeatures(listing)[key];
  const value = leaseholdValue ?? apartmentValue;

  if (value === null || value === undefined || value === "") return null;
  return String(value);
}

function apartmentNumberValue(
  listing: ListingForContract,
  key: string,
  fallbackKey?: string
) {
  const value = apartmentStringValue(listing, key, fallbackKey);
  if (!value) return null;

  const number = Number(value.replace(",", "."));
  return Number.isFinite(number) ? number : null;
}

function apartmentBooleanValue(
  listing: ListingForContract,
  key: string,
  fallbackKey?: string
) {
  const contractValue = apartmentContractFeatures(listing)[key];
  const fallbackValue = fallbackKey ? vveFeatures(listing)[fallbackKey] : null;
  const value = contractValue ?? fallbackValue;

  return typeof value === "boolean" ? value : null;
}

function apartmentValueOrDefault(
  listing: ListingForContract,
  key: string,
  fallback: string,
  fallbackKey?: string
) {
  return apartmentStringValue(listing, key, fallbackKey) ?? fallback;
}

function apartmentDateOrDefault(
  listing: ListingForContract,
  key: string,
  fallback: string
) {
  const value = apartmentStringValue(listing, key);
  if (!value) return fallback;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : formatDate(value);
}

function leaseholdValueOrDefault(
  listing: ListingForContract,
  key: string,
  fallback: string
) {
  return leaseholdStringValue(listing, key) ?? fallback;
}

function leaseholdDateOrDefault(
  listing: ListingForContract,
  key: string,
  fallback: string
) {
  const value = leaseholdStringValue(listing, key);
  if (!value) return fallback;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : formatDate(value);
}

function formatAmount(value?: number | null) {
  if (value === null || value === undefined) return DOTS;

  return new Intl.NumberFormat("nl-NL", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string | null) {
  if (!value) return DOTS;

  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatPostalCode(value?: string | null) {
  if (!value) return "";

  const normalized = value.replace(/\s+/g, "").toUpperCase();
  const match = normalized.match(/^([1-9][0-9]{3})([A-Z]{2})$/);

  if (!match) return value.trim().toUpperCase();

  return `${match[1]} ${match[2]}`;
}

function normalizeAddressValue(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function buildFullAddress(listing: ListingForContract) {
  const streetLine = `${listing.street || ""} ${listing.house_number || ""}`.trim();
  const cityLine = `${formatPostalCode(listing.postal_code)} ${
    listing.city || ""
  }`.trim();
  const normalizedStreetLine = normalizeAddressValue(streetLine);
  const normalizedCityLine = normalizeAddressValue(cityLine);
  const normalizedPostalCode = normalizeAddressValue(
    formatPostalCode(listing.postal_code)
  );
  const normalizedCity = normalizeAddressValue(listing.city || "");

  if (!streetLine && !cityLine) return DOTS;
  if (!cityLine) return streetLine;
  if (!streetLine) return cityLine;
  if (normalizedCityLine && normalizedStreetLine.includes(normalizedCityLine)) {
    return streetLine;
  }
  if (
    normalizedPostalCode &&
    normalizedCity &&
    normalizedStreetLine.includes(normalizedPostalCode) &&
    normalizedStreetLine.includes(normalizedCity)
  ) {
    return streetLine;
  }

  return `${streetLine}, ${cityLine}`;
}

function buildPersonName(person?: SaleBuyer | SaleSeller | null) {
  if (!person) return DOTS;

  const name = `${person.first_name || ""} ${person.last_name || ""}`.trim();
  return name || DOTS;
}

function buildPersonAddress(person?: SaleBuyer | SaleSeller | null) {
  if (!person) return DOTS;

  const streetLine = `${person.street || ""} ${person.house_number || ""}`.trim();
  const cityLine = `${formatPostalCode(person.postal_code)} ${
    person.city || ""
  }`.trim();

  if (!streetLine && !cityLine) return DOTS;
  if (!cityLine) return streetLine;
  if (!streetLine) return cityLine;

  return `${streetLine}, ${cityLine}`;
}

function transferCostsText(value?: TransferCostsPaidBy | null) {
  if (value === "seller") return "verkoper";
  if (value === "custom") return "ieder voor de helft";
  return "koper";
}

function calculateTenPercent(value?: number | null) {
  return value ? Math.round(value * 0.1) : null;
}

function maritalStatusLabel(value?: SaleBuyer["marital_status"] | null) {
  if (value === "ongehuwd") return "Ongehuwd";
  if (value === "gehuwd") return "Gehuwd";
  if (value === "geregistreerd_partnerschap") {
    return "Geregistreerd partnerschap";
  }
  if (value === "gescheiden") return "Gescheiden";
  if (value === "weduwe_weduwnaar") return "Weduwe/weduwnaar";
  return DOTS;
}

function propertyRegimeLabel(
  value?: SaleBuyer["matrimonial_property_regime"] | null
) {
  const regime = value ? String(value) : "";

  if (regime === "gemeenschap_van_goederen") return "gemeenschap van goederen";
  if (regime === "beperkte_gemeenschap_van_goederen") {
    return "beperkte gemeenschap van goederen";
  }
  if (regime === "huwelijkse_voorwaarden") return "huwelijkse voorwaarden";
  if (regime === "koude_uitsluiting") return "koude uitsluiting";
  if (regime === "niet_van_toepassing") return "niet van toepassing";
  return DOTS;
}

function numericValue(value?: number | null, fallback = DOTS) {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function movableStatusLabel(value: SaleMovableItem["item_status"]) {
  if (value === "included") return "Blijft achter zonder vergoeding";
  if (value === "optional") return "Ter overname";
  if (value === "excluded") return "Wordt meegenomen";
  return "Niet aanwezig";
}

function amountToDutchWords(value?: number | null) {
  if (value === null || value === undefined) return DOTS;
  if (value === 0) return "nul euro";

  const belowTwenty = [
    "",
    "een",
    "twee",
    "drie",
    "vier",
    "vijf",
    "zes",
    "zeven",
    "acht",
    "negen",
    "tien",
    "elf",
    "twaalf",
    "dertien",
    "veertien",
    "vijftien",
    "zestien",
    "zeventien",
    "achttien",
    "negentien",
  ];
  const tens: Record<number, string> = {
    20: "twintig",
    30: "dertig",
    40: "veertig",
    50: "vijftig",
    60: "zestig",
    70: "zeventig",
    80: "tachtig",
    90: "negentig",
  };

  function belowThousand(number: number): string {
    if (number < 20) return belowTwenty[number];
    if (number < 100) {
      const ten = Math.floor(number / 10) * 10;
      const unit = number % 10;
      const unitWord = unit === 2 ? "tweeën" : `${belowTwenty[unit]}en`;
      return unit ? `${unitWord}${tens[ten]}` : tens[ten];
    }

    const hundred = Math.floor(number / 100);
    const remainder = number % 100;
    const prefix = hundred === 1 ? "honderd" : `${belowTwenty[hundred]}honderd`;
    return remainder ? `${prefix}${belowThousand(remainder)}` : prefix;
  }

  function words(number: number): string {
    if (number < 1000) return belowThousand(number);
    if (number < 1000000) {
      const thousands = Math.floor(number / 1000);
      const remainder = number % 1000;
      const prefix =
        thousands === 1 ? "duizend" : `${belowThousand(thousands)}duizend`;
      return remainder ? `${prefix} ${belowThousand(remainder)}` : prefix;
    }

    return formatAmount(number);
  }

  return `${words(Math.round(value))} euro`;
}

function hasText(value?: string | null) {
  return Boolean(value && value.trim().length > 0);
}

function hasPersonData(person?: SaleBuyer | SaleSeller | null) {
  if (!person) return false;

  return [
    person.first_name,
    person.last_name,
    person.initials,
    person.birth_place,
    person.birth_date,
    person.street,
    person.house_number,
    person.postal_code,
    person.city,
    person.email,
    person.phone,
    person.identification_type,
    person.identification_number,
  ].some((value) => hasText(value));
}

function mapMovableItems(items: SaleMovableItem[]) {
  return items
    .filter((item) => item.item_status !== "not_present")
    .map((item) => ({
      category: valueOrDots(item.category),
      item_name: valueOrDots(item.item_name),
      status: movableStatusLabel(item.item_status),
      price:
        item.item_status === "optional"
          ? formatAmount(item.agreed_price)
          : "",
      note: hasText(item.notes) ? item.notes!.trim() : "",
    }));
}

export function buildSaleContractData({
  listing,
  saleCase,
  saleCondition,
  buyers,
  sellers,
  movableItems = [],
  sellerName,
  sellerEmail,
  isPreview = false,
}: {
  listing: ListingForContract;
  saleCase: SaleCase;
  saleCondition: SaleCondition | null;
  buyers: SaleBuyer[];
  sellers?: SaleSeller[];
  movableItems?: SaleMovableItem[];
  sellerName?: string | null;
  sellerEmail?: string | null;
  isPreview?: boolean;
}) {
  const primaryBuyer = buyers[0] || null;
  const secondaryBuyer = buyers[1] || null;
  const primarySeller = sellers?.[0] || null;
  const secondarySeller = sellers?.[1] || null;
  const mappedMovableItems = mapMovableItems(movableItems);

  const agreedPrice = saleCase.agreed_price ?? listing.asking_price;
  const buildYear = listing.build_year ?? listing.year_built;
  const movableGoodsValue = saleCase.movable_goods_value;
  const penaltyAmount = calculateTenPercent(agreedPrice);
  const bankGuaranteeAmount = calculateTenPercent(agreedPrice);
  const hasFinancingReservation = Boolean(saleCondition?.financing_required);
  const hasNhgReservation = Boolean(saleCondition?.nhg_required);
  const hasInspectionReservation = Boolean(
    saleCondition?.building_inspection_required
  );
  const transferCostsPaidBy = saleCase.transfer_costs_paid_by ?? "buyer";
  const documentTypeLabel =
    saleCase.template_type === "appartement"
      ? "Koopovereenkomst appartement"
      : "Koopovereenkomst woning";
  const hasFinancingInterestRate =
    saleCondition?.max_interest_rate !== null &&
    saleCondition?.max_interest_rate !== undefined;
  const hasFinancingMaxAnnualCost =
    saleCondition?.max_gross_annual_cost !== null &&
    saleCondition?.max_gross_annual_cost !== undefined;
  const apartmentIndexNumber =
    listing.apartment_index_number ??
    apartmentStringValue(listing, "apartment_index_number");
  const apartmentComplexName =
    listing.apartment_complex_name ??
    apartmentStringValue(listing, "apartment_complex_name");
  const vveName =
    listing.vve_name ??
    apartmentStringValue(listing, "vve_name", "name") ??
    "Vereniging van Eigenaars";
  const monthlyServiceCosts =
    listing.monthly_service_costs ??
    apartmentNumberValue(listing, "monthly_service_costs", "monthlyCosts");
  const reserveFund =
    listing.reserve_fund ??
    apartmentNumberValue(listing, "reserve_fund", "reserveFund") ??
    apartmentStringValue(listing, "reserve_fund", "reserveFund");
  const mjopAvailable =
    listing.mjop_available ??
    apartmentBooleanValue(listing, "mjop_available", "hasMjop");
  const leasehold = leaseholdFeatures(listing);
  const isLeasehold =
    listing.is_leasehold === true || leasehold.is_leasehold === true;
  const leaseholdDetails =
    listing.leasehold_details ?? leaseholdStringValue(listing, "erfpacht_conditions");
  const cadastreDescription =
    listing.cadastral_description ?? buildCadastreDescription(listing);
  const cadastrePlotSize = cadastreNumberValue(listing, "plot_size");
  const plotSize = listing.plot_size ?? cadastrePlotSize;
  const apartmentRightDescription =
    apartmentStringValue(listing, "apartment_right_description") ??
    apartmentComplexName ??
    "het appartementsrecht";
  const apartmentCadastralSection =
    apartmentStringValue(listing, "apartment_cadastral_section") ??
    cadastreStringValue(listing, "cadastral_section") ??
    UNKNOWN;
  const apartmentCadastralNumber =
    apartmentStringValue(listing, "apartment_cadastral_number") ??
    cadastreStringValue(listing, "cadastral_number") ??
    apartmentIndexNumber ??
    cadastreStringValue(listing, "parcel_id") ??
    UNKNOWN;
  const apartmentShare = apartmentValueOrDefault(
    listing,
    "apartment_share",
    UNKNOWN
  );
  const buildingCadastralDescription =
    apartmentStringValue(listing, "building_cadastral_description") ??
    cadastreDescription ??
    UNKNOWN;
  const buildingPlotSize =
    apartmentStringValue(listing, "building_plot_size") ??
    (plotSize !== null && plotSize !== undefined
      ? String(plotSize)
      : UNKNOWN);
  const splitDeedDate = apartmentDateOrDefault(
    listing,
    "split_deed_date",
    UNKNOWN
  );
  const vveMonthlyContribution =
    apartmentStringValue(listing, "vve_monthly_contribution") ??
    apartmentStringValue(listing, "monthly_service_costs", "monthlyCosts") ??
    UNKNOWN;
  const vveReserveFund =
    apartmentStringValue(listing, "vve_reserve_fund") ??
    apartmentStringValue(listing, "reserve_fund", "reserveFund") ??
    UNKNOWN;
  const vveReserveFundDate = apartmentDateOrDefault(
    listing,
    "vve_reserve_fund_date",
    UNKNOWN
  );

  return {
    // Algemeen
    contract_type:
      saleCase.template_type === "appartement"
        ? "Koopovereenkomst appartementsrecht"
        : "Koopovereenkomst woning",
    is_preview: isPreview,
    document_footer_title: isPreview
      ? "HuisDirect concept koopovereenkomst"
      : `${documentTypeLabel} – HuisDirect`,
    status: saleCase.status,
    dossier_status: saleCase.status,
    template_type: saleCase.template_type,
    generated_date: formatDate(new Date().toISOString()),

    // Woning
    listing_id: listing.id,
    listing_title: valueOrDots(listing.title),
    property_type: valueOrDots(listing.property_type),
    property_address: valueOrDots(
  `${listing.street || ""} ${listing.house_number || ""}`.trim()
),  property_full_address: buildFullAddress(listing),
    property_street: valueOrDots(listing.street),
    property_house_number: valueOrDots(listing.house_number),
    property_postal_code: valueOrDots(formatPostalCode(listing.postal_code)),
    property_city: valueOrDots(listing.city),
    cadastral_description: valueOrUnknown(cadastreDescription),
    kadastral_description: valueOrUnknown(cadastreDescription),
    living_area: numericValue(listing.living_area),
    plot_size: numericValue(plotSize, UNKNOWN),
    build_year: valueOrDots(buildYear),
    year_built: valueOrDots(buildYear),
    is_leasehold: isLeasehold,
    leasehold_details: valueOrUnknown(leaseholdDetails),

    // Appartement / VvE
    apartment_index_number: valueOrUnknown(apartmentIndexNumber),
    apartment_complex_name: valueOrUnknown(apartmentComplexName),
    apartment_right_description: apartmentRightDescription,
    apartment_cadastral_section: apartmentCadastralSection,
    apartment_cadastral_number: apartmentCadastralNumber,
    apartment_share: apartmentShare,
    building_cadastral_description: buildingCadastralDescription,
    building_plot_size: buildingPlotSize,
    split_deed_date: splitDeedDate,
    vve_name: valueOrUnknown(vveName),
    monthly_service_costs:
      typeof monthlyServiceCosts === "number"
        ? formatAmount(monthlyServiceCosts)
        : UNKNOWN,
    reserve_fund:
      typeof reserveFund === "number"
        ? formatAmount(reserveFund)
        : valueOrUnknown(reserveFund),
    mjop_available_label:
      mjopAvailable === null || mjopAvailable === undefined
        ? UNKNOWN
        : yesNo(mjopAvailable),
    vve_monthly_contribution: vveMonthlyContribution,
    vve_reserve_fund: vveReserveFund,
    vve_reserve_fund_date: vveReserveFundDate,
    vve_pending_decisions: apartmentValueOrDefault(
      listing,
      "vve_pending_decisions",
      "niets bekend"
    ),
    vve_voting_rights_start_date: apartmentDateOrDefault(
      listing,
      "vve_voting_rights_start_date",
      TO_BE_AGREED
    ),
    vve_consent_deadline: apartmentDateOrDefault(
      listing,
      "vve_consent_deadline",
      TO_BE_AGREED
    ),

    // Erfpacht
    erfpacht_owner_name: leaseholdValueOrDefault(
      listing,
      "erfpacht_owner_name",
      UNKNOWN
    ),
    erfpacht_conditions: leaseholdValueOrDefault(
      listing,
      "erfpacht_conditions",
      UNKNOWN
    ),
    erfpacht_end_date: leaseholdDateOrDefault(
      listing,
      "erfpacht_end_date",
      UNKNOWN
    ),
    erfpacht_revision_date: leaseholdDateOrDefault(
      listing,
      "erfpacht_revision_date",
      UNKNOWN
    ),
    erfpacht_canon_prepaid_until: leaseholdDateOrDefault(
      listing,
      "erfpacht_canon_prepaid_until",
      UNKNOWN
    ),
    erfpacht_canon_amount: leaseholdValueOrDefault(
      listing,
      "erfpacht_canon_amount",
      UNKNOWN
    ),
    erfpacht_canon_period: leaseholdValueOrDefault(
      listing,
      "erfpacht_canon_period",
      "periode"
    ),
    erfpacht_canon_adjustment_date: leaseholdDateOrDefault(
      listing,
      "erfpacht_canon_adjustment_date",
      UNKNOWN
    ),
    erfpacht_canon_indexation_date: leaseholdDateOrDefault(
      listing,
      "erfpacht_canon_indexation_date",
      UNKNOWN
    ),

    // Verkoper
    seller_name: valueOrDots(sellerName),
    seller_email: valueOrDots(sellerEmail),
    seller_1_name: primarySeller
      ? buildPersonName(primarySeller)
      : valueOrDots(sellerName),
    seller_1_full_name: primarySeller
      ? buildPersonName(primarySeller)
      : valueOrDots(sellerName),
    seller_1_first_name: valueOrDots(primarySeller?.first_name),
    seller_1_last_name: valueOrDots(primarySeller?.last_name),
    seller_1_initials: valueOrDots(primarySeller?.initials),
    seller_1_birth_place: valueOrDots(primarySeller?.birth_place),
    seller_1_birth_date: formatDate(primarySeller?.birth_date),
    seller_1_address: buildPersonAddress(primarySeller),
    seller_1_street: valueOrDots(primarySeller?.street),
    seller_1_house_number: valueOrDots(primarySeller?.house_number),
    seller_1_postal_code: valueOrDots(formatPostalCode(primarySeller?.postal_code)),
    seller_1_city: valueOrDots(primarySeller?.city),
    seller_1_email: valueOrDots(primarySeller?.email ?? sellerEmail),
    seller_1_phone: valueOrDots(primarySeller?.phone),
    seller_1_marital_status: valueOrDots(primarySeller?.marital_status),
    seller_1_marital_status_label: maritalStatusLabel(
      primarySeller?.marital_status
    ),
    seller_1_matrimonial_property_regime: propertyRegimeLabel(
      primarySeller?.matrimonial_property_regime
    ),
    seller_1_matrimonial_property_regime_label: propertyRegimeLabel(
      primarySeller?.matrimonial_property_regime
    ),
    seller_1_identification_type: valueOrDots(primarySeller?.identification_type),
    seller_1_identification_number: valueOrDots(
      primarySeller?.identification_number
    ),
    seller_1_id_type: valueOrDots(primarySeller?.identification_type),
    seller_1_id_number: valueOrDots(primarySeller?.identification_number),

    seller_2_name: buildPersonName(secondarySeller),
    seller_2_full_name: buildPersonName(secondarySeller),
    seller_2_first_name: valueOrDots(secondarySeller?.first_name),
    seller_2_last_name: valueOrDots(secondarySeller?.last_name),
    seller_2_initials: valueOrDots(secondarySeller?.initials),
    seller_2_birth_place: valueOrDots(secondarySeller?.birth_place),
    seller_2_birth_date: formatDate(secondarySeller?.birth_date),
    seller_2_address: buildPersonAddress(secondarySeller),
    seller_2_street: valueOrDots(secondarySeller?.street),
    seller_2_house_number: valueOrDots(secondarySeller?.house_number),
    seller_2_postal_code: valueOrDots(formatPostalCode(secondarySeller?.postal_code)),
    seller_2_city: valueOrDots(secondarySeller?.city),
    seller_2_email: valueOrDots(secondarySeller?.email),
    seller_2_phone: valueOrDots(secondarySeller?.phone),
    seller_2_marital_status: valueOrDots(secondarySeller?.marital_status),
    seller_2_marital_status_label: maritalStatusLabel(
      secondarySeller?.marital_status
    ),
    seller_2_matrimonial_property_regime: propertyRegimeLabel(
      secondarySeller?.matrimonial_property_regime
    ),
    seller_2_matrimonial_property_regime_label: propertyRegimeLabel(
      secondarySeller?.matrimonial_property_regime
    ),
    seller_2_identification_type: valueOrDots(
      secondarySeller?.identification_type
    ),
    seller_2_identification_number: valueOrDots(
      secondarySeller?.identification_number
    ),
    seller_2_id_type: valueOrDots(secondarySeller?.identification_type),
    seller_2_id_number: valueOrDots(secondarySeller?.identification_number),
    has_second_seller: hasPersonData(secondarySeller),
    seller_future_address: "",
    has_seller_future_address: false,

    // Koper 1
    buyer_1_name: buildPersonName(primaryBuyer),
    buyer_1_full_name: buildPersonName(primaryBuyer),
    buyer_1_first_name: valueOrDots(primaryBuyer?.first_name),
    buyer_1_last_name: valueOrDots(primaryBuyer?.last_name),
    buyer_1_initials: valueOrDots(primaryBuyer?.initials),
    buyer_1_birth_place: valueOrDots(primaryBuyer?.birth_place),
    buyer_1_birth_date: formatDate(primaryBuyer?.birth_date),
    buyer_1_address: buildPersonAddress(primaryBuyer),
    buyer_1_street: valueOrDots(primaryBuyer?.street),
    buyer_1_house_number: valueOrDots(primaryBuyer?.house_number),
    buyer_1_postal_code: valueOrDots(formatPostalCode(primaryBuyer?.postal_code)),
    buyer_1_city: valueOrDots(primaryBuyer?.city),
    buyer_1_email: valueOrDots(primaryBuyer?.email),
    buyer_1_phone: valueOrDots(primaryBuyer?.phone),
    buyer_1_marital_status: valueOrDots(primaryBuyer?.marital_status),
    buyer_1_marital_status_label: maritalStatusLabel(
      primaryBuyer?.marital_status
    ),
    buyer_1_matrimonial_property_regime: propertyRegimeLabel(
      primaryBuyer?.matrimonial_property_regime
    ),
    buyer_1_matrimonial_property_regime_label: propertyRegimeLabel(
      primaryBuyer?.matrimonial_property_regime
    ),
    buyer_1_identification_type: valueOrDots(primaryBuyer?.identification_type),
    buyer_1_identification_number: valueOrDots(
      primaryBuyer?.identification_number
    ),
    buyer_1_id_type: valueOrDots(primaryBuyer?.identification_type),
    buyer_1_id_number: valueOrDots(primaryBuyer?.identification_number),

    // Koper 2
    buyer_2_name: buildPersonName(secondaryBuyer),
    buyer_2_full_name: buildPersonName(secondaryBuyer),
    buyer_2_first_name: valueOrDots(secondaryBuyer?.first_name),
    buyer_2_last_name: valueOrDots(secondaryBuyer?.last_name),
    buyer_2_initials: valueOrDots(secondaryBuyer?.initials),
    buyer_2_birth_place: valueOrDots(secondaryBuyer?.birth_place),
    buyer_2_birth_date: formatDate(secondaryBuyer?.birth_date),
    buyer_2_address: buildPersonAddress(secondaryBuyer),
    buyer_2_street: valueOrDots(secondaryBuyer?.street),
    buyer_2_house_number: valueOrDots(secondaryBuyer?.house_number),
    buyer_2_postal_code: valueOrDots(formatPostalCode(secondaryBuyer?.postal_code)),
    buyer_2_city: valueOrDots(secondaryBuyer?.city),
    buyer_2_email: valueOrDots(secondaryBuyer?.email),
    buyer_2_phone: valueOrDots(secondaryBuyer?.phone),
    buyer_2_marital_status: valueOrDots(secondaryBuyer?.marital_status),
    buyer_2_marital_status_label: maritalStatusLabel(
      secondaryBuyer?.marital_status
    ),
    buyer_2_matrimonial_property_regime: propertyRegimeLabel(
      secondaryBuyer?.matrimonial_property_regime
    ),
    buyer_2_matrimonial_property_regime_label: propertyRegimeLabel(
      secondaryBuyer?.matrimonial_property_regime
    ),
    buyer_2_identification_type: valueOrDots(secondaryBuyer?.identification_type),
    buyer_2_identification_number: valueOrDots(
      secondaryBuyer?.identification_number
    ),
    buyer_2_id_type: valueOrDots(secondaryBuyer?.identification_type),
    buyer_2_id_number: valueOrDots(secondaryBuyer?.identification_number),
    has_second_buyer: hasPersonData(secondaryBuyer),

    // Koopsom / levering
    asking_price: formatAmount(listing.asking_price),
    agreed_price: formatAmount(agreedPrice),
    agreed_price_text: amountToDutchWords(agreedPrice),
    purchase_price: formatAmount(agreedPrice),
    purchase_price_text: amountToDutchWords(agreedPrice),
    movable_goods_value: formatAmount(movableGoodsValue),
    movable_goods_value_text: amountToDutchWords(movableGoodsValue),
    price: formatAmount(agreedPrice),
    transfer_costs_paid_by: transferCostsText(transferCostsPaidBy),
    transfer_costs_paid_by_buyer: transferCostsPaidBy === "buyer",
    transfer_costs_paid_by_seller: transferCostsPaidBy === "seller",
    transfer_costs_paid_by_custom: transferCostsPaidBy === "custom",
    transfer_costs_custom_text:
      transferCostsPaidBy === "custom" ? "Afwijkende afspraak" : "",
    acceptance_date: formatDate(saleCase.acceptance_date),
    transfer_date: formatDate(saleCase.transfer_date),

    // Boete / bankgarantie
    penalty_percentage: 10,
    penalty_amount: formatAmount(penaltyAmount),
    penalty_amount_text: amountToDutchWords(penaltyAmount),
    bank_guarantee_percentage: 10,
    bank_guarantee_required: yesNo(saleCondition?.bank_guarantee_required),
    bank_guarantee_amount: formatAmount(bankGuaranteeAmount),
    bank_guarantee_amount_text: amountToDutchWords(bankGuaranteeAmount),
    bank_guarantee_deadline: formatDate(saleCondition?.bank_guarantee_deadline),

    // Notaris
    notary_office_name: valueOrToBeSpecified(saleCase.notary_office_name),
    notary_city: valueOrToBeSpecified(saleCase.notary_city),
    notary_email: valueOrDots(saleCase.notary_email),
    notary_phone: valueOrDots(saleCase.notary_phone),

    // Ontbindende voorwaarden
    financing_required: yesNo(saleCondition?.financing_required),
    has_financing_reservation: hasFinancingReservation,
    financing_amount: formatAmount(saleCondition?.financing_amount),
    financing_amount_text: amountToDutchWords(saleCondition?.financing_amount),
    financing_deadline: formatDate(saleCondition?.financing_deadline),
    has_financing_interest_rate: hasFinancingInterestRate,
    has_financing_max_annual_cost: hasFinancingMaxAnnualCost,
    financing_interest_rate: hasFinancingInterestRate
      ? String(saleCondition.max_interest_rate)
      : "",
    financing_interest_rate_text: hasFinancingInterestRate
      ? `een rentepercentage van maximaal ${saleCondition.max_interest_rate}%`
      : "een marktconforme rente",
    financing_max_annual_cost: hasFinancingMaxAnnualCost
      ? formatAmount(saleCondition.max_gross_annual_cost)
      : apartmentValueOrDefault(
          listing,
          "financing_max_annual_cost",
          TO_BE_AGREED
        ),
    financing_max_annual_cost_text: hasFinancingMaxAnnualCost
      ? `een bruto jaarlast van maximaal ${formatAmount(
          saleCondition.max_gross_annual_cost
        )}`
      : "een nader overeen te komen bruto jaarlast",
    financing_mortgage_type: apartmentValueOrDefault(
      listing,
      "financing_mortgage_type",
      "nader te bepalen"
    ),
    max_interest_rate:
      saleCondition?.max_interest_rate !== null &&
      saleCondition?.max_interest_rate !== undefined
        ? `${saleCondition.max_interest_rate}%`
        : DOTS,
    max_gross_annual_cost: formatAmount(saleCondition?.max_gross_annual_cost),

    nhg_required: yesNo(saleCondition?.nhg_required),
    has_nhg_reservation: hasNhgReservation,
    nhg_deadline: formatDate(saleCondition?.nhg_deadline),

    building_inspection_required: yesNo(
      saleCondition?.building_inspection_required
    ),
    has_inspection_reservation: hasInspectionReservation,
    building_inspection_deadline: formatDate(
      saleCondition?.building_inspection_deadline
    ),
    inspection_deadline: formatDate(saleCondition?.building_inspection_deadline),
    max_repair_costs: formatAmount(saleCondition?.max_repair_costs),
    inspection_max_cost: formatAmount(saleCondition?.max_repair_costs),
    inspection_max_cost_text: amountToDutchWords(
      saleCondition?.max_repair_costs
    ),
    inspector_name: apartmentValueOrDefault(
      listing,
      "inspector_name",
      "nader te bepalen"
    ),
    has_any_resolutive_condition:
      hasFinancingReservation || hasNhgReservation || hasInspectionReservation,

    // Registratie / aanvullende afspraken
    registration_required: Boolean(saleCondition?.registration_required),
    has_article_13_wbr: false,
    has_additional_agreements: hasText(saleCondition?.additional_agreements),
    additional_agreements: valueOrDots(saleCondition?.additional_agreements),
    public_law_restrictions: apartmentValueOrDefault(
      listing,
      "public_law_restrictions",
      "geen bijzonderheden bekend"
    ),
    normal_use_purpose: apartmentValueOrDefault(
      listing,
      "normal_use_purpose",
      "woonappartement"
    ),
    underground_tank_status: apartmentValueOrDefault(
      listing,
      "underground_tank_status",
      "niet van toepassing"
    ),
    plot_size_agreement: apartmentValueOrDefault(
      listing,
      "plot_size_agreement",
      "niet van toepassing"
    ),
    existing_lease_agreement_1: apartmentValueOrDefault(
      listing,
      "existing_lease_agreement_1",
      "niet van toepassing"
    ),
    existing_lease_agreement_2: apartmentValueOrDefault(
      listing,
      "existing_lease_agreement_2",
      "niet van toepassing"
    ),
    dissolution_notice_workday: apartmentValueOrDefault(
      listing,
      "dissolution_notice_workday",
      "eerste"
    ),
    signature_voorbehoud_workday: apartmentValueOrDefault(
      listing,
      "signature_voorbehoud_workday",
      "eerste"
    ),
    financing_documentation_requirements: apartmentValueOrDefault(
      listing,
      "financing_documentation_requirements",
      "niet van toepassing"
    ),
    additional_attachment_1: apartmentValueOrDefault(
      listing,
      "additional_attachment_1",
      "niet van toepassing"
    ),
    additional_attachment_2: apartmentValueOrDefault(
      listing,
      "additional_attachment_2",
      "niet van toepassing"
    ),

    // Roerende zaken
    has_movable_items: mappedMovableItems.length > 0,
    movable_items: mappedMovableItems,
    category: DOTS,
    item_name: DOTS,
    note: "",

    // Overig
    notes: valueOrDots(saleCase.notes),
  };
}
