"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { toast } from "sonner";
import { useUpdateInventory } from "../../hooks";
import { EditInventorySchema, EditInventoryFormData } from "./schema";
import { EditInventoryDialogProps } from "./types";

export function EditInventoryDialog({
  inventory,
  isOpen,
  onClose,
  menuId,
}: EditInventoryDialogProps) {
  const updateInventoryMutation = useUpdateInventory();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditInventoryFormData>({
    resolver: zodResolver(EditInventorySchema),
    defaultValues: {
      quantity: 0,
      price: 0,
      calories: 0,
      isDefault: false,
    },
    mode: "onChange",
  });

  const isDefault = watch("isDefault");

  // Reset form when inventory changes
  useEffect(() => {
    if (inventory) {
      reset({
        quantity: inventory.quantity,
        price: inventory.price,
        calories: inventory.calories || 0,
        isDefault: inventory.isDefault || false,
      });
    }
  }, [inventory, reset]);

  const onSubmit = (data: EditInventoryFormData) => {
    if (!inventory || !menuId) return;

    updateInventoryMutation.mutate(
      {
        menuId,
        inventoryId: inventory._id,
        payload: {
          quantity: data.quantity,
          price: data.price,
          calories: data.calories,
          isDefault: data.isDefault,
        },
      },
      {
        onSuccess: () => {
          toast.success("Inventory updated successfully!");
          onClose();
        },
        onError: (
          error: Error & { response?: { data?: { message?: string } } }
        ) => {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to update inventory";
          toast.error(errorMsg);
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Inventory</DialogTitle>
          <DialogDescription>
            Update the inventory details for {inventory?.sizeLabel}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <Field>
            <FieldLabel htmlFor="quantity">Quantity *</FieldLabel>
            <Input
              id="quantity"
              type="number"
              min={1}
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <FieldError>{errors.quantity.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="price">Price (₹) *</FieldLabel>
            <Input
              id="price"
              type="number"
              min={0.01}
              step={0.01}
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && <FieldError>{errors.price.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="calories">Calories (optional)</FieldLabel>
            <Input
              id="calories"
              type="number"
              min={0}
              {...register("calories", {
                setValueAs: (v) =>
                  v === "" || v === null || v === undefined
                    ? undefined
                    : Number(v),
              })}
            />
            {errors.calories && (
              <FieldError>{errors.calories.message}</FieldError>
            )}
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="isDefault">Default Size</FieldLabel>
              <Switch
                id="isDefault"
                checked={isDefault}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
              />
            </div>
          </Field>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateInventoryMutation.isPending}>
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
