"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCallsPanelProps {
  toolCalls: Record<string, unknown>[];
}

function ToolCallItem({ toolCall, index }: { toolCall: Record<string, unknown>; index: number }) {
  const [open, setOpen] = useState(false);
  const name =
    (toolCall.name as string) ||
    (toolCall.function as string) ||
    (toolCall.type as string) ||
    `Tool Call #${index + 1}`;

  return (
    <div className="rounded-lg border border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm transition-colors hover:bg-secondary/50"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
        <Wrench className="h-4 w-4 text-primary" />
        <span className="font-medium">{name}</span>
      </button>
      {open && (
        <div className="border-t border-border px-4 py-3">
          <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded bg-secondary/50 p-3 font-mono text-xs text-muted-foreground">
            {JSON.stringify(toolCall, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export function ToolCallsPanel({ toolCalls }: ToolCallsPanelProps) {
  return (
    <div className="space-y-2">
      {toolCalls.map((tc, i) => (
        <ToolCallItem key={i} toolCall={tc} index={i} />
      ))}
    </div>
  );
}
