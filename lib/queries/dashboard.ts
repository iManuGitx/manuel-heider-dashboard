import { createClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createClient();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [leadsRes, newLeadsRes, projectsRes] = await Promise.all([
    supabase.from("leads").select("id, status, source, created_at"),
    supabase
      .from("leads")
      .select("id")
      .gte("created_at", weekAgo.toISOString()),
    supabase
      .from("projects")
      .select("id, status, monthly_revenue"),
  ]);

  const leads = leadsRes.data ?? [];
  const newLeadsThisWeek = newLeadsRes.data?.length ?? 0;
  const projects = projectsRes.data ?? [];

  const openLeads = leads.filter(
    (l) => l.status === "new" || l.status === "contacted"
  ).length;

  const activeProjects = projects.filter(
    (p) => p.status === "active"
  ).length;

  const mrr = projects
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + (Number(p.monthly_revenue) || 0), 0);

  return { newLeadsThisWeek, openLeads, activeProjects, mrr };
}

export async function getLeadsOverTime() {
  const supabase = await createClient();
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data } = await supabase
    .from("leads")
    .select("created_at")
    .gte("created_at", thirtyDaysAgo)
    .order("created_at", { ascending: true });

  const byDay: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    byDay[d.toISOString().split("T")[0]] = 0;
  }

  (data ?? []).forEach((lead) => {
    const day = lead.created_at.split("T")[0];
    if (byDay[day] !== undefined) byDay[day]++;
  });

  return Object.entries(byDay).map(([date, count]) => ({
    date,
    leads: count,
  }));
}

export async function getLeadsBySource() {
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("source");

  const counts: Record<string, number> = {};
  (data ?? []).forEach((lead) => {
    const source = lead.source || "website";
    counts[source] = (counts[source] || 0) + 1;
  });

  return Object.entries(counts).map(([source, count]) => ({
    source,
    count,
  }));
}

export async function getLeadStatusDistribution() {
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("status");

  const counts: Record<string, number> = {};
  (data ?? []).forEach((lead) => {
    counts[lead.status] = (counts[lead.status] || 0) + 1;
  });

  return Object.entries(counts).map(([status, count]) => ({
    status,
    count,
  }));
}

export async function getRecentLeads(limit = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getRecentConversations(limit = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("chat_conversations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}
