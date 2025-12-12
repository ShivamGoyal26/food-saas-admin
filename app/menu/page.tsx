"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useGetMenus } from "./hooks";
import { Badge } from "@/components/ui/badge";

export default function MenuPage() {
  const router = useRouter();
  const { data: menus = [], isLoading } = useGetMenus();

  // Group menus by date for calendar view
  const menusByDate = menus.reduce((acc, menu) => {
    if (!acc[menu.date]) {
      acc[menu.date] = [];
    }
    acc[menu.date].push(menu);
    return acc;
  }, {} as Record<string, typeof menus>);

  const sortedDates = Object.keys(menusByDate).sort();

  const getMenuTypeColor = (type: string) => {
    switch (type) {
      case "breakfast":
        return "bg-yellow-100 text-yellow-800";
      case "lunch":
        return "bg-orange-100 text-orange-800";
      case "dinner":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Menus</h1>
            <p className="text-muted-foreground mt-2">
              Manage and create menus for different dates
            </p>
          </div>
          <Button
            onClick={() => router.push("/menu/create")}
            className="w-full sm:w-auto"
          >
            Create New Menu
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading menus...</p>
        </div>
      ) : menus.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No menus created yet</p>
          <Button onClick={() => router.push("/menu/create")}>
            Create Your First Menu
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {sortedDates.map((date) => {
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return (
              <Card key={date} className="p-6">
                <h2 className="text-xl font-semibold mb-4">{formattedDate}</h2>
                <div className="space-y-3">
                  {menusByDate[date].map((menu) => (
                    <div
                      key={menu._id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge
                            variant="outline"
                            className={getMenuTypeColor(menu.menuType)}
                          >
                            {menu.menuType.charAt(0).toUpperCase() +
                              menu.menuType.slice(1)}
                          </Badge>
                          {menu.isDraft && (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {menu.menuItems.length} items
                          {menu.notes && ` • ${menu.notes}`}
                        </p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/menu/${menu._id}`)}
                          className="flex-1 sm:flex-none"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
