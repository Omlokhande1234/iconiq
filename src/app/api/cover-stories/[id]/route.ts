import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import CoverStory from "@/models/CoverStory";
import Category from "@/models/Category";
import Tag from "@/models/Tags";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/lib/cloudinary-upload";

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
          message: "Invalid cover story ID",
        },
        { status: 400 }
      );
    }

    const coverStory = await CoverStory.findById(id)
      .populate("category")
      .populate("tags");

    if (!coverStory) {
      return NextResponse.json(
        {
          success: false,
          message: "Cover story not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: coverStory,
    });
  } catch (error) {
    console.error("Get cover story error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch cover story",
      },
      { status: 500 }
    );
  }
}

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
          message: "Invalid cover story ID",
        },
        { status: 400 }
      );
    }

    const coverStory = await CoverStory.findById(id);

    if (!coverStory) {
      return NextResponse.json(
        {
          success: false,
          message: "Cover story not found",
        },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    // ----------------------------------
    // Basic fields
    // ----------------------------------

    const title = formData.get("title")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim().toLowerCase();

    if (title !== undefined && !title) {
      return NextResponse.json(
        {
          success: false,
          message: "Title cannot be empty",
        },
        { status: 400 }
      );
    }

    if (slug !== undefined && !slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug cannot be empty",
        },
        { status: 400 }
      );
    }

    if (slug && slug !== coverStory.slug) {
      const existingStory = await CoverStory.findOne({
        slug,
        _id: { $ne: id },
      });

      if (existingStory) {
        return NextResponse.json(
          {
            success: false,
            message: "A cover story with this slug already exists",
          },
          { status: 409 }
        );
      }

      coverStory.slug = slug;
    }

    if (title !== undefined) {
      coverStory.title = title;
    }

    const subtitle = formData.get("subtitle");

    if (subtitle !== null) {
      coverStory.subtitle =
        subtitle.toString().trim() || undefined;
    }

    const content = formData.get("content");

    if (content !== null) {
      const newContent = content.toString();

      if (!newContent.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: "Content cannot be empty",
          },
          { status: 400 }
        );
      }

      coverStory.content = newContent;
    }

    const authorName = formData.get("authorName");

    if (authorName !== null) {
      coverStory.authorName =
        authorName.toString().trim() || undefined;
    }

    const authorDesignation =
      formData.get("authorDesignation");

    if (authorDesignation !== null) {
      coverStory.authorDesignation =
        authorDesignation.toString().trim() || undefined;
    }

    const readingTime = formData.get("readingTime");

    if (readingTime !== null) {
      coverStory.readingTime =
        readingTime.toString().trim() || undefined;
    }

    const edition = formData.get("edition");

    if (edition !== null) {
      coverStory.edition =
        edition.toString().trim() || undefined;
    }

    const pullQuote = formData.get("pullQuote");

    if (pullQuote !== null) {
      coverStory.pullQuote =
        pullQuote.toString().trim() || undefined;
    }

    // ----------------------------------
    // Category
    // ----------------------------------

    const category = formData.get("category");

    if (category !== null) {
      const categoryId = category.toString().trim();

      if (!categoryId) {
        coverStory.category = undefined;
      } else {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid category ID",
            },
            { status: 400 }
          );
        }

        const categoryExists = await Category.exists({
          _id: categoryId,
        });

        if (!categoryExists) {
          return NextResponse.json(
            {
              success: false,
              message: "Category not found",
            },
            { status: 404 }
          );
        }

        coverStory.category =
          new mongoose.Types.ObjectId(categoryId);
      }
    }

    // ----------------------------------
    // Tags
    // ----------------------------------

    const tagsValue = formData.get("tags");

    if (tagsValue !== null) {
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
          (tag) => !mongoose.Types.ObjectId.isValid(tag)
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

        const existingTags = await Tag.find({
          _id: { $in: parsedTags },
        }).select("_id");

        if (existingTags.length !== parsedTags.length) {
          return NextResponse.json(
            {
              success: false,
              message: "One or more tags were not found",
            },
            { status: 404 }
          );
        }

        coverStory.tags = parsedTags.map(
          (tag: string) =>
            new mongoose.Types.ObjectId(tag)
        );
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

    // ----------------------------------
    // Publication date
    // ----------------------------------

    const publicationDate =
      formData.get("publicationDate");

    if (publicationDate !== null) {
      const dateValue = publicationDate.toString().trim();

      if (!dateValue) {
        coverStory.publicationDate = undefined;
      } else {
        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid publication date",
            },
            { status: 400 }
          );
        }

        coverStory.publicationDate = date;
      }
    }

    // ----------------------------------
    // Status
    // ----------------------------------

    const status = formData.get("status");

    if (status !== null) {
      const newStatus = status.toString();

      if (!["draft", "published"].includes(newStatus)) {
        return NextResponse.json(
          {
            success: false,
            message: "Status must be draft or published",
          },
          { status: 400 }
        );
      }

      coverStory.status =
        newStatus as "draft" | "published";
    }

    // ----------------------------------
    // Featured
    // ----------------------------------

    const featured = formData.get("featuredOnHomepage");

    if (featured !== null) {
      const featuredValue = featured.toString();

      if (!["true", "false"].includes(featuredValue)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "featuredOnHomepage must be true or false",
          },
          { status: 400 }
        );
      }

      coverStory.featuredOnHomepage =
        featuredValue === "true";
    }

    // ----------------------------------
    // Display order
    // ----------------------------------

    const displayOrder = formData.get("displayOrder");

    if (displayOrder !== null) {
      const value = Number(displayOrder.toString());

      if (!Number.isInteger(value)) {
        return NextResponse.json(
          {
            success: false,
            message: "displayOrder must be an integer",
          },
          { status: 400 }
        );
      }

      coverStory.displayOrder = value;
    }

    // ----------------------------------
    // SEO
    // ----------------------------------

    const seoTitle = formData.get("seoTitle");

    if (seoTitle !== null) {
      coverStory.seoTitle =
        seoTitle.toString().trim() || undefined;
    }

    const seoDescription =
      formData.get("seoDescription");

    if (seoDescription !== null) {
      coverStory.seoDescription =
        seoDescription.toString().trim() || undefined;
    }

    // ----------------------------------
    // Replace cover image
    // ----------------------------------

    const newCoverImage = formData.get("coverImage");

    if (
      newCoverImage &&
      newCoverImage instanceof File &&
      newCoverImage.size > 0
    ) {
      if (coverStory.coverImage?.publicId) {
        await deleteFromCloudinary(
          coverStory.coverImage.publicId
        );
      }

      coverStory.coverImage =
        await uploadToCloudinary(
          newCoverImage,
          "iconisphere/cover-stories/covers"
        );
    }

    // ----------------------------------
    // Additional images
    // ----------------------------------

    const newAdditionalImages =
      formData.getAll("additionalImages");

    if (newAdditionalImages.length > 0) {
      for (const file of newAdditionalImages) {
        if (
          file instanceof File &&
          file.size > 0
        ) {
          const uploaded =
            await uploadToCloudinary(
              file,
              "iconisphere/cover-stories/additional"
            );

          coverStory.additionalImages.push(uploaded);
        }
      }
    }

    // ----------------------------------
    // Remove additional images
    // ----------------------------------

    const removeAdditionalImages =
      formData.get("removeAdditionalImages");

    if (removeAdditionalImages) {
      try {
        const publicIds = JSON.parse(
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

        for (const image of coverStory.additionalImages) {
          if (publicIds.includes(image.publicId)) {
            await deleteFromCloudinary(
              image.publicId
            );
          } else {
            remainingImages.push(image);
          }
        }

        coverStory.additionalImages =
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

    const newSocialImage = formData.get("socialImage");

    if (
      newSocialImage &&
      newSocialImage instanceof File &&
      newSocialImage.size > 0
    ) {
      if (coverStory.socialImage?.publicId) {
        await deleteFromCloudinary(
          coverStory.socialImage.publicId
        );
      }

      coverStory.socialImage =
        await uploadToCloudinary(
          newSocialImage,
          "iconisphere/cover-stories/social"
        );
    }

    // ----------------------------------
    // Save
    // ----------------------------------

    await coverStory.save();

    const populatedStory =
      await CoverStory.findById(coverStory._id)
        .populate("category")
        .populate("tags");

    return NextResponse.json({
      success: true,
      message: "Cover story updated successfully",
      data: populatedStory,
    });
  } catch (error) {
    console.error("Update cover story error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update cover story",
      },
      { status: 500 }
    );
  }
}

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
          message: "Invalid cover story ID",
        },
        { status: 400 }
      );
    }

    const coverStory =
      await CoverStory.findById(id);

    if (!coverStory) {
      return NextResponse.json(
        {
          success: false,
          message: "Cover story not found",
        },
        { status: 404 }
      );
    }

    // Delete cover image
    if (coverStory.coverImage?.publicId) {
      await deleteFromCloudinary(
        coverStory.coverImage.publicId
      );
    }

    // Delete additional images
    for (const image of coverStory.additionalImages) {
      if (image.publicId) {
        await deleteFromCloudinary(
          image.publicId
        );
      }
    }

    // Delete social image
    if (coverStory.socialImage?.publicId) {
      await deleteFromCloudinary(
        coverStory.socialImage.publicId
      );
    }

    // Delete MongoDB document
    await CoverStory.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Cover story deleted successfully",
    });
  } catch (error) {
    console.error("Delete cover story error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete cover story",
      },
      { status: 500 }
    );
  }
}