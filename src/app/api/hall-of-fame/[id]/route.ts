import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import HallOfFame from "@/models/HallOfFame";
import Category from "@/models/Category";
import Tag from "@/models/Tags";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/lib/cloudinary-upload";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid Hall of Fame ID",
        },
        { status: 400 }
      );
    }

    const entry =
      await HallOfFame.findById(id)
        .populate("category")
        .populate("tags");

    if (!entry) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Hall of Fame entry not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error(
      "Get Hall of Fame entry error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch Hall of Fame entry",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid Hall of Fame ID",
        },
        { status: 400 }
      );
    }

    const entry =
      await HallOfFame.findById(id);

    if (!entry) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Hall of Fame entry not found",
        },
        { status: 404 }
      );
    }

    const formData =
      await req.formData();

    // ----------------------------------
    // Name
    // ----------------------------------

    const name =
      formData.get("name");

    if (name !== null) {
      const value =
        name.toString().trim();

      if (!value) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Name cannot be empty",
          },
          { status: 400 }
        );
      }

      entry.name = value;
    }

    // ----------------------------------
    // Slug
    // ----------------------------------

    const slug =
      formData.get("slug");

    if (slug !== null) {
      const newSlug =
        slug.toString()
          .trim()
          .toLowerCase();

      if (!newSlug) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Slug cannot be empty",
          },
          { status: 400 }
        );
      }

      if (newSlug !== entry.slug) {
        const existing =
          await HallOfFame.findOne({
            slug: newSlug,
            _id: { $ne: id },
          });

        if (existing) {
          return NextResponse.json(
            {
              success: false,
              message:
                "A Hall of Fame entry with this slug already exists",
            },
            { status: 409 }
          );
        }

        entry.slug = newSlug;
      }
    }

    // ----------------------------------
    // Text fields
    // ----------------------------------

    const textFields = [
      "designation",
      "organization",
      "biography",
      "recognitionTitle",
      "description",
      "pullQuote",
      "recognitionCategory",
      "seoTitle",
      "seoDescription",
    ] as const;

    for (const field of textFields) {
      const value =
        formData.get(field);

      if (value !== null) {
        const textValue =
          value.toString().trim();

        entry[field] =
          textValue || undefined;
      }
    }

    // ----------------------------------
    // Content
    // ----------------------------------

    const content =
      formData.get("content");

    if (content !== null) {
      const value =
        content.toString();

      if (!value.trim()) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Content cannot be empty",
          },
          { status: 400 }
        );
      }

      entry.content = value;
    }

    // ----------------------------------
    // Category
    // ----------------------------------

    const category =
      formData.get("category");

    if (category !== null) {
      const categoryId =
        category.toString().trim();

      if (!categoryId) {
        entry.category = undefined;
      } else {
        if (
          !mongoose.Types.ObjectId.isValid(
            categoryId
          )
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Invalid category ID",
            },
            { status: 400 }
          );
        }

        const categoryExists =
          await Category.exists({
            _id: categoryId,
          });

        if (!categoryExists) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Category not found",
            },
            { status: 404 }
          );
        }

        entry.category =
          new mongoose.Types.ObjectId(
            categoryId
          );
      }
    }

    // ----------------------------------
    // Tags
    // ----------------------------------

    const tags =
      formData.get("tags");

    if (tags !== null) {
      try {
        const parsedTags =
          JSON.parse(
            tags.toString()
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

        const invalidTag =
          parsedTags.find(
            (tag) =>
              !mongoose.Types.ObjectId.isValid(
                tag
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

        const existingTags =
          await Tag.find({
            _id: { $in: parsedTags },
          }).select("_id");

        if (
          existingTags.length !==
          parsedTags.length
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "One or more tags were not found",
            },
            { status: 404 }
          );
        }

        entry.tags =
          parsedTags.map(
            (tag: string) =>
              new mongoose.Types.ObjectId(
                tag
              )
          );
      } catch {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid tags JSON",
          },
          { status: 400 }
        );
      }
    }

    // ----------------------------------
    // Year of induction
    // ----------------------------------

    const year =
      formData.get(
        "yearOfInduction"
      );

    if (year !== null) {
      const value =
        year.toString().trim();

      if (!value) {
        entry.yearOfInduction =
          undefined;
      } else {
        const parsedYear =
          Number(value);

        if (
          !Number.isInteger(
            parsedYear
          )
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "yearOfInduction must be an integer",
            },
            { status: 400 }
          );
        }

        entry.yearOfInduction =
          parsedYear;
      }
    }

    // ----------------------------------
    // Publication date
    // ----------------------------------

    const publicationDate =
      formData.get(
        "publicationDate"
      );

    if (publicationDate !== null) {
      const value =
        publicationDate
          .toString()
          .trim();

      if (!value) {
        entry.publicationDate =
          undefined;
      } else {
        const date =
          new Date(value);

        if (
          Number.isNaN(
            date.getTime()
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

        entry.publicationDate =
          date;
      }
    }

    // ----------------------------------
    // Status
    // ----------------------------------

    const status =
      formData.get("status");

    if (status !== null) {
      const value =
        status.toString();

      if (
        value !== "draft" &&
        value !== "published"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Status must be draft or published",
          },
          { status: 400 }
        );
      }

      entry.status =
        value as
          | "draft"
          | "published";
    }

    // ----------------------------------
    // Featured
    // ----------------------------------

    const featured =
      formData.get(
        "featuredOnHomepage"
      );

    if (featured !== null) {
      const value =
        featured.toString();

      if (
        value !== "true" &&
        value !== "false"
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

      entry.featuredOnHomepage =
        value === "true";
    }

    // ----------------------------------
    // Display order
    // ----------------------------------

    const displayOrder =
      formData.get(
        "displayOrder"
      );

    if (displayOrder !== null) {
      const value =
        Number(
          displayOrder.toString()
        );

      if (
        !Number.isInteger(value)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "displayOrder must be an integer",
          },
          { status: 400 }
        );
      }

      entry.displayOrder = value;
    }

    // ----------------------------------
    // Replace profile photo
    // ----------------------------------

    const newProfilePhoto =
      formData.get(
        "profilePhoto"
      );

    if (
      newProfilePhoto &&
      newProfilePhoto instanceof File &&
      newProfilePhoto.size > 0
    ) {
      if (
        entry.profilePhoto?.publicId
      ) {
        await deleteFromCloudinary(
          entry.profilePhoto.publicId
        );
      }

      entry.profilePhoto =
        await uploadToCloudinary(
          newProfilePhoto,
          "iconisphere/hall-of-fame/profile"
        );
    }

    // ----------------------------------
    // Add additional images
    // ----------------------------------

    const newAdditionalImages =
      formData.getAll(
        "additionalImages"
      );

    if (
      newAdditionalImages.length > 0
    ) {
      for (const file of newAdditionalImages) {
        if (
          file instanceof File &&
          file.size > 0
        ) {
          const uploaded =
            await uploadToCloudinary(
              file,
              "iconisphere/hall-of-fame/additional"
            );

          entry.additionalImages.push(
            uploaded
          );
        }
      }
    }

    // ----------------------------------
    // Remove additional images
    // ----------------------------------

    const removeAdditionalImages =
      formData.get(
        "removeAdditionalImages"
      );

    if (removeAdditionalImages) {
      try {
        const publicIds =
          JSON.parse(
            removeAdditionalImages.toString()
          );

        if (!Array.isArray(publicIds)) {
          return NextResponse.json(
            {
              success: false,
              message:
                "removeAdditionalImages must be an array",
            },
            { status: 400 }
          );
        }

        const remainingImages = [];

        for (const image of entry.additionalImages) {
          if (
            publicIds.includes(
              image.publicId
            )
          ) {
            await deleteFromCloudinary(
              image.publicId
            );
          } else {
            remainingImages.push(
              image
            );
          }
        }

        entry.additionalImages =
          remainingImages;
      } catch {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid removeAdditionalImages JSON",
          },
          { status: 400 }
        );
      }
    }

    // ----------------------------------
    // Replace social image
    // ----------------------------------

    const newSocialImage =
      formData.get("socialImage");

    if (
      newSocialImage &&
      newSocialImage instanceof File &&
      newSocialImage.size > 0
    ) {
      if (
        entry.socialImage?.publicId
      ) {
        await deleteFromCloudinary(
          entry.socialImage.publicId
        );
      }

      entry.socialImage =
        await uploadToCloudinary(
          newSocialImage,
          "iconisphere/hall-of-fame/social"
        );
    }

    // ----------------------------------
    // Save
    // ----------------------------------

    await entry.save();

    const populatedEntry =
      await HallOfFame.findById(
        entry.id
      )
        .populate("category")
        .populate("tags");

    return NextResponse.json({
      success: true,
      message:
        "Hall of Fame entry updated successfully",
      data: populatedEntry,
    });
  } catch (error) {
    console.error(
      "Update Hall of Fame error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update Hall of Fame entry",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid Hall of Fame ID",
        },
        { status: 400 }
      );
    }

    const entry =
      await HallOfFame.findById(id);

    if (!entry) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Hall of Fame entry not found",
        },
        { status: 404 }
      );
    }

    // Delete profile photo
    if (
      entry.profilePhoto?.publicId
    ) {
      await deleteFromCloudinary(
        entry.profilePhoto.publicId
      );
    }

    // Delete additional images
    for (const image of entry.additionalImages) {
      if (image.publicId) {
        await deleteFromCloudinary(
          image.publicId
        );
      }
    }

    // Delete social image
    if (
      entry.socialImage?.publicId
    ) {
      await deleteFromCloudinary(
        entry.socialImage.publicId
      );
    }

    // Delete MongoDB document
    await HallOfFame.findByIdAndDelete(
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Hall of Fame entry deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Hall of Fame error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete Hall of Fame entry",
      },
      { status: 500 }
    );
  }
}