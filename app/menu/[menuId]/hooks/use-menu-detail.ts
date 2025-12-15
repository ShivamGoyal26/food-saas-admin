"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  useGetMenuDetail,
  useUpdateInventory,
  useDeleteInventory,
  useCreateInventory,
  usePublishMenu,
  useUnpublishMenu,
  useUpdateMenu,
} from "../../hooks";
import { InventoryItemPopulated } from "../../api";
import type { EditInventoryFormData } from "../components/edit-inventory-dialog";
import type { AddInventoryFormData } from "../components/add-inventory-dialog";

const initialEditForm: EditInventoryFormData = {
  quantity: 0,
  price: 0,
  calories: 0,
  isDefault: false,
};

const initialAddForm: AddInventoryFormData = {
  menuItemId: "",
  sizeLabel: "",
  quantity: 0,
  price: 0,
  calories: 0,
  isDefault: false,
};

export function useMenuDetail(menuId: string) {
  // Dialog states
  const [editingInventory, setEditingInventory] =
    useState<InventoryItemPopulated | null>(null);
  const [deletingInventory, setDeletingInventory] =
    useState<InventoryItemPopulated | null>(null);
  const [isAddingInventory, setIsAddingInventory] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isEditingMenuItems, setIsEditingMenuItems] = useState(false);

  // Form states
  const [editForm, setEditForm] =
    useState<EditInventoryFormData>(initialEditForm);
  const [addForm, setAddForm] = useState<AddInventoryFormData>(initialAddForm);
  const [notesForm, setNotesForm] = useState("");
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>([]);

  // Query and mutations
  const { data, isLoading, isError, error } = useGetMenuDetail(menuId);
  const updateInventoryMutation = useUpdateInventory();
  const deleteInventoryMutation = useDeleteInventory();
  const createInventoryMutation = useCreateInventory();
  const publishMenuMutation = usePublishMenu();
  const unpublishMenuMutation = useUnpublishMenu();
  const updateMenuMutation = useUpdateMenu();

  // Derived data
  const menu = data?.menu;
  const inventory = data?.inventory || [];
  const menuItems = useMemo(() => menu?.menuItems || [], [menu?.menuItems]);

  // Handlers
  const handleEditInventoryClick = useCallback(
    (inv: InventoryItemPopulated) => {
      setEditingInventory(inv);
      setEditForm({
        quantity: inv.quantity,
        price: inv.price,
        calories: inv.calories || 0,
        isDefault: inv.isDefault || false,
      });
    },
    []
  );

  const handleCloseEditInventory = useCallback((open: boolean) => {
    if (!open) setEditingInventory(null);
  }, []);

  const handleCloseDeleteInventory = useCallback((open: boolean) => {
    if (!open) setDeletingInventory(null);
  }, []);

  const handleUpdateInventory = useCallback(() => {
    if (!editingInventory) return;

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
        onError: (error) => {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to update inventory";
          toast.error(errorMsg);
        },
      }
    );
  }, [editingInventory, editForm, menuId, updateInventoryMutation]);

  const handleDeleteInventory = useCallback(() => {
    if (!deletingInventory) return;

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
        onError: (error) => {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to delete inventory";
          toast.error(errorMsg);
        },
      }
    );
  }, [deletingInventory, menuId, deleteInventoryMutation]);

  const handleCloseAddInventory = useCallback((open: boolean) => {
    if (!open) {
      setIsAddingInventory(false);
      setAddForm(initialAddForm);
    }
  }, []);

  const handleAddInventory = useCallback(() => {
    if (!addForm.menuItemId || !addForm.sizeLabel || addForm.price <= 0) {
      toast.error("Please fill all required fields");
      return;
    }

    const inventoryItem: {
      menuItemId: string;
      sizeLabel: string;
      quantity: number;
      price: number;
      calories?: number;
      isDefault?: boolean;
    } = {
      menuItemId: addForm.menuItemId,
      sizeLabel: addForm.sizeLabel,
      quantity: addForm.quantity,
      price: addForm.price,
    };

    if (addForm.calories > 0) {
      inventoryItem.calories = addForm.calories;
    }
    if (addForm.isDefault) {
      inventoryItem.isDefault = addForm.isDefault;
    }

    // API expects inventory array
    const payload = {
      inventory: [inventoryItem],
    };

    createInventoryMutation.mutate(
      { menuId, payload },
      {
        onSuccess: () => {
          toast.success("Inventory added successfully!");
          setIsAddingInventory(false);
          setAddForm(initialAddForm);
        },
        onError: (error) => {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to add inventory";
          toast.error(errorMsg);
        },
      }
    );
  }, [addForm, menuId, createInventoryMutation]);

  const handlePublish = useCallback(() => {
    publishMenuMutation.mutate(
      {
        menuId,
        menuItemIds: menuItems.map((item) => item._id),
      },
      {
        onSuccess: () => {
          toast.success("Menu published successfully!");
        },
        onError: (error) => {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to publish menu";
          toast.error(errorMsg);
        },
      }
    );
  }, [menuId, menuItems, publishMenuMutation]);

  const handleUnpublish = useCallback(() => {
    unpublishMenuMutation.mutate(
      { menuId },
      {
        onSuccess: () => {
          toast.success("Menu unpublished successfully!");
        },
        onError: (error) => {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to unpublish menu";
          toast.error(errorMsg);
        },
      }
    );
  }, [menuId, unpublishMenuMutation]);

  const handleEditNotesClick = useCallback(() => {
    setNotesForm(menu?.notes || "");
    setIsEditingNotes(true);
  }, [menu?.notes]);

  const handleSaveNotes = useCallback(() => {
    updateMenuMutation.mutate(
      {
        menuId,
        payload: { notes: notesForm },
      },
      {
        onSuccess: () => {
          toast.success("Notes updated successfully!");
          setIsEditingNotes(false);
        },
        onError: (error) => {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to update notes";
          toast.error(errorMsg);
        },
      }
    );
  }, [menuId, notesForm, updateMenuMutation]);

  const handleEditMenuItemsClick = useCallback(() => {
    setSelectedMenuItems(menuItems.map((item) => item._id));
    setIsEditingMenuItems(true);
  }, [menuItems]);

  const handleSaveMenuItems = useCallback(() => {
    if (selectedMenuItems.length === 0) {
      toast.error("At least one menu item is required");
      return;
    }

    updateMenuMutation.mutate(
      {
        menuId,
        payload: { menuItems: selectedMenuItems },
      },
      {
        onSuccess: () => {
          toast.success("Menu items updated successfully!");
          setIsEditingMenuItems(false);
        },
        onError: (error) => {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to update menu items";
          toast.error(errorMsg);
        },
      }
    );
  }, [menuId, selectedMenuItems, updateMenuMutation]);

  return {
    // Data
    menu,
    inventory,
    menuItems,
    isLoading,
    isError,
    error,

    // Edit inventory
    editingInventory,
    editForm,
    setEditForm,
    handleEditInventoryClick,
    handleCloseEditInventory,
    handleUpdateInventory,
    isUpdatingInventory: updateInventoryMutation.isPending,

    // Delete inventory
    deletingInventory,
    setDeletingInventory,
    handleCloseDeleteInventory,
    handleDeleteInventory,
    isDeletingInventory: deleteInventoryMutation.isPending,

    // Add inventory
    isAddingInventory,
    setIsAddingInventory,
    addForm,
    setAddForm,
    handleAddInventory,
    handleCloseAddInventory,
    isCreatingInventory: createInventoryMutation.isPending,

    // Publish/Unpublish
    handlePublish,
    handleUnpublish,
    isPublishing: publishMenuMutation.isPending,
    isUnpublishing: unpublishMenuMutation.isPending,

    // Edit notes
    isEditingNotes,
    setIsEditingNotes,
    notesForm,
    setNotesForm,
    handleEditNotesClick,
    handleSaveNotes,

    // Edit menu items
    isEditingMenuItems,
    setIsEditingMenuItems,
    selectedMenuItems,
    setSelectedMenuItems,
    handleEditMenuItemsClick,
    handleSaveMenuItems,

    // Update menu pending state
    isUpdatingMenu: updateMenuMutation.isPending,
  };
}
