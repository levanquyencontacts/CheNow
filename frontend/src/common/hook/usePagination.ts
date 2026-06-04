"use client";

import { useState, type MouseEvent } from "react";

export type PaginationItemType =
  | "first"
  | "previous"
  | "page"
  | "start-ellipsis"
  | "end-ellipsis"
  | "next"
  | "last";

export interface UsePaginationItem {
  "aria-current"?: "page";
  disabled?: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  page: number | null;
  selected: boolean;
  type: PaginationItemType;
}

export interface UsePaginationProps {
  boundaryCount?: number;
  count?: number;
  defaultPage?: number;
  disabled?: boolean;
  hideNextButton?: boolean;
  hidePrevButton?: boolean;
  onChange?: (event: MouseEvent<HTMLButtonElement>, page: number) => void;
  page?: number;
  showFirstButton?: boolean;
  showLastButton?: boolean;
  siblingCount?: number;
}

export default function usePagination({
  boundaryCount = 1,
  count = 1,
  defaultPage = 1,
  disabled = false,
  hideNextButton = false,
  hidePrevButton = false,
  onChange,
  page: pageProp,
  showFirstButton = false,
  showLastButton = false,
  siblingCount = 1,
}: UsePaginationProps = {}) {
  const [pageState, setPageState] = useState(defaultPage);
  const page = pageProp ?? pageState;

  const handleClick = (event: MouseEvent<HTMLButtonElement>, value: number | null) => {
    if (value === null) {
      return;
    }

    if (pageProp === undefined) {
      setPageState(value);
    }

    onChange?.(event, value);
  };

  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return length > 0 ? Array.from({ length }, (_, index) => start + index) : [];
  };

  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(
    Math.max(count - boundaryCount + 1, boundaryCount + 1),
    count
  );

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2
  );

  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    count - boundaryCount - 1
  );

  const itemList: Array<number | Exclude<PaginationItemType, "page">> = [
    ...(showFirstButton ? (["first"] as const) : []),
    ...(hidePrevButton ? [] : (["previous"] as const)),
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? (["start-ellipsis"] as const)
      : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1]
        : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < count - boundaryCount - 1
      ? (["end-ellipsis"] as const)
      : count - boundaryCount > boundaryCount
        ? [count - boundaryCount]
        : []),
    ...endPages,
    ...(hideNextButton ? [] : (["next"] as const)),
    ...(showLastButton ? (["last"] as const) : []),
  ];

  const buttonPage = (type: Exclude<PaginationItemType, "page">) => {
    switch (type) {
      case "first":
        return 1;
      case "previous":
        return page - 1;
      case "next":
        return page + 1;
      case "last":
        return count;
      default:
        return null;
    }
  };

  const items: UsePaginationItem[] = itemList.map((item) => {
    if (typeof item === "number") {
      return {
        "aria-current": item === page ? "page" : undefined,
        disabled,
        onClick: (event) => handleClick(event, item),
        page: item,
        selected: item === page,
        type: "page",
      };
    }

    const itemPage = buttonPage(item);

    return {
      disabled:
        disabled ||
        (!item.includes("ellipsis") &&
          (item === "next" || item === "last" ? page >= count : page <= 1)),
      onClick: (event) => handleClick(event, itemPage),
      page: itemPage,
      selected: false,
      type: item,
    };
  });

  return { items };
}
