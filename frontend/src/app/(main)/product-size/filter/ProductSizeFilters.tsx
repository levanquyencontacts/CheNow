import { Box, Button, Select } from "@/components";
import { Category } from "@/services/types/apiType";
import { RefreshCcw, Search } from "lucide-react";

interface ProductSizeFiltersProps {
  categories: Category[];
  categoryValue: string;
  hasMoreCategories?: boolean;
  isFetchingMoreCategories?: boolean;
  isLoadingCategories?: boolean;
  onCategoryChange: (value: string) => void;
  onLoadMoreCategories: () => void;
  onReset?: () => void;
  onSearchChange: (value: string) => void;
  searchValue: string;
}

export function ProductSizeFilters({
  categories,
  categoryValue,
  hasMoreCategories = false,
  isFetchingMoreCategories = false,
  isLoadingCategories = false,
  onCategoryChange,
  onLoadMoreCategories,
  onReset,
  onSearchChange,
  searchValue,
}: ProductSizeFiltersProps) {
  return (
    <Box className="rounded-md border border-[#eadfd4] bg-white/78 p-3 shadow-[0_8px_18px_rgba(55,36,20,0.04)]">
      <Box className="grid gap-2 md:grid-cols-[minmax(220px,1fr)_180px_auto]">
        <label className="flex h-10 items-center gap-2.5 rounded-md border border-[#eadfd4] bg-[#fffaf5] px-3 text-xs text-[#8a7867]">
          <Search aria-hidden="true" className="h-3.5 w-3.5 text-[#9d8b78]" />
          <span className="sr-only">Search sizes</span>
          <input
            className="min-w-0 flex-1 bg-transparent text-xs text-[#143d2a] outline-none placeholder:text-[#b7a89a]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search size name or code"
            type="search"
            value={searchValue}
          />
        </label>

        <Select
          aria-label="Filter category"
          className="h-10 rounded-md border-[#eadfd4] bg-[#fffaf5] px-3 pr-8 text-xs font-semibold text-[#1f2c22]"
          disabled={isLoadingCategories}
          onChange={(event) => onCategoryChange(event.target.value)}
          onListboxNeedsMoreItems={() => {
            if (!hasMoreCategories || isFetchingMoreCategories) {
              return;
            }
            onLoadMoreCategories();
          }}
          onListboxScrollEnd={() => {
            if (!hasMoreCategories || isFetchingMoreCategories) {
              return;
            }
            onLoadMoreCategories();
          }}
          value={categoryValue}
        >
          <Select.Option value="">All Categories</Select.Option>
          {categories.map((category) => (
            <Select.Option key={category.id} value={String(category.id)}>
              {category.categoryName}
            </Select.Option>
          ))}
          {isFetchingMoreCategories ? (
            <Select.Option disabled value="__loading_categories">
              Loading more...
            </Select.Option>
          ) : null}
        </Select>

        <Button
          className="h-10 rounded-md px-3 text-xs font-semibold text-[#183d2b] hover:bg-[#f3e8de]"
          onClick={onReset}
          type="button"
          variant="text"
        >
          <RefreshCcw aria-hidden="true" className="h-3.5 w-3.5" />
          Reset
        </Button>
      </Box>
    </Box>
  );
}
