import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Funda zonder makelaar | Kan dat en wat zijn de alternatieven? | HuisDirect",
  description:
    "Kunt u op Funda zonder makelaar? Ontdek hoe het werkt, waarom veel verkopers hierop zoeken en waarom slim zelf verkopen met goede begeleiding, marketing en AI voor steeds meer mensen een logisch alternatief wordt.",
  alternates: {
    canonical: "https://www.huisdirect.nl/funda-zonder-makelaar",
  },
  openGraph: {
    title: "Funda zonder makelaar | HuisDirect",
    description:
      "Lees of u op Funda kunt zonder makelaar, welke alternatieven er zijn en waarom steeds meer verkopers kiezen voor slim zelf verkopen.",
    url: "https://www.huisdirect.nl/funda-zonder-makelaar",
    siteName: "HuisDirect",
    locale: "nl_NL",
    type: "article",
  },
};

const redenen = [
  {
    title: "Funda voelt voor veel mensen als de standaard",
    text: "Veel verkopers denken bij woningverkoop direct aan Funda. Daardoor ontstaat al snel het idee dat u ook automatisch een makelaar nodig heeft.",
  },
  {
    title: "De echte vraag is vaak groter dan alleen Funda",
    text: "Mensen zoeken niet alleen naar een platform, maar vooral naar bereik, vertrouwen en een goede verkoop. Dat kan ook slimmer worden georganiseerd.",
  },
  {
    title: "Zelf verkopen wordt steeds toegankelijker",
    text: "Met duidelijke begeleiding, stappenplannen, gerichte marketing en AI-ondersteuning wordt het voor steeds meer verkopers haalbaar om zelf veel regie te houden.",
  },
];

const faqItems = [
  {
    question: "Kun je op Funda zonder makelaar?",
    answer:
      "In de praktijk loopt plaatsing op Funda meestal via een makelaar of een partij die die toegang regelt. Daarom zoeken veel verkopers naar alternatieven of slimmere routes.",
  },
  {
    question: "Heb ik Funda per se nodig om mijn huis te verkopen?",
    answer:
      "Niet per se. Funda is groot en bekend, maar het is niet de enige manier om bereik, vertrouwen en serieuze kopers op te bouwen.",
  },
  {
    question: "Waarom zoeken zoveel mensen op funda zonder makelaar?",
    answer:
      "Omdat ze wel het bereik en de zichtbaarheid willen, maar niet automatisch duizenden euro’s aan traditionele makelaarskosten willen betalen.",
  },
  {
    question: "Kan gerichte marketing een alternatief zijn voor Funda?",
    answer:
      "Voor veel verkopers wel. Het gaat uiteindelijk niet alleen om ergens zichtbaar zijn, maar om de juiste doelgroep bereiken. Met gerichte online marketing kunt u uw woning heel doelgericht onder de aandacht brengen, vaak voor een veel lager budget dan traditionele makelaarskosten.",
  },
  {
    question: "Kan ik mijn huis zelf verkopen zonder makelaar?",
    answer:
      "Ja. In Nederland bent u niet verplicht om een makelaar in te schakelen om uw woning te verkopen.",
  },
  {
    question: "Kan AI helpen als ik zelf mijn huis verkoop?",
    answer:
      "Ja. AI kan helpen bij woningteksten, structuur, voorbereiding, uitleg van vervolgstappen en het overzichtelijk maken van keuzes. Daardoor wordt zelf verkopen voor veel mensen toegankelijker.",
  },
];

