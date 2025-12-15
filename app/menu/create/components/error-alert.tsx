"use client";

import { memo } from "react";
import { AlertCircle } from "lucide-react";

interface ErrorAlertProps {
  error?: Error & { response?: { data?: { message?: string } } };
}

export const ErrorAlert = memo(function ErrorAlert({ error }: ErrorAlertProps) {
  if (!error) return null;

  const errorMessage =
    error.response?.data?.message || error.message || "An error occurred";

  return (
    <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex gap-3">
      <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
      <div className="flex-1">
        <h3 className="font-semibold text-destructive mb-1">Error</h3>
        <p className="text-sm text-destructive">{errorMessage}</p>
      </div>
    </div>
  );
});
