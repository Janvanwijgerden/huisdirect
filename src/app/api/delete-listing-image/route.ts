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

    const { data: image, error: imageError } = await supabase
      .from("listing_images")
      .select("id, storage_path, is_cover")
      .eq("id", id)
      .eq("listing_id", listingId)
      .single();

    if (imageError || !image) {
      return NextResponse.json({ error: "Afbeelding niet gevonden." }, { status: 404 });
    }

    if (image.storage_path) {
      await supabase.storage.from("listing-images").remove([image.storage_path]);
    }

    const { error: deleteError } = await supabase
      .from("listing_images")
      .delete()
      .eq("id", id)
      .eq("listing_id", listingId);

    if (deleteError) {
      return NextResponse.json(
        { error: `Verwijderen mislukt: ${deleteError.message}` },
        { status: 500 }
      );
    }

    if (image.is_cover) {
      const { data: remainingImages } = await supabase
        .from("listing_images")
        .select("id")
        .eq("listing_id", listingId)
        .order("position", { ascending: true })
        .limit(1);

      const nextImage = remainingImages?.[0];

      if (nextImage) {
        await supabase
          .from("listing_images")
          .update({ is_cover: true })
          .eq("id", nextImage.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Onverwachte fout bij verwijderen." },
      { status: 500 }
    );
  }
}