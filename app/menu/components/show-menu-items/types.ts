import { InventoryItem } from "../../api";

export interface ShowMenuItemsProps {
  type: "breakfast" | "lunch" | "dinner";
  menuData?: {
    menu: {
      _id: string;
      menuItems: Array<{
        _id: string;
        name: string;
        description: string;
        isVeg: boolean;
      }>;
      isDraft: boolean;
      isPublished: boolean;
    };
    inventory: InventoryItem[];
  };
  selectedDate: string;
}

export interface MenuHeaderProps {
  type: "breakfast" | "lunch" | "dinner";
  selectedDate: string;
  isDraft: boolean;
  isPublished: boolean;
  menuId?: string;
  hasMenuItems: boolean;
  isPublishing: boolean;
  onPublish: () => void;
}

export interface MenuItemsTableProps {
  type: string;
  menuItems: Array<{
    _id: string;
    name: string;
    description: string;
    isVeg: boolean;
  }>;
  inventory: InventoryItem[];
  onEditInventory: (inv: InventoryItem) => void;
  onDeleteInventory: (inv: InventoryItem) => void;
}

export interface EditInventoryDialogProps {
  inventory: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  menuId?: string;
}

export interface DeleteInventoryDialogProps {
  inventory: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  menuId?: string;
}
