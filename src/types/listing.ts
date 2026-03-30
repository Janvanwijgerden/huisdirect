export type ListingStatus = "available" | "under_offer" | "sold";

export type Listing = {
  id: string;
  title: string;
  slug: string;
  price: number;
  location: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  yearBuilt?: number;
  energyLabel?: string;
  description: string;
  images: string[];
  featured?: boolean;
  status: ListingStatus;
};