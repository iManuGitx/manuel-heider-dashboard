export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "client";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost";

export type LeadSource =
  | "website"
  | "chatbot"
  | "configurator"
  | "manual";

export interface Lead {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  phone: string | null;
  service_level: string | null;
  pain_point: string | null;
  source: string;
  status: LeadStatus;
  notes: string | null;
  answers: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export type Sentiment = "positive" | "neutral" | "negative";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ChatConversation {
  id: string;
  session_id: string;
  visitor_ip: string | null;
  locale: string;
  lead_id: string | null;
  lead_email: string | null;
  messages: ChatMessage[];
  tool_calls: Record<string, unknown>[];
  summary: string | null;
  sentiment: Sentiment | null;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export interface Project {
  id: string;
  client_id: string | null;
  name: string;
  description: string | null;
  service_level: string | null;
  status: ProjectStatus;
  monthly_revenue: number | null;
  start_date: string | null;
  next_billing: string | null;
  created_at: string;
  updated_at: string;
}
