"use client";

import { memo } from "react";
import { Textarea } from "@/components/ui/textarea";

interface StepNotesProps {
  value?: string;
  onChange: (notes: string) => void;
}

export const StepNotes = memo(function StepNotes({
  value,
  onChange,
}: StepNotesProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-4">Additional Notes</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Add any special notes or descriptions for this menu
        </p>
        <Textarea
          placeholder="e.g., Today's special breakfast, seasonal items available, etc."
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
});
