import { createClient } from "../../../lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, listingId } = await req.json();

    if (!id || !listingId) {
      return NextResponse.json(
        { error: "Afbeelding ID of listing ID ontbreekt." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
    }

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id")
      .eq("id", listingId)
      .eq("user_id", user.id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: "Woning niet gevonden." }, { status: 404 });
    }

    const { error: resetError } = await supabase
      .from("listing_images")
      .update({ is_cover: false })
      .eq("listing_id", listingId);

    if (resetError) {
      return NextResponse.json(
        { error: `Reset hoofdfoto mislukt: ${resetError.message}` },
        { status: 500 }
      );
    }

    const { error: coverError } = await supabase
      .from("listing_images")
      .update({ is_cover: true })
      .eq("id", id)
      .eq("listing_id", listingId);

    if (coverError) {
      return NextResponse.json(
        { error: `Hoofdfoto instellen mislukt: ${coverError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Onverwachte fout bij hoofdfoto instellen." },
      { status: 500 }
    );
  }
}