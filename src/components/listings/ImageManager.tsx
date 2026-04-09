"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Star, Trash2, Upload } from "lucide-react";

type ListingImage = {
  id: string;
  public_url: string;
  is_cover: boolean;
  position: number | null;
};

export default function ImageManager({ listingId }: { listingId: string }) {
  const [images, setImages] = useState<ListingImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomInputRef = useRef<HTMLInputElement | null>(null);

  async function loadImages() {
    try {
      const res = await fetch(
        `/api/listing-images?listingId=${encodeURIComponent(listingId)}`,
        { cache: "no-store" }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Foto’s ophalen mislukt.");
      }

      setImages(Array.isArray(json) ? json : []);
    } catch (err: any) {
      setError(err?.message || "Foto’s ophalen mislukt.");
    }
  }

  useEffect(() => {
    void loadImages();
  }, [listingId]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("listingId", listingId);

      for (let i = 0; i < files.length; i += 1) {
        formData.append("files", files[i]);
      }

      const res = await fetch("/api/upload-images", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Uploaden mislukt.");
      }

      await loadImages();

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      if (bottomInputRef.current) {
        bottomInputRef.current.value = "";
      }
    } catch (err: any) {
      setError(err?.message || "Uploaden mislukt.");
    } finally {
      setLoading(false);
    }
  }

  async function setCover(id: string) {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/set-cover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, listingId }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Hoofdfoto instellen mislukt.");
      }

      await loadImages();
    } catch (err: any) {
      setError(err?.message || "Hoofdfoto instellen mislukt.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteImage(id: string) {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/delete-listing-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, listingId }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Foto verwijderen mislukt.");
      }

      await loadImages();
    } catch (err: any) {
      setError(err?.message || "Foto verwijderen mislukt.");
    } finally {
      setLoading(false);
    }
  }

  async function reorderImages(newOrder: ListingImage[]) {
    try {
      setLoading(true);
      setError("");

      setImages(newOrder);

      const res = await fetch("/api/reorder-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          orderedIds: newOrder.map((img) => img.id),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Volgorde opslaan mislukt.");
      }

      await loadImages();
    } catch (err: any) {
      setError(err?.message || "Volgorde opslaan mislukt.");
      await loadImages();
    } finally {
      setLoading(false);
    }
  }

  function moveImageUp(index: number) {
    if (index === 0 || loading) return;

    const newOrder = [...images];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    void reorderImages(newOrder);
  }

  function moveImageDown(index: number) {
    if (index === images.length - 1 || loading) return;

    const newOrder = [...images];
    [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
    void reorderImages(newOrder);
  }

  return (
    <section className="rounded-[32px] border border-neutral-200 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.04)] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
            Foto’s
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-600">
            Upload je woningfoto’s zo vroeg mogelijk. De eerste indruk bepaalt of
            iemand verder klikt. De mooiste foto moet je hoofdfoto zijn.
          </p>
        </div>

        <label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700">
          <Upload className="h-4 w-4" />
          Foto’s uploaden
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-4">
        <p className="text-sm font-medium text-neutral-900">
          Slimme volgorde
        </p>
        <p className="mt-1 text-sm text-neutral-600">
          Begin met buitenkant, woonkamer, keuken, tuin en daarna de rest. Je kunt de
          volgorde hieronder zelf aanpassen met omhoog en omlaag.
        </p>
      </div>

      {loading ? (
        <div className="mt-5 rounded-2xl bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
          Bezig...
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {images.length === 0 ? (
        <div className="mt-6 flex min-h-[220px] flex-col items-center justify-center rounded-[28px] border border-neutral-200 bg-neutral-50 px-6 py-10 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
            <ImagePlus className="h-6 w-6 text-neutral-400" />
          </div>
          <p className="mt-4 text-base font-medium text-neutral-900">
            Nog geen foto’s toegevoegd
          </p>
          <p className="mt-2 max-w-md text-sm leading-7 text-neutral-500">
            Upload hier direct meerdere foto’s. Daarna kun je met één klik de
            hoofdfoto kiezen.
          </p>

          <label className="mt-6 inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700">
            <Upload className="h-4 w-4" />
            Eerste foto’s uploaden
            <input
              ref={bottomInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`overflow-hidden rounded-[28px] border bg-white ${
                  image.is_cover
                    ? "border-emerald-300 ring-4 ring-emerald-100"
                    : "border-neutral-200"
                }`}
              >
                <div className="relative">
                  <img
                    src={image.public_url}
                    alt={`Woningfoto ${index + 1}`}
                    className="h-52 w-full object-cover"
                  />

                  <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm">
                    Foto {index + 1}
                  </div>

                  {image.is_cover ? (
                    <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      Hoofdfoto
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-[48px_48px_minmax(0,1fr)_48px] items-center gap-2 p-4">
                  <button
                    type="button"
                    onClick={() => moveImageUp(index)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-40"
                    disabled={loading || index === 0}
                    aria-label="Foto omhoog"
                    title="Foto omhoog"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveImageDown(index)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-40"
                    disabled={loading || index === images.length - 1}
                    aria-label="Foto omlaag"
                    title="Foto omlaag"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setCover(image.id)}
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition ${
                      image.is_cover
                        ? "bg-emerald-50 text-emerald-700"
                        : "border border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300 hover:bg-neutral-50"
                    }`}
                    disabled={loading}
                  >
                    <Star className="h-4 w-4" />
                    {image.is_cover ? "Hoofdfoto" : "Maak hoofdfoto"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Weet je zeker dat je deze foto wilt verwijderen?")) {
                        deleteImage(image.id);
                      }
                    }}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    disabled={loading}
                    aria-label="Foto verwijderen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="flex h-32 w-full cursor-pointer items-center justify-center rounded-[28px] border-2 border-dashed border-neutral-300 bg-neutral-50 text-center transition hover:border-emerald-500 hover:bg-emerald-50/40">
              <div>
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <ImagePlus className="h-5 w-5 text-neutral-400" />
                </div>
                <p className="mt-3 text-sm font-medium text-neutral-900">
                  Voeg meer foto’s toe
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  Klik hier om extra foto’s te uploaden
                </p>
              </div>

              <input
                ref={bottomInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
            </label>
          </div>
        </>
      )}
    </section>
  );
}