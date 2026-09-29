import {
  NextRequest,
  NextResponse,
} from "next/server";

import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Award from "@/models/Award";
import AwardRecipient from "@/models/AwardRecipient";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/lib/cloudinary-upload";

export const runtime = "nodejs";


/**
 * GET /api/award-recipients/:id
 */
export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectDB();

    const { id } = await params;

    // -----------------------------------------
    // Validate ID
    // -----------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid recipient ID",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Find recipient
    // -----------------------------------------

    const recipient =
      await AwardRecipient.findById(id)
        .populate("award")
        .lean();

    if (!recipient) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Award recipient not found",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------
    // Response
    // -----------------------------------------

    return NextResponse.json({
      success: true,
      data: recipient,
    });
  } catch (error) {
    console.error(
      "Get award recipient error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch award recipient",
      },
      { status: 500 }
    );
  }
}


/**
 * PUT /api/award-recipients/:id
 *
 * Update recipient.
 *
 * Content-Type:
 * multipart/form-data
 */
export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectDB();

    const { id } = await params;

    // -----------------------------------------
    // Validate ID
    // -----------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid recipient ID",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Find recipient
    // -----------------------------------------

    const recipient =
      await AwardRecipient.findById(id);

    if (!recipient) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Award recipient not found",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------
    // Form data
    // -----------------------------------------

    const formData =
      await req.formData();

    const awardValue =
      formData.get("award");

    const name =
      formData.get("name");

    const designation =
      formData.get("designation");

    const organization =
      formData.get("organization");

    const profile =
      formData.get("profile");

    const slug =
      formData.get("slug");

    const recipientType =
      formData.get("recipientType");

    const displayOrder =
      formData.get("displayOrder");

    // -----------------------------------------
    // Award
    // -----------------------------------------

    if (awardValue !== null) {
      const awardId =
        awardValue.toString();

      if (
        !mongoose.Types.ObjectId.isValid(
          awardId
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

      const awardExists =
        await Award.findById(
          awardId
        );

      if (!awardExists) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Award not found",
          },
          { status: 404 }
        );
      }

      recipient.award =
        new mongoose.Types.ObjectId(
          awardId
        );
    }

    // -----------------------------------------
    // Name
    // -----------------------------------------

    if (name !== null) {
      const newName =
        name.toString().trim();

      if (!newName) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Name cannot be empty",
          },
          { status: 400 }
        );
      }

      recipient.name =
        newName;
    }

    // -----------------------------------------
    // Designation
    // -----------------------------------------

    if (designation !== null) {
      recipient.designation =
        designation
          .toString()
          .trim() || undefined;
    }

    // -----------------------------------------
    // Organization
    // -----------------------------------------

    if (organization !== null) {
      recipient.organization =
        organization
          .toString()
          .trim() || undefined;
    }

    // -----------------------------------------
    // Profile
    // -----------------------------------------

    if (profile !== null) {
      recipient.profile =
        profile
          .toString()
          .trim() || undefined;
    }

    // -----------------------------------------
    // Slug
    // -----------------------------------------

    if (slug !== null) {
      const newSlug =
        slug
          .toString()
          .trim()
          .toLowerCase();

      if (newSlug !== recipient.slug) {
        if (newSlug) {
          const existingRecipient =
            await AwardRecipient.findOne(
              {
                slug: newSlug,
                _id: { $ne: id },
              }
            );

          if (existingRecipient) {
            return NextResponse.json(
              {
                success: false,
                message:
                  "Another recipient already uses this slug",
              },
              { status: 409 }
            );
          }
        }

        recipient.slug =
          newSlug || undefined;
      }
    }

    // -----------------------------------------
    // Recipient type
    // -----------------------------------------

    if (
      recipientType !== null
    ) {
      const newType =
        recipientType.toString();

      if (
        newType !==
          "individual" &&
        newType !==
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

      recipient.recipientType =
        newType;
    }

    // -----------------------------------------
    // Display order
    // -----------------------------------------

    if (
      displayOrder !== null
    ) {
      const value =
        displayOrder
          .toString()
          .trim();

      if (value === "") {
        recipient.displayOrder =
          0;
      } else {
        const parsedValue =
          Number(value);

        if (
          !Number.isInteger(
            parsedValue
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

        recipient.displayOrder =
          parsedValue;
      }
    }

    // -----------------------------------------
    // Photo
    // -----------------------------------------

    const photoFile =
      formData.get("photo");

    if (
      photoFile instanceof File &&
      photoFile.size > 0
    ) {
      // Delete old Cloudinary photo
      if (
        recipient.photo?.publicId
      ) {
        try {
          await deleteFromCloudinary(
            recipient.photo.publicId
          );
        } catch (error) {
          console.error(
            "Failed to delete old recipient photo:",
            error
          );
        }
      }

      // Upload new photo
      const result =
        await uploadToCloudinary(
          photoFile,
          "iconisphere/award-recipients"
        );

      recipient.photo = {
        url: result.url,
        publicId:
          result.publicId,
      };
    }

    // -----------------------------------------
    // Save
    // -----------------------------------------

    await recipient.save();

    // -----------------------------------------
    // Populate award
    // -----------------------------------------

    const updatedRecipient =
      await AwardRecipient.findById(
        id
      )
        .populate("award")
        .lean();

    // -----------------------------------------
    // Response
    // -----------------------------------------

    return NextResponse.json({
      success: true,
      message:
        "Award recipient updated successfully",
      data: updatedRecipient,
    });
  } catch (error) {
    console.error(
      "Update award recipient error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update award recipient",
      },
      { status: 500 }
    );
  }
}


/**
 * DELETE /api/award-recipients/:id
 *
 * Deletes:
 * 1. Cloudinary photo
 * 2. MongoDB recipient
 */
export async function DELETE(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectDB();

    const { id } = await params;

    // -----------------------------------------
    // Validate ID
    // -----------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid recipient ID",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Find recipient
    // -----------------------------------------

    const recipient =
      await AwardRecipient.findById(id);

    if (!recipient) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Award recipient not found",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------
    // Delete Cloudinary photo
    // -----------------------------------------

    if (
      recipient.photo?.publicId
    ) {
      try {
        await deleteFromCloudinary(
          recipient.photo.publicId
        );
      } catch (error) {
        console.error(
          "Failed to delete recipient photo:",
          error
        );
      }
    }

    // -----------------------------------------
    // Delete MongoDB document
    // -----------------------------------------

    await AwardRecipient.findByIdAndDelete(
      id
    );

    // -----------------------------------------
    // Response
    // -----------------------------------------

    return NextResponse.json({
      success: true,
      message:
        "Award recipient and associated photo deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete award recipient error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete award recipient",
      },
      { status: 500 }
    );
  }
}