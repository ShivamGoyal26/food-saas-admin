export const queryKeys = {
  menuItems: ["menuItems"] as const,
  menuItemById: (id: string) => ["menuItem", id] as const,
  menus: ["menus"] as const,
  menuById: (id: string) => ["menu", id] as const,
};
