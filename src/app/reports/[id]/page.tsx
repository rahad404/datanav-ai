"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FileText,
  CalendarDays,
  HardDrive,
  ArrowLeft,
  TrendingUp,
  Lightbulb,
  ShieldAlert,
  ListChecks,
  ExternalLink,
  RotateCcw,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { TrendIndicator } from "@/components/shared/TrendIndicator";
import { KpiCard } from "@/components/shared/KpiCard";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { reportsApi, analysisApi } from "@/lib/api";
import type { Report, Analysis } from "@/lib/types";

export default function ReportDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: report,
    isLoading: reportLoading,
    isError: reportError,
  } = useQuery({
    queryKey: ["report", id],
    queryFn: () => reportsApi.get(id),
    enabled: !!id,
    refetchInterval: (query) =>
      query.state.data?.status && !["done", "failed"].includes(query.state.data.status) ? 3000 : false,
  });

  const {
    data: analysis,
    isLoading: analysisLoading,
  } = useQuery({
    queryKey: ["analysis", id],
    queryFn: () => analysisApi.get(id),
    enabled: !!id,
    retry: false,
    refetchInterval: (query) =>
      query.state.data?.jobStatus === "processing" || query.state.data?.jobStatus === "queued" ? 3000 : false,
  });

  const { data: related } = useQuery({
    queryKey: ["related-reports", id],
    queryFn: () => reportsApi.getRelated(id),
    enabled: !!id,
  });

  const reRunMutation = useMutation({
    mutationFn: () => analysisApi.regenerate(id),
    onSuccess: () => {
      toast.success("Analysis re-running");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to re-run"),
  });

  if (reportLoading) {
    return <ReportDetailSkeleton />;
  }

  if (reportError || !report) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          title="Report not found"
          description="This report doesn't exist or has been removed."
          action={{ label: "Browse reports", href: "/explore" }}
        />
      </div>
    );
  }

  const date = new Date(report.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const fileSize =
    report.file.size > 1024 * 1024
      ? `${(report.file.size / 1024 / 1024).toFixed(1)} MB`
      : `${(report.file.size / 1024).toFixed(0)} KB`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/explore"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to explore
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Report header */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <CategoryBadge category={report.category} />
              <StatusBadge status={report.status} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{report.title}</h1>
            <p className="mt-2 text-muted-foreground">{report.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                {date}
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="size-4" />
                {report.file.originalName}
              </div>
              <div className="flex items-center gap-1.5">
                <HardDrive className="size-4" />
                {fileSize}
              </div>
            </div>
          </div>

          {/* Analysis section */}
          {report.status === "done" && (
            <AnalysisSection analysis={analysis} isLoading={analysisLoading} reportId={id} />
          )}

          {report.status === "processing" && (
            <div className="rounded-xl border bg-card p-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-info-bg mx-auto">
                <Loader2 className="size-6 text-info-text animate-spin" />
              </div>
              <h3 className="mt-4 font-semibold">Analysis in progress</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                AI is analyzing your data. This page updates automatically.
              </p>
            </div>
          )}

          {report.status === "failed" && (
            <div className="rounded-xl border bg-card p-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-danger-bg mx-auto">
                <ShieldAlert className="size-6 text-danger-text" />
              </div>
              <h3 className="mt-4 font-semibold">Analysis failed</h3>
              <p className="mt-1 text-sm text-muted-foreground mb-4">
                Something went wrong during analysis. Try again or upload a new file.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => reRunMutation.mutate()}
                disabled={reRunMutation.isPending}
              >
                <RotateCcw className={`mr-1.5 size-3.5 ${reRunMutation.isPending ? "animate-spin" : ""}`} />
                {reRunMutation.isPending ? "Re-running..." : "Re-run Analysis"}
              </Button>
            </div>
          )}

          {report.status === "uploaded" && (
            <div className="rounded-xl border bg-card p-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted mx-auto">
                <Loader2 className="size-6 text-muted-foreground animate-spin" />
              </div>
              <h3 className="mt-4 font-semibold">Analysis starting</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your report is being queued for analysis. Please wait...
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Related reports */}
          {related && related.length > 0 && (
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-4">Related Reports</h3>
              <div className="space-y-3">
                {related.slice(0, 4).map((r) => (
                  <Link
                    key={r._id}
                    href={`/reports/${r._id}`}
                    className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success-text">
                      <FileText className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate group-hover:text-success-text transition-colors">
                        {r.title}
                      </p>
                      <CategoryBadge category={r.category} className="mt-1" />
                    </div>
                    <ExternalLink className="size-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* File info */}
          <div className="rounded-xl border bg-card p-5">
            <h3 className="font-semibold mb-3">File Information</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium truncate ml-4">{report.file.originalName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Size</dt>
                <dd className="font-medium">{fileSize}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Type</dt>
                <dd className="font-medium">{report.file.mimeType}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Analysis Section ───────────────────────────────────────────────

function AnalysisSection({
  analysis,
  isLoading,
  reportId,
}: {
  analysis: Analysis | undefined;
  isLoading: boolean;
  reportId: string;
}) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!analysis || analysis.jobStatus !== "done") {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="text-muted-foreground">Analysis not available.</p>
        <Link href={`/reports/${reportId}/analysis`}>
          <Button variant="outline" className="mt-4">
            View analysis workspace
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="size-5 text-success" />
          <h2 className="text-lg font-semibold">Summary</h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{analysis.summary}</p>
      </div>

      {/* KPIs */}
      {analysis.kpis.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="size-5 text-success" />
            <h2 className="text-lg font-semibold">Key Metrics</h2>
          </div>
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
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="size-5 text-success" />
            <h2 className="text-lg font-semibold">Trends</h2>
          </div>
          <div className="space-y-3">
            {analysis.trends.map((trend, i) => (
              <div key={i} className="rounded-xl border bg-card p-4">
                <div className="flex items-center gap-3">
                  <TrendIndicator direction={trend.direction} />
                  <div>
                    <p className="font-medium">{trend.label}</p>
                    <p className="text-sm text-muted-foreground">{trend.detail}</p>
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
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="size-5 text-risk-high" />
            <h2 className="text-lg font-semibold">Risk Flags</h2>
          </div>
          <div className="space-y-3">
            {analysis.risks.map((risk, i) => (
              <div key={i} className="rounded-xl border bg-card p-4">
                <div className="flex items-start gap-3">
                  <RiskBadge severity={risk.severity} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{risk.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{risk.detail}</p>
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
          <div className="flex items-center gap-2 mb-4">
            <ListChecks className="size-5 text-success" />
            <h2 className="text-lg font-semibold">Recommendations</h2>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <ul className="space-y-3">
              {analysis.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-xs font-bold text-success-text">
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

// ─── Skeleton ──────────────────────────────────────────────────────

function ReportDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-4 w-32" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
