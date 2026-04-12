"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronDown,
  Euro,
  Home,
  Upload,
  Users,
} from "lucide-react";

type StepCardProps = {
  step: string;
  title: string;
  summary: string;
  details: string[];
  icon: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
};

type FaqItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
};

function StepCard({
  step,
  title,
  summary,
  details,
  icon,
  isOpen,
  onClick,
}: StepCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-start gap-4 p-6 text-left transition hover:bg-stone-50"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-1 text-sm font-semibold text-emerald-700">{step}</p>
          <h2 className="text-xl font-semibold text-stone-900">{title}</h2>
          <p className="mt-2 text-base leading-relaxed text-stone-600">
            {summary}
          </p>
        </div>

        <div className="shrink-0 pt-1">
          <ChevronDown
            className={`h-5 w-5 text-stone-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen ? (
        <div className="px-6 pb-6">
          <div className="border-t border-stone-100 pt-5 sm:ml-16">
            <div className="space-y-3">
              {details.map((detail, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <p className="text-sm leading-relaxed text-stone-700 sm:text-base">
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FaqItem({
  question,
  answer,
  isOpen,
  onClick,
}: FaqItemProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-stone-50"
      >
        <span className="text-base font-semibold leading-relaxed text-stone-900 sm:text-lg">
          {question}
        </span>

        <ChevronDown
          className={`h-5 w-5 shrink-0 text-stone-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div className="border-t border-stone-100 px-6 py-5">
          <p className="text-sm leading-relaxed text-stone-700 sm:text-base">
            {answer}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function HoeHetWerktPage() {
  const [openStep, setOpenStep] = useState<number | null>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(1);

  const steps = [
    {
      step: "Stap 1",
      title: "Vul je woninggegevens in",
      summary:
        "Je begint met de belangrijkste gegevens van je woning en voegt daarna je foto’s toe.",
      icon: <Upload className="h-5 w-5" />,
      details: [
        "Je vult zelf de belangrijkste gegevens van je woning in, zoals adres, kenmerken en een duidelijke omschrijving.",
        "Daarna voeg je je foto’s toe, rustig op je eigen tempo.",
        "Je hoeft geen makelaar te zijn om je eigen woning goed en helder te presenteren.",
        "Doordat jij zelf invult wat belangrijk is, houd je grip op de inhoud van je advertentie.",
      ],
    },
    {
      step: "Stap 2",
      title: "Je woning komt online",
      summary:
        "Je advertentie wordt zichtbaar op HuisDirect voor mensen die op zoek zijn naar een woning.",
      icon: <Home className="h-5 w-5" />,
      details: [
        "Zodra je advertentie klaar is, kan je woning online worden geplaatst.",
        "Bezoekers zien jouw foto’s, woninginformatie en omschrijving overzichtelijk bij elkaar.",
        "Wil je extra bereik, dan kun je later ook kiezen voor extra promotie.",
        "Jij bepaalt zelf hoeveel zichtbaarheid en kosten bij jouw situatie passen.",
      ],
    },
    {
      step: "Stap 3",
      title: "Je ontvangt reacties",
      summary:
        "Geïnteresseerden nemen direct contact met je op, zonder tussenpersoon.",
      icon: <Users className="h-5 w-5" />,
      details: [
        "Reacties komen rechtstreeks bij jou binnen.",
        "Je plant zelf bezichtigingen en hebt direct contact met geïnteresseerden.",
        "Dat maakt het proces vaak sneller en duidelijker.",
        "Je houdt zelf overzicht over wie reageert en hoe je verder wilt gaan.",
      ],
    },
    {
      step: "Stap 4",
      title: "Je verkoopt en bespaart",
      summary:
        "Je verkoopt zonder traditionele makelaarskosten en houdt de regie in eigen hand.",
      icon: <Euro className="h-5 w-5" />,
      details: [
        "Je betaalt geen hoge courtage zoals bij een traditionele makelaar.",
        "Daardoor kun je al snel een groot bedrag besparen.",
        "De officiële afhandeling van de verkoop verloopt uiteindelijk via de notaris.",
        "Zo blijft het proces duidelijk, overzichtelijk en betaalbaar.",
      ],
    },
  ];

  const faqs = [
    {
      question: "Moet ik alles helemaal zelf doen?",
      answer:
        "Nee. Je vult zelf je advertentie in, voegt foto’s toe en hebt contact met geïnteresseerden. Dat zijn de onderdelen die voor veel verkopers goed zelf te doen zijn. De formele afronding van de verkoop loopt uiteindelijk via de notaris.",
    },
    {
      question: "Is verkopen zonder makelaar wel verstandig?",
      answer:
        "Voor veel mensen wel. Zeker als je graag overzicht houdt, zelf contact wilt hebben met geïnteresseerden en geen hoge makelaarskosten wilt betalen. Veel mensen denken vooraf dat het ingewikkeld is, maar in de praktijk blijkt het voor veel verkopers overzichtelijker dan gedacht.",
    },
    {
      question: "Wat als ik hier geen ervaring mee heb?",
      answer:
        "Dat is heel normaal. De meeste mensen verkopen niet vaak een woning. Daarom is het belangrijk dat het proces duidelijk en rustig blijft. HuisDirect is bedoeld om die stap kleiner en overzichtelijker te maken.",
    },
    {
      question: "Waarom kiezen mensen dan toch vaak voor een makelaar?",
      answer:
        "Vooral vanwege vertrouwen en gemak. Een makelaar geeft het gevoel dat alles wordt geregeld. Daar staat meestal wel een flinke courtage tegenover. HuisDirect is bedoeld voor mensen die zelf meer regie willen houden en tegelijk veel kosten willen besparen.",
    },
    {
      question: "Wat kost HuisDirect?",
      answer:
        "Het plaatsen van een woning begint vanaf €195. Daarmee kan je woning op HuisDirect worden geplaatst, zonder traditionele makelaarscourtage.",
    },
  ];

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-4xl px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
            Je huis verkopen zonder makelaar,
            <span className="block">op een duidelijke en eenvoudige manier</span>
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-stone-600">
            HuisDirect is er voor mensen die hun woning zelf willen verkopen,
            zonder hoge makelaarskosten en zonder onnodig gedoe. Je houdt zelf
            de regie, terwijl het proces overzichtelijk blijft.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            Veel mensen denken vooraf dat dit ingewikkeld is. In de praktijk
            blijkt het voor veel verkopers overzichtelijker dan gedacht.
          </p>

          <div className="mt-8">
            <Link
              href="/#calculator"
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-700"
            >
              Bereken direct wat je kunt besparen
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-stone-900 sm:text-3xl">
            Waarom het voor veel mensen meevalt
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p className="text-base leading-relaxed text-stone-700">
                Je verkoopt je eigen woning. Daar weet je zelf vaak al veel van.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p className="text-base leading-relaxed text-stone-700">
                Je bepaalt zelf wat je doet, wanneer je het doet en met wie je
                contact hebt.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p className="text-base leading-relaxed text-stone-700">
                Je bespaart vaak een groot bedrag aan makelaarskosten.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p className="text-base leading-relaxed text-stone-700">
                De officiële afhandeling van de verkoop loopt uiteindelijk via
                de notaris.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold text-stone-900 sm:text-3xl">
            Zo werkt het stap voor stap
          </h2>

          <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
            Hieronder zie je in alle rust hoe verkopen via HuisDirect werkt.
          </p>
        </div>

        <div className="mt-8 space-y-5">
          {steps.map((item, index) => {
            const stepNumber = index + 1;
            const isOpen = openStep === stepNumber;

            return (
              <StepCard
                key={item.step}
                step={item.step}
                title={item.title}
                summary={item.summary}
                details={item.details}
                icon={item.icon}
                isOpen={isOpen}
                onClick={() => setOpenStep(isOpen ? null : stepNumber)}
              />
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-stone-900 sm:text-3xl">
            Eerst rustig kijken wat je kunt besparen
          </h2>

          <p className="mt-4 text-base leading-relaxed text-stone-700 sm:text-lg">
            Voor veel mensen is dat de fijnste eerste stap. Je hoeft niet direct
            alles klaar te hebben. Door eerst je mogelijke besparing te
            berekenen, wordt de keuze vaak veel duidelijker.
          </p>

          <div className="mt-6">
            <Link
              href="/#calculator"
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-700"
            >
              Open de calculator
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold text-stone-900 sm:text-3xl">
            Veelgestelde vragen
          </h2>

          <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
            De grootste twijfel zit vaak niet in het werk zelf, maar in de vraag
            of het wel verstandig en overzichtelijk is. Daarom beantwoorden we
            hieronder de vragen die veel mensen hebben.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {faqs.map((item, index) => {
            const faqNumber = index + 1;
            const isOpen = openFaq === faqNumber;

            return (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
                isOpen={isOpen}
                onClick={() => setOpenFaq(isOpen ? null : faqNumber)}
              />
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 pt-2 sm:px-6 sm:pb-20 lg:px-8">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-stone-900 sm:text-3xl">
            Klaar voor de volgende stap?
          </h2>

          <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
            Je hebt nu een goed beeld van wat je kunt besparen. De volgende stap
            is bekijken wat je woning ongeveer waard is.
          </p>

          <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
            Binnen je account kun je je adres invullen. Op basis daarvan maken
            wij een AI-schatting van je woningwaarde, zodat je een duidelijk
            uitgangspunt hebt voor je verkoop.
          </p>

          <p className="mt-4 text-base leading-relaxed text-stone-700">
            U zit nergens aan vast. U kunt alles rustig bekijken en op uw eigen
            tempo beslissen of u verder wilt gaan.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth/register"
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-700"
            >
              Bekijk wat je woning waard is
            </Link>

            <Link
              href="/auth/register"
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-stone-300 bg-white px-6 py-3 text-base font-semibold text-stone-800 transition hover:bg-stone-50"
            >
              Maak een account aan
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}