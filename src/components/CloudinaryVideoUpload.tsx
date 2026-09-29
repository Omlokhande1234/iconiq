"use client";

import { CldUploadWidget } from "next-cloudinary";

interface CloudinaryVideoUploadProps {
  onUpload: (data: {
    url: string;
    publicId: string;
    duration?: number;
    bytes?: number;
    format?: string;
  }) => void;

  onError?: (error: unknown) => void;
}

export default function CloudinaryVideoUpload({
  onUpload,
  onError,
}: CloudinaryVideoUploadProps) {
  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary/signature"
      options={{
        resourceType: "video",

        sources: ["local"],

        multiple: false,

        clientAllowedFormats: [
          "mp4",
          "mov",
          "webm",
          "mkv",
        ],

        // Example: 5 GB client-side limit.
        // Adjust according to your Cloudinary plan.
        maxVideoFileSize: 5_000_000_000,

        // 20 MB chunks
        maxChunkSize: 20_000_000,

        folder: "iconiq-sphere/videos",
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

            duration:
              "duration" in info
                ? (info.duration as number)
                : undefined,

            bytes:
              "bytes" in info
                ? (info.bytes as number)
                : undefined,

            format:
              "format" in info
                ? (info.format as string)
                : undefined,
          });
        }
      }}
      onError={(error) => {
        console.error("Video upload failed:", error);

        onError?.(error);
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Upload Video
        </button>
      )}
    </CldUploadWidget>
  );
}