import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Calendar, DollarSign } from "lucide-react";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="glass-card glass-card-hover rounded-2xl transition-all">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <h3 className="truncate font-semibold">{project.name}</h3>
              {project.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {project.description}
                </p>
              )}
            </div>
            <StatusBadge status={project.status} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {project.monthly_revenue !== null && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" />
                <span>€{Number(project.monthly_revenue).toLocaleString("de-DE")}/mo</span>
              </div>
            )}
            {project.start_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {new Date(project.start_date).toLocaleDateString("de-DE")}
                </span>
              </div>
            )}
            {project.service_level && (
              <span className="rounded bg-secondary px-2 py-0.5 text-xs">
                {project.service_level}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
