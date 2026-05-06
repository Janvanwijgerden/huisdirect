import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET(req: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("listingId");

  if (!listingId) {
    return NextResponse.json({ error: "listingId ontbreekt." }, { status: 400 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count } = await supabase
    .from("listing_favorites")
    .select("*", { count: "exact", head: true })
    .eq("listing_id", listingId);

  if (!user) {
    return NextResponse.json({
      active: false,
      count: count ?? 0,
    });
  }

  const { data: favorite } = await supabase
    .from("listing_favorites")
    .select("id")
    .eq("listing_id", listingId)
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({
    active: Boolean(favorite),
    count: count ?? 0,
  });
}

export async function POST(req: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const body = await req.json();
  const listingId = body.listingId;

  if (!listingId) {
    return NextResponse.json({ error: "listingId ontbreekt." }, { status: 400 });
  }

  const { error } = await supabase.from("listing_favorites").upsert(
    {
      listing_id: listingId,
      user_id: user.id,
    },
    {
      onConflict: "listing_id,user_id",
    }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("listing_events").insert({
    listing_id: listingId,
    event_type: "favorite",
    source: "listing_page",
  });

  const { count } = await supabase
    .from("listing_favorites")
    .select("*", { count: "exact", head: true })
    .eq("listing_id", listingId);

  return NextResponse.json({
    active: true,
    count: count ?? 0,
  });
}

export async function DELETE(req: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  const body = await req.json();
  const listingId = body.listingId;

  if (!listingId) {
    return NextResponse.json({ error: "listingId ontbreekt." }, { status: 400 });
  }

  const { error } = await supabase
    .from("listing_favorites")
    .delete()
    .eq("listing_id", listingId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { count } = await supabase
    .from("listing_favorites")
    .select("*", { count: "exact", head: true })
    .eq("listing_id", listingId);

  return NextResponse.json({
    active: false,
    count: count ?? 0,
  });
}