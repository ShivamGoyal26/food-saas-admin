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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";

export interface EditInventoryFormData {
  quantity: number;
  price: number;
  calories: number;
  isDefault: boolean;
}

interface EditInventoryDialogProps {
  open: boolean;
  sizeLabel?: string;
  formData: EditInventoryFormData;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onFormChange: (data: EditInventoryFormData) => void;
  onSave: () => void;
}

export const EditInventoryDialog = memo(function EditInventoryDialog({
  open,
  sizeLabel,
  formData,
  isPending,
  onOpenChange,
  onFormChange,
  onSave,
}: EditInventoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Inventory</DialogTitle>
          <DialogDescription>
            Update the inventory details for {sizeLabel}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-quantity">Quantity</Label>
            <Input
              id="edit-quantity"
              type="number"
              min={0}
              value={formData.quantity}
              onChange={(e) =>
                onFormChange({
                  ...formData,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-price">Price (₹)</Label>
            <Input
              id="edit-price"
              type="number"
              min={0}
              step={0.01}
              value={formData.price}
              onChange={(e) =>
                onFormChange({
                  ...formData,
                  price: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-calories">Calories</Label>
            <Input
              id="edit-calories"
              type="number"
              min={0}
              value={formData.calories}
              onChange={(e) =>
                onFormChange({
                  ...formData,
                  calories: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="edit-isDefault">Default Size</Label>
            <Switch
              id="edit-isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) =>
                onFormChange({ ...formData, isDefault: checked })
              }
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
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
