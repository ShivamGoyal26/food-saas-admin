import { memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShowMenuItems from "./show-menu-items";
import { MenusByDateResponse } from "../api";

type MenuTabsProps = {
  menuResponse: MenusByDateResponse | undefined;
  isLoading: boolean;
  selectedDate: string;
};

/**
 * Menu tabs component
 * Displays breakfast, lunch, and dinner menus in tabs
 */
export const MenuTabs = memo(function MenuTabs({
  menuResponse,
  isLoading,
  selectedDate,
}: MenuTabsProps) {
  if (isLoading) {
    return null;
  }

  return (
    <Tabs defaultValue="breakfast" className="mt-20 space-y-10">
      <TabsList>
        <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
        <TabsTrigger value="lunch">Lunch</TabsTrigger>
        <TabsTrigger value="dinner">Dinner</TabsTrigger>
      </TabsList>

      <TabsContent value="breakfast">
        <ShowMenuItems
          type="breakfast"
          selectedDate={selectedDate}
          menuData={menuResponse?.menus.breakfast}
        />
      </TabsContent>

      <TabsContent value="lunch">
        <ShowMenuItems
          type="lunch"
          selectedDate={selectedDate}
          menuData={menuResponse?.menus.lunch}
        />
      </TabsContent>

      <TabsContent value="dinner">
        <ShowMenuItems
          type="dinner"
          selectedDate={selectedDate}
          menuData={menuResponse?.menus.dinner}
        />
      </TabsContent>
    </Tabs>
  );
});

export default MenuTabs;
