"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";
import { useMenuDetail } from "./hooks";
import {
  MenuDetailHeader,
  MenuItemsCard,
  InventoryCard,
  NotesCard,
  EditInventoryDialog,
  AddInventoryDialog,
  DeleteInventoryDialog,
  EditNotesDialog,
  EditMenuItemsDialog,
} from "./components";

export default function MenuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const menuId = params.menuId as string;

  const {
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
    isUpdatingInventory,

    // Delete inventory
    deletingInventory,
    setDeletingInventory,
    handleCloseDeleteInventory,
    handleDeleteInventory,
    isDeletingInventory,

    // Add inventory
    isAddingInventory,
    setIsAddingInventory,
    addForm,
    setAddForm,
    handleAddInventory,
    handleCloseAddInventory,
    isCreatingInventory,

    // Publish/Unpublish
    handlePublish,
    handleUnpublish,
    isPublishing,
    isUnpublishing,

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
    isUpdatingMenu,
  } = useMenuDetail(menuId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (isError || !menu) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">
          {error?.message || "Failed to load menu details"}
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <MenuDetailHeader
          menu={menu}
          isPublishing={isPublishing}
          isUnpublishing={isUnpublishing}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
        />

        <MenuItemsCard
          menuItems={menuItems}
          isPublished={menu.isPublished}
          onEditClick={handleEditMenuItemsClick}
        />

        <InventoryCard
          inventory={inventory}
          onAddClick={() => setIsAddingInventory(true)}
          onEditClick={handleEditInventoryClick}
          onDeleteClick={setDeletingInventory}
        />

        <NotesCard
          notes={menu.notes}
          isPublished={menu.isPublished}
          onEditClick={handleEditNotesClick}
        />
      </div>

      {/* Dialogs */}
      <EditInventoryDialog
        open={!!editingInventory}
        sizeLabel={editingInventory?.sizeLabel}
        formData={editForm}
        isPending={isUpdatingInventory}
        onOpenChange={handleCloseEditInventory}
        onFormChange={setEditForm}
        onSave={handleUpdateInventory}
      />

      <AddInventoryDialog
        open={isAddingInventory}
        menuItems={menuItems}
        formData={addForm}
        isPending={isCreatingInventory}
        onOpenChange={handleCloseAddInventory}
        onFormChange={setAddForm}
        onSave={handleAddInventory}
      />

      <DeleteInventoryDialog
        open={!!deletingInventory}
        sizeLabel={deletingInventory?.sizeLabel}
        isPending={isDeletingInventory}
        onOpenChange={handleCloseDeleteInventory}
        onConfirm={handleDeleteInventory}
      />

      <EditNotesDialog
        open={isEditingNotes}
        notes={notesForm}
        isPending={isUpdatingMenu}
        onOpenChange={setIsEditingNotes}
        onNotesChange={setNotesForm}
        onSave={handleSaveNotes}
      />

      <EditMenuItemsDialog
        open={isEditingMenuItems}
        selectedItems={selectedMenuItems}
        isPending={isUpdatingMenu}
        onOpenChange={setIsEditingMenuItems}
        onItemsChange={setSelectedMenuItems}
        onSave={handleSaveMenuItems}
      />
    </div>
  );
}
