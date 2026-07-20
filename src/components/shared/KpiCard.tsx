import { cn } from "@/lib/utils";
import type { Kpi } from "@/lib/types";

interface KpiCardProps {
  kpi: Kpi;
  className?: string;
}

export function KpiCard({ kpi, className }: KpiCardProps) {
  const isPositive = kpi.change?.startsWith("+");
  const isNegative = kpi.change?.startsWith("-");

  return (
    <div className={cn("rounded-xl border bg-card p-4", className)}>
      <p className="text-sm text-muted-foreground">{kpi.name}</p>
      <p className="mt-1 text-2xl font-bold font-mono tracking-tight">{kpi.value}</p>
      {kpi.change && (
        <p
          className={cn(
            "mt-1 text-sm font-medium",
            isPositive && "text-success",
            isNegative && "text-danger",
            !isPositive && !isNegative && "text-muted-foreground"
          )}
        >
          {kpi.change}
        </p>
      )}
    </div>
  );
}
