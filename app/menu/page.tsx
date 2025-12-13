"use client";

import { useState, useEffect } from "react";
import { useGetMenusByDate } from "./hooks";
import { Spinner } from "@/components/ui/spinner";
import MenuHeader from "./components/menu-header";
import MenuCalendar from "./components/menu-calendar";
import MenuTabs from "./components/menu-tabs";

export default function MenuPage() {
  // State management
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration effect
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Fetch menus for selected date
  const {
    data: menuResponse,
    isLoading,
    error,
    isError,
  } = useGetMenusByDate(selectedDate, isHydrated);
  const menu = menuResponse?.menus || [];

  // Render null during hydration to prevent mismatch
  if (!isHydrated) {
    return null;
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          Error fetching menus: {error?.message || "Unknown error"}
        </p>
      </div>
    );
  }

  // No menus state
  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          No menus available for the selected date.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header with date and create button */}
        <MenuHeader selectedDate={selectedDate} />

        {/* Date picker calendar */}
        <MenuCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          isHydrated={isHydrated}
        />

        {/* Loading state */}
        {isLoading ? (
          <div className="mt-20 flex justify-center">
            <Spinner />
          </div>
        ) : (
          /* Menus tabs */
          <MenuTabs
            menuResponse={menuResponse}
            isLoading={isLoading}
            selectedDate={selectedDate}
          />
        )}
      </div>
    </div>
  );
}
