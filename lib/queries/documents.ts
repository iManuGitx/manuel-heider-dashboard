import { createClient } from "@/lib/supabase/server";

export async function getProjectDocuments(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
