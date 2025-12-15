"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ExternalLink } from "lucide-react";
import { formatDateForDisplay } from "../../utils/date";
import { MenuHeaderProps } from "./types";

export function MenuHeader({
  type,
  selectedDate,
  isDraft,
  isPublished,
  menuId,
  hasMenuItems,
  isPublishing,
  onPublish,
}: MenuHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold capitalize">
            {type} Menu {isDraft && "(Draft)"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {formatDateForDisplay(selectedDate)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {menuId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/menu/${menuId}`)}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Manage Inventory
            </Button>
          )}
          {!isPublished && !isDraft && menuId && hasMenuItems && (
            <Button onClick={onPublish} disabled={isPublishing} size="sm">
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
          {isPublished && (
            <Badge variant="default" className="h-fit">
              Published
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
