import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Wat doet een makelaar? | Taken, waarde en kosten uitgelegd | HuisDirect",
  description:
    "Wat doet een makelaar precies bij het verkopen van een huis? Ontdek welke taken een makelaar uitvoert, wat u vaak zelf al doet en waarom steeds meer verkopers kiezen voor slim zelf verkopen met hulp van AI.",
  alternates: {
    canonical: "https://www.huisdirect.nl/wat-doet-een-makelaar",
  },
  openGraph: {
    title: "Wat doet een makelaar? | HuisDirect",
    description:
      "Lees wat een makelaar precies doet, welke taken u vaak zelf al uitvoert en waarom slim zelf verkopen met AI voor veel verkopers steeds logischer wordt.",
    url: "https://www.huisdirect.nl/wat-doet-een-makelaar",
    siteName: "HuisDirect",
    locale: "nl_NL",
    type: "article",
  },
};

const taken = [
  {
    title: "Vraagprijs bepalen",
    text: "Een makelaar adviseert meestal over een realistische vraagprijs op basis van marktkennis, vergelijkbare woningen en ervaring in de regio. Dat klinkt specialistisch, maar in de praktijk gaat het vooral om goed vergelijken, logisch nadenken en de juiste informatie gebruiken. Precies dat kan ook via een duidelijk stappenplan of AI-ondersteuning steeds toegankelijker worden.",
  },
  {
    title: "Woningpresentatie verzorgen",
    text: "Denk aan foto’s, woningtekst, meetgegevens en de manier waarop de woning online wordt gepresenteerd. Veel verkopers leveren hiervoor zelf al veel input aan: zij ruimen op, maken de woning verkoopklaar, verzamelen kenmerken en geven door wat belangrijk is. De vertaalslag naar een sterke presentatie kan steeds beter worden ondersteund met slimme tools en AI-advies.",
  },
  {
    title: "Bezichtigingen begeleiden",
    text: "Een makelaar plant kijkmomenten in, ontvangt geïnteresseerden en leidt hen door de woning. Tegelijk kent u uw woning en buurt vaak beter dan wie dan ook. Juist daarom ervaren veel verkopers bezichtigingen als iets wat zij zelf verrassend goed kunnen doen, zolang zij weten waar ze op moeten letten en hoe ze het gesprek slim opbouwen.",
  },
  {
    title: "Onderhandelen met kopers",
    text: "Bij biedingen helpt een makelaar met de onderhandeling over prijs, voorwaarden en opleverdatum. Maar ook hier draait het minder om magie dan veel mensen denken. Rust, overzicht, goede voorbereiding en weten welke voorwaarden echt belangrijk zijn maken vaak het verschil. Dat soort instructies kunnen ook via een stappenplan of AI-advies steeds beter worden begeleid.",
  },
  {
    title: "Afspraken en vervolgstappen bewaken",
    text: "Wanneer verkoper en koper overeenstemming bereiken, helpt een makelaar vaak met het bewaken van het proces en de vervolgstappen. Dat is waardevol, maar veel verkopers ontdekken dat zij in de praktijk zelf ook al degene zijn die documenten aanleveren, keuzes maken en acties uitvoeren. De vraag wordt dan vanzelf: heeft u daarvoor een traditioneel makelaarsmodel nodig, of vooral een slim systeem dat u goed begeleidt?",
  },
  {
    title: "Overzicht houden in het proces",
    text: "Een makelaar bewaakt meestal de volgorde van de verkoop. Maar juist daar ligt vandaag een grote verschuiving. Waar vroeger veel kennis alleen bij de makelaar leek te liggen, kunnen verkopers nu steeds beter werken met duidelijke stappen, checklists en AI-ondersteuning. Daardoor verschuift de rol van makelaar van noodzakelijke tussenpersoon naar iets wat voor veel situaties minder vanzelfsprekend wordt.",
  },
];

