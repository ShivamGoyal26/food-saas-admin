"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { MENU_TYPES, MenuType } from "../schema";
import { FieldError as FieldErrorType } from "react-hook-form";

interface StepMenuTypeProps {
  value?: MenuType;
  error?: FieldErrorType;
  onChange: (type: MenuType) => void;
}

export const StepMenuType = memo(function StepMenuType({
  value,
  error,
  onChange,
}: StepMenuTypeProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-4">Select Menu Type</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Choose what type of menu this is
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MENU_TYPES.map((type) => (
            <Button
              key={type}
              type="button"
              variant={value === type ? "default" : "outline"}
              className="h-auto py-4 flex flex-col"
              onClick={() => onChange(type)}
            >
              <span className="capitalize font-semibold">{type}</span>
            </Button>
          ))}
        </div>
        {error && <FieldError className="mt-2">{error.message}</FieldError>}
      </div>
    </div>
  );
});
