import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function RegisterSuccessPage() {
  return (
    <div className="rounded-[2.5rem] border border-white/80 bg-white/95 p-8 text-center shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl md:p-10">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
        <CheckCircle2 className="h-8 w-8" />
      </div>

      <h1 className="font-sans text-4xl font-bold tracking-tight text-stone-900">
        Account aangemaakt
      </h1>

      <p className="mt-4 text-base leading-7 text-stone-600">
        Je account is succesvol aangemaakt. Je kunt nu inloggen en straks je woning,
        reacties en gegevens beheren via je eigen dashboard.
      </p>

      <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-left">
        <p className="text-sm leading-6 text-emerald-800">
          Gebruik hetzelfde e-mailadres en wachtwoord om direct verder te gaan.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/auth/login"
          className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-emerald-600/30"
        >
          Naar inloggen
          <ArrowRight className="h-5 w-5" />
        </Link>

        <Link
          href="/"
          className="inline-flex h-14 items-center justify-center rounded-2xl border border-stone-200 bg-white px-6 text-base font-semibold text-stone-700 transition hover:border-emerald-200 hover:text-emerald-700"
        >
          Terug naar home
        </Link>
      </div>
    </div>
  );
}