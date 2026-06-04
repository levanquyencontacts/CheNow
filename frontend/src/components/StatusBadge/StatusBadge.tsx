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
  className?: string;
  label?: string;
  status: StatusVariant | string;
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
  className,
  label,
  status,
  variant,
}: StatusBadgeProps) {
  const normalizedStatus = normalizeStatus(status.toLowerCase());
  const normalizedVariant = variant ?? normalizedStatus;

  return (
    <span
      className={clsx(
        "inline-flex rounded-full border px-3 py-1 text-xs font-semiboldb cursor-pointer",
        statusVariantClasses[normalizedVariant],
        className
      )}
    >
      {label ?? statusLabels[normalizedStatus] ?? formatStatusLabel(status)}
    </span>
  );
}
