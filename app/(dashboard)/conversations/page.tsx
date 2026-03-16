import { Suspense } from "react";
import { getConversations } from "@/lib/queries/conversations";
import { PageHeader } from "@/components/ui/page-header";
import { ConversationTable } from "@/components/conversations/conversation-table";
import { ConversationFilters } from "@/components/conversations/conversation-filters";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props {
  searchParams: Promise<{
    sentiment?: string;
    search?: string;
    locale?: string;
    hasLead?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: string;
  }>;
}

async function ConversationsList({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const { conversations, total } = await getConversations({
    sentiment: params.sentiment,
    search: params.search,
    locale: params.locale,
    hasLead: params.hasLead,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    page,
    limit: 20,
  });

  const totalPages = Math.ceil(total / 20);

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="Keine Konversationen"
        description="Es gibt noch keine Chatbot-Konversationen oder deine Filter ergeben keine Treffer."
      />
    );
  }

  return (
    <>
      <ConversationTable conversations={conversations} />
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            {total} Konversation{total !== 1 ? "en" : ""} gesamt
          </p>
          <div className="flex items-center gap-2">
            {page > 1 && (
              <Link
                href={`/conversations?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Zurück
              </Link>
            )}
            <span className="text-sm text-muted-foreground">
              Seite {page} von {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/conversations?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Weiter
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function ConversationsPage(props: Props) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Chat Conversations"
        description="Chatbot-Konversationen von der Website"
      />
      <Suspense fallback={null}>
        <ConversationFilters />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-100 rounded-lg" />}>
        <ConversationsList searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
