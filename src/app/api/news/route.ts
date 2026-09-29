import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import News from "@/models/News";
import Category from "@/models/Category";
import Tag from "@/models/Tags";

import { uploadToCloudinary } from "@/lib/cloudinary-upload";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();

    const title = formData.get("title")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim().toLowerCase();
    const excerpt = formData.get("excerpt")?.toString().trim();
    const content = formData.get("content")?.toString();

    const authorName = formData.get("authorName")?.toString().trim();
    const authorDesignation = formData
      .get("authorDesignation")
      ?.toString()
      .trim();
    const readingTime = formData.get("readingTime")?.toString().trim();

    const publicationDate = formData
      .get("publicationDate")
      ?.toString();

    const seoTitle = formData.get("seoTitle")?.toString().trim();
    const seoDescription = formData
      .get("seoDescription")
      ?.toString()
      .trim();

    if (!title || !slug || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, slug and content are required",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Check duplicate slug
    // --------------------------------------------------

    const existingNews = await News.findOne({ slug });

    if (existingNews) {
      return NextResponse.json(
        {
          success: false,
          message: "News with this slug already exists",
        },
        { status: 409 }
      );
    }

    // --------------------------------------------------
    // Category
    // --------------------------------------------------

    let category: mongoose.Types.ObjectId | undefined;

    const categoryValue = formData.get("category")?.toString();

    if (categoryValue) {
      if (!mongoose.Types.ObjectId.isValid(categoryValue)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid category ID",
          },
          { status: 400 }
        );
      }

      const categoryExists = await Category.findById(categoryValue);

      if (!categoryExists) {
        return NextResponse.json(
          {
            success: false,
            message: "Category not found",
          },
          { status: 404 }
        );
      }

      category = new mongoose.Types.ObjectId(categoryValue);
    }

    // --------------------------------------------------
    // Tags
    // --------------------------------------------------

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

        for (const tagId of parsedTags) {
          if (!mongoose.Types.ObjectId.isValid(tagId)) {
            return NextResponse.json(
              {
                success: false,
                message: `Invalid tag ID: ${tagId}`,
              },
              { status: 400 }
            );
          }

          const tagExists = await Tag.findById(tagId);

          if (!tagExists) {
            return NextResponse.json(
              {
                success: false,
                message: `Tag not found: ${tagId}`,
              },
              { status: 404 }
            );
          }

          tags.push(new mongoose.Types.ObjectId(tagId));
        }
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

    // --------------------------------------------------
    // Featured
    // --------------------------------------------------

    let featuredOnHomepage = false;

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

      featuredOnHomepage = featuredValue === "true";
    }

    // --------------------------------------------------
    // Display order
    // --------------------------------------------------

    let displayOrder = 0;

    const displayOrderValue = formData
      .get("displayOrder")
      ?.toString();

    if (displayOrderValue) {
      displayOrder = Number(displayOrderValue);

      if (!Number.isInteger(displayOrder)) {
        return NextResponse.json(
          {
            success: false,
            message: "displayOrder must be an integer",
          },
          { status: 400 }
        );
      }
    }

    // --------------------------------------------------
    // Featured image
    // --------------------------------------------------

    let featuredImage;

    const featuredImageFile = formData.get("featuredImage");

    if (
      featuredImageFile instanceof File &&
      featuredImageFile.size > 0
    ) {
      featuredImage = await uploadToCloudinary(
        featuredImageFile,
        "iconisphere/news/featured"
      );
    }

    // --------------------------------------------------
    // Additional images
    // --------------------------------------------------

    const additionalImages = [];

    const additionalImageFiles =
      formData.getAll("additionalImages");

    for (const file of additionalImageFiles) {
      if (file instanceof File && file.size > 0) {
        const uploaded = await uploadToCloudinary(
          file,
          "iconisphere/news/additional"
        );

        additionalImages.push(uploaded);
      }
    }

    // --------------------------------------------------
    // Social image
    // --------------------------------------------------

    let socialImage;

    const socialImageFile = formData.get("socialImage");

    if (
      socialImageFile instanceof File &&
      socialImageFile.size > 0
    ) {
      socialImage = await uploadToCloudinary(
        socialImageFile,
        "iconisphere/news/social"
      );
    }

    // --------------------------------------------------
    // Create News
    // --------------------------------------------------

    const news = await News.create({
      title,
      slug,
      category,
      excerpt,
      content,

      featuredImage,
      additionalImages,

      authorName,
      authorDesignation,
      readingTime,

      publicationDate: publicationDate
        ? new Date(publicationDate)
        : undefined,

      tags,

      status: statusValue,
      featuredOnHomepage,
      displayOrder,

      seoTitle,
      seoDescription,
      socialImage,
    });

    const populatedNews = await News.findById(news.id)
      .populate("category")
      .populate("tags");

    return NextResponse.json(
      {
        success: true,
        message: "News created successfully",
        data: populatedNews,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create news error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create news",
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
// GET ALL NEWS
// ======================================================

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(searchParams.get("limit")) || 10,
        1
      ),
      100
    );

    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");

    const query: Record<string, any> = {};

    // --------------------------------------------------
    // Search
    // --------------------------------------------------

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          excerpt: {
            $regex: search,
            $options: "i",
          },
        },
        {
          authorName: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // --------------------------------------------------
    // Category filter
    // --------------------------------------------------

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

      query.category = new mongoose.Types.ObjectId(category);
    }

    // --------------------------------------------------
    // Status filter
    // --------------------------------------------------

    if (status) {
      if (
        status !== "draft" &&
        status !== "published"
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

      query.status = status;
    }

    // --------------------------------------------------
    // Featured filter
    // --------------------------------------------------

    if (featured) {
      if (
        featured !== "true" &&
        featured !== "false"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "featured must be true or false",
          },
          { status: 400 }
        );
      }

      query.featuredOnHomepage =
        featured === "true";
    }

    // --------------------------------------------------
    // Pagination
    // --------------------------------------------------

    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      News.find(query)
        .populate("category")
        .populate("tags")
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      News.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: news,
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