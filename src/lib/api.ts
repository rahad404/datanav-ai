import { authClient } from "./auth-client";

/**
 * Thin API client for talking to the external Express backend.
 *
 * - request()      -> unauthenticated calls (public reports, explore page, etc.)
 * - authRequest()   -> attaches a bridged JWT (see getAccessToken) for
 *                      protected CRUD calls (add/manage reports, analysis, chat)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

let cachedToken: { value: string; expiresAt: number } | null = null;

/** Clears the cached bridged JWT — call this on logout so the next
 * authRequest() is forced to re-bridge (or fail) instead of reusing
 * a token tied to the session that just ended. */
export function clearServerToken(): void {
   cachedToken = null;
}

/**
 * Exchanges the current Better Auth session for a short-lived JWT
 * from the external backend's POST /api/auth/jwt bridge endpoint.
 * Caches the token in memory until shortly before it expires.
 */
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
      throw new ApiError("Failed to bridge session to JWT", res.status);
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

/** Unauthenticated request to the backend */
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

/** Authenticated request — attaches Bearer JWT bridged from the Better Auth session */
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