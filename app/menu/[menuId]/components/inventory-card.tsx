"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";
import { InventoryItemPopulated } from "../../api";

interface InventoryCardProps {
  inventory: InventoryItemPopulated[];
  onAddClick: () => void;
  onEditClick: (inv: InventoryItemPopulated) => void;
  onDeleteClick: (inv: InventoryItemPopulated) => void;
}

export const InventoryCard = memo(function InventoryCard({
  inventory,
  onAddClick,
  onEditClick,
  onDeleteClick,
}: InventoryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Inventory Management</CardTitle>
        <Button size="sm" onClick={onAddClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Inventory
        </Button>
      </CardHeader>
      <CardContent>
        {inventory.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No inventory items. Click &quot;Add Inventory&quot; to add one.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Menu Item</TableHead>
                  <TableHead>Size Label</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((inv) => (
                  <TableRow key={inv._id}>
                    <TableCell className="font-medium">
                      {inv.menuItem.name}
                    </TableCell>
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
                          onClick={() => onEditClick(inv)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteClick(inv)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
