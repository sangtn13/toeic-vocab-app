"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/hooks/use-i18n";

export function ApiWarning({
  title,
  message,
  onRetry,
  showRetry = false
}: {
  title: string;
  message: string;
  onRetry?: () => unknown | Promise<unknown>;
  showRetry?: boolean;
}) {
  const sharedCopy = useI18n("common").shared;

  return (
    <Card className="app-surface border-amber-300/60 bg-amber-50/80">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-amber-100 p-2 text-amber-700">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-amber-900">{title}</p>
            <p className="text-sm leading-6 text-amber-800">{message}</p>
          </div>
        </div>
        {showRetry && onRetry ? (
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => void onRetry()}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            {sharedCopy.retry}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