export default function FundaZonderMakelaarPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Funda zonder makelaar
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Funda zonder makelaar: kan dat en wat zijn de alternatieven?
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              Veel mensen die hun huis willen verkopen zoeken op{" "}
              <strong className="text-neutral-950">funda zonder makelaar</strong>.
              Dat is logisch. Ze willen de zichtbaarheid en het bereik dat Funda
              in hun hoofd vertegenwoordigt, maar liever niet automatisch vastzitten
              aan een traditioneel makelaarsmodel.
            </p>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600">
              Achter die zoekopdracht zit meestal een diepere vraag:{" "}
              <strong className="text-neutral-950">
                hoe verkoop ik mijn huis slim, professioneel en zichtbaar, zonder
                onnodig veel kosten?
              </strong>{" "}
              Precies daar kijken steeds meer verkopers tegenwoordig anders naar.
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
              Waarom mensen hierop zoeken
            </p>

            <div className="mt-4 rounded-2xl bg-neutral-950 p-6 text-white">
              <p className="text-sm text-neutral-300">De echte behoefte</p>

              <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-200">
                <li>• zichtbaar zijn voor serieuze kopers</li>
                <li>• geen hoge makelaarscourtage betalen</li>
                <li>• zelf meer regie houden</li>
                <li>• duidelijke begeleiding zonder oud model</li>
                <li>• slim verkopen met hulp van technologie</li>
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
          {redenen.map((reden) => (
            <div
              key={reden.title}
              className="rounded-3xl border border-neutral-200 bg-white p-6"
            >
              <h2 className="text-lg font-semibold text-neutral-950">
                {reden.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">
                {reden.text}
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
                Waarom “funda zonder makelaar” zo’n logische zoekopdracht is
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
                <p>
                  Voor veel Nederlanders is Funda bijna synoniem geworden aan een
                  huis verkopen. Daardoor lijkt het alsof de route vastligt:
                  woning verkopen betekent makelaar inschakelen, en makelaar
                  betekent automatisch zichtbaarheid.
                </p>

                <p>
                  Maar veel verkopers voelen ondertussen dat daar iets schuurt.
                  Ze willen wel professioneel verkopen en serieus bereik hebben,
                  maar ze willen niet automatisch duizenden euro’s kwijt zijn aan
                  een model dat voor hun gevoel niet altijd meer past bij deze
                  tijd.
                </p>

                <p>
                  Daarom is deze zoekopdracht zo sterk. Mensen zoeken eigenlijk
                  niet alleen naar Funda. Ze zoeken naar een manier om zichtbaar,
                  geloofwaardig en slim te verkopen zonder zich meteen volledig
                  afhankelijk te maken van een traditionele makelaar.
                </p>
              </div>

              <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
                Gaat het echt om Funda, of om vertrouwen en bereik?
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
                <p>
                  In veel gevallen gaat het niet alleen om Funda zelf. De
                  onderliggende wens is meestal breder:{" "}
                  <strong className="text-neutral-950">
                    kopers bereiken, vertrouwen uitstralen en goed verkopen.
                  </strong>
                </p>

                <p>
                  Dat is belangrijk om te beseffen, want zodra u dat onderscheid
                  ziet, verandert ook de manier waarop u naar de verkoop kijkt.
                  U bent dan niet meer alleen bezig met de vraag of u ergens wel
                  of niet kunt adverteren, maar met de grotere vraag hoe u de
                  verkoop slim organiseert.
                </p>

                <p>
                  Voor steeds meer verkopers wordt dan duidelijk dat zichtbaarheid
                  slechts één onderdeel is. Goede presentatie, duidelijke
                  informatie, snelle communicatie en vertrouwen zijn minstens zo
                  belangrijk. En juist die onderdelen kunt u zelf of met slimme
                  ondersteuning steeds beter organiseren.
                </p>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Slim vergelijken
                </p>

                <h3 className="mt-3 text-2xl font-semibold text-neutral-950">
                  Eerst weten wat u kunt besparen?
                </h3>

                <p className="mt-4 text-sm leading-7 text-neutral-700">
                  Veel verkopers gaan pas echt anders kijken naar hun opties zodra
                  ze zien hoeveel geld er anders naar makelaarskosten gaat.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-neutral-800">
                  <li>• direct inzicht in kostenverschil</li>
                  <li>• geen verplichtingen</li>
                  <li>• duidelijkere keuze</li>
                </ul>

                <Link
                  href="/#calculator"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Bereken uw besparing
                </Link>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white p-6">
                <h3 className="text-xl font-semibold text-neutral-950">
                  Ook interessant
                </h3>

                <p className="mt-4 text-sm leading-7 text-neutral-600">
                  Wilt u eerst begrijpen hoe zelf verkopen zonder makelaar werkt?
                  Lees dan ook onze pagina over zelf uw huis verkopen.
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
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
            Gericht bereik is voor veel woningen belangrijker dan alleen op een groot platform staan
          </h2>

          <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
            <p>
              Veel verkopers denken bij zichtbaarheid direct aan één groot
              woningplatform. Dat is begrijpelijk, maar het is niet de enige
              manier om serieuze kopers te bereiken. Uiteindelijk gaat het niet
              om alleen <em>ergens staan</em>, maar om{" "}
              <strong className="text-neutral-950">de juiste mensen bereiken</strong>.
            </p>

            <p>
              Met gerichte online marketing kunt u uw woning heel doelbewust
              onder de aandacht brengen bij mensen die actief zoeken, in een
              bepaalde regio willen wonen of passen bij het type woning dat u
              verkoopt. Voor veel woningen is dat een veel interessantere vorm
              van bereik dan alleen algemene zichtbaarheid.
            </p>

            <p>
              Juist daar zit voor veel verkopers een nieuwe manier van denken.
              Niet automatisch veel geld betalen voor een klassiek model, maar
              slimmer omgaan met budget: goede presentatie, duidelijke
              positionering en gericht bereik via marketing waar dat het meeste
              effect heeft.
            </p>

            <p>
              En dat voelt voor veel mensen logischer. Niet omdat een groot
              platform geen waarde kan hebben, maar omdat gerichte marketing in
              veel gevallen voor een{" "}
              <strong className="text-neutral-950">
                fractie van traditionele makelaarskosten
              </strong>{" "}
              al zeer relevant bereik kan opleveren.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Veel verkopers doen in de praktijk zelf al meer dan ze denken
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Ook als u via een makelaar verkoopt, doet u vaak al veel zelf. U
                maakt de woning verkoopklaar, levert informatie aan, controleert
                gegevens, denkt mee over de presentatie en bent degene die keuzes
                maakt over prijs, planning en biedingen.
              </p>

              <p>
                Het verschil is dus vaak niet dat u niets doet en de makelaar alles.
                Het verschil is eerder dat u veel doet{" "}
                <strong className="text-neutral-950">
                  onder begeleiding van een makelaar
                </strong>.
              </p>

              <p>
                En dat is precies waar de markt verschuift. Want begeleiding hoeft
                niet meer altijd uit een traditioneel makelaarsmodel te komen. Een
                duidelijk stappenplan, slimme software en AI-ondersteuning kunnen
                veel van die uitleg en structuur ook bieden.
              </p>

              <p>
                Daardoor voelt zelf verkopen voor steeds meer mensen niet meer als
                een sprong in het diepe, maar als een logische moderne manier van
                verkopen met hulp waar dat echt nodig is.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
                AI en slimme begeleiding maken zelf verkopen steeds aantrekkelijker
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
                <p>
                  Vroeger voelde veel kennis rondom woningverkoop gesloten. U had
                  het idee dat u iemand nodig had die wist wat de volgende stap was,
                  hoe u uw woning moest presenteren en hoe u met biedingen moest
                  omgaan.
                </p>

                <p>
                  Vandaag verandert dat snel. AI kan helpen bij woningteksten,
                  structuur, voorbereiding op bezichtigingen, uitleg van
                  vervolgstappen en het overzichtelijk maken van keuzes. Daardoor
                  wordt veel begeleiding toegankelijker dan ooit.
                </p>

                <p>
                  Dat betekent niet dat alles automatisch vanzelf gaat. Het betekent
                  wel dat het oude model, waarin u bijna vanzelfsprekend afhankelijk
                  was van een makelaar, voor steeds meer verkopers minder logisch
                  voelt.
                </p>

                <p>
                  De toekomst voelt daardoor anders: zelf de regie houden, slim
                  ondersteund worden en alleen hulp inzetten waar die echt waarde
                  toevoegt.
                </p>
              </div>

              <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
                Conclusie: de vraag achter Funda is eigenlijk groter
              </h2>

              <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
                <p>
                  Wie zoekt op <strong className="text-neutral-950">funda zonder makelaar</strong>,
                  zoekt meestal niet alleen naar een technisch antwoord. Die zoekt
                  naar een manier om professioneel, zichtbaar en betaalbaar te
                  verkopen.
                </p>

                <p>
                  En precies daar zit de verandering. Niet meer automatisch denken
                  in oude modellen, maar in slimme verkoop met duidelijke
                  begeleiding, goede presentatie, gericht bereik en technologie
                  die u sterker maakt in plaats van afhankelijk.
                </p>

                <p>
                  Voor veel verkopers is dat geen toekomstmuziek meer. Het is nu
                  al een logischere manier van kijken naar woningverkoop.
                </p>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Bereik met marketing
                </p>

                <h3 className="mt-3 text-2xl font-semibold text-neutral-950">
                  Het gaat niet om zoveel mogelijk mensen, maar om de juiste mensen
                </h3>

                <p className="mt-4 text-sm leading-7 text-neutral-700">
                  Veel woningen hebben meer aan gericht bereik bij serieuze
                  kopers dan aan algemene zichtbaarheid alleen. Slimme marketing
                  maakt dat voor veel verkopers steeds interessanter.
                </p>

                <Link
                  href="/#calculator"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Bekijk uw voordeel
                </Link>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white p-6">
                <h3 className="text-xl font-semibold text-neutral-950">
                  Ook interessant
                </h3>

                <p className="mt-4 text-sm leading-7 text-neutral-600">
                  Wilt u eerst zien hoe het proces eruitziet als u zelf meer de
                  regie houdt? Bekijk dan ook onze checklist en het stappenplan.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href="/huis-verkopen-checklist"
                    className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                  >
                    Bekijk de checklist →
                  </Link>
                  <Link
                    href="/huis-verkopen-stappenplan"
                    className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                  >
                    Bekijk het stappenplan →
                  </Link>
                </div>
              </div>
            </aside>
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
                href="/wat-doet-een-makelaar"
                className="inline-flex items-center justify-center rounded-full border border-emerald-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
              >
                Lees wat een makelaar doet
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Veelgestelde vragen over Funda zonder makelaar
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