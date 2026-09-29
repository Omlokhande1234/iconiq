import {
  NextRequest,
  NextResponse,
} from "next/server";

import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/lib/cloudinary-upload";

export const runtime = "nodejs";


/**
 * GET /api/categories/:id
 */
export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await connectDB();

    const { id } =
      await params;

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
            "Invalid category ID",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Find category
    // -----------------------------------------

    const category =
      await Category.findById(id)
        .lean();

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Category not found",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------
    // Response
    // -----------------------------------------

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(
      "Get category error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch category",
      },
      { status: 500 }
    );
  }
}


/**
 * PUT /api/categories/:id
 *
 * Update category.
 *
 * Content-Type:
 * multipart/form-data
 */
export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await connectDB();

    const { id } =
      await params;

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
            "Invalid category ID",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Find category
    // -----------------------------------------

    const category =
      await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Category not found",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------
    // Form data
    // -----------------------------------------

    const formData =
      await req.formData();

    const name =
      formData.get("name");

    const slug =
      formData.get("slug");

    const description =
      formData.get("description");

    const content =
      formData.get("content");

    const status =
      formData.get("status");

    const featured =
      formData.get("featured");

    const displayOrder =
      formData.get("displayOrder");

    const seoTitle =
      formData.get("seoTitle");

    const seoDescription =
      formData.get(
        "seoDescription"
      );

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

      category.name =
        newName;
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

      // Only check if slug changed
      if (
        newSlug !==
        category.slug
      ) {
        const existingCategory =
          await Category.findOne({
            slug: newSlug,
            _id: {
              $ne: id,
            },
          });

        if (existingCategory) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Another category already uses this slug",
            },
            { status: 409 }
          );
        }

        category.slug =
          newSlug;
      }
    }

    // -----------------------------------------
    // Description
    // -----------------------------------------

    if (
      description !== null
    ) {
      category.description =
        description
          .toString()
          .trim() ||
        undefined;
    }

    // -----------------------------------------
    // Content
    // -----------------------------------------

    if (content !== null) {
      category.content =
        content.toString() ||
        undefined;
    }

    // -----------------------------------------
    // Status
    // -----------------------------------------

    if (status !== null) {
      const newStatus =
        status.toString();

      if (
        newStatus !== "active" &&
        newStatus !== "inactive"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Status must be either 'active' or 'inactive'",
          },
          { status: 400 }
        );
      }

      category.status =
        newStatus;
    }

    // -----------------------------------------
    // Featured
    // -----------------------------------------

    if (
      featured !== null
    ) {
      const featuredValue =
        featured
          .toString()
          .toLowerCase();

      if (
        featuredValue !==
          "true" &&
        featuredValue !==
          "false"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Featured must be true or false",
          },
          { status: 400 }
        );
      }

      category.featured =
        featuredValue ===
        "true";
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
        category.displayOrder =
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

        category.displayOrder =
          parsedValue;
      }
    }

    // -----------------------------------------
    // SEO title
    // -----------------------------------------

    if (
      seoTitle !== null
    ) {
      category.seoTitle =
        seoTitle
          .toString()
          .trim() ||
        undefined;
    }

    // -----------------------------------------
    // SEO description
    // -----------------------------------------

    if (
      seoDescription !== null
    ) {
      category.seoDescription =
        seoDescription
          .toString()
          .trim() ||
        undefined;
    }

    // -----------------------------------------
    // Icon
    // -----------------------------------------

    const iconFile =
      formData.get("icon");

    if (
      iconFile instanceof File &&
      iconFile.size > 0
    ) {
      // Delete old icon
      if (
        category.icon?.publicId
      ) {
        try {
          await deleteFromCloudinary(
            category.icon.publicId
          );
        } catch (error) {
          console.error(
            "Failed to delete old category icon:",
            error
          );
        }
      }

      // Upload new icon
      const result =
        await uploadToCloudinary(
          iconFile,
          "iconisphere/categories/icons"
        );

      category.icon = {
        url: result.url,
        publicId:
          result.publicId,
      };
    }

    // -----------------------------------------
    // Cover image
    // -----------------------------------------

    const coverImageFile =
      formData.get(
        "coverImage"
      );

    if (
      coverImageFile instanceof File &&
      coverImageFile.size > 0
    ) {
      // Delete old cover image
      if (
        category.coverImage
          ?.publicId
      ) {
        try {
          await deleteFromCloudinary(
            category.coverImage
              .publicId
          );
        } catch (error) {
          console.error(
            "Failed to delete old category cover image:",
            error
          );
        }
      }

      // Upload new cover image
      const result =
        await uploadToCloudinary(
          coverImageFile,
          "iconisphere/categories/covers"
        );

      category.coverImage = {
        url: result.url,
        publicId:
          result.publicId,
      };
    }

    // -----------------------------------------
    // Social image
    // -----------------------------------------

    const socialImageFile =
      formData.get(
        "socialImage"
      );

    if (
      socialImageFile instanceof File &&
      socialImageFile.size > 0
    ) {
      // Delete old social image
      if (
        category.socialImage
          ?.publicId
      ) {
        try {
          await deleteFromCloudinary(
            category.socialImage
              .publicId
          );
        } catch (error) {
          console.error(
            "Failed to delete old category social image:",
            error
          );
        }
      }

      // Upload new social image
      const result =
        await uploadToCloudinary(
          socialImageFile,
          "iconisphere/categories/social"
        );

      category.socialImage = {
        url: result.url,
        publicId:
          result.publicId,
      };
    }

    // -----------------------------------------
    // Save
    // -----------------------------------------

    await category.save();

    // -----------------------------------------
    // Fetch updated category
    // -----------------------------------------

    const updatedCategory =
      await Category.findById(
        id
      ).lean();

    // -----------------------------------------
    // Response
    // -----------------------------------------

    return NextResponse.json({
      success: true,
      message:
        "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error(
      "Update category error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update category",
      },
      { status: 500 }
    );
  }
}


/**
 * DELETE /api/categories/:id
 *
 * Deletes:
 * 1. Cloudinary icon
 * 2. Cloudinary cover image
 * 3. Cloudinary social image
 * 4. MongoDB category
 */
export async function DELETE(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await connectDB();

    const { id } =
      await params;

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
            "Invalid category ID",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // Find category
    // -----------------------------------------

    const category =
      await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Category not found",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------
    // Delete icon
    // -----------------------------------------

    if (
      category.icon?.publicId
    ) {
      try {
        await deleteFromCloudinary(
          category.icon.publicId
        );
      } catch (error) {
        console.error(
          "Failed to delete category icon:",
          error
        );
      }
    }

    // -----------------------------------------
    // Delete cover image
    // -----------------------------------------

    if (
      category.coverImage
        ?.publicId
    ) {
      try {
        await deleteFromCloudinary(
          category.coverImage
            .publicId
        );
      } catch (error) {
        console.error(
          "Failed to delete category cover image:",
          error
        );
      }
    }

    // -----------------------------------------
    // Delete social image
    // -----------------------------------------

    if (
      category.socialImage
        ?.publicId
    ) {
      try {
        await deleteFromCloudinary(
          category.socialImage
            .publicId
        );
      } catch (error) {
        console.error(
          "Failed to delete category social image:",
          error
        );
      }
    }

    // -----------------------------------------
    // Delete MongoDB document
    // -----------------------------------------

    await Category.findByIdAndDelete(
      id
    );

    // -----------------------------------------
    // Response
    // -----------------------------------------

    return NextResponse.json({
      success: true,
      message:
        "Category and associated images deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete category error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete category",
      },
      { status: 500 }
    );
  }
}