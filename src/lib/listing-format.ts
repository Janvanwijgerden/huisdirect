import type { Listing } from "../data/listings";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatArea(size: number): string {
  return `${size} m²`;
}

export function formatPlotSize(plotSize: number): string {
  return `${plotSize} m²`;
}

export function formatAddressLine(listing: Pick<Listing, "address" | "postalCode" | "city">): string {
  return `${listing.address}, ${listing.postalCode} ${listing.city}`;
}