import type {
  Listing,
  SaleBuyer,
  SaleCase,
  SaleCondition,
  SaleSeller,
} from "../../types/database";

export type ContractValidationError = {
  field: string;
  message: string;
};

export type ContractValidationData = {
  listing?: (Partial<Listing> & {
    house_number?: string | null;
    postal_code?: string | null;
    apartment_index_number?: string | null;
    vve_name?: string | null;
    is_leasehold?: boolean | null;
    features?: unknown;
  }) | null;
  saleCase: SaleCase;
  saleCondition: SaleCondition | null;
  buyers: SaleBuyer[];
  sellers: SaleSeller[];
  partyCounts?: {
    sellerCount?: "one" | "two";
    buyerCount?: "one" | "two";
  };
};

export type ContractCompletionStatus = {
  completed: number;
  total: number;
  percentage: number;
  errors: ContractValidationError[];
};

type RequiredField = {
  field: string;
  message: string;
  isComplete: (data: ContractValidationData) => boolean;
};

function hasValue(value: unknown) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  return Boolean(value);
}

function recordValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function leaseholdFeatures(data: ContractValidationData) {
  return recordValue(recordValue(data.listing?.features).leasehold);
}

function isLeaseholdActive(data: ContractValidationData) {
  return (
    data.listing?.is_leasehold === true ||
    leaseholdFeatures(data).is_leasehold === true
  );
}

function leaseholdField(fieldName: string, label: string): RequiredField {
  return {
    field: fieldName,
    message: `Vul eerst ${label} in.`,
    isComplete: (data) => hasValue(leaseholdFeatures(data)[fieldName]),
  };
}

function leaseholdRequiredFields() {
  return [
    leaseholdField("erfpacht_owner_name", "de eigenaar bloot eigendom"),
    leaseholdField("erfpacht_conditions", "de erfpachtvoorwaarden"),
    leaseholdField("erfpacht_end_date", "de einddatum erfpacht"),
    leaseholdField("erfpacht_revision_date", "de herzieningsdatum"),
    leaseholdField(
      "erfpacht_canon_prepaid_until",
      "de datum tot wanneer de canon is afgekocht"
    ),
    leaseholdField("erfpacht_canon_amount", "het canonbedrag"),
    leaseholdField("erfpacht_canon_period", "de canonperiode"),
    leaseholdField(
      "erfpacht_canon_adjustment_date",
      "de datum van canonaanpassing"
    ),
    leaseholdField(
      "erfpacht_canon_indexation_date",
      "de datum van canonindexatie"
    ),
  ];
}

function seller(data: ContractValidationData, order: number) {
  return data.sellers.find((item) => item.seller_order === order) ?? null;
}

function buyer(data: ContractValidationData, order: number) {
  return data.buyers.find((item) => item.buyer_order === order) ?? null;
}

function hasPersonData(person?: SaleSeller | SaleBuyer | null) {
  if (!person) return false;

  return [
    person.first_name,
    person.last_name,
    person.birth_date,
    person.birth_place,
    person.street,
    person.house_number,
    person.postal_code,
    person.city,
    person.marital_status,
    person.identification_type,
    person.identification_number,
  ].some(hasValue);
}

function sellerField(
  order: 1 | 2,
  fieldName: keyof SaleSeller,
  label: string
): RequiredField {
  return {
    field: `seller_${order}_${String(fieldName)}`,
    message: `Vul eerst ${label} van verkoper ${order} in.`,
    isComplete: (data) => hasValue(seller(data, order)?.[fieldName]),
  };
}

function buyerField(
  order: 1 | 2,
  fieldName: keyof SaleBuyer,
  label: string
): RequiredField {
  return {
    field: `buyer_${order}_${String(fieldName)}`,
    message: `Vul eerst ${label} van koper ${order} in.`,
    isComplete: (data) => hasValue(buyer(data, order)?.[fieldName]),
  };
}

function saleCaseField(
  fieldName: keyof SaleCase,
  label: string
): RequiredField {
  return {
    field: String(fieldName),
    message: `Vul eerst ${label} in.`,
    isComplete: (data) => hasValue(data.saleCase[fieldName]),
  };
}

