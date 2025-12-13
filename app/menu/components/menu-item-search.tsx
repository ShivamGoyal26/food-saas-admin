"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useGetMenuItems } from "@/app/menu-items/hooks";

interface MenuItemSearchProps {
  selectedItems: string[];
  onItemsChange: (items: string[]) => void;
}

export function MenuItemSearch({
  selectedItems,
  onItemsChange,
}: MenuItemSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: allMenuItems = [] } = useGetMenuItems();

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return allMenuItems;
    }
    return allMenuItems.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allMenuItems]);

  const selectedItemsData = useMemo(() => {
    return allMenuItems.filter((item) => selectedItems.includes(item._id));
  }, [selectedItems, allMenuItems]);

  const handleAddItem = (itemId: string) => {
    if (!selectedItems.includes(itemId)) {
      onItemsChange([...selectedItems, itemId]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    onItemsChange(selectedItems.filter((id) => id !== itemId));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Search Menu Items</label>
        <Input
          placeholder="Search for menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2"
        />
      </div>

      {filteredItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Available Items
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto border rounded-lg p-3">
            {filteredItems.map((item) => (
              <Button
                key={item._id}
                variant={
                  selectedItems.includes(item._id) ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleAddItem(item._id)}
                className="justify-start h-auto"
              >
                <div className="text-left flex-1">
                  <p className="font-medium text-xs">{item.name}</p>
                  {item.description && (
                    <p className="text-xs opacity-75 line-clamp-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {selectedItemsData.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Selected Items ({selectedItems.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedItemsData.map((item) => (
              <Badge
                key={item._id}
                variant="secondary"
                className="flex items-center gap-2"
              >
                {item.name}
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {filteredItems.length === 0 && searchQuery && (
        <p className="text-sm text-muted-foreground">No items found.</p>
      )}
    </div>
  );
}
