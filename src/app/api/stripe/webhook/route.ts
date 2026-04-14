import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-03-25.dahlia",
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("❌ Geen stripe-signature header ontvangen");
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("❌ STRIPE_WEBHOOK_SECRET ontbreekt");
      return NextResponse.json(
        { error: "Webhook secret missing" },
        { status: 500 }
      );
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log("📩 Stripe webhook event:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("🧾 Checkout session ID:", session.id);
      console.log("🧾 Session metadata:", session.metadata);

      const listingId = session.metadata?.listingId;

      if (!listingId) {
        console.error("❌ Geen listingId gevonden in Stripe metadata");
        return NextResponse.json(
          { error: "Missing listingId in metadata" },
          { status: 400 }
        );
      }

      console.log("🔎 listingId uit Stripe metadata:", listingId);

      const updatePayload = {
        has_paid: true,
        status: "pending",
        rejection_reason: null,
        updated_at: new Date().toISOString(),
      };

      const { data, error, count, status, statusText } = await supabaseAdmin
        .from("listings")
        .update(updatePayload)
        .eq("id", listingId)
        .select();

      console.log("🛠 Supabase update response:", {
        status,
        statusText,
        count,
        data,
        error,
      });

      if (error) {
        console.error("❌ Supabase update error:", error);
        return NextResponse.json(
          {
            error: "Supabase update failed",
            details: error.message,
          },
          { status: 500 }
        );
      }

      if (!data || data.length === 0) {
        console.error(
          "❌ Update gaf geen records terug. Grote kans dat .eq('id', listingId) niet matcht."
        );
        return NextResponse.json(
          {
            error: "No rows updated",
            details: "Controleer of 'id' de juiste kolom is in listings",
          },
          { status: 500 }
        );
      }

      console.log("✅ Listing succesvol bijgewerkt:", data[0]);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Stripe webhook fout:", error);

    const message =
      error instanceof Error ? error.message : "Unknown webhook error";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}