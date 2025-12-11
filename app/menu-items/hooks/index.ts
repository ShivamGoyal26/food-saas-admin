import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { queryClient } from "@/lib/react-query-client";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import {
  createMenuItem,
  deleteMenuById,
  getMenuById,
  getMenuItems,
  updateMenuItem,
  updateMenuItemPayload,
} from "../api";
import { CreateMenuItemPayload, MenuItemsResponse } from "@/schemas/menu";

// src/types/menu.ts

export const useGetMenuItems = () => {
  return useQuery({
    queryKey: queryKeys.menuItems,
    queryFn: async () => getMenuItems(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
    },
  });
};

export const useDeleteMenuItem = () => {
  return useMutation<MenuItemsResponse, AxiosError<ApiError>, string>({
    mutationFn: (id) => deleteMenuById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menuItems });
    },
  });
};
