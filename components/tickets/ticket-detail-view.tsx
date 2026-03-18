"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Ticket, TicketMessage } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Send, User, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusConfig = {
  open: { label: "Offen", color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
  "in-progress": { label: "In Bearbeitung", color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" },
  resolved: { label: "Erledigt", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
};

export function TicketDetailView({
  ticket,
  messages: initialMessages,
}: {
  ticket: Ticket;
  messages: TicketMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(ticket.status);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  async function handleStatusChange(newStatus: string) {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/tickets/${ticket.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        toast.error("Status konnte nicht geändert werden");
      } else {
        setStatus(newStatus as typeof status);
        toast.success(`Status auf "${statusConfig[newStatus as keyof typeof statusConfig]?.label}" geändert`);
      }
    } catch {
      toast.error("Netzwerkfehler");
    }
    setUpdatingStatus(false);
  }

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;

    setSending(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Nicht authentifiziert");
        setSending(false);
        return;
      }

      const { data, error } = await supabase
        .from("ticket_messages")
        .insert({ ticket_id: ticket.id, sender_id: user.id, message: reply.trim() })
        .select("*, sender:profiles(full_name, role, avatar_url)")
        .single();

      if (error) {
        toast.error("Nachricht konnte nicht gesendet werden");
      } else {
        setMessages((prev) => [...prev, data as TicketMessage]);
        setReply("");
        toast.success("Antwort gesendet");
      }
    } catch {
      toast.error("Netzwerkfehler");
    }
    setSending(false);
  }

  const config = statusConfig[status as keyof typeof statusConfig];
  const clientName = (ticket.client as unknown as { full_name: string; email: string })?.full_name
    || (ticket.client as unknown as { email: string })?.email
    || "Unbekannt";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/tickets" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold truncate">{ticket.subject}</h1>
          <p className="text-sm text-muted-foreground">
            von {clientName}
            {ticket.project?.name && ` · ${ticket.project.name}`}
            {` · ${new Date(ticket.created_at).toLocaleDateString("de-DE")}`}
          </p>
        </div>
      </div>

      {/* Status Controls */}
      <Card>
        <CardContent className="flex items-center gap-4 py-4">
          <span className="text-sm font-medium text-muted-foreground">Status:</span>
          <Select value={status} onValueChange={(v) => v && handleStatusChange(v)} disabled={updatingStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Offen</SelectItem>
              <SelectItem value="in-progress">In Bearbeitung</SelectItem>
              <SelectItem value="resolved">Erledigt</SelectItem>
            </SelectContent>
          </Select>
          <span className={`text-xs font-medium px-2 py-1 rounded-full border ${config?.color}`}>
            {config?.label}
          </span>
        </CardContent>
      </Card>

      {/* Messages Thread */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Nachrichten ({messages.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Noch keine Nachrichten.
            </p>
          ) : (
            messages.map((msg) => {
              const isAdmin = msg.sender?.role === "admin";
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3 p-3 rounded-lg",
                    isAdmin ? "bg-primary/5 border border-primary/10" : "bg-muted/50"
                  )}
                >
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    {isAdmin ? (
                      <Shield className="h-4 w-4 text-primary" />
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {msg.sender?.full_name || "Unbekannt"}
                      </span>
                      {isAdmin && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                          Admin
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.created_at).toLocaleString("de-DE")}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              );
            })
          )}

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="pt-4 border-t space-y-3">
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Antwort schreiben..."
              rows={3}
              required
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={sending || !reply.trim()}>
                <Send className="mr-2 h-4 w-4" />
                {sending ? "Wird gesendet…" : "Antwort senden"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
