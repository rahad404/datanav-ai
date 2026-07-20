import Link from "next/link";
import { FileText, CalendarDays, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import type { Report } from "@/lib/types";

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  const date = new Date(report.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link href={`/reports/${report._id}`}>
      <div className="group rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:shadow-success/5 hover:border-success/20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success-text">
            <FileText className="size-5" />
          </div>
          <StatusBadge status={report.status} />
        </div>

        <h3 className="mt-4 font-semibold leading-snug group-hover:text-success-text transition-colors">
          {report.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
          {report.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <CategoryBadge category={report.category} />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {date}
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            View report
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
