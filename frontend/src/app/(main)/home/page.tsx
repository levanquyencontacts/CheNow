import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ShoppingBag,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { Box, Button } from "@/components";
import { MainHeader } from "@/components/Header/MainHeader";

const stats = [
  {
    title: "Doanh thu",
    value: "18.4tr",
    note: "+12.5% so với hôm trước",
    icon: WalletCards,
    tone: "orange",
    trend: "up",
  },
  {
    title: "Đơn hàng",
    value: "342",
    note: "+8.2% so với hôm trước",
    icon: ShoppingBag,
    tone: "green",
    trend: "up",
  },
  {
    title: "Khách hàng mới",
    value: "47",
    note: "+25.0% so với hôm trước",
    icon: UsersRound,
    tone: "blue",
    trend: "up",
  },
  {
    title: "Hủy đơn",
    value: "6",
    note: "-2.0% so với hôm trước",
    icon: Clock3,
    tone: "rose",
    trend: "down",
  },
];

const revenueBars = [52000, 72, 64, 84, 91, 78, 96];
const products = [
  { name: "Trà sữa trân châu đen", sold: "32tr", rank: 1 },
  { name: "Matcha latte", sold: "27tr", rank: 2 },
  { name: "Trà sữa khoai môn", sold: "21tr", rank: 3 },
  { name: "Chè thái dừa Tây", sold: "18tr", rank: 4 },
  { name: "Chè bắp nước dừa Tây", sold: "14tr", rank: 5 },
];
const orders = [
  {
    id: "FCN-1612",
    customer: "Trần Minh Anh",
    item: "Trà sữa trân châu",
    status: "Đã hoàn thành",
    time: "14:02",
    total: "92K",
  },
  {
    id: "FCN-1611",
    customer: "Khôi Nguyễn",
    item: "Matcha latte",
    status: "Đang giao",
    time: "14:09",
    total: "89K",
  },
  {
    id: "FCN-1610",
    customer: "Mai Hương",
    item: "Chè thái",
    status: "Đã hoàn thành",
    time: "14:15",
    total: "64K",
  },
  {
    id: "FCN-1609",
    customer: "Trần Bảo",
    item: "Sữa chua nếp cẩm",
    status: "Chờ xác nhận",
    time: "14:20",
    total: "48K",
  },
  {
    id: "FCN-1608",
    customer: "Châu Anh",
    item: "Chè đậu xanh",
    status: "Đã hoàn thành",
    time: "14:25",
    total: "55K",
  },
];

const toneClass: Record<string, string> = {
  orange: "bg-[#fff1e7] text-[#d17345]",
  green: "bg-[#ecf8e7] text-[#3f8c45]",
  blue: "bg-[#edf4ff] text-[#3f6eb3]",
  rose: "bg-[#fff0f0] text-[#c94b4b]",
};

const statusClass: Record<string, string> = {
  "Đã hoàn thành": "bg-[#e8f7de] text-[#3f8c45]",
  "Đang giao": "bg-[#eaf3ff] text-[#4277c3]",
  "Chờ xác nhận": "bg-[#fff4dc] text-[#ae7a1c]",
};

