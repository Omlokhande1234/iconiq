import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/mongodb";
import User from "@/models/user";

// ======================================================
// GET USER BY ID
// ======================================================

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

    // --------------------------------------------------
    // Validate ID
    // --------------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Find user
    // --------------------------------------------------

    const user = await User.findById(id)
      .select("-passwordHash");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(
      "Get user error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user",
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
// UPDATE USER
// ======================================================

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

    // --------------------------------------------------
    // Validate ID
    // --------------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Find user
    // --------------------------------------------------

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const body = await req.json();

    const {
      name,
      email,
      password,
      role,
      status,
    } = body;

    // --------------------------------------------------
    // Name
    // --------------------------------------------------

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Name cannot be empty",
          },
          { status: 400 }
        );
      }

      user.name = name.trim();
    }

    // --------------------------------------------------
    // Email
    // --------------------------------------------------

    if (email !== undefined) {
      if (
        typeof email !== "string" ||
        !email.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Email cannot be empty",
          },
          { status: 400 }
        );
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          normalizedEmail
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid email address",
          },
          { status: 400 }
        );
      }

      // Check if another user uses email
      const duplicateUser =
        await User.findOne({
          email: normalizedEmail,
          _id: { $ne: id },
        });

      if (duplicateUser) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Another user already uses this email",
          },
          { status: 409 }
        );
      }

      user.email = normalizedEmail;
    }

    // --------------------------------------------------
    // Password
    // --------------------------------------------------

    if (password !== undefined) {
      if (
        typeof password !== "string" ||
        password.length < 8
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Password must be at least 8 characters long",
          },
          { status: 400 }
        );
      }

      user.passwordHash =
        await bcrypt.hash(
          password,
          12
        );
    }

    // --------------------------------------------------
    // Role
    // --------------------------------------------------

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

      user.role = role;
    }

    // --------------------------------------------------
    // Status
    // --------------------------------------------------

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

      user.status = status;
    }

    // --------------------------------------------------
    // Save
    // --------------------------------------------------

    await user.save();

    // --------------------------------------------------
    // Safe response
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

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: safeUser,
    });
  } catch (error) {
    console.error(
      "Update user error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user",
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
// DELETE USER
// ======================================================

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

    // --------------------------------------------------
    // Validate ID
    // --------------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Find user
    // --------------------------------------------------

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // Delete
    // --------------------------------------------------

    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete user error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete user",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}