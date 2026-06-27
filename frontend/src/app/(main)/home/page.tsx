"use client";

import { Box, PageHeader } from "@/components";
import { MainHeader } from "@/components/Header/MainHeader";

import { DashboardRecentOrders } from "./components/DashboardRecentOrders";
import { DashboardRevenueSection } from "./components/DashboardRevenueSection";
import { DashboardSummaryCards } from "./components/DashboardSummaryCards";
import { DashboardTopProducts } from "./components/DashboardTopProducts";

export default function Home() {

  return (
    <Box className="flex min-h-full flex-col">
      <PageHeader />

      <Box className="flex-1 px-4 py-5 sm:px-6 md:px-8 lg:px-10">
        <Box className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Box>
            <p className="text-xs font-semibold text-[#4b3b31]">
              Tong quan kinh doanh hom nay
            </p>
            {/* {isError ? (
              <p className="mt-1 text-xs font-semibold text-[#b12f1d]">
                Khong the tai du lieu thong ke.
              </p>
            ) : null} */}
          </Box>
          {/* <Box className="flex w-fit rounded-full bg-white p-1 text-[10px] font-semibold shadow-sm ring-1 ring-[#eadfd4]">
            {["Hom nay", "7 ngay", "Thang nay"].map((item, index) => (
              <button
                className={[
                  "rounded-full px-3 py-1 transition",
                  index === 0
                    ? "bg-[#123b29] text-white"
                    : "text-[#5f5148] hover:bg-[#fff1e7]",
                ].join(" ")}
                key={item}
                type="button"
              >
                {item}
              </button>
            ))}
          </Box> */}
        </Box>

        <DashboardSummaryCards />

        <Box className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <DashboardRevenueSection />
          <DashboardTopProducts />
        </Box>

        <DashboardRecentOrders />
      </Box>
    </Box>
  );
}
