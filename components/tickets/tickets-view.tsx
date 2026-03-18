"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Ticket } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, AlertCircle, CheckCircle } from "lucide-react";

const statusConfig = {
  open: { label: "Offen", color: "text-purple-400 bg-purple-400/10 border-purple-400/20", icon: AlertCircle },
  "in-progress": { label: "In Bearbeitung", color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20", icon: Clock },
  resolved: { label: "Erledigt", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", icon: CheckCircle },
};

export function TicketsView({
  tickets,
  total,
  currentStatus,
  currentPage,
}: {
  tickets: Ticket[];
  total: number;
  currentStatus: string;
  currentPage: number;
}) {
  const router = useRouter();

  function setFilter(status: string) {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    router.push(`/tickets?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tickets</h1>
        <p className="text-muted-foreground">
          Support-Anfragen von Kunden verwalten. ({total} gesamt)
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "open", "in-progress", "resolved"].map((s) => (
          <Button
            key={s}
            variant={currentStatus === s ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(s)}
          >
            {s === "all" ? "Alle" : statusConfig[s as keyof typeof statusConfig]?.label ?? s}
          </Button>
        ))}
      </div>

      {/* Ticket List */}
      {tickets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Keine Tickets gefunden.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => {
            const config = statusConfig[ticket.status as keyof typeof statusConfig];
            const Icon = config?.icon || AlertCircle;
            const msgCount = (ticket.ticket_messages?.[0] as unknown as { count: number })?.count ?? 0;

            return (
              <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                <Card className="hover:border-primary/30 transition-colors cursor-pointer mb-3">
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Icon className={`h-5 w-5 flex-shrink-0 ${config?.color.split(" ")[0]}`} />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{ticket.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {(ticket.client as unknown as { full_name: string; email: string })?.full_name || (ticket.client as unknown as { email: string })?.email || "Unbekannt"}
                          {ticket.project?.name && ` · ${ticket.project.name}`}
                          {` · ${msgCount} Nachrichten`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${config?.color}`}>
                        {config?.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(ticket.created_at).toLocaleDateString("de-DE")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
