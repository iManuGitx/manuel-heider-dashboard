# Manuel Heider — Admin Dashboard

> **dashboard.manuel-heider.com** — Internes Admin-Dashboard fuer Lead-Management, Chatbot-Konversationen und Projektverwaltung.
> Teil der **Manuel Heider Platform** (siehe Architektur unten).

---

## Plattform-Architektur

Die Plattform besteht aus zwei getrennten Next.js-Frontends mit einer gemeinsamen Supabase-Datenbank:

```
www.manuel-heider.com                dashboard.manuel-heider.com
(manuel-heider-nextjs)               (dieses Repo)

 Public Marketing                     Admin Dashboard
   Home, Services                       Leads verwalten
   Pricing, Contact                     Conversations
   Konfigurator                         Projekte (CRUD)
   Legal, Blog                          Analytics
                                        Einstellungen
 Kundenbereich
   /dashboard/*                              |
   Login / Register                          |
         |                                   |
         +----------------+------------------+
                          |
                  Supabase (shared)
                  Auth + PostgreSQL
                  profiles, projects
                  leads, chat_conv.
                          |
                  Stripe (geplant)
                  Customer Portal, Webhooks
```

| Rolle | Website (Client Area) | Dashboard (Admin) |
|-------|----------------------|-------------------|
| `client` | Eigene Projekte, Profil, Billing (Stripe Portal) | Kein Zugriff |
| `admin` | — | Alle Leads, Projekte, Kunden, Analytics |

