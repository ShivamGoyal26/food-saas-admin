"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Step } from "../schema";

interface NavigationButtonsProps {
  currentStep: Step;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const NavigationButtons = memo(function NavigationButtons({
  currentStep,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit,
}: NavigationButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1 || isSubmitting}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <Button
        type="button"
        onClick={onNext}
        disabled={currentStep === 5 || isSubmitting}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="hidden sm:block" />

      {currentStep === 5 && (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 sm:flex-none"
        >
          {isSubmitting ? (
            <>
              <Spinner className="h-4 w-4 mr-2" />
              Creating...
            </>
          ) : (
            "Create Menu"
          )}
        </Button>
      )}
    </div>
  );
});
