import { getLead } from "@/lib/queries/leads";
import { LeadDetailCard } from "@/components/leads/lead-detail-card";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Lead } from "@/types";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const lead = await getLead(id);
  if (!lead) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/leads" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            {lead.name || lead.email}
          </h1>
          <p className="text-sm text-muted-foreground">Lead-Details</p>
        </div>
      </div>
      <LeadDetailCard lead={lead} />
    </div>
  );
}
