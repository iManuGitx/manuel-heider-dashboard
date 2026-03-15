# Manuel Heider — Admin Dashboard

Admin-Dashboard für AI Automation & Digital Systems. Verwaltet Leads, Chatbot-Konversationen und Projekte.

**Live:** `dashboard.manuel-heider.com`

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Auth:** Supabase Auth (Magic Link + Google OAuth)
- **Datenbank:** Supabase PostgreSQL + Row Level Security
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Charts:** Recharts
- **Deployment:** Vercel

## Setup

### 1. Repository klonen

```bash
git clone <repo-url>
cd manuel-heider-dashboard
pnpm install
```

### 2. Umgebungsvariablen

```bash
cp .env.example .env.local
```

Ausfüllen:

| Variable | Beschreibung |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Projekt-URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role Key (für Webhook) |
| `WEBHOOK_SECRET` | Shared Secret für Lead-Webhook |
| `NEXT_PUBLIC_SITE_URL` | Dashboard-URL |

### 3. Supabase Schema

SQL aus `supabase/schema.sql` im Supabase SQL Editor ausführen.

### 4. Admin-Benutzer einrichten

Nach der ersten Anmeldung in Supabase den eigenen Benutzer als Admin setzen:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'deine@email.de';
```

### 5. Development starten

```bash
pnpm dev
```

Öffne [http://localhost:3000](http://localhost:3000).

## Vercel Deployment

1. Neues Vercel-Projekt erstellen
2. Repository verbinden
3. Umgebungsvariablen in Vercel eintragen
4. Domain `dashboard.manuel-heider.com` konfigurieren

## Webhook

Leads von `manuel-heider.com` können per POST an `/api/webhooks/lead` gesendet werden:

```bash
curl -X POST https://dashboard.manuel-heider.com/api/webhooks/lead \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: YOUR_SECRET" \
  -d '{"email": "test@example.com", "name": "Test Lead", "source": "website"}'
```

## Projektstruktur

```
app/
├── (auth)/           # Login & Auth Callback
├── (dashboard)/      # Dashboard-Seiten (geschützt)
│   ├── leads/        # Lead-Verwaltung
│   ├── conversations/# Chatbot-Konversationen
│   ├── projects/     # Projekte
│   ├── analytics/    # Analytics (Phase 2)
│   └── settings/     # Einstellungen
├── api/webhooks/     # Webhook-Endpoints
└── middleware.ts      # Auth-Guard
```
