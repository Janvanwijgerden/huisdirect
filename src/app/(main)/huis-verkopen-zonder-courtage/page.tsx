import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Huis verkopen zonder courtage | Bespaar makelaarskosten en houd regie | HuisDirect",
  description:
    "Uw huis verkopen zonder courtage? Ontdek hoe u duizenden euro’s aan makelaarskosten kunt besparen, waarom steeds meer verkopers afscheid nemen van het oude model en hoe slimme begeleiding en AI zelf verkopen toegankelijker maken.",
  alternates: {
    canonical: "https://www.huisdirect.nl/huis-verkopen-zonder-courtage",
  },
  openGraph: {
    title: "Huis verkopen zonder courtage | HuisDirect",
    description:
      "Lees hoe u uw huis kunt verkopen zonder courtage, waarom dat voor veel verkopers logischer voelt en hoe begeleiding, marketing en AI daarbij helpen.",
    url: "https://www.huisdirect.nl/huis-verkopen-zonder-courtage",
    siteName: "HuisDirect",
    locale: "nl_NL",
    type: "article",
  },
};

const voordelen = [
  {
    title: "Duizenden euro’s besparen",
    text: "Courtage lijkt een klein percentage, maar bij de verkoop van een woning loopt het bedrag vaak snel op tot duizenden euro’s.",
  },
  {
    title: "Meer grip op uw eigen opbrengst",
    text: "Zonder courtage blijft er meer van de verkoopprijs over. Dat voelt voor veel verkopers eerlijker en logischer.",
  },
  {
    title: "Zelf de regie houden",
    text: "Steeds meer verkopers ontdekken dat zij veel van het proces prima zelf kunnen doen, zeker met duidelijke begeleiding en slimme ondersteuning.",
  },
];

const blokken = [
  {
    title: "Vraagprijs en positionering",
    text: "Een goede verkoop begint met de juiste vraagprijs en een duidelijke positionering van uw woning. Dat is belangrijk, maar hoeft niet automatisch te betekenen dat u een percentage van de verkoopprijs moet afstaan.",
  },
  {
    title: "Presentatie en woningtekst",
    text: "Sterke foto’s, een goede woningomschrijving en complete informatie maken een groot verschil. Met slimme tools en AI wordt dit voor steeds meer verkopers goed te organiseren.",
  },
  {
    title: "Bezichtigingen en contact met kopers",
    text: "Veel verkopers zijn juist sterk in bezichtigingen, omdat zij hun woning en buurt het beste kennen. Direct contact kan bovendien zorgen voor meer vertrouwen en snelheid.",
  },
  {
    title: "Onderhandelen en keuzes maken",
    text: "Ook bij biedingen draait het vooral om overzicht, rust en duidelijke afwegingen. Niet alleen om ervaring, maar om structuur en goede begeleiding op het juiste moment.",
  },
  {
    title: "Marketing en bereik",
    text: "Zichtbaarheid is belangrijk, maar het gaat vooral om de juiste kopers bereiken. Gerichte marketing kan daarbij voor veel woningen een sterk en betaalbaar alternatief zijn.",
  },
  {
    title: "AI en slimme begeleiding",
    text: "AI kan helpen bij teksten, voorbereiding, structuur, uitleg van vervolgstappen en het overzichtelijk maken van keuzes. Daardoor wordt zelf verkopen voor veel mensen toegankelijker.",
  },
];

const faqItems = [
  {
    question: "Wat betekent huis verkopen zonder courtage?",
    answer:
      "Dat betekent dat u geen traditioneel courtagepercentage aan een makelaar betaalt over de uiteindelijke verkoopprijs van uw woning.",
  },
  {
    question: "Hoeveel kan ik besparen zonder courtage?",
    answer:
      "Dat hangt af van uw woningwaarde en het gebruikelijke makelaarstarief, maar vaak gaat het om duizenden euro’s. Juist daarom kijken veel verkopers eerst naar het verschil in netto opbrengst.",
  },
  {
    question: "Kan ik mijn huis verkopen zonder courtage én zonder makelaar?",
    answer:
      "Ja. In Nederland bent u niet verplicht om een makelaar in te schakelen. Veel verkopers kiezen voor meer eigen regie, met slimme begeleiding waar dat nodig is.",
  },
  {
    question: "Is zonder courtage verkopen risicovoller?",
    answer:
      "Niet automatisch. Het hangt vooral af van hoe goed u het proces organiseert. Met duidelijke stappen, sterke presentatie, overzicht en begeleiding wordt dat voor veel verkopers goed haalbaar.",
  },
  {
    question: "Kan AI helpen bij verkopen zonder courtage?",
    answer:
      "Ja. AI kan helpen bij woningteksten, voorbereiding, structuur, samenvattingen en het uitleggen van vervolgstappen. Daardoor wordt het proces duidelijker en toegankelijker.",
  },
];

