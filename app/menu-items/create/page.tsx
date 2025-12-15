"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCreateMenuItem } from "../hooks";
import { CreateMenuItemSchema } from "@/schemas/menu";

type FormValues = z.infer<typeof CreateMenuItemSchema>;

export default function CreateMenuItem() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateMenuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      images: [],
      isVeg: true,
      tags: [],
      dietaryTags: [],
    },
    mode: "onSubmit",
  });

  const { control, handleSubmit } = form;

  const { mutate: createMenuItem, isPending } = useCreateMenuItem();

  const onSubmit = (payload: FormValues) => {
    form.clearErrors("root");

    createMenuItem(payload, {
      onSuccess: () => {
        router.push("/menu-items");
      },
      onError: (error) => {
        const errorMessage =
          (error as any)?.response?.data?.message ||
          (error as any)?.response?.data ||
          "something went wrong";

        form.setError("root", {
          type: "server",
          message: errorMessage as string,
        });
        toast.error(errorMessage as string);
      },
    });
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Create Menu Item</CardTitle>
        <CardDescription>
          Add a new dish to your menu with sizes, prices, and dietary info.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* BASIC INFO */}
          <FieldGroup className="gap-y-4">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Dish Name</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. Rajma Chawal"
                    type="text"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="Short description of the dish"
                    type="text"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          {/* VEG / NON-VEG TOGGLE */}
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Vegetarian</p>
              <p className="text-xs text-muted-foreground">
                Toggle if this dish is vegetarian.
              </p>
            </div>
            <Controller
              name="isVeg"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {/* IMAGES SECTION */}
          <div className="space-y-3 rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Images</p>
              <p className="text-xs text-muted-foreground">
                Upload up to 5 images for this dish. Images can be added after
                creating the menu item.
              </p>
            </div>
          </div>

          {/* ROOT ERROR */}
          {form.formState.errors.root && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end">
            <Button className="cursor-pointer" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Create</span>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
