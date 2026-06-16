import type { OrderStatus } from "@/services/types/apiType";
import {
  Check,
  Clock3,
  PackageCheck,
  ShieldCheck,
  Truck,
  X,
  type LucideIcon,
} from "lucide-react";

export const statusMeta: Record<
  OrderStatus,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    icon: LucideIcon;
    description: string;
  }
> = {
  pending: {
    label: "Pending",
    badgeClass: "border-[#efd69b] bg-[#fff8df] text-[#8a6418]",
    dotClass: "bg-[#c99545]",
    icon: Clock3,
    description: "Order has been created",
  },
  confirmed: {
    label: "Confirmed",
    badgeClass: "border-[#cbdccf] bg-[#eef7ef] text-[#315d3b]",
    dotClass: "bg-[#527b59]",
    icon: ShieldCheck,
    description: "Order confirmation",
  },
  preparing: {
    label: "Preparing",
    badgeClass: "border-[#eac7aa] bg-[#fff3e8] text-[#9b4b16]",
    dotClass: "bg-[#d17345]",
    icon: PackageCheck,
    description: "Preparing products",
  },
  ready: {
    label: "Ready",
    badgeClass: "border-[#d8cbbf] bg-[#f5eee7] text-[#6b5a49]",
    dotClass: "bg-[#8a6a50]",
    icon: Truck,
    description: "Ready for pickup or delivery",
  },
  completed: {
    label: "Completed",
    badgeClass: "border-[#b8d2bc] bg-[#eef7ef] text-[#315d3b]",
    dotClass: "bg-[#315d3b]",
    icon: Check,
    description: "Completed",
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "border-[#f0c8c5] bg-[#fff2ef] text-[#b12f1d]",
    dotClass: "bg-[#b12f1d]",
    icon: X,
    description: "Cancelled",
  },
};

export const statusTabs: Array<{ label: string; value: OrderStatus | "all" }> =
  [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Preparing", value: "preparing" },
    { label: "Ready", value: "ready" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

export const timeline: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
];
