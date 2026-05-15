import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  Euro,
  FileText,
  Home,
  Landmark,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { createClient } from "../../../../../lib/supabase/server";
import { getOrCreateSaleCase } from "../../../../../lib/actions/sale-cases";
import SaleCaseForm from "../../../../../components/dashboard/SaleCaseForm";
import SaleContractActions from "../../../../../components/dashboard/SaleContractActions";


function formatPrice(value?: number | null) {
  if (!value) return "Nog niet ingevuld";

  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string | null) {
  if (!value) return "Nog niet ingevuld";

  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function getTemplateLabel(templateType: string) {
  if (templateType === "appartement") return "Koopovereenkomst appartement";
  return "Koopovereenkomst woning";
}

function getStatusLabel(status: string) {
  if (status === "ready") return "Klaar voor generatie";
  if (status === "generated") return "Concept gegenereerd";
  if (status === "sent") return "Verzonden";
  if (status === "signed") return "Ondertekend";
  if (status === "cancelled") return "Geannuleerd";
  return "Conceptdossier";
}

export default async function SaleCasePage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const resolvedParams = await params;
  const listingId = resolvedParams.listingId;

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: listing } = await supabase
    .from("listings")
    .select(
      "id, title, street, house_number, postal_code, city, asking_price, property_type, living_area, plot_size, year_built, status"
    )
    .eq("id", listingId)
    .eq("user_id", user.id)
    .single();

  if (!listing) {
    return (
      <main className="min-h-screen bg-neutral-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-neutral-950">
            Woning niet gevonden
          </h1>
          <p className="mt-3 text-neutral-600">
            Deze woning bestaat niet of hoort niet bij jouw account.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Terug naar dashboard
          </Link>
        </div>
      </main>
    );
  }

  const { saleCase, saleCondition } = await getOrCreateSaleCase(listingId);

  const { data: latestContractDocument } = await supabase
    .from("sale_documents")
    .select("public_url, version, created_at")
    .eq("sale_case_id", saleCase.id)
    .eq("document_type", "koopovereenkomst_docx")
    .order("version", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: sellers } = await supabase
    .from("sale_sellers")
    .select("*")
    .eq("sale_case_id", saleCase.id)
    .order("seller_order", { ascending: true });

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-5">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-neutral-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Terug naar dashboard
          </Link>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <div className="border-b border-neutral-200 bg-gradient-to-br from-emerald-50 via-white to-neutral-50 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                  <FileText className="h-3.5 w-3.5" />
                  Verkoopdossier
                </div>

                <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                  Automatische koopovereenkomst
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">
                  Vul alleen de ontbrekende verkoopafspraken aan. De woninggegevens
                  en basisinformatie worden automatisch uit je advertentie en account
                  gehaald.
                </p>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm lg:min-w-[300px]">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                  Dossierstatus
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50">
                    <BadgeCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-950">
                      {getStatusLabel(saleCase.status)}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {getTemplateLabel(saleCase.template_type)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

<div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-8">
  <div className="space-y-6">
    <SaleCaseForm
      listingId={listingId}
      saleCase={saleCase}
      saleCondition={saleCondition}
      buyer={null}
      sellers={sellers ?? []}
    />
                  <section className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
                    <Home className="h-5 w-5 text-emerald-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-neutral-950">
                      Woninggegevens
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">
                      Deze gegevens komen automatisch uit je woningadvertentie.
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <InfoItem label="Titel" value={listing.title || "Nog niet ingevuld"} />
                      <InfoItem
                        label="Adres"
                        value={`${listing.street || ""} ${listing.house_number || ""}`.trim() || "Nog niet ingevuld"}
                      />
                      <InfoItem label="Postcode" value={listing.postal_code || "Nog niet ingevuld"} />
                      <InfoItem label="Plaats" value={listing.city || "Nog niet ingevuld"} />
                      <InfoItem label="Woningtype" value={listing.property_type || "Nog niet ingevuld"} />
                      <InfoItem label="Vraagprijs" value={formatPrice(listing.asking_price)} />
                      <InfoItem
                        label="Woonoppervlakte"
                        value={listing.living_area ? `${listing.living_area} m²` : "Nog niet ingevuld"}
                      />
                      <InfoItem
                        label="Perceel"
                        value={listing.plot_size ? `${listing.plot_size} m²` : "Nog niet ingevuld"}
                      />
                      <InfoItem
                        label="Bouwjaar"
                        value={listing.year_built ? String(listing.year_built) : "Nog niet ingevuld"}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
                    <Euro className="h-5 w-5 text-emerald-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-neutral-950">
                      Prijs en overdracht
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">
                      Dit wordt straks het financiële hart van de koopovereenkomst.
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <InfoItem label="Overeengekomen koopprijs" value={formatPrice(saleCase.agreed_price)} />
                      <InfoItem label="Waarde roerende zaken" value={formatPrice(saleCase.movable_goods_value)} />
                      <InfoItem label="Datum akkoord" value={formatDate(saleCase.acceptance_date)} />
                      <InfoItem label="Leveringsdatum" value={formatDate(saleCase.transfer_date)} />
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-neutral-950">
                      Ontbindende voorwaarden
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">
                      Deze onderdelen bepalen wanneer koper nog van de overeenkomst
                      af kan.
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <InfoItem
                        label="Financieringsvoorbehoud"
                        value={saleCondition?.financing_required ? "Ja" : "Nee"}
                      />
                      <InfoItem
                        label="Financieringsbedrag"
                        value={formatPrice(saleCondition?.financing_amount)}
                      />
                      <InfoItem
                        label="Deadline financiering"
                        value={formatDate(saleCondition?.financing_deadline)}
                      />
                      <InfoItem
                        label="NHG"
                        value={saleCondition?.nhg_required ? "Ja" : "Nee"}
                      />
                      <InfoItem
                        label="Bouwkundige keuring"
                        value={saleCondition?.building_inspection_required ? "Ja" : "Nee"}
                      />
                      <InfoItem
                        label="Waarborgsom/bankgarantie"
                        value={saleCondition?.bank_guarantee_required ? "Ja" : "Nee"}
                      />
                      <InfoItem
                        label="Bedrag bankgarantie"
                        value={formatPrice(saleCondition?.bank_guarantee_amount)}
                      />
                      <InfoItem
                        label="Registratie koopakte"
                        value={saleCondition?.registration_required ? "Ja" : "Nee"}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
                    <Landmark className="h-5 w-5 text-emerald-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-neutral-950">
                      Notaris
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">
                      De notaris verzorgt uiteindelijk de juridische levering.
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <InfoItem label="Notariskantoor" value={saleCase.notary_office_name || "Nog niet ingevuld"} />
                      <InfoItem label="Plaats notaris" value={saleCase.notary_city || "Nog niet ingevuld"} />
                      <InfoItem label="E-mail notaris" value={saleCase.notary_email || "Nog niet ingevuld"} />
                      <InfoItem label="Telefoon notaris" value={saleCase.notary_phone || "Nog niet ingevuld"} />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <div className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-neutral-950">
                  Koopovereenkomst
                </h2>

                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  Genereer een DOCX op basis van de ingevulde kopergegevens,
                  afspraken, voorwaarden en woninginformatie.
                </p>

                <SaleContractActions
                  saleCaseId={saleCase.id}
                  latestDocument={latestContractDocument}
                />
              </div>

              <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-emerald-700" />
                  <p className="font-semibold text-emerald-950">
                    Rustige begeleiding
                  </p>
                </div>
                <p className="mt-3 text-sm leading-6 text-emerald-900">
                  De gebruiker ziet straks geen juridische muur tekst, maar een
                  begrijpelijke workflow. Dat verlaagt onzekerheid en verhoogt de
                  kans dat iemand het proces afrondt.
                </p>
              </div>

              <div className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <UserRound className="h-5 w-5 text-neutral-700" />
                  <p className="font-semibold text-neutral-950">
                    Kopergegevens
                  </p>
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  Nog niet ingevuld. In de volgende stap maken we hiervoor een
                  professioneel formulier met ondersteuning voor één of twee kopers.
                </p>
              </div>

              <div className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-neutral-700" />
                  <p className="font-semibold text-neutral-950">
                    Documenttype
                  </p>
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {getTemplateLabel(saleCase.template_type)}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  const isEmpty = value === "Nog niet ingevuld";

  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
        {label}
      </p>
      <p
        className={`mt-1 text-sm font-semibold ${
          isEmpty ? "text-neutral-400" : "text-neutral-950"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
