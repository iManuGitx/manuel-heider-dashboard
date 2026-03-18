"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, UserPlus, Settings, CalendarClock, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCallsPanelProps {
  toolCalls: Record<string, unknown>[];
}

const TOOL_META: Record<string, { icon: typeof Wrench; label: string; color: string }> = {
  capture_lead: { icon: UserPlus, label: "Lead erfasst", color: "text-success" },
  open_configurator: { icon: Settings, label: "Konfigurator geöffnet", color: "text-primary" },
  schedule_call: { icon: CalendarClock, label: "Anruf geplant", color: "text-warning" },
};

function ToolCallDetail({ toolCall }: { toolCall: Record<string, unknown> }) {
  const name = toolCall.name as string | undefined;
  const input = toolCall.input as Record<string, string> | undefined;

  if (!input) return null;

  if (name === "capture_lead" && input.email) {
    return (
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">E-Mail:</span>
          <a href={`mailto:${input.email}`} className="text-primary hover:underline">
            {input.email}
          </a>
        </div>
        {input.name && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Name:</span>
            <span>{input.name}</span>
          </div>
        )}
      </div>
    );
  }

  if (name === "open_configurator" && input.level) {
    return (
      <div className="text-sm">
        <span className="text-muted-foreground">Level:</span>{" "}
        <span className="font-medium">{input.level}</span>
      </div>
    );
  }

  if (name === "schedule_call") {
    return (
      <div className="space-y-2 text-sm">
        {input.duration && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Dauer:</span>
            <span>{input.duration}</span>
          </div>
        )}
        {input.date && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Datum:</span>
            <span>{input.date}</span>
          </div>
        )}
        {input.notes && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Details:</span>
            <span>{input.notes}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded bg-secondary/50 p-3 font-mono text-xs text-muted-foreground">
      {JSON.stringify(input, null, 2)}
    </pre>
  );
}

function ToolCallItem({ toolCall, index }: { toolCall: Record<string, unknown>; index: number }) {
  const [open, setOpen] = useState(false);
  const name = toolCall.name as string | undefined;
  const meta = name ? TOOL_META[name] : undefined;
  const Icon = meta?.icon ?? Wrench;
  const label = meta?.label ?? name ?? `Tool Call #${index + 1}`;
  const iconColor = meta?.color ?? "text-primary";
  const timestamp = toolCall.timestamp as string | undefined;

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
        <Icon className={cn("h-4 w-4", iconColor)} />
        <span className="font-medium">{label}</span>
        {timestamp && (
          <span className="ml-auto text-xs text-muted-foreground">
            {new Date(timestamp).toLocaleTimeString("de-DE", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </button>
      {open && (
        <div className="border-t border-border px-4 py-3">
          <ToolCallDetail toolCall={toolCall} />
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
