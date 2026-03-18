"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Document } from "@/types/database";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

const categoryLabels: Record<string, string> = {
  general: "Allgemein",
  contract: "Vertrag",
  report: "Bericht",
  deliverable: "Lieferobjekt",
};

export function DocumentUpload({
  projectId,
  documents: initialDocuments,
}: {
  projectId: string;
  documents: Document[];
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState(initialDocuments);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("general");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error("Datei darf maximal 50 MB groß sein");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Nicht authentifiziert");
        setUploading(false);
        return;
      }

      const filePath = `${projectId}/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) {
        toast.error(`Upload fehlgeschlagen: ${uploadError.message}`);
        setUploading(false);
        return;
      }

      const { data: doc, error: insertError } = await supabase
        .from("documents")
        .insert({
          project_id: projectId,
          uploaded_by: user.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type || null,
          category,
        })
        .select()
        .single();

      if (insertError) {
        toast.error(`Datensatz konnte nicht erstellt werden: ${insertError.message}`);
      } else {
        setDocuments((prev) => [doc as Document, ...prev]);
        toast.success(`"${file.name}" hochgeladen`);
      }
    } catch {
      toast.error("Netzwerkfehler");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleDelete(doc: Document) {
    if (!confirm(`"${doc.file_name}" wirklich löschen?`)) return;

    const supabase = createClient();
    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([doc.file_path]);

    if (storageError) {
      toast.error("Datei konnte nicht gelöscht werden");
      return;
    }

    const { error: dbError } = await supabase
      .from("documents")
      .delete()
      .eq("id", doc.id);

    if (dbError) {
      toast.error("Datensatz konnte nicht gelöscht werden");
    } else {
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      toast.success("Dokument gelöscht");
    }
  }

  async function handleDownload(doc: Document) {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.file_path, 300);

    if (error || !data?.signedUrl) {
      toast.error("Download-Link konnte nicht erstellt werden");
      return;
    }

    window.open(data.signedUrl, "_blank");
  }

  function formatSize(bytes: number | null) {
    if (!bytes) return "–";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <Card className="glass-card rounded-2xl">
      <CardHeader>
        <CardTitle className="text-sm">Dokumente ({documents.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Form */}
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={category} onValueChange={(v) => v && setCategory(v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Allgemein</SelectItem>
              <SelectItem value="contract">Vertrag</SelectItem>
              <SelectItem value="report">Bericht</SelectItem>
              <SelectItem value="deliverable">Lieferobjekt</SelectItem>
            </SelectContent>
          </Select>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Wird hochgeladen…" : "Datei hochladen"}
          </Button>
        </div>

        {/* Document List */}
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Noch keine Dokumente.
          </p>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{doc.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {categoryLabels[doc.category] || doc.category} · {formatSize(doc.file_size)} · {new Date(doc.created_at).toLocaleDateString("de-DE")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(doc)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
