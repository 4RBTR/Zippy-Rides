"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { ActionResponse } from "@/types";

export async function signUp(formData: FormData): Promise<ActionResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Create the User record in our database (non-blocking)
    if (data.user) {
      try {
        await prisma.user.upsert({
          where: { id: data.user.id },
          update: {},
          create: {
            id: data.user.id,
            email: data.user.email!,
            name: name || null,
          },
        });
      } catch (err) {
        console.error("Failed to create user record:", err);
        // Don't fail the auth — user record will be created on next login
      }
    }

    return { success: true };
  } catch (err) {
    console.error("Sign up error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function signIn(formData: FormData): Promise<ActionResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Ensure user record exists in our database (non-blocking)
    if (data.user) {
      try {
        await prisma.user.upsert({
          where: { id: data.user.id },
          update: { email: data.user.email! },
          create: {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name || null,
          },
        });
      } catch (err) {
        console.error("Failed to upsert user record:", err);
        // Don't fail the auth — user can still proceed
      }
    }

    return { success: true };
  } catch (err) {
    console.error("Sign in error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/** Get the currently authenticated user or null */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}