**Website-Repo:** [github.com/iManuGitx/manuel-heider-nextjs](https://github.com/iManuGitx/manuel-heider-nextjs)

---

## Tech Stack

| Ebene | Technologie |
|-------|-------------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + shadcn/ui (Base Nova Theme) |
| Icons | Lucide React |
| Auth | Supabase Auth (Magic Link + Google OAuth) |
| Datenbank | Supabase PostgreSQL + Row Level Security |
| Charts | Recharts (React Charting) |
| Notifications | Sonner (Toast) |
| Analytics | Vercel Analytics + Speed Insights |
| Deployment | Vercel |

---

## Design System

### Farben (identisch mit Website)

| Token | Wert | Verwendung |
|-------|------|------------|
| primary | `#7c3aed` | Primaerfarbe, aktive Elemente |
| secondary | `#06b6d4` | Sekundaerfarbe, Status |
| background | `#05050a` | Seitenhintergrund |
| card | `#0c0c14` | Karten, Sidebar |
| foreground | `#f0effe` | Haupttext |
| success | `#10b981` | Erfolgsmeldungen |
| warning | `#f59e0b` | Warnungen |
| destructive | `#ef4444` | Fehler, Loeschen |

### Typografie (identisch mit Website)

| Zweck | Font |
|-------|------|
| Display / Headings | Syne |
| Body / Fliesstext | DM Sans |
| Mono / Labels | Space Mono |

---

## Projektstruktur

```
app/
  (auth)/                               Auth-Seiten (Route Group)
    login/page.tsx                       Magic Link + Google OAuth
    callback/route.ts                    Auth Code Exchange
    error.tsx                            Auth-Fehlerbehandlung
    layout.tsx                           Auth-Layout mit Gradient-Orbs
  (dashboard)/                           Dashboard-Seiten (geschuetzt)
    layout.tsx                           Dashboard-Layout (Sidebar + Header)
    page.tsx                             Uebersicht (KPIs + Charts)
    leads/
      page.tsx                           Lead-Liste (filterbar, paginiert)
      [id]/page.tsx                      Lead-Detail mit Status-Editor
      loading.tsx                        Lade-Skeleton
    conversations/
      page.tsx                           Konversationsliste (filterbar)
      [id]/page.tsx                      Konversation mit Message-Thread
      loading.tsx
    projects/
      page.tsx                           Projekt-Grid (Kartenansicht)
      [id]/page.tsx                      Projekt-Detail
      loading.tsx
    analytics/page.tsx                   Analytics (Phase 2 Platzhalter)
    settings/page.tsx                    Profil & Account
    error.tsx, not-found.tsx, loading.tsx
  api/
    webhooks/
      lead/route.ts                      Lead-Ingestion Webhook
  globals.css                            Tailwind + Design Tokens
  layout.tsx                             Root-Layout (Fonts, Analytics)

components/
  charts/                                Recharts Visualisierungen
    leads-over-time.tsx                  Liniendiagramm (30-Tage-Trend)
    leads-by-source.tsx                  Balkendiagramm (Lead-Quellen)
    lead-status-distribution.tsx         Kreisdiagramm (Lead-Status)
  dashboard/                             Dashboard-spezifische Komponenten
    kpi-card.tsx                         KPI-Metrik-Karte
    recent-leads.tsx                     5 neueste Leads
    recent-conversations.tsx             5 neueste Konversationen
  layout/                                App-Layout Komponenten
    sidebar.tsx                          Fixierte Sidebar (w-60)
    sidebar-nav.tsx                      Sidebar-Navigation mit Icons
    header.tsx                           Top-Header mit User-Menu
    mobile-nav.tsx                       Mobile Hamburger-Menu
  leads/                                 Leads-Feature Komponenten
    lead-table.tsx                       Lead-Datentabelle
    lead-filters.tsx                     Filter (Status, Quelle, Suche)
    lead-detail-card.tsx                 Lead-Detailansicht
  conversations/                         Konversations-Komponenten
    conversation-list.tsx                Konversations-Items
    message-thread.tsx                   Message-Bubbles (User vs. Assistant)
  projects/
    project-card.tsx                     Projekt-Karte (Grid-View)
  settings/
    profile-form.tsx                     Profil-Bearbeitungsformular
  ui/                                    34 shadcn/ui Primitives
    button, card, dialog, input, table, tabs, badge, avatar, ...

lib/
  supabase/
    client.ts                            Browser Supabase Client
    server.ts                            Server Supabase Client (SSR)
    middleware.ts                         Auth + Rollen-Middleware
  queries/
    leads.ts                             Lead CRUD + Filterung
    conversations.ts                     Conversation CRUD + Filterung
    projects.ts                          Project CRUD + Filterung
    dashboard.ts                         Dashboard-Stats & Chart-Daten
  utils.ts                               cn() Utility (Classnames)

types/
  database.ts                            Profile, Lead, ChatConversation, Project
  index.ts

supabase/
  schema.sql                             Komplettes Datenbank-Schema
```

---

## Seiten & Features

### Dashboard-Uebersicht (`/`)

| KPI | Beschreibung |
|-----|-------------|
| Neue Leads (Woche) | Anzahl Leads der letzten 7 Tage |
| Offene Leads | Status: `new` oder `contacted` |
| Aktive Projekte | Projekte mit Status `active` |
| MRR | Summe monthly_revenue aller aktiven Projekte |

**Charts:** Leads Over Time (30 Tage), Leads by Source, Lead Status Distribution

### Leads (`/leads`)

| Feature | Status |
|---------|--------|
| Liste mit Filterung (Status, Quelle, Freitext) | Aktiv |
| Paginierung (20 pro Seite) | Aktiv |
| Detail-Ansicht mit Status-Editor | Aktiv |
| Notizen bearbeiten | Aktiv |
| Erstellen via Webhook | Aktiv |
| Manuelles Erstellen (UI) | Geplant |

**Lead-Status-Flow:** `new` → `contacted` → `qualified` → `proposal` → `won` / `lost`

**Lead-Quellen:** `website`, `chatbot`, `configurator`, `manual`, `webhook`

### Chatbot-Konversationen (`/conversations`)

| Feature | Status |
|---------|--------|
| Liste mit Sentiment-Filter | Aktiv |
| Freitext-Suche nach Summary | Aktiv |
| Message-Thread Ansicht | Aktiv |
| Verknuepfung mit Lead | Aktiv |
| KI-generierte Zusammenfassung | Aktiv |

### Projekte (`/projects`)

| Feature | Status |
|---------|--------|
| Grid-Ansicht mit Status-Filter | Aktiv |
| Detail-Ansicht | Aktiv |
| MRR-Tracking | Aktiv |
| Erstellen/Bearbeiten (UI) | Geplant |
| Kunden-Zuordnung | Aktiv |

**Projekt-Status:** `draft` → `active` → `paused` → `completed` / `cancelled`

### Analytics (`/analytics`)

Phase 2 Platzhalter. Geplant: Website-Metriken, Visitor-Stats, Conversion-Tracking, Funnel-Analyse.

### Einstellungen (`/settings`)

- Profil bearbeiten (Name, Avatar)
- Account-Info (E-Mail, Mitglied seit)
- Abmelden

---

## Auth-Flow

```
Admin oeffnet /login
    |
    +-- Magic Link: signInWithOtp() → E-Mail → Link klicken
    |                                              |
    +-- Google OAuth: signInWithOAuth()            |
                         |                         |
                         +-------------------------+
                                                   |
                                        /callback
                                exchangeCodeForSession()
                                         |
                              Middleware prueft Rolle
                                         |
                              +----------+----------+
                              |                     |
                         role=admin            role!=admin
                              |                     |
                         Dashboard            Sign Out +
                              /              /login?error=
                                            unauthorized
```

**Middleware-Schutz:**
- Nur `admin`-Rolle hat Zugriff auf alle Dashboard-Seiten
- `client`-Rolle wird abgewiesen und ausgeloggt
- Dev-Bypass moeglich: `DEV_BYPASS_AUTH=true` in `.env.local`

---

## Supabase-Datenmodell (shared mit Website)

### profiles (1:1 mit auth.users)

| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| id | UUID, PK | Referenz auf auth.users.id (ON DELETE CASCADE) |
| email | TEXT, NOT NULL | E-Mail-Adresse |
| full_name | TEXT | Vollstaendiger Name |
| role | TEXT, DEFAULT 'client' | 'admin' oder 'client' |
| avatar_url | TEXT | Profilbild-URL |
| created_at | TIMESTAMPTZ | Erstellungsdatum |
| updated_at | TIMESTAMPTZ | Letzte Aenderung |

Trigger: `handle_new_user()` erstellt Profil automatisch bei Signup.

### leads

| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| id | UUID, PK | Auto-generiert |
| email | TEXT, NOT NULL | Lead E-Mail |
| name, company, phone | TEXT | Kontaktdaten |
| service_level | TEXT | Gewaehltes Service-Level |
| pain_point | TEXT | Hauptproblem |
| source | TEXT, DEFAULT 'website' | website / chatbot / configurator / manual |
| status | TEXT, DEFAULT 'new' | new / contacted / qualified / proposal / won / lost |
| notes | TEXT | Interne Notizen |
| answers | JSONB | Konfigurator-Antworten |
| created_at, updated_at | TIMESTAMPTZ | Zeitstempel |

### chat_conversations

| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| id | UUID, PK | Auto-generiert |
| session_id | TEXT, NOT NULL | Eindeutige Chat-Session |
| visitor_ip | TEXT | Besucher-IP |
| locale | TEXT, DEFAULT 'de' | Sprache |
| lead_id | UUID, FK → leads | Verknuepfter Lead |
| messages | JSONB | [{role, content, timestamp}] |
| tool_calls | JSONB | Claude Tool Calls |
| summary | TEXT | KI-generierte Zusammenfassung |
| sentiment | TEXT | positive / neutral / negative |
| created_at, updated_at | TIMESTAMPTZ | Zeitstempel |

### projects (shared mit Website-Kundenbereich)

| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| id | UUID, PK | Auto-generiert |
| client_id | UUID, FK → profiles | Zugeordneter Kunde |
| name | TEXT, NOT NULL | Projektname |
| description | TEXT | Beschreibung |
| service_level | TEXT | foundation / growth / partner |
| status | TEXT, DEFAULT 'active' | draft / active / paused / completed / cancelled |
| monthly_revenue | NUMERIC(10,2) | Monatlicher Umsatz (EUR) |
| start_date, next_billing | DATE | Projekt- und Abrechnungsdaten |
| created_at, updated_at | TIMESTAMPTZ | Zeitstempel |

### RLS-Regeln

- `profiles`: Jeder liest/updated eigenes Profil
- `leads`: Nur Admins (SELECT, INSERT, UPDATE, DELETE)
- `chat_conversations`: Nur Admins
- `projects`: Admins verwalten alle, Clients lesen eigene

### Triggers

- `handle_new_user()` → Erstellt automatisch profiles-Eintrag bei Signup
- `update_updated_at()` → Aktualisiert updated_at bei jeder Aenderung

---

## API-Endpunkte

### POST `/api/webhooks/lead`

Lead-Ingestion von externen Quellen (Website-Konfigurator, Kontaktformular, etc.)

**Authentifizierung:** HMAC-SHA256 Signatur via `x-webhook-secret` Header

**Request:**
```bash
curl -X POST https://dashboard.manuel-heider.com/api/webhooks/lead \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: YOUR_WEBHOOK_SECRET" \
  -d '{"email":"test@example.com","name":"Test Lead","source":"configurator"}'
```

**Body-Schema:**

| Feld | Typ | Pflicht | Beschreibung |
|------|-----|---------|-------------|
| email | string | Ja | Lead E-Mail-Adresse |
| name | string | Nein | Name |
| company | string | Nein | Unternehmen |
| phone | string | Nein | Telefonnummer |
| service_level | string | Nein | Gewaehltes Level |
| pain_point | string | Nein | Hauptproblem |
| source | string | Nein | Quelle (default: webhook) |
| notes | string | Nein | Notizen |
| answers | object | Nein | Konfigurator-Daten |

**Response:** `201 { success: true, id: "uuid" }` oder Fehler (400/401/500)

---

## Environment Variables

| Variable | Pflicht | Beschreibung |
|----------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Ja | Supabase Projekt-URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ja | Supabase Anon Key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Ja | Service Role Key (Server-only, fuer Webhooks) |
| `WEBHOOK_SECRET` | Ja | Shared Secret fuer Lead-Webhook |
| `NEXT_PUBLIC_SITE_URL` | Ja | Dashboard-URL (z.B. https://dashboard.manuel-heider.com) |
| `DEV_BYPASS_AUTH` | Nein | `true` um Auth in der Entwicklung zu umgehen |

---

## Setup

### 1. Repository klonen

```bash
git clone https://github.com/iManuGitx/manuel-heider-dashboard.git
cd manuel-heider-dashboard
pnpm install
```

### 2. Umgebungsvariablen

```bash
cp .env.example .env.local
# .env.local ausfuellen (siehe Tabelle oben)
```

### 3. Supabase-Schema

SQL aus `supabase/schema.sql` im [Supabase SQL Editor](https://supabase.com/dashboard) ausfuehren.

### 4. Admin-Benutzer einrichten

Nach der ersten Anmeldung im Supabase SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'deine@email.de';
```

### 5. Development starten

```bash
pnpm dev
```

Oeffne [http://localhost:3000](http://localhost:3000).

---

## Deployment (Vercel)

1. Repository mit Vercel verbinden
2. Environment Variables in Vercel eintragen
3. Domain `dashboard.manuel-heider.com` konfigurieren
4. Auto-Deploy bei Push auf `main`

---

## Geplante Features

| Feature | Prioritaet | Beschreibung |
|---------|-----------|-------------|
| Projekt-CRUD UI | Hoch | Erstellen/Bearbeiten von Projekten im Dashboard |
| Analytics (Phase 2) | Mittel | Website-Metriken, Visitor-Stats, Conversion-Tracking |
| Stripe-Integration | Mittel | Billing-Uebersicht, Invoices-Sync |
| E-Mail-Benachrichtigungen | Mittel | Alerts bei neuen Leads |
| Export/Reports | Niedrig | CSV/PDF Export, automatische Reports |
| Audit Log | Niedrig | Wer hat was wann geaendert |

---

## Kontakt & Business

| | |
|---|---|
| **Website** | www.manuel-heider.com |
| **Dashboard** | dashboard.manuel-heider.com |
| **E-Mail** | info@manuel-heider.com |
| **WhatsApp** | +49 151 29121482 |
| **Standort** | Wertheim, Baden-Wuerttemberg |
| **Termin** | cal.eu/manuel-heider.com/30min |
