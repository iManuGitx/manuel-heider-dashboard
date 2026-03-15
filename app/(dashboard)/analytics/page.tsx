import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Website-Metriken und Analysen"
      />
      <Card className="glass-card rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <BarChart3 className="mb-4 h-16 w-16 text-muted-foreground/30" />
          <h3 className="text-lg font-medium">Kommt in Phase 2</h3>
          <p className="mt-1 max-w-md text-center text-sm text-muted-foreground">
            Website-Analytics, Besucherstatistiken und Conversion-Tracking
            werden in der nächsten Phase integriert.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
