"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useLogout } from "@/app/auth/hooks/useLogout";

export function LogoutButton() {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      variant="destructive"
      className="gap-2"
    >
      <LogOut className="w-4 h-4" />
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
