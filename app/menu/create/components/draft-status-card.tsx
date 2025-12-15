"use client";

import { memo } from "react";
import { Card } from "@/components/ui/card";

interface DraftStatusCardProps {
  isDraft: boolean;
  onToggle: (isDraft: boolean) => void;
}

export const DraftStatusCard = memo(function DraftStatusCard({
  isDraft,
  onToggle,
}: DraftStatusCardProps) {
  return (
    <Card className="p-6 mb-8 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold mb-1">Menu Status</h3>
          <p className="text-sm text-muted-foreground">
            {isDraft
              ? "This menu will be saved as a draft"
              : "This menu will be published immediately"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isDraft"
            checked={isDraft}
            onChange={(e) => onToggle(e.target.checked)}
            className="h-4 w-4 rounded"
          />
          <label htmlFor="isDraft" className="text-sm cursor-pointer">
            Save as Draft
          </label>
        </div>
      </div>
    </Card>
  );
});
