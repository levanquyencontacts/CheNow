import { Box } from "@/components";
import {
    ChevronDown,
    RefreshCcw,
    Search,
    SlidersHorizontal,
} from "lucide-react";

interface CategoryFiltersProps {
    onReset?: () => void;
    onSearchChange: (value: string) => void;
    searchValue: string;
}

export function CategoryFilters({
    onReset,
    onSearchChange,
    searchValue,
}: CategoryFiltersProps) {
    return (
        <Box className="rounded-md border border-[#eadfd4] bg-white/78 p-3 shadow-[0_8px_18px_rgba(55,36,20,0.04)]">
            <Box className="grid gap-2 md:grid-cols-[minmax(220px,1fr)_160px_135px_110px_auto]">
                <label className="flex h-10 items-center gap-2.5 rounded-md border border-[#eadfd4] bg-[#fffaf5] px-3 text-xs text-[#8a7867]">
                    <Search aria-hidden="true" className="h-3.5 w-3.5 text-[#9d8b78]" />
                    <span className="sr-only">Search categories</span>
                    <input
                        className="min-w-0 flex-1 bg-transparent text-xs text-[#143d2a] outline-none placeholder:text-[#b7a89a]"
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Search categories, ID"
                        type="search"
                        value={searchValue}
                    />
                </label>

                <button className="flex h-10 items-center justify-between rounded-md border border-[#eadfd4] bg-[#fffaf5] px-3 text-xs font-semibold text-[#1f2c22]">
                    All Categories
                    <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 text-[#9d8b78]" />
                </button>

                <button className="flex h-10 items-center justify-between rounded-md border border-[#eadfd4] bg-[#fffaf5] px-3 text-xs font-semibold text-[#1f2c22]">
                    Any Status
                    <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 text-[#9d8b78]" />
                </button>

                <button className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#eadfd4] bg-[#fffaf5] px-3 text-xs font-semibold text-[#6b5a49]">
                    <SlidersHorizontal aria-hidden="true" className="h-3.5 w-3.5 text-[#b7a89a]" />
                    Stock
                </button>

                <button
                    className="flex h-10 items-center justify-center gap-2 rounded-md px-3 text-xs font-semibold text-[#183d2b] hover:bg-[#f3e8de]"
                    onClick={onReset}
                    type="button"
                >
                    <RefreshCcw aria-hidden="true" className="h-3.5 w-3.5" />
                    Reset
                </button>
            </Box>
        </Box>
    );
}
