"use client";

import { useState } from "react";
import { Wrench, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditVehicleDialog } from "./edit-vehicle-dialog";
import { LogServiceDialog } from "@/components/parts/log-service-dialog";
import type { VehicleWithParts } from "@/types";

interface VehicleDetailActionsProps {
  vehicle: VehicleWithParts;
}

export function VehicleDetailActions({ vehicle }: VehicleDetailActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="mr-1.5 h-3.5 w-3.5" />
          Edit
        </Button>
        <Button size="sm" onClick={() => setServiceOpen(true)}>
          <Wrench className="mr-1.5 h-3.5 w-3.5" />
          Log Service
        </Button>
      </div>
      <EditVehicleDialog
        vehicle={vehicle}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <LogServiceDialog
        vehicle={vehicle}
        open={serviceOpen}
        onOpenChange={setServiceOpen}
      />
    </>
  );
}
