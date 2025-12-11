"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { CreateMenuItemSchema } from "@/schemas/menu";
import { useGetMenuById, useUpdateMenuItem } from "../../hooks";
import { cn } from "@/lib/utils";

type FormValues = z.infer<typeof CreateMenuItemSchema>;

export default function UpdateMenuItemPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const menuId = params.id;

  const { data, isLoading, isError, error } = useGetMenuById(menuId);

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateMenuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      isVeg: true,
      tags: [],
      dietaryTags: [],
      images: [],
      sizes: [
        {
          label: "",
          priceInPaise: 0,
          calories: undefined,
          isDefault: true,
        },
      ],
    },
    mode: "onSubmit",
  });

  const { control, handleSubmit, reset } = form;
  const {
    fields: sizeFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "sizes",
  });

  const { mutate: updateMenuItem, isPending } = useUpdateMenuItem();

  // Set initial values when data arrives
  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        description: data.description ?? "",
        isVeg: data.isVeg,
        tags: data.tags ?? [],
        dietaryTags: data.dietaryTags ?? [],
        images: data.images.length ? data.images : [],
        sizes: (data.sizes?.length
          ? data.sizes
          : [
              {
                label: "",
                priceInPaise: 0,
                calories: undefined,
                isDefault: true,
              },
            ]
        ).map((s) => ({
          label: s.label,
          priceInPaise: s.priceInPaise,
          calories: s.calories ?? undefined,
          isDefault: s.isDefault,
        })),
      });
    }
  }, [data, reset]);

  // --- Loading state ---
  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // --- Error handling ---
  if (isError || !data) {
    return (
      <Card className="max-w-lg mx-auto mt-10 p-6 border-red-300">
        <CardHeader>
          <CardTitle>Error loading menu item</CardTitle>
          <CardDescription>
            {error?.message || "Menu item not found or invalid ID."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/menu-items")}>
            Back to Menu
          </Button>
        </CardContent>
      </Card>
    );
  }

  // --- Submit Handler ---
  const onSubmit = (payload: FormValues) => {
    updateMenuItem(
      { payload, menuId },
      {
        onSuccess: () => {
          toast.success("Menu item updated!");
          router.push("/menu-items");
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            "Something went wrong while updating.";
          toast.error(msg);
        },
      }
    );
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Update Menu Item</CardTitle>
        <CardDescription>
          Edit dish details, sizes, prices, and more.
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
                    placeholder="e.g. Rajma Chawal"
                    type="text"
                    {...field}
                  />
                  {fieldState.error && (
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
                  <Input placeholder="Short description" {...field} />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          {/* VEG TOGGLE */}
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

          {/* SIZES */}
          <div className="space-y-3 rounded-md border p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sizes & Prices</p>
                <p className="text-xs text-muted-foreground">
                  Add or modify size options.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    label: "",
                    priceInPaise: 0,
                    calories: undefined,
                    isDefault: false,
                  })
                }
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Size
              </Button>
            </div>

            {/* Iterating Sizes */}
            {sizeFields.map((size, index) => (
              <div
                key={size.id}
                className={cn(
                  "grid gap-3 rounded-md border px-3 py-3",
                  "md:grid-cols-[1.2fr_1fr_1fr_auto]"
                )}
              >
                {/* LABEL */}
                <Controller
                  name={`sizes.${index}.label`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Label</FieldLabel>
                      <Input placeholder="Regular / Large" {...field} />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* PRICE */}
                <Controller
                  name={`sizes.${index}.priceInPaise`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Price (in paise)</FieldLabel>
                      <Input
                        inputMode="numeric"
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* CALORIES */}
                <Controller
                  name={`sizes.${index}.calories`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Calories (optional)</FieldLabel>
                      <Input
                        type="number"
                        inputMode="numeric"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* DEFAULT + REMOVE */}
                <div className="flex flex-col items-end justify-between gap-2">
                  <Controller
                    name={`sizes.${index}.isDefault`}
                    control={control}
                    render={({ field }) => (
                      <button
                        type="button"
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-medium",
                          field.value
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground"
                        )}
                        onClick={() => {
                          const list = form.getValues("sizes");
                          const updated = list.map((s, i) => ({
                            ...s,
                            isDefault: i === index,
                          }));
                          form.setValue("sizes", updated);
                        }}
                      >
                        {field.value ? "Default" : "Set Default"}
                      </button>
                    )}
                  />

                  {sizeFields.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* SUBMIT */}
          <div className="flex justify-end">
            <Button disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
