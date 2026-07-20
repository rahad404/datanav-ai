import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, Info, Skull } from "lucide-react";

const severityConfig = {
  low: { icon: Info, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  medium: { icon: AlertTriangle, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  high: { icon: AlertCircle, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" },
  critical: { icon: Skull, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
};

interface RiskBadgeProps {
  severity: string;
  className?: string;
}

export function RiskBadge({ severity, className }: RiskBadgeProps) {
  const config = severityConfig[severity as keyof typeof severityConfig] || severityConfig.medium;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn("border-0 font-medium gap-1", config.color, className)}>
      <Icon className="size-3.5" />
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </Badge>
  );
}
