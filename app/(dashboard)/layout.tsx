import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Toaster } from "sonner";
import type { Profile } from "@/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDevBypass =
    process.env.NODE_ENV === "development" &&
    process.env.DEV_BYPASS_AUTH === "true";

  let userProfile: Profile;

  if (isDevBypass) {
    userProfile = {
      id: "dev",
      email: "dev@localhost",
      full_name: "Manuel Heider",
      role: "admin",
      avatar_url: null,
    } as Profile;
  } else {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    userProfile = (profile || {
      id: user.id,
      email: user.email || "",
      full_name: user.user_metadata?.full_name || user.email || "",
      role: "admin",
      avatar_url: user.user_metadata?.avatar_url || null,
    }) as Profile;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-60">
        <Header user={userProfile as Profile} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgba(12, 12, 20, 0.85)",
            border: "1px solid rgba(124, 58, 237, 0.18)",
            backdropFilter: "blur(12px)",
            color: "#f0effe",
            borderRadius: "14px",
          },
        }}
      />
    </div>
  );
}
