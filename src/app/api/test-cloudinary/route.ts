import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await cloudinary.api.ping();

    console.log("Cloudinary ping:", result);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("Cloudinary ping error:", {
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