import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendIndicatorProps {
  direction: "up" | "down" | "flat" | "stable";
  label?: string;
  className?: string;
}

const trendConfig: Record<string, { icon: typeof TrendingUp; color: string }> = {
  up: { icon: TrendingUp, color: "text-emerald-500" },
  down: { icon: TrendingDown, color: "text-red-500" },
  stable: { icon: Minus, color: "text-muted-foreground" },
  flat: { icon: Minus, color: "text-muted-foreground" },
};

export function TrendIndicator({ direction, label, className }: TrendIndicatorProps) {
  const config = trendConfig[direction] || trendConfig.flat;
  const { icon: Icon, color } = config;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Icon className={cn("size-4 shrink-0", color)} />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}
