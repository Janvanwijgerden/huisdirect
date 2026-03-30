type ListingMapProps = {
  address: string;
  city: string;
  lat: number;
  lng: number;
};

export default function ListingMap({
  address,
  city,
  lat,
  lng,
}: ListingMapProps) {
  const delta = 0.01;

  const left = lng - delta;
  const right = lng + delta;
  const top = lat + delta;
  const bottom = lat - delta;

  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-stone-900">Locatie</h2>
        <p className="mt-1 text-sm text-stone-600">
          {address}, {city}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200">
        <iframe
          title={`Kaart van ${address}, ${city}`}
          src={embedUrl}
          className="h-[360px] w-full"
          loading="lazy"
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-stone-500">
          Bekijk exacte ligging
        </span>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
        >
          Open in Maps
        </a>
      </div>
    </section>
  );
}