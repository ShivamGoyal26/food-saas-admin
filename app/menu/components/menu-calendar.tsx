import { memo } from "react";
import { Card } from "@/components/ui/card";
import {
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
  useCalendarMonth,
  useCalendarYear,
} from "@/components/kibo-ui/calendar";
import { getDaysInMonth, getDay } from "date-fns";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MenuCalendarProps = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  isHydrated: boolean;
};

/**
 * Custom calendar body component with date selection
 * Displays calendar days with primary color highlighting for selected date
 */
function CalendarBodyWithSelection({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}) {
  const [month] = useCalendarMonth();
  const [year] = useCalendarYear();

  const currentMonthDate = new Date(year, month, 1);
  const daysInMonth = getDaysInMonth(currentMonthDate);
  const firstDay = (getDay(currentMonthDate) - 0 + 7) % 7;

  const days: ReactNode[] = [];

  // Previous month's days
  const prevMonthYear = month === 0 ? year - 1 : year;
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthDays = getDaysInMonth(new Date(prevMonthYear, prevMonth, 1));

  for (let i = 0; i < firstDay; i++) {
    const day = prevMonthDays - firstDay + i + 1;
    days.push(
      <div
        key={`prev-${i}`}
        className="relative h-full w-full bg-secondary p-1 text-muted-foreground text-xs"
      >
        {day}
      </div>
    );
  }

  // Current month's days
  const selectedDateObj = new Date(selectedDate);
  const isSelectedMonth =
    selectedDateObj.getFullYear() === year &&
    selectedDateObj.getMonth() === month;

  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected = isSelectedMonth && selectedDateObj.getDate() === day;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    days.push(
      <button
        key={day}
        onClick={() => onSelectDate(dateStr)}
        className={cn(
          "relative h-full w-full p-1 text-xs cursor-pointer transition-colors hover:bg-accent",
          isSelected
            ? "bg-primary text-primary-foreground font-semibold"
            : "hover:bg-accent/50"
        )}
      >
        {day}
      </button>
    );
  }

  // Next month's days (for styling purposes)
  const remainingDays = 7 - ((firstDay + daysInMonth) % 7);

  if (remainingDays < 7) {
    for (let i = 0; i < remainingDays; i++) {
      const day = i + 1;
      days.push(
        <div
          key={`next-${i}`}
          className="relative h-full w-full bg-secondary p-1 text-muted-foreground text-xs"
        >
          {day}
        </div>
      );
    }
  }

  return (
    <div className="grid grow grid-cols-7">
      {days.map((dayElement, index) => (
        <div
          key={index}
          className={cn(
            "relative aspect-square overflow-hidden border-t border-r",
            index % 7 === 6 && "border-r-0"
          )}
        >
          {dayElement}
        </div>
      ))}
    </div>
  );
}

/**
 * Menu calendar component
 * Allows users to select a date and view menus for that date
 */
export const MenuCalendar = memo(function MenuCalendar({
  selectedDate,
  onSelectDate,
  isHydrated,
}: MenuCalendarProps) {
  if (!isHydrated || !selectedDate) {
    return null;
  }

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Select Date</h2>
      <CalendarProvider>
        <CalendarDate>
          <CalendarDatePicker>
            <CalendarMonthPicker />
            <CalendarYearPicker
              start={new Date().getFullYear()}
              end={new Date().getFullYear() + 2}
            />
          </CalendarDatePicker>
          <CalendarDatePagination />
        </CalendarDate>
        <CalendarHeader />
        <CalendarBodyWithSelection
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
        />
      </CalendarProvider>
    </Card>
  );
});

export default MenuCalendar;
