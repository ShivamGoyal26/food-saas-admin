"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { MenuItemsTableProps } from "./types";

export function MenuItemsTable({
  type,
  menuItems,
  inventory,
  onEditInventory,
  onDeleteInventory,
}: MenuItemsTableProps) {
  if (menuItems.length === 0) {
    return (
      <div className="flex text-xs items-center justify-center py-8 text-muted-foreground">
        <p>No menu items available</p>
      </div>
    );
  }

  return (
    <Table className="w-full">
      <TableCaption>Menu items with inventory details for {type}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Size Label</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Calories</TableHead>
          <TableHead>Default</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {menuItems.map((item) => {
          const itemInventory = inventory.filter(
            (inv) => inv.menuItem === item._id
          );

          if (itemInventory.length > 0) {
            return itemInventory.map((inv, index) => (
              <TableRow key={inv._id}>
                {index === 0 && (
                  <>
                    <TableCell
                      className="font-medium"
                      rowSpan={itemInventory.length}
                    >
                      {item.name}
                    </TableCell>
                    <TableCell rowSpan={itemInventory.length}>
                      {item.description}
                    </TableCell>
                    <TableCell rowSpan={itemInventory.length}>
                      <Badge variant={item.isVeg ? "default" : "secondary"}>
                        {item.isVeg ? "Veg" : "Non-Veg"}
                      </Badge>
                    </TableCell>
                  </>
                )}
                <TableCell>{inv.sizeLabel}</TableCell>
                <TableCell>{inv.quantity}</TableCell>
                <TableCell>₹{inv.price}</TableCell>
                <TableCell>{inv.calories || "-"}</TableCell>
                <TableCell>
                  {inv.isDefault && (
                    <Badge variant="outline" className="text-xs">
                      Default
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditInventory(inv)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteInventory(inv)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ));
          }

          return (
            <TableRow key={item._id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>
                <Badge variant={item.isVeg ? "default" : "secondary"}>
                  {item.isVeg ? "Veg" : "Non-Veg"}
                </Badge>
              </TableCell>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No inventory
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
