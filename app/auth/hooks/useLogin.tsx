import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { LoginSchema } from "@/schemas/auth";
import { z } from "zod";

type LoginPayload = z.infer<typeof LoginSchema>;

interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email?: string;
    phone?: string;
    name: string;
  };
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await apiClient.post<AuthResponse>(
        "/admin/login",
        payload
      );
      return data;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Login error:", error.response?.data?.message);
    },
  });
};
