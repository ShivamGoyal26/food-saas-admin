import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { MenuItemResponse } from "@/schemas/menu";
import { useDeleteMenuItem } from "../hooks";
import { toast } from "sonner";
import { Trash2, Leaf } from "lucide-react";

type MenuItemProps = {
  menu: MenuItemResponse;
};

const MenuItem = ({ menu }: MenuItemProps) => {
  const { mutate: deleteMenuItem, isPending } = useDeleteMenuItem();

  const handleDelete = () => {
    deleteMenuItem(menu._id, {
      onSuccess: () => {
        toast.success("Menu item deleted successfully");
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data ||
          "Something went wrong";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <Card className="group transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
      <CardContent className="flex gap-4 p-4">
        {/* CONTENT */}
        <div className="flex flex-1 flex-col gap-2">
          {/* TITLE + VEG */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold leading-tight">
                {menu.name}
              </h3>
              {menu.cuisine && (
                <p className="text-xs text-muted-foreground capitalize">
                  {menu.cuisine}
                </p>
              )}
            </div>

            {menu.isVeg && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 text-green-600"
              >
                <Leaf className="h-3 w-3" />
                Veg
              </Badge>
            )}
          </div>

          {/* DESCRIPTION */}
          {menu.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {menu.description}
            </p>
          )}

          {menu.sizes.map((size) => (
            <p key={size.label} className="text-sm font-medium">
              ₹ {size.priceInPaise}{" "}
              <span className="text-xs text-muted-foreground">
                ({size.label})
              </span>
              <span className="text-xs text-muted-foreground">
                ({size.calories} kcal)
              </span>
              {size.isDefault && (
                <Badge key={size.label} variant="outline">
                  Default
                </Badge>
              )}
            </p>
          ))}

          {/* TAGS */}
          {(menu.tags?.length > 0 || menu.dietaryTags?.length > 0) && (
            <div className="flex flex-wrap gap-1 pt-1">
              {menu.tags?.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
              {menu.dietaryTags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <Separator />

      {/* ACTIONS */}
      <CardFooter className="flex justify-end gap-2 p-3">
        {/* Later: Edit */}
        {/* <Button size="sm" variant="outline">Edit</Button> */}

        <Button
          size="sm"
          variant="destructive"
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuItem;
