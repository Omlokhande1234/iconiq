import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import News from "@/models/News";
import Category from "@/models/Category";
import Tag from "@/models/Tags";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/lib/cloudinary-upload";

// ======================================================
// GET NEWS BY ID
// ======================================================

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid news ID",
        },
        { status: 400 }
      );
    }

    const news = await News.findById(id)
      .populate("category")
      .populate("tags");

    if (!news) {
      return NextResponse.json(
        {
          success: false,
          message: "News not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error("Get news error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch news",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// UPDATE NEWS
// ======================================================

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid news ID",
        },
        { status: 400 }
      );
    }

    const news = await News.findById(id);

    if (!news) {
      return NextResponse.json(
        {
          success: false,
          message: "News not found",
        },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    // --------------------------------------------------
    // Basic fields
    // --------------------------------------------------

    const title = formData.get("title")?.toString().trim();
    const slug = formData
      .get("slug")
      ?.toString()
      .trim()
      .toLowerCase();

    const excerpt = formData
      .get("excerpt")
      ?.toString()
      .trim();

    const content = formData
      .get("content")
      ?.toString();

    const authorName = formData
      .get("authorName")
      ?.toString()
      .trim();

    const authorDesignation = formData
      .get("authorDesignation")
      ?.toString()
      .trim();

    const readingTime = formData
      .get("readingTime")
      ?.toString()
      .trim();

    const publicationDate = formData
      .get("publicationDate")
      ?.toString();

    const seoTitle = formData
      .get("seoTitle")
      ?.toString()
      .trim();

    const seoDescription = formData
      .get("seoDescription")
      ?.toString()
      .trim();

    // --------------------------------------------------
    // Update basic fields only when supplied
    // --------------------------------------------------

    if (title !== undefined) {
      news.title = title;
    }

    if (slug !== undefined) {
      const duplicateSlug = await News.findOne({
        slug,
        _id: { $ne: id },
      });

      if (duplicateSlug) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Another news item already uses this slug",
          },
          { status: 409 }
        );
      }

      news.slug = slug;
    }

    if (excerpt !== undefined) {
      news.excerpt = excerpt;
    }

    if (content !== undefined) {
      news.content = content;
    }

    if (authorName !== undefined) {
      news.authorName = authorName;
    }

    if (authorDesignation !== undefined) {
      news.authorDesignation =
        authorDesignation;
    }

    if (readingTime !== undefined) {
      news.readingTime = readingTime;
    }

    if (publicationDate !== undefined) {
      const parsedDate = new Date(publicationDate);

      if (Number.isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid publication date",
          },
          { status: 400 }
        );
      }

      news.publicationDate = parsedDate;
    }

    if (seoTitle !== undefined) {
      news.seoTitle = seoTitle;
    }

    if (seoDescription !== undefined) {
      news.seoDescription =
        seoDescription;
    }

    // --------------------------------------------------
    // Category
    // --------------------------------------------------

    const categoryValue = formData
      .get("category")
      ?.toString();

    if (categoryValue !== undefined) {
      if (
        categoryValue === "" ||
        categoryValue === "null"
      ) {
        news.category = undefined;
      } else {
        if (
          !mongoose.Types.ObjectId.isValid(
            categoryValue
          )
        ) {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid category ID",
            },
            { status: 400 }
          );
        }

        const categoryExists =
          await Category.findById(categoryValue);

        if (!categoryExists) {
          return NextResponse.json(
            {
              success: false,
              message: "Category not found",
            },
            { status: 404 }
          );
        }

        news.category =
          new mongoose.Types.ObjectId(
            categoryValue
          );
      }
    }

    // --------------------------------------------------
    // Tags
    // --------------------------------------------------

    const tagsValue = formData
      .get("tags")
      ?.toString();

    if (tagsValue !== undefined) {
      try {
        const parsedTags = JSON.parse(tagsValue);

        if (!Array.isArray(parsedTags)) {
          return NextResponse.json(
            {
              success: false,
              message: "Tags must be an array",
            },
            { status: 400 }
          );
        }

        const updatedTags: mongoose.Types.ObjectId[] =
          [];

        for (const tagId of parsedTags) {
          if (
            !mongoose.Types.ObjectId.isValid(
              tagId
            )
          ) {
            return NextResponse.json(
              {
                success: false,
                message: `Invalid tag ID: ${tagId}`,
              },
              { status: 400 }
            );
          }

          const tagExists =
            await Tag.findById(tagId);

          if (!tagExists) {
            return NextResponse.json(
              {
                success: false,
                message: `Tag not found: ${tagId}`,
              },
              { status: 404 }
            );
          }

          updatedTags.push(
            new mongoose.Types.ObjectId(tagId)
          );
        }

        news.tags = updatedTags;
      } catch {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid tags JSON",
          },
          { status: 400 }
        );
      }
    }

    // --------------------------------------------------
    // Status
    // --------------------------------------------------

    const statusValue = formData
      .get("status")
      ?.toString();

    if (statusValue !== undefined) {
      if (
        statusValue !== "draft" &&
        statusValue !== "published"
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

      news.status = statusValue;
    }

    // --------------------------------------------------
    // Featured
    // --------------------------------------------------

    const featuredValue = formData
      .get("featuredOnHomepage")
      ?.toString();

    if (featuredValue !== undefined) {
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

      news.featuredOnHomepage =
        featuredValue === "true";
    }

    // --------------------------------------------------
    // Display order
    // --------------------------------------------------

    const displayOrderValue = formData
      .get("displayOrder")
      ?.toString();

    if (displayOrderValue !== undefined) {
      const displayOrder =
        Number(displayOrderValue);

      if (!Number.isInteger(displayOrder)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "displayOrder must be an integer",
          },
          { status: 400 }
        );
      }

      news.displayOrder = displayOrder;
    }

    // --------------------------------------------------
    // Replace featured image
    // --------------------------------------------------

    const featuredImageFile =
      formData.get("featuredImage");

    if (
      featuredImageFile instanceof File &&
      featuredImageFile.size > 0
    ) {
      const oldImage =
        news.featuredImage;

      const uploaded =
        await uploadToCloudinary(
          featuredImageFile,
          "iconisphere/news/featured"
        );

      news.featuredImage = uploaded;

      if (oldImage?.publicId) {
        try {
          await deleteFromCloudinary(
            oldImage.publicId
          );
        } catch (error) {
          console.error(
            "Failed to delete old featured image:",
            error
          );
        }
      }
    }

    // --------------------------------------------------
    // Additional images
    // --------------------------------------------------

    const removeAdditionalImagesValue =
      formData
        .get("removeAdditionalImages")
        ?.toString();

    if (removeAdditionalImagesValue) {
      try {
        const publicIds = JSON.parse(
          removeAdditionalImagesValue
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

        for (const publicId of publicIds) {
          const existingImage =
            news.additionalImages.find(
              (image) =>
                image.publicId === publicId
            );

          if (existingImage) {
            try {
              await deleteFromCloudinary(
                existingImage.publicId
              );
            } catch (error) {
              console.error(
                "Failed to delete additional image:",
                error
              );
            }
          }
        }

        news.additionalImages =
          news.additionalImages.filter(
            (image) =>
              !publicIds.includes(
                image.publicId
              )
          );
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

    // Add new additional images

    const additionalImageFiles =
      formData.getAll("additionalImages");

    for (const file of additionalImageFiles) {
      if (
        file instanceof File &&
        file.size > 0
      ) {
        const uploaded =
          await uploadToCloudinary(
            file,
            "iconisphere/news/additional"
          );

        news.additionalImages.push(
          uploaded
        );
      }
    }

    // --------------------------------------------------
    // Replace social image
    // --------------------------------------------------

    const socialImageFile =
      formData.get("socialImage");

    if (
      socialImageFile instanceof File &&
      socialImageFile.size > 0
    ) {
      const oldImage =
        news.socialImage;

      const uploaded =
        await uploadToCloudinary(
          socialImageFile,
          "iconisphere/news/social"
        );

      news.socialImage = uploaded;

      if (oldImage?.publicId) {
        try {
          await deleteFromCloudinary(
            oldImage.publicId
          );
        } catch (error) {
          console.error(
            "Failed to delete old social image:",
            error
          );
        }
      }
    }

    // --------------------------------------------------
    // Save
    // --------------------------------------------------

    await news.save();

    const populatedNews =
      await News.findById(news.id)
        .populate("category")
        .populate("tags");

    return NextResponse.json({
      success: true,
      message: "News updated successfully",
      data: populatedNews,
    });
  } catch (error) {
    console.error("Update news error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update news",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// DELETE NEWS
// ======================================================

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid news ID",
        },
        { status: 400 }
      );
    }

    const news = await News.findById(id);

    if (!news) {
      return NextResponse.json(
        {
          success: false,
          message: "News not found",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // Delete featured image
    // --------------------------------------------------

    if (news.featuredImage?.publicId) {
      try {
        await deleteFromCloudinary(
          news.featuredImage.publicId
        );
      } catch (error) {
        console.error(
          "Failed to delete featured image:",
          error
        );
      }
    }

    // --------------------------------------------------
    // Delete additional images
    // --------------------------------------------------

    for (const image of news.additionalImages) {
      if (image.publicId) {
        try {
          await deleteFromCloudinary(
            image.publicId
          );
        } catch (error) {
          console.error(
            "Failed to delete additional image:",
            error
          );
        }
      }
    }

    // --------------------------------------------------
    // Delete social image
    // --------------------------------------------------

    if (news.socialImage?.publicId) {
      try {
        await deleteFromCloudinary(
          news.socialImage.publicId
        );
      } catch (error) {
        console.error(
          "Failed to delete social image:",
          error
        );
      }
    }

    // --------------------------------------------------
    // Delete database record
    // --------------------------------------------------

    await News.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    console.error("Delete news error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete news",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}