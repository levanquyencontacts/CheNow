import { Box } from "@/components";
import type { DashboardRevenuePoint } from "@/services/types/apiType";

import { buildEmptyChartPoints, formatCurrency } from "./dashboardFormat";

export function DashboardRevenueSection({
  isLoading,
  points,
}: {
  isLoading: boolean;
  points: DashboardRevenuePoint[];
}) {
  return (
    <Box className="rounded-md border border-[#eadfd4] bg-white p-4 shadow-sm">
      <Box className="mb-4 flex items-center justify-between">
        <p className="text-sm font-bold text-[#211812]">Doanh thu 7 ngay</p>
        <button className="text-[10px] font-bold text-[#d17345]">
          Xem chi tiet
        </button>
      </Box>
      <RevenueChart isLoading={isLoading} points={points} />
    </Box>
  );
}

function RevenueChart({
  isLoading,
  points,
}: {
  isLoading: boolean;
  points: DashboardRevenuePoint[];
}) {
  const hasData = points.some((item) => item.revenue > 0);
  const maxRevenue = Math.max(...points.map((item) => item.revenue), 1);
  const chartPoints = points.length > 0 ? points : buildEmptyChartPoints();
  const axisLabels = [maxRevenue, Math.round(maxRevenue / 2), 0];

  if (isLoading) {
    return (
      <Box className="grid h-44 grid-cols-[44px_1fr] gap-3">
        <Box className="flex flex-col justify-between py-2 text-right text-[9px] text-[#9d8b78]">
          <span>...</span>
          <span>...</span>
          <span>0</span>
        </Box>
        <Box className="flex items-end gap-3 border-b border-l border-[#eadfd4] px-3 pb-6">
          {Array.from({ length: 7 }, (_, index) => (
            <span
              className="h-16 flex-1 animate-pulse rounded-t bg-[#f3e8de]"
              key={index}
            />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box className="relative grid h-44 grid-cols-[44px_1fr] gap-3">
      <Box className="flex flex-col justify-between py-2 text-right text-[9px] font-semibold text-[#9d8b78]">
        {axisLabels.map((value) => (
          <span key={value}>{formatCurrency(value)}</span>
        ))}
      </Box>

      <Box className="relative flex items-end gap-3 border-b border-l border-[#eadfd4] px-3 pb-6">
        <Box className="pointer-events-none absolute inset-x-3 top-2 border-t border-dashed border-[#f0e4da]" />
        <Box className="pointer-events-none absolute inset-x-3 top-1/2 border-t border-dashed border-[#f0e4da]" />
        {chartPoints.map((item) => {
          const height = hasData
            ? Math.max((item.revenue / maxRevenue) * 100, 6)
            : 6;

          return (
            <Box
              className="group relative flex h-full flex-1 flex-col items-center justify-end gap-2"
              key={item.date}
            >
              <span className="absolute -top-1 hidden rounded bg-[#183d2b] px-2 py-1 text-[10px] font-bold text-white shadow-sm group-hover:block">
                {formatCurrency(item.revenue)}
              </span>
              <span
                aria-label={`${item.label}: ${formatCurrency(item.revenue)}`}
                className={[
                  "block w-full max-w-8 rounded-t transition",
                  hasData ? "bg-[#efbd8f] hover:bg-[#d17345]" : "bg-[#f3e8de]",
                ].join(" ")}
                style={{ height: `${height}%` }}
              />
              <span className="absolute bottom-0 translate-y-5 text-[9px] font-semibold text-[#7c7067]">
                {item.label}
              </span>
            </Box>
          );
        })}
        {!hasData ? (
          <span className="absolute inset-x-0 top-1/2 text-center text-xs font-semibold text-[#8a7867]">
            Chua co doanh thu hoan thanh.
          </span>
        ) : null}
      </Box>
    </Box>
  );
}
