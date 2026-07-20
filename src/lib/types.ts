// ---------------------------------------------------------------------------
// Backend API response types
// ---------------------------------------------------------------------------

export interface User {
   _id: string;
   name: string;
   email: string;
   image?: string;
   role: "user" | "admin";
   createdAt: string;
   updatedAt: string;
}

export interface Report {
   _id: string;
   title: string;
   description: string;
   category: "sales" | "finance" | "marketing" | "operations" | "other";
   status: "uploaded" | "processing" | "done" | "failed";
   isPublic: boolean;
   userId: string;
   file: {
      originalName: string;
      path: string;
      size: number;
      mimeType: string;
   };
   createdAt: string;
   updatedAt: string;
}

export interface ReportListResponse {
   items: Report[];
   total: number;
   page: number;
   pages: number;
}

export interface Trend {
   label: string;
   direction: "up" | "down" | "stable";
   detail: string;
}

export interface Kpi {
   name: string;
   value: string;
   change?: string;
}

export interface Risk {
   title: string;
   severity: "low" | "medium" | "high" | "critical";
   detail: string;
}

export interface Analysis {
   _id: string;
   reportId: string;
   depth: "quick" | "deep";
   summary: string;
   trends: Trend[];
   kpis: Kpi[];
   risks: Risk[];
   recommendations: string[];
   jobStatus: "queued" | "processing" | "done" | "failed";
   createdAt: string;
   updatedAt: string;
}

export interface AnalysisStatusResponse {
   status: "queued" | "processing" | "done" | "failed";
}

export interface ChatMessage {
   _id: string;
   userId: string;
   role: "user" | "assistant";
   content: string;
   reportId?: string;
   route?: string;
   suggestions?: string[];
   createdAt: string;
}

export interface ChatResponse {
   reply: string;
   suggestions: string[];
}

export interface ChatSuggestionsResponse {
   suggestions: string[];
}

export interface AuthJwtResponse {
   accessToken: string;
   expiresIn: number;
}

export interface ApiErrorResponse {
   message: string;
   status: number;
}
