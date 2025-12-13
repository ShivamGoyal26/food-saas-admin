import apiClient from "@/lib/api-client";
import { z } from "zod";

export const CreateMenuSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  menuType: z.enum(["breakfast", "lunch", "dinner"]),
  menuItems: z.array(
    z.string().regex(/^[0-9a-f]{24}$/i, "Invalid menu item ID")
  ),
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

export type CreateMenuPayload = z.infer<typeof CreateMenuSchema>;
export type PublishMenuPayload = z.infer<typeof PublishMenuSchema>;
export type GetMenuByDatePayload = z.infer<typeof GetMenuByDateSchema>;

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

export interface MenuResponse {
  _id: string;
  date: string;
  menuType: "breakfast" | "lunch" | "dinner";
  menuItems: MenuItem[];
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

type MenuType = {
  createdAt: string;
  createdBy: string;
  date: string;
  isActive: boolean;
  isDeleted: boolean;
  isDraft: boolean;
  isPublished: boolean;
  menuItems: MenuItem[];
  menuType: "breakfast";
  _id: string;
  notes?: string;
  totalItems: number;
  updatedAt: string;
  __v: number;
};

export interface MenusByDateResponse {
  message: string;
  date: string;
  menus: {
    breakfast?: MenuType;
    lunch?: MenuType;
    dinner?: MenuType;
  };
}

export const createMenu = (payload: CreateMenuPayload) =>
  apiClient.post<MenuResponse>("/menu", payload).then((res) => res.data);

export const publishMenu = (payload: PublishMenuPayload) =>
  apiClient
    .post<{ message: string; data: MenuResponse[] }>("/menu/publish/", payload)
    .then((res) => res.data);

export const getMenus = () =>
  apiClient.get<MenuResponse[]>("/menu").then((res) => res.data);

export const getMenuById = (id: string) =>
  apiClient.get<MenuResponse>(`/menu/${id}`).then((res) => res.data);

export const getMenusByDate = (date: string) =>
  apiClient
    .get<MenusByDateResponse>(`/menu/by-date/${date}`)
    .then((res) => res.data);
