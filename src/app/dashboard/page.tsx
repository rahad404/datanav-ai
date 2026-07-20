"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  BarChart3,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { reportsApi } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ["reports", "mine"],
    queryFn: () => reportsApi.listMine({ limit: 10 }),
    enabled: !!session,
  });

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Sign in to view your dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to see your reports, stats, and recent activity.
        </p>
        <Link href="/login?callbackUrl=/dashboard">
          <Button className="mt-6 bg-success hover:bg-success/90">Sign in</Button>
        </Link>
      </div>
    );
  }

  const totalReports = data?.total || 0;
  const doneReports = data?.items.filter((r) => r.status === "done").length || 0;
  const processingReports = data?.items.filter((r) => r.status === "processing").length || 0;

  const latestAnalysis = data?.items.find((r) => r.status === "done");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {session.user.name}
          </p>
        </div>
        <Link href="/items/add">
          <Button className="bg-success hover:bg-success/90">
            <Plus className="mr-2 size-4" />
            New Analysis
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<FileText className="size-5" />}
          label="Total Reports"
          value={isLoading ? "..." : String(totalReports)}
          color="bg-success/10 text-success-text"
        />
        <StatCard
          icon={<Sparkles className="size-5" />}
          label="Analyzed"
          value={isLoading ? "..." : String(doneReports)}
          color="bg-info-bg text-info-text"
        />
        <StatCard
          icon={<BarChart3 className="size-5" />}
          label="Processing"
          value={isLoading ? "..." : String(processingReports)}
          color="bg-warning-bg text-warning-text"
        />
        <StatCard
          icon={<Clock className="size-5" />}
          label="This Month"
          value={isLoading ? "..." : String(totalReports)}
          color="bg-category-sales-bg text-category-sales-text"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Reports */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Reports</h2>
            <Link
              href="/items/manage"
              className="text-sm text-success-text hover:underline"
            >
              View all
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : data && data.items.length > 0 ? (
            <div className="space-y-2">
              {data.items.slice(0, 5).map((report) => (
                <Link
                  key={report._id}
                  href={`/reports/${report._id}`}
                  className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success-text">
                    <FileText className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{report.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {report.description}
                    </p>
                  </div>
                  <CategoryBadge category={report.category} />
                  <StatusBadge status={report.status} />
                  <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No reports yet"
              description="Upload your first dataset to get started."
              action={{ label: "New Analysis", href: "/items/add" }}
            />
          )}
        </div>

        {/* Latest Analysis Snapshot */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Latest Analysis</h2>
          {latestAnalysis ? (
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="size-4 text-success" />
                <span className="text-sm font-medium">{latestAnalysis.title}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-3 mb-4">
                {latestAnalysis.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <CategoryBadge category={latestAnalysis.category} />
                <StatusBadge status={latestAnalysis.status} />
              </div>
              <Link href={`/reports/${latestAnalysis._id}/analysis`}>
                <Button variant="outline" size="sm" className="w-full">
                  View full analysis
                  <ArrowRight className="ml-2 size-3.5" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border bg-card p-8 text-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted mx-auto">
                <BarChart3 className="size-5 text-muted-foreground" />
              </div>
              <p className="mt-3 text-sm font-medium">No analysis yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Upload a file and run your first analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className={`flex size-10 items-center justify-center rounded-lg ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold font-mono tracking-tight">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
