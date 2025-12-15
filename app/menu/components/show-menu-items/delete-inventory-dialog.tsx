"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useDeleteInventory } from "../../hooks";
import { DeleteInventoryDialogProps } from "./types";

export function DeleteInventoryDialog({
  inventory,
  isOpen,
  onClose,
  menuId,
}: DeleteInventoryDialogProps) {
  const deleteInventoryMutation = useDeleteInventory();

  const handleDelete = () => {
    if (!inventory || !menuId) return;

    deleteInventoryMutation.mutate(
      {
        menuId,
        inventoryId: inventory._id,
      },
      {
        onSuccess: () => {
          toast.success("Inventory deleted successfully!");
          onClose();
        },
        onError: (
          error: Error & { response?: { data?: { message?: string } } }
        ) => {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to delete inventory";
          toast.error(errorMsg);
        },
      }
    );
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Inventory</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the inventory item &quot;
            {inventory?.sizeLabel}&quot;? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteInventoryMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteInventoryMutation.isPending ? (
              <>
                <Spinner className="h-4 w-4 mr-2" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
