import { createClient } from "../../../lib/supabase/server";
export async function POST(req: Request) {
  const body = await req.json();
  const { listingId } = body;

  const supabase = await createClient();

  const { error } = await supabase
    .from("listings")
    .update({ has_paid: true })
    .eq("id", listingId);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}