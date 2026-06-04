"use client";
import {
    Box,
    Button,
    PageHeader,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    Table,
    TablePagination,
    TableRow,
    StatusBadge,
} from "@/components";
import {
    CirclePlus,
    FolderTree,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CategoryFilters } from "./filter/CategoryFilters";
import { LIMIT_PAGE } from "@/common/utils/constant";
import { useCategoriesQuery } from "@/services/controllers/categories/CategoriesQueries";
import { PaginationParams } from "@/services/types/apiType";
import { formatDate } from "@/common/utils/formatDate";

export default function CategoryPage() {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(LIMIT_PAGE);
    const [searchValue, setSearchValue] = useState('');

    const paginationPrams: PaginationParams = {
        page: page,
        limit,
        order: 'ASC',
        searchValue,

    }
    const { data, isError, isLoading } = useCategoriesQuery(paginationPrams);
    const categories = data?.data ?? [];
    const pagination = data?.metadata.pagination;
    const totalPages = pagination?.totalPages ?? 1;

    return (
        <>
            <PageHeader title={t('Category')} searchPlaceholder="Search Inventory..." />

            <Box className="flex min-h-full bg-[#fff8f1] px-4 py-4 text-[#143d2a] sm:px-6 lg:px-8">
                <Box className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4">
                    <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Box>
                            <h1 className="text-2xl font-semibold tracking-normal text-[#183d2b]">
                                Categories
                            </h1>
                            <p className="mt-0.5 text-xs text-[#4d5b4f]">
                                Manage product groups, visibility, and inventory coverage.
                            </p>
                        </Box>

                        <Button className="h-9 w-fit rounded-md bg-[#183d2b] px-4 text-xs font-semibold text-white shadow-[0_6px_12px_rgba(24,61,43,0.14)] hover:bg-[#102f21]">
                            <CirclePlus aria-hidden="true" className="h-3.5 w-3.5" />
                            Add Category
                        </Button>
                    </Box>

                    <CategoryFilters
                        onReset={() => {
                            setSearchValue('');
                            setPage(1);
                        }}
                        onSearchChange={(nextSearchValue) => {
                            setSearchValue(nextSearchValue);
                            setPage(1);
                        }}
                        searchValue={searchValue}
                    />

                    <Box className="flex flex-1 flex-col overflow-hidden rounded-lg border border-[#eadfd4] bg-white/90 shadow-[0_16px_34px_rgba(55,36,20,0.06)]">
                        <TableContainer className="flex-1 bg-white/70" style={{ overflow: "auto" }}>
                            <Table
                                className="min-w-[900px] table-fixed text-left text-sm"
                                padding="none"
                                size="small"
                            >
                                <TableHead>
                                    <TableRow
                                        className="h-12 bg-[#fffaf5] text-xs font-semibold uppercase tracking-normal text-[#5c554c]"
                                        style={{ borderBottom: "1px solid #eadfd4" }}
                                    >
                                        <TableCell style={{ width: "13%", padding: "16px", borderBottom: 0, fontSize: 12, fontWeight: 600, color: "#5c554c" }}>
                                            ID
                                        </TableCell>
                                        <TableCell style={{ width: "32%", padding: "16px 20px", borderBottom: 0, fontSize: 12, fontWeight: 600, color: "#5c554c" }}>
                                            Category
                                        </TableCell>
                                        <TableCell style={{ width: "23%", padding: "16px", borderBottom: 0, fontSize: 12, fontWeight: 600, color: "#5c554c" }}>
                                            Description
                                        </TableCell>
                                        <TableCell style={{ width: "11%", padding: "16px", borderBottom: 0, fontSize: 12, fontWeight: 600, color: "#5c554c" }}>
                                            Status
                                        </TableCell>
                                        <TableCell style={{ width: "12%", padding: "16px", borderBottom: 0, fontSize: 12, fontWeight: 600, color: "#5c554c" }}>
                                            Created
                                        </TableCell>
                                        <TableCell style={{ width: "12%", padding: "16px", borderBottom: 0, fontSize: 12, fontWeight: 600, color: "#5c554c" }}>
                                            Updated
                                        </TableCell>
                                        <TableCell align="right" style={{ width: "6%", padding: "16px", borderBottom: 0, fontSize: 12, fontWeight: 600, color: "#5c554c" }}>
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {isLoading ? (
                                        <TableRow className="h-20 bg-white/60 text-[#6f665c]">
                                            <TableCell colSpan={7} style={{ padding: "16px 20px", borderBottom: 0, color: "#6f665c" }}>
                                                Loading categories...
                                            </TableCell>
                                        </TableRow>
                                    ) : null}

                                    {isError ? (
                                        <TableRow className="h-20 bg-white/60 text-[#b12f1d]">
                                            <TableCell colSpan={7} style={{ padding: "16px 20px", borderBottom: 0, color: "#b12f1d" }}>
                                                Cannot load categories.
                                            </TableCell>
                                        </TableRow>
                                    ) : null}

                                    {!isLoading && !isError && categories.length === 0 ? (
                                        <TableRow className="h-20 bg-white/60 text-[#6f665c]">
                                            <TableCell colSpan={7} style={{ padding: "16px 20px", borderBottom: 0, color: "#6f665c" }}>
                                                No categories found.
                                            </TableCell>
                                        </TableRow>
                                    ) : null}

                                    {categories.map((category) => (
                                        <TableRow
                                            className="h-20 bg-white/60 text-[#153c2a] transition hover:bg-[#fff8f1]"
                                            key={category.id}
                                            style={{ borderBottom: "1px solid #eadfd4" }}
                                        >
                                            <TableCell className="font-medium" style={{ padding: "16px", borderBottom: 0, color: "#21372b" }}>
                                                {category.id}
                                            </TableCell>
                                            <TableCell style={{ padding: "16px 20px", borderBottom: 0 }}>
                                                <Box className="flex items-center gap-3">
                                                    <Box className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#eadfd4] bg-[#f6eee6] text-[#8d6b4f]">
                                                        <FolderTree aria-hidden="true" className="h-5 w-5" />
                                                    </Box>
                                                    <Box>
                                                        <p className="max-w-48 text-sm font-semibold leading-tight text-[#163c2a]">
                                                            {category.categoryName}
                                                        </p>
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            <TableCell style={{ padding: "16px", borderBottom: 0, color: "#183d2b" }}>
                                                {category.description || "-"}
                                            </TableCell>
                                            <TableCell style={{ padding: "16px", borderBottom: 0 }}>
                                                <StatusBadge status={category.status} />
                                            </TableCell>
                                            <TableCell style={{ padding: "16px", borderBottom: 0, color: "#284536" }}>
                                                {formatDate(category.createdAt)}
                                            </TableCell>
                                            <TableCell style={{ padding: "16px", borderBottom: 0, color: "#284536" }}>
                                                {formatDate(category.updatedAt)}
                                            </TableCell>
                                            <TableCell align="right" style={{ padding: "16px", borderBottom: 0 }}>
                                                <button className="rounded-md px-3 py-2 text-sm font-semibold text-[#183d2b] hover:bg-[#f3e8de]">
                                                    Edit
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

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
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            total={pagination?.total ?? 0}
                        />
                    </Box>
                </Box>
            </Box>
        </>
    );
}
