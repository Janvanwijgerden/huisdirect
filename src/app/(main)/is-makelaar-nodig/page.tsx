import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Is een makelaar nodig om je huis te verkopen? | HuisDirect",
  description:
    "Is een makelaar verplicht bij het verkopen van een huis? Ontdek wanneer een makelaar nuttig is, wanneer niet en waarom steeds meer mensen zelf verkopen met begeleiding en AI.",
  alternates: {
    canonical: "https://www.huisdirect.nl/is-makelaar-nodig",
  },
  openGraph: {
    title: "Is een makelaar nodig? | HuisDirect",
    description:
      "Lees of een makelaar echt nodig is om je huis te verkopen en wanneer zelf verkopen slimmer kan zijn.",
    url: "https://www.huisdirect.nl/is-makelaar-nodig",
    siteName: "HuisDirect",
    locale: "nl_NL",
    type: "article",
  },
};

const situaties = [
  {
    title: "Wanneer een makelaar NIET nodig is",
    items: [
      "Als u bereid bent zelf betrokken te zijn bij de verkoop",
      "Als u kosten wilt besparen",
      "Als u overzicht en controle wilt houden",
      "Als u gebruik maakt van begeleiding en tools",
    ],
  },
  {
    title: "Wanneer een makelaar WEL logisch kan zijn",
    items: [
      "Als u alles volledig wilt uitbesteden",
      "Als u geen tijd heeft om zelf iets te doen",
      "Als u maximale zekerheid wilt zonder zelf te verdiepen",
      "Bij complexe situaties (bijvoorbeeld scheiding of spoedverkoop)",
    ],
  },
];

const faqItems = [
  {
    question: "Is een makelaar verplicht in Nederland?",
    answer:
      "Nee. U bent niet verplicht om een makelaar in te schakelen bij het verkopen van uw woning.",
  },
  {
    question: "Waarom denken veel mensen dat een makelaar nodig is?",
    answer:
      "Omdat het jarenlang de standaard was. Veel mensen kennen geen alternatief en gaan er daarom automatisch vanuit dat een makelaar nodig is.",
  },
  {
    question: "Kan ik mijn huis zelf verkopen?",
    answer:
      "Ja. Steeds meer verkopers kiezen ervoor om zelf hun woning te verkopen, met begeleiding, stappenplannen en AI-ondersteuning.",
  },
  {
    question: "Loop ik risico zonder makelaar?",
    answer:
      "Niet automatisch. Het hangt vooral af van hoe goed u het proces organiseert. Met duidelijke stappen en begeleiding is het voor veel mensen goed te doen.",
  },
  {
    question: "Kan AI een makelaar vervangen?",
    answer:
      "AI vervangt niet alles, maar kan wel veel ondersteunen. Denk aan teksten, voorbereiding, structuur en uitleg van vervolgstappen.",
  },
];

export default function IsMakelaarNodigPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Is een makelaar nodig?
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Is een makelaar nodig om je huis te verkopen?
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-neutral-600">
            Dit is één van de meest gestelde vragen bij woningverkoop. En het
            eerlijke antwoord is simpel:
          </p>

          <p className="mt-4 max-w-2xl text-lg font-semibold text-neutral-900">
            Nee, een makelaar is niet verplicht.
          </p>

          <p className="mt-4 max-w-2xl text-lg text-neutral-600">
            Maar dat is niet de hele vraag. De echte vraag is:
            <strong> heeft u er één nodig?</strong>
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
          Waarom mensen denken dat een makelaar nodig is
        </h2>

        <div className="mt-6 space-y-6 text-neutral-700">
          <p>
            Voor veel mensen voelt een makelaar als vanzelfsprekend. Dat komt
            omdat het jarenlang de standaard was. Als je je huis wilde verkopen,
            schakelde je een makelaar in. Punt.
          </p>

          <p>
            Maar de wereld verandert. Informatie is toegankelijker geworden,
            technologie ontwikkelt zich snel en verkopers worden kritischer.
          </p>

          <p>
            Daardoor ontstaat een nieuwe realiteit: steeds meer mensen vragen
            zich af of dat oude model nog wel nodig is.
          </p>
        </div>

        <h2 className="mt-12 text-3xl font-semibold">
          De grootste misvatting: de makelaar doet alles
        </h2>

        <div className="mt-6 space-y-6 text-neutral-700">
          <p>
            Veel verkopers denken dat een makelaar alles uit handen neemt. In de
            praktijk blijkt dat u vaak zelf al veel doet.
          </p>

          <p>
            U maakt de woning verkoopklaar, levert informatie aan, bent aanwezig
            bij bezichtigingen en maakt uiteindelijk zelf de belangrijkste keuzes.
          </p>

          <p>
            Het verschil zit vooral in begeleiding — niet in het werk zelf.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-semibold">
            Wanneer is een makelaar nodig?
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {situaties.map((blok) => (
              <div
                key={blok.title}
                className="rounded-3xl border p-6"
              >
                <h3 className="text-xl font-semibold">{blok.title}</h3>

                <ul className="mt-4 space-y-3 text-neutral-700">
                  {blok.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-semibold">
          Waarom steeds meer mensen zonder makelaar verkopen
        </h2>

        <div className="mt-6 space-y-6 text-neutral-700">
          <p>
            De grootste reden is kostenbesparing. Courtage loopt vaak op tot
            duizenden euro’s.
          </p>

          <p>
            Maar er speelt meer. Mensen willen controle, transparantie en een
            eerlijker model.
          </p>

          <p>
            Met begeleiding, marketing en AI wordt zelf verkopen steeds
            toegankelijker. Daardoor verschuift de markt langzaam.
          </p>
        </div>

        <div className="mt-10 rounded-3xl bg-emerald-50 p-10">
          <h3 className="text-2xl font-semibold">
            Twijfelt u nog? Kijk eerst naar het verschil in geld
          </h3>

          <p className="mt-4 text-neutral-700">
            Voor veel verkopers valt het kwartje pas wanneer ze zien hoeveel ze
            kunnen besparen.
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

      <section className="border-t bg-neutral-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-3xl font-semibold">
              Wilt u slimmer verkopen?
            </h2>
            <p className="mt-2 text-neutral-300">
              Ontdek hoeveel u kunt besparen zonder makelaar.
            </p>
          </div>

          <div className="flex gap-4">
            <Link
              href="/#calculator"
              className="rounded-full bg-emerald-500 px-6 py-3 font-semibold"
            >
              Start calculator
            </Link>

            <Link
              href="/zelf-huis-verkopen"
              className="rounded-full border px-6 py-3 font-semibold"
            >
              Lees meer
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}