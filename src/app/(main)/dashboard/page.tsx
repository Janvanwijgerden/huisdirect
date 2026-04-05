import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import {
  getUserListings,
  attemptPublishListing,
} from "../../../lib/actions/listings";
import { getUserLeads } from "../../../lib/actions/leads";
import MarketingCampaignCard from "../../../components/dashboard/MarketingCampaignCard";
import {
  Camera,
  FileText,
  Euro,
  Check,
  Home,
  ChevronRight,
  Mail,
  Megaphone,
  Users,
  Settings,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userListings = await getUserListings(user.id);
  const validListings = userListings.filter((l: any) => l.id);
  const leads = await getUserLeads(user.id);

  if (validListings.length > 1) {
    throw new Error(
      "Meerdere woningen per gebruiker nog niet ondersteund in dit model."
    );
  }

  const dbListing = validListings[0];
  const recentLeads = leads.slice(0, 3);

  if (!dbListing) {
    return (
      <div className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
                Mijn account
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                Hier regel je alles voor de verkoop van je woning
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
              <Mail className="h-4 w-4 text-neutral-400" />
              <span>{user.email}</span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                Nog geen woning toegevoegd
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-500">
                Start met je woning om je verkoopomgeving op te bouwen. Daarna
                kun je je advertentie aanvullen, publiceren, leads ontvangen en
                marketing inzetten.
              </p>

              <div className="mt-8">
                <Link
                  href="/listings/new"
                  className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  Start met je woning
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <h3 className="text-lg font-semibold tracking-tight text-neutral-900">
                Wat je hier straks regelt
              </h3>

              <div className="mt-6 space-y-4">
                {[
                  "Je woning beheren",
                  "Je advertentie publiceren",
                  "Aanvragen van kopers ontvangen",
                  "Marketing activeren",
                  "Je accountgegevens beheren",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-neutral-100 px-4 py-4"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-neutral-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasPhotos = Boolean(
    dbListing.listing_images && dbListing.listing_images.length > 0
  );
  const hasDetails = Boolean(
    dbListing.description &&
      dbListing.description.length > 20 &&
      dbListing.property_type &&
      dbListing.city
  );
  const hasPrice = Boolean(dbListing.asking_price && dbListing.asking_price > 0);
  const isLive = dbListing.status === "active";
  const canPublish = Boolean(hasPhotos && hasDetails && hasPrice);

  const listing = {
    id: dbListing.id,
    title: dbListing.title || "Concept woning",
    image: dbListing.image || null,
    city: dbListing.city || "Locatie nog niet ingevuld",
    price: dbListing.asking_price || null,
  };

  const checklist = [
    {
      title: "Woningfoto's",
      description: "Zorg voor een sterke eerste indruk",
      done: hasPhotos,
      icon: Camera,
    },
    {
      title: "Woninggegevens",
      description: "Vul alle belangrijke informatie compleet in",
      done: hasDetails,
      icon: FileText,
    },
    {
      title: "Vraagprijs",
      description: "Geef kopers direct duidelijkheid",
      done: hasPrice,
      icon: Euro,
    },
  ];

  const totalChecklistDone = checklist.filter((item) => item.done).length;
  const completionPercentage = Math.round(
    (totalChecklistDone / checklist.length) * 100
  );

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <section className="mb-8 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] sm:p-7">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
              Mijn account
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Hier regel je alles voor de verkoop van je woning: van aanvullen
              en publiceren tot leads en marketing.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-900">Account</p>
                <p className="mt-1 break-all text-sm text-neutral-500">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-neutral-100 pt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Woningstatus</span>
                <span className="font-medium text-neutral-900">
                  {isLive ? "Live" : "Concept"}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-neutral-500">Voltooid</span>
                <span className="font-medium text-neutral-900">
                  {completionPercentage}%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE: MARKETING EERST */}
        {isLive && (
          <MarketingCampaignCard
            listingId={listing.id}
            siteUrl={process.env.NEXT_PUBLIC_SITE_URL}
          />
        )}

        {/* HOOFDSECTIE */}
        <section className="mb-8 grid gap-6 xl:grid-cols-[1.5fr_0.95fr]">
          <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="grid xl:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[300px] border-b border-neutral-100 bg-neutral-50 xl:min-h-[100%] xl:border-b-0 xl:border-r">
                {listing.image ? (
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[300px] flex-col items-center justify-center p-8 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm">
                      <Camera className="h-6 w-6 text-neutral-400" />
                    </div>
                    <h3 className="text-base font-semibold text-neutral-900">
                      Voeg een sterke hoofdfoto toe
                    </h3>
                    <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-neutral-500">
                      Dit is het eerste wat kopers zien wanneer ze jouw woning
                      bekijken.
                    </p>
                    <Link
                      href={`/listings/${listing.id}/edit`}
                      className="mt-6 inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                    >
                      Foto toevoegen
                    </Link>
                  </div>
                )}
              </div>

              <div className="flex flex-col p-8 lg:p-10">
                <div>
                  {isLive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <Check className="h-3.5 w-3.5" />
                      Live online
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 ring-1 ring-inset ring-neutral-500/20">
                      <Home className="h-3.5 w-3.5 text-neutral-500" />
                      Conceptversie
                    </span>
                  )}

                  <h2 className="mt-5 text-3xl font-semibold tracking-tight text-neutral-900">
                    {listing.title}
                  </h2>

                  <p className="mt-2 text-sm text-neutral-500">
                    {listing.city}
                  </p>

                  <p className="mt-5 text-2xl font-semibold text-neutral-900">
                    {listing.price
                      ? `€ ${listing.price.toLocaleString("nl-NL")} k.k.`
                      : "Vraagprijs nog niet ingesteld"}
                  </p>
                </div>

                <div className="mt-8 rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Woning compleet</span>
                    <span className="font-medium text-neutral-900">
                      {completionPercentage}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                  {!isLive && (
                    <>
                      <Link
                        href={`/listings/${listing.id}/edit`}
                        className="flex w-full items-center justify-center rounded-2xl border border-neutral-200 bg-white px-6 py-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                      >
                        Maak je woning compleet
                      </Link>

                      <form action={attemptPublishListing.bind(null, listing.id)}>
                        <button
                          type="submit"
                          disabled={!canPublish}
                          className="w-full rounded-2xl bg-neutral-900 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
                        >
                          Zet woning live voor €195
                        </button>
                      </form>
                    </>
                  )}

                  {isLive && (
                    <>
                      <Link
                        href="#marketing"
                        className="flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                      >
                        Start marketingcampagne
                      </Link>

                      <Link
                        href={`/listings/${listing.id}`}
                        target="_blank"
                        className="flex w-full items-center justify-center rounded-2xl border border-neutral-200 bg-white px-6 py-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                      >
                        Bekijk je woning
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <h3 className="text-xl font-semibold tracking-tight text-neutral-900">
                {isLive ? "Je woning staat goed" : "Wat moet je nog doen"}
              </h3>

              <div className="mt-6 flex flex-col gap-4">
                {checklist.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-neutral-100 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div
                          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            item.done
                              ? "bg-green-50 text-green-600"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          <item.icon className="h-4.5 w-4.5" />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                            {item.description}
                          </p>
                          <p
                            className={`mt-2 text-xs font-medium ${
                              item.done ? "text-green-600" : "text-neutral-500"
                            }`}
                          >
                            {item.done ? "Afgerond" : "Nog toevoegen"}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/listings/${listing.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
                      >
                        {item.done ? "Wijzigen" : "Invullen"}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {isLive && (
                <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-sm font-medium text-emerald-900">
                    Klaar voor de volgende stap
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-emerald-700">
                    Je advertentie staat online. Extra zichtbaarheid via
                    marketing is nu de snelste manier om meer aandacht te
                    trekken.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <h3 className="text-xl font-semibold tracking-tight text-neutral-900">
                Account en instellingen
              </h3>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-neutral-100 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        Mijn gegevens
                      </p>
                      <p className="text-sm text-neutral-500">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-neutral-100 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                      <Settings className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        Instellingen
                      </p>
                      <p className="text-sm text-neutral-500">
                        Later uitbreiden met profiel en voorkeuren
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-neutral-900">
                  Leads
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  De nieuwste aanvragen van geïnteresseerde kopers
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                <Users className="h-3.5 w-3.5" />
                {leads.length} totaal
              </div>
            </div>

            <div className="mt-6">
              {recentLeads.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-5 py-10 text-center">
                  <p className="text-sm text-neutral-500">
                    Je hebt nog geen aanvragen ontvangen.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentLeads.map((lead: any) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-100 px-5 py-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900">
                          {lead.name}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500">
                          {lead.request_type}
                        </p>
                      </div>

                      <div className="shrink-0 text-xs text-neutral-400">
                        {new Date(lead.created_at).toLocaleDateString("nl-NL")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {!isLive && (
            <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Megaphone className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-neutral-900">
                    Marketing
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                    Zodra je woning live staat, kun je extra bereik activeren.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-neutral-100 bg-neutral-50 p-5">
                <p className="text-sm font-medium text-neutral-900">
                  Eerst publiceren, daarna opschalen
                </p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  Zet eerst je woning live. Daarna maak je met marketing extra
                  bereik en vergroot je de kans op nieuwe aanvragen.
                </p>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-6 py-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  Marketing later activeren
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}