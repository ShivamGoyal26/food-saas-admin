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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { CreateMenuItemSchema } from "@/schemas/menu";
import { useGetMenuById, useUpdateMenuItem } from "../../hooks";
import { UploadImages } from "../../components/upload-images";

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
    },
    mode: "onSubmit",
  });

  const { control, handleSubmit, reset } = form;

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

          {/* IMAGES SECTION */}
          <div className="space-y-3 rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Images</p>
              <p className="text-xs text-muted-foreground">
                Upload and manage up to 5 images for this dish.
              </p>
            </div>
            <UploadImages menuId={menuId} serverImages={data?.images} />
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
