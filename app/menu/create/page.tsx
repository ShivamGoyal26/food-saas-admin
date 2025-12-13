"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { DatePicker } from "@/components/ui/date-picker";
import { MenuItemSearch } from "../components/menu-item-search";
import { Textarea } from "@/components/ui/textarea";
import { useCreateMenu, usePublishMenu } from "../hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";

type Step = 1 | 2 | 3 | 4;

const MENU_TYPES = ["breakfast", "lunch", "dinner"] as const;

export default function MenuCreatePage() {
  const router = useRouter();
  const createMenuMutation = useCreateMenu();
  const publishMenuMutation = usePublishMenu();

  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    date: "",
    menuType: "",
    menuItems: [] as string[],
    notes: "",
  });

  const isDateValid = formData.date !== "";
  const isMenuTypeValid = formData.menuType !== "";
  const areItemsSelected = formData.menuItems.length > 0;
  const isFormValid = isDateValid && isMenuTypeValid && areItemsSelected;

  const handleNext = () => {
    if (step === 1 && !isDateValid) {
      toast.error("Please select a date");
      return;
    }
    if (step === 2 && !isMenuTypeValid) {
      toast.error("Please select a menu type");
      return;
    }
    if (step === 3 && !areItemsSelected) {
      toast.error("Please select at least one menu item");
      return;
    }

    if (step < 4) {
      setStep((step + 1) as Step);
    }
    // Clear error when navigating
    createMenuMutation.reset();
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
    // Clear error when navigating
    createMenuMutation.reset();
  };

  const handleSaveDraft = async () => {
    if (!isFormValid) {
      toast.error("Please complete all required fields");
      return;
    }

    createMenuMutation.mutate(
      {
        date: formData.date,
        menuType: formData.menuType as "breakfast" | "lunch" | "dinner",
        menuItems: formData.menuItems,
        notes: formData.notes,
        isDraft: true,
      },
      {
        onSuccess: () => {
          toast.success("Menu saved as draft successfully!");
          router.push("/menu");
        },
        onError: (error: any) => {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to save menu draft";
          toast.error(errorMsg);
          console.error("Error saving draft:", error);
        },
      }
    );
  };

  const handlePublish = async () => {
    if (!isFormValid) {
      toast.error("Please complete all required fields");
      return;
    }

    createMenuMutation.mutate(
      {
        date: formData.date,
        menuType: formData.menuType as "breakfast" | "lunch" | "dinner",
        menuItems: formData.menuItems,
        notes: formData.notes,
        isDraft: false,
      },
      {
        onSuccess: (data) => {
          publishMenuMutation.mutate(
            {
              menuId: data._id,
              menuItemIds: formData.menuItems,
            },
            {
              onSuccess: () => {
                toast.success("Menu published successfully!");
                router.push("/menu");
              },
              onError: (error: any) => {
                console.log(error);
                const errorMsg =
                  error?.response?.data?.message ||
                  error?.message ||
                  "Failed to publish menu";
                toast.error(errorMsg);
                console.error("Error publishing menu:", error);
              },
            }
          );
        },
        onError: (error: any) => {
          console.log(error);
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to publish menu";
          toast.error(errorMsg);
          console.error("Error publishing menu:", error);
        },
      }
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-4">Select Menu Date</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Choose the date for this menu
              </p>
              <DatePicker
                value={formData.date}
                onChange={(date) => {
                  setFormData({ ...formData, date });
                  // Clear error on change
                  createMenuMutation.reset();
                }}
                placeholder="Select a date"
              />
            </div>
          </div>
        );

      case 2:
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
                    variant={formData.menuType === type ? "default" : "outline"}
                    className="h-auto py-4 flex flex-col"
                    onClick={() => {
                      setFormData({ ...formData, menuType: type });
                      // Clear error on change
                      createMenuMutation.reset();
                    }}
                  >
                    <span className="capitalize font-semibold">{type}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-4">Select Menu Items</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Add menu items to this {formData.menuType || "menu"}
              </p>
              <MenuItemSearch
                selectedItems={formData.menuItems}
                onItemsChange={(items) => {
                  setFormData({ ...formData, menuItems: items });
                  // Clear error on change
                  createMenuMutation.reset();
                }}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-4">Additional Notes</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Add any special notes or descriptions for this menu
              </p>
              <Textarea
                placeholder="e.g., Today's special breakfast, seasonal items available, etc."
                value={formData.notes}
                onChange={(e) => {
                  setFormData({ ...formData, notes: e.target.value });
                  // Clear error on change
                  createMenuMutation.reset();
                }}
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Menu</h1>
          <p className="text-muted-foreground">
            Fill out the steps below to create a new menu
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    s <= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s}
                </div>
                <p className="text-xs mt-2 text-center">
                  {s === 1 && "Date"}
                  {s === 2 && "Type"}
                  {s === 3 && "Items"}
                  {s === 4 && "Notes"}
                </p>
              </div>
            ))}
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Alert */}
        {createMenuMutation.isError && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-destructive mb-1">Error</h3>
              <p className="text-sm text-destructive">
                {(createMenuMutation.error as any)?.response?.data?.message ||
                  (createMenuMutation.error as any)?.message ||
                  "An error occurred"}
              </p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <Card className="p-6 sm:p-8 mb-8">{renderStep()}</Card>

        {/* Summary Section */}
        <Card className="p-6 mb-8 bg-muted/50">
          <h3 className="font-semibold mb-4">Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">
                {formData.date
                  ? new Date(formData.date).toLocaleDateString()
                  : "Not selected"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Menu Type</p>
              <p className="font-medium capitalize">
                {formData.menuType || "Not selected"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Items</p>
              <p className="font-medium">
                {formData.menuItems.length} selected
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="font-medium">
                {formData.notes ? "Added" : "Not added"}
              </p>
            </div>
          </div>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1 || createMenuMutation.isPending}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={step === 4 || createMenuMutation.isPending}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="hidden sm:block" />

          {step === 4 && (
            <>
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={!isFormValid || createMenuMutation.isPending}
                className="flex-1 sm:flex-none"
              >
                {createMenuMutation.isPending ? (
                  <>
                    <Spinner className="h-4 w-4 mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save as Draft"
                )}
              </Button>

              <Button
                onClick={handlePublish}
                disabled={!isFormValid || createMenuMutation.isPending}
                className="flex-1 sm:flex-none"
              >
                {createMenuMutation.isPending ? (
                  <>
                    <Spinner className="h-4 w-4 mr-2" />
                    Publishing...
                  </>
                ) : (
                  "Publish"
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
