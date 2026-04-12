"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import {
  UploadCloud,
  GripVertical,
  Trash2,
  Crown,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import type { ListingImage } from "../../types/database";
import { createClient } from "../../lib/supabase/client";

type ImageUploaderProps = {
  listingId: string;
  initialImages: ListingImage[];
};

const MAX_FILES_PER_UPLOAD = 40;
const MAX_TOTAL_FILES = 80;
const MAX_FILE_SIZE_MB = 10;

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9.\-_]/g, "-");
}

export default function ImageUploader({
  listingId,
  initialImages,
}: ImageUploaderProps) {
  const [images, setImages] = useState<ListingImage[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);

    if (files.length > MAX_FILES_PER_UPLOAD) {
      alert(`Je kunt maximaal ${MAX_FILES_PER_UPLOAD} foto's tegelijk uploaden.`);
      event.target.value = "";
      return;
    }

    if (images.length + files.length > MAX_TOTAL_FILES) {
      alert(
        `Je kunt maximaal ${MAX_TOTAL_FILES} foto's per woning opslaan. Je hebt nu ${images.length} foto's en probeert er ${files.length} toe te voegen.`
      );
      event.target.value = "";
      return;
    }

    const oversizedFiles = files.filter(
      (file) => file.size / 1024 / 1024 > MAX_FILE_SIZE_MB
    );

    if (oversizedFiles.length > 0) {
      const names = oversizedFiles
        .slice(0, 3)
        .map((file) => file.name)
        .join(", ");

      alert(
        `Deze bestand(en) zijn groter dan ${MAX_FILE_SIZE_MB}MB: ${names}${
          oversizedFiles.length > 3 ? "..." : ""
        }`
      );
      event.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Niet ingelogd.");
      }

      const uploadedImagesPayload: Array<Record<string, unknown>> = [];
      const newlyInsertedImages: ListingImage[] = [];

      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];

        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          initialQuality: 0.82,
          fileType: "image/webp",
        });

        const safeBaseName = sanitizeFileName(file.name.replace(/\.[^.]+$/, ""));
        const uniqueBase = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}-${safeBaseName}`;

        const thumbPath = `${user.id}/${listingId}/thumb/${uniqueBase}.webp`;
        const mediumPath = `${user.id}/${listingId}/medium/${uniqueBase}.webp`;
        const largePath = `${user.id}/${listingId}/large/${uniqueBase}.webp`;

        const [thumbUpload, mediumUpload, largeUpload] = await Promise.all([
          supabase.storage.from("listing-images").upload(thumbPath, compressedFile, {
            contentType: "image/webp",
            upsert: false,
          }),
          supabase.storage.from("listing-images").upload(mediumPath, compressedFile, {
            contentType: "image/webp",
            upsert: false,
          }),
          supabase.storage.from("listing-images").upload(largePath, compressedFile, {
            contentType: "image/webp",
            upsert: false,
          }),
        ]);

        if (thumbUpload.error) throw thumbUpload.error;
        if (mediumUpload.error) throw mediumUpload.error;
        if (largeUpload.error) throw largeUpload.error;

        const {
          data: { publicUrl: thumbUrl },
        } = supabase.storage.from("listing-images").getPublicUrl(thumbPath);

        const {
          data: { publicUrl: mediumUrl },
        } = supabase.storage.from("listing-images").getPublicUrl(mediumPath);

        const {
          data: { publicUrl: largeUrl },
        } = supabase.storage.from("listing-images").getPublicUrl(largePath);

        uploadedImagesPayload.push({
          listing_id: listingId,
          storage_path: largePath,
          public_url: mediumUrl,
          public_url_thumb: thumbUrl,
          public_url_medium: mediumUrl,
          public_url_large: largeUrl,
          label: file.name,
          is_cover: false,
          position: images.length + i,
        });
      }

      const { data: insertedRows, error: dbError } = await (supabase as any)
        .from("listing_images")
        .insert(uploadedImagesPayload)
        .select();

      if (dbError) {
        throw dbError;
      }

      if (Array.isArray(insertedRows)) {
        newlyInsertedImages.push(...(insertedRows as ListingImage[]));
      }

      const hadCoverBeforeUpload = images.some((img) => img.is_cover);

      if (!hadCoverBeforeUpload && newlyInsertedImages.length > 0) {
        const firstInserted = [...newlyInsertedImages].sort((a, b) => {
          const aPos = typeof a.position === "number" ? a.position : 0;
          const bPos = typeof b.position === "number" ? b.position : 0;
          return aPos - bPos;
        })[0];

        await (supabase as any)
          .from("listing_images")
          .update({ is_cover: false })
          .eq("listing_id", listingId);

        await (supabase as any)
          .from("listing_images")
          .update({ is_cover: true })
          .eq("id", firstInserted.id);

        firstInserted.is_cover = true;
      }

      const refreshedImages = [
        ...images.map((img) => ({ ...img, is_cover: hadCoverBeforeUpload ? img.is_cover : false })),
        ...newlyInsertedImages,
      ];

      setImages(refreshedImages);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Er ging iets mis bij het uploaden.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleSetCover = async (imageId: string) => {
    try {
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          is_cover: img.id === imageId,
        }))
      );

      await (supabase as any)
        .from("listing_images")
        .update({ is_cover: false })
        .eq("listing_id", listingId);

      await (supabase as any)
        .from("listing_images")
        .update({ is_cover: true })
        .eq("id", imageId);
    } catch (err) {
      console.error("Failed to set cover", err);
      alert("Hoofdfoto instellen mislukt.");
    }
  };

  const handleDelete = async (imageId: string, storagePath: string) => {
    if (!confirm("Weet je zeker dat je deze foto wilt verwijderen?")) return;

    try {
      const imageToDelete = images.find((img) => img.id === imageId);

      setImages((prev) => prev.filter((img) => img.id !== imageId));

      const pathsToDelete = Array.from(
        new Set(
          [
            storagePath || null,
            (imageToDelete as any)?.public_url_thumb
              ? String((imageToDelete as any).public_url_thumb).split(
                  "/storage/v1/object/public/listing-images/"
                )[1]
              : null,
            (imageToDelete as any)?.public_url_medium
              ? String((imageToDelete as any).public_url_medium).split(
                  "/storage/v1/object/public/listing-images/"
                )[1]
              : null,
            (imageToDelete as any)?.public_url_large
              ? String((imageToDelete as any).public_url_large).split(
                  "/storage/v1/object/public/listing-images/"
                )[1]
              : null,
          ].filter(Boolean) as string[]
        )
      );

      await (supabase as any).from("listing_images").delete().eq("id", imageId);

      if (pathsToDelete.length > 0) {
        await supabase.storage.from("listing-images").remove(pathsToDelete);
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("Foto verwijderen mislukt.");
    }
  };

  const handleUpdateLabel = async (imageId: string, label: string) => {
    setImages((prev) => prev.map((img) => (img.id === imageId ? { ...img, label } as any : img)));
    await (supabase as any).from("listing_images").update({ label }).eq("id", imageId);
  };

  return (
    <div className="space-y-6">
      <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 transition-colors hover:bg-neutral-100">
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={isUploading}
          onChange={handleFileUpload}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        />

        {isUploading ? (
          <div className="flex flex-col items-center text-emerald-600">
            <Loader2 className="mb-3 h-10 w-10 animate-spin" />
            <span className="text-sm font-medium">Foto&apos;s uploaden...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-neutral-500">
            <UploadCloud className="mb-3 h-10 w-10 text-neutral-400" />
            <span className="text-sm font-medium text-neutral-700">
              Klik of sleep foto&apos;s hierheen
            </span>
            <span className="mt-1 text-xs">
              PNG, JPG of WEBP • max {MAX_FILES_PER_UPLOAD} tegelijk • max{" "}
              {MAX_TOTAL_FILES} totaal
            </span>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
            >
              <button
                type="button"
                className="mt-6 hidden cursor-grab text-neutral-400 hover:text-neutral-600 active:cursor-grabbing sm:block"
              >
                <GripVertical className="h-5 w-5" />
              </button>

              <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-xl border border-neutral-200/60 bg-neutral-100">
                <img
                  src={(image as any).public_url_thumb || image.public_url}
                  alt={(image as any).label || "Woning foto"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {image.is_cover && (
                  <div className="absolute left-1.5 top-1.5 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                    HOOFDFOTO
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between self-stretch py-1">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Label
                  </label>
                  <input
                    type="text"
                    defaultValue={(image as any).label || ""}
                    onBlur={(e) => handleUpdateLabel(image.id, e.target.value)}
                    placeholder="Bv. Woonkamer"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-900 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="mt-3 flex items-center gap-2">
                  {!image.is_cover && (
                    <button
                      type="button"
                      onClick={() => handleSetCover(image.id)}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100"
                    >
                      <Crown className="h-3.5 w-3.5" />
                      Maak hoofdfoto
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(image.id, (image as any).storage_path || "")}
                    className="ml-auto rounded-lg p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !isUploading && (
        <div className="flex rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <ImageIcon className="mr-3 h-5 w-5 shrink-0 text-amber-500" />
          Zorg dat je op z&apos;n minst 1 duidelijke hoofdfoto uploadt voor je de woning publiceert.
        </div>
      )}
    </div>
  );
}