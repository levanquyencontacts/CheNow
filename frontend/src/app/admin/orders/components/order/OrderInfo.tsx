import { Box } from "@/components";
import type { LucideIcon } from "lucide-react";

import { formatCurrency } from "../ultils/orderFormat";

export function InfoCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Box className="rounded-md border border-[#eadfd4] bg-[#fffaf5] p-4">
      <h3 className="mb-3 text-sm font-semibold text-[#183d2b]">{title}</h3>
      <Box className="space-y-2">{children}</Box>
    </Box>
  );
}

export function InfoLine({
  icon: Icon,
  text,
  tone = "default",
}: {
  icon: LucideIcon;
  text: string;
  tone?: "default" | "success";
}) {
  return (
    <p className="flex items-start gap-2 text-xs font-medium text-[#314032]">
      <Icon
        aria-hidden="true"
        className={[
          "mt-0.5 h-3.5 w-3.5 shrink-0",
          tone === "success" ? "text-[#315d3b]" : "text-[#6b5a49]",
        ].join(" ")}
      />
      <span>{text}</span>
    </p>
  );
}

export function SummaryLine({
  danger = false,
  label,
  value,
}: {
  danger?: boolean;
  label: string;
  value: string | number;
}) {
  return (
    <Box className="flex items-center justify-between text-xs font-semibold">
      <span className="text-[#6f665c]">{label}</span>
      <span className={danger ? "text-[#b12f1d]" : "text-[#183d2b]"}>
        {formatCurrency(value)}
      </span>
    </Box>
  );
}
