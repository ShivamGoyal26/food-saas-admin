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

import { Pencil, Trash2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MenuItemResponse } from "@/schemas/menu";
import { useRouter } from "next/navigation";
import { useDeleteMenuItem } from "../hooks";
import { toast } from "sonner";

type MenuItemsTableProps = {
  items: MenuItemResponse[];
  isLoading: boolean;
};

export function MenuItemsTable({ items, isLoading }: MenuItemsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();
  const deleteMenuItemMutation = useDeleteMenuItem();

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

  const handleDelete = (id: string) => {
    deleteMenuItemMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Menu item deleted successfully!");
        setDeleteId(null);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete menu item");
      },
    });
  };

  const handleEdit = (id: string) => {
    router.push(`/menu-items/${id}/edit`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading menu items...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No menu items found</p>
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
        Showing {filteredItems.length} of {items.length} items
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableCaption>
            {filteredItems.length === 0
              ? "No menu items match your search"
              : "A list of your menu items"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Veg/Non-Veg</TableHead>
              <TableHead>Sizes</TableHead>
              <TableHead>ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow
                key={item._id}
                className="hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => router.push(`/menu-items/${item._id}`)}
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
                <TableCell className="text-sm">
                  {item.sizes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {item.sizes.map((size) => (
                        <Badge
                          key={size._id}
                          variant={size.isDefault ? "default" : "secondary"}
                        >
                          {size.label} - ₹{size.priceInPaise}
                          {size.isDefault && " ✓"}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <Badge variant="secondary">No sizes</Badge>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-mono truncate">
                  {item._id.substring(0, 8)}...
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item._id);
                      }}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(item._id);
                      }}
                      disabled={deleteMenuItemMutation.isPending}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this menu item? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={deleteMenuItemMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMenuItemMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
