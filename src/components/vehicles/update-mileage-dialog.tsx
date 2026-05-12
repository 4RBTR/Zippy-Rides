"use client";

import { useState } from "react";
import { Loader2, Gauge } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateMileage } from "@/lib/actions/vehicles";
import type { VehicleWithParts } from "@/types";

interface UpdateMileageDialogProps {
  vehicle: VehicleWithParts;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateMileageDialog({
  vehicle,
  open,
  onOpenChange,
}: UpdateMileageDialogProps) {
  const [loading, setLoading] = useState(false);
  const [mileage, setMileage] = useState(vehicle.currentMileage.toString());

  async function handleSubmit() {
    const value = parseInt(mileage);
    if (isNaN(value) || value < 0) {
      toast.error("Please enter a valid mileage.");
      return;
    }

    setLoading(true);
    const result = await updateMileage(vehicle.id, value);
    if (result.success) {
      toast.success("Mileage updated!");
      onOpenChange(false);
    } else {
      toast.error(result.error || "Failed to update.");
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Update Mileage
          </DialogTitle>
          <DialogDescription>{vehicle.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="mileage">Current Mileage (km)</Label>
          <Input
            id="mileage"
            type="number"
            min={0}
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            disabled={loading}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
