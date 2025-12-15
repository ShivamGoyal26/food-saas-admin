"use client";

import { memo } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Field, FieldError } from "@/components/ui/field";
import { FieldError as FieldErrorType } from "react-hook-form";

interface StepDateProps {
  value: string;
  error?: FieldErrorType;
  onChange: (date: string) => void;
}

export const StepDate = memo(function StepDate({
  value,
  error,
  onChange,
}: StepDateProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-4">Select Menu Date</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Choose the date for this menu
        </p>
        <Field>
          <DatePicker
            value={value}
            onChange={onChange}
            placeholder="Select a date"
          />
          {error && <FieldError>{error.message}</FieldError>}
        </Field>
      </div>
    </div>
  );
});
