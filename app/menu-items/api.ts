import apiClient from "@/lib/api-client";
import {
  CreateMenuItemPayload,
  MenuItemResponse,
  MenuItemsResponse,
} from "@/schemas/menu";

export type updateMenuItemPayload = {
  menuId: string;
  payload: CreateMenuItemPayload;
};

export const getMenuItems = () =>
  apiClient.get<MenuItemsResponse>("/menu-items").then((res) => res.data);

export const getMenuById = (id: string) =>
  apiClient.get<MenuItemResponse>(`/menu-items/${id}`).then((res) => res.data);

export const createMenuItem = (payload: CreateMenuItemPayload) =>
  apiClient
    .post<MenuItemsResponse>(`/menu-items`, payload)
    .then((res) => res.data);

export const updateMenuItem = ({ menuId, payload }: updateMenuItemPayload) =>
  apiClient
    .put<MenuItemsResponse>(`/menu-items/${menuId}`, payload)
    .then((res) => res.data);

export const deleteMenuById = (id: string) =>
  apiClient
    .delete<MenuItemsResponse>(`/menu-items/${id}`)
    .then((res) => res.data);
