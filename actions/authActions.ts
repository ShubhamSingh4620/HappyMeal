"use server";

import bcrypt from "bcrypt";
import { validateSignupForm } from "@/utils/validators";
import { SignupFormData, FormState } from "@/types/auth";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export async function SignupAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const data: SignupFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as unknown as Role,
    };

    const errors = validateSignupForm(data);

    if (Object.keys(errors).length > 0) {
      return { errors, success: false };
    }

    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        errors: {
          general: ["A user with this email already exists"],
        },
        success: false,
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });

    // Return success with credentials for client-side signin
    return {
      success: true,
      credentials: {
        email: data.email,
        password: data.password,
      },
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      errors: {
        general: ["An unexpected error occurred. Please try again."],
      },
      success: false,
    };
  }
}
