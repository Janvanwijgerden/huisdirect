export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
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
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          price: number;
          description: string;
          location: string;
          city: string;
          images: string[];
          bedrooms: number | null;
          bathrooms: number | null;
          area_m2: number | null;
          property_type: string;
          status: 'active' | 'sold' | 'draft';
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          price: number;
          description: string;
          location: string;
          city: string;
          images?: string[];
          bedrooms?: number | null;
          bathrooms?: number | null;
          area_m2?: number | null;
          property_type?: string;
          status?: 'active' | 'sold' | 'draft';
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          price?: number;
          description?: string;
          location?: string;
          city?: string;
          images?: string[];
          bedrooms?: number | null;
          bathrooms?: number | null;
          area_m2?: number | null;
          property_type?: string;
          status?: 'active' | 'sold' | 'draft';
          featured?: boolean;
          updated_at?: string;
        };
      };
    };
  };
}

export type Listing = Database['public']['Tables']['listings']['Row'];
export type ListingInsert = Database['public']['Tables']['listings']['Insert'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
