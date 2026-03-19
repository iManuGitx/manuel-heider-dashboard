export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "client";
  avatar_url: string | null;
  stripe_customer_id: string | null;
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
  message_count: number;
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
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  stripe_setup_price_id: string | null;
  created_at: string;
  updated_at: string;
}

// Documents
export type DocumentCategory = "general" | "contract" | "report" | "deliverable";

export interface Document {
  id: string;
  project_id: string;
  uploaded_by: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  category: DocumentCategory;
  created_at: string;
  project?: Pick<Project, "name">;
}

// Tickets
export type TicketStatus = "open" | "in-progress" | "resolved";
export type TicketPriority = "low" | "normal" | "high";

export interface Ticket {
  id: string;
  client_id: string;
  project_id: string | null;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
  client?: Pick<Profile, "full_name" | "email">;
  project?: Pick<Project, "name"> | null;
  ticket_messages?: { count: number }[];
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender?: Pick<Profile, "full_name" | "role" | "avatar_url">;
}
