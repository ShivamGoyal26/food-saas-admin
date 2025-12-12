"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: string | undefined;
  onChange: (date: string) => void;
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
}: DatePickerProps) {
  const [month, setMonth] = React.useState<Date>(() => {
    if (value) {
      return new Date(value);
    }
    return new Date();
  });
  const [open, setOpen] = React.useState(false);

  const selectedDate = value ? new Date(value) : undefined;

  const handleSelectDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    onChange(`${year}-${month}-${day}`);
    setOpen(false);
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(month.getFullYear(), month.getMonth(), day);
    onChange(formatDate(selectedDate));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", {
            "text-muted-foreground": !value,
          })}
        >
          {value ? new Date(value).toLocaleDateString() : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          month={month}
          onMonthChange={setMonth}
          selected={selectedDate}
          onSelect={handleSelectDate}
        />
      </PopoverContent>
    </Popover>
  );
}
