import Link from "next/link";
import Image from "next/image";
import { LogOut, Menu, X } from "lucide-react";
import { createClient } from "../../lib/supabase/server";
import { signOut } from "../../lib/actions/auth";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:h-14 sm:w-14">
            <Image
              src="/logo.png"
              alt="HuisDirect"
              width={56}
              height={56}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="min-w-0">
            <div className="truncate text-[1.9rem] font-semibold leading-none tracking-tight text-slate-900 sm:text-[2rem]">
              HuisDirect
            </div>
            <div className="mt-1 truncate text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-600 sm:text-sm sm:tracking-[0.28em]">
              Zonder makelaar
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/listings"
            className="text-lg font-medium text-slate-700 transition hover:text-slate-900"
          >
            Aanbod
          </Link>

          <Link
            href="/hoe-het-werkt"
            className="text-lg font-medium text-slate-700 transition hover:text-slate-900"
          >
            Hoe het werkt
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-lg font-medium text-slate-700 transition hover:text-slate-900"
              >
                Mijn account
              </Link>

              <form action={signOut}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 text-lg font-medium text-slate-700 transition hover:text-slate-900"
                >
                  Uitloggen
                  <LogOut className="h-4 w-4" />
                </button>
              </form>

              <Link
                href="/listings/new"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                Plaats woning
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-lg font-medium text-slate-700 transition hover:text-slate-900"
              >
                Inloggen
              </Link>

              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                Plaats woning
              </Link>
            </>
          )}
        </nav>

        <details className="relative md:hidden">
          <summary className="flex h-12 w-12 cursor-pointer list-none items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
            <Menu className="h-6 w-6 details-open:hidden" />
            <X className="hidden h-6 w-6 details-open:block" />
          </summary>

          <div className="absolute right-0 top-[calc(100%+12px)] w-[min(92vw,360px)] overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
            <div className="mb-2 px-2 pt-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Menu
              </p>
            </div>

            <div className="space-y-1">
              <Link
                href="/listings"
                className="flex min-h-[48px] items-center rounded-2xl px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-50"
              >
                Aanbod
              </Link>

              <Link
                href="/hoe-het-werkt"
                className="flex min-h-[48px] items-center rounded-2xl px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-50"
              >
                Hoe het werkt
              </Link>

              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex min-h-[48px] items-center rounded-2xl px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-50"
                  >
                    Mijn account
                  </Link>

                  <Link
                    href="/listings/new"
                    className="mt-2 inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                  >
                    Plaats woning
                  </Link>

                  <form action={signOut} className="mt-2">
                    <button
                      type="submit"
                      className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-50"
                    >
                      Uitloggen
                      <LogOut className="h-4 w-4" />
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="flex min-h-[48px] items-center rounded-2xl px-4 py-3 text-base font-medium text-slate-800 transition hover:bg-slate-50"
                  >
                    Inloggen
                  </Link>

                  <Link
                    href="/auth/register"
                    className="mt-2 inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                  >
                    Plaats woning
                  </Link>
                </>
              )}
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}