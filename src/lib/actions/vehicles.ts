"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/actions/auth";
import { uploadVehicleImage } from "@/lib/supabase/storage";
import type { ActionResponse } from "@/types";

/** Safely parse a date string — returns null if empty or invalid */
function parseDate(value: string | null | undefined): Date | null {
  if (!value || value.trim() === "") return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

export async function createVehicle(
  formData: FormData
): Promise<ActionResponse<{ id: string }>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const name = formData.get("name") as string;
  const type = formData.get("type") as "MOTOR" | "MOBIL";
  const currentMileage = parseInt(formData.get("currentMileage") as string) || 0;
  const annualTaxDate = formData.get("annualTaxDate") as string;
  const fiveYearTaxDate = formData.get("fiveYearTaxDate") as string;
  const imageFile = formData.get("image") as File | null;

  if (!name || !type) {
    return { success: false, error: "Name and type are required." };
  }

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadVehicleImage(imageFile);
  }

  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        userId: user.id,
        name,
        type,
        currentMileage,
        imageUrl,
        annualTaxDate: parseDate(annualTaxDate),
        fiveYearTaxDate: parseDate(fiveYearTaxDate),
      },
    });

    revalidatePath("/garage");
    return { success: true, data: { id: vehicle.id } };
  } catch (err) {
    console.error("Create vehicle error:", err);
    return { success: false, error: "Failed to create vehicle." };
  }
}

export async function updateVehicle(
  vehicleId: string,
  formData: FormData
): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized." };

  // Verify ownership
  const existing = await prisma.vehicle.findFirst({
    where: { id: vehicleId, userId: user.id },
  });
  if (!existing) return { success: false, error: "Vehicle not found." };

  const name = formData.get("name") as string;
  const type = formData.get("type") as "MOTOR" | "MOBIL";
  const currentMileage = parseInt(formData.get("currentMileage") as string) || 0;
  const annualTaxDate = formData.get("annualTaxDate") as string;
  const fiveYearTaxDate = formData.get("fiveYearTaxDate") as string;
  const imageFile = formData.get("image") as File | null;

  let imageUrl = existing.imageUrl;
  if (imageFile && imageFile.size > 0) {
    const uploaded = await uploadVehicleImage(imageFile);
    if (uploaded) imageUrl = uploaded;
  }

  // Use parsed date or keep existing; if field is explicitly empty, set to null
  const parsedAnnual = annualTaxDate !== undefined
    ? (annualTaxDate.trim() === "" ? null : parseDate(annualTaxDate))
    : existing.annualTaxDate;
  const parsedFiveYear = fiveYearTaxDate !== undefined
    ? (fiveYearTaxDate.trim() === "" ? null : parseDate(fiveYearTaxDate))
    : existing.fiveYearTaxDate;

  try {
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        name: name || existing.name,
        type: type || existing.type,
        currentMileage,
        imageUrl,
        annualTaxDate: parsedAnnual,
        fiveYearTaxDate: parsedFiveYear,
      },
    });

    revalidatePath("/garage");
    revalidatePath(`/garage/${vehicleId}`);
    return { success: true };
  } catch (err) {
    console.error("Update vehicle error:", err);
    return { success: false, error: "Failed to update vehicle." };
  }
}

export async function updateMileage(
  vehicleId: string,
  newMileage: number
): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const existing = await prisma.vehicle.findFirst({
    where: { id: vehicleId, userId: user.id },
  });
  if (!existing) return { success: false, error: "Vehicle not found." };

  try {
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { currentMileage: newMileage },
    });

    revalidatePath("/garage");
    revalidatePath(`/garage/${vehicleId}`);
    return { success: true };
  } catch (err) {
    console.error("Update mileage error:", err);
    return { success: false, error: "Failed to update mileage." };
  }
}

export async function deleteVehicle(
  vehicleId: string
): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const existing = await prisma.vehicle.findFirst({
    where: { id: vehicleId, userId: user.id },
  });
  if (!existing) return { success: false, error: "Vehicle not found." };

  try {
    await prisma.vehicle.delete({ where: { id: vehicleId } });
    revalidatePath("/garage");
    return { success: true };
  } catch (err) {
    console.error("Delete vehicle error:", err);
    return { success: false, error: "Failed to delete vehicle." };
  }
}

export async function getUserVehicles() {
  const user = await getCurrentUser();
  if (!user) return [];

  return prisma.vehicle.findMany({
    where: { userId: user.id },
    include: {
      partIntervals: {
        include: { replacements: { orderBy: { replacedAt: "desc" } } },
      },
      journals: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getVehicleById(vehicleId: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  return prisma.vehicle.findFirst({
    where: { id: vehicleId, userId: user.id },
    include: {
      partIntervals: {
        include: { replacements: { orderBy: { replacedAt: "desc" } } },
        orderBy: { createdAt: "asc" },
      },
      journals: { orderBy: { createdAt: "desc" } },
    },
  });
}
