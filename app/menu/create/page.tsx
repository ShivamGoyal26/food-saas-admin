"use client";

import { Card } from "@/components/ui/card";
import { useCreateMenuForm } from "./hooks";
import {
  StepDate,
  StepMenuType,
  StepMenuItems,
  StepInventory,
  StepNotes,
  ProgressIndicator,
  SummaryCard,
  DraftStatusCard,
  NavigationButtons,
  ErrorAlert,
} from "./components";

export default function MenuCreatePage() {
  const {
    formData,
    errors,
    setValue,
    register,
    step,
    handleNext,
    handlePrevious,
    addInventoryItemForMenuItem,
    handleIsDefaultChange,
    removeInventoryItem,
    menuItemsMap,
    setMenuItemsMap,
    createMenuMutation,
    handleCreateMenu,
    isSubmitting,
  } = useCreateMenuForm();

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepDate
            value={formData.date}
            error={errors.date}
            onChange={(date) =>
              setValue("date", date, { shouldValidate: true })
            }
          />
        );

      case 2:
        return (
          <StepMenuType
            value={formData.menuType}
            error={errors.menuType}
            onChange={(type) =>
              setValue("menuType", type, { shouldValidate: true })
            }
          />
        );

      case 3:
        return (
          <StepMenuItems
            selectedItems={formData.menuItems}
            menuType={formData.menuType}
            error={errors.menuItems}
            onItemsChange={(items) =>
              setValue("menuItems", items, { shouldValidate: true })
            }
            onItemsDataChange={setMenuItemsMap}
          />
        );

      case 4:
        return (
          <StepInventory
            menuItems={formData.menuItems}
            menuItemsMap={menuItemsMap}
            inventoryFields={formData.inventory}
            errors={errors.inventory}
            register={register}
            onAddItem={addInventoryItemForMenuItem}
            onIsDefaultChange={handleIsDefaultChange}
            onRemoveItem={removeInventoryItem}
          />
        );

      case 5:
        return (
          <StepNotes
            value={formData.notes}
            onChange={(notes) => setValue("notes", notes)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Menu</h1>
          <p className="text-muted-foreground">
            Fill out the steps below to create a new menu
          </p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator currentStep={step} />

        {/* API Error Alert */}
        {createMenuMutation.isError && (
          <ErrorAlert error={createMenuMutation.error as Error} />
        )}

        {/* Form Card */}
        <Card className="p-6 sm:p-8 mb-8">{renderStep()}</Card>

        {/* Summary Section */}
        <SummaryCard formData={formData} currentStep={step} />

        {/* Draft Status (only on final step) */}
        {step === 5 && (
          <DraftStatusCard
            isDraft={formData.isDraft}
            onToggle={(isDraft) => setValue("isDraft", isDraft)}
          />
        )}

        {/* Navigation Buttons */}
        <NavigationButtons
          currentStep={step}
          isSubmitting={isSubmitting}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleCreateMenu}
        />
      </div>
    </div>
  );
}
