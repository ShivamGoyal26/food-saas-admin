"use client";

import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

interface EditNotesDialogProps {
  open: boolean;
  notes: string;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onNotesChange: (notes: string) => void;
  onSave: () => void;
}

export const EditNotesDialog = memo(function EditNotesDialog({
  open,
  notes,
  isPending,
  onOpenChange,
  onNotesChange,
  onSave,
}: EditNotesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Notes</DialogTitle>
          <DialogDescription>Update the notes for this menu</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              placeholder="Add notes about this menu..."
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isPending}>
            {isPending ? (
              <>
                <Spinner className="h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              "Save Notes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
