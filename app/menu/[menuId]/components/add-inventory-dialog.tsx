"use client";

import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { MenuItem } from "../../api";

export interface AddInventoryFormData {
  menuItemId: string;
  sizeLabel: string;
  quantity: number;
  price: number;
  calories: number;
  isDefault: boolean;
}

interface AddInventoryDialogProps {
  open: boolean;
  menuItems: MenuItem[];
  formData: AddInventoryFormData;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onFormChange: (data: AddInventoryFormData) => void;
  onSave: () => void;
}

export const AddInventoryDialog = memo(function AddInventoryDialog({
  open,
  menuItems,
  formData,
  isPending,
  onOpenChange,
  onFormChange,
  onSave,
}: AddInventoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Inventory</DialogTitle>
          <DialogDescription>
            Add a new inventory item for this menu
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="add-menuItem">Menu Item</Label>
            <Select
              value={formData.menuItemId}
              onValueChange={(value) =>
                onFormChange({ ...formData, menuItemId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a menu item" />
              </SelectTrigger>
              <SelectContent>
                {menuItems.map((item) => (
                  <SelectItem key={item._id} value={item._id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="add-sizeLabel">Size Label</Label>
            <Input
              id="add-sizeLabel"
              placeholder="e.g., Small, Medium, Large"
              value={formData.sizeLabel}
              onChange={(e) =>
                onFormChange({ ...formData, sizeLabel: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="add-quantity">Quantity</Label>
            <Input
              id="add-quantity"
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
            <Label htmlFor="add-price">Price (₹)</Label>
            <Input
              id="add-price"
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
            <Label htmlFor="add-calories">Calories (optional)</Label>
            <Input
              id="add-calories"
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
            <Label htmlFor="add-isDefault">Default Size</Label>
            <Switch
              id="add-isDefault"
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
                Adding...
              </>
            ) : (
              "Add Inventory"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
