"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <FileQuestion className="mb-4 h-12 w-12 text-muted-foreground/50" />
      <h2 className="text-lg font-semibold">Seite nicht gefunden</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Die angeforderte Seite existiert nicht.
      </p>
      <Link href="/" className={cn(buttonVariants(), "mt-4")}>
        Zurück zur Übersicht
      </Link>
    </div>
  );
}
