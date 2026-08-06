"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Home,
  LayoutDashboard,
  Mail,
  MapPin,
  Package,
  ShoppingBag,
  UsersRound,
} from "lucide-react";
import adminNotFoundHero from "@/common/assets/images/admin-not-found-hero.png";
import adminNotFoundSupport from "@/common/assets/images/admin-not-found-support.png";
import { routes } from "@/common/utils/constant";

const QUICK_LINKS = [
  {
    href: routes.ADMIN_HOME,
    title: "Về Dashboard",
    description: "Xem tổng quan thống kê",
    icon: LayoutDashboard,
  },
  {
    href: routes.ORDERS,
    title: "Đơn hàng",
    description: "Quản lý và theo dõi đơn mới nhất",
    icon: ShoppingBag,
  },
  {
    href: routes.PRODUCTS,
    title: "Sản phẩm",
    description: "Thêm, sửa và quản lý sản phẩm",
    icon: Package,
  },
  {
    href: routes.CUSTOMERS,
    title: "Khách hàng",
    description: "Xem và quản lý thông tin khách",
    icon: UsersRound,
  },
] as const;

export function AdminNotFound() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(routes.ADMIN_HOME);
  };

  return (
    <main className="fixed inset-0 z-[100] overflow-y-auto bg-[linear-gradient(180deg,#fff7f0_0%,#ffffff_48%,#fff4ea_100%)] text-[#2b2118]">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#ff8a3d]/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-[#ffb067]/18 blur-3xl" />

      <div className="relative mx-auto flex min-h-full w-full max-w-6xl flex-col px-5 py-5 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between gap-4">
          <Link
            className="flex items-center gap-3 transition hover:opacity-90"
            href={routes.ADMIN_HOME}
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff7a1a] text-white shadow-[0_10px_22px_rgba(255,122,26,0.32)]">
              <MapPin aria-hidden="true" className="h-5 w-5" strokeWidth={2.4} />
              <span className="absolute text-[11px] font-black leading-none">
                C
              </span>
            </span>
            <span>
              <span className="block text-base font-black tracking-tight text-[#241910]">
                Chenow{" "}
                <span className="text-[#ff7a1a]">Admin</span>
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              aria-label="Thông báo"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f0ddd0] bg-white text-[#8a7464] shadow-sm"
              type="button"
            >
              <Bell aria-hidden="true" className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 rounded-full border border-[#f0ddd0] bg-white py-1 pl-1 pr-3 shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff7a1a] text-xs font-black text-white">
                A
              </span>
              <span className="text-sm font-bold text-[#241910]">Admin</span>
            </div>
          </div>
        </header>

        <section className="mt-8 grid flex-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)] lg:gap-10">
          <div className="max-w-xl">
            <p className="text-7xl font-black leading-none tracking-tight text-[#ff7a1a] sm:text-8xl">
              404
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-[#241910] sm:text-[40px]">
              Không tìm thấy trang
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#7d6a5c] sm:text-base">
              Trang bạn đang tìm kiếm có thể đã bị di chuyển, đổi tên hoặc không
              còn tồn tại.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#ff7a1a] px-6 text-sm font-bold text-white shadow-[0_12px_28px_rgba(255,122,26,0.32)] transition hover:bg-[#ef6c0d]"
                href={routes.ADMIN_HOME}
              >
                <Home aria-hidden="true" className="h-4 w-4" />
                Về Dashboard
              </Link>
              <button
                className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-[#ff7a1a] bg-white px-5 text-sm font-bold text-[#ff7a1a] transition hover:bg-[#fff4ea]"
                onClick={handleBack}
                type="button"
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Quay lại trang trước
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[420px]">
            <Image
              alt="Admin đang tìm trang bị mất"
              className="h-auto w-full drop-shadow-[0_24px_40px_rgba(120,60,20,0.16)]"
              priority
              sizes="(min-width: 1024px) 420px, 90vw"
              src={adminNotFoundHero}
            />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-base font-black text-[#241910]">
            Bạn có thể thử
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {QUICK_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  className="group flex items-center gap-3 rounded-2xl border border-[#f0ddd0] bg-white p-4 shadow-[0_10px_24px_rgba(120,60,20,0.06)] transition hover:-translate-y-0.5 hover:border-[#ffc089] hover:shadow-[0_14px_28px_rgba(255,122,26,0.12)]"
                  href={item.href}
                  key={item.href}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff1e4] text-[#ff7a1a]">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black text-[#241910]">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-[#8a7464]">
                      {item.description}
                    </span>
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ff7a1a] text-white transition group-hover:bg-[#ef6c0d]">
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-8 flex flex-col items-center gap-4 rounded-[28px] border border-[#ffe2c8] bg-white/90 px-5 py-5 shadow-[0_14px_32px_rgba(120,60,20,0.07)] sm:flex-row sm:px-6">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white bg-[#fff1e4] shadow-[0_10px_22px_rgba(255,122,26,0.18)]">
            <Image
              alt="Hỗ trợ Chenow Admin"
              className="object-cover object-top"
              fill
              sizes="80px"
              src={adminNotFoundSupport}
            />
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="text-sm font-black text-[#241910]">Bạn cần hỗ trợ?</p>
            <p className="mt-1 text-sm leading-6 text-[#7d6a5c]">
              Nếu bạn nghĩ đây là lỗi, vui lòng liên hệ với quản trị viên hệ
              thống.
            </p>
          </div>
          <Link
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#ff7a1a] px-5 text-sm font-bold text-white shadow-[0_10px_22px_rgba(255,122,26,0.28)] transition hover:bg-[#ef6c0d]"
            href={routes.CHAT}
          >
            <Mail aria-hidden="true" className="h-4 w-4" />
            Liên hệ hỗ trợ
          </Link>
        </section>

        <footer className="mt-8 pb-4 text-center text-xs text-[#9a8575]">
          © {new Date().getFullYear()} Chenow Admin. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
