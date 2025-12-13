import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { formatDateForDisplay } from "../utils/date";

type MenuHeaderProps = {
  selectedDate: string;
};

/**
 * Menu page header component
 * Displays the selected date and create menu button
 */
export const MenuHeader = memo(function MenuHeader({
  selectedDate,
}: MenuHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">
            Menus for {formatDateForDisplay(selectedDate)}
          </h1>
          <p className="text-muted-foreground mt-2 text-xs">
            Select a date to view and manage menus
          </p>
        </div>
        <Button
          onClick={() => router.push("/menu/create")}
          className="w-full sm:w-auto gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Menu
        </Button>
      </div>
    </div>
  );
});

export default MenuHeader;
