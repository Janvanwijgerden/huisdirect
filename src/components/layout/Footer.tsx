import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-32 bg-stone-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-4">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                <img
                  src="/logo.png"
                  alt="HuisDirect"
                  className="h-8 w-8 object-contain"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-xl font-semibold tracking-tight text-white">
                  HuisDirect
                </span>
                <span className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
                  Zonder makelaar
                </span>
              </div>
            </Link>

            <p className="mt-6 text-sm leading-relaxed text-stone-400">
              Verkoop of vind een woning op een eenvoudige en transparante manier.
              <span className="text-white"> Zonder makelaar.</span>
            </p>

            <div className="mt-5 space-y-2 text-sm text-stone-500">
              <p>✓ Direct contact tussen koper en verkoper</p>
              <p>✓ Volledige controle over je verkoop</p>
              <p>✓ Bespaar duizenden euro’s</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
              Navigatie
            </h4>

            <ul className="mt-6 space-y-4 text-sm">
              <li>
                <Link
                  href="/listings"
                  className="text-stone-400 transition hover:text-white"
                >
                  Aanbod
                </Link>
              </li>
              <li>
                <Link
                  href="/hoe-het-werkt"
                  className="text-stone-400 transition hover:text-white"
                >
                  Hoe het werkt
                </Link>
              </li>
              <li>
                <Link
                  href="/voor-verkopers"
                  className="text-stone-400 transition hover:text-white"
                >
                  Voor verkopers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
              Account
            </h4>

            <ul className="mt-6 space-y-4 text-sm">
              <li>
                <Link
                  href="/auth/login"
                  className="text-stone-400 transition hover:text-white"
                >
                  Inloggen
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="text-stone-400 transition hover:text-white"
                >
                  Registreren
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-stone-400 transition hover:text-white"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/listings/new"
                  className="text-stone-400 transition hover:text-white"
                >
                  Woning plaatsen
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
              HuisDirect
            </h4>

            <ul className="mt-6 space-y-4 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-stone-400 transition hover:text-white"
                >
                  Over ons
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-stone-400 transition hover:text-white"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-stone-400 transition hover:text-white"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/voorwaarden"
                  className="text-stone-400 transition hover:text-white"
                >
                  Voorwaarden
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-stone-800 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} HuisDirect. Alle rechten voorbehouden.
          </p>

          <p className="text-xs text-stone-600">
            De moderne manier om je huis te verkopen
          </p>
        </div>
      </div>
    </footer>
  );
}