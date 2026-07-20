import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, Info, Skull } from "lucide-react";

const severityConfig = {
  low: { icon: Info, color: "bg-info-bg text-info-text" },
  medium: { icon: AlertTriangle, color: "bg-warning-bg text-warning-text" },
  high: { icon: AlertCircle, color: "bg-risk-high-bg text-risk-high-text" },
  critical: { icon: Skull, color: "bg-danger-bg text-danger-text" },
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
