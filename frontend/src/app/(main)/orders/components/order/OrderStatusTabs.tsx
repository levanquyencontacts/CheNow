import { Box } from "@/components";
import type { OrderStatus } from "@/services/types/apiType";
import { ShoppingBag } from "lucide-react";

import { statusMeta, statusTabs } from "../../../../../common/utils/status";

export function OrderStatusTabs({
  onChange,
  selectedStatus,
  statusCounts,
}: {
  onChange: (status: OrderStatus | "all") => void;
  selectedStatus: OrderStatus | "all";
  statusCounts: Record<OrderStatus | "all", number | undefined>;
}) {
  return (
    <Box className="rounded-lg border border-[#eadfd4] bg-white/78 p-3 shadow-[0_8px_18px_rgba(55,36,20,0.04)]">
      <Box className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => {
          const active = selectedStatus === tab.value;
          const meta = tab.value === "all" ? null : statusMeta[tab.value];

          return (
            <button
              className={[
                "inline-flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-semibold transition",
                active
                  ? "border-[#183d2b] bg-[#183d2b] text-white shadow-sm"
                  : "border-[#eadfd4] bg-[#fffaf5] text-[#5c554c] hover:border-[#c2ad9d] hover:bg-[#fff3e8]",
              ].join(" ")}
              key={tab.value}
              onClick={() => onChange(tab.value)}
              type="button"
            >
              {meta ? (
                <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} />
              ) : (
                <ShoppingBag aria-hidden="true" className="h-3.5 w-3.5" />
              )}
              {tab.label}
              <span
                className={[
                  "rounded-full px-2 py-0.5 text-[10px]",
                  active
                    ? "bg-white/18 text-white"
                    : "bg-[#f3e8de] text-[#6b5a49]",
                ].join(" ")}
              >
                {statusCounts[tab.value] ?? "-"}
              </span>
            </button>
          );
        })}
      </Box>
    </Box>
  );
}
