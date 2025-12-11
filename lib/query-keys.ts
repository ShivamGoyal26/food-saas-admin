export const queryKeys = {
  menuItems: ["menuItems"] as const,
  menuItemById: (id: string) => ["menuItem", id] as const,
};
