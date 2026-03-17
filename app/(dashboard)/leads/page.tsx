import { Suspense } from "react";
import { getLeads } from "@/lib/queries/leads";
import { PageHeader } from "@/components/ui/page-header";
import { LeadFilters } from "@/components/leads/lead-filters";
import { LeadTable } from "@/components/leads/lead-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { LeadStatus } from "@/types";

interface Props {
  searchParams: Promise<{
    status?: string;
    source?: string;
    search?: string;
    page?: string;
  }>;
}

async function LeadsList({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const { leads, total } = await getLeads({
    status: params.status as LeadStatus | undefined,
    source: params.source,
    search: params.search,
    page,
    limit: 20,
  });

  const totalPages = Math.ceil(total / 20);

  if (leads.length === 0 && page === 1) {
    return (
      <EmptyState
        icon={Users}
        title="Keine Leads gefunden"
        description="Es gibt noch keine Leads oder deine Filter ergeben keine Treffer."
      />
    );
  }

  return (
    <>
      <LeadTable leads={leads} />
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            {total} Lead{total !== 1 ? "s" : ""} gesamt
          </p>
          <div className="flex items-center gap-2">
            {page > 1 && (
              <Link
                href={`/leads?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}
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
                href={`/leads?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
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

export default function LeadsPage(props: Props) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Verwalte deine Leads und Kontakte"
      />
      <Suspense fallback={null}>
        <LeadFilters />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-100 rounded-lg" />}>
        <LeadsList searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
