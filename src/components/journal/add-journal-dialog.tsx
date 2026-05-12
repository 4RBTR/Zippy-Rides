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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createJournalEntry } from "@/lib/actions/journal";

interface AddJournalDialogProps {
  vehicleId: string;
}

export function AddJournalDialog({ vehicleId }: AddJournalDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"SYMPTOM" | "MODIFICATION" | "GENERAL">("GENERAL");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit() {
    if (!title) {
      toast.error("Please enter a title.");
      return;
    }

    setLoading(true);
    const result = await createJournalEntry(vehicleId, {
      type,
      title,
      description: description || undefined,
    });

    if (result.success) {
      toast.success("Journal entry added!");
      setTitle("");
      setDescription("");
      setType("GENERAL");
      setOpen(false);
    } else {
      toast.error(result.error || "Failed to add entry.");
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Entry
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Journal Entry</DialogTitle>
          <DialogDescription>
            Log a symptom, modification, or general note.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={type}
              onValueChange={(v) =>
                setType(v as "SYMPTOM" | "MODIFICATION" | "GENERAL")
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SYMPTOM">🔴 Symptom</SelectItem>
                <SelectItem value="MODIFICATION">🔧 Modification</SelectItem>
                <SelectItem value="GENERAL">📝 General</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="journal-title">Title</Label>
            <Input
              id="journal-title"
              placeholder="e.g., Steering noise when turning"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="journal-desc">Description (optional)</Label>
            <Textarea
              id="journal-desc"
              placeholder="Add more details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Add Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
