import {
  CalendarDays,
  Leaf,
  Phone,
  Ruler,
  BedDouble,
  ShieldCheck,
  Mail,
} from "lucide-react";

type Props = {
  price?: number | string;
  bedrooms?: number;
  livingArea?: number;
  plotArea?: number;
  yearBuilt?: number;
  energyLabel?: string;
  phone?: string;
  email?: string;
  status?: string;
};

function formatPrice(price?: number | string) {
  if (price === undefined || price === null || price === "") {
    return "Prijs op aanvraag";
  }

  if (typeof price === "number") {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  }

  return price;
}

export default function ListingSidebarCard({
  price,
  bedrooms,
  livingArea,
  plotArea,
  yearBuilt,
  energyLabel,
  phone = "+31600000000",
  email = "info@huisdirect.nl",
  status,
}: Props) {
  const isSold = status === "sold";

  return (
    <aside className="self-start lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 bg-gradient-to-b from-emerald-50 to-white p-6">
          <p className="text-sm font-medium text-stone-500">
            {isSold ? "Status" : "Vraagprijs"}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
            {isSold ? "Verkocht" : formatPrice(price)}
          </p>

          {!isSold && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
              <ShieldCheck className="h-4 w-4" />
              Direct contact mogelijk
            </div>
          )}

          {isSold && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
              Verkocht
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
              <div className="flex items-center gap-2 text-stone-600">
                <BedDouble className="h-4 w-4 text-emerald-700" />
                <span className="text-sm">Kamers</span>
              </div>
              <span className="text-sm font-semibold text-stone-900">
                {bedrooms ?? "-"}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
              <div className="flex items-center gap-2 text-stone-600">
                <Ruler className="h-4 w-4 text-emerald-700" />
                <span className="text-sm">Woonoppervlakte</span>
              </div>
              <span className="text-sm font-semibold text-stone-900">
                {livingArea ? `${livingArea} m²` : "-"}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
              <div className="flex items-center gap-2 text-stone-600">
                <Ruler className="h-4 w-4 text-emerald-700" />
                <span className="text-sm">Perceel</span>
              </div>
              <span className="text-sm font-semibold text-stone-900">
                {plotArea ? `${plotArea} m²` : "-"}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
              <div className="flex items-center gap-2 text-stone-600">
                <CalendarDays className="h-4 w-4 text-emerald-700" />
                <span className="text-sm">Bouwjaar</span>
              </div>
              <span className="text-sm font-semibold text-stone-900">
                {yearBuilt ?? "-"}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
              <div className="flex items-center gap-2 text-stone-600">
                <Leaf className="h-4 w-4 text-emerald-700" />
                <span className="text-sm">Energielabel</span>
              </div>
              <span className="text-sm font-semibold text-stone-900">
                {energyLabel ?? "-"}
              </span>
            </div>
          </div>

          {!isSold && (
            <div className="mt-6 space-y-3">
              <a
                href="#contact-section"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                Plan bezichtiging
              </a>

              <a
                href={`tel:${phone}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              >
                <Phone className="h-4 w-4" />
                Neem contact op
              </a>

              <a
                href={`mailto:${email}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
              >
                <Mail className="h-4 w-4" />
                Stuur een e-mail
              </a>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4">
            {!isSold ? (
              <>
                <p className="text-sm font-semibold text-stone-900">
                  Snel schakelen via HuisDirect
                </p>
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  Geïnteresseerd in deze woning? Vraag eenvoudig meer informatie aan
                  of plan direct een bezichtiging.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-stone-900">
                  Deze woning is verkocht
                </p>
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  Deze woning is niet meer beschikbaar. Contact aanvragen en
                  bezichtigingen zijn daarom uitgeschakeld.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}