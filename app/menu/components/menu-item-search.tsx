"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, Leaf, Utensils, Check } from "lucide-react";
import { useGetMenuItems } from "@/app/menu-items/hooks";

interface MenuItemSearchProps {
  selectedItems: string[];
  onItemsChange: (items: string[]) => void;
  onItemsDataChange?: (itemsData: Record<string, string>) => void;
}

export function MenuItemSearch({
  selectedItems,
  onItemsChange,
  onItemsDataChange,
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

  const handleAddItem = (itemId: string, itemName: string) => {
    if (!selectedItems.includes(itemId)) {
      const newItems = [...selectedItems, itemId];
      onItemsChange(newItems);

      // Pass menu item names map
      if (onItemsDataChange) {
        const itemsMap = {
          ...Object.fromEntries(
            selectedItemsData.map((item) => [item._id, item.name])
          ),
          [itemId]: itemName,
        };
        onItemsDataChange(itemsMap);
      }
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const newItems = selectedItems.filter((id) => id !== itemId);
    onItemsChange(newItems);

    // Update items map
    if (onItemsDataChange) {
      const itemsMap: Record<string, string> = {};
      selectedItemsData
        .filter((item) => item._id !== itemId)
        .forEach((item) => {
          itemsMap[item._id] = item.name;
        });
      onItemsDataChange(itemsMap);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search menu items by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Available Items Grid */}
      {filteredItems.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">
            Available Items ({filteredItems.length})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {filteredItems.map((item) => {
              const isSelected = selectedItems.includes(item._id);
              return (
                <Card
                  key={item._id}
                  onClick={() => handleAddItem(item._id, item.name)}
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary"
                      : "hover:border-primary/50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-foreground line-clamp-2">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {/* Item Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.isVeg && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Leaf className="h-3 w-3" />
                            Veg
                          </Badge>
                        )}
                        {item.cuisine && (
                          <Badge variant="outline" className="text-xs">
                            {item.cuisine}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Items Section */}
      {selectedItemsData.length > 0 && (
        <div className="space-y-3 border-t pt-6">
          <p className="text-sm font-semibold text-foreground">
            Selected Items ({selectedItems.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedItemsData.map((item) => (
              <Badge
                key={item._id}
                variant="default"
                className="gap-2 py-1.5 px-3 text-sm"
              >
                <Utensils className="h-3 w-3" />
                {item.name}
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="ml-1 hover:opacity-70 transition-opacity"
                  type="button"
                >
                  ✕
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            No items found matching "{searchQuery}"
          </p>
        </div>
      )}

      {allMenuItems.length === 0 && !searchQuery && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            No menu items available. Create some first.
          </p>
        </div>
      )}
    </div>
  );
}
