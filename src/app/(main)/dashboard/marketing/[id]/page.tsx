import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Eye,
  Heart,
  MousePointerClick,
  Percent,
  Share2,
  TrendingUp,
} from "lucide-react";
import { createClient } from "../../../../../lib/supabase/server";
import MarketingBudgetSlider from "../../../../../components/dashboard/MarketingBudgetSlider";
import MarketingShareButtons from "../../../../../components/dashboard/MarketingShareButtons";
import AIShareGenerator from "../../../../../components/dashboard/AIShareGenerator";

type PageProps = {
  params: {
    id: string;
  };
};

function countEvents(events: any[], eventType: string) {
  return events.filter((event) => event.event_type === eventType).length;
}

function formatPercentage(value: number) {
  if (!Number.isFinite(value)) return "0%";
  return `${value.toFixed(1)}%`;
}

export default async function MarketingDashboardPage({ params }: PageProps) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (listingError || !listing) {
    notFound();
  }

  if (listing.status !== "active" && listing.status !== "pending") {
    notFound();
  }

  const { data: events } = await supabase
    .from("listing_events")
    .select("event_type, source, created_at")
    .eq("listing_id", listing.id)
    .order("created_at", { ascending: false });

  const eventList = events ?? [];

  const { count: currentFavoriteCount } = await supabase
    .from("listing_favorites")
    .select("*", { count: "exact", head: true })
    .eq("listing_id", listing.id);

  const viewCount = Number(listing.views || 0) + countEvents(eventList, "view");
  const favoriteCount = currentFavoriteCount ?? 0;
  const shareClickCount =
    Number(listing.share_clicks || 0) + countEvents(eventList, "share_click");
  const leadCount = countEvents(eventList, "lead");

  const conversionRate = viewCount > 0 ? (leadCount / viewCount) * 100 : 0;

  const engagementRate =
    viewCount > 0 ? Math.min(100, (favoriteCount / viewCount) * 100) : 0;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.huisdirect.nl";

  const shareUrl = `${baseUrl}/huis/${listing.slug}?ref=share`;

  const stats = [
    {
      label: "Bekeken",
      value: viewCount,
      icon: Eye,
      text: "Hoe vaker je deelt, hoe hoger dit getal wordt.",
    },
    {
      label: "Hartjes",
      value: favoriteCount,
      icon: Heart,
      text: "Mensen die interesse tonen in jouw woning.",
    },
    {
      label: "Linkklikken",
      value: shareClickCount,
      icon: MousePointerClick,
      text: "Mensen die via jouw netwerk binnenkomen.",
    },
    {
      label: "Leads",
      value: leadCount,
      icon: BarChart3,
      text: "Dit zijn potentiële kopers van jouw woning.",
    },
    {
      label: "Conversie",
      value: formatPercentage(conversionRate),
      icon: Percent,
      text: "Hoeveel bezoekers contact opnemen.",
    },
    {
      label: "Interesse",
      value: formatPercentage(engagementRate),
      icon: TrendingUp,
      text: "Hoeveel bezoekers actief betrokken zijn.",
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-neutral-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug naar dashboard
        </Link>

        <div className="mt-6 rounded-[34px] border border-neutral-200 bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.06)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <Share2 className="h-3.5 w-3.5" />
                Marketingdashboard
              </div>

              <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-neutral-950 sm:text-5xl">
                {listing.title || "Jouw woning"}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">
                Volg hier hoe je woning presteert, deel je persoonlijke link en
                vraag extra marketing aan.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 lg:w-[320px]">
              <p className="text-sm font-semibold text-neutral-950">
                Status campagne
              </p>

              <p className="mt-2 text-sm leading-6 text-neutral-600">
                {listing.marketing_active
                  ? `Marketing actief/aangevraagd met budget €${
                      listing.marketing_budget || 0
                    }.`
                  : "Nog geen extra marketing aangevraagd."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-[0_16px_50px_rgba(0,0,0,0.04)]"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50">
                  <Icon className="h-5 w-5 text-emerald-700" />
                </div>

                <p className="mt-5 text-sm font-medium text-neutral-500">
                  {stat.label}
                </p>

                <p className="mt-1 text-4xl font-semibold tracking-tight text-neutral-950">
                  {stat.value}
                </p>

                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  {stat.text}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-5 text-center text-sm font-medium text-neutral-700 shadow-[0_16px_50px_rgba(0,0,0,0.04)]">
          {viewCount < 10 && (
            <span>
              Je woning wordt nog weinig bekeken. Deel hem vandaag in je
              WhatsApp, familie-, werk-, buurt- en sportgroepen.
            </span>
          )}

          {viewCount >= 10 && leadCount === 0 && engagementRate < 5 && (
            <span>
              Mensen kijken wel, maar tonen weinig interesse. Overweeg betere
              foto’s of een scherpere prijs.
            </span>
          )}

          {viewCount >= 10 && leadCount === 0 && engagementRate >= 5 && (
            <span>
              Je woning wordt goed bekeken en mensen tonen interesse. Vergroot
              je bereik om bezichtigingen te krijgen.
            </span>
          )}

          {leadCount > 0 && conversionRate < 1 && (
            <span>
              Je krijgt al aanvragen, maar de conversie kan beter. Zorg dat je
              presentatie en prijs goed aansluiten.
            </span>
          )}

          {leadCount > 0 && conversionRate >= 1 && (
            <span className="text-emerald-700">
              Sterk bezig — je woning trekt aandacht en levert geïnteresseerde
              kopers op.
            </span>
          )}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <MarketingShareButtons listingId={listing.id} shareUrl={shareUrl} />

            <AIShareGenerator listing={listing} shareUrl={shareUrl} />

<MarketingBudgetSlider
  listingId={listing.id}
  shareUrl={shareUrl}
  initialBudget={listing.marketing_budget}
  listing={listing}
  viewCount={viewCount}
  engagementRate={engagementRate}
  leadCount={leadCount}
  conversionRate={conversionRate}
/>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
                Slim delen werkt beter
              </h2>

              <div className="mt-4 space-y-3 text-sm leading-6 text-neutral-600">
                <p>
                  Begin met je eigen netwerk. WhatsApp-groepen, familie,
                  collega’s, buurtapps en sportverenigingen leveren vaak de
                  warmste aandacht op.
                </p>

                <p>
                  Een persoonlijk bericht voelt betrouwbaarder dan een standaard
                  advertentie. Daarom maakt de AI teksten die persoonlijk voelen,
                  maar nog steeds makkelijk door te sturen zijn.
                </p>
              </div>
            </div>

            <div className="rounded-[32px] border border-emerald-200 bg-emerald-50 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
                Tip voor meer bereik
              </h2>

              <p className="mt-4 text-sm leading-6 text-neutral-700">
                Deel je woning eerst gratis in je eigen netwerk. Als de views
                achterblijven, kun je daarna extra marketing inzetten om ook
                mensen buiten je netwerk te bereiken.
              </p>
            </div>

            <div className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
                Juridisch netjes
              </h2>

              <p className="mt-4 text-sm leading-6 text-neutral-600">
                De getoonde impressies zijn indicatief. HuisDirect kan extra
                bereik organiseren, maar garandeert geen verkoop, bezichtigingen
                of vaste advertentieresultaten.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}