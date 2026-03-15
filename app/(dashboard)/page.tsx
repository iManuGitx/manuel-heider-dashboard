import { Suspense } from "react";
import { Users, UserCheck, FolderKanban, DollarSign } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { LeadsOverTimeChart } from "@/components/charts/leads-over-time";
import { LeadsBySourceChart } from "@/components/charts/leads-by-source";
import { LeadStatusDistributionChart } from "@/components/charts/lead-status-distribution";
import { RecentLeads } from "@/components/dashboard/recent-leads";
import { RecentConversations } from "@/components/dashboard/recent-conversations";
import {
  getDashboardStats,
  getLeadsOverTime,
  getLeadsBySource,
  getLeadStatusDistribution,
  getRecentLeads,
  getRecentConversations,
} from "@/lib/queries/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Lead, ChatConversation } from "@/types";

function KpiSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-25 rounded-lg" />
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return <Skeleton className="h-82.5 rounded-lg" />;
}

async function KpiCards() {
  const stats = await getDashboardStats();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="Neue Leads (Woche)"
        value={stats.newLeadsThisWeek}
        icon={Users}
      />
      <KpiCard
        label="Offene Leads"
        value={stats.openLeads}
        icon={UserCheck}
      />
      <KpiCard
        label="Aktive Projekte"
        value={stats.activeProjects}
        icon={FolderKanban}
      />
      <KpiCard
        label="MRR"
        value={`€${stats.mrr.toLocaleString("de-DE")}`}
        icon={DollarSign}
      />
    </div>
  );
}

async function ChartsSection() {
  const [overTime, bySource, statusDist] = await Promise.all([
    getLeadsOverTime(),
    getLeadsBySource(),
    getLeadStatusDistribution(),
  ]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <LeadsOverTimeChart data={overTime} />
      </div>
      <LeadsBySourceChart data={bySource} />
      <LeadStatusDistributionChart data={statusDist} />
    </div>
  );
}

async function RecentSection() {
  const [leads, conversations] = await Promise.all([
    getRecentLeads(),
    getRecentConversations(),
  ]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <RecentLeads leads={leads as Lead[]} />
      <RecentConversations conversations={conversations as ChatConversation[]} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Übersicht</h1>
        <p className="section-label mt-1">Willkommen im Admin Dashboard</p>
      </div>

      <Suspense fallback={<KpiSkeleton />}>
        <KpiCards />
      </Suspense>

      <Suspense fallback={<div className="grid gap-4 lg:grid-cols-2"><ChartSkeleton /><ChartSkeleton /><ChartSkeleton /></div>}>
        <ChartsSection />
      </Suspense>

      <Suspense fallback={<div className="grid gap-4 lg:grid-cols-2"><ChartSkeleton /><ChartSkeleton /></div>}>
        <RecentSection />
      </Suspense>
    </div>
  );
}
