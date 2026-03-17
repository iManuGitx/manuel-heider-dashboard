import { getConversation } from "@/lib/queries/conversations";
import { getLead } from "@/lib/queries/leads";
import { MessageThread } from "@/components/conversations/message-thread";
import { ToolCallsPanel } from "@/components/conversations/tool-calls-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Globe,
  Clock,
  Hash,
  MessageSquare,
  User,
  Mail,
  Building,
  Wrench,
  Monitor,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const conversation = await getConversation(id);
  if (!conversation) notFound();

  const lead = conversation.lead_id
    ? await getLead(conversation.lead_id)
    : null;

  const toolCalls = Array.isArray(conversation.tool_calls)
    ? conversation.tool_calls
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/conversations"
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
        >
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
        <Badge variant="outline" className="uppercase">
          {conversation.locale === "de" ? "🇩🇪 DE" : conversation.locale === "en" ? "🇬🇧 EN" : conversation.locale.toUpperCase()}
        </Badge>
        {conversation.sentiment && (
          <StatusBadge status={conversation.sentiment} />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="space-y-6 lg:col-span-3">
          <Card className="glass-card rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4" />
                Nachrichten ({conversation.message_count ?? conversation.messages.length})
              </CardTitle>
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

          {toolCalls.length > 0 && (
            <Card className="glass-card rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Wrench className="h-4 w-4" />
                  Tool Calls ({toolCalls.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ToolCallsPanel toolCalls={toolCalls} />
              </CardContent>
            </Card>
          )}
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
                <span>{conversation.locale === "de" ? "Deutsch" : conversation.locale === "en" ? "English" : conversation.locale.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Nachrichten:</span>
                <span>{conversation.message_count ?? conversation.messages.length}</span>
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
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Aktualisiert:</span>
                <span>
                  {new Date(conversation.updated_at).toLocaleDateString(
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
              {conversation.lead_email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Lead E-Mail:</span>
                  <a
                    href={`mailto:${conversation.lead_email}`}
                    className="text-primary hover:underline"
                  >
                    {conversation.lead_email}
                  </a>
                </div>
              )}
              {conversation.visitor_ip && (
                <div className="flex items-center gap-2 text-sm">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">IP:</span>
                  <span className="font-mono text-xs">
                    {conversation.visitor_ip}
                  </span>
                </div>
              )}
              {conversation.sentiment && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Stimmung:</span>
                  <StatusBadge status={conversation.sentiment} />
                </div>
              )}
            </CardContent>
          </Card>

          {lead && (
            <Card className="glass-card rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  Verknüpfter Lead
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lead.name && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-primary hover:underline"
                  >
                    {lead.email}
                  </a>
                </div>
                {lead.company && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.company}</span>
                  </div>
                )}
                <div className="pt-1">
                  <StatusBadge status={lead.status} />
                </div>
                <Link
                  href={`/leads/${lead.id}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-full"
                  )}
                >
                  Lead-Details anzeigen
                </Link>
              </CardContent>
            </Card>
          )}

          {!lead && conversation.lead_id && (
            <Link
              href={`/leads/${conversation.lead_id}`}
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              Verknüpften Lead anzeigen
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
