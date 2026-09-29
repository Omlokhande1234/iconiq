import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import Article from "@/models/Article";
import "@/models/Category";
import "@/models/Tags";


// ============================================================
// GET /api/articles
// ============================================================
//
// Query parameters:
//
// ?status=published
// ?featured=true
// ?category=<categoryId>
// ?limit=10
// ?page=1
//
// Examples:
//
// GET /api/articles
// GET /api/articles?status=published
// GET /api/articles?featured=true
// GET /api/articles?limit=4
//
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 10, 1),
      100
    );

    const skip = (page - 1) * limit;

    // --------------------------------------------------------
    // Build filter
    // --------------------------------------------------------

    const filter: Record<string, unknown> = {};

    if (status) {
      if (!["draft", "published"].includes(status)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid status",
          },
          { status: 400 }
        );
      }

      filter.status = status;
    }

    if (featured !== null) {
      filter.featuredOnHomepage = featured === "true";
    }

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

      filter.category = category;
    }

    // --------------------------------------------------------
    // Fetch articles
    // --------------------------------------------------------

    const [articles, total] = await Promise.all([
      Article.find(filter)
        .populate("category", "name slug")
        .populate("tags", "name slug")
        .sort({
          displayOrder: 1,
          publicationDate: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Article.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,

      articles,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("GET /api/articles error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch articles",
      },
      { status: 500 }
    );
  }
}


// ============================================================
// POST /api/articles
// ============================================================
//
// Creates a new article.
//
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // --------------------------------------------------------
    // Required fields
    // --------------------------------------------------------

    if (!body.title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required",
        },
        { status: 400 }
      );
    }

    if (!body.slug?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug is required",
        },
        { status: 400 }
      );
    }

    if (!body.content?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Content is required",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // Validate category
    // --------------------------------------------------------

    if (
      body.category &&
      !mongoose.Types.ObjectId.isValid(body.category)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category ID",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // Validate tags
    // --------------------------------------------------------

    if (body.tags && !Array.isArray(body.tags)) {
      return NextResponse.json(
        {
          success: false,
          message: "Tags must be an array",
        },
        { status: 400 }
      );
    }

    if (body.tags) {
      const invalidTag = body.tags.some(
        (tag: string) =>
          !mongoose.Types.ObjectId.isValid(tag)
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
    }

    // --------------------------------------------------------
    // Check duplicate slug
    // --------------------------------------------------------

    const existingArticle = await Article.findOne({
      slug: body.slug.trim().toLowerCase(),
    });

    if (existingArticle) {
      return NextResponse.json(
        {
          success: false,
          message: "An article with this slug already exists",
        },
        { status: 409 }
      );
    }

    // --------------------------------------------------------
    // Create article
    // --------------------------------------------------------

    const article = await Article.create({
      title: body.title.trim(),

      slug: body.slug.trim().toLowerCase(),

      category: body.category || undefined,

      excerpt: body.excerpt?.trim(),

      content: body.content,

      // Cloudinary
      featuredImage: body.featuredImage
        ? {
            url: body.featuredImage.url,
            publicId: body.featuredImage.publicId,
            alt: body.featuredImage.alt,
          }
        : undefined,

      authorName: body.authorName?.trim(),

      authorDesignation:
        body.authorDesignation?.trim(),

      authorPhoto: body.authorPhoto
        ? {
            url: body.authorPhoto.url,
            publicId: body.authorPhoto.publicId,
          }
        : undefined,

      readingTime: body.readingTime?.trim(),

      publicationDate: body.publicationDate
        ? new Date(body.publicationDate)
        : undefined,

      tags: body.tags || [],

      status: body.status || "draft",

      featuredOnHomepage:
        body.featuredOnHomepage ?? false,

      displayOrder:
        Number(body.displayOrder) || 0,

      additionalImages:
        body.additionalImages || [],

      seoTitle: body.seoTitle?.trim(),

      seoDescription:
        body.seoDescription?.trim(),

      socialImage: body.socialImage
        ? {
            url: body.socialImage.url,
            publicId: body.socialImage.publicId,
          }
        : undefined,

      // Automatically set publication date
      // when publishing for the first time.
      ...(body.status === "published" &&
      !body.publicationDate
        ? {
            publicationDate: new Date(),
          }
        : {}),
    });

    // --------------------------------------------------------
    // Return populated article
    // --------------------------------------------------------

    const populatedArticle = await Article.findById(
      article._id
    )
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .lean();

    return NextResponse.json(
      {
        success: true,

        message: "Article created successfully",

        article: populatedArticle,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/articles error:", error);

    // Duplicate key error
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "An article with this slug already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create article",
      },
      { status: 500 }
    );
  }
}


// ============================================================
// PATCH /api/articles
// ============================================================
//
// Updates an article.
//
// Body must contain:
//
// {
//   "id": "...",
//   ...fields to update
// }
//
// ============================================================

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Article ID is required",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(body.id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid article ID",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // Build update object
    // --------------------------------------------------------

    const update: Record<string, unknown> = {};

    if (body.title !== undefined) {
      update.title = body.title.trim();
    }

    if (body.slug !== undefined) {
      update.slug = body.slug.trim().toLowerCase();
    }

    if (body.category !== undefined) {
      if (
        body.category &&
        !mongoose.Types.ObjectId.isValid(body.category)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid category ID",
          },
          { status: 400 }
        );
      }

      update.category = body.category || undefined;
    }

    if (body.excerpt !== undefined) {
      update.excerpt = body.excerpt?.trim();
    }

    if (body.content !== undefined) {
      update.content = body.content;
    }

    if (body.featuredImage !== undefined) {
      update.featuredImage = body.featuredImage;
    }

    if (body.authorName !== undefined) {
      update.authorName = body.authorName?.trim();
    }

    if (body.authorDesignation !== undefined) {
      update.authorDesignation =
        body.authorDesignation?.trim();
    }

    if (body.authorPhoto !== undefined) {
      update.authorPhoto = body.authorPhoto;
    }

    if (body.readingTime !== undefined) {
      update.readingTime = body.readingTime?.trim();
    }

    if (body.publicationDate !== undefined) {
      update.publicationDate = body.publicationDate
        ? new Date(body.publicationDate)
        : undefined;
    }

    if (body.tags !== undefined) {
      if (!Array.isArray(body.tags)) {
        return NextResponse.json(
          {
            success: false,
            message: "Tags must be an array",
          },
          { status: 400 }
        );
      }

      update.tags = body.tags;
    }

    if (body.status !== undefined) {
      if (
        !["draft", "published"].includes(body.status)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid status",
          },
          { status: 400 }
        );
      }

      update.status = body.status;

      // Set publication date when publishing
      if (
        body.status === "published" &&
        body.publicationDate === undefined
      ) {
        update.publicationDate = new Date();
      }
    }

    if (body.featuredOnHomepage !== undefined) {
      update.featuredOnHomepage =
        Boolean(body.featuredOnHomepage);
    }

    if (body.displayOrder !== undefined) {
      update.displayOrder = Number(body.displayOrder) || 0;
    }

    if (body.additionalImages !== undefined) {
      update.additionalImages =
        body.additionalImages;
    }

    if (body.seoTitle !== undefined) {
      update.seoTitle = body.seoTitle?.trim();
    }

    if (body.seoDescription !== undefined) {
      update.seoDescription =
        body.seoDescription?.trim();
    }

    if (body.socialImage !== undefined) {
      update.socialImage = body.socialImage;
    }

    // --------------------------------------------------------
    // Update
    // --------------------------------------------------------

    const article = await Article.findByIdAndUpdate(
      body.id,
      {
        $set: update,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .lean();

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          message: "Article not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,

      message: "Article updated successfully",

      article,
    });
  } catch (error: unknown) {
    console.error("PATCH /api/articles error:", error);

    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "An article with this slug already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update article",
      },
      { status: 500 }
    );
  }
}


// ============================================================
// DELETE /api/articles
// ============================================================
//
// Body:
//
// {
//   "id": "article-id"
// }
//
// ============================================================

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Article ID is required",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(body.id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid article ID",
        },
        { status: 400 }
      );
    }

    const article = await Article.findByIdAndDelete(
      body.id
    );

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          message: "Article not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,

      message: "Article deleted successfully",

      articleId: article._id,
    });
  } catch (error) {
    console.error("DELETE /api/articles error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete article",
      },
      { status: 500 }
    );
  }
}