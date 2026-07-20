"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { reportsApi, type ListReportsParams } from "@/lib/api";
import { ReportCard } from "./ReportCard";
import { ReportGridSkeleton } from "@/components/shared/ReportSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";

const categories = ["sales", "finance", "marketing", "operations", "other"] as const;

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);

  const debounceTimer = useCallback(
    (() => {
      let timer: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timer);
        timer = setTimeout(() => setDebouncedSearch(value), 300);
      };
    })(),
    []
  );

  const params: ListReportsParams = {
    search: debouncedSearch || undefined,
    category: category || undefined,
    sort,
    page,
    limit: 12,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["reports", "public", params],
    queryFn: () => reportsApi.listPublic(params),
  });

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setCategory("");
    setSort("-createdAt");
    setPage(1);
  }

  const hasFilters = search || category;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Explore Reports</h1>
        <p className="mt-1 text-muted-foreground">
          Browse public AI-analyzed reports from the community
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reports by title or description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debounceTimer(e.target.value);
              setPage(1);
            }}
            className="pl-10 h-11"
          />
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={category}
            onValueChange={(v) => { setCategory(v); setPage(1); }}
          >
            <SelectTrigger className="w-36 h-11">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="capitalize">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(v) => { setSort(v); setPage(1); }}
          >
            <SelectTrigger className="w-40 h-11">
              <ArrowUpDown className="mr-2 size-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-createdAt">Newest first</SelectItem>
              <SelectItem value="createdAt">Oldest first</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="-title">Title Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filters */}
      {hasFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {debouncedSearch && (
            <Badge variant="secondary" className="gap-1">
              Search: &ldquo;{debouncedSearch}&rdquo;
            </Badge>
          )}
          {category && (
            <Badge variant="secondary" className="capitalize gap-1">
              {category}
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
            Clear all
          </Button>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <ReportGridSkeleton count={6} />
      ) : isError ? (
        <EmptyState
          title="Failed to load reports"
          description="Something went wrong. Please try again."
        />
      ) : data && data.items.length === 0 ? (
        <EmptyState
          title="No reports found"
          description={hasFilters ? "Try adjusting your filters." : "No public reports yet."}
          action={hasFilters ? undefined : { label: "Upload your first report", href: "/signup" }}
        />
      ) : data ? (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {data.total} report{data.total !== 1 ? "s" : ""} found
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {data.page} of {data.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.pages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
