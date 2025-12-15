"use client";

import { memo } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Plus, Trash2 } from "lucide-react";
import { InventoryItemData, CreateMenuFormData } from "../schema";

interface InventoryFieldWithIndex extends InventoryItemData {
  index: number;
}

// Type for inventory errors array
type InventoryErrors = FieldErrors<CreateMenuFormData>["inventory"];

interface StepInventoryProps {
  menuItems: string[];
  menuItemsMap: Record<string, string>;
  inventoryFields: InventoryItemData[];
  errors?: InventoryErrors;
  register: UseFormRegister<CreateMenuFormData>;
  onAddItem: (menuItemId: string) => void;
  onIsDefaultChange: (index: number, checked: boolean) => void;
  onRemoveItem: (index: number) => void;
}

// Helper to get root error message from refine validation
function getRootErrorMessage(errors?: InventoryErrors): string | undefined {
  console.log("Errors:", errors);
  if (!errors) return undefined;

  // Root level error from .refine() on array - errors.root.message
  if (errors && typeof errors === "object" && "root" in errors) {
    const root = errors.root as { message?: string } | undefined;
    if (root?.message) return root.message;
  }

  // Direct message on the errors object
  if (errors && typeof errors === "object" && "message" in errors) {
    const msg = (errors as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }

  return undefined;
}

// Helper to get field-level errors
function getFieldError(
  errors: InventoryErrors,
  index: number
): FieldErrors<InventoryItemData> | undefined {
  if (!errors || !Array.isArray(errors)) return undefined;
  return errors[index] as FieldErrors<InventoryItemData> | undefined;
}

export const StepInventory = memo(function StepInventory({
  menuItems,
  menuItemsMap,
  inventoryFields,
  errors,
  register,
  onAddItem,
  onIsDefaultChange,
  onRemoveItem,
}: StepInventoryProps) {
  const rootErrorMessage = getRootErrorMessage(errors);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Set Inventory</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Define sizes, quantities, and prices for each menu item
        </p>

        {rootErrorMessage && (
          <FieldError className="mb-4">{rootErrorMessage}</FieldError>
        )}

        <div className="space-y-6">
          {menuItems.map((menuItemId) => {
            const itemInventories: InventoryFieldWithIndex[] = inventoryFields
              .map((field, index) => ({ ...field, index }))
              .filter((inv) => inv.menuItemId === menuItemId);
            const menuItemName = menuItemsMap[menuItemId] || menuItemId;
            const hasDefault = itemInventories.some((inv) => inv.isDefault);

            return (
              <div
                key={menuItemId}
                className="border rounded-lg p-4 space-y-4 bg-muted/30"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-base">{menuItemName}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {itemInventories.length} size(s) configured
                    </p>
                  </div>
                  {!hasDefault && itemInventories.length > 0 && (
                    <span className="text-xs text-red-500 font-medium">
                      Select a default size
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {itemInventories.map((item, idx) => (
                    <InventoryItemForm
                      key={`${item.menuItemId}-${item.index}`}
                      item={item}
                      itemIndex={idx}
                      canRemove={itemInventories.length > 1}
                      errors={getFieldError(errors, item.index)}
                      register={register}
                      onIsDefaultChange={onIsDefaultChange}
                      onRemove={() => onRemoveItem(item.index)}
                    />
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onAddItem(menuItemId)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Size for this Item
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

// Sub-component for individual inventory item form
interface InventoryItemFormProps {
  item: InventoryFieldWithIndex;
  itemIndex: number;
  canRemove: boolean;
  errors?: FieldErrors<InventoryItemData>;
  register: UseFormRegister<CreateMenuFormData>;
  onIsDefaultChange: (index: number, checked: boolean) => void;
  onRemove: () => void;
}

function InventoryItemForm({
  item,
  itemIndex,
  canRemove,
  errors,
  register,
  onIsDefaultChange,
  onRemove,
}: InventoryItemFormProps) {
  return (
    <div className="border bg-background rounded-md p-3 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Size {itemIndex + 1}</span>
        {canRemove && (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field>
          <FieldLabel className="text-xs">Size Label *</FieldLabel>
          <Input
            placeholder="e.g., Regular, Large"
            {...register(`inventory.${item.index}.sizeLabel`)}
            className="h-9"
          />
          {errors?.sizeLabel && (
            <FieldError>{errors.sizeLabel.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel className="text-xs">Quantity *</FieldLabel>
          <Input
            type="number"
            placeholder="1"
            min={1}
            {...register(`inventory.${item.index}.quantity`, {
              valueAsNumber: true,
              min: 1,
            })}
            className="h-9"
          />
          {errors?.quantity && (
            <FieldError>{errors.quantity.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel className="text-xs">Price (₹) *</FieldLabel>
          <Input
            type="number"
            placeholder="1"
            step="1"
            min={1}
            {...register(`inventory.${item.index}.price`, {
              valueAsNumber: true,
              min: 1,
            })}
            className="h-9"
          />
          {errors?.price && <FieldError>{errors.price.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel className="text-xs">Calories (optional)</FieldLabel>
          <Input
            type="number"
            placeholder="0"
            {...register(`inventory.${item.index}.calories`, {
              setValueAs: (v) =>
                v === "" || v === null || v === undefined
                  ? undefined
                  : Number(v),
            })}
            className="h-9"
          />
        </Field>

        <Field>
          <FieldLabel className="text-xs">Default Size *</FieldLabel>
          <div
            className={`flex items-center h-9 border rounded-md px-3 bg-background ${
              item.isDefault
                ? "border-green-500 bg-green-50 dark:bg-green-950"
                : ""
            }`}
          >
            <input
              type="checkbox"
              checked={item.isDefault || false}
              onChange={(e) => onIsDefaultChange(item.index, e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="ml-2 text-xs">Mark as default</span>
          </div>
        </Field>
      </div>
    </div>
  );
}
