"use client";

import { Box, Pagination, Select } from "@/components";

export interface TablePaginationProps {
  count: number;
  disabled?: boolean;
  limit: number;
  onLimitChange?: (limit: number) => void;
  onPageChange: (page: number) => void;
  page: number;
  rowsPerPageOptions?: number[];
  total: number;
}

export function TablePagination({
  count,
  disabled = false,
  limit,
  onLimitChange,
  onPageChange,
  page,
  rowsPerPageOptions = [10, 25, 50],
  total,
}: TablePaginationProps) {
  const startResult = total > 0 ? (page - 1) * limit + 1 : 0;
  const endResult = Math.min(page * limit, total);

  return (
    <Box className="flex flex-col gap-4 border-t border-[#eadfd4] bg-[#fffaf5] px-5 py-4 text-xs font-semibold text-[#314032] sm:flex-row sm:items-center sm:justify-between">
      <Box className="flex items-center gap-2">
        <span>Rows per page:</span>
        <Select
          aria-label="Rows per page"
          className="h-8 min-w-16 rounded border-[#d8cbbf] bg-white px-3 pr-8 text-xs font-semibold text-[#183d2b]"
          disabled={disabled || !onLimitChange}
          menuPlacement="top"
          onChange={(event) => onLimitChange?.(Number(event.target.value))}
          value={String(limit)}
        >
          {rowsPerPageOptions.map((option) => (
            <Select.Option key={option} value={String(option)}>
              {option}
            </Select.Option>
          ))}
        </Select>
      </Box>

      <span>
        Showing {startResult}-{endResult} of {total} results
      </span>

      <Pagination
        count={count}
        disabled={disabled}
        onChange={(_, nextPage) => onPageChange(nextPage)}
        page={page}
      />
    </Box>
  );
}
