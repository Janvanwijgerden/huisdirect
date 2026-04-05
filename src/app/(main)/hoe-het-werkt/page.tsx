"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Home,
  Upload,
  Users,
  Euro,
  ChevronDown,
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
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white transition">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-start gap-4 p-6 text-left transition hover:bg-stone-50"
      >
        <div className="shrink-0 rounded-xl bg-emerald-100 p-3 text-emerald-600">
          {icon}
        </div>

        <div className="flex-1">
          <p className="mb-1 text-sm font-semibold text-emerald-600">{step}</p>
          <h2 className="mb-1 text-lg font-semibold text-stone-900">{title}</h2>
          <p className="text-stone-600">{summary}</p>
        </div>

        <div className="shrink-0 pt-1">
          <ChevronDown
            className={`h-5 w-5 text-stone-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6">
          <div className="border-t border-stone-100 pt-4 sm:ml-[4.5rem]">
            <div className="space-y-3">
              {details.map((detail, index) => (
                <p
                  key={index}
                  className="text-sm leading-relaxed text-stone-600 sm:text-base"
                >
                  {detail}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HoeHetWerktPage() {
  const [openStep, setOpenStep] = useState<number | null>(null);

  const steps = [
    {
      step: "Stap 1",
      title: "Plaats je woning",
      summary: "Vul eenvoudig de gegevens van je woning in en upload foto’s.",
      icon: <Upload className="h-5 w-5" />,
      details: [
        "Je maakt zelf je advertentie aan met de belangrijkste gegevens, foto’s en een duidelijke omschrijving van je woning.",
        "Je regelt zelf zoveel als je wilt. Denk aan foto’s maken, de woningtekst schrijven en het contact met geïnteresseerden oppakken.",
        "Hoe meer je zelf doet, hoe meer je bespaart. HuisDirect is bedoeld voor verkopers die de regie graag in eigen hand houden.",
        "Wil je bepaalde onderdelen liever uitbesteden? Dan kun je dat later altijd nog zelf regelen.",
      ],
    },
    {
      step: "Stap 2",
      title: "Je woning komt online",
      summary: "Je advertentie wordt zichtbaar voor serieuze kopers.",
      icon: <Home className="h-5 w-5" />,
      details: [
        "Zodra je advertentie klaar is, komt je woning online op HuisDirect.",
        "Kopers kunnen je woning bekijken, door de foto’s klikken en direct contact met je opnemen.",
        "Je kunt extra marketing inzetten om je woning meer onder de aandacht te brengen.",
        "Hoe meer aandacht en promotie je kiest, hoe meer bereik je woning krijgt.",
        "Je bepaalt dit helemaal zelf, zodat je volledige controle houdt over kosten, zichtbaarheid en resultaat.",
      ],
    },
    {
      step: "Stap 3",
      title: "Ontvang aanvragen",
      summary: "Geïnteresseerden nemen direct contact met je op.",
      icon: <Users className="h-5 w-5" />,
      details: [
        "Aanvragen komen rechtstreeks bij jou binnen.",
        "Je hebt direct contact met kopers, zonder tussenpersoon.",
        "Je plant zelf bezichtigingen en kiest met wie je verder gaat.",
        "Dat maakt het proces sneller, persoonlijker en overzichtelijker.",
      ],
    },
    {
      step: "Stap 4",
      title: "Verkoop en bespaar",
      summary: "Regel zelf de verkoop en bespaar duizenden euro’s aan makelaarskosten.",
      icon: <Euro className="h-5 w-5" />,
      details: [
        "Je verkoopt je woning zelf, zonder hoge makelaarskosten.",
        "Daardoor houd je al snel duizenden euro’s in eigen zak.",
        "Je bepaalt zelf hoe je het proces aanpakt en waar je wel of niet in investeert.",
        "Simpel, transparant en zonder onnodige kosten.",
      ],
    },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="mb-4 text-3xl font-bold text-stone-900 sm:text-4xl">
          Hoe werkt HuisDirect?
        </h1>
        <p className="max-w-2xl text-lg text-stone-600">
          Je woning verkopen zonder makelaar. Simpel, snel en zonder gedoe.
        </p>
      </div>

      <div className="space-y-6">
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

      <div className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
          <p className="text-stone-700">
            Je zit nergens aan vast. Jij bepaalt zelf hoe je verkoopt, hoeveel
            je zelf regelt en hoeveel je uitgeeft.
          </p>
        </div>
      </div>

      <div className="mt-12 space-y-4">
        <p className="text-stone-600">
          Twijfel je nog?{" "}
          <Link
            href="/#calculator"
            className="font-semibold text-emerald-600 hover:underline"
          >
            Bereken eerst wat je kunt besparen
          </Link>
        </p>

        <Link
          href="/listings/new"
          className="inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          Plaats je woning
        </Link>
      </div>
    </main>
  );
}