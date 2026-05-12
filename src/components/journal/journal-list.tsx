"use client";

import { format } from "date-fns";
import {
  AlertCircle,
  Wrench as WrenchIcon,
  FileText,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteJournalEntry } from "@/lib/actions/journal";
import type { JournalEntry } from "@/types";

interface JournalListProps {
  journals: JournalEntry[];
  vehicleId: string;
}

const typeConfig = {
  SYMPTOM: {
    icon: AlertCircle,
    label: "Symptom",
    className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
  MODIFICATION: {
    icon: WrenchIcon,
    label: "Modification",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  GENERAL: {
    icon: FileText,
    label: "General",
    className: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  },
};

export function JournalList({ journals, vehicleId }: JournalListProps) {
  async function handleDelete(journalId: string) {
    const result = await deleteJournalEntry(journalId, vehicleId);
    if (result.success) {
      toast.success("Journal entry deleted.");
    } else {
      toast.error(result.error || "Failed to delete.");
    }
  }

  if (journals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <FileText className="h-10 w-10 text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">
          No journal entries yet.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Log symptoms, modifications, or general notes about your vehicle.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {journals.map((entry) => {
        const config = typeConfig[entry.type];
        const Icon = config.icon;

        return (
          <div
            key={entry.id}
            className="group flex items-start gap-3 rounded-lg border p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="mt-0.5">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm truncate">{entry.title}</h4>
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 ${config.className}`}
                >
                  {config.label}
                </Badge>
              </div>
              {entry.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {entry.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {format(new Date(entry.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              onClick={() => handleDelete(entry.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
