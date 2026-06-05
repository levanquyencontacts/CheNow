import { clsx } from "@/components/utils";

export type StatusVariant =
  | "active"
  | "archived"
  | "danger"
  | "draft"
  | "inactive"
  | "neutral"
  | "pending"
  | "success"
  | "warning";

export interface StatusBadgeProps {
  activeLabel?: string;
  className?: string;
  checked?: boolean;
  disabled?: boolean;
  inactiveLabel?: string;
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
  status: StatusVariant | string;
  toggle?: boolean;
  variant?: StatusVariant;
}

const statusLabels: Record<StatusVariant, string> = {
  active: "Active",
  archived: "Archived",
  danger: "Danger",
  draft: "Draft",
  inactive: "Inactive",
  neutral: "Neutral",
  pending: "Pending",
  success: "Success",
  warning: "Warning",
};

const statusVariantClasses: Record<StatusVariant, string> = {
  active: "border-[#b8d2bc] bg-[#eef7ef] text-[#315d3b]",
  archived: "border-[#d8cbbf] bg-[#f1ece6] text-[#6b5a49]",
  danger: "border-[#f0b9a9] bg-[#fff2ef] text-[#b12f1d]",
  draft: "border-[#cfd6df] bg-[#f3f6f9] text-[#516172]",
  inactive: "border-[#e6d5c5] bg-[#f8efe7] text-[#7b6049]",
  neutral: "border-[#d8cbbf] bg-white text-[#5c554c]",
  pending: "border-[#f0d28a] bg-[#fff8df] text-[#8a6418]",
  success: "border-[#b8d2bc] bg-[#eef7ef] text-[#315d3b]",
  warning: "border-[#f0d28a] bg-[#fff8df] text-[#8a6418]",
};

function normalizeStatus(status: string): StatusVariant {
  return status in statusVariantClasses ? (status as StatusVariant) : "neutral";
}

function formatStatusLabel(status: string) {
  return status
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function StatusBadge({
  activeLabel = "Đang bán",
  className,
  checked,
  disabled = false,
  inactiveLabel = "Ngừng bán",
  label,
  onCheckedChange,
  status,
  toggle = false,
  variant,
}: StatusBadgeProps) {
  const normalizedStatus = normalizeStatus(status.toLowerCase());
  const normalizedVariant = variant ?? normalizedStatus;
  const isChecked = checked ?? normalizedStatus === "active";

  if (toggle) {
    return (
      <label
        className={clsx(
          "inline-flex w-fit cursor-pointer items-center gap-3 text-sm font-semibold text-[#183d2b]",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
      >
        <input
          checked={isChecked}
          className="peer sr-only"
          disabled={disabled}
          onChange={(event) => onCheckedChange?.(event.target.checked)}
          type="checkbox"
        />
        <span className="relative h-6 w-11 rounded-full bg-[#bfb2a6] transition peer-checked:bg-[#183d2b] peer-focus-visible:ring-2 peer-focus-visible:ring-[#183d2b]/25">
          <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
        </span>
        <span>{label ?? (isChecked ? activeLabel : inactiveLabel)}</span>
      </label>
    );
  }

  return (
    <span
      className={clsx(
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold cursor-pointer",
        statusVariantClasses[normalizedVariant],
        className
      )}
    >
      {label ?? statusLabels[normalizedStatus] ?? formatStatusLabel(status)}
    </span>
  );
}
