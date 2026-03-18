"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, Save } from "lucide-react";
import { toast } from "sonner";

export function StripeFields({
  projectId,
  initialSubscriptionId,
  initialPriceId,
}: {
  projectId: string;
  initialSubscriptionId: string | null;
  initialPriceId: string | null;
}) {
  const [subscriptionId, setSubscriptionId] = useState(initialSubscriptionId || "");
  const [priceId, setPriceId] = useState(initialPriceId || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("projects")
      .update({
        stripe_subscription_id: subscriptionId || null,
        stripe_price_id: priceId || null,
      })
      .eq("id", projectId);

    if (error) {
      toast.error("Fehler beim Speichern");
    } else {
      toast.success("Stripe-Daten gespeichert");
    }
    setSaving(false);
  }

  return (
    <Card className="glass-card rounded-2xl">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Stripe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Subscription ID</label>
          <Input
            type="text"
            value={subscriptionId}
            onChange={(e) => setSubscriptionId(e.target.value)}
            placeholder="sub_..."
            className="text-xs"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Price ID</label>
          <Input
            type="text"
            value={priceId}
            onChange={(e) => setPriceId(e.target.value)}
            placeholder="price_..."
            className="text-xs"
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-3 w-3" />
          {saving ? "Speichert…" : "Speichern"}
        </Button>
      </CardContent>
    </Card>
  );
}
