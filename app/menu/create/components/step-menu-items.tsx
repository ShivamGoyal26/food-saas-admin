"use client";

import { memo } from "react";
import { MenuItemSearch } from "../../components/menu-item-search";
import { FieldError } from "@/components/ui/field";

interface StepMenuItemsProps {
  selectedItems: string[];
  menuType?: string;
  error?: { message?: string };
  onItemsChange: (items: string[]) => void;
  onItemsDataChange: (itemsMap: Record<string, string>) => void;
}

export const StepMenuItems = memo(function StepMenuItems({
  selectedItems,
  menuType,
  error,
  onItemsChange,
  onItemsDataChange,
}: StepMenuItemsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Select Menu Items</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Choose which dishes to include in this {menuType || "menu"}
        </p>
        <MenuItemSearch
          selectedItems={selectedItems}
          onItemsChange={onItemsChange}
          onItemsDataChange={onItemsDataChange}
        />
        {error && <FieldError className="mt-2">{error.message}</FieldError>}
      </div>
    </div>
  );
});
