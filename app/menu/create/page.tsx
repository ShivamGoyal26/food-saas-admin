"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { DatePicker } from "@/components/ui/date-picker";
import { MenuItemSearch } from "../components/menu-item-search";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { useCreateMenu } from "../hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";

type Step = 1 | 2 | 3 | 4 | 5;

const MENU_TYPES = ["breakfast", "lunch", "dinner"] as const;

export interface InventoryItem {
  id: string;
  menuItemId: string;
  sizeLabel: string;
  quantity: number;
  price: number;
  calories?: number;
  isDefault?: boolean;
}

export default function MenuCreatePage() {
  const router = useRouter();
  const createMenuMutation = useCreateMenu();

  const [step, setStep] = useState<Step>(1);
  const [isDraft, setIsDraft] = useState(true);
  const [formData, setFormData] = useState({
    date: "",
    menuType: "",
    menuItems: [] as string[],
    inventory: [] as InventoryItem[],
    notes: "",
  });

  // Map to store menu item names by ID
  const [menuItemsMap, setMenuItemsMap] = useState<Record<string, string>>({});

  const isDateValid = formData.date !== "";
  const isMenuTypeValid = formData.menuType !== "";
  const areItemsSelected = formData.menuItems.length > 0;
  const isInventoryValid = formData.inventory.length > 0;
  const isFormValid =
    isDateValid && isMenuTypeValid && areItemsSelected && isInventoryValid;

  const handleNext = () => {
    if (step === 1 && !isDateValid) {
      toast.error("Please select a date");
      return;
    }
    if (step === 2 && !isMenuTypeValid) {
      toast.error("Please select a menu type");
      return;
    }
    if (step === 3 && !areItemsSelected) {
      toast.error("Please select at least one menu item");
      return;
    }
    if (step === 4 && !isInventoryValid) {
      toast.error("Please add at least one inventory item");
      return;
    }

    if (step < 5) {
      setStep((step + 1) as Step);
    }
    // Clear error when navigating
    createMenuMutation.reset();
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
    // Clear error when navigating
    createMenuMutation.reset();
  };

  const addInventoryItemForMenuItem = (menuItemId: string) => {
    const newItem: InventoryItem = {
      id: `inv_${Date.now()}`,
      menuItemId,
      sizeLabel: "",
      quantity: 0,
      price: 0,
      calories: undefined,
      isDefault: false,
    };
    setFormData({
      ...formData,
      inventory: [...formData.inventory, newItem],
    });
  };

  const removeInventoryItem = (id: string) => {
    setFormData({
      ...formData,
      inventory: formData.inventory.filter((item) => item.id !== id),
    });
  };

  const updateInventoryItem = (
    id: string,
    field: keyof InventoryItem,
    value: any
  ) => {
    setFormData({
      ...formData,
      inventory: formData.inventory.map((item) => {
        // If setting isDefault to true, find the menu item ID and unmark others
        if (field === "isDefault" && value === true && item.id === id) {
          return { ...item, [field]: value };
        }

        // Unmark other items for the same menu item if this one is being marked as default
        if (field === "isDefault" && value === true) {
          const targetItem = formData.inventory.find((i) => i.id === id);
          if (
            targetItem &&
            item.menuItemId === targetItem.menuItemId &&
            item.id !== id
          ) {
            return { ...item, isDefault: false };
          }
        }

        // Regular update for non-default fields or this item
        return item.id === id ? { ...item, [field]: value } : item;
      }),
    });
  };

  const handleSaveDraft = async () => {
    if (!isFormValid) {
      toast.error("Please complete all required fields");
      return;
    }

    createMenuMutation.mutate(
      {
        date: formData.date,
        menuType: formData.menuType as "breakfast" | "lunch" | "dinner",
        menuItems: formData.menuItems,
        inventory: formData.inventory.map((item) => ({
          menuItemId: item.menuItemId,
          sizeLabel: item.sizeLabel,
          quantity: item.quantity,
          price: item.price,
          calories: item.calories,
          isDefault: item.isDefault,
        })),
        notes: formData.notes,
        isDraft: isDraft,
      },
      {
        onSuccess: () => {
          toast.success(
            isDraft
              ? "Menu saved as draft successfully!"
              : "Menu created successfully!"
          );
          router.push("/menu");
        },
        onError: (error: any) => {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to create menu";
          toast.error(errorMsg);
          console.error("Error creating menu:", error);
        },
      }
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-4">Select Menu Date</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Choose the date for this menu
              </p>
              <DatePicker
                value={formData.date}
                onChange={(date) => {
                  setFormData({ ...formData, date });
                  // Clear error on change
                  createMenuMutation.reset();
                }}
                placeholder="Select a date"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-4">Select Menu Type</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Choose what type of menu this is
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {MENU_TYPES.map((type) => (
                  <Button
                    key={type}
                    variant={formData.menuType === type ? "default" : "outline"}
                    className="h-auto py-4 flex flex-col"
                    onClick={() => {
                      setFormData({ ...formData, menuType: type });
                      // Clear error on change
                      createMenuMutation.reset();
                    }}
                  >
                    <span className="capitalize font-semibold">{type}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Select Menu Items</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Choose which dishes to include in this{" "}
                {formData.menuType || "menu"}
              </p>
              <MenuItemSearch
                selectedItems={formData.menuItems}
                onItemsChange={(items) => {
                  setFormData({ ...formData, menuItems: items });
                  // Clear error on change
                  createMenuMutation.reset();
                }}
                onItemsDataChange={(itemsMap) => {
                  setMenuItemsMap(itemsMap);
                }}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Set Inventory</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Define sizes, quantities, and prices for each menu item
              </p>

              {/* Menu Items with their Inventory */}
              <div className="space-y-6">
                {formData.menuItems.map((menuItemId) => {
                  const itemInventories = formData.inventory.filter(
                    (inv) => inv.menuItemId === menuItemId
                  );
                  const menuItemName = menuItemsMap[menuItemId] || menuItemId;

                  return (
                    <div
                      key={menuItemId}
                      className="border rounded-lg p-4 space-y-4 bg-muted/30"
                    >
                      {/* Menu Item Header */}
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-base">
                            {menuItemName}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {itemInventories.length} size(s) configured
                          </p>
                        </div>
                      </div>

                      {/* Sizes for this Menu Item */}
                      <div className="space-y-3">
                        {itemInventories.map((item, idx) => (
                          <div
                            key={item.id}
                            className="border bg-background rounded-md p-3 space-y-3"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                Size {idx + 1}
                              </span>
                              {itemInventories.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeInventoryItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {/* Size Label */}
                              <Field>
                                <FieldLabel className="text-xs">
                                  Size Label
                                </FieldLabel>
                                <Input
                                  placeholder="e.g., Regular, Large"
                                  value={item.sizeLabel}
                                  onChange={(e) =>
                                    updateInventoryItem(
                                      item.id,
                                      "sizeLabel",
                                      e.target.value
                                    )
                                  }
                                  className="h-9"
                                />
                              </Field>

                              {/* Quantity */}
                              <Field>
                                <FieldLabel className="text-xs">
                                  Quantity
                                </FieldLabel>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateInventoryItem(
                                      item.id,
                                      "quantity",
                                      Math.max(0, parseInt(e.target.value) || 0)
                                    )
                                  }
                                  className="h-9"
                                />
                              </Field>

                              {/* Price */}
                              <Field>
                                <FieldLabel className="text-xs">
                                  Price (₹)
                                </FieldLabel>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={item.price}
                                  onChange={(e) =>
                                    updateInventoryItem(
                                      item.id,
                                      "price",
                                      Math.max(
                                        0,
                                        parseFloat(e.target.value) || 0
                                      )
                                    )
                                  }
                                  className="h-9"
                                />
                              </Field>

                              {/* Calories */}
                              <Field>
                                <FieldLabel className="text-xs">
                                  Calories (optional)
                                </FieldLabel>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={item.calories || ""}
                                  onChange={(e) =>
                                    updateInventoryItem(
                                      item.id,
                                      "calories",
                                      e.target.value
                                        ? Math.max(
                                            0,
                                            parseFloat(e.target.value)
                                          )
                                        : undefined
                                    )
                                  }
                                  className="h-9"
                                />
                              </Field>

                              {/* Is Default */}
                              <Field>
                                <FieldLabel className="text-xs">
                                  Default Size
                                </FieldLabel>
                                <div className="flex items-center h-9 border rounded-md px-3 bg-background">
                                  <input
                                    type="checkbox"
                                    checked={item.isDefault || false}
                                    onChange={(e) =>
                                      updateInventoryItem(
                                        item.id,
                                        "isDefault",
                                        e.target.checked
                                      )
                                    }
                                    className="w-4 h-4 rounded"
                                  />
                                  <span className="ml-2 text-xs">
                                    Mark as default
                                  </span>
                                </div>
                              </Field>
                            </div>
                          </div>
                        ))}

                        {/* Add Size Button */}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            addInventoryItemForMenuItem(menuItemId)
                          }
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

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-4">Additional Notes</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Add any special notes or descriptions for this menu
              </p>
              <Textarea
                placeholder="e.g., Today's special breakfast, seasonal items available, etc."
                value={formData.notes}
                onChange={(e) => {
                  setFormData({ ...formData, notes: e.target.value });
                  // Clear error on change
                  createMenuMutation.reset();
                }}
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Menu</h1>
          <p className="text-muted-foreground">
            Fill out the steps below to create a new menu
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    s <= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s}
                </div>
                <p className="text-xs mt-2 text-center">
                  {s === 1 && "Date"}
                  {s === 2 && "Type"}
                  {s === 3 && "Items"}
                  {s === 4 && "Inventory"}
                  {s === 5 && "Notes"}
                </p>
              </div>
            ))}
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Alert */}
        {createMenuMutation.isError && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-destructive mb-1">Error</h3>
              <p className="text-sm text-destructive">
                {(createMenuMutation.error as any)?.response?.data?.message ||
                  (createMenuMutation.error as any)?.message ||
                  "An error occurred"}
              </p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <Card className="p-6 sm:p-8 mb-8">{renderStep()}</Card>

        {/* Summary Section */}
        <Card className="p-6 mb-8 bg-muted/50">
          <h3 className="font-semibold mb-4">Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">
                {formData.date
                  ? new Date(formData.date).toLocaleDateString()
                  : "Not selected"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Menu Type</p>
              <p className="font-medium capitalize">
                {formData.menuType || "Not selected"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Items</p>
              <p className="font-medium">
                {formData.menuItems.length} selected
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inventory</p>
              <p className="font-medium">{formData.inventory.length} items</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="font-medium">
                {formData.notes ? "Added" : "Not added"}
              </p>
            </div>
            {step === 5 && (
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{isDraft ? "Draft" : "Published"}</p>
              </div>
            )}
          </div>
        </Card>

        {step === 5 && (
          <Card className="p-6 mb-8 border-blue-200 bg-blue-50/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Menu Status</h3>
                <p className="text-sm text-muted-foreground">
                  {isDraft
                    ? "This menu will be saved as a draft"
                    : "This menu will be published immediately"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDraft"
                  checked={isDraft}
                  onChange={(e) => setIsDraft(e.target.checked)}
                  className="h-4 w-4 rounded"
                />
                <label htmlFor="isDraft" className="text-sm cursor-pointer">
                  Save as Draft
                </label>
              </div>
            </div>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1 || createMenuMutation.isPending}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={step === 5 || createMenuMutation.isPending}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="hidden sm:block" />

          {step === 5 && (
            <Button
              onClick={handleSaveDraft}
              disabled={!isFormValid || createMenuMutation.isPending}
              className="flex-1 sm:flex-none"
            >
              {createMenuMutation.isPending ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  Creating...
                </>
              ) : (
                "Create Menu"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
