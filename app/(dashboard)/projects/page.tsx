import { Suspense } from "react";
import { getProjects } from "@/lib/queries/projects";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectCard } from "@/components/projects/project-card";
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

export default function ProjectsPage(props: Props) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Projekte"
        description="Projektübersicht und -verwaltung"
      />
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
