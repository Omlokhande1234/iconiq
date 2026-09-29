import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Tag from "@/models/Tags";

export const runtime = "nodejs";

// POST /api/tags
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    const name = body.name?.toString().trim();
    const slug = body.slug?.toString().trim().toLowerCase();

    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and slug are required",
        },
        { status: 400 }
      );
    }

    // Check duplicate name
    const existingName = await Tag.findOne({ name });

    if (existingName) {
      return NextResponse.json(
        {
          success: false,
          message: "A tag with this name already exists",
        },
        { status: 409 }
      );
    }

    // Check duplicate slug
    const existingSlug = await Tag.findOne({ slug });

    if (existingSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "A tag with this slug already exists",
        },
        { status: 409 }
      );
    }

    const tag = await Tag.create({
      name,
      slug,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Tag created successfully",
        data: tag,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create tag error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create tag",
      },
      { status: 500 }
    );
  }
}

// GET /api/tags
export async function GET() {
  try {
    await dbConnect();

    const tags = await Tag.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error("Get tags error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tags",
      },
      { status: 500 }
    );
  }
}