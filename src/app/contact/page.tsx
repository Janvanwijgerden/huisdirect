import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Contact | HuisDirect",
  description:
    "Neem contact op met HuisDirect voor vragen over het platform, het plaatsen van je woning of verkopen zonder makelaar.",
};

const helpTopics = [
  "Hoe werkt verkopen zonder makelaar?",
  "Wat kost het plaatsen van een woning?",
  "Hoe plaats ik mijn woning op HuisDirect?",
  "Wat kan ik zelf doen en wat kan ik uitbesteden?",
];

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="bg-white text-slate-900">
        <section className="border-b border-slate-200 bg-gradient-to-b from-emerald-50 via-white to-white">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
            <div className="max-w-4xl">
              <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
                Contact
              </span>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Heb je een vraag? Wij helpen je graag verder.
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
                Heb je vragen over HuisDirect, het verkopen van je woning of het
                gebruik van het platform? Neem gerust contact met ons op.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="mailto:info@huisdirect.nl"
                  className="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-emerald-600 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                >
                  Mail naar info@huisdirect.nl
                </a>

                <Link
                  href="/listings/new"
                  className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Plaats je woning
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Contactgegevens
              </h2>

              <div className="mt-8 grid gap-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    E-mail
                  </p>
                  <a
                    href="mailto:info@huisdirect.nl"
                    className="mt-3 inline-block text-xl font-semibold text-slate-900 transition hover:text-emerald-700"
                  >
                    info@huisdirect.nl
                  </a>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Voor vragen over het platform, je advertentie, je account of
                    verkopen zonder makelaar.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Reactietijd
                  </p>
                  <p className="mt-3 text-xl font-semibold text-slate-900">
                    Binnen 24 uur
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Meestal reageren we sneller, zeker op werkdagen.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Onze aanpak
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Geen verkooppraatjes, geen onduidelijkheid. Gewoon helder,
                    eerlijk en gericht op wat jij nodig hebt om verder te kunnen.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 lg:p-10">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Waar kunnen we je mee helpen?
              </h2>

              <div className="mt-6 space-y-4">
                {helpTopics.map((topic) => (
                  <div
                    key={topic}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm leading-7 text-slate-700"
                  >
                    {topic}
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-emerald-200 bg-white p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Direct contact
                </p>
                <p className="mt-3 text-base leading-8 text-slate-600">
                  Heb je een concrete vraag? Stuur ons dan gewoon direct een
                  e-mail. Dan kunnen we je sneller en gerichter helpen dan met
                  een algemeen formulier.
                </p>

                <a
                  href="mailto:info@huisdirect.nl?subject=Vraag%20via%20HuisDirect"
                  className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                >
                  Stuur een bericht
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-20">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  Eerst even zelf verder kijken?
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                  Op onze website vind je al veel informatie over hoe verkopen
                  zonder makelaar werkt, wat het kost en hoe je jouw woning kunt
                  plaatsen.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/hoe-het-werkt"
                    className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-900 transition hover:bg-slate-50"
                  >
                    Bekijk hoe het werkt
                  </Link>

                  <Link
                    href="/voor-verkopers"
                    className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-900 transition hover:bg-slate-50"
                  >
                    Voor verkopers
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Klaar om te starten?
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                  Zet vandaag nog de eerste stap.
                </h3>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  Bereken eerst je mogelijke besparing of plaats direct je
                  woning op HuisDirect.
                </p>

                <div className="mt-8 flex flex-col gap-4">
                  <Link
                    href="/#calculator"
                    className="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-emerald-600 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                  >
                    Bereken je besparing
                  </Link>

                  <Link
                    href="/listings/new"
                    className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-900 transition hover:bg-slate-50"
                  >
                    Plaats je woning
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}