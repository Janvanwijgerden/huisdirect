import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Home,
  Megaphone,
  Users,
} from "lucide-react";
import { getListings, getSoldListings } from "../../lib/actions/listings";
import ListingGrid from "../../components/listings/ListingGrid";
import HeroCalculator from "../../components/home/HeroCalculator";

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Meer zichtbaarheid",
    desc: "Zet je woning online en bereik serieuze kopers zonder tussenkomst van een makelaar.",
  },
  {
    icon: Shield,
    title: "Handmatig gecontroleerd",
    desc: "Elke woning wordt eerst gecontroleerd voordat deze live komt. Zo houden we het aanbod netjes en betrouwbaar.",
  },
  {
    icon: Zap,
    title: "Snel online",
    desc: "Meld je woning eenvoudig aan en zet de eerste stap naar een snellere en voordeligere verkoop.",
  },
];

export default async function HomePage() {
  const featuredListings = await getListings(6, true);
  const activeRecentListings = await getListings(12);
  const soldRecentListings = await getSoldListings(100);

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/house.jpg"
            alt="Huis"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/25" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8">
          <div className="max-w-2xl">
            <span className="mb-5 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-stone-200 sm:text-sm sm:tracking-[0.2em]">
              Verkoop je huis zonder makelaar
            </span>

            <h1 className="font-sans text-[1.9rem] font-bold leading-[1.02] tracking-tight sm:text-[2.2rem] sm:text-5xl sm:leading-[0.98] md:text-6xl">
              <span className="block">Bespaar gemiddeld</span>
              <span className="block text-green-400">
                duizenden euro&apos;s
              </span>
              <span className="block whitespace-nowrap">
                op makelaarskosten.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-stone-200 md:text-xl">
              Plaats je woning zelf online, bereik serieuze kopers en houd de
              regie over de verkoop.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-green-700 active:scale-[0.98]"
              >
                Plaats je woning
              </Link>

              <Link
                href="/hoe-het-werkt"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/90 transition hover:text-white"
              >
                Bekijk hoe het werkt
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <HeroCalculator />

            <p className="mt-3 text-sm text-stone-300">
              Gratis plaatsen. Geen verplichtingen.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-100">
                <Home className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-sans text-xl font-bold text-stone-900">
                  Bepaal je prijs
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  Jij bepaalt zelf de vraagprijs en houdt de regie over de verkoop.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-100">
                <Megaphone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-sans text-xl font-bold text-stone-900">
                  Wij publiceren je huis
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  Wij zetten je woning professioneel online voor serieuze kopers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-100">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-sans text-xl font-bold text-stone-900">
                  Ontvang biedingen
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  Ontvang direct reacties van kopers en houd zelf de controle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {featuredListings.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-stone-500">
                Uitgelicht
              </p>
              <h2 className="font-sans text-3xl font-bold text-stone-900 md:text-4xl">
                Uitgelichte woningen
              </h2>
            </div>

            <Link
              href="/listings?featured=true"
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-900 md:inline-flex"
            >
              Bekijk alles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ListingGrid listings={featuredListings} />

          <div className="mt-8 flex md:hidden">
            <Link
              href="/listings?featured=true"
              className="inline-flex w-full items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
            >
              Bekijk alle uitgelichte woningen
            </Link>
          </div>
        </section>
      )}

      <section className="bg-stone-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-stone-500">
                Nieuw aanbod
              </p>
              <h2 className="font-sans text-3xl font-bold text-stone-900 md:text-4xl">
                Recent geplaatste woningen
              </h2>
            </div>

            <Link
              href="/listings"
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-200/60 hover:text-stone-900 md:inline-flex"
            >
              Bekijk aanbod
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ListingGrid listings={activeRecentListings} />

          {soldRecentListings.length > 0 && (
            <div className="mt-16">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-stone-500">
                    Verkocht
                  </p>
                  <h2 className="font-sans text-3xl font-bold text-stone-900 md:text-4xl">
                    Recent verkocht
                  </h2>
                </div>

                <Link
                  href="/verkocht"
                  className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-200/60 hover:text-stone-900 md:inline-flex"
                >
                  Bekijk verkocht
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <ListingGrid listings={soldRecentListings} />

              <div className="mt-8 flex md:hidden">
                <Link
                  href="/verkocht"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
                >
                  Bekijk verkocht
                </Link>
              </div>
            </div>
          )}

          <div className="mt-8 flex md:hidden">
            <Link
              href="/listings"
              className="inline-flex w-full items-center justify-center rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
            >
              Bekijk aanbod
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="font-sans text-3xl font-bold text-stone-900 md:text-4xl">
            Waarom kiezen voor HuisDirect?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-stone-500">
            Verkoop je woning eenvoudiger, transparanter en met lagere kosten.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm transition hover:shadow-md"
            >
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
                <feature.icon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-sans text-xl font-bold text-stone-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-500">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-stone-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="font-sans text-3xl font-bold md:text-5xl">
            Klaar om je woning te plaatsen?
          </h2>

          <p className="mx-auto mb-10 mt-6 max-w-md text-stone-400">
            Zet je woning gratis online en bereik direct potentiële kopers.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-green-700 active:scale-[0.98]"
            >
              Plaats je woning gratis
            </Link>

            <Link
              href="/listings"
              className="inline-flex items-center justify-center rounded-xl border border-stone-700 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:border-stone-500 hover:bg-stone-800"
            >
              Bekijk aanbod
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}