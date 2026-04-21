import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.huisdirect.nl";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/aanbod`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/plaats-woning`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hoe-het-werkt`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kosten-makelaar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return staticPages;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  const { data: listings, error } = await supabase
    .from("listings")
    .select("slug, updated_at, status")
    .eq("status", "active");

  if (error || !listings) {
    return staticPages;
  }

  const listingPages: MetadataRoute.Sitemap = listings
    .filter((listing) => listing.slug)
    .map((listing) => ({
      url: `${baseUrl}/${listing.slug}`,
      lastModified: listing.updated_at ? new Date(listing.updated_at) : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...listingPages];
}