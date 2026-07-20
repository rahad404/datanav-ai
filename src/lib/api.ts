import { authClient } from "./auth-client";
import type {
  ReportListResponse,
  Report,
  Analysis,
  AnalysisStatusResponse,
  ChatMessage,
  ChatResponse,
  ChatSuggestionsResponse,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

let cachedToken: { value: string; expiresAt: number } | null = null;

export function clearServerToken(): void {
  cachedToken = null;
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 5000) {
    return cachedToken.value;
  }
  const session = await authClient.getSession();
  if (!session?.data?.session?.token) {
    throw new ApiError("Not authenticated", 401);
  }
  const res = await fetch(`${API_BASE_URL}/auth/jwt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionToken: session.data.session.token }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.message || "Failed to bridge session to JWT", res.status);
  }
  const { accessToken, expiresIn } = await res.json();
  cachedToken = { value: accessToken, expiresAt: Date.now() + expiresIn * 1000 };
  return accessToken;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };
type QueryParams = Record<string, string | number | boolean | undefined>;

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const message =
      typeof data === "object" && data && "message" in data
        ? (data as { message: string }).message
        : "Request failed";
    throw new ApiError(message, res.status);
  }
  return data as T;
}

function buildUrl(path: string, params?: QueryParams): string {
  if (!params) return path;
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) url.searchParams.set(k, String(v));
  });
  return `${path}${url.search}`;
}

export async function request<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  return handleResponse<T>(res);
}

export async function authRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = await getAccessToken();
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    body: isFormData
      ? (options.body as FormData)
      : options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
  });
  return handleResponse<T>(res);
}

// -----------------------------------------------------------------------
// Reports API
// -----------------------------------------------------------------------

export interface ListReportsParams {
  search?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const reportsApi = {
  listPublic: (params?: ListReportsParams) =>
    request<ReportListResponse>(buildUrl("/reports", params as QueryParams)),

  listMine: (params?: ListReportsParams) =>
    authRequest<ReportListResponse>(buildUrl("/reports/mine", params as QueryParams)),

  get: (id: string) =>
    request<Report>(`/reports/${id}`),

  getRelated: (id: string) =>
    request<Report[]>(`/reports/${id}/related`),

  create: (formData: FormData) =>
    authRequest<Report>("/reports", {
      method: "POST",
      body: formData,
    }),

  update: (id: string, data: Partial<Pick<Report, "title" | "description" | "category" | "isPublic">>) =>
    authRequest<Report>(`/reports/${id}`, {
      method: "PATCH",
      body: data,
    }),

  delete: (id: string) =>
    authRequest<void>(`/reports/${id}`, { method: "DELETE" }),
};

// -----------------------------------------------------------------------
// Analysis API
// -----------------------------------------------------------------------

export const analysisApi = {
  trigger: (reportId: string, depth: "quick" | "deep" = "quick") =>
    authRequest<{ message: string; status: string }>(`/reports/${reportId}/analyze`, {
      method: "POST",
      body: { depth },
    }),

  regenerate: (reportId: string) =>
    authRequest<{ message: string; status: string }>(`/reports/${reportId}/analyze/regenerate`, {
      method: "POST",
    }),

  get: (reportId: string) =>
    authRequest<Analysis>(`/reports/${reportId}/analysis`),

  getStatus: (reportId: string) =>
    authRequest<AnalysisStatusResponse>(`/reports/${reportId}/analysis/status`),
};

// -----------------------------------------------------------------------
// Chat API
// -----------------------------------------------------------------------

export interface SendMessageParams {
  message: string;
  reportId?: string;
  route?: string;
}

export const chatApi = {
  send: (data: SendMessageParams) =>
    authRequest<ChatResponse>("/chat/message", {
      method: "POST",
      body: data,
    }),

  history: () =>
    authRequest<ChatMessage[]>("/chat/history"),

  clearHistory: () =>
    authRequest<void>("/chat/history", { method: "DELETE" }),

  suggestions: (reportId?: string) =>
    authRequest<ChatSuggestionsResponse>(
      buildUrl("/chat/suggestions", { reportId } as QueryParams)
    ),
};

// -----------------------------------------------------------------------
// Health
// -----------------------------------------------------------------------

export const healthApi = {
  check: () => request<{ status: string }>("/health"),
};
