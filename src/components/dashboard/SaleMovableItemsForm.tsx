"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  addMovableItem,
  deleteMovableItem,
  updateMovableItem,
} from "../../lib/actions/sale-cases";
import type { SaleMovableItem } from "../../types/database";
import HuisSelect from "../ui/HuisSelect";

const CATEGORY_OPTIONS = [
  { value: "", label: "Selecteer categorie" },
  { value: "Raambekleding", label: "Raambekleding" },
  { value: "Verlichting", label: "Verlichting" },
  { value: "Keukenapparatuur", label: "Keukenapparatuur" },
  { value: "Sanitair", label: "Sanitair" },
  { value: "Tuin", label: "Tuin" },
  { value: "Meubilair", label: "Meubilair" },
  { value: "Berging en kasten", label: "Berging en kasten" },
  { value: "Overig", label: "Overig" },
  { value: "anders", label: "Anders" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Selecteer status" },
  { value: "included", label: "Blijft achter zonder vergoeding" },
  { value: "optional", label: "Ter overname" },
  { value: "excluded", label: "Wordt meegenomen" },
  { value: "not_present", label: "Niet aanwezig" },
];

type MovableItemFormState = {
  category: string;
  customCategory: string;
  itemName: string;
  itemStatus: SaleMovableItem["item_status"] | "";
  agreedPrice: string;
  notes: string;
};

const EMPTY_FORM: MovableItemFormState = {
  category: "",
  customCategory: "",
  itemName: "",
  itemStatus: "",
  agreedPrice: "",
  notes: "",
};

function formatCurrency(value?: number | null) {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getStatusLabel(value: string) {
  return (
    STATUS_OPTIONS.find((option) => option.value === value)?.label ??
    "Niet ingevuld"
  );
}

function isPredefinedCategory(category: string) {
  return CATEGORY_OPTIONS.some(
    (option) => option.value === category && option.value !== "anders"
  );
}

function getFinalCategory(state: MovableItemFormState) {
  if (state.category === "anders") {
    return state.customCategory.trim();
  }

  return state.category;
}

function buildFormData(
  saleCaseId: string,
  state: MovableItemFormState,
  itemId?: string
) {
  const formData = new FormData();
  formData.set("sale_case_id", saleCaseId);
  if (itemId) formData.set("item_id", itemId);
  formData.set("category", getFinalCategory(state));
  formData.set("item_name", state.itemName);
  formData.set("item_status", state.itemStatus);
  formData.set("agreed_price", state.agreedPrice);
  formData.set("notes", state.notes);
  return formData;
}

function validate(state: MovableItemFormState) {
  if (!state.category) return "Kies een categorie.";
  if (state.category === "anders" && !state.customCategory.trim()) {
    return "Vul een eigen categorie in.";
  }
  if (!state.itemStatus) return "Kies een status.";
  if (getFinalCategory(state) !== "Overig" && !state.itemName.trim()) {
    return "Vul de naam van de zaak in.";
  }
  return null;
}

function MovableItemFields({
  state,
  onChange,
}: {
  state: MovableItemFormState;
  onChange: (state: MovableItemFormState) => void;
}) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
      <div className="min-w-0">
        <HuisSelect
          key={`category-${state.category}`}
          name="category"
          label="Categorie"
          defaultValue={state.category}
          options={CATEGORY_OPTIONS}
          onChange={(category) =>
            onChange({
              ...state,
              category,
              customCategory:
                category === "anders" ? state.customCategory : "",
            })
          }
        />
        {state.category === "anders" ? (
          <label className="mt-4 block min-w-0">
            <span className="text-sm font-semibold text-neutral-800">
              Eigen categorie
            </span>
            <input
              value={state.customCategory}
              onChange={(event) =>
                onChange({ ...state, customCategory: event.target.value })
              }
              className="mt-2 h-12 w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="Bijv. tuinmeubelen, fitnessapparatuur"
            />
          </label>
        ) : null}
      </div>
      <HuisSelect
        key={`status-${state.itemStatus}`}
        name="item_status"
        label="Status"
        defaultValue={state.itemStatus}
        options={STATUS_OPTIONS}
        onChange={(itemStatus) =>
          onChange({
            ...state,
            itemStatus: itemStatus as MovableItemFormState["itemStatus"],
          })
        }
      />
      <label className="block min-w-0">
        <span className="text-sm font-semibold text-neutral-800">Zaak</span>
        <input
          value={state.itemName}
          onChange={(event) =>
            onChange({ ...state, itemName: event.target.value })
          }
          className="mt-2 h-12 w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          placeholder="Bijv. gordijnen woonkamer"
        />
        {state.category === "Overig" ? (
          <span className="mt-2 block text-sm leading-6 text-neutral-500">
            Bij 'Overig' hoeft u geen specifieke zaak op te geven.
          </span>
        ) : null}
      </label>
      <label className="block min-w-0">
        <span className="text-sm font-semibold text-neutral-800">
          Overnameprijs
        </span>
        <input
          value={state.agreedPrice}
          onChange={(event) =>
            onChange({ ...state, agreedPrice: event.target.value })
          }
          inputMode="decimal"
          className="mt-2 h-12 w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          placeholder="Alleen bij Ter overname"
        />
      </label>
      <label className="block min-w-0 md:col-span-2">
        <span className="text-sm font-semibold text-neutral-800">Notitie</span>
        <textarea
          value={state.notes}
          onChange={(event) => onChange({ ...state, notes: event.target.value })}
          rows={3}
          className="mt-2 w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm leading-6 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          placeholder="Optionele toelichting"
        />
      </label>
    </div>
  );
}

