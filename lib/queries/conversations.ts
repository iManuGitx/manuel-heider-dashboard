import { createClient } from "@/lib/supabase/server";
import type { ChatConversation } from "@/types";

export async function getConversations(options?: {
  sentiment?: string;
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
    .from("chat_conversations")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (options?.sentiment) {
    query = query.eq("sentiment", options.sentiment);
  }
  if (options?.search) {
    query = query.ilike("summary", `%${options.search}%`);
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return {
    conversations: (data as ChatConversation[]) ?? [],
    total: count ?? 0,
  };
}

export async function getConversation(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_conversations")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as ChatConversation;
}
