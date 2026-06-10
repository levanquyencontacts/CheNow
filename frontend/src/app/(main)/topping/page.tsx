"use client";

import { LIMIT_PAGE, LIMIT_PAGE_ARRAY } from "@/common/utils/constant";
import { Box, Button, PageHeader, TablePagination } from "@/components";
import { useModal } from "@/providers";
import { useToppingsQuery } from "@/services/controllers/toppings/ToppingsQueries";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { ToppingCard } from "./components/ToppingCard";
import { ToppingFilters } from "./filter/ToppingFilters";

export default function Topping() {
  const { openModal } = useModal();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(LIMIT_PAGE);
  const [searchValue, setSearchValue] = useState("");

  const { data, isError, isLoading } = useToppingsQuery({
    page,
    limit,
    order: "ASC",
    searchValue,
  });

  const toppings = data?.data ?? [];
  const pagination = data?.metadata.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <>
      <PageHeader title="Topping" searchPlaceholder="Search Inventory..." />

      <Box className="bg-[#fff8f1] px-4 py-4 text-[#143d2a] sm:px-6 lg:px-8">
        <Box className="mx-auto flex w-full max-w-7xl flex-col gap-4">
          <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Box>
              <h1 className="text-2xl font-semibold tracking-normal text-[#183d2b]">
                Toppings
              </h1>
              <p className="mt-0.5 text-xs text-[#4d5b4f]">
                Manage topping catalog, prices, and category availability.
              </p>
            </Box>

            <Button
              className="h-9 w-fit rounded-md bg-[#183d2b] px-4 text-xs font-semibold text-white shadow-[0_6px_12px_rgba(24,61,43,0.14)] hover:bg-[#102f21]"
              onClick={() => openModal("TOPPING")}
            >
              <CirclePlus aria-hidden="true" className="h-3.5 w-3.5" />
              Add Topping
            </Button>
          </Box>

          <ToppingFilters
            onReset={() => {
              setSearchValue("");
              setPage(1);
            }}
            onSearchChange={(nextSearchValue) => {
              setSearchValue(nextSearchValue);
              setPage(1);
            }}
            searchValue={searchValue}
          />

          <Box className="flex flex-col gap-4">
            {isLoading ? (
              <Box className="rounded-lg border border-[#eadfd4] bg-white/70 p-6 text-sm text-[#6f665c]">
                Loading toppings...
              </Box>
            ) : null}

            {isError ? (
              <Box className="rounded-lg border border-[#f0c8c5] bg-[#fff2ef] p-6 text-sm text-[#b12f1d]">
                Cannot load toppings.
              </Box>
            ) : null}

            {!isLoading && !isError && toppings.length === 0 ? (
              <Box className="rounded-lg border border-[#eadfd4] bg-white/70 p-6 text-sm text-[#6f665c]">
                No toppings found.
              </Box>
            ) : null}

            {!isLoading && !isError && toppings.length > 0 ? (
              <Box className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {toppings.map((topping) => (
                  <ToppingCard
                    key={topping.id}
                    onEdit={(toppingId) => openModal("TOPPING", { toppingId })}
                    topping={topping}
                  />
                ))}
              </Box>
            ) : null}
          </Box>

          <Box className="overflow-hidden rounded-lg border border-[#eadfd4] bg-white/90">
            <TablePagination
              count={totalPages}
              disabled={isLoading}
              limit={pagination?.limit ?? limit}
              onLimitChange={(nextLimit) => {
                setLimit(nextLimit);
                setPage(1);
              }}
              onPageChange={setPage}
              page={page}
              rowsPerPageOptions={LIMIT_PAGE_ARRAY}
              total={pagination?.total ?? 0}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
