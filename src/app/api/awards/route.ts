import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import Award from "@/models/Award";
import Tag from "@/models/Tags"; // registers the "Tag" model so .populate("tags") can resolve it
import { uploadToCloudinary } from "@/lib/cloudinary-upload";

export const runtime = "nodejs";

/**
 * POST /api/awards
 *
 * Create a new award.
 *
 * Content-Type:
 * multipart/form-data
 *
 * Supported files:
 * - awardImage
 * - awardIcon
 * - socialImage
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();

    // -----------------------------------------
    // Basic fields
    // -----------------------------------------

    const title = formData.get("title")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim().toLowerCase();

    const category = formData.get("category")?.toString().trim();

    const yearValue = formData.get("year")?.toString();

    const shortDescription = formData
      .get("shortDescription")
      ?.toString()
      .trim();

    const content = formData.get("content")?.toString();

    const recognitionCriteria = formData
      .get("recognitionCriteria")
      ?.toString();

    const publicationDateValue = formData
      .get("publicationDate")
      ?.toString();

    const statusValue = formData.get("status")?.toString();

    const featuredValue = formData.get("featuredOnHomepage")?.toString();

    const displayOrderValue = formData.get("displayOrder")?.toString();

    const seoTitle = formData.get("seoTitle")?.toString().trim();

    const seoDescription = formData
      .get("seoDescription")
      ?.toString()
      .trim();

    // -----------------------------------------
    // Required fields
    // -----------------------------------------

    if (!title || !slug || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, slug and content are required",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Validate status
    // -----------------------------------------

    let status: "draft" | "published" = "draft";

    if (statusValue) {
      if (statusValue !== "draft" && statusValue !== "published") {
        return NextResponse.json(
          {
            success: false,
            message: "Status must be either 'draft' or 'published'",
          },
          { status: 400 }
        );
      }

      status = statusValue;
    }

    // -----------------------------------------
    // Validate year
    // -----------------------------------------

    let year: number | undefined;

    if (yearValue) {
      const parsedYear = Number(yearValue);

      if (!Number.isInteger(parsedYear)) {
        return NextResponse.json(
          {
            success: false,
            message: "Year must be a valid number",
          },
          { status: 400 }
        );
      }

      year = parsedYear;
    }

    // -----------------------------------------
    // Validate display order
    // -----------------------------------------

    let displayOrder = 0;

    if (displayOrderValue) {
      const parsedDisplayOrder = Number(displayOrderValue);

      if (!Number.isInteger(parsedDisplayOrder)) {
        return NextResponse.json(
          {
            success: false,
            message: "Display order must be a valid number",
          },
          { status: 400 }
        );
      }

      displayOrder = parsedDisplayOrder;
    }

    // -----------------------------------------
    // Validate publication date
    // -----------------------------------------

    let publicationDate: Date | undefined;

    if (publicationDateValue) {
      const parsedDate = new Date(publicationDateValue);

      if (Number.isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid publication date",
          },
          { status: 400 }
        );
      }

      publicationDate = parsedDate;
    }

    // -----------------------------------------
    // Check duplicate slug
    // -----------------------------------------

    const existingAward = await Award.findOne({
      slug,
    });

    if (existingAward) {
      return NextResponse.json(
        {
          success: false,
          message: "An award with this slug already exists",
        },
        { status: 409 }
      );
    }

    // -----------------------------------------
    // Tags
    //
    // Expected:
    // ["tagId1", "tagId2"]
    // -----------------------------------------

    let tags: mongoose.Types.ObjectId[] = [];

    const tagsValue = formData.get("tags");

    if (tagsValue) {
      try {
        const parsedTags = JSON.parse(tagsValue.toString());

        if (!Array.isArray(parsedTags)) {
          return NextResponse.json(
            {
              success: false,
              message: "Tags must be an array",
            },
            { status: 400 }
          );
        }

        const invalidTag = parsedTags.find(
          (tagId) =>
            typeof tagId !== "string" ||
            !mongoose.Types.ObjectId.isValid(tagId)
        );

        if (invalidTag) {
          return NextResponse.json(
            {
              success: false,
              message: "One or more tag IDs are invalid",
            },
            { status: 400 }
          );
        }

        tags = parsedTags.map(
          (tagId: string) => new mongoose.Types.ObjectId(tagId)
        );
      } catch {
        return NextResponse.json(
          {
            success: false,
            message:
              'Invalid tags format. Expected something like ["tagId1","tagId2"]',
          },
          { status: 400 }
        );
      }
    }

    // -----------------------------------------
    // Images
    // -----------------------------------------

    const awardImageFile = formData.get("awardImage");
    const awardIconFile = formData.get("awardIcon");
    const socialImageFile = formData.get("socialImage");

    let awardImage:
      | {
          url: string;
          publicId: string;
        }
      | undefined;

    let awardIcon:
      | {
          url: string;
          publicId: string;
        }
      | undefined;

    let socialImage:
      | {
          url: string;
          publicId: string;
        }
      | undefined;

    // -----------------------------------------
    // Award Image
    // -----------------------------------------

    if (awardImageFile instanceof File && awardImageFile.size > 0) {
      awardImage = await uploadToCloudinary(
        awardImageFile,
        "iconisphere/awards/images"
      );
    }

    // -----------------------------------------
    // Award Icon
    // -----------------------------------------

    if (awardIconFile instanceof File && awardIconFile.size > 0) {
      awardIcon = await uploadToCloudinary(
        awardIconFile,
        "iconisphere/awards/icons"
      );
    }

    // -----------------------------------------
    // Social Image
    // -----------------------------------------

    if (socialImageFile instanceof File && socialImageFile.size > 0) {
      socialImage = await uploadToCloudinary(
        socialImageFile,
        "iconisphere/awards/social"
      );
    }

    // -----------------------------------------
    // Featured
    // -----------------------------------------

    const featuredOnHomepage = featuredValue === "true";

    // -----------------------------------------
    // Create Award
    // -----------------------------------------

    const award = await Award.create({
      title,
      slug,

      category,

      year,

      shortDescription,

      content,

      recognitionCriteria,

      publicationDate,

      tags,

      status,

      featuredOnHomepage,

      displayOrder,

      seoTitle,

      seoDescription,

      // Cloudinary objects
      awardImage,

      awardIcon,

      socialImage,
    });

    // -----------------------------------------
    // Return response
    // -----------------------------------------

    return NextResponse.json(
      {
        success: true,
        message: "Award created successfully",
        data: award,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create award error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create award",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/awards
 *
 * Get awards with:
 *
 * ?page=1
 * ?limit=10
 * ?search=innovation
 * ?category=Technology
 * ?year=2026
 * ?status=published
 * ?featured=true
 */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    // -----------------------------------------
    // Pagination
    // -----------------------------------------

    const pageValue = Number(searchParams.get("page") || 1);

    const limitValue = Number(searchParams.get("limit") || 10);

    const page = Number.isInteger(pageValue) ? Math.max(pageValue, 1) : 1;

    const limit = Number.isInteger(limitValue)
      ? Math.min(Math.max(limitValue, 1), 100)
      : 10;

    // -----------------------------------------
    // Filters
    // -----------------------------------------

    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const year = searchParams.get("year");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");

    const filter: Record<string, unknown> = {};

    // -----------------------------------------
    // Search
    // -----------------------------------------

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          shortDescription: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // -----------------------------------------
    // Category
    // -----------------------------------------

    if (category) {
      filter.category = category;
    }

    // -----------------------------------------
    // Year
    // -----------------------------------------

    if (year) {
      const parsedYear = Number(year);

      if (!Number.isInteger(parsedYear)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid year",
          },
          { status: 400 }
        );
      }

      filter.year = parsedYear;
    }

    // -----------------------------------------
    // Status
    // -----------------------------------------

    if (status) {
      if (status !== "draft" && status !== "published") {
        return NextResponse.json(
          {
            success: false,
            message: "Status must be either 'draft' or 'published'",
          },
          { status: 400 }
        );
      }

      filter.status = status;
    }

    // -----------------------------------------
    // Featured
    // -----------------------------------------

    if (featured !== null && featured !== "") {
      if (featured !== "true" && featured !== "false") {
        return NextResponse.json(
          {
            success: false,
            message: "Featured must be either true or false",
          },
          { status: 400 }
        );
      }

      filter.featuredOnHomepage = featured === "true";
    }

    // -----------------------------------------
    // Pagination calculation
    // -----------------------------------------

    const skip = (page - 1) * limit;

    // -----------------------------------------
    // Fetch awards + count
    // -----------------------------------------

    const [awards, total] = await Promise.all([
      Award.find(filter)
        .populate("tags")
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Award.countDocuments(filter),
    ]);

    // -----------------------------------------
    // Response
    // -----------------------------------------

    return NextResponse.json({
      success: true,

      data: awards,

      pagination: {
        page,
        limit,
        total,

        totalPages: Math.ceil(total / limit),

        hasNextPage: page < Math.ceil(total / limit),

        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get awards error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch awards",
      },
      { status: 500 }
    );
  }
}