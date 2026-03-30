import { listings } from "../../../../data/listings";
import { notFound } from "next/navigation";
import ListingImageCarousel from "../../../../components/listings/ListingImageCarousel";
import ListingSidebarCard from "../../../../components/listings/ListingSidebarCard";
import ListingLeadForm from "../../../../components/listings/ListingLeadForm";
import MobileStickyCTA from "../../../../components/listings/MobileStickyCTA";
import {
  BedDouble,
  Ruler,
  Home,
  Calendar,
  Leaf,
  Map,
  Euro,
  MapPin,
} from "lucide-react";

type Props = {
  params: {
    id: string;
  };
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

export default function ListingDetailPage({ params }: Props) {
  const listing = listings.find((l) => l.id === params.id);

  if (!listing) {
    return notFound();
  }

  const title = `${listing.propertyType} in ${listing.city}`;
  const price = listing.price;
  const bedrooms = listing.rooms;
  const livingArea = listing.size;
  const plotArea = listing.plotSize;
  const propertyType = listing.propertyType;
  const yearBuilt = listing.yearBuilt;
  const energyLabel = listing.energyLabel;
  const description = listing.description;
  const address = listing.address;
  const images = listing.images;
  const mapQuery = encodeURIComponent(address || listing.city || "Nederland");

  const contactPhone = "+31600000000";
  const contactEmail = "info@huisdirect.nl";

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 pb-32 sm:px-6 lg:px-8 lg:pb-8">
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2 text-sm text-stone-500">
              <MapPin className="h-4 w-4" />
              <span>{address}</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              {title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-stone-600">
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                {formatPrice(price)}
              </span>

              <span className="rounded-full bg-stone-100 px-3 py-1">
                {propertyType}
              </span>

              <span className="rounded-full bg-stone-100 px-3 py-1">
                Energielabel {energyLabel}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-10">
              <ListingImageCarousel images={images} title={title} />

              <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-2xl font-semibold text-stone-900">
                  Kenmerken
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-2xl bg-stone-50 p-4">
                    <Euro className="h-5 w-5 text-emerald-700" />
                    <div>
                      <p className="text-sm text-stone-500">Vraagprijs</p>
                      <p className="font-semibold text-stone-900">
                        {formatPrice(price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-stone-50 p-4">
                    <BedDouble className="h-5 w-5 text-emerald-700" />
                    <div>
                      <p className="text-sm text-stone-500">Slaapkamers</p>
                      <p className="font-semibold text-stone-900">
                        {bedrooms}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-stone-50 p-4">
                    <Ruler className="h-5 w-5 text-emerald-700" />
                    <div>
                      <p className="text-sm text-stone-500">Woonoppervlakte</p>
                      <p className="font-semibold text-stone-900">
                        {livingArea} m²
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-stone-50 p-4">
                    <Map className="h-5 w-5 text-emerald-700" />
                    <div>
                      <p className="text-sm text-stone-500">
                        Perceeloppervlakte
                      </p>
                      <p className="font-semibold text-stone-900">
                        {plotArea} m²
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-stone-50 p-4">
                    <Calendar className="h-5 w-5 text-emerald-700" />
                    <div>
                      <p className="text-sm text-stone-500">Bouwjaar</p>
                      <p className="font-semibold text-stone-900">
                        {yearBuilt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-stone-50 p-4">
                    <Leaf className="h-5 w-5 text-emerald-700" />
                    <div>
                      <p className="text-sm text-stone-500">Energielabel</p>
                      <p className="font-semibold text-stone-900">
                        {energyLabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-stone-50 p-4 sm:col-span-2">
                    <Home className="h-5 w-5 text-emerald-700" />
                    <div>
                      <p className="text-sm text-stone-500">Woningtype</p>
                      <p className="font-semibold text-stone-900">
                        {propertyType}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-2xl font-semibold text-stone-900">
                  Omschrijving
                </h2>

                <div className="space-y-4 leading-8 text-stone-700">
                  {description.split("\n\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-2xl font-semibold text-stone-900">
                  Locatie
                </h2>

                <div className="mb-4 flex items-start gap-3 text-stone-700">
                  <MapPin className="mt-1 h-5 w-5 text-emerald-700" />
                  <p>{address}</p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-stone-200">
                  <iframe
                    title={`Kaart van ${title}`}
                    src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                    width="100%"
                    height="420"
                    loading="lazy"
                    className="block w-full"
                  />
                </div>
              </section>

              <div id="lead-form">
                <ListingLeadForm listingTitle={title} />
              </div>
            </div>

            <ListingSidebarCard
              price={price}
              bedrooms={bedrooms}
              livingArea={livingArea}
              plotArea={plotArea}
              yearBuilt={yearBuilt}
              energyLabel={energyLabel}
              phone={contactPhone}
              email={contactEmail}
            />
          </div>
        </div>
      </div>

      <MobileStickyCTA />
    </>
  );
}