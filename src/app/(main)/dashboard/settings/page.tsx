import { redirect } from "next/navigation";
import { createClient } from "../../../../lib/supabase/server";
import { Mail, Shield, Bell, User, Lock } from "lucide-react";

export default async function DashboardSettingsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
              Instellingen
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              Beheer hier je accountgegevens, beveiliging en voorkeuren.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                <User className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-medium text-neutral-900">Account</p>
                <p className="mt-1 break-all text-sm text-neutral-500">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                  <Mail className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
                    E-mailadres
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Je huidige e-mailadres voor inloggen en accountcommunicatie.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">
                  Huidig e-mailadres
                </p>
                <p className="mt-2 text-base font-medium text-neutral-900">
                  {user.email}
                </p>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  E-mailadres wijzigen
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                  <Lock className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
                    Beveiliging
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Beheer je wachtwoord en accounttoegang.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  Wachtwoord wijzigen
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                  <Bell className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
                    Meldingen
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Kies later hoe je updates over leads en activiteit ontvangt.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-500">
                Deze sectie breiden we later uit met e-mailvoorkeuren en meldingen.
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                  <Shield className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
                    Accountstatus
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Overzicht van je accountgegevens en toegang.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-neutral-100 px-4 py-4">
                  <span className="text-sm text-neutral-500">Ingelogd als</span>
                  <span className="text-sm font-medium text-neutral-900">
                    {user.email}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-neutral-100 px-4 py-4">
                  <span className="text-sm text-neutral-500">Omgeving</span>
                  <span className="text-sm font-medium text-neutral-900">
                    HuisDirect account
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}