import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Award from "@/models/Award";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { deleteFromCloudinary } from "@/lib/cloudinary-upload";

export const runtime = "nodejs";

/**
 * GET /api/awards/:id
 *
 * Get a single award by ID.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // -----------------------------------------
    // Validate ID
    // -----------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid award ID",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Find award
    // -----------------------------------------

    const award = await Award.findById(id)
      .populate("tags")
      .lean();

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
    // Response
    // -----------------------------------------

    return NextResponse.json({
      success: true,
      data: award,
    });
  } catch (error) {
    console.error("Get award error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch award",
      },
      { status: 500 }
    );
  }
}


/**
 * PUT /api/awards/:id
 *
 * Update an existing award.
 *
 * Content-Type:
 * multipart/form-data
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // -----------------------------------------
    // Validate ID
    // -----------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid award ID",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Find existing award
    // -----------------------------------------

    const award = await Award.findById(id);

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
    // Read form data
    // -----------------------------------------

    const formData = await req.formData();

    const title = formData.get("title");
    const slug = formData.get("slug");
    const category = formData.get("category");
    const year = formData.get("year");
    const shortDescription =
      formData.get("shortDescription");

    const content = formData.get("content");

    const recognitionCriteria =
      formData.get("recognitionCriteria");

    const publicationDate =
      formData.get("publicationDate");

    const status =
      formData.get("status");

    const featuredOnHomepage =
      formData.get("featuredOnHomepage");

    const displayOrder =
      formData.get("displayOrder");

    const seoTitle =
      formData.get("seoTitle");

    const seoDescription =
      formData.get("seoDescription");

    // -----------------------------------------
    // Slug
    // -----------------------------------------

    if (slug !== null) {
      const newSlug = slug
        .toString()
        .trim()
        .toLowerCase();

      if (!newSlug) {
        return NextResponse.json(
          {
            success: false,
            message: "Slug cannot be empty",
          },
          { status: 400 }
        );
      }

      // Only check if slug changed
      if (newSlug !== award.slug) {
        const existingAward =
          await Award.findOne({
            slug: newSlug,
            _id: { $ne: id },
          });

        if (existingAward) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Another award already uses this slug",
            },
            { status: 409 }
          );
        }

        award.slug = newSlug;
      }
    }

    // -----------------------------------------
    // Title
    // -----------------------------------------

    if (title !== null) {
      const newTitle = title
        .toString()
        .trim();

      if (!newTitle) {
        return NextResponse.json(
          {
            success: false,
            message: "Title cannot be empty",
          },
          { status: 400 }
        );
      }

      award.title = newTitle;
    }

    // -----------------------------------------
    // Category
    // -----------------------------------------

    if (category !== null) {
      award.category =
        category.toString().trim() || undefined;
    }

    // -----------------------------------------
    // Year
    // -----------------------------------------

    if (year !== null) {
      const yearString =
        year.toString().trim();

      if (yearString === "") {
        award.year = undefined;
      } else {
        const parsedYear =
          Number(yearString);

        if (!Number.isInteger(parsedYear)) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Year must be a valid number",
            },
            { status: 400 }
          );
        }

        award.year = parsedYear;
      }
    }

    // -----------------------------------------
    // Short description
    // -----------------------------------------

    if (shortDescription !== null) {
      award.shortDescription =
        shortDescription
          .toString()
          .trim() || undefined;
    }

    // -----------------------------------------
    // Content
    // -----------------------------------------

    if (content !== null) {
      const newContent =
        content.toString();

      if (!newContent.trim()) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Content cannot be empty",
          },
          { status: 400 }
        );
      }

      award.content = newContent;
    }

    // -----------------------------------------
    // Recognition criteria
    // -----------------------------------------

    if (recognitionCriteria !== null) {
      award.recognitionCriteria =
        recognitionCriteria
          .toString()
          .trim() || undefined;
    }

    // -----------------------------------------
    // Publication date
    // -----------------------------------------

    if (publicationDate !== null) {
      const dateString =
        publicationDate.toString().trim();

      if (dateString === "") {
        award.publicationDate = undefined;
      } else {
        const parsedDate =
          new Date(dateString);

        if (
          Number.isNaN(
            parsedDate.getTime()
          )
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Invalid publication date",
            },
            { status: 400 }
          );
        }

        award.publicationDate =
          parsedDate;
      }
    }

    // -----------------------------------------
    // Status
    // -----------------------------------------

    if (status !== null) {
      const newStatus =
        status.toString();

      if (
        newStatus !== "draft" &&
        newStatus !== "published"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Status must be either 'draft' or 'published'",
          },
          { status: 400 }
        );
      }

      award.status = newStatus;
    }

    // -----------------------------------------
    // Featured on homepage
    // -----------------------------------------

    if (featuredOnHomepage !== null) {
      const featuredValue =
        featuredOnHomepage
          .toString()
          .toLowerCase();

      if (
        featuredValue !== "true" &&
        featuredValue !== "false"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "featuredOnHomepage must be true or false",
          },
          { status: 400 }
        );
      }

      award.featuredOnHomepage =
        featuredValue === "true";
    }

    // -----------------------------------------
    // Display order
    // -----------------------------------------

    if (displayOrder !== null) {
      const displayOrderString =
        displayOrder.toString().trim();

      if (displayOrderString === "") {
        award.displayOrder = 0;
      } else {
        const parsedDisplayOrder =
          Number(displayOrderString);

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

        award.displayOrder =
          parsedDisplayOrder;
      }
    }

    // -----------------------------------------
    // SEO title
    // -----------------------------------------

    if (seoTitle !== null) {
      award.seoTitle =
        seoTitle.toString().trim() ||
        undefined;
    }

    // -----------------------------------------
    // SEO description
    // -----------------------------------------

    if (seoDescription !== null) {
      award.seoDescription =
        seoDescription
          .toString()
          .trim() || undefined;
    }

    // -----------------------------------------
    // Tags
    // -----------------------------------------

    const tagsValue =
      formData.get("tags");

    if (tagsValue !== null) {
      try {
        const parsedTags =
          JSON.parse(
            tagsValue.toString()
          );

        if (!Array.isArray(parsedTags)) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Tags must be an array",
            },
            { status: 400 }
          );
        }

        // Validate every tag ID
        const invalidTag =
          parsedTags.find(
            (tagId) =>
              typeof tagId !== "string" ||
              !mongoose.Types.ObjectId.isValid(
                tagId
              )
          );

        if (invalidTag) {
          return NextResponse.json(
            {
              success: false,
              message:
                "One or more tag IDs are invalid",
            },
            { status: 400 }
          );
        }

        award.tags =
          parsedTags.map(
            (tagId: string) =>
              new mongoose.Types.ObjectId(
                tagId
              )
          );
      } catch {
        return NextResponse.json(
          {
            success: false,
            message:
              'Invalid tags format. Expected ["tagId1","tagId2"]',
          },
          { status: 400 }
        );
      }
    }

    // -----------------------------------------
    // Images
    // -----------------------------------------

    const awardImageFile =
      formData.get("awardImage");

    const awardIconFile =
      formData.get("awardIcon");

    const socialImageFile =
      formData.get("socialImage");

    // -----------------------------------------
    // Replace Award Image
    // -----------------------------------------

    if (
      awardImageFile instanceof File &&
      awardImageFile.size > 0
    ) {
      // Delete old image first
      if (
        award.awardImage?.publicId
      ) {
        try {
          await deleteFromCloudinary(
            award.awardImage.publicId
          );
        } catch (error) {
          console.error(
            "Failed to delete old award image:",
            error
          );
        }
      }

      // Upload new image
      const result =
        await uploadToCloudinary(
          awardImageFile,
          "iconisphere/awards/images"
        );

      award.awardImage = {
        url: result.url,
        publicId: result.publicId,
      };
    }

    // -----------------------------------------
    // Replace Award Icon
    // -----------------------------------------

    if (
      awardIconFile instanceof File &&
      awardIconFile.size > 0
    ) {
      // Delete old icon
      if (
        award.awardIcon?.publicId
      ) {
        try {
          await deleteFromCloudinary(
            award.awardIcon.publicId
          );
        } catch (error) {
          console.error(
            "Failed to delete old award icon:",
            error
          );
        }
      }

      // Upload new icon
      const result =
        await uploadToCloudinary(
          awardIconFile,
          "iconisphere/awards/icons"
        );

      award.awardIcon = {
        url: result.url,
        publicId: result.publicId,
      };
    }

    // -----------------------------------------
    // Replace Social Image
    // -----------------------------------------

    if (
      socialImageFile instanceof File &&
      socialImageFile.size > 0
    ) {
      // Delete old social image
      if (
        award.socialImage?.publicId
      ) {
        try {
          await deleteFromCloudinary(
            award.socialImage.publicId
          );
        } catch (error) {
          console.error(
            "Failed to delete old social image:",
            error
          );
        }
      }

      // Upload new social image
      const result =
        await uploadToCloudinary(
          socialImageFile,
          "iconisphere/awards/social"
        );

      award.socialImage = {
        url: result.url,
        publicId: result.publicId,
      };
    }

    // -----------------------------------------
    // Save
    // -----------------------------------------

    await award.save();

    // -----------------------------------------
    // Get updated award with populated tags
    // -----------------------------------------

    const updatedAward =
      await Award.findById(id)
        .populate("tags")
        .lean();

    return NextResponse.json({
      success: true,
      message:
        "Award updated successfully",
      data: updatedAward,
    });
  } catch (error) {
    console.error(
      "Update award error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update award",
      },
      { status: 500 }
    );
  }
}


/**
 * DELETE /api/awards/:id
 *
 * Delete an award and its
 * associated Cloudinary images.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // -----------------------------------------
    // Validate ID
    // -----------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid award ID",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Find award
    // -----------------------------------------

    const award =
      await Award.findById(id);

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
    // Delete Cloudinary Award Image
    // -----------------------------------------

    if (
      award.awardImage?.publicId
    ) {
      try {
        await deleteFromCloudinary(
          award.awardImage.publicId
        );
      } catch (error) {
        console.error(
          "Failed to delete award image:",
          error
        );
      }
    }

    // -----------------------------------------
    // Delete Cloudinary Award Icon
    // -----------------------------------------

    if (
      award.awardIcon?.publicId
    ) {
      try {
        await deleteFromCloudinary(
          award.awardIcon.publicId
        );
      } catch (error) {
        console.error(
          "Failed to delete award icon:",
          error
        );
      }
    }

    // -----------------------------------------
    // Delete Cloudinary Social Image
    // -----------------------------------------

    if (
      award.socialImage?.publicId
    ) {
      try {
        await deleteFromCloudinary(
          award.socialImage.publicId
        );
      } catch (error) {
        console.error(
          "Failed to delete social image:",
          error
        );
      }
    }

    // -----------------------------------------
    // Delete MongoDB document
    // -----------------------------------------

    await Award.findByIdAndDelete(id);

    // -----------------------------------------
    // Response
    // -----------------------------------------

    return NextResponse.json({
      success: true,
      message:
        "Award and associated images deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete award error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete award",
      },
      { status: 500 }
    );
  }
}