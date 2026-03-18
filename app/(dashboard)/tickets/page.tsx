import { getTickets } from "@/lib/queries/tickets";
import { TicketsView } from "@/components/tickets/tickets-view";

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const status = params.status || "all";
  const page = parseInt(params.page || "1", 10);

  const { tickets, total } = await getTickets({ status, page });

  return <TicketsView tickets={tickets} total={total} currentStatus={status} currentPage={page} />;
}
