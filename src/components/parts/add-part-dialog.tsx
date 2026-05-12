"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createPartInterval } from "@/lib/actions/parts";

interface AddPartDialogProps {
  vehicleId: string;
}

export function AddPartDialog({ vehicleId }: AddPartDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [partName, setPartName] = useState("");
  const [intervalKm, setIntervalKm] = useState("");

  async function handleSubmit() {
    if (!partName || !intervalKm) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const result = await createPartInterval(vehicleId, {
      partName,
      intervalKm: parseInt(intervalKm),
    });

    if (result.success) {
      toast.success(`${partName} interval added!`);
      setPartName("");
      setIntervalKm("");
      setOpen(false);
    } else {
      toast.error(result.error || "Failed to add part.");
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Part
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Part Interval</DialogTitle>
          <DialogDescription>
            Define a recurring maintenance interval for a part.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="partName">Part Name</Label>
            <Input
              id="partName"
              placeholder="e.g., Air Filter"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="intervalKm">Interval (km)</Label>
            <Input
              id="intervalKm"
              type="number"
              min={1}
              placeholder="e.g., 10000"
              value={intervalKm}
              onChange={(e) => setIntervalKm(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Add Part Interval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
