"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/lib/actions/settings";

interface SettingsFormProps {
  userId: string;
  currentName: string;
}

export function SettingsForm({ userId, currentName }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(currentName);

  async function handleSubmit() {
    setLoading(true);
    const result = await updateProfile(userId, name);
    if (result.success) {
      toast.success("Profile updated!");
    } else {
      toast.error(result.error || "Failed to update.");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Display Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          disabled={loading}
        />
      </div>
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Save Changes
      </Button>
    </div>
  );
}
