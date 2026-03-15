"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <AlertTriangle className="mb-4 h-12 w-12 text-destructive" />
      <h2 className="text-lg font-semibold">Etwas ist schiefgelaufen</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {error.message || "Ein unerwarteter Fehler ist aufgetreten."}
      </p>
      <Button onClick={reset} className="mt-4">
        Erneut versuchen
      </Button>
    </div>
  );
}
