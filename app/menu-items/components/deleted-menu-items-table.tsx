"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Pencil, RotateCcw, Trash2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MenuItemResponse } from "@/schemas/menu";
import { useRouter } from "next/navigation";
import { useRestoreMenuItem, usePermanentlyDeleteMenuItem } from "../hooks";
import { toast } from "sonner";

type DeletedMenuItemsTableProps = {
  items: MenuItemResponse[];
  isLoading: boolean;
};

export function DeletedMenuItemsTable({
  items,
  isLoading,
}: DeletedMenuItemsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [restoreId, setRestoreId] = useState<string | null>(null);
  const [permanentDeleteId, setPermanentDeleteId] = useState<string | null>(
    null
  );
  const router = useRouter();
  const restoreMenuItemMutation = useRestoreMenuItem();
  const permanentlyDeleteMutation = usePermanentlyDeleteMenuItem();

  // Filter items based on search term (name and id)
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;

    const lowerSearch = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerSearch) ||
        item._id.toLowerCase().includes(lowerSearch)
    );
  }, [items, searchTerm]);

  const handleRestore = (id: string) => {
    restoreMenuItemMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Menu item restored successfully!");
        setRestoreId(null);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to restore menu item");
      },
    });
  };

  const handlePermanentDelete = (id: string) => {
    permanentlyDeleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Menu item permanently deleted!");
        setPermanentDeleteId(null);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to permanently delete menu item");
      },
    });
  };

  const handleEdit = (id: string) => {
    router.push(`/menu-items/${id}/edit`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading deleted menu items...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No deleted menu items found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results Info */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredItems.length} of {items.length} deleted items
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableCaption>
            {filteredItems.length === 0
              ? "No deleted menu items match your search"
              : "A list of your deleted menu items"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Veg/Non-Veg</TableHead>
              <TableHead>ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow
                key={item._id}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                  {item.description || "N/A"}
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-md text-xs font-medium bg-accent">
                    {item.isVeg ? "Veg" : "Non-Veg"}
                  </span>
                </TableCell>

                <TableCell className="text-xs text-muted-foreground font-mono truncate">
                  {item._id.substring(0, 8)}...
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item._id)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRestoreId(item._id)}
                      disabled={restoreMenuItemMutation.isPending}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPermanentDeleteId(item._id)}
                      disabled={permanentlyDeleteMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Restore Confirmation Dialog */}
      <AlertDialog
        open={restoreId !== null}
        onOpenChange={() => setRestoreId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this menu item? It will be
              available in the active menu items list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => restoreId && handleRestore(restoreId)}
              disabled={restoreMenuItemMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {restoreMenuItemMutation.isPending ? "Restoring..." : "Restore"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Confirmation Dialog */}
      <AlertDialog
        open={permanentDeleteId !== null}
        onOpenChange={() => setPermanentDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              menu item and all its data from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                permanentDeleteId && handlePermanentDelete(permanentDeleteId)
              }
              disabled={permanentlyDeleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {permanentlyDeleteMutation.isPending
                ? "Deleting..."
                : "Delete Permanently"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
