"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  Building,
  Calendar,
  Globe,
  FileText,
} from "lucide-react";
import type { Lead, LeadStatus } from "@/types";

const STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
];

export function LeadDetailCard({ lead }: { lead: Lead }) {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const updateStatus = async (newStatus: LeadStatus) => {
    setStatus(newStatus);
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", lead.id);
    if (error) {
      toast.error("Fehler beim Aktualisieren");
      setStatus(lead.status);
    } else {
      toast.success("Status aktualisiert");
      router.refresh();
    }
  };

  const saveNotes = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("leads")
      .update({ notes })
      .eq("id", lead.id);
    setSaving(false);
    if (error) {
      toast.error("Fehler beim Speichern");
    } else {
      toast.success("Notizen gespeichert");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card className="glass-card rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{lead.name || lead.email}</CardTitle>
              <StatusBadge status={status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">E-Mail</p>
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {lead.email}
                  </a>
                </div>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Telefon</p>
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-sm hover:underline"
                    >
                      {lead.phone}
                    </a>
                  </div>
                </div>
              )}
              {lead.company && (
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Firma</p>
                    <p className="text-sm">{lead.company}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Quelle</p>
                  <p className="text-sm capitalize">{lead.source}</p>
                </div>
              </div>
              {lead.service_level && (
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Service Level
                    </p>
                    <p className="text-sm">{lead.service_level}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Erstellt</p>
                  <p className="text-sm">
                    {new Date(lead.created_at).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
            {lead.pain_point && (
              <div>
                <p className="text-xs text-muted-foreground">Pain Point</p>
                <p className="mt-1 text-sm">{lead.pain_point}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm">Notizen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border bg-secondary p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Notizen zum Lead..."
            />
            <Button size="sm" onClick={saveNotes} disabled={saving}>
              {saving ? "Speichern..." : "Notizen speichern"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="glass-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm">Status ändern</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {STATUSES.map((s) => (
                <Button
                  key={s}
                  variant={s === status ? "default" : "outline"}
                  size="sm"
                  className="justify-start"
                  onClick={() => updateStatus(s)}
                >
                  <StatusBadge status={s} />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
