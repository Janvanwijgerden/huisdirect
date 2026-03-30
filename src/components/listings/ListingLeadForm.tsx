"use client";

import { FormEvent, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

type Props = {
  listingTitle: string;
};

export default function ListingLeadForm({ listingTitle }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    requestType: "bezichtiging",
    message: `Hallo,\n\nIk heb interesse in ${listingTitle} en ontvang graag meer informatie.\n`,
  });

  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id="contact-section"
      className="scroll-mt-28 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div>
          <div className="mb-3 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Direct contact
          </div>

          <h2 className="text-2xl font-semibold text-stone-900 sm:text-3xl">
            Vraag direct een bezichtiging of meer informatie aan
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-stone-700">
            Laat je gegevens achter voor <span className="font-semibold text-stone-900">{listingTitle}</span>.
            We nemen daarna zo snel mogelijk contact met je op om een bezichtiging,
            extra informatie of een terugbelmoment in te plannen.
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5">
          <h3 className="text-sm font-semibold text-stone-900">
            Waarom via HuisDirect?
          </h3>

          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-700" />
              <p className="text-sm leading-6 text-stone-700">
                Vraag direct een bezichtiging aan.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 h-4 w-4 text-emerald-700" />
              <p className="text-sm leading-6 text-stone-700">
                Gericht op snelheid en duidelijke opvolging.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-700" />
              <p className="text-sm leading-6 text-stone-700">
                Eenvoudig en laagdrempelig contact.
              </p>
            </div>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />
            <div>
              <p className="text-base font-semibold text-emerald-900">
                Je aanvraag is ontvangen
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-800">
                Dit is nu nog een front-end demo, dus er wordt nog niets echt verzonden.
                Visueel en qua flow staat het formulier nu wel klaar voor een echte koppeling
                met e-mail, database of CRM.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Naam
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 transition focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
                <User className="h-4 w-4 text-emerald-700" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Jouw naam"
                  className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                E-mailadres
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 transition focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
                <Mail className="h-4 w-4 text-emerald-700" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="jij@voorbeeld.nl"
                  className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Telefoonnummer
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 transition focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
                <Phone className="h-4 w-4 text-emerald-700" />
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+31 6 12345678"
                  className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="requestType"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Waar wil je contact over?
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 transition focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
                <CalendarDays className="h-4 w-4 text-emerald-700" />
                <select
                  id="requestType"
                  value={formData.requestType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      requestType: e.target.value,
                    }))
                  }
                  className="w-full bg-transparent text-sm text-stone-900 outline-none"
                >
                  <option value="bezichtiging">Bezichtiging aanvragen</option>
                  <option value="informatie">Meer informatie ontvangen</option>
                  <option value="terugbellen">Teruggebeld worden</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Extra toelichting
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              rows={5}
              className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              placeholder="Typ hier je bericht..."
            />
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-stone-900">
                Klaar om de volgende stap te zetten?
              </p>
              <p className="mt-1 text-sm leading-6 text-stone-600">
                Laat je gegevens achter en vraag direct een bezichtiging of extra informatie aan.
              </p>
            </div>

            <button
              type="submit"
              className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Verstuur aanvraag
            </button>
          </div>
        </form>
      )}
    </section>
  );
}