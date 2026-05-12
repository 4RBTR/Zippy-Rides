"use client";

import { useState } from "react";
import { Loader2, Upload, Wrench, DollarSign } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { logService } from "@/lib/actions/parts";
import type { VehicleWithParts } from "@/types";

interface LogServiceDialogProps {
  vehicle: VehicleWithParts;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogServiceDialog({
  vehicle,
  open,
  onOpenChange,
}: LogServiceDialogProps) {
  const [loading, setLoading] = useState(false);
  const [mileage, setMileage] = useState(vehicle.currentMileage.toString());
  const [selectedParts, setSelectedParts] = useState<
    Record<string, { selected: boolean; cost: string }>
  >(() => {
    const initial: Record<string, { selected: boolean; cost: string }> = {};
    vehicle.partIntervals.forEach((pi) => {
      initial[pi.id] = { selected: false, cost: "0" };
    });
    return initial;
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  function togglePart(id: string) {
    setSelectedParts((prev) => ({
      ...prev,
      [id]: { ...prev[id], selected: !prev[id].selected },
    }));
  }

  function updateCost(id: string, cost: string) {
    setSelectedParts((prev) => ({
      ...prev,
      [id]: { ...prev[id], cost },
    }));
  }

  async function handleSubmit() {
    const currentMileage = parseInt(mileage);
    if (isNaN(currentMileage) || currentMileage < 0) {
      toast.error("Please enter a valid mileage.");
      return;
    }

    const parts = Object.entries(selectedParts)
      .filter(([, v]) => v.selected)
      .map(([id, v]) => ({
        partIntervalId: id,
        cost: parseFloat(v.cost) || 0,
      }));

    if (parts.length === 0) {
      toast.error("Please select at least one part.");
      return;
    }

    setLoading(true);

    let receiptFormData: FormData | undefined;
    if (receiptFile) {
      receiptFormData = new FormData();
      receiptFormData.append("receipt", receiptFile);
    }

    const result = await logService(
      vehicle.id,
      { currentMileage, parts },
      receiptFormData
    );

    if (result.success) {
      toast.success("Service logged successfully!");
      onOpenChange(false);
    } else {
      toast.error(result.error || "Failed to log service.");
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            Log Service
          </DialogTitle>
          <DialogDescription>
            Record maintenance for {vehicle.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Mileage input */}
          <div className="space-y-2">
            <Label htmlFor="service-mileage">Current Mileage (km)</Label>
            <Input
              id="service-mileage"
              type="number"
              min={0}
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              disabled={loading}
            />
          </div>

          <Separator />

          {/* Parts selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Select Replaced Parts
            </Label>
            {vehicle.partIntervals.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No part intervals defined. Add parts in the vehicle detail page
                first.
              </p>
            ) : (
              <div className="space-y-2">
                {vehicle.partIntervals.map((pi) => {
                  const isSelected = selectedParts[pi.id]?.selected;
                  return (
                    <div
                      key={pi.id}
                      className={`rounded-lg border p-3 transition-colors cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-border/80"
                      }`}
                      onClick={() => togglePart(pi.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/30"
                            }`}
                          >
                            {isSelected && (
                              <svg
                                className="h-3 w-3 text-primary-foreground"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-medium">
                              {pi.partName}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              every {pi.intervalKm.toLocaleString()} km
                            </span>
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div
                          className="mt-3 flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min={0}
                            placeholder="Cost"
                            value={selectedParts[pi.id]?.cost}
                            onChange={(e) => updateCost(pi.id, e.target.value)}
                            className="h-8 text-sm"
                            disabled={loading}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Separator />

          {/* Receipt upload */}
          <div className="space-y-2">
            <Label htmlFor="receipt">Receipt Image (optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="receipt"
                type="file"
                accept="image/*"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                disabled={loading}
              />
            </div>
            {receiptFile && (
              <p className="text-xs text-muted-foreground">
                <Upload className="inline h-3 w-3 mr-1" />
                {receiptFile.name}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Log Service"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
