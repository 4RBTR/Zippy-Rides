"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/actions/auth";
import type { ActionResponse } from "@/types";

export async function createJournalEntry(
  vehicleId: string,
  data: {
    type: "SYMPTOM" | "MODIFICATION" | "GENERAL";
    title: string;
    description?: string;
  }
): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const vehicle = await prisma.vehicle.findFirst({
    where: { id: vehicleId, userId: user.id },
  });
  if (!vehicle) return { success: false, error: "Vehicle not found." };

  if (!data.title || !data.type) {
    return { success: false, error: "Title and type are required." };
  }

  try {
    await prisma.vehicleJournal.create({
      data: {
        vehicleId,
        type: data.type,
        title: data.title,
        description: data.description || null,
      },
    });

    revalidatePath(`/garage/${vehicleId}`);
    return { success: true };
  } catch (err) {
    console.error("Create journal entry error:", err);
    return { success: false, error: "Failed to create journal entry." };
  }
}

export async function deleteJournalEntry(
  journalId: string,
  vehicleId: string
): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const journal = await prisma.vehicleJournal.findFirst({
    where: { id: journalId, vehicle: { userId: user.id } },
  });
  if (!journal) return { success: false, error: "Journal entry not found." };

  try {
    await prisma.vehicleJournal.delete({ where: { id: journalId } });
    revalidatePath(`/garage/${vehicleId}`);
    return { success: true };
  } catch (err) {
    console.error("Delete journal entry error:", err);
    return { success: false, error: "Failed to delete journal entry." };
  }
}
