import { createClient } from "@/lib/supabase/server";
import type { ChatConversation } from "@/types";

export async function getConversations(options?: {
  sentiment?: string;
  search?: string;
  locale?: string;
  hasLead?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) {
  try {
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
    if (options?.locale) {
      query = query.eq("locale", options.locale);
    }
    if (options?.hasLead === "yes") {
      query = query.not("lead_id", "is", null);
    } else if (options?.hasLead === "no") {
      query = query.is("lead_id", null);
    }
    if (options?.dateFrom) {
      query = query.gte("created_at", options.dateFrom);
    }
    if (options?.dateTo) {
      query = query.lte("created_at", `${options.dateTo}T23:59:59`);
    }
    if (options?.search) {
      query = query.or(
        `summary.ilike.%${options.search}%,messages::text.ilike.%${options.search}%`
      );
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return {
      conversations: (data as ChatConversation[]) ?? [],
      total: count ?? 0,
    };
  } catch (error) {
    const e = error as { message?: string; code?: string; details?: string };
    console.error("[getConversations] failed:", JSON.stringify({ message: e.message, code: e.code, details: e.details }));
    return { conversations: [], total: 0 };
  }
}

export async function getConversation(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("chat_conversations")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as ChatConversation;
  } catch (error) {
    console.error("[getConversation] failed:", error);
    return null;
  }
}

export async function getChatStats() {
  try {
    const supabase = await createClient();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [totalRes, todayRes, weekRes] = await Promise.all([
      supabase
        .from("chat_conversations")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("chat_conversations")
        .select("id", { count: "exact", head: true })
        .gte("created_at", todayStart),
      supabase
        .from("chat_conversations")
        .select("id", { count: "exact", head: true })
        .gte("created_at", weekAgo),
    ]);

    return {
      total: totalRes.count ?? 0,
      today: todayRes.count ?? 0,
      thisWeek: weekRes.count ?? 0,
    };
  } catch (error) {
    console.error("[getChatStats] failed:", error);
    return { total: 0, today: 0, thisWeek: 0 };
  }
}
