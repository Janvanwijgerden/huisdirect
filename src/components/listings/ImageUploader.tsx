"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { UploadCloud, Loader2 } from "lucide-react";
import { createClient } from "../../lib/supabase/client";

type Props = {
  listingId: string;
};

const MAX_FILES_PER_UPLOAD = 40;
const MAX_FILE_SIZE_MB = 10;

export default function ImageUploader({ listingId }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    if (files.length > MAX_FILES_PER_UPLOAD) {
      alert(`Je kunt maximaal ${MAX_FILES_PER_UPLOAD} foto's tegelijk uploaden.`);
      return;
    }

    setIsUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Niet ingelogd");

      const uploadedImages = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
          alert(`${file.name} is te groot (max ${MAX_FILE_SIZE_MB}MB)`);
          continue;
        }

        // 🔥 Compressie
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });

        const fileExt = compressedFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}.${fileExt}`;

        const filePath = `${user.id}/${listingId}/${fileName}`;

        // 🔥 Direct upload naar Supabase
        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(filePath, compressedFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("listing-images")
          .getPublicUrl(filePath);

        uploadedImages.push({
          listing_id: listingId,
          storage_path: filePath,
          public_url: data.publicUrl,
          is_cover: i === 0,
          position: i,
        });
      }

      // 🔥 Batch insert database
      const { error: dbError } = await supabase
        .from("listing_images")
        .insert(uploadedImages);

      if (dbError) throw dbError;

      alert("Foto's succesvol geüpload");

      window.location.reload(); // simpel en effectief voor nu

    } catch (err) {
      console.error(err);
      alert("Upload mislukt");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 hover:bg-neutral-100">
      <input
        type="file"
        accept="image/*"
        multiple
        disabled={isUploading}
        onChange={handleUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      {isUploading ? (
        <div className="flex flex-col items-center text-emerald-600">
          <Loader2 className="h-10 w-10 animate-spin mb-3" />
          <span>Uploaden...</span>
        </div>
      ) : (
        <div className="flex flex-col items-center text-neutral-500">
          <UploadCloud className="h-10 w-10 mb-3" />
          <span className="font-medium">Klik of sleep foto’s</span>
          <span className="text-sm mt-1">
            Max 40 foto's • Max 10MB per foto
          </span>
        </div>
      )}
    </div>
  );
}