const faqItems = [
  {
    question: "Wat doet een makelaar bij verkoop van een huis?",
    answer:
      "Een makelaar helpt meestal met de vraagprijs, woningpresentatie, bezichtigingen, onderhandelingen en het bewaken van het verkoopproces.",
  },
  {
    question: "Doet een makelaar alles zelf?",
    answer:
      "Nee. In de praktijk moet u als verkoper vaak zelf ook al veel doen. Denk aan het verkoopklaar maken van de woning, informatie aanleveren, keuzes maken, beschikbaar zijn voor afspraken en documenten controleren. Vaak voert u dus al veel uit, alleen onder begeleiding of instructie van een makelaar.",
  },
  {
    question: "Kan ik de taken van een makelaar ook zelf doen?",
    answer:
      "Veel onderdelen wel. Denk aan presentatie, bezichtigingen, direct contact met geïnteresseerden en een groot deel van het verkoopproces. Met een duidelijke structuur, een goed stappenplan en slim AI-advies blijkt dit voor veel verkopers beter haalbaar dan zij vooraf denken.",
  },
  {
    question: "Waar betaal ik een makelaar eigenlijk voor?",
    answer:
      "U betaalt voor begeleiding, ervaring, coördinatie en het uit handen nemen van onderdelen van de verkoop. De belangrijkste vraag is of die totale kosten voor uw situatie opwegen tegen wat u ook zelf of slimmer kunt regelen.",
  },
  {
    question: "Is een makelaar altijd nodig?",
    answer:
      "Nee. U bent niet verplicht om een makelaar in te schakelen. In Nederland mag u uw woning gewoon zelf verkopen.",
  },
  {
    question: "Waarom kiezen steeds meer mensen ervoor om zonder makelaar te verkopen?",
    answer:
      "Vooral omdat zij ontdekken dat veel taken van een makelaar minder ingewikkeld zijn dan gedacht. Wat vroeger specialistisch leek, is nu steeds beter te ondersteunen met stappenplannen, digitale tools en AI. Daardoor wordt zelf verkopen voor veel mensen logischer, toegankelijker en aantrekkelijker.",
  },
];

export default function WatDoetEenMakelaarPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Wat doet een makelaar?
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Wat doet een makelaar precies en wat kunt u zelf ook doen?
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              Veel mensen schakelen automatisch een makelaar in, zonder echt stil
              te staan bij de vraag wat een makelaar precies doet. Pas als de
              kosten in beeld komen, ontstaat vaak de behoefte om daar kritischer
              naar te kijken.
            </p>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600">
              En dan volgt vaak een verrassende ontdekking: veel werkzaamheden van
              een makelaar zijn belangrijk, maar niet per se zo exclusief of
              ingewikkeld als ze vooraf lijken. Sterker nog, veel verkopers doen
              in de praktijk zelf al een groot deel van het werk, alleen vaak in
              opdracht van een makelaar.
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
              De kernvraag
            </p>

            <div className="mt-4 rounded-2xl bg-neutral-950 p-6 text-white">
              <p className="text-sm text-neutral-300">
                Wat veel verkopers ontdekken
              </p>

              <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-200">
                <li>• veel makelaarstaken zijn vooral structuur en uitleg</li>
                <li>• u doet vaak zelf al meer dan u denkt</li>
                <li>• instructies zijn ook te volgen via een stappenplan</li>
                <li>• AI kan steeds beter helpen bij keuzes en teksten</li>
                <li>• zelf verkopen wordt daardoor steeds logischer</li>
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
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
            Waarom deze vraag zo belangrijk is
          </h2>

          <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
            <p>
              De vraag <strong>“wat doet een makelaar?”</strong> is belangrijk
              omdat daar eigenlijk een tweede vraag onder zit:{" "}
              <strong>wat daarvan kunt u ook zelf?</strong>
            </p>

            <p>
              Veel verkopers denken vooraf dat een makelaar allerlei specialistische
              taken uitvoert die zonder ervaring bijna onmogelijk zijn. Dat gevoel
              zorgt ervoor dat mensen snel aannemen dat zij het verkoopproces beter
              volledig kunnen uitbesteden.
            </p>

            <p>
              Maar zodra u die taken rustig uit elkaar trekt, ziet u vaak iets
              anders. Veel onderdelen draaien niet om geheim vakwerk, maar om
              voorbereiding, overzicht, duidelijke communicatie en een nette
              presentatie. En juist dat zijn dingen waar veel verkopers prima toe
              in staat zijn.
            </p>

            <p>
              Dat maakt deze pagina belangrijk. Niet om het werk van een makelaar
              kleiner te maken, maar om eerlijk te laten zien wat het werkelijk is.
              Want pas dan kunt u beoordelen of u daar duizenden euro’s voor wilt
              betalen, of dat u een groot deel slimmer zelf regelt.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Dit doet een makelaar meestal tijdens de verkoop
            </h2>
            <p className="mt-4 text-base leading-8 text-neutral-600">
              In de praktijk bestaat het werk van een makelaar meestal uit een
              combinatie van advies, coördinatie en communicatie. Maar veel van
              die onderdelen zijn minder ongrijpbaar dan ze lijken.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {taken.map((taak) => (
              <div
                key={taak.title}
                className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6"
              >
                <h3 className="text-xl font-semibold text-neutral-950">
                  {taak.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-neutral-700">
                  {taak.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Veel verkopers doen in de praktijk al zelf meer dan ze denken
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Dit is misschien wel het belangrijkste inzicht. Veel mensen denken
                dat zij bij verkoop via een makelaar bijna niets zelf hoeven te
                doen. In werkelijkheid ligt dat vaak anders.
              </p>

              <p>
                U bent meestal zelf degene die de woning verkoopklaar maakt,
                informatie aanlevert, keuzes maakt over prijs en planning,
                beschikbaar is voor afspraken, documenten controleert en vragen
                beantwoordt. Ook moet u vaak zelf nadenken over wat de sterke
                punten van uw woning zijn en wat potentiële kopers willen weten.
              </p>

              <p>
                Met andere woorden: een groot deel van het proces loopt al via u.
                Alleen zit er vaak een makelaar tussen die instructies geeft,
                de volgorde bewaakt en bepaalde beslissingen helpt structureren.
              </p>

              <p>
                En precies daar verandert de markt. Want alles wat vroeger alleen
                als makelaarsinstructie voelde, kan nu steeds vaker ook via een
                duidelijk stappenplan, slimme checklists of AI-advies worden
                ondersteund.
              </p>
            </div>

            <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
              Wat een makelaar als instructie geeft, kan steeds vaker ook anders
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Denk aan aanwijzingen zoals: welke vraagprijs logisch is, hoe u
                uw woning het beste presenteert, waar u tijdens een bezichtiging
                op moet letten, hoe u biedingen vergelijkt of welke stap daarna
                volgt. Dat zijn waardevolle aanwijzingen, maar het zijn ook
                precies de soort instructies die zich goed laten vertalen naar
                een duidelijk systeem.
              </p>

              <p>
                Een stappenplan maakt de volgorde helder. Een checklist voorkomt
                dat u iets vergeet. En AI kan helpen met teksten, inschattingen,
                voorbereiding op gesprekken en het structureren van keuzes. Wat
                vroeger afhankelijk voelde van één professional, wordt daardoor
                steeds vaker toegankelijk voor de verkoper zelf.
              </p>

              <p>
                Dat betekent niet dat begeleiding nooit nuttig is. Het betekent
                wel dat de klassieke rol van de makelaar steeds minder de enige
                logische route is. Voor veel verkopers verschuift de behoefte van
                “iemand moet het volledig voor mij doen” naar “ik wil slim
                begeleid worden terwijl ik zelf de regie houd”.
              </p>
            </div>

            <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
              Van makelaar als noodzaak naar slimme ondersteuning
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Dat is misschien wel de grootste verandering van deze tijd.
                Vroeger was de makelaar voor veel mensen een vanzelfsprekende
                noodzaak. Vandaag de dag wordt het steeds meer een keuze die
                afhangt van hoeveel hulp u echt nodig heeft.
              </p>

              <p>
                Als u vooral overzicht, structuur en praktische aanwijzingen
                nodig heeft, dan is slim zelf verkopen met hulp van technologie
                voor steeds meer mensen een logisch alternatief. Niet omdat alles
                ineens simpel is, maar omdat de kennis en begeleiding veel
                toegankelijker zijn geworden.
              </p>

              <p>
                In dat licht voelt de toekomst voor veel verkopers anders dan het
                oude model. Niet meer automatisch alles uit handen geven, maar
                zelf de regie houden met ondersteuning waar dat echt waarde
                toevoegt. Juist daar begint voor veel mensen de nieuwe manier van
                verkopen.
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
                Veel verkopers gaan pas anders kijken naar een makelaar zodra
                ze zien hoeveel geld er mogelijk naar courtage en extra kosten
                gaat.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-neutral-800">
                <li>• direct inzicht in mogelijke besparing</li>
                <li>• geen verplichtingen</li>
                <li>• duidelijker vergelijken</li>
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
                Wilt u zien hoe een woning verkopen zonder traditionele makelaar
                eruitziet? Lees dan ook onze pagina over zelf verkopen.
              </p>

              <Link
                href="/huis-verkopen-zonder-makelaar"
                className="mt-6 inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
              >
                Lees meer →
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Waar betaalt u een makelaar nu echt voor?
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                In de basis betaalt u voor begeleiding, ervaring, structuur en
                het uit handen nemen van onderdelen van het verkoopproces. Voor
                sommige verkopers is dat prettig. Voor anderen wordt juist op
                dit punt zichtbaar dat niet alle onderdelen even zwaar wegen.
              </p>

              <p>
                Want als u zelf de bezichtigingen wilt doen, goed kunt
                communiceren en bereid bent om betrokken te blijven, dan wordt
                de vraag groter of de totale kosten nog logisch voelen.
              </p>

              <p>
                Dat is precies waarom steeds meer verkopers anders naar deze
                markt kijken. Niet vanuit wantrouwen, maar vanuit een simpele
                zakelijke afweging: welke hulp heeft u echt nodig en welke
                onderdelen kunt u ook slimmer organiseren?
              </p>
            </div>

            <h2 className="mt-12 text-3xl font-semibold tracking-tight text-neutral-950">
              Is een makelaar altijd nodig?
            </h2>

            <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
              <p>
                Nee. U bent niet verplicht om een makelaar in te schakelen. In
                Nederland mag u uw woning gewoon zelf verkopen. Dat betekent dat
                u ook zelf de regie kunt houden over de presentatie,
                bezichtigingen en communicatie met kopers.
              </p>

              <p>
                Voor veel mensen is dat inmiddels een aantrekkelijk alternatief.
                Niet omdat een makelaar nooit iets toevoegt, maar omdat het
                traditionele model niet meer automatisch de enige logische keuze
                is.
              </p>

              <p>
                De beweging is duidelijk: waar vroeger vooral werd gedacht in
                volledig uitbesteden, groeit nu het vertrouwen in zelf verkopen
                met slimme begeleiding. En juist AI maakt die stap voor steeds
                meer verkopers kleiner.
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
              wit zien wat traditionele makelaarskosten kunnen zijn.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#calculator"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Ga naar de calculator
              </Link>

              <Link
                href="/huis-verkopen-stappenplan"
                className="inline-flex items-center justify-center rounded-full border border-emerald-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
              >
                Bekijk het stappenplan
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Veelgestelde vragen over wat een makelaar doet
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