export default function SaleMovableItemsForm({
  saleCaseId,
  items,
}: {
  saleCaseId: string;
  items: SaleMovableItem[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [addState, setAddState] = useState<MovableItemFormState>(EMPTY_FORM);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editState, setEditState] = useState<MovableItemFormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const optionalTotal = items.reduce(
    (sum, item) =>
      item.item_status === "optional" ? sum + (item.agreed_price ?? 0) : sum,
    0
  );

  function runAction(action: () => Promise<void>, onSuccess?: () => void) {
    setError(null);
    startTransition(async () => {
      try {
        await action();
        onSuccess?.();
        router.refresh();
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "De wijziging kon niet worden opgeslagen."
        );
      }
    });
  }

  function handleAdd() {
    const validationError = validate(addState);
    if (validationError) {
      setError(validationError);
      return;
    }

    runAction(
      () => addMovableItem(buildFormData(saleCaseId, addState)),
      () => setAddState(EMPTY_FORM)
    );
  }

  function startEdit(item: SaleMovableItem) {
    const hasCustomCategory = !isPredefinedCategory(item.category);

    setError(null);
    setEditingItemId(item.id);
    setEditState({
      category: hasCustomCategory ? "anders" : item.category,
      customCategory: hasCustomCategory ? item.category : "",
      itemName: item.item_name,
      itemStatus: item.item_status,
      agreedPrice: item.agreed_price === null ? "" : String(item.agreed_price),
      notes: item.notes ?? "",
    });
  }

  function handleUpdate(itemId: string) {
    const validationError = validate(editState);
    if (validationError) {
      setError(validationError);
      return;
    }

    runAction(
      () => updateMovableItem(buildFormData(saleCaseId, editState, itemId)),
      () => setEditingItemId(null)
    );
  }

  function handleDelete(itemId: string) {
    const formData = new FormData();
    formData.set("sale_case_id", saleCaseId);
    formData.set("item_id", itemId);
    runAction(() => deleteMovableItem(formData));
  }

  return (
    <section className="mt-6 w-full max-w-full min-w-0 rounded-3xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-neutral-950">
            Lijst van Zaken
          </h3>
          <p className="mt-1 text-sm leading-6 text-neutral-600">
            Leg vast welke roerende zaken achterblijven, worden overgenomen of
            worden meegenomen.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm">
          <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
            Totaal ter overname
          </span>
          <span className="mt-1 block font-semibold text-neutral-950">
            {formatCurrency(optionalTotal) || "EUR 0"}
          </span>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-neutral-200 bg-white px-4 py-4 text-sm text-neutral-600">
            Er zijn nog geen roerende zaken toegevoegd.
          </p>
        ) : null}

        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
          >
            {editingItemId === item.id ? (
              <div className="space-y-4">
                <MovableItemFields state={editState} onChange={setEditState} />
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingItemId(null)}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 sm:w-auto"
                  >
                    <X className="h-4 w-4" />
                    Annuleren
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleUpdate(item.id)}
                    className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60 sm:w-auto"
                  >
                    Opslaan
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
                    {item.category}
                  </p>
                  <h4 className="mt-1 break-words text-sm font-semibold text-neutral-950">
                    {item.item_name}
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                      {getStatusLabel(item.item_status)}
                    </span>
                    {item.item_status === "optional" ? (
                      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-neutral-700">
                        {formatCurrency(item.agreed_price) || "Geen bedrag"}
                      </span>
                    ) : null}
                  </div>
                  {item.notes ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
                      {item.notes}
                    </p>
                  ) : null}
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 sm:w-auto"
                  >
                    <Pencil className="h-4 w-4" />
                    Wijzigen
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-3 text-sm font-semibold text-red-700 transition hover:border-red-200 disabled:opacity-60 sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    Verwijderen
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4 text-emerald-700" />
          <h4 className="text-sm font-semibold text-neutral-950">
            Nieuwe zaak toevoegen
          </h4>
        </div>
        <MovableItemFields state={addState} onChange={setAddState} />
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            disabled={isPending}
            onClick={handleAdd}
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60 sm:w-auto"
          >
            Toevoegen
          </button>
        </div>
      </div>
    </section>
  );
}
