"use client";

import { Box } from "@/components";
import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { useMemo } from "react";
import type { ReportRevenuePoint, ReportRevenueRange } from "../types";
import { formatCurrency, formatFullCurrency } from "./reportFormat";

interface Props {
  points: ReportRevenuePoint[];
  range: ReportRevenueRange;
}

export function ReportRevenueChart({ points, range }: Props) {
  const hasRevenue = points.some((p) => p.revenue > 0);
  const maxRevenue = Math.max(...points.map((p) => p.revenue), 0);
  const yAxisMax = hasRevenue ? Math.ceil(maxRevenue * 1.18) : 100_000;

  const option = useMemo(
    () => buildChartOption(points, range, yAxisMax),
    [points, range, yAxisMax],
  );

  return (
    <Box className="relative h-[280px] w-full">
      <ReactECharts
        lazyUpdate
        notMerge
        option={option}
        style={{ height: "100%", width: "100%" }}
      />
      {!hasRevenue ? (
        <Box className="absolute inset-0 flex items-center justify-center rounded bg-white/80 px-4 text-center backdrop-blur-[1px]">
          <span className="max-w-[240px] text-xs font-semibold text-[#7d6b5d]">
            Chưa có doanh thu trong khoảng thời gian này.
          </span>
        </Box>
      ) : null}
    </Box>
  );
}

function buildChartOption(
  points: ReportRevenuePoint[],
  _range: ReportRevenueRange,
  yAxisMax: number,
): EChartsOption {
  const labels = points.map((p) => p.label);
  const revenues = points.map((p) => p.revenue);
  const orders = points.map((p) => p.orderCount);

  return {
    animationDuration: 450,
    grid: {
      bottom: 24,
      containLabel: true,
      left: 4,
      right: 12,
      top: 16,
    },
    legend: {
      data: ["Doanh thu", "Số đơn"],
      right: 0,
      top: 0,
      textStyle: { color: "#7c7067", fontSize: 10, fontWeight: 700 },
    },
    tooltip: {
      axisPointer: {
        lineStyle: { color: "#e5cbb6" },
        type: "line",
      },
      backgroundColor: "#183d2b",
      borderColor: "#123b29",
      borderWidth: 1,
      confine: true,
      formatter: (params: unknown) => {
        const arr = Array.isArray(params) ? params : [params];
        const idx =
          typeof arr[0] === "object" && arr[0] && "dataIndex" in arr[0]
            ? Number((arr[0] as { dataIndex?: number }).dataIndex)
            : 0;
        const point = points[idx];
        if (!point) return "";
        return [
          `<div style="font-size:9px;color:#efbd8f;text-transform:uppercase;margin-bottom:4px;">${point.label}</div>`,
          `<div style="font-size:12px;color:#fff;">💰 ${formatFullCurrency(point.revenue)}</div>`,
          `<div style="font-size:11px;color:#cde8d4;margin-top:2px;">📦 ${point.orderCount} đơn</div>`,
        ].join("");
      },
      padding: [8, 10],
      textStyle: { color: "#fff", fontSize: 11, fontWeight: 700 },
      trigger: "axis",
    },
    xAxis: {
      axisLabel: {
        color: "#7c7067",
        fontSize: 10,
        fontWeight: 700,
        hideOverlap: true,
        interval: labels.length > 8 ? Math.ceil(labels.length / 8) : 0,
      },
      axisLine: { lineStyle: { color: "#eadfd4" } },
      axisTick: { show: false },
      data: labels,
      type: "category",
    },
    yAxis: [
      {
        axisLabel: {
          color: "#7c7067",
          formatter: (v: number) => formatCurrency(v),
          fontSize: 10,
          fontWeight: 700,
        },
        max: yAxisMax,
        min: 0,
        splitLine: { lineStyle: { color: "#f0e4da", type: "dashed" } },
        type: "value",
      },
      {
        axisLabel: {
          color: "#9b9b9b",
          fontSize: 10,
        },
        min: 0,
        splitLine: { show: false },
        type: "value",
      },
    ],
    series: [
      {
        barMaxWidth: 34,
        data: revenues,
        emphasis: { itemStyle: { color: "#b44b17" } },
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
        yAxisIndex: 0,
      },
      {
        data: orders,
        lineStyle: { color: "#315d3b", width: 2 },
        name: "Số đơn",
        showSymbol: false,
        smooth: true,
        symbolSize: 6,
        type: "line",
        yAxisIndex: 1,
        itemStyle: { color: "#315d3b" },
      },
    ],
  };
}
