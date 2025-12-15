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
import { Spinner } from "@/components/ui/spinner";
import { MenuItemSearch } from "../../components/menu-item-search";

interface EditMenuItemsDialogProps {
  open: boolean;
  selectedItems: string[];
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onItemsChange: (items: string[]) => void;
  onSave: () => void;
}

export const EditMenuItemsDialog = memo(function EditMenuItemsDialog({
  open,
  selectedItems,
  isPending,
  onOpenChange,
  onItemsChange,
  onSave,
}: EditMenuItemsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Menu Items</DialogTitle>
          <DialogDescription>
            Select the menu items for this menu. At least one item is required.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <MenuItemSearch
            selectedItems={selectedItems}
            onItemsChange={onItemsChange}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isPending || selectedItems.length === 0}
          >
            {isPending ? (
              <>
                <Spinner className="h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              `Save (${selectedItems.length} items)`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
