import cloudinary from "./cloudinary";

export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<{
  url: string;
  publicId: string;
}> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "image",
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    // Log full error detail — Cloudinary often nests useful info
    console.error(
      "Cloudinary upload failed (full):",
      JSON.stringify(error, null, 2)
    );
    throw error;
  }
}

export async function deleteFromCloudinary(
  publicId: string
): Promise<void> {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
}