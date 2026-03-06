import api from "@/lib/api/client";
import type {
  CMSPage,
  CancellationPolicy,
  CreateCMSPageRequest,
  CreateCancellationRequest,
  ConsentRequest,
  ConsentRecord,
} from "@/types";

export const cmsService = {
  // --- Terms of Service ---
  getCurrentTerms: () =>
    api.get<CMSPage>("/api/cms/terms/current/"),

  listTerms: () =>
    api.get<CMSPage[]>("/api/cms/terms/"),

  getTermsBySlug: (slug: string) =>
    api.get<CMSPage>(`/api/cms/terms/${slug}/`),

  createTerms: (data: CreateCMSPageRequest) =>
    api.post<CMSPage>("/api/cms/terms/create/", data),

  updateTerms: (slug: string, data: Partial<CreateCMSPageRequest>) =>
    api.patch<CMSPage>(`/api/cms/terms/${slug}/`, data),

  // --- Privacy Policy ---
  getCurrentPrivacy: () =>
    api.get<CMSPage>("/api/cms/privacy/current/"),

  listPrivacy: () =>
    api.get<CMSPage[]>("/api/cms/privacy/"),

  getPrivacyBySlug: (slug: string) =>
    api.get<CMSPage>(`/api/cms/privacy/${slug}/`),

  createPrivacy: (data: CreateCMSPageRequest) =>
    api.post<CMSPage>("/api/cms/privacy/create/", data),

  updatePrivacy: (slug: string, data: Partial<CreateCMSPageRequest>) =>
    api.patch<CMSPage>(`/api/cms/privacy/${slug}/`, data),

  // --- Cancellation Policy ---
  getCurrentCancellation: () =>
    api.get<CancellationPolicy>("/api/cms/cancellation/current/"),

  listCancellation: () =>
    api.get<CancellationPolicy[]>("/api/cms/cancellation/"),

  getCancellationBySlug: (slug: string) =>
    api.get<CancellationPolicy>(`/api/cms/cancellation/${slug}/`),

  createCancellation: (data: CreateCancellationRequest) =>
    api.post<CancellationPolicy>("/api/cms/cancellation/create/", data),

  updateCancellation: (
    slug: string,
    data: Partial<CreateCancellationRequest>
  ) => api.patch<CancellationPolicy>(`/api/cms/cancellation/${slug}/`, data),

  // --- Consent ---
  submitConsent: (data: ConsentRequest) =>
    api.post<ConsentRecord>("/api/cms/consent/", data),

  getConsentHistory: () =>
    api.get<ConsentRecord[]>("/api/cms/consent/history/"),
};
