"use client";

import { memo } from "react";
import { Step, STEP_LABELS } from "../schema";

interface ProgressIndicatorProps {
  currentStep: Step;
}

export const ProgressIndicator = memo(function ProgressIndicator({
  currentStep,
}: ProgressIndicatorProps) {
  const steps: Step[] = [1, 2, 3, 4, 5];

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step) => (
          <div key={step} className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                step <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step}
            </div>
            <p className="text-xs mt-2 text-center">{STEP_LABELS[step]}</p>
          </div>
        ))}
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
        />
      </div>
    </div>
  );
});
