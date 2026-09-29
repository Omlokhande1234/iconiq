import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await cloudinary.uploader.upload(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/9QnQ5wAAAABJRU5ErkJggg==",
      {
        folder: "iconisphere/test",
        resource_type: "image",
      }
    );

    return NextResponse.json({
      success: true,
      result: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error: any) {
    console.error("Direct Cloudinary upload error:", {
      message: error?.message,
      http_code: error?.http_code,
      name: error?.name,
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          message: error?.message,
          http_code: error?.http_code,
          name: error?.name,
        },
      },
      { status: 500 }
    );
  }
}