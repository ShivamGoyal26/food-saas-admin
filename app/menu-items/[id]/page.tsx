"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Pencil, Trash2, Leaf } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

import { useGetMenuById, useDeleteMenuItem } from "../hooks";
import { MenuSize } from "@/schemas/menu";

export default function MenuDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const menuId = params.id;

  const { data, isLoading, isError, error } = useGetMenuById(menuId);
  const { mutate: deleteMenuItem, isPending: deleting } = useDeleteMenuItem();

  // ─────────────────────────────
  // Loading State
  // ─────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // ─────────────────────────────
  // Error / Invalid ID
  // ─────────────────────────────
  if (isError || !data) {
    return (
      <Card className="max-w-lg mx-auto mt-10 p-6 border-red-400">
        <CardHeader>
          <CardTitle>Error Loading Menu Item</CardTitle>
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

  const menu = data;

  // ─────────────────────────────
  // Delete Handler
  // ─────────────────────────────
  const handleDelete = () => {
    deleteMenuItem(menuId, {
      onSuccess: () => {
        toast.success("Menu item deleted successfully!");
        router.push("/menu-items");
      },
      onError: () => {
        toast.error("Failed to delete menu item");
      },
    });
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{menu.name}</CardTitle>
            <CardDescription>{menu.description}</CardDescription>
          </div>

          <div className="flex gap-2">
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() => router.push(`/menu-items/${menuId}/edit`)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>

            <Button
              className="cursor-pointer"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* VEG BADGE */}
        <div className="flex items-center gap-2">
          {menu.isVeg ? (
            <Badge className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
              <Leaf className="h-3 w-3" /> Vegetarian
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Non-Veg
            </Badge>
          )}
        </div>

        <Separator />

        {/* SIZES */}
        <div>
          <h3 className="text-lg font-semibold">Available Sizes</h3>
          <div className="mt-3 space-y-3">
            {menu.sizes.map((s: MenuSize, index: number) => (
              <div
                key={index}
                className="flex items-start justify-between rounded-md border p-3"
              >
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">
                    {s.label}
                    {s.isDefault && (
                      <Badge className="bg-blue-600 hover:bg-blue-700">
                        Default
                      </Badge>
                    )}
                  </p>

                  {s.calories && (
                    <p className="text-xs text-muted-foreground">
                      {s.calories} calories
                    </p>
                  )}
                </div>

                <p className="font-semibold">₹{s.priceInPaise}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* TAGS */}
        {menu.tags?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold">Tags</h3>
            <div className="flex gap-2 mt-2 flex-wrap">
              {menu.tags.map((tag: string, i: number) => (
                <Badge key={i} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* DIETARY TAGS */}
        {menu.dietaryTags?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold">Dietary Info</h3>
            <div className="flex gap-2 mt-2 flex-wrap">
              {menu.dietaryTags.map((tag: string, i: number) => (
                <Badge key={i} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        <Button variant="secondary" onClick={() => router.push("/menu-items")}>
          Back to Menu
        </Button>
      </CardContent>
    </Card>
  );
}
