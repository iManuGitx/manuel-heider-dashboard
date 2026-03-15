"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useCallback, useState } from "react";

const STATUSES = [
  { value: "", label: "Alle Status" },
  { value: "new", label: "Neu" },
  { value: "contacted", label: "Kontaktiert" },
  { value: "qualified", label: "Qualifiziert" },
  { value: "proposal", label: "Angebot" },
  { value: "won", label: "Gewonnen" },
  { value: "lost", label: "Verloren" },
];

const SOURCES = [
  { value: "", label: "Alle Quellen" },
  { value: "website", label: "Website" },
  { value: "chatbot", label: "Chatbot" },
  { value: "configurator", label: "Konfigurator" },
  { value: "manual", label: "Manuell" },
];

export function LeadFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/leads?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams("search", search);
  };

  const clearFilters = () => {
    setSearch("");
    router.push("/leads");
  };

  const hasFilters =
    searchParams.has("status") ||
    searchParams.has("source") ||
    searchParams.has("search");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <form onSubmit={handleSearch} className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Suche nach Name, E-Mail, Firma..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-secondary pl-9"
        />
      </form>
      <select
        value={searchParams.get("status") ?? ""}
        onChange={(e) => updateParams("status", e.target.value)}
        className="h-9 rounded-lg border border-border bg-secondary px-3 text-sm"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <select
        value={searchParams.get("source") ?? ""}
        onChange={(e) => updateParams("source", e.target.value)}
        className="h-9 rounded-lg border border-border bg-secondary px-3 text-sm"
      >
        {SOURCES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="mr-1 h-4 w-4" />
          Reset
        </Button>
      )}
    </div>
  );
}
