import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import HallOfFame from "@/models/HallOfFame";
import Category from "@/models/Category";
import Tag from "@/models/Tags";

import { uploadToCloudinary } from "@/lib/cloudinary-upload";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();

    const name = formData.get("name")?.toString().trim();
    const slug = formData
      .get("slug")
      ?.toString()
      .trim()
      .toLowerCase();

    const content = formData.get("content")?.toString();

    if (!name || !slug || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, slug and content are required",
        },
        { status: 400 }
      );
    }

    // ----------------------------------
    // Duplicate slug
    // ----------------------------------

    const existing = await HallOfFame.findOne({
      slug,
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

    // ----------------------------------
    // Category
    // ----------------------------------

    const categoryValue = formData
      .get("category")
      ?.toString();

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

    // ----------------------------------
    // Tags
    // ----------------------------------

    let tags: mongoose.Types.ObjectId[] = [];

    const tagsValue = formData
      .get("tags")
      ?.toString();

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
          (tag) =>
            !mongoose.Types.ObjectId.isValid(tag)
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

        const existingTags = await Tag.find({
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

        tags = parsedTags.map(
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
    // Other fields
    // ----------------------------------

    const designation = formData
      .get("designation")
      ?.toString()
      .trim();

    const organization = formData
      .get("organization")
      ?.toString()
      .trim();

    const biography = formData
      .get("biography")
      ?.toString();

    const recognitionTitle = formData
      .get("recognitionTitle")
      ?.toString()
      .trim();

    const description = formData
      .get("description")
      ?.toString()
      .trim();

    const pullQuote = formData
      .get("pullQuote")
      ?.toString()
      .trim();

    const recognitionCategory = formData
      .get("recognitionCategory")
      ?.toString()
      .trim();

    // ----------------------------------
    // Year of induction
    // ----------------------------------

    let yearOfInduction:
      | number
      | undefined;

    const yearValue = formData
      .get("yearOfInduction")
      ?.toString();

    if (yearValue) {
      yearOfInduction = Number(yearValue);

      if (!Number.isInteger(yearOfInduction)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "yearOfInduction must be an integer",
          },
          { status: 400 }
        );
      }
    }

    // ----------------------------------
    // Publication date
    // ----------------------------------

    let publicationDate: Date | undefined;

    const publicationDateValue =
      formData
        .get("publicationDate")
        ?.toString();

    if (publicationDateValue) {
      publicationDate = new Date(
        publicationDateValue
      );

      if (
        Number.isNaN(
          publicationDate.getTime()
        )
      ) {
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
    // Status
    // ----------------------------------

    let statusValue:
      | "draft"
      | "published" = "draft";

    const receivedStatus = formData
      .get("status")
      ?.toString();

    if (receivedStatus) {
      if (
        receivedStatus !== "draft" &&
        receivedStatus !== "published"
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

      statusValue = receivedStatus;
    }

    // ----------------------------------
    // Featured
    // ----------------------------------

    let featuredOnHomepage = false;

    const featuredValue = formData
      .get("featuredOnHomepage")
      ?.toString();

    if (featuredValue) {
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

      featuredOnHomepage =
        featuredValue === "true";
    }

    // ----------------------------------
    // Display order
    // ----------------------------------

    let displayOrder = 0;

    const displayOrderValue =
      formData
        .get("displayOrder")
        ?.toString();

    if (displayOrderValue) {
      displayOrder = Number(
        displayOrderValue
      );

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
    }

    // ----------------------------------
    // SEO
    // ----------------------------------

    const seoTitle = formData
      .get("seoTitle")
      ?.toString()
      .trim();

    const seoDescription = formData
      .get("seoDescription")
      ?.toString()
      .trim();

    // ----------------------------------
    // Profile photo
    // ----------------------------------

    let profilePhoto;

    const profilePhotoFile =
      formData.get("profilePhoto");

    if (
      profilePhotoFile &&
      profilePhotoFile instanceof File &&
      profilePhotoFile.size > 0
    ) {
      profilePhoto =
        await uploadToCloudinary(
          profilePhotoFile,
          "iconisphere/hall-of-fame/profile"
        );
    }

    // ----------------------------------
    // Additional images
    // ----------------------------------

    const additionalImages = [];

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
            "iconisphere/hall-of-fame/additional"
          );

        additionalImages.push(uploaded);
      }
    }

    // ----------------------------------
    // Social image
    // ----------------------------------

    let socialImage;

    const socialImageFile =
      formData.get("socialImage");

    if (
      socialImageFile &&
      socialImageFile instanceof File &&
      socialImageFile.size > 0
    ) {
      socialImage =
        await uploadToCloudinary(
          socialImageFile,
          "iconisphere/hall-of-fame/social"
        );
    }

    // ----------------------------------
    // Create
    // ----------------------------------

    const hallOfFame =
      await HallOfFame.create({
        name,
        slug,
        designation,
        organization,

        profilePhoto,
        biography,

        recognitionTitle,
        description,
        content,

        additionalImages,
        pullQuote,

        yearOfInduction,
        recognitionCategory,

        category:
          categoryValue || undefined,

        tags,

        publicationDate,

        status: statusValue,
        featuredOnHomepage,
        displayOrder,

        seoTitle,
        seoDescription,
        socialImage,
      });

    const populatedEntry =
      await HallOfFame.findById(
        hallOfFame.id
      )
        .populate("category")
        .populate("tags");

    return NextResponse.json(
      {
        success: true,
        message:
          "Hall of Fame entry created successfully",
        data: populatedEntry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create Hall of Fame error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create Hall of Fame entry",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } =
      new URL(req.url);

    const page = Math.max(
      Number(
        searchParams.get("page") || 1
      ),
      1
    );

    const limit = Math.min(
      Math.max(
        Number(
          searchParams.get("limit") || 10
        ),
        1
      ),
      100
    );

    const search = searchParams
      .get("search")
      ?.trim();

    const category =
      searchParams.get("category");

    const status =
      searchParams.get("status");

    const featured =
      searchParams.get("featured");

    const recognitionCategory =
      searchParams.get(
        "recognitionCategory"
      );

    const yearOfInduction =
      searchParams.get(
        "yearOfInduction"
      );

    // Keep query simple to avoid
    // Mongoose FilterQuery typing issues.
    const query: Record<string, any> =
      {};

    // ----------------------------------
    // Search
    // ----------------------------------

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          designation: {
            $regex: search,
            $options: "i",
          },
        },
        {
          organization: {
            $regex: search,
            $options: "i",
          },
        },
        {
          recognitionTitle: {
            $regex: search,
            $options: "i",
          },
        },
        {
          recognitionCategory: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // ----------------------------------
    // Category
    // ----------------------------------

    if (category) {
      if (
        !mongoose.Types.ObjectId.isValid(
          category
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

      query.category = category;
    }

    // ----------------------------------
    // Status
    // ----------------------------------

    if (status) {
      if (
        status !== "draft" &&
        status !== "published"
      ) {
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

    // ----------------------------------
    // Featured
    // ----------------------------------

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

    // ----------------------------------
    // Recognition category
    // ----------------------------------

    if (recognitionCategory) {
      query.recognitionCategory =
        recognitionCategory;
    }

    // ----------------------------------
    // Year
    // ----------------------------------

    if (yearOfInduction) {
      const year = Number(
        yearOfInduction
      );

      if (!Number.isInteger(year)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "yearOfInduction must be an integer",
          },
          { status: 400 }
        );
      }

      query.yearOfInduction = year;
    }

    // ----------------------------------
    // Pagination
    // ----------------------------------

    const skip =
      (page - 1) * limit;

    const [
      entries,
      total,
    ] = await Promise.all([
      HallOfFame.find(query)
        .populate("category")
        .populate("tags")
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      HallOfFame.countDocuments(query),
    ]);

    const totalPages =
      Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: entries,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage:
          page < totalPages,
        hasPreviousPage:
          page > 1,
      },
    });
  } catch (error) {
    console.error(
      "Get Hall of Fame error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch Hall of Fame entries",
      },
      { status: 500 }
    );
  }
}