"use client";

import { memo } from "react";
import { Card } from "@/components/ui/card";
import { CreateMenuFormData, Step } from "../schema";

interface SummaryCardProps {
  formData: CreateMenuFormData;
  currentStep: Step;
}

export const SummaryCard = memo(function SummaryCard({
  formData,
  currentStep,
}: SummaryCardProps) {
  return (
    <Card className="p-6 mb-8 bg-muted/50">
      <h3 className="font-semibold mb-4">Summary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SummaryItem
          label="Date"
          value={
            formData.date
              ? new Date(formData.date).toLocaleDateString()
              : "Not selected"
          }
        />
        <SummaryItem
          label="Menu Type"
          value={formData.menuType || "Not selected"}
          capitalize
        />
        <SummaryItem
          label="Items"
          value={`${formData.menuItems.length} selected`}
        />
        <SummaryItem
          label="Inventory"
          value={`${formData.inventory.length} items`}
        />
        <SummaryItem
          label="Notes"
          value={formData.notes ? "Added" : "Not added"}
        />
        {currentStep === 5 && (
          <SummaryItem
            label="Status"
            value={formData.isDraft ? "Draft" : "Published"}
          />
        )}
      </div>
    </Card>
  );
});

interface SummaryItemProps {
  label: string;
  value: string;
  capitalize?: boolean;
}

const SummaryItem = memo(function SummaryItem({
  label,
  value,
  capitalize,
}: SummaryItemProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`font-medium ${capitalize ? "capitalize" : ""}`}>{value}</p>
    </div>
  );
});
