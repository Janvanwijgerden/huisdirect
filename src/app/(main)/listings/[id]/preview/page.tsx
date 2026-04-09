import { notFound } from "next/navigation";
import { createClient } from "../../../../../lib/supabase/server";
import ListingDetailPage from "../page";

export default async function PreviewPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("id, user_id")
    .eq("id", params.id)
    .single();

  if (!listing || listing.user_id !== user.id) {
    notFound();
  }

  return <ListingDetailPage params={params} />;
}