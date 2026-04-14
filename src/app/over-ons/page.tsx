import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Over ons | HuisDirect",
  description:
    "Ontdek waarom HuisDirect is opgericht en hoe wij woningverkoop eenvoudiger, eerlijker en goedkoper maken. Verkoop je huis zonder makelaar.",
};

const principles = [
  {
    title: "Eerlijk en transparant",
    description:
      "Geen onduidelijke courtages of vage beloftes. Jij weet vooraf waar je aan toe bent en houdt grip op het proces.",
  },
  {
    title: "Slimmer met technologie",
    description:
      "Met slimme tools en AI helpen we je sneller een professionele woningadvertentie te maken, zonder onnodig gedoe.",
  },
  {
    title: "Jij houdt de regie",
    description:
      "Van planning tot bezichtigingen en contact met geïnteresseerden: jij bepaalt hoe je verkoopt en wat je zelf doet.",
  },
  {
    title: "Meer waarde, lagere kosten",
    description:
      "Waarom duizenden euro’s betalen als veel onderdelen van het verkoopproces slimmer, sneller en voordeliger kunnen?",
  },
];

const audience = [
  "Huiseigenaren die duizenden euro’s willen besparen op makelaarskosten",
  "Verkopers die zelf de regie willen houden over hun woningverkoop",
  "Mensen die geloven dat woningverkoop moderner, transparanter en eenvoudiger kan",
];

export default function OverOnsPage() {
  return (
    <>
      <Navbar />

      <main className="bg-white text-slate-900">
        <section className="border-b border-slate-200 bg-gradient-to-b from-emerald-50 via-white to-white">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
            <div className="max-w-4xl">
              <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
                Over HuisDirect
              </span>

              <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Woningverkoop eerlijker, eenvoudiger en goedkoper maken.
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
                HuisDirect is gebouwd voor mensen die hun woning willen verkopen
                zonder onnodig veel kosten, zonder overbodige tussenlagen en
                zonder het gevoel de controle kwijt te raken.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
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
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Waarom HuisDirect bestaat
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-slate-600">
                <p>
                  De traditionele makelaar vraagt vaak duizenden euro’s voor een
                  proces dat tegenwoordig voor een groot deel digitaal,
                  schaalbaar en veel efficiënter is geworden. Toch hebben veel
                  verkopers nog steeds het gevoel dat ze vastzitten aan hoge
                  kosten en weinig transparantie.
                </p>

                <p>
                  Wij geloven dat dat anders kan. Daarom hebben we HuisDirect
                  gebouwd: een modern platform waarmee je zelf je woning kunt
                  verkopen, zonder in te leveren op uitstraling, structuur of
                  professionaliteit.
                </p>

                <p>
                  Geen ouderwetse aanpak. Geen onnodige afhankelijkheid. Wel een
                  duidelijk proces, slimme ondersteuning en volledige regie voor
                  de verkoper.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 lg:p-10">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Onze visie
              </h2>

              <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
                <p>
                  Wij vinden dat woningverkoop transparanter moet worden.
                </p>
                <p>
                  Minder afhankelijk van tussenpersonen. Meer controle voor de
                  verkoper. Lagere kosten, zonder kwaliteitsverlies.
                </p>
                <p>
                  HuisDirect is gebouwd voor de toekomst van woningverkoop:
                  slimmer, directer en eerlijker.
                </p>
              </div>

              <div className="mt-8 rounded-2xl border border-emerald-200 bg-white p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  De kern van HuisDirect
                </p>
                <p className="mt-3 text-lg font-semibold text-slate-900">
                  Makelaarskwaliteit, zonder makelaar.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-20">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Wat maakt HuisDirect anders?
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                We bouwen HuisDirect niet als een uitgeklede versie van een
                makelaarskantoor, maar als een modern verkoopplatform dat vanaf
                de basis is ontworpen voor eenvoud, vertrouwen en resultaat.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {principles.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-20">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 lg:p-10">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Voor wie is HuisDirect?
              </h2>

              <ul className="mt-6 space-y-4">
                {audience.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm leading-7 text-slate-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Onze belofte aan verkopers
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-slate-600">
                <p>
                  Bij HuisDirect draait het niet om zoveel mogelijk kosten
                  toevoegen, maar om zoveel mogelijk waarde leveren.
                </p>

                <p>
                  We willen dat jij snel kunt starten, professioneel zichtbaar
                  bent en precies begrijpt wat je doet. Daarom combineren we een
                  duidelijke structuur met slimme tools en een moderne aanpak.
                </p>

                <p>
                  Zo krijg je als verkoper niet alleen lagere kosten, maar ook
                  meer rust, meer overzicht en meer controle over je verkoop.
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/listings/new"
                  className="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-emerald-600 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                >
                  Start met verkopen
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Neem contact op
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-950">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <div className="max-w-4xl">
              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">
                Klaar om te starten?
              </span>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Ontdek direct hoeveel je kunt besparen met HuisDirect.
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                Bekijk wat verkopen zonder makelaar jou kan opleveren en zet
                daarna je woning professioneel online.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/#calculator"
                  className="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-emerald-500 px-7 py-4 text-base font-semibold text-white transition hover:bg-emerald-400"
                >
                  Ga naar de calculator
                </Link>

                <Link
                  href="/listings/new"
                  className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  Plaats je woning
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}