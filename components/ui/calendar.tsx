"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarProps = React.HTMLAttributes<HTMLDivElement> & {
  month?: Date;
  onMonthChange?: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  selected?: Date;
  onSelect?: (date: Date) => void;
};

export function Calendar({
  className,
  classNameDay,
  showOutsideDays = true,
  month: monthProp,
  onMonthChange,
  disabled,
  selected,
  onSelect,
  ...props
}: CalendarProps & {
  classNameDay?: string;
  showOutsideDays?: boolean;
}) {
  const [month, setMonth] = React.useState<Date>(monthProp || new Date());

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    const newMonth = new Date(month.getFullYear(), month.getMonth() - 1);
    setMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(month.getFullYear(), month.getMonth() + 1);
    setMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const days = [];
  const firstDay = firstDayOfMonth(month);
  const totalDays = daysInMonth(month);

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(month.getFullYear(), month.getMonth(), i));
  }

  const monthName = month.toLocaleString("default", { month: "long" });
  const year = month.getFullYear();

  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevMonth}
          className="h-7 w-7"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-sm font-semibold">
          {monthName} {year}
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          className="h-7 w-7"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-muted-foreground p-2"
          >
            {day[0]}
          </div>
        ))}

        {days.map((day, idx) => {
          const isSelected =
            day && selected && day.toDateString() === selected.toDateString();

          return (
            <button
              key={idx}
              onClick={() => day && onSelect?.(day)}
              disabled={day ? disabled?.(day) : true}
              className={cn(
                "h-8 w-8 p-0 text-sm rounded-md font-medium transition-colors",
                day ? "hover:bg-muted cursor-pointer" : "",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent",
                !day ? "invisible" : "",
                disabled?.(day!)
                  ? "opacity-50 cursor-not-allowed hover:bg-transparent"
                  : ""
              )}
            >
              {day?.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
Calendar.displayName = "Calendar";
