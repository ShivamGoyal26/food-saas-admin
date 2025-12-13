import { S3UrlResponse } from "./../../../schemas/menu";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { queryClient } from "@/lib/react-query-client";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import {
  attachImageToMenu,
  createMenuItem,
  deleteMenuById,
  deleteMenuItemImage,
  getDeletedMenuItems,
  getMenuById,
  getMenuItems,
  getS3SignedUrl,
  getUploadUrl,
  permanentlyDeleteMenuItem,
  restoreMenuItem,
  updateMenuItem,
  updateMenuItemPayload,
} from "../api";
import {
  AttachImageToMenuPayload,
  CreateMenuItemPayload,
  MenuItemResponse,
  MenuItemsResponse,
  UploadImagePayload,
} from "@/schemas/menu";

// src/types/menu.ts

export const useGetMenuItems = () => {
  return useQuery({
    queryKey: queryKeys.menuItems,
    queryFn: async () => getMenuItems(),
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useGetMenuById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.menuItemById(id),
    queryFn: async () => getMenuById(id),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateMenuItem = () => {
  return useMutation<
    MenuItemsResponse,
    AxiosError<ApiError>,
    CreateMenuItemPayload
  >({
    mutationFn: (payload) => createMenuItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menuItems });
    },
  });
};

export const useUpdateMenuItem = () => {
  return useMutation<
    MenuItemsResponse,
    AxiosError<ApiError>,
    updateMenuItemPayload
  >({
    mutationFn: (vars) => updateMenuItem(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menuItems });
      queryClient.invalidateQueries({
        queryKey: queryKeys.deletedMenuItems,
      });
    },
  });
};

export const useDeleteMenuItem = () => {
  return useMutation<MenuItemsResponse, AxiosError<ApiError>, string>({
    mutationFn: (id) => deleteMenuById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menuItems });
      queryClient.invalidateQueries({ queryKey: queryKeys.deletedMenuItems });
    },
  });
};

export type useGetUploadUrlProps = {
  payload: UploadImagePayload;
  menuId: string;
};

export const useGetUploadUrl = () => {
  return useMutation<S3UrlResponse, AxiosError<ApiError>, useGetUploadUrlProps>(
    {
      mutationFn: (parmas) => getUploadUrl(parmas),
    }
  );
};

export type useAttachImageToMenuPayload = {
  menuId: string;
  payload: AttachImageToMenuPayload;
};

export const useAttachImageToMenu = () => {
  return useMutation<
    MenuItemResponse,
    AxiosError<ApiError>,
    useAttachImageToMenuPayload
  >({
    mutationFn: (payload) => attachImageToMenu(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.menuItemById(variables.menuId),
      });
    },
  });
};

export const useGetS3SignedUrl = () => {
  return useMutation<{ url: string }, AxiosError<ApiError>, { key: string }>({
    mutationFn: (payload) => getS3SignedUrl(payload),
  });
};

export const useDeleteMenuItemImage = () => {
  return useMutation<
    { menuItem: MenuItemResponse },
    AxiosError<ApiError>,
    { menuId: string; imageId: string }
  >({
    mutationFn: (payload) => deleteMenuItemImage(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.menuItemById(variables.menuId),
      });
    },
  });
};

export const useGetDeletedMenuItems = () => {
  return useQuery({
    queryKey: queryKeys.deletedMenuItems,
    queryFn: async () => getDeletedMenuItems(),
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useRestoreMenuItem = () => {
  return useMutation<MenuItemResponse, AxiosError<ApiError>, string>({
    mutationFn: (id) => restoreMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.deletedMenuItems,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.menuItems });
    },
  });
};

export const usePermanentlyDeleteMenuItem = () => {
  return useMutation<{ message: string }, AxiosError<ApiError>, string>({
    mutationFn: (id) => permanentlyDeleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.deletedMenuItems,
      });
    },
  });
};
