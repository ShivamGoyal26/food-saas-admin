import { z } from "zod";

// Zod Schemas
export const InventoryItemSchema = z.object({
  id: z.string(),
  menuItemId: z.string().min(1, "Menu item is required"),
  sizeLabel: z
    .string()
    .min(1, "Size label is required")
    .max(50, "Size label too long"),
  quantity: z
    .number()
    .int("Must be a whole number")
    .min(1, "Quantity must be at least 1"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  calories: z.number().min(0, "Cannot be negative").optional(),
  isDefault: z.boolean().optional(),
});

export const CreateMenuFormSchema = z.object({
  date: z.string().min(1, "Please select a date"),
  menuType: z.enum(["breakfast", "lunch", "dinner"], {
    message: "Please select a menu type",
  }),
  menuItems: z.array(z.string()).min(1, "Please select at least one menu item"),
  inventory: z
    .array(InventoryItemSchema)
    .min(1, "Please add at least one inventory item")
    .refine(
      (inventory) => {
        // Optimized: Use Set to track menu items with defaults in single pass
        const menuItemsWithDefault = new Set(
          inventory.filter((inv) => inv.isDefault).map((inv) => inv.menuItemId)
        );
        const allMenuItemIds = new Set(inventory.map((inv) => inv.menuItemId));

        // Check if every menu item has at least one default
        return [...allMenuItemIds].every((id) => menuItemsWithDefault.has(id));
      },
      {
        message: "Each menu item must have at least one default size selected",
      }
    ),
  notes: z.string().optional(),
  isDraft: z.boolean(),
});

// Types
export type CreateMenuFormData = z.infer<typeof CreateMenuFormSchema>;
export type InventoryItemData = z.infer<typeof InventoryItemSchema>;
export type Step = 1 | 2 | 3 | 4 | 5;
export type MenuType = "breakfast" | "lunch" | "dinner";

// Constants
export const MENU_TYPES: readonly MenuType[] = [
  "breakfast",
  "lunch",
  "dinner",
] as const;

export const STEP_LABELS: Record<Step, string> = {
  1: "Date",
  2: "Type",
  3: "Items",
  4: "Inventory",
  5: "Notes",
};
