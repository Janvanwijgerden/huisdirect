"use client";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onStartPayment: () => void;
};

export default function PaymentModal({
  isOpen,
  onClose,
  onStartPayment,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          Bespaar duizenden euro’s op je verkoop
        </h2>

        <p className="mt-3 text-base leading-7 text-stone-600">
          Voor eenmalig €195 zet je jouw woning professioneel online — zonder
          makelaar en zonder commissie.
        </p>

        <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm text-stone-800">
          <div className="space-y-2">
            <p>✔️ Geen makelaarskosten (bespaar vaak €5.000+)</p>
            <p>✔️ Volledige controle over je eigen verkoop</p>
            <p>✔️ Onbeperkt aanpassen, ook na afkeuring</p>
          </div>
        </div>

        <p className="mt-4 text-xs text-stone-500">
          We controleren je woning kort voordat deze live gaat — meestal binnen
          24 uur.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            Annuleren
          </button>

          <button
            type="button"
            onClick={onStartPayment}
            className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Zet woning live voor €195
          </button>
        </div>
      </div>
    </div>
  );
}