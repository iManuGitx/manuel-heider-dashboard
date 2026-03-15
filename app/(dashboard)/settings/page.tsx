import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { ProfileForm } from "@/components/settings/profile-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/types";

export default async function SettingsPage() {
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

  if (!profile) redirect("/login");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Einstellungen"
        description="Profil und Konto verwalten"
      />
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="account">Konto</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileForm profile={profile as Profile} />
        </TabsContent>
        <TabsContent value="account">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-sm">Konto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Angemeldet als</p>
                <p className="text-sm text-muted-foreground">
                  {profile.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Mitglied seit</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(profile.created_at).toLocaleDateString(
                    "de-DE",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
