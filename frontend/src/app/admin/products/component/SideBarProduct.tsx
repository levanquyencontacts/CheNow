"use client";

import {
    Box,
    Select,
    StatusBadge,
    UploadImage,
} from "@/components";
import { Category } from "@/services/types/apiType";

interface SideBarProductProps {
    categories: Category[];
    categoryId: string;
    hasMoreCategories?: boolean;
    isActive: boolean;
    isFetchingMoreCategories?: boolean;
    isLoadingCategories?: boolean;
    onActiveChange: (checked: boolean) => void;
    onCategoryChange: (value: string) => void;
    onImageChange: (file: File | null) => void;
    onLoadMoreCategories?: () => void;
    productImage: File | string | null;
}

export function SideBarProduct({
    categories,
    categoryId,
    hasMoreCategories = false,
    isActive,
    isFetchingMoreCategories = false,
    isLoadingCategories = false,
    onActiveChange,
    onCategoryChange,
    onImageChange,
    onLoadMoreCategories,
    productImage,
}: SideBarProductProps) {
    return (
        <Box className="flex flex-col gap-6">
            <Box className="rounded-lg border border-[#eadfd4] bg-[#fff8f3] p-7">
                <h2 className="mb-5 text-base font-semibold text-[#183d2b]">
                    Product Image
                </h2>

                <UploadImage
                    allowClear
                    aspectRatio={1}
                    fit="cover"
                    helperText="Recommended: 1:1 ratio, 800x800px"
                    onChange={onImageChange}
                    previewType="thumbnails"
                    value={productImage}
                />
            </Box>

            <Box className="rounded-lg border border-[#eadfd4] bg-[#fff8f3] p-7">
                <h2 className="mb-5 text-base font-semibold text-[#183d2b]">
                    Classification
                </h2>

                <Box className="flex flex-col gap-6">
                    <Select
                        className="h-11 border-0 bg-white text-sm"
                        disabled={isLoadingCategories}
                        fullWidth
                        label="Category"
                        onChange={(event) => onCategoryChange(event.target.value)}
                        onListboxNeedsMoreItems={() => {
                            if (!hasMoreCategories || isFetchingMoreCategories) {
                                return;
                            }

                            onLoadMoreCategories?.();
                        }}
                        onListboxScrollEnd={() => {
                            if (!hasMoreCategories || isFetchingMoreCategories) {
                                return;
                            }

                            onLoadMoreCategories?.();
                        }}
                        placeholder={isLoadingCategories ? "Loading categories..." : "Select category"}
                        value={categoryId}
                    >
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

                    <Box>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#906544]">
                            Status
                        </p>
                        <StatusBadge
                            checked={isActive}
                            onCheckedChange={onActiveChange}
                            status={isActive ? "active" : "inactive"}
                            toggle
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
