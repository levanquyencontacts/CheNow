import { Box } from "@/components";
import type { Order as ApiOrder } from "@/services/types/apiType";

import { statusMeta, timeline } from "../../../../../common/utils/status";
import { formatDateTime } from "../ultils/orderFormat";

export function OrderStatusHistory({ order }: { order: ApiOrder }) {
  const statusLogs = [...(order.statusLogs ?? [])].sort(
    (firstLog, secondLog) =>
      new Date(firstLog.createdAt).getTime() -
      new Date(secondLog.createdAt).getTime(),
  );
  const hasStatusLogs = statusLogs.length > 0;

  return (
    <Box className="rounded-lg border border-[#eadfd4] bg-white/90 p-5 shadow-[0_16px_34px_rgba(55,36,20,0.06)]">
      <h2 className="text-lg font-semibold text-[#183d2b]">Status history</h2>
      <Box className="mt-5 space-y-0">
        {hasStatusLogs
          ? statusLogs.map((log, index) => {
              const meta = statusMeta[log.toStatus] ?? statusMeta.pending;
              const Icon = meta.icon;

              return (
                <Box
                  className="grid grid-cols-[48px_1fr_auto] gap-3"
                  key={log.id}
                >
                  <Box className="flex flex-col items-center">
                    <span
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-full border",
                        `${meta.badgeClass} shadow-[0_6px_12px_rgba(55,36,20,0.06)]`,
                      ].join(" ")}
                    >
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    {index < statusLogs.length - 1 ? (
                      <span className="h-11 border-l border-dashed border-[#c99545]" />
                    ) : null}
                  </Box>
                  <Box className="pb-4 pt-1">
                    <p className="text-xs font-bold text-[#5c554c]">
                      {meta.label}
                    </p>
                    <p className="mt-1 text-xs text-[#6f665c]">
                      {log.note || meta.description}
                    </p>
                  </Box>
                  <span className="pt-1 text-xs font-semibold text-[#6f665c]">
                    {formatDateTime(log.createdAt)}
                  </span>
                </Box>
              );
            })
          : timeline.map((status, index) => {
          const meta = statusMeta[status];
          const Icon = meta.icon;
          const reached =
            timeline.indexOf(order.status) >= index &&
            order.status !== "cancelled";
          const active = order.status === status;

          return (
            <Box className="grid grid-cols-[48px_1fr_auto] gap-3" key={status}>
              <Box className="flex flex-col items-center">
                <span
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full border",
                    reached
                      ? `${meta.badgeClass} shadow-[0_6px_12px_rgba(55,36,20,0.06)]`
                      : "border-[#d8cbbf] bg-[#f1ece6] text-[#8a7867]",
                  ].join(" ")}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                {index < timeline.length - 1 ? (
                  <span
                    className={[
                      "h-11 border-l border-dashed",
                      reached ? "border-[#c99545]" : "border-[#d8cbbf]",
                    ].join(" ")}
                  />
                ) : null}
              </Box>
              <Box className="pb-4 pt-1">
                <p
                  className={[
                    "text-xs font-bold",
                    active ? "text-[#9b4b16]" : "text-[#5c554c]",
                  ].join(" ")}
                >
                  {meta.label}
                </p>
                <p className="mt-1 text-xs text-[#6f665c]">
                  {meta.description}
                </p>
              </Box>
              {active ? (
                <span className="pt-1 text-xs font-semibold text-[#6f665c]">
                  {formatDateTime(order.updatedAt || order.createdAt)}
                </span>
              ) : null}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
