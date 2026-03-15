import { createClient } from "@/lib/supabase/server";
import type { Project, ProjectStatus } from "@/types";

export async function getProjects(options?: {
  status?: ProjectStatus;
  search?: string;
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
      .from("projects")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (options?.status) {
      query = query.eq("status", options.status);
    }
    if (options?.search) {
      query = query.or(
        `name.ilike.%${options.search}%,description.ilike.%${options.search}%`
      );
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return { projects: (data as Project[]) ?? [], total: count ?? 0 };
  } catch {
    return { projects: [], total: 0 };
  }
}

export async function getProject(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Project;
  } catch {
    return null;
  }
}
