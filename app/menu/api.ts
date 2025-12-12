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

export type CreateMenuPayload = z.infer<typeof CreateMenuSchema>;
export type PublishMenuPayload = z.infer<typeof PublishMenuSchema>;

export interface MenuResponse {
  _id: string;
  date: string;
  menuType: "breakfast" | "lunch" | "dinner";
  menuItems: string[];
  notes?: string;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
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
