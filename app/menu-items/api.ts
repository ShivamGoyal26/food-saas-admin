import apiClient from "@/lib/api-client";
import { CreateMenuItemPayload, MenuItemsResponse } from "@/schemas/menu";

export const getMenuItems = () =>
  apiClient.get<MenuItemsResponse>("/menu-items").then((res) => res.data);

export const getMenuById = (id: string) =>
  apiClient.get<MenuItemsResponse>(`/menu-items/${id}`).then((res) => res.data);

export const createMenuItem = (payload: CreateMenuItemPayload) =>
  apiClient
    .post<MenuItemsResponse>(`/menu-items`, payload)
    .then((res) => res.data);

export const updateMenuItem = (payload: CreateMenuItemPayload) =>
  apiClient
    .put<MenuItemsResponse>(`/menu-items`, payload)
    .then((res) => res.data);

export const deleteMenuById = (id: string) =>
  apiClient
    .delete<MenuItemsResponse>(`/menu-items/${id}`)
    .then((res) => res.data);
