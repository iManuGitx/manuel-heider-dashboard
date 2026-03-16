import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import type { ChatConversation } from "@/types";

interface ChatStatsWidgetProps {
  recentChats: ChatConversation[];
  stats: {
    total: number;
    today: number;
    thisWeek: number;
  };
}

export function ChatStatsWidget({ recentChats, stats }: ChatStatsWidgetProps) {
  return (
    <Card className="glass-card rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Letzte Chats</CardTitle>
        <Link
          href="/conversations"
          className="text-xs text-primary hover:underline"
        >
          Alle anzeigen
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-secondary/50 p-3 text-center">
            <p className="text-2xl font-bold">{stats.today}</p>
            <p className="text-[10px] text-muted-foreground">Heute</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3 text-center">
            <p className="text-2xl font-bold">{stats.thisWeek}</p>
            <p className="text-[10px] text-muted-foreground">Diese Woche</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-[10px] text-muted-foreground">Gesamt</p>
          </div>
        </div>

        {recentChats.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Noch keine Chats vorhanden.
          </p>
        ) : (
          <div className="space-y-2">
            {recentChats.map((conv) => (
              <Link
                key={conv.id}
                href={`/conversations/${conv.id}`}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
              >
                <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    {conv.summary ||
                      `Session ${conv.session_id.slice(0, 8)}...`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {conv.messages.length} Nachrichten &middot;{" "}
                    {conv.locale.toUpperCase()} &middot;{" "}
                    {new Date(conv.created_at).toLocaleDateString("de-DE")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
