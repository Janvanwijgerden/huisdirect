"use client";

import { useState } from "react";
import { updatePassword } from "../../../lib/actions/auth";
import { Lock, ArrowRight } from "lucide-react";

export default function UpdatePasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    const result = await updatePassword(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-white/80 bg-white/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
          <Lock className="h-7 w-7" />
        </div>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Nieuw wachtwoord
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Kies een nieuw wachtwoord voor je account.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Nieuw wachtwoord
          </label>

          <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-emerald-500 focus-within:bg-white">
            <Lock className="mr-3 h-5 w-5 text-slate-400" />
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Voer je nieuwe wachtwoord in"
              className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Bezig..." : "Wachtwoord opslaan"}
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}