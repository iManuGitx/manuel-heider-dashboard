import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserPlus, Settings, CalendarClock } from "lucide-react";
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

function ToolBadges({ toolCalls }: { toolCalls: Record<string, unknown>[] | null }) {
  if (!toolCalls || !Array.isArray(toolCalls)) return null;
  const usedTools = new Set(
    toolCalls
      .map((tc) => tc.name as string)
      .filter((name) => name && name in TOOL_ICONS)
  );
  if (usedTools.size === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {Array.from(usedTools).map((name) => {
        const { icon: Icon, title } = TOOL_ICONS[name];
        return (
          <span
            key={name}
            title={title}
            className="flex h-6 w-6 items-center justify-center rounded bg-secondary"
          >
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          </span>
        );
      })}
    </div>
  );
}

export function ConversationTable({
  conversations,
}: {
  conversations: ChatConversation[];
}) {
  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Datum</TableHead>
            <TableHead className="hidden sm:table-cell">Stimmung</TableHead>
            <TableHead>Summary</TableHead>
            <TableHead className="hidden md:table-cell">Nachr.</TableHead>
            <TableHead className="hidden lg:table-cell">Lead E-Mail</TableHead>
            <TableHead className="hidden sm:table-cell">Sprache</TableHead>
            <TableHead className="hidden xl:table-cell">Tools</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversations.map((conv) => (
            <TableRow
              key={conv.id}
              className="cursor-pointer hover:bg-secondary/50"
            >
              <TableCell className="whitespace-nowrap">
                <Link
                  href={`/conversations/${conv.id}`}
                  className="font-medium hover:text-primary"
                >
                  {getRelativeTime(conv.updated_at)}
                </Link>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {conv.sentiment ? (
                  <StatusBadge status={conv.sentiment} />
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="max-w-[300px] truncate text-muted-foreground">
                {conv.summary || `Session ${conv.session_id.slice(0, 12)}...`}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {conv.message_count ?? conv.messages?.length ?? 0}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm">
                {conv.lead_email ? (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {conv.lead_email}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">Kein Lead</span>
                )}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant="outline" className="uppercase text-xs">
                  {conv.locale === "de" ? "🇩🇪 DE" : conv.locale === "en" ? "🇬🇧 EN" : conv.locale.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                <ToolBadges toolCalls={conv.tool_calls ?? []} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
