import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Courtage makelaar | Wat is courtage en hoeveel betaal je? | HuisDirect",
  description:
    "Wat is courtage van een makelaar en hoeveel betaal je bij verkoop van je woning? Ontdek hoe courtage werkt, wat gebruikelijk is en hoe je duizenden euro’s kunt besparen.",
  alternates: {
    canonical: "https://www.huisdirect.nl/courtage-makelaar",
  },
  openGraph: {
    title: "Courtage makelaar | HuisDirect",
    description:
      "Lees wat makelaarscourtage is, hoe het berekend wordt en waarom veel verkopers zoeken naar een slimmer alternatief.",
    url: "https://www.huisdirect.nl/courtage-makelaar",
    siteName: "HuisDirect",
    locale: "nl_NL",
    type: "article",
  },
};

const voorbeelden = [
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
    courtage: "1,10%",
    kosten: "€7.150",
  },
];

const faqItems = [
  {
    question: "Wat is courtage van een makelaar?",
    answer:
      "Courtage is de vergoeding die een makelaar meestal rekent voor het verkopen van een woning. Vaak is dit een percentage van de uiteindelijke verkoopprijs.",
  },
  {
    question: "Hoe hoog is courtage gemiddeld?",
    answer:
      "Dat verschilt per makelaar en regio, maar vaak ligt de courtage ergens rond de 1% tot 1,5% van de verkoopprijs. Bij hogere woningwaardes loopt het bedrag daardoor snel op.",
  },
  {
    question: "Betaal je altijd courtage als je een makelaar gebruikt?",
    answer:
      "Vaak wel, maar niet altijd. Sommige makelaars werken met een vast tarief. Toch is courtage nog steeds een veelgebruikte manier om makelaarskosten te berekenen.",
  },
  {
    question: "Komen er naast courtage nog extra kosten bij?",
    answer:
      "Dat gebeurt regelmatig. Denk aan opstartkosten, fotografie, promotie, meetrapporten of aanvullende pakketten. Kijk daarom altijd naar het totaalbedrag en niet alleen naar het percentage.",
  },
  {
    question: "Kan ik courtage vermijden?",
    answer:
      "Ja. Door uw woning zonder traditionele makelaar te verkopen of te kiezen voor een slimmer platform, kunt u vaak een groot deel van die kosten vermijden.",
  },
];

