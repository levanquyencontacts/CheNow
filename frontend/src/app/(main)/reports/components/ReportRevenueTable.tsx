"use client";

import { Box } from "@/components";
import type { ReportRevenuePoint } from "../types";
import { formatFullCurrency } from "./reportFormat";

interface Props {
  points: ReportRevenuePoint[];
}

export function ReportRevenueTable({ points }: Props) {
  const sorted = [...points].sort((a, b) => b.revenue - a.revenue);

  return (
    <Box className="overflow-hidden rounded-md border border-[#eadfd4] bg-white shadow-sm">
      <Box className="border-b border-[#eadfd4] px-4 py-3">
        <p className="text-sm font-bold text-[#211812]">Chi tiết theo kỳ</p>
        <p className="text-[10px] font-semibold text-[#8a7867]">
          Sắp xếp theo doanh thu giảm dần
        </p>
      </Box>
      <Box className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-xs">
          <thead>
            <tr className="border-b border-[#f0e4da] bg-[#fffaf5]">
              <th className="px-4 py-2 text-left font-bold text-[#8a7867]">
                Kỳ
              </th>
              <th className="px-4 py-2 text-right font-bold text-[#8a7867]">
                Doanh thu
              </th>
              <th className="px-4 py-2 text-right font-bold text-[#8a7867]">
                Đơn hàng
              </th>
              <th className="px-4 py-2 text-right font-bold text-[#8a7867]">
                TB/đơn
              </th>
              <th className="px-4 py-2 text-right font-bold text-[#8a7867]">
                %
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((point, index) => {
              const totalRevenue = points.reduce((s, p) => s + p.revenue, 0);
              const pct =
                totalRevenue > 0
                  ? ((point.revenue / totalRevenue) * 100).toFixed(1)
                  : "0.0";
              const avg =
                point.orderCount > 0
                  ? formatFullCurrency(point.revenue / point.orderCount)
                  : "—";
              const isTop = index === 0 && point.revenue > 0;

              return (
                <tr
                  key={point.date}
                  className={[
                    "border-b border-[#f8f0ea] transition-colors hover:bg-[#fffaf5]",
                    isTop ? "bg-[#fff6ed]" : "",
                  ].join(" ")}
                >
                  <td className="px-4 py-2.5 font-semibold text-[#211812]">
                    <Box className="flex items-center gap-1.5">
                      {isTop ? (
                        <span className="inline-block h-2 w-2 rounded-full bg-[#c75f2a]" />
                      ) : null}
                      {point.label}
                    </Box>
                  </td>
                  <td className="px-4 py-2.5 text-right font-bold text-[#211812]">
                    {point.revenue > 0 ? (
                      formatFullCurrency(point.revenue)
                    ) : (
                      <span className="text-[#b0a090]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right text-[#5f5148]">
                    {point.orderCount > 0 ? (
                      point.orderCount
                    ) : (
                      <span className="text-[#b0a090]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right text-[#5f5148]">
                    {avg}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Box className="flex items-center justify-end gap-1.5">
                      <Box className="h-1.5 w-16 overflow-hidden rounded-full bg-[#f0e4da]">
                        <Box
                          className="h-full rounded-full bg-[#c75f2a]"
                          style={{ width: `${pct}%` }}
                        />
                      </Box>
                      <span className="w-8 text-right text-[#8a7867]">
                        {pct}%
                      </span>
                    </Box>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}
