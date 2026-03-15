import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Lead } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-cyan/10 text-cyan border-cyan/20",
  contacted: "bg-primary/10 text-primary border-primary/20",
  qualified: "bg-success/10 text-success border-success/20",
  proposal: "bg-warning/10 text-warning border-warning/20",
  won: "bg-success/10 text-success border-success/20",
  lost: "bg-destructive/10 text-destructive border-destructive/20",
};

export function RecentLeads({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <Card className="border-border">
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
    <Card className="border-border">
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
              <Badge
                variant="outline"
                className={STATUS_COLORS[lead.status] ?? ""}
              >
                {lead.status}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
