import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Makelaar of zelf verkopen? | Wat is slimmer in 2026? | HuisDirect",
  description:
    "Twijfelt u tussen een makelaar inschakelen of zelf uw huis verkopen? Ontdek de verschillen, kosten en waarom steeds meer verkopers kiezen voor zelf verkopen met begeleiding en AI.",
  alternates: {
    canonical: "https://www.huisdirect.nl/makelaar-of-zelf-verkopen",
  },
  openGraph: {
    title: "Makelaar of zelf verkopen | HuisDirect",
    description:
      "Lees wanneer een makelaar handig is en wanneer zelf verkopen slimmer kan zijn. Inclusief kostenverschillen en moderne aanpak met AI en marketing.",
    url: "https://www.huisdirect.nl/makelaar-of-zelf-verkopen",
    siteName: "HuisDirect",
    locale: "nl_NL",
    type: "article",
  },
};

const verschillen = [
  {
    title: "Kosten",
    makelaar: "Courtage (vaak duizenden euro’s)",
    zelf: "Veel lagere kosten, meer controle over budget",
  },
  {
    title: "Regie",
    makelaar: "Makelaar stuurt het proces",
    zelf: "U houdt zelf controle en bepaalt keuzes",
  },
  {
    title: "Werk",
    makelaar: "U doet al veel zelf, maar via makelaar",
    zelf: "U doet het zelf, met begeleiding en tools",
  },
  {
    title: "Bereik",
    makelaar: "Vaak via Funda",
    zelf: "Gerichte marketing + eigen strategie",
  },
  {
    title: "Begeleiding",
    makelaar: "Persoonlijke begeleiding",
    zelf: "Stappenplan, AI en ondersteuning",
  },
];

const faqItems = [
  {
    question: "Is zelf mijn huis verkopen moeilijk?",
    answer:
      "Voor veel mensen valt dat mee. Zeker met een duidelijk stappenplan en begeleiding wordt het proces overzichtelijk en goed te volgen.",
  },
  {
    question: "Waarom kiezen mensen nog voor een makelaar?",
    answer:
      "Vooral vanwege zekerheid en gemak. Sommige verkopers willen alles uitbesteden en vinden het prettig dat iemand het proces begeleidt.",
  },
  {
    question: "Waarom kiezen steeds meer mensen voor zelf verkopen?",
    answer:
      "Omdat ze kosten willen besparen, meer regie willen houden en merken dat veel onderdelen tegenwoordig goed zelf te organiseren zijn.",
  },
  {
    question: "Kan AI echt helpen bij het verkopen van mijn huis?",
    answer:
      "Ja. AI helpt bij woningteksten, structuur, voorbereiding en het maken van keuzes. Daardoor wordt zelf verkopen voor veel mensen toegankelijker.",
  },
];

export default function MakelaarOfZelfVerkopenPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Makelaar of zelf verkopen
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Makelaar of zelf verkopen: wat is slimmer?
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-neutral-600">
            Veel mensen staan voor dezelfde keuze: schakelt u een makelaar in,
            of verkoopt u uw huis zelf? Lange tijd leek het antwoord duidelijk.
            Maar dat verandert snel.
          </p>

          <p className="mt-4 max-w-2xl text-lg text-neutral-600">
            Steeds meer verkopers ontdekken dat zij een groot deel van het proces
            prima zelf kunnen doen — zeker met de juiste begeleiding, marketing
            en AI-ondersteuning.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/#calculator"
              className="rounded-full bg-emerald-600 px-6 py-3 text-white font-semibold"
            >
              Bereken uw besparing
            </Link>

            <Link
              href="/hoe-het-werkt"
              className="rounded-full border px-6 py-3 font-semibold"
            >
              Bekijk hoe het werkt
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-semibold">
          Het verschil tussen een makelaar en zelf verkopen
        </h2>

        <div className="mt-10 overflow-hidden rounded-3xl border">
          <div className="grid grid-cols-3 bg-neutral-100 p-4 font-semibold">
            <div></div>
            <div>Makelaar</div>
            <div>Zelf verkopen</div>
          </div>

          {verschillen.map((item) => (
            <div
              key={item.title}
              className="grid grid-cols-3 border-t p-4"
            >
              <div className="font-semibold">{item.title}</div>
              <div className="text-neutral-600">{item.makelaar}</div>
              <div className="text-neutral-600">{item.zelf}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-semibold">
            De grootste misvatting: de makelaar doet alles
          </h2>

          <div className="mt-6 space-y-6 text-neutral-700">
            <p>
              Veel verkopers denken dat een makelaar vrijwel alles uit handen
              neemt. In de praktijk blijkt dat u vaak zelf al veel doet.
            </p>

            <p>
              U maakt de woning verkoopklaar, levert informatie aan, denkt mee
              over de presentatie en bent degene die uiteindelijk beslissingen
              maakt.
            </p>

            <p>
              Het verschil is dus niet dat u niets doet. Het verschil is dat u
              het doet onder begeleiding van een makelaar.
            </p>
          </div>

          <h2 className="mt-12 text-3xl font-semibold">
            Waarom steeds meer mensen kiezen voor zelf verkopen
          </h2>

          <div className="mt-6 space-y-6 text-neutral-700">
            <p>
              De grootste reden is simpel: kosten. Courtage loopt al snel op tot
              duizenden euro’s.
            </p>

            <p>
              Maar daarnaast speelt iets anders mee. Mensen willen meer controle,
              meer inzicht en een eerlijker model.
            </p>

            <p>
              Met duidelijke stappen, marketing en AI wordt zelf verkopen voor
              steeds meer mensen een logische keuze.
            </p>
          </div>

          <h2 className="mt-12 text-3xl font-semibold">
            Wanneer is een makelaar wél logisch?
          </h2>

          <div className="mt-6 space-y-6 text-neutral-700">
            <p>
              Er zijn situaties waarin een makelaar nog steeds waardevol kan zijn.
              Bijvoorbeeld als u alles volledig wilt uitbesteden of weinig tijd heeft.
            </p>

            <p>
              Maar voor veel standaard woningverkopen is dat niet altijd meer nodig.
              Zeker niet als u bereid bent om een deel zelf te doen.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl bg-emerald-50 p-10">
          <h2 className="text-3xl font-semibold">
            Twijfelt u nog? Kijk eerst naar het verschil in geld
          </h2>

          <p className="mt-4 text-neutral-700">
            Voor veel verkopers valt het kwartje pas echt wanneer ze zien hoeveel
            ze kunnen besparen.
          </p>

          <Link
            href="/#calculator"
            className="mt-6 inline-block rounded-full bg-emerald-600 px-6 py-3 text-white font-semibold"
          >
            Bereken uw voordeel
          </Link>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-semibold">
            Veelgestelde vragen
          </h2>

          <div className="mt-8 space-y-4">
            {faqItems.map((item) => (
              <details key={item.question} className="rounded-xl border p-4">
                <summary className="font-semibold cursor-pointer">
                  {item.question}
                </summary>
                <p className="mt-3 text-neutral-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}