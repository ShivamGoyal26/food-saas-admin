import { z } from "zod";

export interface MenuImage {
  _id?: string;
  key: string; // S3 object key
  url: string; // Full image URL
  isPrimary: boolean;
  position: number; // Ordering index
}

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

export type MenuSize = z.infer<typeof MenuSizeSchema> & { _id: string };
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
