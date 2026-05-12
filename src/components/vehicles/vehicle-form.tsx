"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createVehicle, updateVehicle } from "@/lib/actions/vehicles";

interface VehicleFormProps {
  mode: "create" | "edit";
  defaultValues?: {
    id?: string;
    name: string;
    type: "MOTOR" | "MOBIL";
    currentMileage: number;
    annualTaxDate: string | null;
    fiveYearTaxDate: string | null;
  };
  onSuccess?: () => void;
}

export function VehicleForm({ mode, defaultValues, onSuccess }: VehicleFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      let result;
      if (mode === "edit" && defaultValues?.id) {
        result = await updateVehicle(defaultValues.id, formData);
      } else {
        result = await createVehicle(formData);
      }

      if (result.success) {
        toast.success(
          mode === "create" ? "Vehicle added!" : "Vehicle updated!"
        );
        onSuccess?.();
      } else {
        toast.error(result.error || "Something went wrong.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Vehicle Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., Honda Beat 2023"
          defaultValue={defaultValues?.name}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Vehicle Type</Label>
        <Select
          name="type"
          defaultValue={defaultValues?.type || "MOTOR"}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MOTOR">Motorcycle</SelectItem>
            <SelectItem value="MOBIL">Car</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentMileage">Current Mileage (km)</Label>
        <Input
          id="currentMileage"
          name="currentMileage"
          type="number"
          min={0}
          placeholder="0"
          defaultValue={defaultValues?.currentMileage}
          required
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="annualTaxDate">Annual Tax Date</Label>
          <Input
            id="annualTaxDate"
            name="annualTaxDate"
            type="date"
            defaultValue={defaultValues?.annualTaxDate || ""}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fiveYearTaxDate">5-Year Registration</Label>
          <Input
            id="fiveYearTaxDate"
            name="fiveYearTaxDate"
            type="date"
            defaultValue={defaultValues?.fiveYearTaxDate || ""}
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Vehicle Photo (optional)</Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          disabled={loading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mode === "create" ? "Adding..." : "Updating..."}
          </>
        ) : mode === "create" ? (
          "Add Vehicle"
        ) : (
          "Update Vehicle"
        )}
      </Button>
    </form>
  );
}
