"use client";

import Link from "next/link";
import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { signIn } from "../../../lib/actions/auth";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";

// Geïsoleerde submit knop om de pending status uit useFormStatus te kunnen lezen
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Bezig..." : "Inloggen"}
      <ArrowRight className="h-5 w-5" />
    </button>
  );
}

function LoginFormContent() {
  const searchParams = useSearchParams();

  const resetSuccess = useMemo(
    () => searchParams.get("reset") === "success",
    [searchParams]
  );

  const verifiedSuccess = useMemo(
    () => searchParams.get("verified") === "success",
    [searchParams]
  );

  const [showPassword, setShowPassword] = useState(false);
  
  // Maakt naadloos gebruik van de Server Action, inclusief error state management
  const [state, formAction] = useFormState(signIn, null);

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-white/80 bg-white/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
          <ShieldCheck className="h-7 w-7" />
        </div>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Inloggen
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Log in op je account en beheer je woningadvertenties eenvoudig zelf.
        </p>
      </div>

      {verifiedSuccess && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Je e-mailadres is succesvol bevestigd. Je kunt nu inloggen.
        </div>
      )}

      {resetSuccess && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Je wachtwoord is succesvol aangepast. Je kunt nu inloggen met je nieuwe wachtwoord.
        </div>
      )}

      {state?.error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-5">
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

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Wachtwoord
            </label>

            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
            >
              Wachtwoord vergeten?
            </Link>
          </div>

          <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-emerald-500 focus-within:bg-white">
            <Lock className="mr-3 h-5 w-5 text-slate-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Voer je wachtwoord in"
              className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="ml-3 text-slate-400 transition hover:text-slate-600"
              aria-label={showPassword ? "Verberg wachtwoord" : "Toon wachtwoord"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <SubmitButton />
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Nog geen account?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          Account aanmaken
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Laden...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}