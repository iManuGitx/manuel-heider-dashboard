import { getTicket, getTicketMessages } from "@/lib/queries/tickets";
import { TicketDetailView } from "@/components/tickets/ticket-detail-view";
import { notFound } from "next/navigation";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ticket = await getTicket(id);
  if (!ticket) notFound();

  const messages = await getTicketMessages(id);

  return <TicketDetailView ticket={ticket} messages={messages} />;
}
