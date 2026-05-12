import { Suspense } from "react";
import { Car } from "lucide-react";
import { getUserVehicles } from "@/lib/actions/vehicles";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { AddVehicleDialog } from "@/components/vehicles/add-vehicle-dialog";
import type { VehicleWithParts } from "@/types";

export const metadata = {
  title: "Garage — Zippy Rides",
  description: "Manage and monitor all your vehicles in one place.",
};

export default async function GaragePage() {
  const vehicles = (await getUserVehicles()) as VehicleWithParts[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Garage</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <AddVehicleDialog />
      </div>

      {/* Vehicle grid */}
      {vehicles.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 p-16 text-center">
          <div className="rounded-2xl bg-primary/10 p-4 mb-4">
            <Car className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">No vehicles yet</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Add your first vehicle to start tracking maintenance, parts, and
            expenses.
          </p>
          <div className="mt-6">
            <AddVehicleDialog />
          </div>
        </div>
      )}
    </div>
  );
}
