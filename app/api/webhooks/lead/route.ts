import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

function verifySecret(provided: string | null): boolean {
  const expected = process.env.WEBHOOK_SECRET;
  if (!expected || !provided) return false;

  try {
    const a = Buffer.from(provided, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const secret =
    request.headers.get("x-webhook-secret") ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!verifySecret(secret ?? null)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  if (!body.email || typeof body.email !== "string") {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.from("leads").insert({
    email: body.email,
    name: body.name ?? null,
    company: body.company ?? null,
    phone: body.phone ?? null,
    service_level: body.service_level ?? null,
    pain_point: body.pain_point ?? null,
    source: (body.source as string) ?? "webhook",
    notes: body.notes ?? null,
    answers: body.answers ?? null,
  }).select("id").single();

  if (error) {
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, id: data.id },
    { status: 201 }
  );
}
