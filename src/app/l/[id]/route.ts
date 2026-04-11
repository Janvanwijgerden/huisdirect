import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("id")
    .eq("id", params.id)
    .single();

  if (!listing) {
    return NextResponse.redirect(new URL("/listings", request.url));
  }

  await supabase.rpc("increment_listing_views", {
    p_listing_id: params.id,
  });

  return NextResponse.redirect(new URL(`/listings/${params.id}`, request.url));
}