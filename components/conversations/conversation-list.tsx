import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ChatConversation } from "@/types";

export function ConversationList({
  conversations,
}: {
  conversations: ChatConversation[];
}) {
  return (
    <div className="space-y-2">
      {conversations.map((conv) => (
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
                `Session ${conv.session_id.slice(0, 12)}...`}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{conv.messages.length} Nachrichten</span>
              <span>&middot;</span>
              <span>{conv.locale.toUpperCase()}</span>
              <span>&middot;</span>
              <span>
                {new Date(conv.created_at).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          {conv.sentiment && <StatusBadge status={conv.sentiment} />}
        </Link>
      ))}
    </div>
  );
}
