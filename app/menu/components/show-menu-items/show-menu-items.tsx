"use client";

import { useState } from "react";
import { toast } from "sonner";
import { InventoryItem } from "../../api";
import { usePublishMenu } from "../../hooks";
import { MenuHeader } from "./menu-header";
import { MenuItemsTable } from "./menu-items-table";
import { EditInventoryDialog } from "./edit-inventory-dialog";
import { DeleteInventoryDialog } from "./delete-inventory-dialog";
import { ShowMenuItemsProps } from "./types";

export function ShowMenuItems({
  type,
  menuData,
  selectedDate,
}: ShowMenuItemsProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [editingInventory, setEditingInventory] =
    useState<InventoryItem | null>(null);
  const [deletingInventory, setDeletingInventory] =
    useState<InventoryItem | null>(null);

  const publishMenuMutation = usePublishMenu();

  const menuItems = menuData?.menu.menuItems || [];
  const isDraft = menuData?.menu.isDraft || false;
  const isPublished = menuData?.menu.isPublished || false;
  const menuId = menuData?.menu._id;
  const inventory = menuData?.inventory || [];

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
        onError: (
          error: Error & { response?: { data?: { message?: string } } }
        ) => {
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

  return (
    <div className="w-full">
      <MenuHeader
        type={type}
        selectedDate={selectedDate}
        isDraft={isDraft}
        isPublished={isPublished}
        menuId={menuId}
        hasMenuItems={menuItems.length > 0}
        isPublishing={isPublishing || publishMenuMutation.isPending}
        onPublish={handlePublish}
      />

      <section className="mt-10 w-full overflow-x-auto">
        <MenuItemsTable
          type={type}
          menuItems={menuItems}
          inventory={inventory}
          onEditInventory={setEditingInventory}
          onDeleteInventory={setDeletingInventory}
        />
      </section>

      <EditInventoryDialog
        inventory={editingInventory}
        isOpen={!!editingInventory}
        onClose={() => setEditingInventory(null)}
        menuId={menuId}
      />

      <DeleteInventoryDialog
        inventory={deletingInventory}
        isOpen={!!deletingInventory}
        onClose={() => setDeletingInventory(null)}
        menuId={menuId}
      />
    </div>
  );
}

// Default export for backward compatibility
export default ShowMenuItems;
