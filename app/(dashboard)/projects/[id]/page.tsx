import { getProject } from "@/lib/queries/projects";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Project } from "@/types";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let project: Project;
  try {
    project = await getProject(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/projects" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-sm text-muted-foreground">Projekt-Details</p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="glass-card rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm">Beschreibung</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {project.description || "Keine Beschreibung vorhanden."}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="glass-card rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.monthly_revenue !== null && (
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">MRR</p>
                    <p className="text-lg font-semibold text-success">
                      €{Number(project.monthly_revenue).toLocaleString("de-DE")}
                    </p>
                  </div>
                </div>
              )}
              {project.service_level && (
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Service Level
                    </p>
                    <p className="text-sm">{project.service_level}</p>
                  </div>
                </div>
              )}
              {project.start_date && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Start</p>
                    <p className="text-sm">
                      {new Date(project.start_date).toLocaleDateString(
                        "de-DE",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              )}
              {project.next_billing && (
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Nächste Abrechnung
                    </p>
                    <p className="text-sm">
                      {new Date(project.next_billing).toLocaleDateString(
                        "de-DE"
                      )}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Erstellt</p>
                  <p className="text-sm">
                    {new Date(project.created_at).toLocaleDateString(
                      "de-DE"
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
