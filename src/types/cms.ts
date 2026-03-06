import type { User } from "./user";

export type PublicationStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface CMSPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  status: PublicationStatus;
  version: number;
  is_current: boolean;
  created_by: User;
  updated_by: User;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  attachment_url: string | null;
  requires_consent: boolean;
}

export interface CancellationPolicy extends CMSPage {
  refund_period_days: number;
  cancellation_fee_percentage: string;
}

export interface CreateCMSPageRequest {
  title: string;
  content: string;
  status?: PublicationStatus;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  requires_consent?: boolean;
}

export interface CreateCancellationRequest extends CreateCMSPageRequest {
  refund_period_days?: number;
  cancellation_fee_percentage?: string;
}

export interface ConsentRequest {
  terms: number;
  privacy_policy: number;
}

export interface ConsentRecord {
  id: number;
  user: User;
  terms: CMSPage;
  privacy_policy: CMSPage;
  consented_at: string;
}

export interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string | null;
  banner_url: string | null;
  original_image_url: string | null;
  imagekit_original_url: string | null;
  imagekit_thumbnail_url: string | null;
  imagekit_banner_url: string | null;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  registration_link: string;
  status: PublicationStatus;
  is_featured: boolean;
  days_until: number;
  created_at: string;
  updated_at: string;
}

export interface EventStats {
  total_events: number;
  published_events: number;
  draft_events: number;
  archived_events: number;
  featured_events: number;
  upcoming_events: number;
}

export interface JobOpening {
  id: number;
  title: string;
  slug: string;
  description: string;
  responsibilities: string;
  requirements: string;
  job_type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "REMOTE";
  location: string;
  salary_range: string;
  application_deadline: string;
  application_link: string;
  is_active: boolean;
  is_open: boolean;
  days_until_deadline: number;
  created_at: string;
}

export type ContactSubject =
  | "GENERAL"
  | "SERVICE"
  | "BOOKING"
  | "PAYMENT"
  | "TECHNICAL"
  | "JOB"
  | "OTHER";

export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: ContactSubject;
  message: string;
}

export interface ContactInquiry extends ContactRequest {
  id: number;
  status: "PENDING" | "REPLIED" | "CLOSED";
  user_agent: string;
  created_at: string;
  updated_at: string;
  replied_at: string | null;
}

export interface Promo {
  id: number;
  code: string;
  description: string;
  discount_type: string;
  discount_value: string;
  is_active: boolean;
  valid_from: string;
  valid_until: string;
}
