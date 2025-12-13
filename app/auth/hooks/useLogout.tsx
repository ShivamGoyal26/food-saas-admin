import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../api";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      return await logoutUser();
    },
    onSuccess: () => {
      // Clear any stored auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login page
      router.push("/auth");
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });
};
