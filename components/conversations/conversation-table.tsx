import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { ChatConversation } from "@/types";

export function ConversationTable({
  conversations,
}: {
  conversations: ChatConversation[];
}) {
  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Datum</TableHead>
            <TableHead className="hidden sm:table-cell">Sprache</TableHead>
            <TableHead className="hidden md:table-cell">Nachrichten</TableHead>
            <TableHead>Summary</TableHead>
            <TableHead className="hidden lg:table-cell">Lead E-Mail</TableHead>
            <TableHead className="hidden lg:table-cell">Lead</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversations.map((conv) => (
            <TableRow
              key={conv.id}
              className="cursor-pointer hover:bg-secondary/50"
            >
              <TableCell className="whitespace-nowrap">
                <Link
                  href={`/conversations/${conv.id}`}
                  className="font-medium hover:text-primary"
                >
                  {new Date(conv.created_at).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Link>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant="outline" className="uppercase text-xs">
                  {conv.locale}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {conv.messages.length}
              </TableCell>
              <TableCell className="max-w-[300px] truncate text-muted-foreground">
                {conv.summary || `Session ${conv.session_id.slice(0, 12)}...`}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm">
                {conv.lead_email ? (
                  <span>{conv.lead_email}</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {conv.lead_id ? (
                  <Link
                    href={`/leads/${conv.lead_id}`}
                    className="text-primary hover:underline text-sm"
                  >
                    Lead anzeigen
                  </Link>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
