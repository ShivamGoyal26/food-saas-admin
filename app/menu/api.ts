import apiClient from "@/lib/api-client";
import { z } from "zod";

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

export const CreateMenuSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  menuType: z.enum(["breakfast", "lunch", "dinner"]),
  menuItems: z.array(
    z.string().regex(/^[0-9a-f]{24}$/i, "Invalid menu item ID")
  ),
  inventory: z
    .array(InventoryItemSchema)
    .min(1, "At least one inventory item is required")
    .optional(),
  notes: z.string().optional(),
  isDraft: z.boolean(),
});

export const PublishMenuSchema = z.object({
  menuId: z.string().regex(/^[0-9a-f]{24}$/i, "Invalid menu ID"),
  menuItemIds: z
    .array(z.string().regex(/^[0-9a-f]{24}$/i, "Invalid menu item ID"))
    .min(1, "At least one menu item ID is required"),
});

export const GetMenuByDateSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export const UpdateInventorySchema = z.object({
  quantity: z.number().int().min(0, "Quantity cannot be negative").optional(),
  price: z.number().min(0.01, "Price must be greater than 0").optional(),
  calories: z.number().min(0, "Calories cannot be negative").optional(),
  isDefault: z.boolean().optional(),
});

export const CreateInventoryItemSchema = z.object({
  menuItemId: z.string().regex(/^[0-9a-f]{24}$/i, "Invalid menu item ID"),
  sizeLabel: z
    .string()
    .min(1, "Size label is required")
    .max(50, "Size label too long"),
  quantity: z.number().int().min(0, "Quantity cannot be negative"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  calories: z.number().min(0, "Calories cannot be negative").optional(),
  isDefault: z.boolean().optional(),
});

export const CreateInventorySchema = z.object({
  inventory: z
    .array(CreateInventoryItemSchema)
    .min(1, "At least one inventory item is required"),
});

export const UpdateMenuSchema = z.object({
  menuItems: z
    .array(z.string().regex(/^[0-9a-f]{24}$/i, "Invalid menu item ID"))
    .min(1, "At least one menu item is required")
    .optional(),
  notes: z.string().optional(),
});

export type CreateMenuPayload = z.infer<typeof CreateMenuSchema>;
export type PublishMenuPayload = z.infer<typeof PublishMenuSchema>;
export type GetMenuByDatePayload = z.infer<typeof GetMenuByDateSchema>;
export type UpdateInventoryPayload = z.infer<typeof UpdateInventorySchema>;
export type CreateInventoryItemPayload = z.infer<
  typeof CreateInventoryItemSchema
>;
export type CreateInventoryPayload = z.infer<typeof CreateInventorySchema>;
export type UpdateMenuPayload = z.infer<typeof UpdateMenuSchema>;

export interface MenuItemSize {
  label: string;
  priceInPaise: number;
  calories: number;
  isDefault: boolean;
  _id: string;
}

export interface MenuItemImage {
  key: string;
  url: string;
  isPrimary: boolean;
  position: number;
  _id: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  sizes: MenuItemSize[];
  images: MenuItemImage[];
  isVeg: boolean;
  tags: string[];
  dietaryTags: string[];
}

export interface InventoryItem {
  menu: string;
  menuItem: string;
  sizeLabel: string;
  quantity: number;
  price: number;
  calories: number;
  isDefault: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Inventory item with populated menuItem for detail responses
export interface InventoryItemPopulated {
  _id: string;
  menuItem: {
    _id: string;
    name: string;
    slug: string;
    isVeg: boolean;
  };
  sizeLabel: string;
  quantity: number;
  price: number;
  calories: number;
  isDefault: boolean;
}

export interface MenuResponse {
  _id: string;
  date: string;
  menuType: "breakfast" | "lunch" | "dinner";
  menuItems: MenuItem[] | string[];
  isActive: boolean;
  isPublished: boolean;
  isDraft: boolean;
  createdBy: string;
  isDeleted: boolean;
  notes?: string;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateMenuResponse {
  message: string;
  menu: MenuResponse;
  inventory: InventoryItem[];
}

export type MenuType = {
  createdAt: string;
  createdBy: string;
  date: string;
  isActive: boolean;
  isDeleted: boolean;
  isDraft: boolean;
  isPublished: boolean;
  menuItems: MenuItem[];
  menuType: "breakfast" | "lunch" | "dinner";
  _id: string;
  notes?: string;
  totalItems: number;
  updatedAt: string;
  __v: number;
};

export interface MenuWithInventory {
  menu: MenuType;
  inventory: InventoryItem[];
}

export interface MenusByDateResponse {
  message: string;
  date: string;
  menus: {
    breakfast?: MenuWithInventory;
    lunch?: MenuWithInventory;
    dinner?: MenuWithInventory;
  };
}

export const createMenu = (payload: CreateMenuPayload) =>
  apiClient.post<CreateMenuResponse>("/menu", payload).then((res) => res.data);

export const publishMenu = (payload: PublishMenuPayload) =>
  apiClient
    .post<{ message: string; data: MenuResponse[] }>("/menu/publish/", payload)
    .then((res) => res.data);

export const getMenuById = (id: string) =>
  apiClient.get<MenuResponse>(`/menu/${id}`).then((res) => res.data);

export const getMenusByDate = (date: string) =>
  apiClient
    .get<MenusByDateResponse>(`/menu/by-date/${date}`)
    .then((res) => res.data);

export const updateInventory = (
  menuId: string,
  inventoryId: string,
  payload: UpdateInventoryPayload
) =>
  apiClient
    .patch<{ message: string; inventory: InventoryItem }>(
      `/menu/${menuId}/inventory/${inventoryId}`,
      payload
    )
    .then((res) => res.data);

export const deleteInventory = (menuId: string, inventoryId: string) =>
  apiClient
    .delete<{ message: string }>(`/menu/${menuId}/inventory/${inventoryId}`)
    .then((res) => res.data);

export const createInventory = (
  menuId: string,
  payload: CreateInventoryPayload
) =>
  apiClient
    .post<{ message: string; inventory: InventoryItem }>(
      `/menu/${menuId}/inventory`,
      payload
    )
    .then((res) => res.data);

export interface MenuDetailResponse {
  message: string;
  menu: MenuType & {
    createdBy: {
      name: string;
      email: string;
    };
  };
  inventory: InventoryItemPopulated[];
}

export const getMenuDetail = (menuId: string) =>
  apiClient.get<MenuDetailResponse>(`/menu/${menuId}`).then((res) => res.data);

export const unpublishMenu = (menuId: string) =>
  apiClient
    .post<{ message: string; menu: MenuType }>(`/menu/${menuId}/unpublish`)
    .then((res) => res.data);

export const updateMenu = (menuId: string, payload: UpdateMenuPayload) =>
  apiClient.put<MenuType>(`/menu/${menuId}`, payload).then((res) => res.data);
