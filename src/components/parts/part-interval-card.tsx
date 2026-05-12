"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Trash2, AlertTriangle, Clock, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deletePartInterval } from "@/lib/actions/parts";
import type { PartIntervalWithReplacements } from "@/types";

interface PartIntervalCardProps {
  partInterval: PartIntervalWithReplacements;
  currentMileage: number;
  vehicleId: string;
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

const statusConfig = {
  safe: { color: "bg-emerald-500", badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", label: "Good" },
  warning: { color: "bg-amber-500", badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400", label: "Due Soon" },
  overdue: { color: "bg-red-500", badge: "bg-red-500/10 text-red-600 dark:text-red-400", label: "Overdue" },
};

export function PartIntervalCard({
  partInterval,
  currentMileage,
  vehicleId,
}: PartIntervalCardProps) {
  const [showHistory, setShowHistory] = useState(false);
  const lastReplacement = partInterval.replacements[0];
  const replacedAtKm = lastReplacement?.replacedAtKm ?? 0;
  const { remaining, percentage, status } = getPartStatus(
    currentMileage,
    replacedAtKm,
    partInterval.intervalKm
  );
  const config = statusConfig[status];

  async function handleDelete() {
    const result = await deletePartInterval(partInterval.id, vehicleId);
    if (result.success) {
      toast.success(`${partInterval.partName} removed.`);
    } else {
      toast.error(result.error || "Failed to delete.");
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{partInterval.partName}</CardTitle>
            <p className="text-xs text-muted-foreground">
              Every {partInterval.intervalKm.toLocaleString()} km
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${config.badge}`}>
              {status === "overdue" && <AlertTriangle className="mr-1 h-3 w-3" />}
              {config.label}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Remaining</span>
            <span className="font-medium tabular-nums">
              {remaining > 0
                ? `${remaining.toLocaleString()} km`
                : `${Math.abs(remaining).toLocaleString()} km over`}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${config.color}`}
              style={{ width: `${Math.max(2, percentage)}%` }}
            />
          </div>
        </div>

        {/* Last replacement info */}
        {lastReplacement ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Last replaced at {lastReplacement.replacedAtKm.toLocaleString()} km
            on {format(new Date(lastReplacement.replacedAt), "MMM d, yyyy")}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Never replaced
          </p>
        )}

        {/* History toggle */}
        {partInterval.replacements.length > 1 && (
          <div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs text-primary hover:underline"
            >
              {showHistory ? "Hide" : "Show"} history (
              {partInterval.replacements.length} records)
            </button>
            {showHistory && (
              <div className="mt-2 space-y-2">
                {partInterval.replacements.map((rep) => (
                  <div
                    key={rep.id}
                    className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-medium">
                        {rep.replacedAtKm.toLocaleString()} km
                      </div>
                      <div className="text-muted-foreground">
                        {format(new Date(rep.replacedAt), "MMM d, yyyy")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {rep.cost > 0 && (
                        <span className="font-medium">
                          Rp {rep.cost.toLocaleString()}
                        </span>
                      )}
                      {rep.receiptImageUrl && (
                        <a
                          href={rep.receiptImageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
