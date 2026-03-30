import { Calendar, Home, Leaf, Ruler } from "lucide-react";

type Props = {
  propertyType: string;
  yearBuilt: number;
  energyLabel: string;
  plotSize: number;
};

export default function ListingHighlights({
  propertyType,
  yearBuilt,
  energyLabel,
  plotSize,
}: Props) {
  const items = [
    {
      icon: Home,
      label: "Type",
      value: propertyType,
    },
    {
      icon: Calendar,
      label: "Bouwjaar",
      value: yearBuilt.toString(),
    },
    {
      icon: Leaf,
      label: "Energielabel",
      value: energyLabel,
    },
    {
      icon: Ruler,
      label: "Perceel",
      value: `${plotSize} m²`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Icon className="h-5 w-5" />
            </div>

            <p className="text-xs font-medium uppercase tracking-[0.12em] text-stone-500">
              {item.label}
            </p>

            <p className="mt-1 text-sm font-semibold text-stone-900">
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}