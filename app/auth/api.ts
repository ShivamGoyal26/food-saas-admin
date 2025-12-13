import apiClient from "@/lib/api-client";

interface LogoutResponse {
  message: string;
  user: {
    _id: string;
    name: string;
    email: string;
    lastLoginAt: string;
  };
}

export const logoutUser = () =>
  apiClient.post<LogoutResponse>("/auth/logout").then((res) => res.data);
