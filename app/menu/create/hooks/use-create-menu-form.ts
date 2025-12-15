"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateMenu } from "../../hooks";
import { CreateMenuFormSchema, CreateMenuFormData, Step } from "../schema";

export function useCreateMenuForm() {
  const router = useRouter();
  const createMenuMutation = useCreateMenu();
  const [step, setStep] = useState<Step>(1);
  const [menuItemsMap, setMenuItemsMap] = useState<Record<string, string>>({});

  const form = useForm<CreateMenuFormData>({
    resolver: zodResolver(CreateMenuFormSchema),
    defaultValues: {
      date: "",
      menuType: undefined,
      menuItems: [],
      inventory: [],
      notes: "",
      isDraft: true,
    },
    mode: "onChange", // Validate on change for real-time error clearing
  });

  const {
    fields: inventoryFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "inventory",
  });

  const {
    watch,
    setValue,
    trigger,
    register,
    formState: { errors },
  } = form;

  const formData = watch();

  // Step validation
  const validateStep = async (currentStep: Step): Promise<boolean> => {
    switch (currentStep) {
      case 1:
        return await trigger("date");
      case 2:
        return await trigger("menuType");
      case 3:
        return await trigger("menuItems");
      case 4:
        return await trigger("inventory");
      default:
        return true;
    }
  };

  // Navigation handlers
  const handleNext = async () => {
    const isValid = await validateStep(step);
    if (!isValid) return;

    if (step < 5) {
      setStep((step + 1) as Step);
    }
    createMenuMutation.reset(); // Clear mutation state on step change
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
    createMenuMutation.reset();
  };

  // Inventory handlers
  const addInventoryItemForMenuItem = (menuItemId: string) => {
    append({
      id: `inv_${Date.now()}`,
      menuItemId,
      sizeLabel: "",
      quantity: 0,
      price: 0,
      calories: undefined,
      isDefault: false,
    });
    // Trigger validation for inventory items after adding
    // This runs InventoryItemSchema validation on all items
    setTimeout(() => trigger("inventory"), 0);
  };

  // Handle isDefault toggle - unmark others for same menu item
  const handleIsDefaultChange = (index: number, checked: boolean) => {
    // Get current inventory values directly from form
    const currentInventory = form.getValues("inventory");
    const currentMenuItemId = currentInventory[index]?.menuItemId;

    if (checked && currentMenuItemId) {
      // Unmark other defaults for the same menu item
      currentInventory.forEach((item, idx) => {
        if (
          item.menuItemId === currentMenuItemId &&
          idx !== index &&
          item.isDefault
        ) {
          setValue(`inventory.${idx}.isDefault`, false);
        }
      });
    }

    // Set the current item's isDefault value
    setValue(`inventory.${index}.isDefault`, checked);

    // Trigger validation on the entire inventory array to run .refine() validation
    setTimeout(() => trigger("inventory"), 0);
  };

  const removeInventoryItem = (index: number) => {
    remove(index);
  };

  // Form submission
  const onSubmit = (data: CreateMenuFormData) => {
    createMenuMutation.mutate(
      {
        date: data.date,
        menuType: data.menuType,
        menuItems: data.menuItems,
        inventory: data.inventory.map((item) => ({
          menuItemId: item.menuItemId,
          sizeLabel: item.sizeLabel,
          quantity: item.quantity,
          price: item.price,
          calories: item.calories,
          isDefault: item.isDefault,
        })),
        notes: data.notes,
        isDraft: data.isDraft,
      },
      {
        onSuccess: () => {
          toast.success(
            data.isDraft
              ? "Menu saved as draft successfully!"
              : "Menu created successfully!"
          );
          router.push("/menu");
        },
        onError: (
          error: Error & { response?: { data?: { message?: string } } }
        ) => {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to create menu";
          toast.error(errorMsg);
        },
      }
    );
  };

  const handleCreateMenu = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      onSubmit(form.getValues());
    }
  };

  return {
    // Form state
    form,
    formData,
    errors,
    setValue,
    register,

    // Step state
    step,
    setStep,

    // Navigation
    handleNext,
    handlePrevious,

    // Inventory
    inventoryFields,
    addInventoryItemForMenuItem,
    handleIsDefaultChange,
    removeInventoryItem,

    // Menu items map (for displaying names)
    menuItemsMap,
    setMenuItemsMap,

    // Mutation state
    createMenuMutation,
    handleCreateMenu,
    isSubmitting: createMenuMutation.isPending,
  };
}
