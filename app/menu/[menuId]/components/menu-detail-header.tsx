"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Calendar, UtensilsCrossed } from "lucide-react";
import { MenuType } from "../../api";

interface MenuDetailHeaderProps {
  menu: MenuType;
  isPublishing: boolean;
  isUnpublishing: boolean;
  onPublish: () => void;
  onUnpublish: () => void;
}

export const MenuDetailHeader = memo(function MenuDetailHeader({
  menu,
  isPublishing,
  isUnpublishing,
  onPublish,
  onUnpublish,
}: MenuDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold capitalize">
            {menu.menuType} Menu
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(menu.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <UtensilsCrossed className="h-4 w-4" />
              {menu.totalItems} items
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {menu.isDraft && <Badge variant="secondary">Draft</Badge>}
          {menu.isPublished ? (
            <>
              <Badge variant="default">Published</Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={onUnpublish}
                disabled={isUnpublishing}
              >
                {isUnpublishing ? (
                  <>
                    <Spinner className="h-4 w-4 mr-2" />
                    Unpublishing...
                  </>
                ) : (
                  "Unpublish"
                )}
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={onPublish} disabled={isPublishing}>
              {isPublishing ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  Publishing...
                </>
              ) : (
                "Publish Menu"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});
