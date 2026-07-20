"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  RotateCcw,
  Download,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  ListChecks,
  Lightbulb,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TrendIndicator } from "@/components/shared/TrendIndicator";
import { KpiCard } from "@/components/shared/KpiCard";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { reportsApi, analysisApi } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { Analysis } from "@/lib/types";

export default function AnalysisWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: session } = useSession();
  const [depth, setDepth] = useState<"quick" | "deep">("quick");

  const { data: report, isLoading: reportLoading } = useQuery({
    queryKey: ["report", id],
    queryFn: () => reportsApi.get(id),
    enabled: !!id,
  });

  const {
    data: analysis,
    isLoading: analysisLoading,
    refetch: refetchAnalysis,
  } = useQuery({
    queryKey: ["analysis", id],
    queryFn: () => analysisApi.get(id),
    enabled: !!id,
    retry: false,
  });

  const [pollStatus, setPollStatus] = useState(false);

  useEffect(() => {
    if (
      analysis &&
      (analysis.jobStatus === "queued" || analysis.jobStatus === "processing")
    ) {
      setPollStatus(true);
      const interval = setInterval(async () => {
        try {
          const status = await analysisApi.getStatus(id);
          if (status.status === "done" || status.status === "failed") {
            clearInterval(interval);
            setPollStatus(false);
            refetchAnalysis();
          }
        } catch {
          clearInterval(interval);
          setPollStatus(false);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [analysis?.jobStatus, id, refetchAnalysis]);

  const regenerateMutation = useMutation({
    mutationFn: () => analysisApi.regenerate(id),
    onSuccess: () => {
      toast.success("Regenerating analysis...");
      setTimeout(() => {
        refetchAnalysis();
      }, 2000);
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Failed to regenerate"),
  });

  const triggerMutation = useMutation({
    mutationFn: () => analysisApi.trigger(id, depth),
    onSuccess: () => {
      toast.success("Analysis started");
      setTimeout(() => refetchAnalysis(), 2000);
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Failed to start analysis"),
  });

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Sign in to view analysis</h1>
        <p className="mt-2 text-muted-foreground">
          You need to be logged in to access the analysis workspace.
        </p>
        <Link href={`/login?callbackUrl=/reports/${id}/analysis`}>
          <Button className="mt-6">Sign in</Button>
        </Link>
      </div>
    );
  }

  if (reportLoading) {
    return <WorkspaceSkeleton />;
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          title="Report not found"
          description="This report doesn't exist or has been removed."
          action={{ label: "My Reports", href: "/items/manage" }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Back + actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={`/reports/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to report
        </Link>

        <div className="flex items-center gap-3">
          {/* Depth toggle */}
          <div className="flex items-center rounded-lg border p-0.5">
            <button
              onClick={() => setDepth("quick")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                depth === "quick"
                  ? "bg-emerald-600 text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Zap className="mr-1 inline size-3" />
              Quick
            </button>
            <button
              onClick={() => setDepth("deep")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                depth === "deep"
                  ? "bg-emerald-600 text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Deep
            </button>
          </div>

          {report.status === "done" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => regenerateMutation.mutate()}
              disabled={regenerateMutation.isPending}
            >
              <RotateCcw
                className={`mr-1.5 size-3.5 ${
                  regenerateMutation.isPending ? "animate-spin" : ""
                }`}
              />
              Regenerate
            </Button>
          )}

          {report.status === "done" && (
            <Button variant="outline" size="sm" disabled title="Coming soon">
              <Download className="mr-1.5 size-3.5" />
              PDF
            </Button>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            <Sparkles className="mr-1 size-3" />
            AI Analysis
          </Badge>
          {pollStatus && (
            <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <span className="mr-1 size-1.5 animate-pulse rounded-full bg-current" />
              Processing
            </Badge>
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{report.title}</h1>
      </div>

      {/* Analysis content */}
      {analysisLoading ? (
        <AnalysisContentSkeleton />
      ) : !analysis || analysis.jobStatus === "failed" ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <ShieldAlert className="mx-auto size-10 text-destructive" />
          <h3 className="mt-4 text-lg font-semibold">Analysis failed or unavailable</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Something went wrong. Try regenerating the analysis.
          </p>
          <Button
            className="mt-6"
            onClick={() => triggerMutation.mutate()}
            disabled={triggerMutation.isPending}
          >
            {triggerMutation.isPending ? "Starting..." : "Start Analysis"}
          </Button>
        </div>
      ) : analysis.jobStatus === "queued" || analysis.jobStatus === "processing" ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <TrendingUp className="size-6 animate-pulse text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Analysis in progress</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            AI is analyzing your data. This page updates automatically.
          </p>
        </div>
      ) : (
        <AnalysisContent analysis={analysis} />
      )}
    </div>
  );
}

// ─── Analysis Content ───────────────────────────────────────────────

function AnalysisContent({ analysis }: { analysis: Analysis }) {
  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="size-5 text-emerald-500" />
          <h2 className="text-lg font-semibold">Summary</h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{analysis.summary}</p>
      </div>

      {/* KPIs */}
      {analysis.kpis.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Key Metrics</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {analysis.kpis.map((kpi, i) => (
              <KpiCard key={i} kpi={kpi} />
            ))}
          </div>
        </div>
      )}

      {/* Trends */}
      {analysis.trends.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Trends</h2>
          <div className="space-y-3">
            {analysis.trends.map((trend, i) => (
              <div key={i} className="rounded-xl border bg-card p-4">
                <div className="flex items-center gap-3">
                  <TrendIndicator direction={trend.direction} />
                  <div>
                    <p className="font-medium">{trend.label}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{trend.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risks */}
      {analysis.risks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            <ShieldAlert className="mr-2 inline size-5 text-orange-500" />
            Risk Flags
          </h2>
          <div className="space-y-3">
            {analysis.risks.map((risk, i) => (
              <div key={i} className="rounded-xl border bg-card p-4">
                <div className="flex items-start gap-3">
                  <RiskBadge severity={risk.severity} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{risk.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{risk.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            <ListChecks className="mr-2 inline size-5 text-emerald-500" />
            Recommendations
          </h2>
          <div className="rounded-xl border bg-card p-6">
            <ul className="space-y-3">
              {analysis.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-600/10 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Skeletons ──────────────────────────────────────────────────────

function WorkspaceSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Skeleton className="mb-6 h-4 w-32" />
      <Skeleton className="mb-8 h-8 w-64" />
      <AnalysisContentSkeleton />
    </div>
  );
}

function AnalysisContentSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}
