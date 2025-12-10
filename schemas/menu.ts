import { z } from "zod";

export const MenuSizeSchema = z.object({
  label: z.string().min(1, "Size label is required"),
  priceInPaise: z.number().int().positive("Price must be greater than 0"),
  calories: z.number().min(0).optional(),
  isDefault: z.boolean().optional(),
});

export const CreateMenuItemSchema = z.object({
  name: z.string().min(2),
  description: z.string().max(5000).optional(),
  sizes: z.array(MenuSizeSchema).min(1, "At least one size required"),
  images: z.array(z.string().url({ message: "Invalid URL" })).optional(),
  isVeg: z.boolean(),
  cuisine: z.string().optional(),
  tags: z.array(z.string()).optional(),
  dietaryTags: z.array(z.string()).optional(),
});

export type MenuSize = z.infer<typeof MenuSizeSchema>;
export type CreateMenuItemPayload = z.infer<typeof CreateMenuItemSchema>;

export interface MenuImage {
  _id?: string;
  key: string; // S3 object key
  url: string; // Full image URL
  isPrimary: boolean;
  position: number; // Ordering index
}

export interface MenuItemResponse {
  _id: string;

  name: string;
  slug: string;
  description?: string;

  sizes: MenuSize[];

  images: MenuImage[];

  isVeg: boolean;

  cuisine?: string;
  tags: string[];
  dietaryTags: string[];

  isActive: boolean;
  isDeleted: boolean;

  createdBy: string;
  updatedBy?: string;

  createdAt: string; // ISO date string
  updatedAt: string;
}

export type MenuItemsResponse = MenuItemResponse[];
