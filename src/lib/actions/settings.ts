"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/actions/auth";
import type { ActionResponse } from "@/types";

export async function updateProfile(
  userId: string,
  name: string
): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user || user.id !== userId) {
    return { success: false, error: "Unauthorized." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name: name || null },
    });

    revalidatePath("/settings");
    revalidatePath("/garage");
    return { success: true };
  } catch (err) {
    console.error("Update profile error:", err);
    return { success: false, error: "Failed to update profile." };
  }
}
