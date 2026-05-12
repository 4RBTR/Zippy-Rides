"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Car,
  Bike,
  MoreVertical,
  Pencil,
  Trash2,
  Wrench,
  ChevronRight,
  Calendar,
  AlertTriangle,
  Shield,
  Gauge,
} from "lucide-react";
import { differenceInDays } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { VehicleWithParts } from "@/types";
import { EditVehicleDialog } from "./edit-vehicle-dialog";
import { DeleteVehicleDialog } from "./delete-vehicle-dialog";
import { LogServiceDialog } from "@/components/parts/log-service-dialog";
import { UpdateMileageDialog } from "./update-mileage-dialog";

interface VehicleCardProps {
  vehicle: VehicleWithParts;
}

function getPartStatus(
  currentMileage: number,
  replacedAtKm: number,
  intervalKm: number
) {
  const nextDueAt = replacedAtKm + intervalKm;
  const remaining = nextDueAt - currentMileage;
  const percentage = Math.max(0, Math.min(100, (remaining / intervalKm) * 100));

  let status: "safe" | "warning" | "overdue" = "safe";
  if (remaining <= 0) status = "overdue";
  else if (percentage <= 30) status = "warning";

  return { remaining, percentage, status, nextDueAt };
}

function getDateStatus(date: Date | null) {
  if (!date) return null;
  const daysLeft = differenceInDays(new Date(date), new Date());
  let status: "safe" | "warning" | "overdue" = "safe";
  if (daysLeft <= 0) status = "overdue";
  else if (daysLeft <= 30) status = "warning";
  return { daysLeft, status };
}

const statusColors = {
  safe: "bg-emerald-500",
  warning: "bg-amber-500",
  overdue: "bg-red-500",
};

const statusBadgeVariants = {
  safe: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  overdue: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [mileageOpen, setMileageOpen] = useState(false);

  const annualTax = getDateStatus(vehicle.annualTaxDate);
  const fiveYearTax = getDateStatus(vehicle.fiveYearTaxDate);

  const partStatuses = vehicle.partIntervals.map((pi) => {
    const lastReplacement = pi.replacements[0];
    const replacedAtKm = lastReplacement?.replacedAtKm ?? 0;
    return {
      ...pi,
      ...getPartStatus(vehicle.currentMileage, replacedAtKm, pi.intervalKm),
    };
  });

  const VehicleIcon = vehicle.type === "MOBIL" ? Car : Bike;

  return (
    <>
      <Card className="group relative overflow-hidden border border-border/50 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary/60 to-primary/30" />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <VehicleIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg leading-tight">
                  {vehicle.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs font-normal">
                    {vehicle.type === "MOTOR" ? "Motorcycle" : "Car"}
                  </Badge>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                }
              >
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setServiceOpen(true)}>
                  <Wrench className="mr-2 h-4 w-4" />
                  Log Service
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDeleteOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mileage */}
          <button
            onClick={() => setMileageOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 w-full hover:bg-muted transition-colors group/mileage"
          >
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Odometer</span>
            <span className="ml-auto font-semibold tabular-nums">
              {vehicle.currentMileage.toLocaleString()} km
            </span>
            <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover/mileage:opacity-100 transition-opacity" />
          </button>

          {/* Tax countdown badges */}
          {(annualTax || fiveYearTax) && (
            <div className="flex flex-wrap gap-2">
              {annualTax && (
                <div
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${statusBadgeVariants[annualTax.status]}`}
                >
                  <Calendar className="h-3 w-3" />
                  Annual Tax:{" "}
                  {annualTax.daysLeft <= 0
                    ? `${Math.abs(annualTax.daysLeft)}d overdue`
                    : `${annualTax.daysLeft}d left`}
                </div>
              )}
              {fiveYearTax && (
                <div
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${statusBadgeVariants[fiveYearTax.status]}`}
                >
                  <Shield className="h-3 w-3" />
                  5-Year:{" "}
                  {fiveYearTax.daysLeft <= 0
                    ? `${Math.abs(fiveYearTax.daysLeft)}d overdue`
                    : `${fiveYearTax.daysLeft}d left`}
                </div>
              )}
            </div>
          )}

          {/* Part progress bars */}
          {partStatuses.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Parts Status
                </span>
                {partStatuses.some((p) => p.status === "overdue") && (
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                )}
              </div>
              {partStatuses.slice(0, 4).map((part) => (
                <div key={part.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate mr-2">{part.partName}</span>
                    <span
                      className={`text-xs font-medium tabular-nums ${
                        part.status === "overdue"
                          ? "text-red-500"
                          : part.status === "warning"
                          ? "text-amber-500"
                          : "text-emerald-500"
                      }`}
                    >
                      {part.remaining > 0
                        ? `${part.remaining.toLocaleString()} km`
                        : `${Math.abs(part.remaining).toLocaleString()} km over`}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${statusColors[part.status]}`}
                      style={{ width: `${Math.max(2, part.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
              {partStatuses.length > 4 && (
                <p className="text-xs text-muted-foreground">
                  +{partStatuses.length - 4} more parts
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border/60 p-3 text-center">
              <p className="text-sm text-muted-foreground">
                No parts tracked yet
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => setServiceOpen(true)}
            >
              <Wrench className="mr-1.5 h-3.5 w-3.5" />
              Log Service
            </Button>
            <Button size="sm" className="flex-1" render={<Link href={`/garage/${vehicle.id}`} />}>
              Details
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditVehicleDialog
        vehicle={vehicle}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteVehicleDialog
        vehicle={vehicle}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
      <LogServiceDialog
        vehicle={vehicle}
        open={serviceOpen}
        onOpenChange={setServiceOpen}
      />
      <UpdateMileageDialog
        vehicle={vehicle}
        open={mileageOpen}
        onOpenChange={setMileageOpen}
      />
    </>
  );
}
