"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { MenuItem } from "../../api";

interface MenuItemsCardProps {
  menuItems: MenuItem[];
  isPublished: boolean;
  onEditClick: () => void;
}

export const MenuItemsCard = memo(function MenuItemsCard({
  menuItems,
  isPublished,
  onEditClick,
}: MenuItemsCardProps) {
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Menu Items</CardTitle>
        {!isPublished && (
          <Button size="sm" variant="outline" onClick={onEditClick}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Items
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {menuItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No menu items
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {menuItems.map((item) => (
              <Badge
                key={item._id}
                variant={item.isVeg ? "default" : "secondary"}
                className="text-sm"
              >
                {item.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});
