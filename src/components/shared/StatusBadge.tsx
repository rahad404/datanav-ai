import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  uploaded: "bg-category-other-bg text-category-other-text",
  processing: "bg-info-bg text-info-text",
  done: "bg-success-bg text-success-text",
  failed: "bg-danger-bg text-danger-text",
  queued: "bg-warning-bg text-warning-text",
};

const statusLabels: Record<string, string> = {
  uploaded: "Uploaded",
  processing: "Processing",
  done: "Completed",
  failed: "Failed",
  queued: "Queued",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("border-0 font-medium", statusStyles[status] || statusStyles.uploaded, className)}
    >
      {status === "processing" && (
        <span className="mr-1.5 size-1.5 animate-pulse rounded-full bg-current" />
      )}
      {statusLabels[status] || status}
    </Badge>
  );
}