export default function Home() {
  return (
    <Box className="flex min-h-full flex-col">
      <MainHeader />

      <Box className="flex-1 px-4 py-5 sm:px-6 md:px-8 lg:px-10">
        <Box className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Box>
            <p className="text-xs font-semibold text-[#4b3b31]">
              Thứ Tư, 10 tháng 6 năm 2026
            </p>
          </Box>
          <Box className="flex w-fit rounded-full bg-white p-1 text-[10px] font-semibold shadow-sm ring-1 ring-[#eadfd4]">
            {["Hôm nay", "Tuần này", "Tháng này"].map((item, index) => (
              <button
                className={[
                  "rounded-full px-3 py-1 transition",
                  index === 1
                    ? "bg-[#123b29] text-white"
                    : "text-[#5f5148] hover:bg-[#fff1e7]",
                ].join(" ")}
                key={item}
                type="button"
              >
                {item}
              </button>
            ))}
          </Box>
        </Box>

        <Box className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const TrendIcon =
              stat.trend === "up" ? ArrowUpRight : ArrowDownRight;

            return (
              <Box
                className="rounded-md border border-[#eadfd4] bg-white p-4 shadow-sm"
                key={stat.title}
              >
                <Box className="mb-3 flex items-start justify-between">
                  <p className="text-[11px] font-bold text-[#2d221b]">
                    {stat.title}
                  </p>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-md ${toneClass[stat.tone]}`}
                  >
                    <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                  </span>
                </Box>
                <p className="text-2xl font-extrabold leading-none text-[#1f1814]">
                  {stat.value}
                </p>
                <p
                  className={`mt-2 flex items-center gap-1 text-[10px] font-semibold ${
                    stat.trend === "up" ? "text-[#3f8c45]" : "text-[#b12f1d]"
                  }`}
                >
                  <TrendIcon aria-hidden="true" className="h-3 w-3" />
                  {stat.note}
                </p>
              </Box>
            );
          })}
        </Box>

        <Box className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <Box className="rounded-md border border-[#eadfd4] bg-white p-4 shadow-sm">
            <Box className="mb-4 flex items-center justify-between">
              <Box>
                <p className="text-sm font-bold text-[#211812]">
                  Doanh thu theo ngày
                </p>
              </Box>
              <button className="text-[10px] font-bold text-[#d17345]">
                Xem chi tiết
              </button>
            </Box>
            <Box className="flex h-36 items-end gap-3 border-b border-[#eadfd4] px-2">
              {revenueBars.map((height, index) => (
                <Box
                  className="flex flex-1 flex-col items-center gap-2"
                  key={height}
                >
                  <span
                    className="block min-h-2 w-full max-w-5 rounded-t bg-[#efbd8f]"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[9px] text-[#7c7067]">
                    T{index + 2}
                  </span>
                </Box>
              ))}
            </Box>
          </Box>

          <Box className="rounded-md border border-[#eadfd4] bg-white p-4 shadow-sm">
            <Box className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-[#211812]">Top sản phẩm</p>
              <button className="text-[10px] font-bold text-[#d17345]">
                Tất cả
              </button>
            </Box>
            <Box className="space-y-3">
              {products.map((product) => (
                <Box className="flex items-center gap-3" key={product.rank}>
                  <span
                    className={[
                      "flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-white",
                      product.rank === 1
                        ? "bg-[#f07a2f]"
                        : product.rank === 2
                          ? "bg-[#d7d7d7]"
                          : product.rank === 3
                            ? "bg-[#9c67d9]"
                            : "bg-[#efc645]",
                    ].join(" ")}
                  >
                    {product.rank}
                  </span>
                  <Box className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-[#211812]">
                      {product.name}
                    </p>
                    <p className="text-[10px] text-[#8a7867]">Bán chạy</p>
                  </Box>
                  <p className="text-xs font-bold text-[#211812]">
                    {product.sold}
                  </p>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box className="mt-4 rounded-md border border-[#eadfd4] bg-white p-4 shadow-sm">
          <Box className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-[#211812]">Đơn hàng gần đây</p>
            <button className="text-[10px] font-bold text-[#d17345]">
              Xem tất cả
            </button>
          </Box>
          <Box className="mb-3 flex flex-wrap gap-2 text-[10px] font-bold">
            {[
              "Tất cả (342)",
              "Đang làm (12)",
              "Hoàn thành (286)",
              "Đã hủy (6)",
            ].map((item, index) => (
              <button
                className={[
                  "rounded-full border px-3 py-1",
                  index === 0
                    ? "border-[#432010] bg-[#432010] text-white"
                    : "border-[#eadfd4] text-[#5f5148]",
                ].join(" ")}
                key={item}
                type="button"
              >
                {item}
              </button>
            ))}
          </Box>
          <Box className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#eadfd4] text-[10px] uppercase text-[#8a7867]">
                  <th className="py-3 font-bold">Mã đơn</th>
                  <th className="py-3 font-bold">Khách hàng / Món</th>
                  <th className="py-3 font-bold">Trạng thái</th>
                  <th className="py-3 font-bold">Thời gian</th>
                  <th className="py-3 text-right font-bold">Tổng</th>
                  <th className="py-3 text-right font-bold" />
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    className="border-b border-[#eadfd4] last:border-b-0"
                    key={order.id}
                  >
                    <td className="py-3 text-xs font-bold text-[#6b5f56]">
                      {order.id}
                    </td>
                    <td className="py-3">
                      <p className="text-xs font-bold text-[#211812]">
                        {order.customer}
                      </p>
                      <p className="text-[10px] text-[#8a7867]">{order.item}</p>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${statusClass[order.status]}`}
                      >
                        <CheckCircle2 aria-hidden="true" className="h-3 w-3" />
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-[#4f463f]">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays aria-hidden="true" className="h-3 w-3" />
                        {order.time}
                      </span>
                    </td>
                    <td className="py-3 text-right text-xs font-bold text-[#211812]">
                      {order.total}
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        className="h-8 rounded-sm px-3 text-[10px]"
                        size="small"
                        variant="outlined"
                      >
                        Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
