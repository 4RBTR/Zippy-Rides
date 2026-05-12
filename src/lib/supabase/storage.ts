import { createClient } from "@/lib/supabase/server";

const BUCKET_NAME = "Zippy";

/**
 * Upload a file to the Zippy storage bucket.
 * Returns the public URL on success, null on failure.
 */
async function uploadFile(
  file: File,
  folder: string
): Promise<string | null> {
  const supabase = await createClient();
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${folder}/${timestamp}_${safeName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Storage upload error:", error.message);
    return null;
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/** Upload a receipt image to the receipts/ folder */
export async function uploadReceiptImage(file: File): Promise<string | null> {
  return uploadFile(file, "receipts");
}

/** Upload a vehicle photo to the vehicles/ folder */
export async function uploadVehicleImage(file: File): Promise<string | null> {
  return uploadFile(file, "vehicles");
}
