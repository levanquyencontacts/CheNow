"use client";

import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "@/components/utils";
import usePagination, {
  type UsePaginationProps,
  type PaginationItemType,
} from "../../common/hook/usePagination";

export interface PaginationProps extends UsePaginationProps {
  className?: string;
}

const itemLabels: Record<PaginationItemType, string> = {
  first: "First page",
  previous: "Previous page",
  page: "Page",
  "start-ellipsis": "More pages",
  "end-ellipsis": "More pages",
  next: "Next page",
  last: "Last page",
};

export function Pagination({ className, ...props }: PaginationProps) {
  const { items } = usePagination(props);

  return (
    <nav aria-label="Pagination" className={clsx("flex items-center gap-2", className)}>
      {items.map((item, index) => {
        if (item.type.includes("ellipsis")) {
          return (
            <span
              aria-hidden="true"
              className="flex h-8 min-w-4 items-center justify-center px-1 text-[#8a7867]"
              key={`${item.type}-${index}`}
            >
              ...
            </span>
          );
        }

        const Icon =
          item.type === "first"
            ? ChevronFirst
            : item.type === "previous"
              ? ChevronLeft
              : item.type === "next"
                ? ChevronRight
                : item.type === "last"
                  ? ChevronLast
                  : null;

        return (
          <button
            aria-current={item["aria-current"]}
            aria-label={
              item.type === "page" && item.page
                ? `Page ${item.page}`
                : itemLabels[item.type]
            }
            className={clsx(
              "flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40",
              item.selected
                ? "bg-[#183d2b] text-white"
                : "text-[#183d2b] hover:bg-[#f3e8de]",
              item.type === "previous" && "text-[#9d8b78]"
            )}
            disabled={item.disabled}
            key={`${item.type}-${item.page ?? index}`}
            onClick={item.onClick}
            type="button"
          >
            {Icon ? (
              <Icon aria-hidden="true" className="h-4 w-4" />
            ) : (
              item.page
            )}
          </button>
        );
      })}
    </nav>
  );
}
