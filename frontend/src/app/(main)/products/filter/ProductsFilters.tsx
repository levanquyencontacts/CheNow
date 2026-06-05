import { Box, Button } from "@/components";
import {
  ChevronDown,
  RefreshCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

interface ProductsFiltersProps {
  onReset?: () => void;
  onSearchChange: (value: string) => void;
  searchValue: string;
}

export function ProductsFilters({
  onReset,
  onSearchChange,
  searchValue,
}: ProductsFiltersProps) {
  return (
    <Box className="rounded-md border border-[#eadfd4] bg-white/78 p-3 shadow-[0_8px_18px_rgba(55,36,20,0.04)]">
      <Box className="grid gap-2 md:grid-cols-[minmax(220px,1fr)_160px_135px_auto]">
        <label className="flex h-10 items-center gap-2.5 rounded-md border border-[#eadfd4] bg-[#fffaf5] px-3 text-xs text-[#8a7867]">
          <Search aria-hidden="true" className="h-3.5 w-3.5 text-[#9d8b78]" />
          <span className="sr-only">Search products</span>
          <input
            className="min-w-0 flex-1 bg-transparent text-xs text-[#143d2a] outline-none placeholder:text-[#b7a89a]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products, description"
            type="search"
            value={searchValue}
          />
        </label>

        <Button
          className="h-10 justify-between rounded-md border-[#eadfd4] bg-[#fffaf5] px-3 text-xs font-semibold text-[#1f2c22]"
          variant="outlined"
        >
          All Categories
          <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 text-[#9d8b78]" />
        </Button>

        <Button
          className="h-10 rounded-md border-[#eadfd4] bg-[#fffaf5] px-3 text-xs font-semibold text-[#6b5a49]"
          variant="outlined"
        >
          <SlidersHorizontal aria-hidden="true" className="h-3.5 w-3.5 text-[#b7a89a]" />
          Price
        </Button>

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
