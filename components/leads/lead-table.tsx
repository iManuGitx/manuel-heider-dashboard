import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Lead } from "@/types";

export function LeadTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">E-Mail</TableHead>
            <TableHead className="hidden md:table-cell">Firma</TableHead>
            <TableHead className="hidden lg:table-cell">Quelle</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Datum</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id} className="cursor-pointer hover:bg-secondary/50">
              <TableCell>
                <Link
                  href={`/leads/${lead.id}`}
                  className="font-medium hover:text-primary"
                >
                  {lead.name || "—"}
                </Link>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {lead.email}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {lead.company || "—"}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground capitalize">
                {lead.source}
              </TableCell>
              <TableCell>
                <StatusBadge status={lead.status} />
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {new Date(lead.created_at).toLocaleDateString("de-DE")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
