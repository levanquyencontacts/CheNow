import type { MouseEventHandler, ReactNode } from "react";
import { clsx } from "@/components/utils";
import { TableCell } from "./TableCell";
import { EditIcon } from "@/common/assets/icons";

interface TableActionCellProps {
  buttonClassName?: string;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  label?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function TableActionCell({
  buttonClassName,
  children,
  className,
  disabled = false,
  icon,
  label,
  onClick,
}: TableActionCellProps) {
  return (
    <TableCell
      align="right"
      className={className}
      style={{ padding: "16px", borderBottom: 0 }}
    >
      {children ?? (
        <button
          className={clsx(
            "inline-flex cursor-pointer items-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-[#183d2b] opacity-0 transition hover:bg-[#f3e8de] group-hover:opacity-100 focus-visible:opacity-100 disabled:cursor-not-allowed disabled:text-[#a09183] disabled:hover:bg-transparent",
            buttonClassName
          )}
          disabled={disabled}
          onClick={onClick}
          type="button"
        >
          {icon ?? <EditIcon color="currentColor" size={16} />}
          {label ? <span className="ml-2">{label}</span> : null}
        </button>
      )}
    </TableCell>
  );
}
