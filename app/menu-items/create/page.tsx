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
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCreateMenuItem } from "../hooks";
import { CreateMenuItemSchema } from "@/schemas/menu";
import { cn } from "@/lib/utils"; // if you have a cn helper, otherwise remove

type FormValues = z.infer<typeof CreateMenuItemSchema>;

export default function CreateMenuItem() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateMenuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      sizes: [
        {
          label: "Regular",
          // important: keep this a number; user will overwrite it
          priceInPaise: 10000, // example 100.00 in rupees if you're storing paise
          calories: undefined,
          isDefault: true,
        } as any,
      ],
      images: [],
      isVeg: true,
      tags: [],
      dietaryTags: [],
    },
    mode: "onSubmit",
  });

  const { control, handleSubmit } = form;

  const {
    fields: sizeFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "sizes",
  });

  const { mutate: createMenuItem, isPending } = useCreateMenuItem();

  const onSubmit = (payload: FormValues) => {
    form.clearErrors("root");

    // ✅ If you want to convert from rupees to paise, do it here instead:
    // const formattedPayload = {
    //   ...payload,
    //   sizes: payload.sizes.map((size) => ({
    //     ...size,
    //     priceInPaise: Math.round(Number(size.priceInPaise)), // or * 100 if using rupees
    //   })),
    // };

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

          {/* SIZES SECTION */}
          <div className="space-y-3 rounded-md border p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sizes & Prices</p>
                <p className="text-xs text-muted-foreground">
                  Add one or more size options with price and calories.
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
                  } as any)
                }
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Size
              </Button>
            </div>

            <div className="space-y-3">
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
                        <Input
                          aria-invalid={fieldState.invalid}
                          placeholder="e.g. Half, Full, Regular"
                          type="text"
                          {...field}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* PRICE IN PAISE (NUMERIC) */}
                  <Controller
                    name={`sizes.${index}.priceInPaise`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Price (in paise)</FieldLabel>
                        <Input
                          aria-invalid={fieldState.invalid}
                          type="number"
                          placeholder="e.g. 12000"
                          inputMode="numeric"
                          // ✅ IMPORTANT: convert string → number so Zod gets a number
                          value={
                            field.value === undefined || field.value === null
                              ? ""
                              : field.value
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? undefined : Number(value)
                            );
                          }}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* CALORIES (NUMERIC, OPTIONAL) */}
                  <Controller
                    name={`sizes.${index}.calories`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Calories (optional)</FieldLabel>
                        <Input
                          aria-invalid={fieldState.invalid}
                          type="number"
                          placeholder="e.g. 450"
                          inputMode="numeric"
                          value={
                            field.value === undefined || field.value === null
                              ? ""
                              : field.value
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? undefined : Number(value)
                            );
                          }}
                        />
                        {fieldState.invalid && (
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
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                          onClick={() => {
                            // make this one default and others false
                            const current = form.getValues("sizes");
                            const next = current.map((s, i) => ({
                              ...s,
                              isDefault: i === index,
                            }));
                            form.setValue("sizes", next as any, {
                              shouldDirty: true,
                              shouldTouch: true,
                            });
                          }}
                        >
                          {field.value ? "Default size" : "Set as default"}
                        </button>
                      )}
                    />

                    {sizeFields.length > 1 && (
                      <Button
                        type="button"
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
