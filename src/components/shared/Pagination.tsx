import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, pages, onPageChange, className }: PaginationProps) {
  if (pages <= 1) return null;

  function getPageNumbers(): (number | "...")[] {
    const items: (number | "...")[] = [];
    const delta = 1;
    const left = Math.max(2, page - delta);
    const right = Math.min(pages - 1, page + delta);

    items.push(1);
    if (left > 2) items.push("...");
    for (let i = left; i <= right; i++) items.push(i);
    if (right < pages - 1) items.push("...");
    if (pages > 1) items.push(pages);

    return items;
  }

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      <Button
        variant="ghost"
        size="icon"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="size-9"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {getPageNumbers().map((item, i) =>
        item === "..." ? (
          <span key={`ellipsis-${i}`} className="flex size-9 items-center justify-center text-sm text-muted-foreground">
            &hellip;
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? "default" : "ghost"}
            size="icon"
            onClick={() => onPageChange(item as number)}
            className={cn(
              "size-9 text-sm",
              item === page && "bg-success hover:bg-success/90"
            )}
          >
            {item}
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="icon"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
        className="size-9"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
