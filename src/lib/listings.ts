import { listings } from "../data/listings";

export type Listing = (typeof listings)[number];

export function getAllListings(): Listing[] {
  return listings;
}

export function getListingById(id: string): Listing | undefined {
  return listings.find((listing) => listing.id === id);
}

export function getListingBySlug(slug: string): Listing | undefined {
  return listings.find((listing) => listing.slug === slug);
}