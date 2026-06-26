"use client";

import { Box, Button, PageHeader } from "@/components";
import {
  BadgePercent,
  CalendarDays,
  CirclePlus,
  Clock3,
  Gift,
  MoreHorizontal,
  TicketPercent,
  TrendingUp,
  UsersRound,
} from "lucide-react";

const summaryCards = [
  {
    label: "Active campaigns",
    value: "8",
    note: "+2 this week",
    icon: BadgePercent,
  },
  {
    label: "Coupon redemptions",
    value: "1,248",
    note: "18.4% conversion",
    icon: TicketPercent,
  },
  {
    label: "Promo revenue",
    value: "$12.8k",
    note: "+9.2% vs last month",
    icon: TrendingUp,
  },
  {
    label: "New customers",
    value: "326",
    note: "From welcome offers",
    icon: UsersRound,
  },
];

const campaigns = [
  {
    name: "Summer Milk Tea Combo",
    channel: "App banner",
    status: "Active",
    period: "Jun 20 - Jun 30",
    usage: "428 / 700",
    budget: "$1,200",
  },
  {
    name: "Buy 2 Get 1 Topping",
    channel: "POS checkout",
    status: "Scheduled",
    period: "Jul 01 - Jul 07",
    usage: "0 / 500",
    budget: "$860",
  },
  {
    name: "Loyalty Weekend",
    channel: "Member push",
    status: "Active",
    period: "Jun 22 - Jun 28",
    usage: "612 / 900",
    budget: "$1,640",
  },
  {
    name: "First Order Treat",
    channel: "New users",
    status: "Paused",
    period: "Jun 01 - Jul 15",
    usage: "208 / 1,000",
    budget: "$950",
  },
];

const statusStyles: Record<string, string> = {
  Active: "bg-[#e8f4ed] text-[#1f6a43]",
  Scheduled: "bg-[#fff1dc] text-[#9a5a15]",
  Paused: "bg-[#f4e7e2] text-[#904638]",
};

