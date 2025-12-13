export const queryKeys = {
  menuItems: ["menuItems"] as const,
  menuItemById: (id: string) => ["menuItems", id] as const,
  deletedMenuItems: ["deletedMenuItems"] as const,
  menus: ["menus"] as const,
  menuById: (id: string) => ["menu", id] as const,
};
