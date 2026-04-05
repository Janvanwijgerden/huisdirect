import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { CheckCircle2, Euro, Shield, Users } from 'lucide-react';

type Props = {
  children: ReactNode;
};

const BENEFITS = [
  {
    icon: Euro,
    title: 'Bespaar duizenden euro’s',
    text: 'Verkoop je woning zonder traditionele makelaarskosten.',
  },
  {
    icon: Users,
    title: 'Direct contact met kopers',
    text: 'Ontvang aanvragen rechtstreeks en houd zelf de regie.',
  },
  {
    icon: Shield,
    title: 'Simpel en transparant',
    text: 'Een helder proces, zonder onnodige complexiteit.',
  },
];

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-stone-50">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-stone-100/80 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-100/50 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        {/* Topbar */}
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-4 rounded-2xl px-2 py-2 transition hover:bg-white/70"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
              <Image
                src="/logo.png"
                alt="HuisDirect"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
                priority
              />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-semibold tracking-tight text-stone-900">
                HuisDirect
              </span>
              <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.24em] text-emerald-600 sm:text-xs">
                Zonder makelaar
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="hidden rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700 sm:inline-flex"
          >
            Terug naar home
          </Link>
        </header>

        {/* Content */}
        <main className="flex flex-1 items-center py-10 lg:py-14">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] xl:gap-16">
            {/* Left brand / trust panel */}
            <section className="hidden lg:block">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  Verkoop slimmer. Zonder makelaar.
                </div>

                <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-tight tracking-tight text-stone-900">
                  Regel je woningverkoop
                  <span className="text-emerald-600"> directer, voordeliger en transparanter.</span>
                </h1>

                <p className="mt-6 max-w-lg text-lg leading-8 text-stone-600">
                  HuisDirect helpt verkopers om zelf online zichtbaar te zijn, serieuze kopers te bereiken
                  en de regie in eigen hand te houden.
                </p>

                <div className="mt-10 grid gap-4">
                  {BENEFITS.map((benefit) => {
                    const Icon = benefit.icon;

                    return (
                      <div
                        key={benefit.title}
                        className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm ring-1 ring-stone-100 backdrop-blur"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <Icon className="h-5 w-5" />
                          </div>

                          <div>
                            <h2 className="text-base font-semibold text-stone-900">
                              {benefit.title}
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-stone-600">
                              {benefit.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Right form */}
            <section className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <div className="rounded-[2rem] border border-white/80 bg-emerald-50/70 p-4 shadow-sm backdrop-blur sm:p-5">
                  {children}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}