export default function PromotionsPage() {
  return (
    <>
      <PageHeader title="Promotions" searchPlaceholder="Search campaigns..." />

      <Box className="bg-[#fff8f1] px-4 py-4 text-[#143d2a] sm:px-6 lg:px-8">
        <Box className="mx-auto flex w-full max-w-7xl flex-col gap-4">
          <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Box>
              <h1 className="text-2xl font-semibold tracking-normal text-[#183d2b]">
                Promotions
              </h1>
              <p className="mt-0.5 text-xs text-[#4d5b4f]">
                Plan offers, track redemptions, and review campaign performance.
              </p>
            </Box>

            <Button className="h-9 w-fit rounded-md bg-[#183d2b] px-4 text-xs font-semibold text-white shadow-[0_6px_12px_rgba(24,61,43,0.14)] hover:bg-[#102f21]">
              <CirclePlus aria-hidden="true" className="h-3.5 w-3.5" />
              New Promotion
            </Button>
          </Box>

          <Box className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map(({ icon: Icon, label, note, value }) => (
              <Box
                className="rounded-lg border border-[#eadfd4] bg-white/90 p-4 shadow-[0_12px_26px_rgba(55,36,20,0.05)]"
                key={label}
              >
                <Box className="flex items-start justify-between gap-3">
                  <Box>
                    <p className="text-xs font-semibold text-[#6b5d52]">
                      {label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[#183d2b]">
                      {value}
                    </p>
                  </Box>
                  <Box className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#f5e8dc] text-[#a45d32]">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </Box>
                </Box>
                <p className="mt-3 text-xs font-medium text-[#4d5b4f]">
                  {note}
                </p>
              </Box>
            ))}
          </Box>

          <Box className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
            <Box className="overflow-hidden rounded-lg border border-[#eadfd4] bg-white/90 shadow-[0_16px_34px_rgba(55,36,20,0.06)]">
              <Box className="flex items-center justify-between border-b border-[#eadfd4] px-4 py-3">
                <Box>
                  <h2 className="text-sm font-semibold text-[#183d2b]">
                    Campaigns
                  </h2>
                  <p className="mt-0.5 text-xs text-[#6b5d52]">
                    Mock data for current promotional programs.
                  </p>
                </Box>
                <Button
                  aria-label="Campaign options"
                  className="h-8 w-8 rounded-md p-0 text-[#5d5448]"
                  variant="text"
                >
                  <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
                </Button>
              </Box>

              <Box className="overflow-x-auto">
                <table className="w-full min-w-180 table-fixed text-left text-sm">
                  <thead className="bg-[#fffaf5] text-xs font-semibold uppercase text-[#5c554c]">
                    <tr className="border-b border-[#eadfd4]">
                      <th className="w-[30%] px-4 py-3">Campaign</th>
                      <th className="w-[17%] px-4 py-3">Channel</th>
                      <th className="w-[15%] px-4 py-3">Status</th>
                      <th className="w-[18%] px-4 py-3">Period</th>
                      <th className="w-[12%] px-4 py-3">Usage</th>
                      <th className="w-[8%] px-4 py-3 text-right">Budget</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr
                        className="border-b border-[#eadfd4] bg-white/60 text-[#153c2a] transition last:border-b-0 hover:bg-[#fff8f1]"
                        key={campaign.name}
                      >
                        <td className="px-4 py-4 font-semibold">
                          {campaign.name}
                        </td>
                        <td className="px-4 py-4 text-[#4d5b4f]">
                          {campaign.channel}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={[
                              "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                              statusStyles[campaign.status],
                            ].join(" ")}
                          >
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-[#4d5b4f]">
                          {campaign.period}
                        </td>
                        <td className="px-4 py-4 text-[#4d5b4f]">
                          {campaign.usage}
                        </td>
                        <td className="px-4 py-4 text-right font-semibold">
                          {campaign.budget}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Box>

            <Box className="flex flex-col gap-4">
              <Box className="rounded-lg border border-[#eadfd4] bg-white/90 p-4 shadow-[0_16px_34px_rgba(55,36,20,0.06)]">
                <Box className="mb-4 flex items-center gap-3">
                  <Box className="flex h-10 w-10 items-center justify-center rounded-md bg-[#e8f4ed] text-[#1f6a43]">
                    <Gift aria-hidden="true" className="h-5 w-5" />
                  </Box>
                  <Box>
                    <h2 className="text-sm font-semibold text-[#183d2b]">
                      Best offer
                    </h2>
                    <p className="text-xs text-[#6b5d52]">
                      Highest redemption rate
                    </p>
                  </Box>
                </Box>
                <p className="text-xl font-semibold text-[#183d2b]">
                  Loyalty Weekend
                </p>
                <Box className="mt-4 h-2 overflow-hidden rounded-full bg-[#f1e4da]">
                  <Box className="h-full w-[68%] rounded-full bg-[#d17345]" />
                </Box>
                <p className="mt-2 text-xs font-medium text-[#4d5b4f]">
                  68% of available vouchers redeemed.
                </p>
              </Box>

              <Box className="rounded-lg border border-[#eadfd4] bg-white/90 p-4 shadow-[0_16px_34px_rgba(55,36,20,0.06)]">
                <h2 className="text-sm font-semibold text-[#183d2b]">
                  Upcoming tasks
                </h2>
                <Box className="mt-4 flex flex-col gap-3">
                  {[
                    {
                      icon: CalendarDays,
                      text: "Review July campaign calendar",
                    },
                    {
                      icon: Clock3,
                      text: "Schedule push notification at 10:00",
                    },
                    {
                      icon: TicketPercent,
                      text: "Publish new topping coupon",
                    },
                  ].map(({ icon: Icon, text }) => (
                    <Box className="flex items-center gap-3" key={text}>
                      <Box className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#fff1dc] text-[#9a5a15]">
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </Box>
                      <p className="text-xs font-semibold text-[#4d5b4f]">
                        {text}
                      </p>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
