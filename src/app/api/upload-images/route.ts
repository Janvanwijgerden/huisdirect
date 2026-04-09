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

    const formData = await req.formData();
    const listingId = String(formData.get("listingId") || "").trim();
    const files = formData.getAll("files") as File[];

    if (!listingId) {
      return NextResponse.json({ error: "Listing ID ontbreekt." }, { status: 400 });
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Geen bestanden ontvangen." }, { status: 400 });
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

    const { data: existingImages } = await supabase
      .from("listing_images")
      .select("id")
      .eq("listing_id", listingId);

    let nextPosition = existingImages?.length ?? 0;

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
      const filePath = `${user.id}/${listingId}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(filePath, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json(
          { error: `Uploaden mislukt: ${uploadError.message}` },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from("listing-images")
        .getPublicUrl(filePath);

      const isFirstImage = nextPosition === 0;

      const { error: insertError } = await supabase.from("listing_images").insert({
        listing_id: listingId,
        public_url: publicUrlData.publicUrl,
        storage_path: filePath,
        is_cover: isFirstImage,
        position: nextPosition,
      });

      if (insertError) {
        return NextResponse.json(
          { error: `Opslaan afbeelding mislukt: ${insertError.message}` },
          { status: 500 }
        );
      }

      nextPosition += 1;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Onverwachte fout bij uploaden." },
      { status: 500 }
    );
  }
}