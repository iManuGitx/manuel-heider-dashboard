"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/ui/logo";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Mail, Loader2 } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const supabase = createClient();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });
    setLoading(false);
    if (!error) setSent(true);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });
  };

  return (
    <div className="glass-card w-full max-w-md rounded-2xl p-8">
      <div className="space-y-6 text-center">
        <div className="mx-auto w-fit">
          <Logo size={56} />
        </div>
        <div>
          <h1
            className="gradient-text text-3xl font-bold"
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            Manuel Heider
          </h1>
          <p className="section-label mt-2">Admin Dashboard</p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {error === "unauthorized" && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-center text-sm text-destructive backdrop-blur-sm">
            Zugriff verweigert. Nur Administratoren haben Zugang.
          </div>
        )}

        {sent ? (
          <div className="rounded-xl border border-success/30 bg-success/10 p-6 text-center backdrop-blur-sm">
            <Mail className="mx-auto mb-3 h-10 w-10 text-success" />
            <p className="font-semibold text-success" style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}>
              Magic Link gesendet!
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Prüfe deine E-Mail ({email}) und klicke auf den Link.
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={handleMagicLink} className="space-y-4">
              <Input
                type="email"
                placeholder="deine@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl border-border bg-[rgba(12,12,20,0.5)] text-foreground placeholder:text-muted-foreground focus:border-primary/50"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-gradient flex h-11 w-full items-center justify-center gap-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                Magic Link senden
              </button>
            </form>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">oder</span>
              <Separator className="flex-1" />
            </div>

            <button
              onClick={handleGoogleLogin}
              className="btn-ghost-pill flex h-11 w-full items-center justify-center gap-2 bg-transparent text-sm font-medium text-foreground"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Mit Google anmelden
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
