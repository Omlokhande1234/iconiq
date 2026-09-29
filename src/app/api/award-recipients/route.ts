import {
  NextRequest,
  NextResponse,
} from "next/server";

import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Award from "@/models/Award";
import AwardRecipient from "@/models/AwardRecipient";

import { uploadToCloudinary } from "@/lib/cloudinary-upload";

export const runtime = "nodejs";


/**
 * POST /api/award-recipients
 *
 * Create a new award recipient.
 *
 * Content-Type:
 * multipart/form-data
 *
 * Fields:
 * - award
 * - name
 * - designation
 * - organization
 * - profile
 * - slug
 * - recipientType
 * - displayOrder
 * - photo
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

    const awardValue =
      formData.get("award");

    const name =
      formData
        .get("name")
        ?.toString()
        .trim();

    const designation =
      formData
        .get("designation")
        ?.toString()
        .trim();

    const organization =
      formData
        .get("organization")
        ?.toString()
        .trim();

    const profile =
      formData
        .get("profile")
        ?.toString()
        .trim();

    const slug =
      formData
        .get("slug")
        ?.toString()
        .trim()
        .toLowerCase();

    const recipientTypeValue =
      formData
        .get("recipientType")
        ?.toString();

    const displayOrderValue =
      formData
        .get("displayOrder")
        ?.toString();

    // -----------------------------------------
    // Required fields
    // -----------------------------------------

    if (!awardValue || !name) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Award and recipient name are required",
        },
        { status: 400 }
      );
    }

    const awardId =
      awardValue.toString();

    // -----------------------------------------
    // Validate award ID
    // -----------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        awardId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid award ID",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Check if Award exists
    // -----------------------------------------

    const award =
      await Award.findById(awardId);

    if (!award) {
      return NextResponse.json(
        {
          success: false,
          message: "Award not found",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------
    // Validate recipient type
    // -----------------------------------------

    let recipientType:
      | "individual"
      | "organization" =
      "individual";

    if (recipientTypeValue) {
      if (
        recipientTypeValue !==
          "individual" &&
        recipientTypeValue !==
          "organization"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Recipient type must be either 'individual' or 'organization'",
          },
          { status: 400 }
        );
      }

      recipientType =
        recipientTypeValue;
    }

    // -----------------------------------------
    // Validate display order
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
    // Slug
    // -----------------------------------------

    if (slug) {
      const existingRecipient =
        await AwardRecipient.findOne({
          slug,
        });

      if (existingRecipient) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A recipient with this slug already exists",
          },
          { status: 409 }
        );
      }
    }

    // -----------------------------------------
    // Photo
    // -----------------------------------------

    const photoFile =
      formData.get("photo");

    let photo:
      | {
          url: string;
          publicId: string;
        }
      | undefined;

    if (
      photoFile instanceof File &&
      photoFile.size > 0
    ) {
      photo =
        await uploadToCloudinary(
          photoFile,
          "iconisphere/award-recipients"
        );
    }

    // -----------------------------------------
    // Create recipient
    // -----------------------------------------

    const recipient =
      await AwardRecipient.create({
        award: new mongoose.Types.ObjectId(
          awardId
        ),

        name,

        designation:
          designation || undefined,

        organization:
          organization || undefined,

        profile:
          profile || undefined,

        slug:
          slug || undefined,

        recipientType,

        displayOrder,

        photo,
      });

    // -----------------------------------------
    // Populate award
    // -----------------------------------------

    const populatedRecipient =
      await AwardRecipient.findById(
        recipient._id
      )
        .populate("award")
        .lean();

    // -----------------------------------------
    // Response
    // -----------------------------------------

    return NextResponse.json(
      {
        success: true,
        message:
          "Award recipient created successfully",
        data: populatedRecipient,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create award recipient error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create award recipient",
      },
      { status: 500 }
    );
  }
}


/**
 * GET /api/award-recipients
 *
 * Query parameters:
 *
 * ?page=1
 * ?limit=10
 * ?award=AWARD_ID
 * ?search=John
 * ?recipientType=individual
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

    const award =
      searchParams.get("award");

    const search =
      searchParams.get("search");

    const recipientType =
      searchParams.get(
        "recipientType"
      );

    const filter: Record<
      string,
      unknown
    > = {};

    // -----------------------------------------
    // Award filter
    // -----------------------------------------

    if (award) {
      if (
        !mongoose.Types.ObjectId.isValid(
          award
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid award ID",
          },
          { status: 400 }
        );
      }

      filter.award =
        new mongoose.Types.ObjectId(
          award
        );
    }

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
          designation: {
            $regex: search,
            $options: "i",
          },
        },
        {
          organization: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // -----------------------------------------
    // Recipient type
    // -----------------------------------------

    if (recipientType) {
      if (
        recipientType !==
          "individual" &&
        recipientType !==
          "organization"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid recipient type",
          },
          { status: 400 }
        );
      }

      filter.recipientType =
        recipientType;
    }

    // -----------------------------------------
    // Pagination
    // -----------------------------------------

    const skip =
      (page - 1) * limit;

    // -----------------------------------------
    // Fetch recipients
    // -----------------------------------------

    const [
      recipients,
      total,
    ] = await Promise.all([
      AwardRecipient.find(filter)
        .populate("award")
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      AwardRecipient.countDocuments(
        filter
      ),
    ]);

    // -----------------------------------------
    // Response
    // -----------------------------------------

    return NextResponse.json({
      success: true,

      data: recipients,

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
      "Get award recipients error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch award recipients",
      },
      { status: 500 }
    );
  }
}