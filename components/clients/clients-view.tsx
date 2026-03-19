"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Mail, User, CreditCard, Check, X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function ClientsView({ clients: initialClients }: { clients: Profile[] }) {
  const router = useRouter();
  const [clients, setClients] = useState(initialClients);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editingStripeId, setEditingStripeId] = useState<string | null>(null);
  const [stripeIdValue, setStripeIdValue] = useState("");

  async function handleCreateClient(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;

    setCreating(true);
    try {
      const res = await fetch("/api/clients/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, full_name: fullName, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Fehler beim Erstellen");
      } else {
        toast.success(`Kunde ${email} wurde erstellt`);
        setEmail("");
        setFullName("");
        setPassword("");
        setShowForm(false);
        router.refresh();
      }
    } catch {
      toast.error("Netzwerkfehler");
    }
    setCreating(false);
  }

  async function saveStripeId(clientId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ stripe_customer_id: stripeIdValue || null })
      .eq("id", clientId);

    if (error) {
      toast.error("Fehler beim Speichern");
    } else {
      setClients((prev) =>
        prev.map((c) =>
          c.id === clientId ? { ...c, stripe_customer_id: stripeIdValue || null } : c
        )
      );
      toast.success("Stripe Customer ID gespeichert");
      setEditingStripeId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kunden</h1>
          <p className="text-muted-foreground">
            Kundenzugänge verwalten und neue Accounts erstellen.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Neuer Kunde
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Neuen Kundenaccount erstellen</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateClient} className="flex flex-col gap-4 max-w-md">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">E-Mail *</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kunde@beispiel.de"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Name</label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Max Mustermann"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Passwort *</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mindestens 8 Zeichen"
                    minLength={8}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={creating}>
                  {creating ? "Wird erstellt…" : "Account erstellen"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Abbrechen
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {clients.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Noch keine Kunden vorhanden.</p>
            </CardContent>
          </Card>
        ) : (
          clients.map((client) => (
            <Card key={client.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{client.full_name || "Kein Name"}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {client.email}
                    </p>
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <CreditCard className="h-3 w-3" />
                      {editingStripeId === client.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="text"
                            value={stripeIdValue}
                            onChange={(e) => setStripeIdValue(e.target.value)}
                            placeholder="cus_..."
                            className="h-6 text-xs w-48"
                          />
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => saveStripeId(client.id)}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingStripeId(null)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <button
                          className="text-xs hover:underline cursor-pointer"
                          onClick={() => {
                            setEditingStripeId(client.id);
                            setStripeIdValue(client.stripe_customer_id || "");
                          }}
                        >
                          {client.stripe_customer_id || "Stripe ID zuweisen"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(client.created_at).toLocaleDateString("de-DE")}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
