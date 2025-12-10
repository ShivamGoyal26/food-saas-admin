export const queryKeys = {
  menuItems: ["menuItems"] as const,
  menuItemById: (id: string) => ["menuItems", id] as const,
};
