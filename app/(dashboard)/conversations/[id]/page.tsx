import { getConversation } from "@/lib/queries/conversations";
import { MessageThread } from "@/components/conversations/message-thread";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, Globe, Clock, Hash } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ChatConversation } from "@/types";

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let conversation: ChatConversation;
  try {
    conversation = await getConversation(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/conversations" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {conversation.summary ||
              `Session ${conversation.session_id.slice(0, 12)}`}
          </h1>
          <p className="text-sm text-muted-foreground">
            Konversations-Details
          </p>
        </div>
        {conversation.sentiment && (
          <StatusBadge status={conversation.sentiment} />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card className="glass-card rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm">Nachrichten</CardTitle>
            </CardHeader>
            <CardContent>
              {conversation.messages.length > 0 ? (
                <MessageThread messages={conversation.messages} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Keine Nachrichten vorhanden.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="glass-card rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Session:</span>
                <span className="truncate font-mono text-xs">
                  {conversation.session_id}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Sprache:</span>
                <span>{conversation.locale.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Erstellt:</span>
                <span>
                  {new Date(conversation.created_at).toLocaleDateString(
                    "de-DE",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
              </div>
              {conversation.visitor_ip && (
                <div className="text-sm">
                  <span className="text-muted-foreground">IP:</span>{" "}
                  <span className="font-mono text-xs">
                    {conversation.visitor_ip}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {conversation.lead_id && (
            <Link href={`/leads/${conversation.lead_id}`} className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
              Verknüpften Lead anzeigen
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
