"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItemsTable } from "./components/menu-items-table";
import { DeletedMenuItemsTable } from "./components/deleted-menu-items-table";
import { useGetMenuItems, useGetDeletedMenuItems } from "./hooks";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function Page() {
  const { data: activeItems = [], isLoading: activeLoading } =
    useGetMenuItems();
  const { data: deletedItems = [], isLoading: deletedLoading } =
    useGetDeletedMenuItems();
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

        {/* Tabs Section */}
        <Card className="p-6 border border-border/50">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="active">
                Active Items ({activeItems.length})
              </TabsTrigger>
              <TabsTrigger value="deleted">
                Deleted Items ({deletedItems.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              <MenuItemsTable items={activeItems} isLoading={activeLoading} />
            </TabsContent>

            <TabsContent value="deleted" className="mt-6">
              <DeletedMenuItemsTable
                items={deletedItems}
                isLoading={deletedLoading}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
