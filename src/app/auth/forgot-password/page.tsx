"use client";

import Link from "next/link";
import { useState } from "react";
import { requestPasswordReset } from "../../../lib/actions/auth";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    setLoading(true);

    const result = await requestPasswordReset(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-white/80 bg-white/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
          <ShieldCheck className="h-7 w-7" />
        </div>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Wachtwoord vergeten
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Vul je e-mailadres in. Dan sturen we je een link om je wachtwoord opnieuw in te stellen.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Als dit e-mailadres bekend is, hebben we een resetlink verstuurd. Controleer ook je spammap.
        </div>
      )}

      <form action={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            E-mail
          </label>

          <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-emerald-500 focus-within:bg-white">
            <Mail className="mr-3 h-5 w-5 text-slate-400" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="jij@voorbeeld.nl"
              className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Bezig..." : "Resetlink versturen"}
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Weet je je wachtwoord weer?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          Terug naar inloggen
        </Link>
      </p>
    </div>
  );
}