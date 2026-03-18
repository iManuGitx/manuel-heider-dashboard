import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { MessageSquare } from "lucide-react";
import type { ChatConversation } from "@/types";

export function RecentConversations({
  conversations,
}: {
  conversations: ChatConversation[];
}) {
  if (conversations.length === 0) {
    return (
      <Card className="glass-card rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Letzte Konversationen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Noch keine Konversationen vorhanden.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">
          Letzte Konversationen
        </CardTitle>
        <Link
          href="/conversations"
          className="text-xs text-primary hover:underline"
        >
          Alle anzeigen
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/conversations/${conv.id}`}
              className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
            >
              <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">
                  {conv.summary || `Session ${conv.session_id?.slice(0, 8) ?? "—"}...`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {conv.messages?.length ?? 0} Nachrichten &middot;{" "}
                  {new Date(conv.created_at).toLocaleDateString("de-DE")}
                </p>
              </div>
              {conv.sentiment && (
                <StatusBadge status={conv.sentiment} />
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
