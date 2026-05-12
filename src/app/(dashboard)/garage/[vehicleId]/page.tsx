import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Car,
  Bike,
  Gauge,
  Calendar,
  Shield,
  Wrench,
} from "lucide-react";
import { differenceInDays } from "date-fns";
import { getVehicleById } from "@/lib/actions/vehicles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PartIntervalCard } from "@/components/parts/part-interval-card";
import { AddPartDialog } from "@/components/parts/add-part-dialog";
import { JournalList } from "@/components/journal/journal-list";
import { AddJournalDialog } from "@/components/journal/add-journal-dialog";
import { VehicleDetailActions } from "@/components/vehicles/vehicle-detail-actions";
import type { VehicleWithParts } from "@/types";

interface PageProps {
  params: Promise<{ vehicleId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { vehicleId } = await params;
  const vehicle = await getVehicleById(vehicleId);
  return {
    title: vehicle ? `${vehicle.name} — Zippy Rides` : "Vehicle Not Found",
  };
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { vehicleId } = await params;
  const vehicle = (await getVehicleById(vehicleId)) as VehicleWithParts | null;

  if (!vehicle) notFound();

  const VehicleIcon = vehicle.type === "MOBIL" ? Car : Bike;

  const annualTaxDays = vehicle.annualTaxDate
    ? differenceInDays(new Date(vehicle.annualTaxDate), new Date())
    : null;
  const fiveYearTaxDays = vehicle.fiveYearTaxDate
    ? differenceInDays(new Date(vehicle.fiveYearTaxDate), new Date())
    : null;

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/garage" />}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <VehicleIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{vehicle.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="secondary" className="text-xs">
                  {vehicle.type === "MOTOR" ? "Motorcycle" : "Car"}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Gauge className="h-3.5 w-3.5" />
                  {vehicle.currentMileage.toLocaleString()} km
                </span>
              </div>
            </div>
          </div>
        </div>
        <VehicleDetailActions vehicle={vehicle} />
      </div>

      {/* Info cards row */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border p-4 space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Gauge className="h-4 w-4" />
            Odometer
          </div>
          <p className="text-2xl font-bold tabular-nums">
            {vehicle.currentMileage.toLocaleString()}{" "}
            <span className="text-sm font-normal text-muted-foreground">km</span>
          </p>
        </div>
        <div className="rounded-lg border p-4 space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Annual Tax
          </div>
          {vehicle.annualTaxDate ? (
            <p className={`text-lg font-bold ${
              annualTaxDays !== null && annualTaxDays <= 0
                ? "text-red-500"
                : annualTaxDays !== null && annualTaxDays <= 30
                ? "text-amber-500"
                : "text-emerald-500"
            }`}>
              {annualTaxDays !== null && annualTaxDays <= 0
                ? `${Math.abs(annualTaxDays)} days overdue`
                : `${annualTaxDays} days left`}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">Not set</p>
          )}
        </div>
        <div className="rounded-lg border p-4 space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            5-Year Registration
          </div>
          {vehicle.fiveYearTaxDate ? (
            <p className={`text-lg font-bold ${
              fiveYearTaxDays !== null && fiveYearTaxDays <= 0
                ? "text-red-500"
                : fiveYearTaxDays !== null && fiveYearTaxDays <= 30
                ? "text-amber-500"
                : "text-emerald-500"
            }`}>
              {fiveYearTaxDays !== null && fiveYearTaxDays <= 0
                ? `${Math.abs(fiveYearTaxDays)} days overdue`
                : `${fiveYearTaxDays} days left`}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">Not set</p>
          )}
        </div>
      </div>

      {/* Tabs: Parts & Service | Journal */}
      <Tabs defaultValue="parts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="parts" className="gap-1.5">
            <Wrench className="h-3.5 w-3.5" />
            Parts & Service
          </TabsTrigger>
          <TabsTrigger value="journal" className="gap-1.5">
            📝 Journal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="parts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Part Intervals ({vehicle.partIntervals.length})
            </h2>
            <AddPartDialog vehicleId={vehicle.id} />
          </div>
          {vehicle.partIntervals.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {vehicle.partIntervals.map((pi) => (
                <PartIntervalCard
                  key={pi.id}
                  partInterval={pi}
                  currentMileage={vehicle.currentMileage}
                  vehicleId={vehicle.id}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Wrench className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No part intervals defined yet.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Add parts like &quot;Oil Filter&quot; or &quot;Air Filter&quot; with their replacement intervals.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="journal" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Journal ({vehicle.journals.length})
            </h2>
            <AddJournalDialog vehicleId={vehicle.id} />
          </div>
          <JournalList
            journals={vehicle.journals}
            vehicleId={vehicle.id}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
