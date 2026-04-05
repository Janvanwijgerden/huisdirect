import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ListingDetailPage from "@/app/(main)/listings/[id]/page";

type HouseSlugPageProps = {
  params: {
    slug: string[];
  };
};

export default async function HouseSlugPage({
  params,
}: HouseSlugPageProps) {
  const slugPath = params.slug?.join("/");

  if (!slugPath) {
    notFound();
  }

  const supabase = await createClient();

  const { data: listing, error } = await supabase
    .from("listings")
    .select("id, slug, status, views")
    .eq("slug", slugPath)
    .maybeSingle();

  if (error || !listing) {
    notFound();
  }

  const currentViews = typeof listing.views === "number" ? listing.views : 0;

  await supabase
    .from("listings")
    .update({
      views: currentViews + 1,
    })
    .eq("id", listing.id);

  return <ListingDetailPage params={{ id: listing.id }} />;
}