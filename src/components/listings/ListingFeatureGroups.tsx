type FeatureItem = {
  label: string;
  value: string;
};

type FeatureGroup = {
  title: string;
  items: FeatureItem[];
};

type Props = {
  groups: FeatureGroup[];
};

export default function ListingFeatureGroups({ groups }: Props) {
  if (!groups || groups.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="mb-8 text-2xl font-semibold text-stone-900">
        Kenmerken
      </h2>

      <div className="space-y-10">
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-4 text-lg font-semibold text-stone-900">
              {group.title}
            </h3>

            <div className="overflow-hidden rounded-2xl border border-stone-200">
              {group.items.map((item, index) => (
                <div
                  key={`${group.title}-${item.label}`}
                  className={[
                    "grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-[260px_1fr]",
                    index !== group.items.length - 1
                      ? "border-b border-stone-100"
                      : "",
                  ].join(" ")}
                >
                  <div className="text-sm font-medium text-stone-500">
                    {item.label}
                  </div>

                  <div className="text-sm font-semibold text-stone-900">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}