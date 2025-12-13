import apiClient from "@/lib/api-client";
import {
  CreateMenuItemPayload,
  MenuItemResponse,
  MenuItemsResponse,
  S3UrlResponse,
} from "@/schemas/menu";
import { useAttachImageToMenuPayload, useGetUploadUrlProps } from "./hooks";

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

export const getUploadUrl = (params: useGetUploadUrlProps) =>
  apiClient
    .post<S3UrlResponse>(
      `/menu-image-upload/${params.menuId}/images/upload-url`,
      params.payload
    )
    .then((res) => res.data);

export const attachImageToMenu = (params: useAttachImageToMenuPayload) =>
  apiClient
    .post<MenuItemResponse>(
      `/menu-image-upload/${params.menuId}/images/attach`,
      params.payload
    )
    .then((res) => res.data);

export const getS3SignedUrl = (params: { key: string }) =>
  apiClient
    .post<{ url: string }>(`/menu-image-upload/getSignedUrl`, params)
    .then((res) => res.data);

export const deleteMenuItemImage = (params: {
  menuId: string;
  imageId: string;
}) =>
  apiClient
    .delete<{ menuItem: MenuItemResponse }>(
      `/menu-image-upload/${params.menuId}/images/${params.imageId}`
    )
    .then((res) => res.data);

export const getDeletedMenuItems = () =>
  apiClient
    .get<MenuItemsResponse>("/menu-items?includeDeleted=true&isActive=false")
    .then((res) => res.data);

export const restoreMenuItem = (id: string) =>
  apiClient
    .patch<MenuItemResponse>(`/menu-items/${id}/restore`)
    .then((res) => res.data);

export const permanentlyDeleteMenuItem = (id: string) =>
  apiClient
    .delete<{ message: string }>(`/menu-items/${id}/permanent`)
    .then((res) => res.data);
