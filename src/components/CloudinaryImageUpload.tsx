"use client";

import { CldUploadWidget } from "next-cloudinary";

interface CloudinaryImageUploadProps {
  onUpload: (data: {
    url: string;
    publicId: string;
  }) => void;
}

export default function CloudinaryImageUpload({
  onUpload,
}: CloudinaryImageUploadProps) {
  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary/signature"
      options={{
        resourceType: "image",
        sources: ["local"],
        multiple: false,

        clientAllowedFormats: [
          "jpg",
          "jpeg",
          "png",
          "webp",
        ],

        maxFileSize: 10_000_000,

        folder: "iconiq-sphere/images",
      }}
      onSuccess={(result) => {
        const info = result.info;

        if (
          typeof info === "object" &&
          "secure_url" in info &&
          "public_id" in info
        ) {
          onUpload({
            url: info.secure_url as string,
            publicId: info.public_id as string,
          });
        }
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Upload Image
        </button>
      )}
    </CldUploadWidget>
  );
}