"use client";

import { useState, useCallback } from "react";

import { UploadCloud, GripVertical, Trash2, Crown, Loader2, Image as ImageIcon } from "lucide-react";
import type { ListingImage } from "../../types/database";
import { createClient } from "../../lib/supabase/client";

type ImageUploaderProps = {
  listingId: string;
  initialImages: ListingImage[];
};

export default function ImageUploader({ listingId, initialImages }: ImageUploaderProps) {
  const [images, setImages] = useState<ListingImage[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${listingId}/${fileName}`;

        // 1. Upload to Storage
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('listing-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
  .from('listing-images')
  .getPublicUrl(filePath);

console.log("FILE PATH:", filePath);
console.log("PUBLIC URL:", publicUrl);

        // 2. Insert into database
        const isFirst = images.length === 0 && i === 0;
        const newImage = {
          listing_id: listingId,
          storage_path: filePath,
          public_url: publicUrl,
          label: file.name, // default label
          is_cover: isFirst,
          position: images.length + i,
        };

        const { data: dbData, error: dbError } = await (supabase as any)
          .from('listing_images')
          .insert(newImage)
          .select()
          .single();

        if (dbError) throw dbError;

        setImages((prev) => [...prev, dbData as ListingImage]);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Er ging iets mis bij het uploaden.");
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleSetCover = async (imageId: string) => {
    try {
      // Optmistic UI
      setImages(prev => prev.map(img => ({ ...img, is_cover: img.id === imageId })));

      // Remove cover from all others
      await (supabase as any)
        .from('listing_images')
        .update({ is_cover: false })
        .eq('listing_id', listingId);

      // Set new cover
      await (supabase as any)
        .from('listing_images')
        .update({ is_cover: true })
        .eq('id', imageId);

    } catch (err) {
      console.error("Failed to set cover", err);
    }
  };

  const handleDelete = async (imageId: string, storagePath: string) => {
    if (!confirm("Weet je zeker dat je deze foto wilt verwijderen?")) return;

    try {
      // Optimistic UI
      setImages(prev => prev.filter(img => img.id !== imageId));

      // Delete from DB (which might cascade/trigger but let's do storage first to be safe, or just DB and let CRON clean up. Here we do both)
      await (supabase as any).from('listing_images').delete().eq('id', imageId);
      await supabase.storage.from('listing-images').remove([storagePath]);

    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleUpdateLabel = async (imageId: string, label: string) => {
    setImages(prev => prev.map(img => img.id === imageId ? { ...img, label } : img));
    await (supabase as any).from('listing_images').update({ label }).eq('id', imageId);
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
          className="absolute inset-0 z-10 w-full h-full cursor-pointer opacity-0"
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center text-emerald-600">
            <Loader2 className="h-10 w-10 animate-spin mb-3" />
            <span className="text-sm font-medium">Foto&apos;s uploaden...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-neutral-500">
            <UploadCloud className="h-10 w-10 mb-3 text-neutral-400" />
            <span className="text-sm font-medium text-neutral-700">Klik of sleep foto&apos;s hierheen</span>
            <span className="text-xs mt-1">PNG, JPG of WEBP tot 10MB</span>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {images.map((image, index) => (
            <div key={image.id} className="group relative flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm transition hover:border-emerald-200 hover:shadow-md">
              
              <button type="button" className="mt-6 cursor-grab text-neutral-400 hover:text-neutral-600 active:cursor-grabbing hidden sm:block">
                <GripVertical className="h-5 w-5" />
              </button>

              <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200/60">
                <img
                  src={image.public_url}
                  alt={image.label || "Woning foto"}
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
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Label</label>
                  <input
                    type="text"
                    defaultValue={image.label || ''}
                    onBlur={(e) => handleUpdateLabel(image.id, e.target.value)}
                    placeholder="Bv. Woonkamer"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-900 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2 mt-3">
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
                    onClick={() => handleDelete(image.id, image.storage_path)}
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
