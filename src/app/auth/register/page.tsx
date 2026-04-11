"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { signUp } from "../../../lib/actions/auth";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  const passwordChecks = useMemo(() => {
    return {
      minLength: passwordValue.length >= 8,
      uppercase: /[A-Z]/.test(passwordValue),
      number: /\d/.test(passwordValue),
    };
  }, [passwordValue]);

  const isStrongPassword =
    passwordChecks.minLength &&
    passwordChecks.uppercase &&
    passwordChecks.number;

  function getPasswordValidationMessage(password: string) {
    if (password.length < 8) {
      return "Je wachtwoord moet minimaal 8 tekens bevatten.";
    }

    if (!/[A-Z]/.test(password)) {
      return "Je wachtwoord moet minimaal 1 hoofdletter bevatten.";
    }

    if (!/\d/.test(password)) {
      return "Je wachtwoord moet minimaal 1 cijfer bevatten.";
    }

    return null;
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    setPasswordError(null);
    setLoading(true);

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const validationMessage = getPasswordValidationMessage(password);

    if (validationMessage) {
      setPasswordError(validationMessage);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("De ingevoerde wachtwoorden komen niet overeen.");
      setLoading(false);
      return;
    }

    const result = await signUp(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result?.success) {
      window.location.href = "/auth/register/success";
      return;
    }

    setLoading(false);
    setError("Er ging iets mis. Probeer het opnieuw.");
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
          Account aanmaken
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Maak je account aan en start met het beheren van je woning op
          HuisDirect.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {passwordError && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {passwordError}
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

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Wachtwoord
          </label>

          <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-emerald-500 focus-within:bg-white">
            <Lock className="mr-3 h-5 w-5 text-slate-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              placeholder="Kies een sterk wachtwoord"
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

          <div className="mt-3 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2
                className={`h-4 w-4 ${
                  passwordChecks.minLength
                    ? "text-emerald-600"
                    : "text-slate-300"
                }`}
              />
              <span
                className={
                  passwordChecks.minLength
                    ? "text-emerald-700"
                    : "text-slate-600"
                }
              >
                Minimaal 8 tekens
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2
                className={`h-4 w-4 ${
                  passwordChecks.uppercase
                    ? "text-emerald-600"
                    : "text-slate-300"
                }`}
              />
              <span
                className={
                  passwordChecks.uppercase
                    ? "text-emerald-700"
                    : "text-slate-600"
                }
              >
                Minimaal 1 hoofdletter
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2
                className={`h-4 w-4 ${
                  passwordChecks.number ? "text-emerald-600" : "text-slate-300"
                }`}
              />
              <span
                className={
                  passwordChecks.number ? "text-emerald-700" : "text-slate-600"
                }
              >
                Minimaal 1 cijfer
              </span>
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Herhaal wachtwoord
          </label>

          <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-emerald-500 focus-within:bg-white">
            <Lock className="mr-3 h-5 w-5 text-slate-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPasswordValue}
              onChange={(e) => setConfirmPasswordValue(e.target.value)}
              placeholder="Herhaal je wachtwoord"
              className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="ml-3 text-slate-400 transition hover:text-slate-600"
              aria-label={
                showConfirmPassword
                  ? "Verberg herhaald wachtwoord"
                  : "Toon herhaald wachtwoord"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {confirmPasswordValue.length > 0 && (
            <p
              className={`mt-2 text-sm ${
                passwordValue === confirmPasswordValue
                  ? "text-emerald-700"
                  : "text-red-700"
              }`}
            >
              {passwordValue === confirmPasswordValue
                ? "Wachtwoorden komen overeen."
                : "Wachtwoorden komen nog niet overeen."}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !isStrongPassword}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Bezig..." : "Account aanmaken"}
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Al een account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          Inloggen
        </Link>
      </p>
    </div>
  );
}