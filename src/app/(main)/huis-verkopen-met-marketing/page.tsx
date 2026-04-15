import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Huis verkopen met marketing | Meer gericht bereik zonder hoge makelaarskosten | HuisDirect",
  description:
    "Uw huis verkopen met marketing? Ontdek hoe gerichte online marketing, sterke presentatie, begeleiding en AI samen kunnen zorgen voor slim bereik zonder traditionele makelaarskosten.",
  alternates: {
    canonical: "https://www.huisdirect.nl/huis-verkopen-met-marketing",
  },
  openGraph: {
    title: "Huis verkopen met marketing | HuisDirect",
    description:
      "Lees hoe u uw huis kunt verkopen met gerichte marketing, slimme begeleiding en AI in plaats van alleen te leunen op traditionele makelaarsmodellen.",
    url: "https://www.huisdirect.nl/huis-verkopen-met-marketing",
    siteName: "HuisDirect",
    locale: "nl_NL",
    type: "article",
  },
};

const voordelen = [
  {
    title: "Gericht bereik in plaats van algemeen bereik",
    text: "Niet iedere woning hoeft aan iedereen getoond te worden. Vaak is het slimmer om precies de mensen te bereiken die passen bij uw woning, locatie en prijsklasse.",
  },
  {
    title: "Meer grip op uw budget",
    text: "In plaats van automatisch hoge courtage betalen, kunt u veel bewuster omgaan met zichtbaarheid en promotie. Dat voelt voor veel verkopers logischer.",
  },
  {
    title: "Sterke combinatie van marketing en begeleiding",
    text: "Goede marketing werkt het best als de basis klopt: sterke presentatie, duidelijke informatie, snelle opvolging en structuur in het proces.",
  },
];

const onderdelen = [
  {
    title: "Sterke woningpresentatie",
    text: "Goede foto’s, een overtuigende woningtekst en complete informatie zijn de basis. Zonder sterke presentatie heeft marketing minder effect.",
  },
  {
    title: "Duidelijke doelgroep",
    text: "Een appartement in de stad vraagt vaak om een andere aanpak dan een gezinswoning in een dorp. Marketing wordt sterker zodra u weet wie uw ideale koper is.",
  },
  {
    title: "Gerichte online zichtbaarheid",
    text: "Met slimme online promotie kunt u uw woning zichtbaar maken bij mensen die actief zoeken of passen bij het profiel van uw woning.",
  },
  {
    title: "Snelle opvolging van interesse",
    text: "Bereik is pas waardevol als geïnteresseerden daarna ook goed geholpen worden. Snel reageren en helder communiceren maken hier het verschil.",
  },
  {
    title: "Begeleiding in de juiste volgorde",
    text: "Marketing alleen is niet genoeg. Verkopers hebben ook behoefte aan overzicht: wat doet u eerst, wat daarna, en waar moet u op letten?",
  },
  {
    title: "AI als praktische ondersteuning",
    text: "AI kan helpen bij woningteksten, structuur, voorbereiding op vragen, samenvattingen en uitleg van vervolgstappen. Daardoor wordt het proces veel toegankelijker.",
  },
];

const faqItems = [
  {
    question: "Wat betekent huis verkopen met marketing?",
    answer:
      "Dat betekent dat u uw woning niet alleen passief aanbiedt, maar actief zichtbaar maakt met gerichte promotie. Het doel is om de juiste kopers te bereiken in plaats van alleen algemeen zichtbaar te zijn.",
  },
  {
    question: "Is marketing een alternatief voor Funda of een makelaar?",
    answer:
      "Voor veel verkopers kan marketing een sterk alternatief of aanvulling zijn. Het draait uiteindelijk om bereik, vertrouwen en opvolging. Gerichte marketing kan daarin veel betekenen.",
  },
  {
    question: "Is marketing goedkoper dan een makelaar?",
    answer:
      "Voor veel situaties wel. Zeker als u kijkt naar het verschil tussen een gericht marketingbudget en traditionele makelaarskosten of courtage. Het voordeel is dat u vaak meer grip houdt op wat u uitgeeft.",
  },
  {
    question: "Kan ik mijn huis zelf verkopen met behulp van marketing?",
    answer:
      "Ja. Veel verkopers kunnen zelf veel regie houden, zolang er duidelijke begeleiding, structuur en goede presentatie is.",
  },
  {
    question: "Kan AI helpen bij huis verkopen met marketing?",
    answer:
      "Ja. AI kan helpen bij woningteksten, doelgroepdenken, voorbereiding, structuur en het overzichtelijk maken van keuzes. Daardoor wordt slim zelf verkopen steeds beter haalbaar.",
  },
];

export default function HuisVerkopenMetMarketingPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Huis verkopen met marketing
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Huis verkopen met marketing: gericht bereik in plaats van ouderwets verkopen
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              Een woning verkopen draait uiteindelijk niet alleen om ergens
              online staan. Het draait om{" "}
              <strong className="text-neutral-950">
                de juiste kopers bereiken
              </strong>
              , vertrouwen opbouwen en zorgen dat uw woning professioneel in de
              markt staat.
            </p>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600">
              Precies daarom kijken steeds meer verkopers anders naar verkoop.
              Niet automatisch hoge makelaarskosten betalen voor een traditioneel
              model, maar slimmer werken met sterke presentatie, gerichte
              marketing, duidelijke begeleiding en AI die ondersteunt waar dat
              waarde toevoegt.
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
              Waarom dit steeds logischer voelt
            </p>

            <div className="mt-4 rounded-2xl bg-neutral-950 p-6 text-white">
              <p className="text-sm text-neutral-300">De nieuwe manier van denken</p>

              <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-200">
                <li>• niet alleen zichtbaar zijn, maar gericht zichtbaar zijn</li>
                <li>• geen hoge vaste kosten zonder grip</li>
                <li>• zelf meer regie houden over de verkoop</li>
                <li>• marketing inzetten waar het echt effect heeft</li>
                <li>• AI gebruiken voor duidelijkheid en snelheid</li>
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
                Waarom huis verkopen met marketing voor veel verkopers logischer voelt
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
                <p>
                  Veel mensen hebben jarenlang geleerd dat een woning verkopen
                  ongeveer altijd hetzelfde loopt: makelaar inschakelen, woning
                  online zetten, afwachten en hopen op reacties. Dat model voelt
                  bekend, maar steeds minder mensen vinden het nog vanzelfsprekend.
                </p>

                <p>
                  Dat komt vooral omdat verkopers kritischer zijn geworden.
                  Ze willen weten waar hun geld naartoe gaat, hoeveel bereik ze
                  daar echt voor terugkrijgen en of er geen slimmere manier is
                  om hetzelfde doel te bereiken.
                </p>

                <p>
                  En precies daar wordt marketing interessant. Want het gaat
                  uiteindelijk niet alleen om op een groot platform staan. Het
                  gaat om het trekken van aandacht van de juiste kopers, met de
                  juiste boodschap, op het juiste moment.
                </p>

                <p>
                  Daardoor voelt marketing voor veel verkopers moderner en
                  logischer. Niet blind vertrouwen op algemene zichtbaarheid,
                  maar bewust sturen op resultaat.
                </p>
              </div>

              <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
                Het gaat niet om meer bereik, maar om beter bereik
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
                <p>
                  Een veelgemaakte denkfout is dat meer bereik altijd beter is.
                  In werkelijkheid verkoopt een woning niet omdat zoveel mogelijk
                  mensen hem zien, maar omdat de juiste mensen hem serieus bekijken.
                </p>

                <p>
                  Een gezinswoning in een dorp, een appartement voor starters of
                  een vrijstaande woning in het hogere segment vragen allemaal om
                  een ander type koper. Zodra u dat begrijpt, wordt het logisch
                  dat gerichte marketing vaak krachtiger voelt dan algemene
                  zichtbaarheid alleen.
                </p>

                <p>
                  Voor veel verkopers is dat ook psychologisch aantrekkelijker.
                  U heeft dan niet het gevoel dat u betaalt voor massa, maar voor
                  relevantie. Dat geeft meer grip en voelt zakelijker.
                </p>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Gerichter verkopen
                </p>

                <h3 className="mt-3 text-2xl font-semibold text-neutral-950">
                  Veel woningen hebben meer aan relevant bereik dan aan massaal bereik
                </h3>

                <p className="mt-4 text-sm leading-7 text-neutral-700">
                  Met marketing stuurt u veel bewuster op wie uw woning te zien
                  krijgt. Dat maakt het voor veel verkopers een slimmer model.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-neutral-800">
                  <li>• gerichter zichtbaar</li>
                  <li>• meer grip op budget</li>
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
                  Wilt u eerst zien hoe verkopen zonder Funda eruitziet? Bekijk
                  dan ook onze pagina over huis verkopen zonder Funda.
                </p>

                <Link
                  href="/huis-verkopen-zonder-funda"
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
            Wat u nodig heeft om uw huis met marketing goed te verkopen
          </h2>
          <p className="mt-4 text-base leading-8 text-neutral-600">
            Marketing werkt het best als de basis klopt. Zonder sterke inhoud
            en duidelijke begeleiding blijft zelfs goed bereik minder effectief.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {onderdelen.map((onderdeel) => (
            <div
              key={onderdeel.title}
              className="rounded-3xl border border-neutral-200 bg-white p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-950">
                {onderdeel.title}
              </h3>
              <p className="mt-4 text-base leading-8 text-neutral-700">
                {onderdeel.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Veel verkopers doen in de praktijk sowieso al veel zelf
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Ook als u met een makelaar werkt, bent u vaak degene die de
                woning verkoopklaar maakt, informatie aanlevert, meedenkt over
                presentatie, beschikbaar is voor vragen en de belangrijkste
                keuzes maakt.
              </p>

              <p>
                Het verschil is dus niet dat u niets doet en de makelaar alles.
                Het verschil is vaak dat u veel doet onder begeleiding van een
                traditioneel model. En juist daar kijken steeds meer verkopers
                kritischer naar.
              </p>

              <p>
                Want als u toch al veel zelf doet, waarom zou u dan niet kiezen
                voor een model waarin u ook meer grip houdt op bereik, kosten en
                presentatie? Voor veel mensen voelt dat logischer en eerlijker.
              </p>
            </div>

            <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
              AI maakt marketing en begeleiding steeds toegankelijker
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Vroeger leek marketing iets voor specialisten en grote budgetten.
                Vandaag verandert dat snel. AI kan helpen bij woningteksten,
                doelgroepdenken, voorbereiding van advertenties, samenvattingen,
                vervolgstappen en het structureren van keuzes.
              </p>

              <p>
                Dat betekent niet dat alles automatisch vanzelf gaat. Het
                betekent wel dat veel drempels lager worden. Taken die vroeger
                specialistisch of ingewikkeld voelden, worden nu steeds beter
                ondersteund met slimme systemen.
              </p>

              <p>
                Daardoor wordt zelf verkopen met marketing voor veel verkopers
                niet alleen aantrekkelijker, maar ook realistischer. Juist de
                combinatie van begeleiding, overzicht en AI maakt dat verschil.
              </p>
            </div>

            <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
              Conclusie: marketing past beter bij de manier waarop veel verkopers nu denken
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Voor veel mensen voelt het oude makelaarsmodel steeds minder
                logisch. Niet omdat begeleiding geen waarde heeft, maar omdat
                verkopers meer grip willen op hun kosten, hun presentatie en hun
                bereik.
              </p>

              <p>
                Huis verkopen met marketing sluit daar beter op aan. Het is
                gerichter, flexibeler en voor veel situaties goedkoper. In
                combinatie met slimme begeleiding en AI ontstaat zo een moderne
                manier van verkopen die voor steeds meer mensen natuurlijk voelt.
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
                href="/huis-verkopen-zonder-funda"
                className="inline-flex items-center justify-center rounded-full border border-emerald-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
              >
                Lees over verkopen zonder Funda
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Veelgestelde vragen over huis verkopen met marketing
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