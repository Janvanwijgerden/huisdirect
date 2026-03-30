import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Home,
  ShieldCheck,
  BadgeEuro,
} from "lucide-react";

export default function NewListingPage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden border-b border-stone-200 bg-gradient-to-b from-emerald-50 via-white to-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-100/60 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur">
                <Home className="h-4 w-4" />
                Woning verkopen via HuisDirect
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
                Plaats je woning zonder onnodige omwegen.
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-stone-600 sm:text-xl">
                Bereik geïnteresseerde kopers, houd meer regie over je verkoop
                en zet je woning eenvoudig online met een moderne presentatie.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#plaats-formulier"
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                >
                  Plaats je woning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>

                <Link
                  href="/listings"
                  className="inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white px-6 py-3.5 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
                >
                  Bekijk voorbeeld woningen
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-stone-900">Meer regie</p>
                  <p className="mt-1 text-sm leading-6 text-stone-600">
                    Jij houdt controle over presentatie en contact.
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-stone-900">Lagere drempel</p>
                  <p className="mt-1 text-sm leading-6 text-stone-600">
                    Simpeler en directer dan het traditionele traject.
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-stone-900">Snelle leads</p>
                  <p className="mt-1 text-sm leading-6 text-stone-600">
                    Ontvang snel interesse van serieuze kijkers.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:pl-6">
              <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-100/40 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                    <ShieldCheck className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">
                      Waarom via HuisDirect?
                    </p>
                    <p className="text-sm text-stone-500">
                      Gericht op eenvoud, snelheid en duidelijkheid
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        Snel online
                      </p>
                      <p className="text-sm leading-6 text-stone-600">
                        Zet je woning eenvoudig op het platform zonder onnodig
                        gedoe.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BadgeEuro className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        Meer grip op kosten
                      </p>
                      <p className="text-sm leading-6 text-stone-600">
                        Een directer model, met focus op zichtbaarheid en leads.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        Professionele uitstraling
                      </p>
                      <p className="text-sm leading-6 text-stone-600">
                        Presenteer je woning modern, rustig en overzichtelijk.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-emerald-50 p-4">
                  <p className="text-sm font-semibold text-stone-900">
                    Voor verkopers die het slimmer willen aanpakken.
                  </p>
                  <p className="mt-1 text-sm leading-6 text-stone-600">
                    HuisDirect is bedoeld voor mensen die snelheid, eenvoud en
                    zichtbaarheid belangrijk vinden.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="plaats-formulier"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Plaats je woning
            </p>
            <h2 className="mt-2 text-2xl font-bold text-stone-900 sm:text-3xl">
              Vertel ons iets over je woning
            </h2>
            <p className="mt-3 text-stone-600">
              Dit is voorlopig nog een MVP-formulier zonder backend. We bouwen
              nu eerst de pagina en flow goed op.
            </p>
          </div>

          <form className="grid gap-6 lg:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Naam
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Je naam"
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                E-mailadres
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="jij@email.nl"
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Telefoonnummer
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="06 12345678"
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Plaats
              </label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="Bijvoorbeeld Gorinchem"
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-500"
              />
            </div>

            <div className="lg:col-span-2">
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Adres
              </label>
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Straatnaam en huisnummer"
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-500"
              />
            </div>

            <div className="lg:col-span-2">
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Korte toelichting
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Vertel kort iets over je woning of je verkoopwens"
                className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-500"
              />
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-stone-500">
                Nog geen verzending gekoppeld. Deze knop is nu alleen voor de
                layout en gebruikersflow.
              </p>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                Woning aanmelden
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}