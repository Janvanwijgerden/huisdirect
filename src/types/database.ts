// ─────────────────────────────────────────────────────────────
// Canonical Listing type — single source of truth
// Mirrors the public.listings table in Supabase exactly.
// All components and pages import from here.
// ─────────────────────────────────────────────────────────────

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
  status: 'active' | 'sold' | 'draft';
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

export type ListingInsert = Omit<Listing, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ListingUpdate = Partial<Omit<Listing, 'id' | 'user_id' | 'created_at'>>;

export type Lead = {
  id: string;
  listing_id: string;
  seller_user_id: string;
  name: string;
  email: string;
  phone: string | null;
  request_type: 'bezichtiging' | 'informatie' | 'terugbellen';
  message: string | null;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
};

// Legacy Database wrapper — kept for Supabase client type inference
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
        Insert: Omit<ListingImage, 'id' | 'created_at'> & { id?: string, created_at?: string };
        Update: Partial<Omit<ListingImage, 'id' | 'created_at'>>;
      };
      leads: {
        Row: Lead;
        Insert: Omit<Lead, 'id' | 'created_at' | 'status'> & { id?: string, created_at?: string, status?: 'new' | 'contacted' | 'closed' };
        Update: Partial<Omit<Lead, 'id' | 'created_at'>>;
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];