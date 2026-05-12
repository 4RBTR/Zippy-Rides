"use client";

import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VehicleForm } from "./vehicle-form";
import type { VehicleWithParts } from "@/types";

interface EditVehicleDialogProps {
  vehicle: VehicleWithParts;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditVehicleDialog({
  vehicle,
  open,
  onOpenChange,
}: EditVehicleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
          <DialogDescription>
            Update the details of {vehicle.name}.
          </DialogDescription>
        </DialogHeader>
        <VehicleForm
          mode="edit"
          defaultValues={{
            id: vehicle.id,
            name: vehicle.name,
            type: vehicle.type,
            currentMileage: vehicle.currentMileage,
            annualTaxDate: vehicle.annualTaxDate
              ? format(new Date(vehicle.annualTaxDate), "yyyy-MM-dd")
              : null,
            fiveYearTaxDate: vehicle.fiveYearTaxDate
              ? format(new Date(vehicle.fiveYearTaxDate), "yyyy-MM-dd")
              : null,
          }}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