export default function HuisVerkopenZonderCourtagePage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Huis verkopen zonder courtage
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Huis verkopen zonder courtage: waarom steeds meer verkopers dat willen
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              Voor veel verkopers zit de grootste frustratie niet eens in het
              idee van begeleiding, maar in het feit dat daar vaak een{" "}
              <strong className="text-neutral-950">percentage van de verkoopprijs</strong>{" "}
              tegenover staat. Zeker bij hogere woningwaardes loopt dat bedrag
              snel op.
            </p>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600">
              Daarom groeit de interesse in uw huis verkopen zonder courtage.
              Niet omdat mensen alles per se helemaal alleen willen doen, maar
              omdat zij slimmer willen verkopen: met meer regie, lagere kosten,
              gerichte marketing en begeleiding waar dat echt waarde toevoegt.
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
              Waarom dit zo aanspreekt
            </p>

            <div className="mt-4 rounded-2xl bg-neutral-950 p-6 text-white">
              <p className="text-sm text-neutral-300">Wat verkopers vaak voelen</p>

              <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-200">
                <li>• waarom zou ik een percentage van mijn opbrengst afstaan?</li>
                <li>• veel taken doe ik toch al grotendeels zelf</li>
                <li>• ik wil wel begeleiding, maar geen oud verdienmodel</li>
                <li>• technologie en AI maken veel al toegankelijker</li>
                <li>• ik wil slimmer verkopen, niet duurder</li>
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
                Waarom courtage voor veel mensen steeds minder logisch voelt
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
                <p>
                  Courtage klinkt in eerste instantie overzichtelijk. Een
                  percentage van de verkoopprijs lijkt simpel en bekend. Maar
                  juist dat model begint voor veel verkopers te wringen zodra zij
                  het bedrag echt uitrekenen.
                </p>

                <p>
                  Want bij een woning van enkele tonnen betekent een ogenschijnlijk
                  klein percentage al snel een rekening van duizenden euro’s. En
                  dan komt vanzelf de vraag op:{" "}
                  <strong className="text-neutral-950">
                    staat dat bedrag nog in verhouding tot wat ik ervoor terugkrijg?
                  </strong>
                </p>

                <p>
                  Zeker omdat veel verkopers in de praktijk al een groot deel van
                  het werk zelf doen. Ze maken de woning verkoopklaar, leveren
                  informatie aan, denken mee over de presentatie, beantwoorden
                  vragen en maken uiteindelijk zelf de belangrijke keuzes.
                </p>

                <p>
                  Daardoor voelt courtage voor steeds meer mensen als een oud
                  model. Niet omdat begeleiding geen waarde heeft, maar omdat een
                  percentage van de volledige verkoopprijs minder goed past bij
                  hoe woningverkoop vandaag de dag werkt.
                </p>
              </div>

              <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
                Zonder courtage verkopen betekent niet zonder hulp verkopen
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
                <p>
                  Dit is een belangrijk verschil. Veel mensen denken bij zonder
                  courtage meteen aan alles volledig alleen doen. Maar voor de
                  meeste verkopers is dat niet wat zij zoeken.
                </p>

                <p>
                  Ze zoeken vooral een manier om geen onnodig percentage af te
                  staan, terwijl ze wel duidelijkheid, structuur en ondersteuning
                  hebben. En juist daar zit vandaag de grote verschuiving.
                </p>

                <p>
                  Begeleiding hoeft niet meer automatisch uit een traditioneel
                  makelaarsmodel te komen. Een goed stappenplan, slimme tools,
                  gerichte marketing en AI-ondersteuning kunnen veel van die rol
                  steeds beter overnemen of aanvullen.
                </p>

                <p>
                  Daardoor wordt de keuze voor verkopen zonder courtage voor veel
                  mensen geen radicale stap, maar juist een logische modernisering
                  van het verkoopproces.
                </p>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Slim vergelijken
                </p>

                <h3 className="mt-3 text-2xl font-semibold text-neutral-950">
                  Het gaat uiteindelijk om wat u netto overhoudt
                </h3>

                <p className="mt-4 text-sm leading-7 text-neutral-700">
                  Veel verkopers kijken eerst naar gemak. Maar zodra het verschil
                  in netto opbrengst zichtbaar wordt, kijken ze vaak heel anders
                  naar courtage.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-neutral-800">
                  <li>• lagere kosten</li>
                  <li>• meer eigen regie</li>
                  <li>• begeleiding zonder klassiek verdienmodel</li>
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
                  Wilt u eerst begrijpen hoe courtage precies werkt en waarom het
                  bedrag zo snel oploopt? Bekijk dan ook onze pagina over courtage
                  van een makelaar.
                </p>

                <Link
                  href="/courtage-makelaar"
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
            Wat u nodig heeft om zonder courtage sterk te verkopen
          </h2>
          <p className="mt-4 text-base leading-8 text-neutral-600">
            Zonder courtage verkopen werkt het best als de basis klopt:
            presentatie, bereik, structuur en begeleiding op de juiste momenten.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {blokken.map((blok) => (
            <div
              key={blok.title}
              className="rounded-3xl border border-neutral-200 bg-white p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-950">
                {blok.title}
              </h3>
              <p className="mt-4 text-base leading-8 text-neutral-700">
                {blok.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Veel begeleiding kan tegenwoordig slimmer worden georganiseerd
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Veel instructies die vroeger alleen via een makelaar leken te
                lopen, blijken in de basis vooral neer te komen op duidelijke
                uitleg en de juiste volgorde. Denk aan hoe u uw woning
                presenteert, hoe u bezichtigingen voorbereidt, hoe u biedingen
                vergelijkt en welke stap daarna volgt.
              </p>

              <p>
                Dat soort begeleiding kan vandaag de dag steeds beter worden
                vertaald naar een systeem: stappenplannen, checklists, gerichte
                ondersteuning en AI die helpt met teksten, overzicht en
                voorbereiding.
              </p>

              <p>
                Daardoor verschuift voor veel verkopers de vraag van{" "}
                <em>“heb ik een makelaar nodig?”</em> naar{" "}
                <strong className="text-neutral-950">
                  “welke hulp heb ik echt nodig, en hoe regel ik dat slimmer?”
                </strong>
                .
              </p>
            </div>

            <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
              AI maakt verkopen zonder courtage steeds toegankelijker
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                AI kan steeds meer praktische taken ondersteunen. Denk aan het
                schrijven van een woningtekst, het structureren van informatie,
                het voorbereiden van bezichtigingen, het uitleggen van
                vervolgstappen en het samenvatten van keuzes.
              </p>

              <p>
                Daardoor voelt zelf verkopen voor veel mensen minder zwaar en
                minder onduidelijk. Niet omdat technologie alles oplost, maar
                omdat het veel frictie wegneemt uit het proces.
              </p>

              <p>
                In combinatie met gerichte marketing en duidelijke begeleiding
                ontstaat zo een model dat voor veel verkopers logischer voelt dan
                courtage betalen over hun volledige opbrengst.
              </p>
            </div>

            <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
              Conclusie: verkopen zonder courtage past beter bij hoe veel mensen nu willen verkopen
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Voor veel verkopers gaat het niet om alles zelf willen doen. Het
                gaat om niet onnodig te veel betalen voor een model dat steeds
                minder vanzelfsprekend voelt.
              </p>

              <p>
                Zonder courtage verkopen sluit beter aan bij hoe veel mensen nu
                willen werken: slimmer, duidelijker, met meer eigen regie en met
                hulp waar dat echt waarde toevoegt.
              </p>

              <p>
                Juist daarom groeit deze zoekintentie. Niet als tijdelijke trend,
                maar als teken dat de woningmarkt langzaam verschuift naar een
                moderner en eerlijker verkoopmodel.
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
              Veel verkopers maken pas echt een keuze zodra zij zwart op wit
              zien hoeveel geld er mogelijk overblijft als zij slimmer verkopen.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#calculator"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Ga naar de calculator
              </Link>

              <Link
                href="/zelf-huis-verkopen"
                className="inline-flex items-center justify-center rounded-full border border-emerald-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
              >
                Lees over zelf huis verkopen
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Veelgestelde vragen over huis verkopen zonder courtage
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
              href="/wat-doet-een-makelaar"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Lees wat een makelaar doet
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}