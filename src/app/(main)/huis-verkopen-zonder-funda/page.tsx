import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Huis verkopen zonder Funda | Slim verkopen met bereik en marketing | HuisDirect",
  description:
    "Uw huis verkopen zonder Funda? Ontdek hoe u ook zonder groot woningplatform kopers kunt bereiken met slimme presentatie, gerichte marketing, duidelijke begeleiding en AI.",
  alternates: {
    canonical: "https://www.huisdirect.nl/huis-verkopen-zonder-funda",
  },
  openGraph: {
    title: "Huis verkopen zonder Funda | HuisDirect",
    description:
      "Lees hoe u uw huis ook zonder Funda zichtbaar kunt maken met gerichte marketing, goede presentatie en slimme begeleiding.",
    url: "https://www.huisdirect.nl/huis-verkopen-zonder-funda",
    siteName: "HuisDirect",
    locale: "nl_NL",
    type: "article",
  },
};

const voordelen = [
  {
    title: "Bereik draait om de juiste kopers",
    text: "Een woning verkopen draait niet alleen om op een groot platform staan, maar vooral om zichtbaar zijn bij mensen die echt interesse hebben in uw type woning en regio.",
  },
  {
    title: "Gerichte marketing kan zeer efficiënt zijn",
    text: "Met slimme online marketing kunt u uw woning heel gericht onder de aandacht brengen. Voor veel verkopers voelt dat logischer dan hoge vaste makelaarskosten betalen.",
  },
  {
    title: "Goede presentatie blijft de basis",
    text: "Ook zonder Funda zijn sterke foto’s, een duidelijke woningtekst, complete informatie en snelle communicatie essentieel voor vertrouwen en resultaat.",
  },
];

const stappen = [
  {
    title: "Zorg dat uw woning sterk gepresenteerd wordt",
    text: "Zonder sterke presentatie heeft bereik minder waarde. Foto’s, woningtekst, heldere kenmerken en een goede eerste indruk blijven de basis.",
  },
  {
    title: "Bepaal wie uw ideale koper is",
    text: "Niet iedere woning hoeft aan iedereen getoond te worden. Vaak is het slimmer om gericht de juiste doelgroep te bereiken dan breed en algemeen zichtbaar te zijn.",
  },
  {
    title: "Gebruik gerichte online marketing",
    text: "Met slimme promotie kunt u uw woning onder de aandacht brengen bij mensen die zoeken in uw regio of passen bij het type woning dat u verkoopt.",
  },
  {
    title: "Werk met duidelijke begeleiding",
    text: "Zelf verkopen betekent niet dat u alles blind hoeft uit te vinden. Een goed stappenplan, duidelijke instructies en slimme ondersteuning maken veel verschil.",
  },
  {
    title: "Gebruik AI waar dat tijd en duidelijkheid oplevert",
    text: "AI kan helpen bij woningteksten, structuur, voorbereiding op bezichtigingen en het logisch maken van vervolgstappen.",
  },
];

const faqItems = [
  {
    question: "Kan ik mijn huis verkopen zonder Funda?",
    answer:
      "Ja. U bent niet verplicht om Funda te gebruiken om uw woning te verkopen. De belangrijkste vraag is niet alleen waar uw woning staat, maar hoe u serieuze kopers bereikt en vertrouwen opbouwt.",
  },
  {
    question: "Heb ik Funda nodig om genoeg bereik te krijgen?",
    answer:
      "Niet per se. Voor veel woningen is gericht bereik belangrijker dan alleen algemene zichtbaarheid. Met sterke presentatie en slimme marketing kunt u zeer relevant bereik opbouwen.",
  },
  {
    question: "Kan marketing een alternatief zijn voor Funda?",
    answer:
      "Voor veel verkopers wel. Gerichte online marketing kan uw woning zichtbaar maken bij de juiste doelgroep, vaak voor een veel lager budget dan traditionele makelaarskosten.",
  },
  {
    question: "Is huis verkopen zonder Funda moeilijker?",
    answer:
      "Niet automatisch. Het vraagt vooral om een andere manier van denken: minder leunen op één platform en meer sturen op presentatie, bereik, communicatie en begeleiding.",
  },
  {
    question: "Kan AI helpen als ik zonder Funda verkoop?",
    answer:
      "Ja. AI kan helpen bij woningteksten, structuur, voorbereiding en duidelijke uitleg van vervolgstappen. Daardoor wordt zelf verkopen voor veel mensen toegankelijker.",
  },
];

export default function HuisVerkopenZonderFundaPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Huis verkopen zonder Funda
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Huis verkopen zonder Funda: kan dat en is het slim?
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              Veel verkopers hebben het gevoel dat een woning pas echt serieus in
              de markt staat als die op Funda verschijnt. Dat idee is begrijpelijk,
              maar het is niet het hele verhaal. Uiteindelijk draait een goede
              verkoop niet alleen om één platform, maar om{" "}
              <strong className="text-neutral-950">
                bereik, vertrouwen en de juiste presentatie
              </strong>.
            </p>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600">
              Daardoor kijken steeds meer verkopers anders naar woningverkoop.
              Niet automatisch denken in het oude model, maar slimmer kijken naar
              hoe u uw woning zichtbaar maakt, kopers bereikt en kosten laag houdt.
              Met gerichte marketing, duidelijke begeleiding en AI wordt dat voor
              steeds meer mensen haalbaar.
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
              De kern van deze keuze
            </p>

            <div className="mt-4 rounded-2xl bg-neutral-950 p-6 text-white">
              <p className="text-sm text-neutral-300">Waar het echt om draait</p>

              <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-200">
                <li>• de juiste kopers bereiken</li>
                <li>• vertrouwen opbouwen met sterke presentatie</li>
                <li>• niet onnodig veel kosten maken</li>
                <li>• zelf meer regie houden</li>
                <li>• technologie slim inzetten waar dat helpt</li>
              </ul>

              <div className="mt-5 h-px bg-white/10" />

              <p className="mt-5 text-sm text-neutral-300">
                Eerst zien hoeveel u mogelijk kunt besparen?
              </p>

              <Link
                href="/#calculator"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                Start de calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {voordelen.map((voordeel) => (
            <div
              key={voordeel.title}
              className="rounded-3xl border border-neutral-200 bg-white p-6"
            >
              <h2 className="text-lg font-semibold text-neutral-950">
                {voordeel.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">
                {voordeel.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
                Waarom veel mensen denken dat Funda onmisbaar is
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
                <p>
                  Voor veel Nederlanders is Funda jarenlang dé plek geweest waar
                  huizen werden bekeken. Daardoor is er een sterk gevoel ontstaan
                  dat Funda en woningverkoop onlosmakelijk met elkaar verbonden
                  zijn. Dat maakt het logisch dat verkopers denken dat ze zonder
                  Funda automatisch bereik missen.
                </p>

                <p>
                  Maar achter dat gevoel zit vaak iets anders. Mensen zijn meestal
                  niet verliefd op een platform. Ze willen vooral dat hun woning
                  wordt gezien door serieuze kopers, dat de presentatie klopt en
                  dat het verkoopproces vertrouwen uitstraalt.
                </p>

                <p>
                  Zodra u dat onderscheid ziet, verandert ook de vraag. Dan gaat
                  het niet meer alleen om{" "}
                  <em>“moet ik op Funda staan?”</em>, maar om{" "}
                  <strong className="text-neutral-950">
                    “hoe bereik ik slim de juiste mensen?”
                  </strong>
                  .
                </p>
              </div>

              <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
                Het gaat niet alleen om zichtbaarheid, maar om relevant bereik
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
                <p>
                  Een groot platform klinkt aantrekkelijk omdat het veel
                  zichtbaarheid suggereert. Maar veel zichtbaarheid is niet
                  automatisch hetzelfde als effectief bereik. Voor veel woningen
                  is het veel belangrijker dat de juiste doelgroep uw woning ziet
                  dan dat zo veel mogelijk mensen er vluchtig langs scrollen.
                </p>

                <p>
                  Met gerichte online marketing kunt u uw woning veel specifieker
                  onder de aandacht brengen. Denk aan mensen die zoeken in een
                  bepaalde regio, een bepaald woningtype interessant vinden of op
                  korte termijn willen kopen. Dat is een andere vorm van bereik,
                  maar voor veel verkopers juist een slimmere vorm.
                </p>

                <p>
                  Daarom voelt dit voor steeds meer mensen logischer: niet blind
                  vertrouwen op een traditioneel model, maar nadenken over waar uw
                  ideale koper zich bevindt en hoe u die gericht bereikt.
                </p>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Gerichter bereik
                </p>

                <h3 className="mt-3 text-2xl font-semibold text-neutral-950">
                  Marketing kan voor veel woningen een krachtig alternatief zijn
                </h3>

                <p className="mt-4 text-sm leading-7 text-neutral-700">
                  Het gaat uiteindelijk niet om alleen ergens staan, maar om de
                  juiste kopers bereiken. Gerichte marketing kan dat voor veel
                  verkopers interessant en betaalbaar maken.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-neutral-800">
                  <li>• gerichter zichtbaar zijn</li>
                  <li>• meer grip op uw budget</li>
                  <li>• vaak veel lager geprijsd dan traditionele courtage</li>
                </ul>

                <Link
                  href="/#calculator"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Bereken uw voordeel
                </Link>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white p-6">
                <h3 className="text-xl font-semibold text-neutral-950">
                  Ook interessant
                </h3>

                <p className="mt-4 text-sm leading-7 text-neutral-600">
                  Wilt u eerst begrijpen hoe zelf verkopen zonder traditionele
                  makelaar werkt? Lees dan ook onze pagina over zelf uw huis
                  verkopen.
                </p>

                <Link
                  href="/zelf-huis-verkopen"
                  className="mt-6 inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                >
                  Lees meer →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
            Hoe u zonder Funda toch sterk kunt verkopen
          </h2>
          <p className="mt-4 text-base leading-8 text-neutral-600">
            Zonder Funda verkopen betekent niet dat u minder serieus verkoopt.
            Het betekent vooral dat u slimmer moet nadenken over presentatie,
            doelgroep, begeleiding en bereik.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {stappen.map((stap) => (
            <div
              key={stap.title}
              className="rounded-3xl border border-neutral-200 bg-white p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-950">
                {stap.title}
              </h3>
              <p className="mt-4 text-base leading-8 text-neutral-700">
                {stap.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Veel verkopers doen sowieso al veel zelf
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Ook als u met een makelaar werkt, doet u in de praktijk vaak al
                veel zelf. U maakt de woning verkoopklaar, levert informatie aan,
                denkt mee over de presentatie, bent beschikbaar voor vragen en
                maakt uiteindelijk zelf de belangrijkste keuzes.
              </p>

              <p>
                Het verschil is dus vaak niet dat u niets doet en iemand anders
                alles overneemt. Het verschil is vaker dat u veel doet onder
                instructie of begeleiding van een makelaar. En precies daar
                verandert nu veel.
              </p>

              <p>
                Wat vroeger vooral via een makelaar liep, kan nu steeds beter
                worden ondersteund met een duidelijk stappenplan, slimme software
                en AI-advies. Daardoor voelt zelf verkopen voor steeds meer
                verkopers niet meer als onrealistisch, maar als modern en logisch.
              </p>
            </div>

            <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
              AI en begeleiding maken de drempel steeds kleiner
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Veel mensen hebben vooral behoefte aan overzicht: wat moet eerst,
                waar moet ik op letten, hoe schrijf ik een goede tekst en hoe
                houd ik structuur in het proces? Dat is precies waar technologie
                steeds nuttiger wordt.
              </p>

              <p>
                AI kan helpen bij woningteksten, voorbereiding, checklists,
                samenvattingen en het uitleggen van vervolgstappen. Dat betekent
                niet dat alles automatisch vanzelf gaat, maar wel dat de oude
                afhankelijkheid van één traditionele tussenpersoon minder groot
                wordt.
              </p>

              <p>
                De beweging is duidelijk: voor steeds meer verkopers verschuift
                het van volledig uitbesteden naar zelf de regie houden met slimme
                ondersteuning op de momenten die ertoe doen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 lg:p-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Wilt u eerst weten hoeveel u mogelijk kunt besparen?
            </h2>

            <p className="mt-4 text-base leading-8 text-neutral-700">
              Veel verkopers maken pas echt een andere keuze zodra zij zwart op
              wit zien hoeveel geld er mogelijk overblijft als zij slimmer
              verkopen.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#calculator"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Ga naar de calculator
              </Link>

              <Link
                href="/funda-zonder-makelaar"
                className="inline-flex items-center justify-center rounded-full border border-emerald-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
              >
                Lees over Funda zonder makelaar
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Veelgestelde vragen over huis verkopen zonder Funda
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
              Wilt u slimmer verkopen?
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-300">
              Ontdek hoeveel u mogelijk overhoudt als u niet automatisch kiest
              voor het traditionele makelaarsmodel.
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
              href="/zelf-huis-verkopen"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Lees over zelf huis verkopen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}