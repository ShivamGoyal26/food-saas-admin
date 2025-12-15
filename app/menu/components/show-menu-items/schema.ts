import { z } from "zod";

export const EditInventorySchema = z.object({
  quantity: z
    .number()
    .int("Must be a whole number")
    .min(1, "Quantity must be at least 1"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  calories: z.number().min(0, "Cannot be negative").optional(),
  isDefault: z.boolean(),
});

export type EditInventoryFormData = z.infer<typeof EditInventorySchema>;
