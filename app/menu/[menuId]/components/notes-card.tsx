"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil } from "lucide-react";

interface NotesCardProps {
  notes?: string;
  isPublished: boolean;
  onEditClick: () => void;
}

export const NotesCard = memo(function NotesCard({
  notes,
  isPublished,
  onEditClick,
}: NotesCardProps) {
  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Notes</CardTitle>
        {!isPublished && (
          <Button size="sm" variant="outline" onClick={onEditClick}>
            <Pencil className="h-4 w-4 mr-2" />
            {notes ? "Edit Notes" : "Add Notes"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {notes ? (
          <p className="text-sm text-muted-foreground">{notes}</p>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No notes added
          </p>
        )}
      </CardContent>
    </Card>
  );
});
