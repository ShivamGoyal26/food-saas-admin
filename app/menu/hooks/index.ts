import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query-client";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import {
  createMenu,
  publishMenu,
  getMenus,
  getMenuById,
  getMenusByDate,
  CreateMenuPayload,
  PublishMenuPayload,
  MenuResponse,
  MenusByDateResponse,
} from "../api";
import { queryKeys } from "@/lib/query-keys";

export const useGetMenus = () => {
  return useQuery({
    queryKey: queryKeys.menus,
    queryFn: async () => getMenus(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetMenuById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.menuById(id),
    queryFn: async () => getMenuById(id),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
  return useMutation<MenuResponse, AxiosError<ApiError>, CreateMenuPayload>({
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
