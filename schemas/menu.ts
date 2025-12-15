import { z } from "zod";

export interface MenuImage {
  _id?: string;
  key: string; // S3 object key
  url: string; // Full image URL
  isPrimary: boolean;
  position: number; // Ordering index
}

export const CreateMenuItemSchema = z.object({
  name: z.string().min(2),
  description: z.string().max(5000).optional(),
  images: z
    .array(
      z.object({
        key: z.string(),
        url: z.url({ message: "invalid url" }),
        isPrimary: z.boolean().optional(),
        position: z.number().optional(),
      })
    )
    .optional(),
  isVeg: z.boolean(),
  cuisine: z.string().optional(),
  tags: z.array(z.string()).optional(),
  dietaryTags: z.array(z.string()).optional(),
});

export const CreateUploadUrlSchema = z.object({
  contentType: z
    .string({ message: "contentType is required" })
    .min(1, "contentType is required"),

  contentLength: z
    .number({
      message: "contentLength is required and should be a number",
    })
    .positive({ message: "contentLength must be greater than 0" }),
});

export const AttachImageSchema = z.object({
  key: z.string({ message: "key is required" }),
  url: z
    .string()
    .min(1, { message: "url is required" })
    .refine(
      (val) => {
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Invalid URL" }
    ),
  isPrimary: z.boolean().optional(),
});

// Inventory Schema
export const InventoryItemSchema = z.object({
  menuItemId: z.string().regex(/^[0-9a-f]{24}$/i, "Invalid menu item ID"),
  sizeLabel: z
    .string()
    .min(1, "Size label is required")
    .max(50, "Size label too long"),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(0, "Quantity cannot be negative"),
  price: z.number().min(0, "Price cannot be negative"),
  calories: z.number().min(0, "Calories cannot be negative").optional(),
  isDefault: z.boolean().optional(),
});

export type AttachImageToMenuPayload = z.infer<typeof AttachImageSchema>;
export type UploadImagePayload = z.infer<typeof CreateUploadUrlSchema>;
export type CreateMenuItemPayload = z.infer<typeof CreateMenuItemSchema>;

export type S3UrlResponse = {
  uploadUrl: string; // Pre-signed S3 upload URL
  key: string; // S3 object key
  url: string; // Public URL of the uploaded image
};
export interface MenuItemResponse {
  _id: string;

  name: string;
  slug: string;
  description?: string;

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
