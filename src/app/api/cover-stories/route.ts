import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import CoverStory from "@/models/CoverStory";
import Category from "@/models/Category";
import Tag from "@/models/Tags";

import { uploadToCloudinary } from "@/lib/cloudinary-upload";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();

    const title = formData.get("title")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim().toLowerCase();
    const subtitle = formData.get("subtitle")?.toString().trim();
    const content = formData.get("content")?.toString();

    if (!title || !slug || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, slug and content are required",
        },
        { status: 400 }
      );
    }

    // Check duplicate slug
    const existingStory = await CoverStory.findOne({ slug });

    if (existingStory) {
      return NextResponse.json(
        {
          success: false,
          message: "A cover story with this slug already exists",
        },
        { status: 409 }
      );
    }

    const categoryValue = formData.get("category")?.toString();

    if (
      categoryValue &&
      !mongoose.Types.ObjectId.isValid(categoryValue)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category ID",
        },
        { status: 400 }
      );
    }

    if (categoryValue) {
      const categoryExists = await Category.exists({
        _id: categoryValue,
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
    }

    // Tags
    let tags: mongoose.Types.ObjectId[] = [];

    const tagsValue = formData.get("tags")?.toString();

    if (tagsValue) {
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

        tags = parsedTags.map(
          (tag: string) => new mongoose.Types.ObjectId(tag)
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

    // Other fields
    const authorName = formData.get("authorName")?.toString().trim();
    const authorDesignation = formData
      .get("authorDesignation")
      ?.toString()
      .trim();

    const readingTime = formData.get("readingTime")?.toString().trim();
    const edition = formData.get("edition")?.toString().trim();
    const pullQuote = formData.get("pullQuote")?.toString().trim();

    const publicationDateValue = formData
      .get("publicationDate")
      ?.toString();

    let statusValue: "draft" | "published" = "draft";

    const receivedStatus = formData.get("status")?.toString();

    if (receivedStatus) {
      if (
        receivedStatus !== "draft" &&
        receivedStatus !== "published"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Status must be draft or published",
          },
          { status: 400 }
        );
      }

      statusValue = receivedStatus;
    }

    const featuredValue =
      formData.get("featuredOnHomepage")?.toString() || "false";

    const displayOrderValue =
      formData.get("displayOrder")?.toString() || "0";

    const seoTitle = formData.get("seoTitle")?.toString().trim();
    const seoDescription = formData
      .get("seoDescription")
      ?.toString()
      .trim();

    if (!["true", "false"].includes(featuredValue)) {
      return NextResponse.json(
        {
          success: false,
          message: "featuredOnHomepage must be true or false",
        },
        { status: 400 }
      );
    }

    const displayOrder = Number(displayOrderValue);

    if (!Number.isInteger(displayOrder)) {
      return NextResponse.json(
        {
          success: false,
          message: "displayOrder must be an integer",
        },
        { status: 400 }
      );
    }

    let publicationDate: Date | undefined;

    if (publicationDateValue) {
      publicationDate = new Date(publicationDateValue);

      if (Number.isNaN(publicationDate.getTime())) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid publication date",
          },
          { status: 400 }
        );
      }
    }

    // ----------------------------------
    // Cover image
    // ----------------------------------

    let coverImage;

    const coverImageFile = formData.get("coverImage");

    if (
      coverImageFile &&
      coverImageFile instanceof File &&
      coverImageFile.size > 0
    ) {
      coverImage = await uploadToCloudinary(
        coverImageFile,
        "iconisphere/cover-stories/covers"
      );
    }

    // ----------------------------------
    // Additional images
    // ----------------------------------

    const additionalImages = [];

    const additionalImageFiles =
      formData.getAll("additionalImages");

    for (const file of additionalImageFiles) {
      if (file instanceof File && file.size > 0) {
        const uploaded = await uploadToCloudinary(
          file,
          "iconisphere/cover-stories/additional"
        );

        additionalImages.push(uploaded);
      }
    }

    // ----------------------------------
    // Social image
    // ----------------------------------

    let socialImage;

    const socialImageFile = formData.get("socialImage");

    if (
      socialImageFile &&
      socialImageFile instanceof File &&
      socialImageFile.size > 0
    ) {
      socialImage = await uploadToCloudinary(
        socialImageFile,
        "iconisphere/cover-stories/social"
      );
    }

    // ----------------------------------
    // Create document
    // ----------------------------------

    const coverStory = await CoverStory.create({
      title,
      slug,
      subtitle,
      content,

      authorName,
      authorDesignation,
      readingTime,
      edition,

      coverImage,
      additionalImages,
      pullQuote,

      category: categoryValue || undefined,
      tags,

      publicationDate,

      status: statusValue,
      featuredOnHomepage: featuredValue === "true",
      displayOrder,

      seoTitle,
      seoDescription,
      socialImage,
    });

    const populatedStory = await CoverStory.findById(
      coverStory.id
    )
      .populate("category")
      .populate("tags");

    return NextResponse.json(
      {
        success: true,
        message: "Cover story created successfully",
        data: populatedStory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create cover story error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create cover story",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const page = Math.max(
      Number(searchParams.get("page") || 1),
      1
    );

    const limit = Math.min(
      Math.max(
        Number(searchParams.get("limit") || 10),
        1
      ),
      100
    );

    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");

    const query: Record<string, any> = {};

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { subtitle: { $regex: search, $options: "i" } },
        { authorName: { $regex: search, $options: "i" } },
        { edition: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid category ID",
          },
          { status: 400 }
        );
      }

      query.category = category;
    }

    // Status filter
    if (status) {
      if (status !== "draft" && status !== "published") {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid status",
          },
          { status: 400 }
        );
      }

      query.status = status;
    }

    // Featured filter
    if (featured) {
      if (!["true", "false"].includes(featured)) {
        return NextResponse.json(
          {
            success: false,
            message: "featured must be true or false",
          },
          { status: 400 }
        );
      }

      query.featuredOnHomepage = featured === "true";
    }

    const skip = (page - 1) * limit;

    const [coverStories, total] = await Promise.all([
      CoverStory.find(query)
        .populate("category")
        .populate("tags")
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      CoverStory.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: coverStories,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get cover stories error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch cover stories",
      },
      { status: 500 }
    );
  }
}