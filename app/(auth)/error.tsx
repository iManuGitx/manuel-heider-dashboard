"use client";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-lg font-semibold">Authentifizierung fehlgeschlagen</h2>
      <p className="text-sm text-muted-foreground">
        {error.message || "Ein unerwarteter Fehler ist aufgetreten."}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
      >
        Erneut versuchen
      </button>
    </div>
  );
}
