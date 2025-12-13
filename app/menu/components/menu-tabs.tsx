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
          menuItems={menuResponse?.menus.breakfast?.menuItems || []}
          isDraft={menuResponse?.menus.breakfast?.isDraft || false}
          isPublished={menuResponse?.menus.breakfast?.isPublished || false}
        />
      </TabsContent>

      <TabsContent value="lunch">
        <ShowMenuItems
          type="lunch"
          selectedDate={selectedDate}
          menuItems={menuResponse?.menus.lunch?.menuItems || []}
          isDraft={menuResponse?.menus.lunch?.isDraft || false}
          isPublished={menuResponse?.menus.lunch?.isPublished || false}
        />
      </TabsContent>

      <TabsContent value="dinner">
        <ShowMenuItems
          type="dinner"
          selectedDate={selectedDate}
          menuItems={menuResponse?.menus.dinner?.menuItems || []}
          isDraft={menuResponse?.menus.dinner?.isDraft || false}
          isPublished={menuResponse?.menus.dinner?.isPublished || false}
        />
      </TabsContent>
    </Tabs>
  );
});

export default MenuTabs;
