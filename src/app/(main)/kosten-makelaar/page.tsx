import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kosten makelaar berekenen | Wat kost een makelaar? | HuisDirect",
  description:
    "Wat kost een makelaar bij het verkopen van je huis? Bekijk gemiddelde makelaarskosten, rekenvoorbeelden en ontdek hoe je kunt besparen met HuisDirect.",
};

const examples = [
  {
    woningwaarde: "€300.000",
    courtage: "1,55%",
    kosten: "€4.650",
  },
  {
    woningwaarde: "€400.000",
    courtage: "1,35%",
    kosten: "€5.400",
  },
  {
    woningwaarde: "€500.000",
    courtage: "1,25%",
    kosten: "€6.250",
  },
  {
    woningwaarde: "€650.000",
    courtage: "1,1%",
    kosten: "€7.150",
  },
];

const faqItems = [
  {
    question: "Wat kost een makelaar gemiddeld?",
    answer:
      "Dat hangt af van de woningwaarde en het tarief van de makelaar. Vaak betaal je een courtage van ongeveer 1% tot 1,5% van de verkoopprijs, soms aangevuld met opstartkosten of extra pakketten.",
  },
  {
    question: "Betaal je een makelaar altijd een percentage?",
    answer:
      "Nee. Sommige makelaars werken met een vast tarief, maar veel verkopende makelaars rekenen nog steeds een percentage van de uiteindelijke verkoopprijs.",
  },
  {
    question: "Zijn er naast courtage nog extra kosten?",
    answer:
      "Vaak wel. Denk aan opstartkosten, fotografie, meetrapporten, promotie of aanvullende diensten. Het is belangrijk om altijd te vragen wat wel en niet in de prijs zit.",
  },
  {
    question: "Kan ik mijn huis ook zonder makelaar verkopen?",
    answer:
      "Ja. Met HuisDirect houd jij de regie over de verkoop en zorgen wij dat alles klopt. Zo kun je besparen op makelaarskosten zonder het overzicht te verliezen.",
  },
];

export default function KostenMakelaarPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Kosten makelaar
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Wat kost een makelaar bij het verkopen van je huis?
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              Veel mensen schakelen automatisch een makelaar in. Maar wat kost
              dat eigenlijk echt? Op deze pagina zie je wat gebruikelijke
              makelaarskosten zijn, hoe courtage werkt en hoeveel je mogelijk
              kunt besparen.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#calculator"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Bereken je besparing
              </Link>

              <Link
                href="/hoe-het-werkt"
                className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:border-neutral-400 hover:bg-neutral-100"
              >
                Bekijk hoe het werkt
              </Link>
            </div>
          </div>

          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-neutral-500">
              Snel voorbeeld
            </p>

            <div className="mt-4 rounded-2xl bg-neutral-950 p-6 text-white">
              <p className="text-sm text-neutral-300">Woningwaarde</p>
              <p className="mt-1 text-3xl font-semibold">€400.000</p>

              <div className="mt-5 h-px bg-white/10" />

              <p className="mt-5 text-sm text-neutral-300">
                Bij 1,35% courtage betaal je ongeveer
              </p>
              <p className="mt-1 text-4xl font-semibold text-emerald-400">
                €5.400
              </p>

              <p className="mt-4 text-sm text-neutral-400">
                En dat is nog zonder eventuele extra kosten.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-950">
              Courtage is vaak procentueel
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              Veel verkopende makelaars rekenen een percentage van de
              verkoopprijs. Hoe hoger de verkoopprijs, hoe hoger vaak ook de
              rekening.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-950">
              Extra kosten komen er soms bovenop
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              Denk aan fotografie, promotie, meetrapporten of opstartkosten.
              Vraag altijd goed na wat inbegrepen is en wat niet.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-950">
              Besparen begint met inzicht
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              Veel verkopers weten pas laat wat een makelaar echt kost. Door dit
              vooraf te berekenen kun je een betere keuze maken.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Voorbeelden van makelaarskosten
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-600">
              Onderstaande voorbeelden laten zien hoe snel de kosten kunnen
              oplopen als een makelaar met courtage werkt.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-neutral-200 bg-white">
            <div className="grid grid-cols-3 border-b border-neutral-200 bg-neutral-100 px-5 py-4 text-sm font-semibold text-neutral-700 sm:grid-cols-3">
              <div>Woningwaarde</div>
              <div>Courtage</div>
              <div>Kosten makelaar</div>
            </div>

            {examples.map((example) => (
              <div
                key={`${example.woningwaarde}-${example.courtage}`}
                className="grid grid-cols-3 border-b border-neutral-200 px-5 py-4 text-sm text-neutral-700 last:border-b-0"
              >
                <div className="font-medium text-neutral-950">
                  {example.woningwaarde}
                </div>
                <div>{example.courtage}</div>
                <div className="font-semibold text-emerald-700">
                  {example.kosten}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-neutral-500">
            Dit zijn voorbeelden. Werkelijke kosten verschillen per makelaar,
            regio en pakket.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Hoe worden makelaarskosten opgebouwd?
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                De meeste verkopers kijken eerst naar de vraag:{" "}
                <strong>wat kost een makelaar?</strong> Het eerlijke antwoord is:
                dat hangt af van het model dat de makelaar gebruikt. Sommige
                makelaars werken met een vaste prijs, maar vaak zie je nog een
                courtage op basis van de verkoopprijs.
              </p>

              <p>
                Dat lijkt overzichtelijk, maar juist bij hogere woningwaardes
                lopen de kosten snel op. Verkoop je een woning van €500.000 en
                rekent de makelaar 1,35% courtage? Dan kom je al snel uit op{" "}
                <strong>€6.750</strong>.
              </p>

              <p>
                Daarnaast zijn er regelmatig aanvullende kosten. Denk aan
                fotografie, woningpresentatie, promotie of andere losse
                diensten. Daarom is het slim om niet alleen naar het percentage
                te kijken, maar naar het totaalplaatje.
              </p>

              <p>
                Met HuisDirect kies je voor een andere aanpak. Jij houdt de
                regie over de verkoop en wij zorgen dat alles klopt. Daardoor
                kun je vaak fors besparen op de kosten die normaal naar een
                makelaar gaan.
              </p>
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Besparen met HuisDirect
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-neutral-950">
              Eerst weten wat je mogelijk bespaart?
            </h3>

            <p className="mt-4 text-sm leading-7 text-neutral-700">
              Gebruik onze calculator en ontdek hoeveel makelaarskosten je
              mogelijk kunt vermijden.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-neutral-800">
              <li>• inzicht in mogelijke besparing</li>
              <li>• geen verplichtingen</li>
              <li>• jij houdt de regie</li>
            </ul>

            <Link
              href="/#calculator"
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Bereken je besparing
            </Link>
          </aside>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Veelgestelde vragen over kosten van een makelaar
            </h2>
          </div>

          <div className="mt-8 divide-y divide-neutral-200 overflow-hidden rounded-3xl border border-neutral-200">
            {faqItems.map((item) => (
              <details key={item.question} className="group bg-white p-6">
                <summary className="cursor-pointer list-none text-lg font-semibold text-neutral-950">
                  {item.question}
                </summary>
                <p className="mt-4 max-w-4xl text-sm leading-7 text-neutral-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-950">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Benieuwd hoeveel jij kunt besparen?
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-300">
              Bereken je mogelijke besparing en ontdek of een traditionele
              makelaar voor jouw situatie wel nodig is.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#calculator"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
            >
              Start de calculator
            </Link>

            <Link
              href="/hoe-het-werkt"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Lees hoe het werkt
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}