import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/mongodb";
import User from "@/models/user";

// ======================================================
// CREATE USER
// ======================================================

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    const {
      name,
      email,
      password,
      role,
      status,
    } = body;

    // --------------------------------------------------
    // Required fields
    // --------------------------------------------------

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, email and password are required",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Normalize email
    // --------------------------------------------------

    const normalizedEmail =
      String(email).trim().toLowerCase();

    // --------------------------------------------------
    // Validate email
    // --------------------------------------------------

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Password validation
    // --------------------------------------------------

    if (String(password).length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Validate role
    // --------------------------------------------------

    let roleValue: "admin" | "editor" = "admin";

    if (role !== undefined) {
      if (
        role !== "admin" &&
        role !== "editor"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Role must be admin or editor",
          },
          { status: 400 }
        );
      }

      roleValue = role;
    }

    // --------------------------------------------------
    // Validate status
    // --------------------------------------------------

    let statusValue: "active" | "inactive" =
      "active";

    if (status !== undefined) {
      if (
        status !== "active" &&
        status !== "inactive"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Status must be active or inactive",
          },
          { status: 400 }
        );
      }

      statusValue = status;
    }

    // --------------------------------------------------
    // Check duplicate email
    // --------------------------------------------------

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A user with this email already exists",
        },
        { status: 409 }
      );
    }

    // --------------------------------------------------
    // Hash password
    // --------------------------------------------------

    const passwordHash =
      await bcrypt.hash(password, 12);

    // --------------------------------------------------
    // Create user
    // --------------------------------------------------

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
      role: roleValue,
      status: statusValue,
    });

    // --------------------------------------------------
    // Remove passwordHash from response
    // --------------------------------------------------

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: safeUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create user",
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
// GET USERS
// ======================================================

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } =
      new URL(req.url);

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

    const search =
      searchParams.get("search")?.trim();

    const role =
      searchParams.get("role");

    const status =
      searchParams.get("status");

    const query: Record<string, any> = {};

    // --------------------------------------------------
    // Search
    // --------------------------------------------------

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // --------------------------------------------------
    // Role filter
    // --------------------------------------------------

    if (role) {
      if (
        role !== "admin" &&
        role !== "editor"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Role must be admin or editor",
          },
          { status: 400 }
        );
      }

      query.role = role;
    }

    // --------------------------------------------------
    // Status filter
    // --------------------------------------------------

    if (status) {
      if (
        status !== "active" &&
        status !== "inactive"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Status must be active or inactive",
          },
          { status: 400 }
        );
      }

      query.status = status;
    }

    // --------------------------------------------------
    // Pagination
    // --------------------------------------------------

    const skip = (page - 1) * limit;

    const [users, total] =
      await Promise.all([
        User.find(query)
          .select(
            "-passwordHash"
          )
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit),

        User.countDocuments(query),
      ]);

    const totalPages =
      Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: users,
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
    console.error("Get users error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}