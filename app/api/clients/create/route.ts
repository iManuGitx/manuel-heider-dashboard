import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  // Verify admin is authenticated
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { email, full_name, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email und Passwort sind erforderlich" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Passwort muss mindestens 8 Zeichen haben" },
      { status: 400 }
    );
  }

  // Use service role to create the user (admin privilege)
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: newUser, error: createError } =
    await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: full_name || "" },
    });

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  // The handle_new_user trigger will auto-create the profile
  // But update full_name and ensure role is 'client'
  if (newUser?.user) {
    await adminSupabase
      .from("profiles")
      .update({ full_name: full_name || null, role: "client" })
      .eq("id", newUser.user.id);
  }

  return NextResponse.json(
    { success: true, id: newUser?.user?.id },
    { status: 201 }
  );
}
