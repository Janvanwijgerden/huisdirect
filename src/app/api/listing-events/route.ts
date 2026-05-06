import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

const allowedEventTypes = [
  "view",
  "share_click",
  "favorite",
  "lead",
  "marketing_request",
];

export async function GET(req: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("listingId");

  if (!listingId) {
    return NextResponse.json({ error: "listingId ontbreekt." }, { status: 400 });
  }

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // 👉 ALLES ophalen (geen filter)
  const { data: allEvents, error } = await supabase
    .from("listing_events")
    .select("event_type, created_at")
    .eq("listing_id", listingId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const events = allEvents ?? [];

  const last24h = events.filter(
    (e) => e.created_at >= since24h
  );

  const count = (list: any[], type: string) =>
    list.filter((e) => e.event_type === type).length;

  return NextResponse.json({
    totals: {
      views: count(events, "view"),
      favorites: count(events, "favorite"),
      leads: count(events, "lead"),
      shares: count(events, "share_click"),
    },
    last24h: {
      views: count(last24h, "view"),
      favorites: count(last24h, "favorite"),
      leads: count(last24h, "lead"),
      shares: count(last24h, "share_click"),
    },
  });
}

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const body = await req.json();

    const listingId = body.listingId;
    const eventType = body.eventType;
    const source = body.source || null;
    const metadata = body.metadata || {};

    if (!listingId || !eventType || !allowedEventTypes.includes(eventType)) {
      return NextResponse.json(
        { error: "Ongeldige listingId of eventType." },
        { status: 400 }
      );
    }

    const { error: eventError } = await supabase.from("listing_events").insert({
      listing_id: listingId,
      event_type: eventType,
      source,
      metadata,
    });

    if (eventError) {
      return NextResponse.json({ error: eventError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Server fout." }, { status: 500 });
  }
}