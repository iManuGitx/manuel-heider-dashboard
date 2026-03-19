"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FolderPlus } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "@/types/database";

interface Props {
  clients: Pick<Profile, "id" | "full_name" | "email">[];
  onClose: () => void;
}

export function CreateProjectForm({ clients, onClose }: Props) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");
  const [serviceLevel, setServiceLevel] = useState("");
  const [status, setStatus] = useState("draft");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [stripePriceId, setStripePriceId] = useState("");
  const [stripeSetupPriceId, setStripeSetupPriceId] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          client_id: clientId || null,
          service_level: serviceLevel || null,
          status,
          monthly_revenue: monthlyRevenue ? Number(monthlyRevenue) : null,
          start_date: startDate || null,
          stripe_price_id: stripePriceId.trim() || null,
          stripe_setup_price_id: stripeSetupPriceId.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Fehler beim Erstellen");
      } else {
        toast.success(`Projekt "${name}" wurde erstellt`);
        onClose();
        router.refresh();
      }
    } catch {
      toast.error("Netzwerkfehler");
    }
    setCreating(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderPlus className="h-5 w-5" />
          Neues Projekt erstellen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 max-w-2xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">
                Projektname *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Website Redesign"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">
                Kunde
              </label>
              <Select value={clientId} onValueChange={(v) => setClientId(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Kunde auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.full_name || c.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Beschreibung
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Projektbeschreibung..."
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">
                Service Level
              </label>
              <Select value={serviceLevel} onValueChange={(v) => setServiceLevel(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Digital Foundation">Digital Foundation</SelectItem>
                  <SelectItem value="Growth & Automation">Growth & Automation</SelectItem>
                  <SelectItem value="Digital Partner">Digital Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">
                Status
              </label>
              <Select value={status} onValueChange={(v) => setStatus(v ?? "draft")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Entwurf</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="paused">Pausiert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">
                MRR (€)
              </label>
              <Input
                type="number"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(e.target.value)}
                placeholder="49"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">
                Startdatum
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">
                Stripe Price ID (monatlich)
              </label>
              <Input
                value={stripePriceId}
                onChange={(e) => setStripePriceId(e.target.value)}
                placeholder="price_..."
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">
                Setup Price ID (einmalig)
              </label>
              <Input
                value={stripeSetupPriceId}
                onChange={(e) => setStripeSetupPriceId(e.target.value)}
                placeholder="price_..."
                className="text-xs"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={creating}>
              {creating ? "Wird erstellt…" : "Projekt erstellen"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
