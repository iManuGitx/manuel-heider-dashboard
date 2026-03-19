import { Suspense } from "react";
import { getProjects } from "@/lib/queries/projects";
import { getClients } from "@/lib/queries/clients";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectsPageClient } from "@/components/projects/projects-page-client";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderKanban } from "lucide-react";
import type { Project, ProjectStatus } from "@/types";

interface Props {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
}

async function ProjectsList({ searchParams }: Props) {
  const params = await searchParams;
  const { projects } = await getProjects({
    status: params.status as ProjectStatus | undefined,
  });

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="Keine Projekte"
        description="Es gibt noch keine Projekte."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project as Project} />
      ))}
    </div>
  );
}

export default async function ProjectsPage(props: Props) {
  const clients = await getClients();

  return (
    <div className="space-y-6">
      <ProjectsPageClient clients={clients.map(c => ({ id: c.id, full_name: c.full_name, email: c.email }))}>
        <PageHeader
          title="Projekte"
          description="Projektübersicht und -verwaltung"
        />
      </ProjectsPageClient>
      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[160px] rounded-lg" />
            ))}
          </div>
        }
      >
        <ProjectsList searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
