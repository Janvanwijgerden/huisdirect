// ─────────────────────────────────────────────────────────────
// Canonical Listing type — single source of truth
// Mirrors the public.listings table in Supabase exactly.
// ─────────────────────────────────────────────────────────────

export type ListingStatus = "active" | "sold" | "draft" | "pending" | "rejected";

export type Listing = {
  id: string;
  user_id: string | null;
  slug: string | null;
  title: string | null;
  city: string | null;
  street: string | null;
  asking_price: number | null;
  living_area: number | null;
  plot_size: number | null;
  bedrooms: number | null;
  energy_label: string | null;
  year_built: number | null;
  description: string | null;
  property_type: string | null;
  status: ListingStatus;
  is_featured: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
  listing_images?: {
    id: string;
    public_url: string;
    is_cover: boolean;
    position: number;
    label?: string | null;
  }[];
};

export type ListingImage = {
  id: string;
  listing_id: string;
  storage_path: string;
  public_url: string;
  label: string | null;
  is_cover: boolean;
  position: number;
  created_at: string;
};

export type ListingInsert = Omit<Listing, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ListingUpdate = Partial<Omit<Listing, "id" | "user_id" | "created_at">>;

export type Lead = {
  id: string;
  listing_id: string;
  seller_user_id: string;
  name: string;
  email: string;
  phone: string | null;
  request_type: "bezichtiging" | "informatie" | "terugbellen";
  message: string | null;
  status: "new" | "contacted" | "closed";
  created_at: string;
};

export type SaleCaseStatus =
  | "draft"
  | "ready"
  | "generated"
  | "sent"
  | "signed"
  | "cancelled";

export type SaleTemplateType = "woning" | "appartement";
export type TransferCostsPaidBy = "buyer" | "seller" | "custom";

export type SaleCase = {
  id: string;
  listing_id: string;
  seller_user_id: string;
  status: SaleCaseStatus;
  template_type: SaleTemplateType;
  agreed_price: number | null;
  movable_goods_value: number | null;
  transfer_costs_paid_by: TransferCostsPaidBy;
  transfer_date: string | null;
  acceptance_date: string | null;
  notary_office_name: string | null;
  notary_city: string | null;
  notary_email: string | null;
  notary_phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type SaleSeller = {
  id: string;
  sale_case_id: string;
  seller_order: number;
  first_name: string | null;
  last_name: string | null;
  initials: string | null;
  birth_place: string | null;
  birth_date: string | null;
  street: string | null;
  house_number: string | null;
  postal_code: string | null;
  city: string | null;
  email: string | null;
  phone: string | null;
  marital_status:
    | "ongehuwd"
    | "gehuwd"
    | "geregistreerd_partnerschap"
    | "gescheiden"
    | "weduwe_weduwnaar"
    | null;
  matrimonial_property_regime:
    | "gemeenschap_van_goederen"
    | "beperkte_gemeenschap_van_goederen"
    | "huwelijkse_voorwaarden"
    | "niet_van_toepassing"
    | null;
  identification_type: string | null;
  identification_number: string | null;
  created_at: string;
  updated_at: string;
};

export type SaleBuyer = {
  id: string;
  sale_case_id: string;
  buyer_order: number;
  first_name: string | null;
  last_name: string | null;
  initials: string | null;
  birth_place: string | null;
  birth_date: string | null;
  street: string | null;
  house_number: string | null;
  postal_code: string | null;
  city: string | null;
  email: string | null;
  phone: string | null;
  marital_status:
    | "ongehuwd"
    | "gehuwd"
    | "geregistreerd_partnerschap"
    | "gescheiden"
    | "weduwe_weduwnaar"
    | null;
  matrimonial_property_regime:
    | "gemeenschap_van_goederen"
    | "beperkte_gemeenschap_van_goederen"
    | "huwelijkse_voorwaarden"
    | "niet_van_toepassing"
    | null;
  identification_type: string | null;
  identification_number: string | null;
  created_at: string;
  updated_at: string;
};

export type SaleCondition = {
  id: string;
  sale_case_id: string;
  financing_required: boolean;
  financing_amount: number | null;
  financing_deadline: string | null;
  max_interest_rate: number | null;
  max_gross_annual_cost: number | null;
  nhg_required: boolean;
  nhg_deadline: string | null;
  building_inspection_required: boolean;
  building_inspection_deadline: string | null;
  max_repair_costs: number | null;
  bank_guarantee_required: boolean;
  bank_guarantee_amount: number | null;
  bank_guarantee_deadline: string | null;
  registration_required: boolean;
  additional_agreements: string | null;
  created_at: string;
  updated_at: string;
};

export type SaleDocument = {
  id: string;
  sale_case_id: string;
  document_type: "koopovereenkomst_docx" | "koopovereenkomst_pdf";
  version: number;
  storage_bucket: string;
  storage_path: string;
  public_url: string | null;
  generated_by: string | null;
  created_at: string;
};

export type SaleActivityLog = {
  id: string;
  sale_case_id: string;
  actor_user_id: string | null;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      listings: {
        Row: Listing;
        Insert: ListingInsert;
        Update: ListingUpdate;
      };
      listing_images: {
        Row: ListingImage;
        Insert: Omit<ListingImage, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<ListingImage, "id" | "created_at">>;
      };
      leads: {
        Row: Lead;
        Insert: Omit<Lead, "id" | "created_at" | "status"> & {
          id?: string;
          created_at?: string;
          status?: "new" | "contacted" | "closed";
        };
        Update: Partial<Omit<Lead, "id" | "created_at">>;
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string | null;
          updated_at?: string;
        };
      };
      sale_cases: {
        Row: SaleCase;
        Insert: Omit<SaleCase, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<SaleCase, "id" | "created_at" | "updated_at">>;
      };
      sale_buyers: {
        Row: SaleBuyer;
        Insert: Omit<SaleBuyer, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<SaleBuyer, "id" | "created_at" | "updated_at">>;
      };
      sale_sellers: {
        Row: SaleSeller;
        Insert: Omit<SaleSeller, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<SaleSeller, "id" | "created_at" | "updated_at">>;
      };
      sale_conditions: {
        Row: SaleCondition;
        Insert: Omit<SaleCondition, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<SaleCondition, "id" | "created_at" | "updated_at">>;
      };
      sale_documents: {
        Row: SaleDocument;
        Insert: Omit<SaleDocument, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<SaleDocument, "id" | "created_at">>;
      };
      sale_activity_log: {
        Row: SaleActivityLog;
        Insert: Omit<SaleActivityLog, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<SaleActivityLog, "id" | "created_at">>;
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
