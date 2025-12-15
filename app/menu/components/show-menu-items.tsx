import { useState } from "react";
import { useRouter } from "next/navigation";
import { MenuItem, MenuWithInventory, InventoryItem } from "../api";
import {
  usePublishMenu,
  useUpdateInventory,
  useDeleteInventory,
} from "../hooks";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { formatDateForDisplay } from "../utils/date";
import { toast } from "sonner";
import { Pencil, Trash2, ExternalLink } from "lucide-react";

type ShowMenuItemsProps = {
  type: "breakfast" | "lunch" | "dinner";
  menuData?: MenuWithInventory;
  selectedDate: string;
};

const ShowMenuItems = ({
  type,
  menuData,
  selectedDate,
}: ShowMenuItemsProps) => {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [editingInventory, setEditingInventory] =
    useState<InventoryItem | null>(null);
  const [deletingInventory, setDeletingInventory] =
    useState<InventoryItem | null>(null);
  const [editForm, setEditForm] = useState({
    quantity: 0,
    price: 0,
    calories: 0,
    isDefault: false,
  });

  const publishMenuMutation = usePublishMenu();
  const updateInventoryMutation = useUpdateInventory();
  const deleteInventoryMutation = useDeleteInventory();

  const menuItems = menuData?.menu.menuItems || [];
  const isDraft = menuData?.menu.isDraft || false;
  const isPublished = menuData?.menu.isPublished || false;
  const menuId = menuData?.menu._id;
  const inventory = menuData?.inventory || [];

  const handleDeleteInventory = () => {
    if (!deletingInventory || !menuId) return;

    deleteInventoryMutation.mutate(
      {
        menuId,
        inventoryId: deletingInventory._id,
      },
      {
        onSuccess: () => {
          toast.success("Inventory deleted successfully!");
          setDeletingInventory(null);
        },
        onError: (error: any) => {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to delete inventory";
          toast.error(errorMsg);
        },
      }
    );
  };

  const handlePublish = async () => {
    if (!menuId || !menuItems.length) {
      toast.error("Cannot publish menu without items");
      return;
    }

    setIsPublishing(true);
    publishMenuMutation.mutate(
      {
        menuId,
        menuItemIds: menuItems.map((item) => item._id),
      },
      {
        onSuccess: () => {
          toast.success("Menu published successfully!");
          setIsPublishing(false);
        },
        onError: (error: any) => {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to publish menu";
          toast.error(errorMsg);
          setIsPublishing(false);
        },
      }
    );
  };

  const handleEditClick = (inv: InventoryItem) => {
    setEditingInventory(inv);
    setEditForm({
      quantity: inv.quantity,
      price: inv.price,
      calories: inv.calories || 0,
      isDefault: inv.isDefault || false,
    });
  };

  const handleUpdateInventory = () => {
    if (!editingInventory || !menuId) return;

    updateInventoryMutation.mutate(
      {
        menuId,
        inventoryId: editingInventory._id,
        payload: {
          quantity: editForm.quantity,
          price: editForm.price,
          calories: editForm.calories,
          isDefault: editForm.isDefault,
        },
      },
      {
        onSuccess: () => {
          toast.success("Inventory updated successfully!");
          setEditingInventory(null);
        },
        onError: (error: any) => {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to update inventory";
          toast.error(errorMsg);
        },
      }
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold capitalize">
              {type} Menu {isDraft && "(Draft)"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {formatDateForDisplay(selectedDate)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {menuId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/menu/${menuId}`)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage Inventory
              </Button>
            )}
            {!isPublished && !isDraft && menuId && (
              <Button
                onClick={handlePublish}
                disabled={isPublishing || publishMenuMutation.isPending}
                size="sm"
              >
                {isPublishing || publishMenuMutation.isPending ? (
                  <>
                    <Spinner className="h-4 w-4 mr-2" />
                    Publishing...
                  </>
                ) : (
                  "Publish Menu"
                )}
              </Button>
            )}
            {isPublished && (
              <Badge variant="default" className="h-fit">
                Published
              </Badge>
            )}
          </div>
        </div>
      </div>

      <section className="mt-10 w-full overflow-x-auto">
        {menuItems.length === 0 ? (
          <div className="flex text-xs items-center justify-center py-8 text-muted-foreground">
            <p>No menu items available</p>
          </div>
        ) : (
          <Table className="w-full">
            <TableCaption>
              Menu items with inventory details for {type}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size Label</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Calories</TableHead>
                <TableHead>Default</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map((item) => {
                const itemInventory = inventory.filter(
                  (inv) => inv.menuItem === item._id
                );
                return itemInventory.length > 0 ? (
                  itemInventory.map((inv, index) => (
                    <TableRow key={inv._id}>
                      {index === 0 && (
                        <>
                          <TableCell
                            className="font-medium"
                            rowSpan={itemInventory.length}
                          >
                            {item.name}
                          </TableCell>
                          <TableCell rowSpan={itemInventory.length}>
                            {item.description}
                          </TableCell>
                          <TableCell rowSpan={itemInventory.length}>
                            <Badge
                              variant={item.isVeg ? "default" : "secondary"}
                            >
                              {item.isVeg ? "Veg" : "Non-Veg"}
                            </Badge>
                          </TableCell>
                        </>
                      )}
                      <TableCell>{inv.sizeLabel}</TableCell>
                      <TableCell>{inv.quantity}</TableCell>
                      <TableCell>₹{inv.price}</TableCell>
                      <TableCell>{inv.calories || "-"}</TableCell>
                      <TableCell>
                        {inv.isDefault && (
                          <Badge variant="outline" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(inv)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingInventory(inv)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <Badge variant={item.isVeg ? "default" : "secondary"}>
                        {item.isVeg ? "Veg" : "Non-Veg"}
                      </Badge>
                    </TableCell>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      No inventory
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </section>

      {/* Edit Inventory Dialog */}
      <Dialog
        open={!!editingInventory}
        onOpenChange={(open) => !open && setEditingInventory(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Inventory</DialogTitle>
            <DialogDescription>
              Update the inventory details for {editingInventory?.sizeLabel}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min={0}
                value={editForm.quantity}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step={0.01}
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                min={0}
                value={editForm.calories}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    calories: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isDefault">Default Size</Label>
              <Switch
                id="isDefault"
                checked={editForm.isDefault}
                onCheckedChange={(checked) =>
                  setEditForm({ ...editForm, isDefault: checked })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingInventory(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateInventory}
              disabled={updateInventoryMutation.isPending}
            >
              {updateInventoryMutation.isPending ? (
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

      {/* Delete Inventory Confirmation Dialog */}
      <AlertDialog
        open={!!deletingInventory}
        onOpenChange={(open) => !open && setDeletingInventory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inventory</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the inventory item &quot;
              {deletingInventory?.sizeLabel}&quot;? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel onClick={() => setDeletingInventory(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInventory}
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
    </div>
  );
};

export default ShowMenuItems;
