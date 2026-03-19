import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, description, client_id, service_level, status, monthly_revenue, start_date, stripe_price_id, stripe_setup_price_id } = body;

  if (!name?.trim()) {
    return NextResponse.json(
      { error: "Projektname ist erforderlich" },
      { status: 400 }
    );
  }

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
      client_id: client_id || null,
      service_level: service_level?.trim() || null,
      status: status || "draft",
      monthly_revenue: monthly_revenue ? Number(monthly_revenue) : null,
      start_date: start_date || null,
      stripe_price_id: stripe_price_id?.trim() || null,
      stripe_setup_price_id: stripe_setup_price_id?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, project }, { status: 201 });
}
