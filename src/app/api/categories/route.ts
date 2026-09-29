import {
  NextRequest,
  NextResponse,
} from "next/server";

import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

import { uploadToCloudinary } from "@/lib/cloudinary-upload";

export const runtime = "nodejs";


/**
 * POST /api/categories
 *
 * Create a new category.
 *
 * Content-Type:
 * multipart/form-data
 *
 * Files:
 * - icon
 * - coverImage
 * - socialImage
 */
export async function POST(
  req: NextRequest
) {
  try {
    await connectDB();

    const formData =
      await req.formData();

    // -----------------------------------------
    // Basic fields
    // -----------------------------------------

    const name =
      formData
        .get("name")
        ?.toString()
        .trim();

    const slug =
      formData
        .get("slug")
        ?.toString()
        .trim()
        .toLowerCase();

    const description =
      formData
        .get("description")
        ?.toString()
        .trim();

    const content =
      formData
        .get("content")
        ?.toString();

    const statusValue =
      formData
        .get("status")
        ?.toString();

    const featuredValue =
      formData
        .get("featured")
        ?.toString();

    const displayOrderValue =
      formData
        .get("displayOrder")
        ?.toString();

    const seoTitle =
      formData
        .get("seoTitle")
        ?.toString()
        .trim();

    const seoDescription =
      formData
        .get("seoDescription")
        ?.toString()
        .trim();

    // -----------------------------------------
    // Required fields
    // -----------------------------------------

    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name and slug are required",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Validate status
    // -----------------------------------------

    let status:
      | "active"
      | "inactive" = "active";

    if (statusValue) {
      if (
        statusValue !== "active" &&
        statusValue !== "inactive"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Status must be either 'active' or 'inactive'",
          },
          { status: 400 }
        );
      }

      status = statusValue;
    }

    // -----------------------------------------
    // Display order
    // -----------------------------------------

    let displayOrder = 0;

    if (displayOrderValue) {
      const parsedDisplayOrder =
        Number(displayOrderValue);

      if (
        !Number.isInteger(
          parsedDisplayOrder
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Display order must be a valid number",
          },
          { status: 400 }
        );
      }

      displayOrder =
        parsedDisplayOrder;
    }

    // -----------------------------------------
    // Featured
    // -----------------------------------------

    let featured = false;

    if (featuredValue) {
      if (
        featuredValue !== "true" &&
        featuredValue !== "false"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Featured must be true or false",
          },
          { status: 400 }
        );
      }

      featured =
        featuredValue === "true";
    }

    // -----------------------------------------
    // Check duplicate slug
    // -----------------------------------------

    const existingCategory =
      await Category.findOne({
        slug,
      });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A category with this slug already exists",
        },
        { status: 409 }
      );
    }

    // -----------------------------------------
    // Images
    // -----------------------------------------

    const iconFile =
      formData.get("icon");

    const coverImageFile =
      formData.get("coverImage");

    const socialImageFile =
      formData.get("socialImage");

    let icon:
      | {
          url: string;
          publicId: string;
        }
      | undefined;

    let coverImage:
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
    // Upload icon
    // -----------------------------------------

    if (
      iconFile instanceof File &&
      iconFile.size > 0
    ) {
      icon =
        await uploadToCloudinary(
          iconFile,
          "iconisphere/categories/icons"
        );
    }

    // -----------------------------------------
    // Upload cover image
    // -----------------------------------------

    if (
      coverImageFile instanceof File &&
      coverImageFile.size > 0
    ) {
      coverImage =
        await uploadToCloudinary(
          coverImageFile,
          "iconisphere/categories/covers"
        );
    }

    // -----------------------------------------
    // Upload social image
    // -----------------------------------------

    if (
      socialImageFile instanceof File &&
      socialImageFile.size > 0
    ) {
      socialImage =
        await uploadToCloudinary(
          socialImageFile,
          "iconisphere/categories/social"
        );
    }

    // -----------------------------------------
    // Create category
    // -----------------------------------------

    const category =
      await Category.create({
        name,
        slug,

        description:
          description || undefined,

        content:
          content || undefined,

        status,

        featured,

        displayOrder,

        seoTitle:
          seoTitle || undefined,

        seoDescription:
          seoDescription || undefined,

        icon,

        coverImage,

        socialImage,
      });

    // -----------------------------------------
    // Response
    // -----------------------------------------

    return NextResponse.json(
      {
        success: true,
        message:
          "Category created successfully",
        data: category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create category error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create category",
      },
      { status: 500 }
    );
  }
}


/**
 * GET /api/categories
 *
 * Query parameters:
 *
 * ?page=1
 * ?limit=10
 * ?search=technology
 * ?status=active
 * ?featured=true
 */
export async function GET(
  req: NextRequest
) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(req.url);

    // -----------------------------------------
    // Pagination
    // -----------------------------------------

    const pageValue =
      Number(
        searchParams.get("page") || 1
      );

    const limitValue =
      Number(
        searchParams.get("limit") || 10
      );

    const page =
      Number.isInteger(pageValue)
        ? Math.max(pageValue, 1)
        : 1;

    const limit =
      Number.isInteger(limitValue)
        ? Math.min(
            Math.max(limitValue, 1),
            100
          )
        : 10;

    // -----------------------------------------
    // Filters
    // -----------------------------------------

    const search =
      searchParams.get("search");

    const status =
      searchParams.get("status");

    const featured =
      searchParams.get("featured");

    const filter: Record<
      string,
      unknown
    > = {};

    // -----------------------------------------
    // Search
    // -----------------------------------------

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // -----------------------------------------
    // Status
    // -----------------------------------------

    if (status) {
      if (
        status !== "active" &&
        status !== "inactive"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Status must be either 'active' or 'inactive'",
          },
          { status: 400 }
        );
      }

      filter.status = status;
    }

    // -----------------------------------------
    // Featured
    // -----------------------------------------

    if (
      featured !== null &&
      featured !== ""
    ) {
      if (
        featured !== "true" &&
        featured !== "false"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Featured must be true or false",
          },
          { status: 400 }
        );
      }

      filter.featured =
        featured === "true";
    }

    // -----------------------------------------
    // Pagination
    // -----------------------------------------

    const skip =
      (page - 1) * limit;

    // -----------------------------------------
    // Fetch categories
    // -----------------------------------------

    const [
      categories,
      total,
    ] = await Promise.all([
      Category.find(filter)
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Category.countDocuments(
        filter
      ),
    ]);

    // -----------------------------------------
    // Response
    // -----------------------------------------

    return NextResponse.json({
      success: true,

      data: categories,

      pagination: {
        page,
        limit,
        total,

        totalPages:
          Math.ceil(
            total / limit
          ),

        hasNextPage:
          page <
          Math.ceil(
            total / limit
          ),

        hasPreviousPage:
          page > 1,
      },
    });
  } catch (error) {
    console.error(
      "Get categories error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}