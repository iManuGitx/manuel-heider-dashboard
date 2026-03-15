import { createClient } from "@/lib/supabase/server";
import type { Lead, LeadStatus } from "@/types";

export async function getLeads(options?: {
  status?: LeadStatus;
  source?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const supabase = await createClient();
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.source) {
    query = query.eq("source", options.source);
  }
  if (options?.search) {
    query = query.or(
      `name.ilike.%${options.search}%,email.ilike.%${options.search}%,company.ilike.%${options.search}%`
    );
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return { leads: (data as Lead[]) ?? [], total: count ?? 0 };
}

export async function getLead(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Lead;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function updateLeadNotes(id: string, notes: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ notes })
    .eq("id", id);
  if (error) throw error;
}
