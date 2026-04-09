import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
    }

    const { listingId, orderedIds } = await req.json();

    if (!listingId || !Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { error: "Ongeldige data voor volgorde." },
        { status: 400 }
      );
    }

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id")
      .eq("id", listingId)
      .eq("user_id", user.id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json(
        { error: "Woning niet gevonden of geen toegang." },
        { status: 404 }
      );
    }

    for (let i = 0; i < orderedIds.length; i += 1) {
      const imageId = orderedIds[i];

      const { error } = await supabase
        .from("listing_images")
        .update({ position: i })
        .eq("id", imageId)
        .eq("listing_id", listingId);

      if (error) {
        return NextResponse.json(
          { error: `Volgorde opslaan mislukt: ${error.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Onverwachte fout bij volgorde opslaan." },
      { status: 500 }
    );
  }
}