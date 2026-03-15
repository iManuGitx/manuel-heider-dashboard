import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-cyan/10 text-cyan border-cyan/20",
  contacted: "bg-primary/10 text-primary border-primary/20",
  qualified: "bg-success/10 text-success border-success/20",
  proposal: "bg-warning/10 text-warning border-warning/20",
  won: "bg-success/10 text-success border-success/20",
  lost: "bg-destructive/10 text-destructive border-destructive/20",
  draft: "bg-muted text-muted-foreground border-border",
  active: "bg-success/10 text-success border-success/20",
  paused: "bg-warning/10 text-warning border-warning/20",
  completed: "bg-primary/10 text-primary border-primary/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  positive: "bg-success/10 text-success border-success/20",
  neutral: "bg-muted text-muted-foreground border-border",
  negative: "bg-destructive/10 text-destructive border-destructive/20",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Neu",
  contacted: "Kontaktiert",
  qualified: "Qualifiziert",
  proposal: "Angebot",
  won: "Gewonnen",
  lost: "Verloren",
  draft: "Entwurf",
  active: "Aktiv",
  paused: "Pausiert",
  completed: "Abgeschlossen",
  cancelled: "Abgebrochen",
  positive: "Positiv",
  neutral: "Neutral",
  negative: "Negativ",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(STATUS_STYLES[status] ?? "", className)}
    >
      {STATUS_LABELS[status] || status}
    </Badge>
  );
}
