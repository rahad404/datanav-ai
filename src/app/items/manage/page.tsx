"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  Eye,
  Trash2,
  RotateCcw,
  CalendarDays,
  ArrowUpDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { ReportSkeleton } from "@/components/shared/ReportSkeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { reportsApi, analysisApi } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

export default function MyReportsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["reports", "mine"],
    queryFn: () => reportsApi.listMine({ limit: 50 }),
    enabled: !!session,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reportsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports", "mine"] });
      toast.success("Report deleted");
      setDeleteId(null);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to delete"),
  });

  const reRunMutation = useMutation({
    mutationFn: (id: string) => analysisApi.regenerate(id),
    onSuccess: (_, id) => {
      toast.success("Analysis re-running");
      queryClient.invalidateQueries({ queryKey: ["reports", "mine"] });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["reports", id] });
        queryClient.invalidateQueries({ queryKey: ["analysis", id] });
      }, 2000);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to re-run"),
  });

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Sign in to view your reports</h1>
        <p className="mt-2 text-muted-foreground">You need to be logged in to manage your reports.</p>
        <Link href="/login?callbackUrl=/items/manage">
          <Button className="mt-6">Sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Reports</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your uploaded analyses
          </p>
        </div>
        <Link href="/items/add">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 size-4" />
            New Analysis
          </Button>
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <ReportSkeleton key={i} variant="row" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="Failed to load reports"
          description="Something went wrong. Please try again."
        />
      ) : data && data.items.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="Upload your first dataset to get AI-powered analysis."
          action={{ label: "New Analysis", href: "/items/add" }}
        />
      ) : data ? (
        <div className="overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                    Report
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground hidden sm:table-cell">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground hidden md:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.items.map((report) => (
                  <tr key={report._id} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400">
                          <FileText className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/reports/${report._id}`}
                            className="font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate block"
                          >
                            {report.title}
                          </Link>
                          <p className="text-xs text-muted-foreground truncate">
                            {report.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <CategoryBadge category={report.category} />
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <CalendarDays className="size-3.5" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/reports/${report._id}`}>
                          <Button variant="ghost" size="icon" className="size-8">
                            <Eye className="size-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => reRunMutation.mutate(report._id)}
                          disabled={reRunMutation.isPending}
                          title="Re-run analysis"
                        >
                          <RotateCcw className="size-4" />
                        </Button>
                        <Dialog
                          open={deleteId === report._id}
                          onOpenChange={(open) => !open && setDeleteId(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-destructive hover:text-destructive"
                              onClick={() => setDeleteId(report._id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Report</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete &ldquo;{report.title}&rdquo;? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setDeleteId(null)}>
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => deleteMutation.mutate(report._id)}
                                disabled={deleteMutation.isPending}
                              >
                                {deleteMutation.isPending ? "Deleting..." : "Delete"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
