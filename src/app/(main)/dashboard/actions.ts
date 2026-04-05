"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../../lib/supabase/server";

export async function publishListing(listingId: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Niet ingelogd");
  }

  const { error } = await supabase
    .from("listings")
    .update({
      status: "gepubliceerd",
      updated_at: new Date().toISOString(),
    })
    .eq("id", listingId)
    .eq("user_id", user.id);

  if (error) {
    console.error("publishListing error:", error);
    throw new Error("Publiceren mislukt");
  }

  revalidatePath("/dashboard");
}