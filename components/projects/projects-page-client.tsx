"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { CreateProjectForm } from "./create-project-form";
import type { Profile } from "@/types/database";

interface Props {
  clients: Pick<Profile, "id" | "full_name" | "email">[];
  children: React.ReactNode;
}

export function ProjectsPageClient({ clients, children }: Props) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">{children}</div>
        <Button onClick={() => setShowForm(!showForm)}>
          <FolderPlus className="mr-2 h-4 w-4" />
          Neues Projekt
        </Button>
      </div>
      {showForm && (
        <CreateProjectForm
          clients={clients}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}
