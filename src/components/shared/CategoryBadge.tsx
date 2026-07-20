import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categoryStyles: Record<string, string> = {
  sales: "bg-category-sales-bg text-category-sales-text",
  finance: "bg-category-finance-bg text-category-finance-text",
  marketing: "bg-category-marketing-bg text-category-marketing-text",
  operations: "bg-category-operations-bg text-category-operations-text",
  other: "bg-category-other-bg text-category-other-text",
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