export default function CourtageMakelaarPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Courtage makelaar
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Wat is courtage van een makelaar en hoeveel kost het?
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              Veel verkopers horen het woord courtage, maar weten niet precies
              wat het betekent. Toch is dit vaak de grootste kostenpost bij het
              verkopen van een woning via een traditionele makelaar.
            </p>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600">
              Op deze pagina leest u wat makelaarscourtage is, hoe het wordt
              berekend, hoeveel u ongeveer betaalt en waarom steeds meer
              verkopers kijken naar een slimmer alternatief.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#calculator"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Bereken uw besparing
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
              Kort voorbeeld
            </p>

            <div className="mt-4 rounded-2xl bg-neutral-950 p-6 text-white">
              <p className="text-sm text-neutral-300">Woningwaarde</p>
              <p className="mt-1 text-3xl font-semibold">€500.000</p>

              <div className="mt-5 h-px bg-white/10" />

              <p className="mt-5 text-sm text-neutral-300">
                Bij 1,25% courtage betaalt u ongeveer
              </p>
              <p className="mt-1 text-4xl font-semibold text-emerald-400">
                €6.250
              </p>

              <p className="mt-4 text-sm text-neutral-400">
                En vaak komen daar nog extra kosten bovenop.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-950">
              Courtage is meestal een percentage
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              Veel makelaars rekenen een percentage van de uiteindelijke
              verkoopprijs. Hoe hoger uw woning verkoopt, hoe hoger de rekening
              meestal wordt.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-950">
              Het bedrag loopt sneller op dan u denkt
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              Bij woningen van enkele tonnen gaat het al snel om duizenden
              euro’s. Veel verkopers onderschatten dat bedrag vooraf.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-950">
              Inzicht geeft betere keuzes
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              Wie begrijpt hoe courtage werkt, kijkt kritischer naar de vraag
              of een traditionele makelaar die kosten echt waard is.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
                Wat betekent courtage precies?
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
                <p>
                  Courtage is de vergoeding die een makelaar rekent voor zijn of
                  haar werkzaamheden bij de verkoop van een woning. In veel
                  gevallen wordt die vergoeding berekend als een percentage van
                  de uiteindelijke verkoopprijs.
                </p>

                <p>
                  Dat klinkt op het eerste gezicht overzichtelijk. Maar juist
                  daardoor voelen veel verkopers later pas hoe fors die kosten
                  kunnen worden. Want als uw woning meer oplevert, stijgt de
                  vergoeding van de makelaar automatisch mee.
                </p>

                <p>
                  Psychologisch voelt dat voor veel mensen scheef. Natuurlijk is
                  het prettig als uw woning goed verkoopt, maar het blijft de
                  vraag of een oplopende rekening altijd in verhouding staat tot
                  de echte meerwaarde van de makelaar.
                </p>
              </div>

              <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
                Hoe wordt makelaarscourtage berekend?
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
                <p>
                  Meestal wordt courtage berekend door het afgesproken
                  percentage te vermenigvuldigen met de uiteindelijke
                  verkoopprijs van uw woning. Verkoopt u uw huis voor €400.000
                  en rekent de makelaar 1,35% courtage? Dan betaalt u ongeveer
                  €5.400.
                </p>

                <p>
                  Dat lijkt misschien nog overzichtelijk, maar bij hogere
                  woningwaardes lopen de bedragen snel verder op. Verkoopt u uw
                  woning voor €650.000, dan zit u zelfs bij een lager percentage
                  al snel boven de €7.000.
                </p>

                <p>
                  Daarom is niet alleen het percentage belangrijk, maar vooral
                  het daadwerkelijke eindbedrag. Veel verkopers focussen eerst
                  op 1,1% of 1,3%, terwijl het echte gevoel pas komt als ze het
                  absolute bedrag zien.
                </p>
              </div>
            </div>

            <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Slim vergelijken
              </p>

              <h3 className="mt-3 text-2xl font-semibold text-neutral-950">
                Eerst weten wat u mogelijk kunt besparen?
              </h3>

              <p className="mt-4 text-sm leading-7 text-neutral-700">
                Gebruik de calculator en ontdek hoeveel geld u mogelijk
                overhoudt als u niet voor traditionele makelaarscourtage kiest.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-neutral-800">
                <li>• direct inzicht in kostenverschil</li>
                <li>• geen verplichtingen</li>
                <li>• duidelijker beslissen</li>
              </ul>

              <Link
                href="/#calculator"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Bereken uw besparing
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Voorbeelden van courtage bij verschillende woningwaardes
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-600">
              Onderstaande voorbeelden laten zien hoe snel courtage oploopt,
              zelfs als het percentage daalt bij hogere woningwaardes.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-neutral-200 bg-white">
            <div className="grid grid-cols-3 border-b border-neutral-200 bg-neutral-100 px-5 py-4 text-sm font-semibold text-neutral-700">
              <div>Woningwaarde</div>
              <div>Courtage</div>
              <div>Kosten</div>
            </div>

            {voorbeelden.map((voorbeeld) => (
              <div
                key={`${voorbeeld.woningwaarde}-${voorbeeld.courtage}`}
                className="grid grid-cols-3 border-b border-neutral-200 px-5 py-4 text-sm text-neutral-700 last:border-b-0"
              >
                <div className="font-medium text-neutral-950">
                  {voorbeeld.woningwaarde}
                </div>
                <div>{voorbeeld.courtage}</div>
                <div className="font-semibold text-emerald-700">
                  {voorbeeld.kosten}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-neutral-500">
            Dit zijn rekenvoorbeelden. Werkelijke tarieven verschillen per
            makelaar, regio en pakket.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Waarom voelt courtage voor veel verkopers steeds minder logisch?
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Vroeger werd een makelaar bijna automatisch ingeschakeld. Maar
                verkopers zijn kritischer geworden. Niet omdat begeleiding nooit
                waarde heeft, maar omdat de kosten tegenwoordig beter zichtbaar
                zijn en woningprijzen veel hoger liggen dan vroeger.
              </p>

              <p>
                Daardoor ontstaat vaker dezelfde vraag: waarom zou u duizenden
                euro’s betalen als u ook zelf veel regie kunt houden en moderne
                tools een groot deel van het proces ondersteunen?
              </p>

              <p>
                Dat betekent niet dat een makelaar nooit nuttig kan zijn. Het
                betekent wel dat courtage niet meer automatisch logisch voelt.
                Zeker niet als u ziet hoeveel geld er mogelijk blijft hangen
                wanneer u slimmer verkoopt.
              </p>
            </div>

            <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
              Komen er naast courtage nog andere kosten bij?
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Regelmatig wel. Denk aan opstartkosten, fotografie, meetrapporten,
                promotie, styling of extra pakketten. Daardoor is het gevaarlijk
                om alleen naar het percentage te kijken.
              </p>

              <p>
                Het echte beslismoment zit in het totaalbedrag. Pas dan kunt u
                eerlijk vergelijken wat een traditionele makelaar kost en wat
                een slimmer alternatief u kan opleveren.
              </p>
            </div>

            <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
              Is een lager percentage automatisch een goede deal?
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Niet altijd. Een iets lager percentage klinkt aantrekkelijk,
                maar zegt weinig zonder context. Bij een hoge woningwaarde kan
                ook een laag percentage nog steeds een stevig bedrag zijn.
              </p>

              <p>
                Bovendien moet u altijd kijken wat wel en niet inbegrepen is.
                Soms lijkt een tarief scherp, maar komen essentiële onderdelen
                later alsnog als extra kosten terug.
              </p>

              <p>
                Daarom is het verstandiger om niet alleen op percentages te
                vergelijken, maar op het totale plaatje: kosten, duidelijkheid,
                controle en wat u daar werkelijk voor terugkrijgt.
              </p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-neutral-950">
                Ook interessant
              </h3>

              <p className="mt-4 text-sm leading-7 text-neutral-600">
                Wilt u eerst breder begrijpen hoe verkopen zonder makelaar
                werkt? Lees dan ook onze pagina over zelf uw huis verkopen.
              </p>

              <Link
                href="/huis-verkopen-zonder-makelaar"
                className="mt-6 inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
              >
                Lees meer →
              </Link>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-neutral-950">
                Eerst overzicht in het proces?
              </h3>

              <p className="mt-4 text-sm leading-7 text-neutral-600">
                Bekijk ook het huis verkopen stappenplan als u wilt zien welke
                stappen belangrijk zijn en in welke volgorde.
              </p>

              <Link
                href="/huis-verkopen-stappenplan"
                className="mt-6 inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
              >
                Bekijk het stappenplan →
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 lg:p-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Wilt u eerst weten wat courtage u mogelijk kost?
            </h2>

            <p className="mt-4 text-base leading-8 text-neutral-700">
              Veel verkopers maken pas echt een keuze als zij zwart op wit zien
              hoeveel geld er naar makelaarskosten gaat en hoeveel zij mogelijk
              kunnen besparen.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#calculator"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Ga naar de calculator
              </Link>

              <Link
                href="/hoe-het-werkt"
                className="inline-flex items-center justify-center rounded-full border border-emerald-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
              >
                Lees hoe HuisDirect werkt
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Veelgestelde vragen over courtage makelaar
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
              Wilt u slimmer verkopen en kosten besparen?
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-300">
              Ontdek hoeveel u mogelijk overhoudt als u niet automatisch kiest
              voor traditionele makelaarscourtage.
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
              href="/huis-verkopen-zonder-makelaar"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Lees over zonder makelaar verkopen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}