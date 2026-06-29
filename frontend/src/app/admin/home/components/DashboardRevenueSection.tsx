"use client";

import { Box, Button } from "@/components";
import { useDashboardRevenueQuery } from "@/services/controllers/dashboard/DashboardQueries";
import type { DashboardRevenuePoint } from "@/services/types/apiType";
import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { AlertCircle, RefreshCw, TrendingUp } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";

import { formatCurrency, formatFullCurrency } from "./dashboardFormat";
import { PeriodNavigator, toDateString } from "./PeriodNavigator";

type RevenueRange = "week" | "month" | "year";

const rangeOptions: Array<{
  label: string;
  value: RevenueRange;
}> = [
  { label: "Tuần", value: "week" },
  { label: "Tháng", value: "month" },
  { label: "Năm", value: "year" },
];

const rangeDescriptions: Record<RevenueRange, string> = {
  month: "Theo từng ngày trong tháng",
  week: "Theo từng ngày trong tuần",
  year: "Theo từng tháng trong năm",
};

export function DashboardRevenueSection() {
  const [range, setRange] = useState<RevenueRange>("week");
  const [anchorDate, setAnchorDate] = useState<Date>(new Date());

  const dateParam = toDateString(anchorDate);
  const { data, isError, isFetching, isLoading, refetch } =
    useDashboardRevenueQuery(range, dateParam);

  const points = useMemo(
    () => normalizeRevenuePoints(data?.points ?? []),
    [data?.points],
  );

  function handleRangeChange(value: RevenueRange) {
    setRange(value);
    setAnchorDate(new Date());
  }

  return (
    <Box className="rounded-md border border-[#eadfd4] bg-white p-4 shadow-sm">
      <Box className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <Box className="min-w-0">
          <Box className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-[#211812]">Doanh thu</p>
            {isFetching && !isLoading ? (
              <span className="inline-flex h-5 items-center rounded-full bg-[#fff6ed] px-2 text-[10px] font-bold text-[#a85b26]">
                Đang cập nhật
              </span>
            ) : null}
          </Box>
          <p className="mt-1 text-[11px] font-semibold text-[#8a7867]">
            {rangeDescriptions[range]}
          </p>
        </Box>

        <Box className="flex flex-col gap-2 sm:items-end">
          <PeriodNavigator
            anchorDate={anchorDate}
            onChange={setAnchorDate}
            range={range}
          />
          <Box className="flex w-fit rounded-full bg-[#fffaf5] p-1 text-[10px] font-bold ring-1 ring-[#eadfd4]">
            {rangeOptions.map((option) => {
              const active = range === option.value;

              return (
                <Button
                  aria-pressed={active}
                  className={[
                    "h-7 rounded-full px-3 py-0 text-[10px] shadow-none",
                    active
                      ? "bg-[#432010] text-white hover:bg-[#432010]"
                      : "bg-transparent text-[#5f5148] hover:bg-[#fff1e7]",
                  ].join(" ")}
                  key={option.value}
                  onClick={() => handleRangeChange(option.value)}
                  variant="text"
                >
                  {option.label}
                </Button>
              );
            })}
          </Box>
        </Box>
      </Box>

      {isError ? (
        <RevenueError onRetry={() => void refetch()} />
      ) : (
        <RevenueChart
          anchorDate={anchorDate}
          isLoading={isLoading}
          points={points}
          range={range}
        />
      )}
    </Box>
  );
}

function RevenueChart({
  anchorDate,
  isLoading,
  points,
  range,
}: {
  anchorDate: Date;
  isLoading: boolean;
  points: DashboardRevenuePoint[];
  range: RevenueRange;
}) {
  const displayPoints = points.length
    ? points
    : buildPlaceholderPoints(range, anchorDate);
  const hasRevenue = displayPoints.some((item) => item.revenue > 0);
  const totalRevenue = displayPoints.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );
  const bestPoint = displayPoints.reduce<DashboardRevenuePoint | null>(
    (best, item) => (!best || item.revenue > best.revenue ? item : best),
    null,
  );
  const maxRevenue = Math.max(...displayPoints.map((item) => item.revenue), 0);
  const yAxisMax = hasRevenue ? Math.ceil(maxRevenue * 1.18) : 100_000;
  const chartOption = useMemo(
    () => buildRevenueChartOption(displayPoints, range, yAxisMax),
    [displayPoints, range, yAxisMax],
  );

  if (isLoading) {
    return <RevenueSkeleton />;
  }

  return (
    <Box>
      <Box className="mb-4 grid gap-3 sm:grid-cols-2">
        <RevenueMetric
          label="Tổng doanh thu"
          value={formatFullCurrency(totalRevenue)}
        />
        <RevenueMetric
          icon={<TrendingUp aria-hidden="true" className="h-3.5 w-3.5" />}
          label="Cao nhất"
          value={
            bestPoint && bestPoint.revenue > 0
              ? `${formatFullCurrency(bestPoint.revenue)} · ${bestPoint.label}`
              : "Chưa có dữ liệu"
          }
        />
      </Box>

      <Box className="relative h-[260px] w-full">
        <ReactECharts
          lazyUpdate
          notMerge
          option={chartOption}
          style={{ height: "100%", width: "100%" }}
        />

        {!hasRevenue ? (
          <Box className="absolute inset-0 flex items-center justify-center rounded bg-white/75 px-4 text-center backdrop-blur-[1px]">
            <span className="max-w-[220px] text-xs font-semibold text-[#7d6b5d]">
              Chưa có doanh thu hoàn thành trong khoảng thời gian này.
            </span>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

function RevenueMetric({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box className="rounded-md border border-[#f0e4da] bg-[#fffaf5] px-3 py-2">
      <Box className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#9b806a]">
        {icon}
        <span>{label}</span>
      </Box>
      <p className="truncate text-sm font-extrabold text-[#211812]" title={value}>
        {value}
      </p>
    </Box>
  );
}

function RevenueError({ onRetry }: { onRetry: () => void }) {
  return (
    <Box className="flex min-h-[260px] flex-col items-center justify-center rounded-md border border-dashed border-[#f0c8c5] bg-[#fff7f5] px-4 text-center">
      <AlertCircle aria-hidden="true" className="mb-2 h-5 w-5 text-[#b12f1d]" />
      <p className="text-sm font-bold text-[#5c2b20]">
        Không thể tải dữ liệu doanh thu.
      </p>
      <p className="mt-1 max-w-[260px] text-xs font-semibold text-[#9a6a5f]">
        Kiểm tra kết nối hoặc thử tải lại biểu đồ.
      </p>
      <Button
        className="mt-3 h-8 rounded-md px-3 text-xs"
        onClick={onRetry}
        variant="delete"
      >
        <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
        Thử lại
      </Button>
    </Box>
  );
}

function RevenueSkeleton() {
  return (
    <Box>
      <Box className="mb-4 grid gap-3 sm:grid-cols-2">
        <Box className="h-[58px] animate-pulse rounded-md bg-[#fff3e8]" />
        <Box className="h-[58px] animate-pulse rounded-md bg-[#fff3e8]" />
      </Box>
      <Box className="flex h-[260px] items-end gap-2 rounded-md border border-[#f0e4da] bg-[#fffaf5] p-4">
        {Array.from({ length: 12 }, (_, index) => (
          <span
            className="flex-1 animate-pulse rounded-t bg-[#ead5c1]"
            key={index}
            style={{ height: `${28 + ((index * 17) % 58)}%` }}
          />
        ))}
      </Box>
    </Box>
  );
}

function buildRevenueChartOption(
  points: DashboardRevenuePoint[],
  range: RevenueRange,
  yAxisMax: number,
): EChartsOption {
  const labels = points.map((point) => point.label);
  const values = points.map((point) => point.revenue);

  return {
    animationDuration: 450,
    color: ["#c75f2a", "#8f3109"],
    grid: {
      bottom: 24,
      containLabel: true,
      left: 4,
      right: 12,
      top: 16,
    },
    tooltip: {
      axisPointer: {
        lineStyle: { color: "#e5cbb6" },
        type: "line",
      },
      backgroundColor: "#183d2b",
      borderColor: "#123b29",
      borderWidth: 1,
      className: "chenow-echart-tooltip",
      confine: true,
      formatter: (params: unknown) => formatTooltip(params, points),
      padding: [8, 10],
      textStyle: {
        color: "#fff",
        fontSize: 11,
        fontWeight: 700,
      },
      trigger: "axis",
    },
    xAxis: {
      axisLabel: {
        color: "#7c7067",
        fontSize: 10,
        fontWeight: 700,
        hideOverlap: true,
        interval: getXAxisInterval(range, points.length),
      },
      axisLine: { lineStyle: { color: "#eadfd4" } },
      axisTick: { show: false },
      data: labels,
      type: "category",
    },
    yAxis: {
      axisLabel: {
        color: "#7c7067",
        formatter: (value: number) => formatCurrency(value),
        fontSize: 10,
        fontWeight: 700,
      },
      max: yAxisMax,
      min: 0,
      splitLine: {
        lineStyle: {
          color: "#f0e4da",
          type: "dashed",
        },
      },
      type: "value",
    },
    series: [
      {
        barMaxWidth: 34,
        data: values,
        emphasis: {
          itemStyle: {
            color: "#b44b17",
          },
        },
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: {
            colorStops: [
              { color: "#c75f2a", offset: 0 },
              { color: "#f1c49a", offset: 1 },
            ],
            x: 0,
            x2: 0,
            y: 0,
            y2: 1,
          },
        },
        name: "Doanh thu",
        type: "bar",
      },
      {
        data: values,
        lineStyle: {
          color: "#8f3109",
          width: 2,
        },
        name: "Xu hướng",
        showSymbol: false,
        smooth: true,
        symbolSize: 7,
        type: "line",
      },
    ],
  };
}

function formatTooltip(params: unknown, points: DashboardRevenuePoint[]) {
  const item = Array.isArray(params) ? params[0] : params;
  const dataIndex =
    typeof item === "object" && item && "dataIndex" in item
      ? Number((item as { dataIndex?: number }).dataIndex)
      : 0;
  const point = points[dataIndex];

  if (!point) {
    return "";
  }

  return [
    `<div style="font-size:9px;color:#efbd8f;text-transform:uppercase;margin-bottom:4px;">${escapeHtml(point.label)}</div>`,
    `<div style="font-size:12px;color:#fff;">${escapeHtml(formatFullCurrency(point.revenue))}</div>`,
  ].join("");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeRevenuePoints(
  points: DashboardRevenuePoint[],
): DashboardRevenuePoint[] {
  return points.map((point) => ({
    ...point,
    revenue: Math.max(Number(point.revenue) || 0, 0),
  }));
}

function buildPlaceholderPoints(range: RevenueRange, anchorDate: Date) {
  if (range === "year") {
    return Array.from({ length: 12 }, (_, index) => ({
      date: `${anchorDate.getFullYear()}-${String(index + 1).padStart(2, "0")}`,
      label: `T${index + 1}`,
      revenue: 0,
    }));
  }

  const startDate =
    range === "month"
      ? new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1)
      : startOfWeekMonday(anchorDate);
  const pointCount =
    range === "month"
      ? new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 0).getDate()
      : 7;

  return Array.from({ length: pointCount }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    return {
      date: toDateString(date),
      label: formatDateLabel(date),
      revenue: 0,
    };
  });
}

function getXAxisInterval(range: RevenueRange, pointCount: number) {
  if (range === "week" || pointCount <= 8) {
    return 0;
  }

  if (range === "year") {
    return 0;
  }

  return Math.ceil(pointCount / 8);
}

function formatDateLabel(date: Date) {
  const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return `${weekdays[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}`;
}

function startOfWeekMonday(date: Date): Date {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  const day = nextDate.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  nextDate.setDate(nextDate.getDate() + offset);
  return nextDate;
}
