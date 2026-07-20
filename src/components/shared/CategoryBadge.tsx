import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categoryStyles: Record<string, string> = {
  sales: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  finance: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  marketing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  operations: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("border-0 font-medium capitalize", categoryStyles[category] || categoryStyles.other, className)}
    >
      {category}
    </Badge>
  );
}
