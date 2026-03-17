import Link from "next/link";
import { MessageSquare, UserPlus, Settings, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ChatConversation } from "@/types";

function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "gerade eben";
  if (diffMin < 60) return `vor ${diffMin} Min.`;
  if (diffHrs < 24) return `vor ${diffHrs} Std.`;
  if (diffDays < 7) return `vor ${diffDays} Tag${diffDays > 1 ? "en" : ""}`;
  return new Date(dateStr).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

const TOOL_ICONS: Record<string, { icon: typeof UserPlus; title: string }> = {
  capture_lead: { icon: UserPlus, title: "Lead erfasst" },
  open_configurator: { icon: Settings, title: "Konfigurator geöffnet" },
  schedule_call: { icon: CalendarClock, title: "Anruf geplant" },
};

export function ConversationList({
  conversations,
}: {
  conversations: ChatConversation[];
}) {
  return (
    <div className="space-y-2">
      {conversations.map((conv) => {
        const toolCalls = Array.isArray(conv.tool_calls) ? conv.tool_calls : [];
        const usedTools = new Set(
          toolCalls
            .map((tc) => tc.name as string)
            .filter((name) => name && name in TOOL_ICONS)
        );

        return (
          <Link
            key={conv.id}
            href={`/conversations/${conv.id}`}
            className="glass-card glass-card-hover flex items-center gap-4 rounded-2xl p-4 transition-all"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {conv.summary ||
                  `Session ${conv.session_id?.slice(0, 12) ?? "—"}...`}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {conv.lead_email && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                    {conv.lead_email}
                  </Badge>
                )}
                {usedTools.size > 0 && (
                  <div className="flex items-center gap-1">
                    {Array.from(usedTools).map((name) => {
                      const { icon: Icon, title } = TOOL_ICONS[name];
                      return (
                        <span
                          key={name}
                          title={title}
                          className="flex h-5 w-5 items-center justify-center rounded bg-secondary"
                        >
                          <Icon className="h-3 w-3 text-muted-foreground" />
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{conv.message_count ?? conv.messages?.length ?? 0} Nachrichten</span>
                <span>&middot;</span>
                <span>{conv.locale === "de" ? "🇩🇪 DE" : conv.locale === "en" ? "🇬🇧 EN" : (conv.locale ?? "de").toUpperCase()}</span>
                <span>&middot;</span>
                <span>{getRelativeTime(conv.updated_at)}</span>
              </div>
            </div>
            {conv.sentiment && <StatusBadge status={conv.sentiment} />}
          </Link>
        );
      })}
    </div>
  );
}
