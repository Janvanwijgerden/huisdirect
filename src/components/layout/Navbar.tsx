import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
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
        <Link href="/" className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Image
              src="/logo.png"
              alt="HuisDirect"
              width={56}
              height={56}
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <div className="text-[2rem] font-semibold leading-none tracking-tight text-slate-900">
              HuisDirect
            </div>
            <div className="mt-1 text-sm font-medium uppercase tracking-[0.28em] text-emerald-600">
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
      </div>
    </header>
  );
}