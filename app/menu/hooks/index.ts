import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query-client";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import {
  createMenu,
  publishMenu,
  unpublishMenu,
  updateMenu,
  getMenuById,
  getMenusByDate,
  getMenuDetail,
  updateInventory,
  deleteInventory,
  createInventory,
  CreateMenuPayload,
  PublishMenuPayload,
  UpdateMenuPayload,
  MenuResponse,
  MenuType,
  CreateMenuResponse,
  UpdateInventoryPayload,
  CreateInventoryPayload,
  InventoryItem,
  MenuDetailResponse,
} from "../api";
import { queryKeys } from "@/lib/query-keys";

export const useGetMenuById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.menuById(id),
    queryFn: async () => getMenuById(id),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetMenuDetail = (menuId: string, enabled: boolean = true) => {
  return useQuery<MenuDetailResponse, AxiosError<ApiError>>({
    queryKey: [...queryKeys.menus, menuId, "detail"],
    queryFn: async () => getMenuDetail(menuId),
    retry: false,
    enabled: enabled && !!menuId,
    staleTime: 0,
  });
};

export const useGetMenusByDate = (date: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...queryKeys.menus, date],
    queryFn: async () => getMenusByDate(date),
    retry: false,
    enabled: enabled && !!date,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useCreateMenu = () => {
  return useMutation<
    CreateMenuResponse,
    AxiosError<ApiError>,
    CreateMenuPayload
  >({
    mutationFn: (payload) => createMenu(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menus });
    },
  });
};

/**
 * Hook for publishing draft menus
 * Note: You can also publish directly by creating a menu with isDraft: false
 * This hook is kept for batch publishing draft menus
 */
export const usePublishMenu = () => {
  return useMutation<
    { message: string; data: MenuResponse[] },
    AxiosError<ApiError>,
    PublishMenuPayload
  >({
    mutationFn: (payload) => publishMenu(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menus });
    },
  });
};

/**
 * Hook for unpublishing menus
 * This will revert the menu to draft state
 */
export const useUnpublishMenu = () => {
  return useMutation<
    { message: string; menu: MenuType },
    AxiosError<ApiError>,
    { menuId: string }
  >({
    mutationFn: ({ menuId }) => unpublishMenu(menuId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menus });
    },
  });
};

/**
 * Hook for updating inventory items
 */
export const useUpdateInventory = () => {
  return useMutation<
    { message: string; inventory: InventoryItem },
    AxiosError<ApiError>,
    { menuId: string; inventoryId: string; payload: UpdateInventoryPayload }
  >({
    mutationFn: ({ menuId, inventoryId, payload }) =>
      updateInventory(menuId, inventoryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menus });
    },
  });
};

/**
 * Hook for deleting inventory items
 */
export const useDeleteInventory = () => {
  return useMutation<
    { message: string },
    AxiosError<ApiError>,
    { menuId: string; inventoryId: string }
  >({
    mutationFn: ({ menuId, inventoryId }) =>
      deleteInventory(menuId, inventoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menus });
    },
  });
};

/**
 * Hook for creating inventory items
 */
export const useCreateInventory = () => {
  return useMutation<
    { message: string; inventory: InventoryItem },
    AxiosError<ApiError>,
    { menuId: string; payload: CreateInventoryPayload }
  >({
    mutationFn: ({ menuId, payload }) => createInventory(menuId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menus });
    },
  });
};

/**
 * Hook for updating menu (notes and menuItems)
 */
export const useUpdateMenu = () => {
  return useMutation<
    MenuType,
    AxiosError<ApiError>,
    { menuId: string; payload: UpdateMenuPayload }
  >({
    mutationFn: ({ menuId, payload }) => updateMenu(menuId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menus });
    },
  });
};
