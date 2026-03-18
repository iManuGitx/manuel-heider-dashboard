"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useCallback, useState } from "react";

const LOCALES = [
  { value: "", label: "Alle Sprachen" },
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
];

const LEAD_OPTIONS = [
  { value: "", label: "Alle Chats" },
  { value: "yes", label: "Mit Lead" },
  { value: "no", label: "Ohne Lead" },
];

const SENTIMENT_OPTIONS = [
  { value: "", label: "Alle Stimmungen" },
  { value: "positive", label: "Positiv" },
  { value: "neutral", label: "Neutral" },
  { value: "negative", label: "Negativ" },
];

const PERIOD_OPTIONS = [
  { value: "", label: "Alle Zeiträume" },
  { value: "today", label: "Heute" },
  { value: "7d", label: "Letzte 7 Tage" },
  { value: "30d", label: "Letzte 30 Tage" },
];

export function ConversationFilters() {
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
      router.push(`/conversations?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams("search", search);
  };

  const clearFilters = () => {
    setSearch("");
    router.push("/conversations");
  };

  const hasFilters =
    searchParams.has("locale") ||
    searchParams.has("hasLead") ||
    searchParams.has("sentiment") ||
    searchParams.has("period") ||
    searchParams.has("search") ||
    searchParams.has("dateFrom") ||
    searchParams.has("dateTo");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Suche in Summary & Lead-E-Mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-secondary pl-9"
        />
      </form>
      <select
        value={searchParams.get("sentiment") ?? ""}
        onChange={(e) => updateParams("sentiment", e.target.value)}
        className="h-9 rounded-lg border border-border bg-secondary px-3 text-sm"
      >
        {SENTIMENT_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <select
        value={searchParams.get("period") ?? ""}
        onChange={(e) => updateParams("period", e.target.value)}
        className="h-9 rounded-lg border border-border bg-secondary px-3 text-sm"
      >
        {PERIOD_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <select
        value={searchParams.get("locale") ?? ""}
        onChange={(e) => updateParams("locale", e.target.value)}
        className="h-9 rounded-lg border border-border bg-secondary px-3 text-sm"
      >
        {LOCALES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <select
        value={searchParams.get("hasLead") ?? ""}
        onChange={(e) => updateParams("hasLead", e.target.value)}
        className="h-9 rounded-lg border border-border bg-secondary px-3 text-sm"
      >
        {LEAD_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <Input
        type="date"
        value={searchParams.get("dateFrom") ?? ""}
        onChange={(e) => updateParams("dateFrom", e.target.value)}
        className="h-9 w-auto bg-secondary text-sm"
        placeholder="Von"
      />
      <Input
        type="date"
        value={searchParams.get("dateTo") ?? ""}
        onChange={(e) => updateParams("dateTo", e.target.value)}
        className="h-9 w-auto bg-secondary text-sm"
        placeholder="Bis"
      />
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="mr-1 h-4 w-4" />
          Reset
        </Button>
      )}
    </div>
  );
}
