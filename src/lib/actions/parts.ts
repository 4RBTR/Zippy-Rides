"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/actions/auth";
import { uploadReceiptImage } from "@/lib/supabase/storage";
import type { ActionResponse } from "@/types";

export async function createPartInterval(
  vehicleId: string,
  data: { partName: string; intervalKm: number }
): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized." };

  // Verify vehicle ownership
  const vehicle = await prisma.vehicle.findFirst({
    where: { id: vehicleId, userId: user.id },
  });
  if (!vehicle) return { success: false, error: "Vehicle not found." };

  if (!data.partName || !data.intervalKm) {
    return { success: false, error: "Part name and interval are required." };
  }

  try {
    await prisma.partInterval.create({
      data: {
        vehicleId,
        partName: data.partName,
        intervalKm: data.intervalKm,
      },
    });

    revalidatePath(`/garage/${vehicleId}`);
    revalidatePath("/garage");
    return { success: true };
  } catch (err) {
    console.error("Create part interval error:", err);
    return { success: false, error: "Failed to create part interval." };
  }
}

export async function deletePartInterval(
  partIntervalId: string,
  vehicleId: string
): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized." };

  // Verify ownership through vehicle
  const interval = await prisma.partInterval.findFirst({
    where: { id: partIntervalId, vehicle: { userId: user.id } },
  });
  if (!interval) return { success: false, error: "Part interval not found." };

  try {
    await prisma.partInterval.delete({ where: { id: partIntervalId } });
    revalidatePath(`/garage/${vehicleId}`);
    revalidatePath("/garage");
    return { success: true };
  } catch (err) {
    console.error("Delete part interval error:", err);
    return { success: false, error: "Failed to delete part interval." };
  }
}

export async function logService(
  vehicleId: string,
  data: {
    currentMileage: number;
    parts: Array<{
      partIntervalId: string;
      cost: number;
    }>;
  },
  receiptFormData?: FormData
): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const vehicle = await prisma.vehicle.findFirst({
    where: { id: vehicleId, userId: user.id },
  });
  if (!vehicle) return { success: false, error: "Vehicle not found." };

  // Handle receipt upload
  let receiptUrl: string | null = null;
  if (receiptFormData) {
    const receiptFile = receiptFormData.get("receipt") as File | null;
    if (receiptFile && receiptFile.size > 0) {
      receiptUrl = await uploadReceiptImage(receiptFile);
    }
  }

  try {
    // Update vehicle mileage
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { currentMileage: data.currentMileage },
    });

    // Create replacement records for each serviced part
    if (data.parts.length > 0) {
      await prisma.partReplacement.createMany({
        data: data.parts.map((part) => ({
          partIntervalId: part.partIntervalId,
          replacedAtKm: data.currentMileage,
          cost: part.cost,
          receiptImageUrl: receiptUrl,
        })),
      });
    }

    revalidatePath(`/garage/${vehicleId}`);
    revalidatePath("/garage");
    revalidatePath("/analytics");
    return { success: true };
  } catch (err) {
    console.error("Log service error:", err);
    return { success: false, error: "Failed to log service." };
  }
}
