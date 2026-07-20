import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  uploaded: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  queued: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
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
