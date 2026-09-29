import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import Article from "@/models/Article";
import "@/models/Category";
import "@/models/Tags";

// ============================================================
// GET /api/articles/[slug]
// Get one article by slug
// ============================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const article = await Article.findOne({
      slug: slug.toLowerCase(),
      status: "published",
    })
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
      article,
    });
  } catch (error) {
    console.error("GET /api/articles/[slug] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch article",
      },
      { status: 500 }
    );
  }
}


// ============================================================
// PATCH /api/articles/[slug]
// Update one article
// ============================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const body = await request.json();

    const article = await Article.findOne({
      slug: slug.toLowerCase(),
    });

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          message: "Article not found",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------------
    // Update only fields that were provided
    // --------------------------------------------------------

    if (body.title !== undefined) {
      article.title = body.title.trim();
    }

    if (body.slug !== undefined) {
      article.slug = body.slug.trim().toLowerCase();
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

      article.category = body.category || undefined;
    }

    if (body.excerpt !== undefined) {
      article.excerpt = body.excerpt?.trim();
    }

    if (body.content !== undefined) {
      article.content = body.content;
    }

    if (body.featuredImage !== undefined) {
      article.featuredImage = body.featuredImage;
    }

    if (body.authorName !== undefined) {
      article.authorName = body.authorName?.trim();
    }

    if (body.authorDesignation !== undefined) {
      article.authorDesignation =
        body.authorDesignation?.trim();
    }

    if (body.authorPhoto !== undefined) {
      article.authorPhoto = body.authorPhoto;
    }

    if (body.readingTime !== undefined) {
      article.readingTime =
        body.readingTime?.trim();
    }

    if (body.publicationDate !== undefined) {
      article.publicationDate = body.publicationDate
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

      article.tags = body.tags;
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

      article.status = body.status;

      if (
        body.status === "published" &&
        !article.publicationDate
      ) {
        article.publicationDate = new Date();
      }
    }

    if (body.featuredOnHomepage !== undefined) {
      article.featuredOnHomepage =
        Boolean(body.featuredOnHomepage);
    }

    if (body.displayOrder !== undefined) {
      article.displayOrder =
        Number(body.displayOrder) || 0;
    }

    if (body.additionalImages !== undefined) {
      article.additionalImages =
        body.additionalImages;
    }

    if (body.seoTitle !== undefined) {
      article.seoTitle = body.seoTitle?.trim();
    }

    if (body.seoDescription !== undefined) {
      article.seoDescription =
        body.seoDescription?.trim();
    }

    if (body.socialImage !== undefined) {
      article.socialImage = body.socialImage;
    }

    await article.save();

    const updatedArticle = await Article.findById(
      article._id
    )
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .lean();

    return NextResponse.json({
      success: true,
      message: "Article updated successfully",
      article: updatedArticle,
    });
  } catch (error: unknown) {
    console.error(
      "PATCH /api/articles/[slug] error:",
      error
    );

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
// DELETE /api/articles/[slug]
// Delete one article
// ============================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const article = await Article.findOneAndDelete({
      slug: slug.toLowerCase(),
    });

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
    console.error(
      "DELETE /api/articles/[slug] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete article",
      },
      { status: 500 }
    );
  }
}