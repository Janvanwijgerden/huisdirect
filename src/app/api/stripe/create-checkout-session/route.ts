import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});
export async function POST(req: Request) {
  try {
    const { listingId } = await req.json();

    if (!listingId) {
      return NextResponse.json({ error: "Geen listingId" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Woning plaatsen op HuisDirect",
            },
            unit_amount: 19500,
          },
          quantity: 1,
        },
      ],

      allow_promotion_codes: true,

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=cancel`,

      metadata: {
        listingId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Stripe session fout" },
      { status: 500 }
    );
  }
}