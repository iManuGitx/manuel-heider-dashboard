import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Lead } from "@/types";

export function RecentLeads({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <Card className="glass-card rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Neueste Leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Noch keine Leads vorhanden.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Neueste Leads</CardTitle>
        <Link
          href="/leads"
          className="text-xs text-primary hover:underline"
        >
          Alle anzeigen
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leads.map((lead) => (
            <Link
              key={lead.id}
              href={`/leads/${lead.id}`}
              className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-secondary"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {lead.name || lead.email}
                </p>
                {lead.company && (
                  <p className="truncate text-xs text-muted-foreground">
                    {lead.company}
                  </p>
                )}
              </div>
              <StatusBadge status={lead.status} />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