function conditionField(
  fieldName: keyof SaleCondition,
  label: string,
  enabled: (data: ContractValidationData) => boolean
): RequiredField {
  return {
    field: String(fieldName),
    message: `Vul eerst ${label} in.`,
    isComplete: (data) => !enabled(data) || hasValue(data.saleCondition?.[fieldName]),
  };
}

function sellerRequiredFields(order: 1 | 2) {
  return [
    sellerField(order, "first_name", "de voornaam"),
    sellerField(order, "last_name", "de achternaam"),
    sellerField(order, "birth_date", "de geboortedatum"),
    sellerField(order, "birth_place", "de geboorteplaats"),
    sellerField(order, "street", "de straat"),
    sellerField(order, "house_number", "het huisnummer"),
    sellerField(order, "postal_code", "de postcode"),
    sellerField(order, "city", "de woonplaats"),
    sellerField(order, "marital_status", "de burgerlijke staat"),
    sellerField(order, "identification_type", "het soort legitimatie"),
    sellerField(order, "identification_number", "het documentnummer"),
  ];
}

function buyerRequiredFields(order: 1 | 2) {
  return [
    buyerField(order, "first_name", "de voornaam"),
    buyerField(order, "last_name", "de achternaam"),
    buyerField(order, "birth_date", "de geboortedatum"),
    buyerField(order, "birth_place", "de geboorteplaats"),
    buyerField(order, "street", "de straat"),
    buyerField(order, "house_number", "het huisnummer"),
    buyerField(order, "postal_code", "de postcode"),
    buyerField(order, "city", "de woonplaats"),
    buyerField(order, "marital_status", "de burgerlijke staat"),
    buyerField(order, "identification_type", "het soort legitimatie"),
    buyerField(order, "identification_number", "het documentnummer"),
  ];
}

export function getRequiredContractFields(
  data: ContractValidationData
): RequiredField[] {
  const financingEnabled = Boolean(data.saleCondition?.financing_required);
  const nhgEnabled = Boolean(data.saleCondition?.nhg_required);
  const inspectionEnabled = Boolean(
    data.saleCondition?.building_inspection_required
  );
  const secondSellerRequired =
    data.partyCounts?.sellerCount === "two" ||
    (!data.partyCounts?.sellerCount && hasPersonData(seller(data, 2)));
  const secondBuyerRequired =
    data.partyCounts?.buyerCount === "two" ||
    (!data.partyCounts?.buyerCount && hasPersonData(buyer(data, 2)));
  const leaseholdRequired = isLeaseholdActive(data);

  return [
    ...sellerRequiredFields(1),
    ...(secondSellerRequired ? sellerRequiredFields(2) : []),

    ...buyerRequiredFields(1),
    ...(secondBuyerRequired ? buyerRequiredFields(2) : []),

    saleCaseField("agreed_price", "de overeengekomen koopsom"),
    saleCaseField("acceptance_date", "de datum akkoord"),
    saleCaseField("transfer_date", "de leveringsdatum"),
    saleCaseField("transfer_costs_paid_by", "de kosten overdracht"),

    {
      field: "bank_guarantee_deadline",
      message: "Vul eerst de deadline bankgarantie in.",
      isComplete: (data) =>
        hasValue(data.saleCondition?.bank_guarantee_deadline),
    },

    conditionField(
      "financing_amount",
      "het financieringsbedrag",
      () => financingEnabled
    ),
    conditionField(
      "financing_deadline",
      "de deadline financiering",
      () => financingEnabled
    ),
    conditionField("nhg_deadline", "de deadline NHG", () => nhgEnabled),
    conditionField(
      "building_inspection_deadline",
      "de deadline bouwkundige keuring",
      () => inspectionEnabled
    ),
    conditionField(
      "max_repair_costs",
      "de maximale herstelkosten",
      () => inspectionEnabled
    ),

    ...(leaseholdRequired ? leaseholdRequiredFields() : []),
  ];
}

export function validateSaleContractData(
  data: ContractValidationData
): ContractCompletionStatus {
  const requiredFields = getRequiredContractFields(data);
  const errors = requiredFields
    .filter((field) => !field.isComplete(data))
    .map(({ field, message }) => ({ field, message }));
  const completed = requiredFields.length - errors.length;
  const total = requiredFields.length;

  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 100,
    errors,
  };
}
