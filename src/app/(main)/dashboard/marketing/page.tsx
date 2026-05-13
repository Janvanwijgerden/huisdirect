import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function MarketingRedirectPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/marketing");
  }

  const { data: listings } = await supabase
    .from("listings")
    .select("id, status, created_at")
    .eq("user_id", user.id)
    .in("status", ["active", "pending"])
    .order("created_at", { ascending: false });

  if (!listings || listings.length === 0) {
    redirect("/dashboard/listings");
  }

  redirect(`/dashboard/marketing/${listings[0].id}`);
}