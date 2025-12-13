"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MenuItemsTable } from "./components/menu-items-table";
import { useGetMenuItems } from "./hooks";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

// MenuItem component is preserved for future use but not used currently
// import MenuItem from "./components/menu-item";

export default function Page() {
  const { data = [], isLoading } = useGetMenuItems();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Menu Items</h1>
          <p className="text-lg text-muted-foreground">
            Manage all your restaurant menu items in one place
          </p>
        </div>

        {/* Action Bar */}
        <div className="mb-8">
          <Button
            onClick={() => router.push("/menu-items/create")}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Menu Item
          </Button>
        </div>

        {/* Table Card */}
        <Card className="p-6 border border-border/50">
          <MenuItemsTable items={data} isLoading={isLoading} />
        </Card>
      </div>
    </div>
  );
}
