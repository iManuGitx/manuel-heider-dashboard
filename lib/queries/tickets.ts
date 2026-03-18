import { createClient } from "@/lib/supabase/server";

export async function getTickets(options?: { status?: string; page?: number }) {
  const supabase = await createClient();
  const page = options?.page ?? 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("tickets")
    .select(
      "*, client:profiles!tickets_client_id_fkey(full_name, email), project:projects(name), ticket_messages(count)",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (options?.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  const { data, count, error } = await query;
  if (error) throw error;

  return { tickets: data ?? [], total: count ?? 0 };
}

export async function getTicket(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tickets")
    .select(
      "*, client:profiles!tickets_client_id_fkey(full_name, email), project:projects(name)"
    )
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function getTicketMessages(ticketId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ticket_messages")
    .select("*, sender:profiles(full_name, role, avatar_url)")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function updateTicketStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tickets")
    .update({ status })
    .eq("id", id);

  return { error: error?.message ?? null };
}
