"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Flame,
  Home,
  MapPin,
  Search,
  Star,
} from "lucide-react";
import notFoundHero from "@/common/assets/images/not-found-hero.png";
import notFoundMascot from "@/common/assets/images/not-found-mascot.png";
import { FEATURED_PRODUCTS } from "@/common/mocks/customerHome";
import { routes } from "@/common/utils/constant";

const SUGGESTIONS = FEATURED_PRODUCTS.slice(0, 3).map((product, index) => ({
  ...product,
  category:
    index === 0 ? "Trà sữa - Á" : index === 1 ? "Trà trái cây" : "Matcha - Nhật",
  eta: index === 0 ? "15–25 phút" : index === 1 ? "20–30 phút" : "10–20 phút",
}));

export function CustomerNotFound() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(routes.CUSTOMER_HOME);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fff7f0_0%,#ffffff_45%,#fff4ea_100%)] text-[#2b2118]">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#ff8a3d]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-24 h-80 w-80 rounded-full bg-[#ffb067]/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center gap-3">
          <Link
            className="flex items-center gap-3 transition hover:opacity-90"
            href={routes.CUSTOMER_HOME}
          >
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff7a1a] text-white shadow-[0_10px_24px_rgba(255,122,26,0.35)]">
              <MapPin aria-hidden="true" className="h-6 w-6" strokeWidth={2.4} />
              <span className="absolute text-[11px] font-black leading-none">
                C
              </span>
            </span>
            <span>
              <span className="block text-lg font-black tracking-tight text-[#ff7a1a]">
                Chenow
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b07a55]">
                Food Delivery
              </span>
            </span>
          </Link>
        </header>

        <section className="mt-8 grid flex-1 items-center gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:gap-12">
          <div className="max-w-xl">
            <p className="text-7xl font-black leading-none tracking-tight text-[#ff7a1a] sm:text-8xl">
              404
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-[#241910] sm:text-4xl">
              Oops! Không tìm thấy trang
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#7d6a5c] sm:text-base">
              Trang bạn đang tìm kiếm có thể đã bị di chuyển, đổi tên hoặc không
              còn tồn tại.
            </p>

            <div className="mt-7 space-y-3">
              <Link
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ff7a1a] px-6 text-sm font-bold text-white shadow-[0_12px_28px_rgba(255,122,26,0.32)] transition hover:bg-[#ef6c0d] sm:w-auto sm:min-w-[240px]"
                href={routes.CUSTOMER_HOME}
              >
                <Home aria-hidden="true" className="h-4 w-4" />
                Về trang chủ
              </Link>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-[#ff7a1a] bg-white px-5 text-sm font-bold text-[#ff7a1a] transition hover:bg-[#fff4ea]"
                  onClick={handleBack}
                  type="button"
                >
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  Quay lại
                </button>
                <Link
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[#ff7a1a] bg-white px-5 text-sm font-bold text-[#ff7a1a] transition hover:bg-[#fff4ea]"
                  href={routes.CUSTOMER_MENU}
                >
                  <Search aria-hidden="true" className="h-4 w-4" />
                  Khám phá món ngon
                </Link>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[440px]">
            <div className="absolute -left-4 top-10 h-20 w-20 rounded-full bg-[#ffd39a]/70 blur-md" />
            <div className="absolute -right-3 bottom-12 h-24 w-24 rounded-full bg-[#ff9a4a]/25 blur-md" />
            <Image
              alt="Nhân viên Chenow đang tìm đường giao hàng"
              className="relative h-auto w-full drop-shadow-[0_24px_40px_rgba(120,60,20,0.18)]"
              priority
              sizes="(min-width: 1024px) 440px, 90vw"
              src={notFoundHero}
            />
          </div>
        </section>

        <section className="mt-10 rounded-[28px] border border-[#ffe2c8] bg-white/90 p-5 shadow-[0_16px_40px_rgba(120,60,20,0.08)] sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Flame
                aria-hidden="true"
                className="h-5 w-5 text-[#ff7a1a]"
                fill="currentColor"
              />
              <h2 className="text-base font-black text-[#241910]">
                Gợi ý phổ biến
              </h2>
            </div>
            <Link
              className="text-sm font-bold text-[#ff7a1a] transition hover:text-[#ef6c0d]"
              href={routes.CUSTOMER_MENU}
            >
              Xem tất cả &gt;
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {SUGGESTIONS.map((item) => (
              <Link
                className="group flex gap-3 rounded-2xl border border-[#f3e3d4] bg-[#fffaf6] p-3 transition hover:-translate-y-0.5 hover:border-[#ffc089] hover:shadow-[0_12px_24px_rgba(255,122,26,0.12)]"
                href={routes.CUSTOMER_MENU}
                key={item.id}
              >
                <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl">
                  <img
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    src={item.image}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-[#241910]">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-xs text-[#8a7464]">{item.category}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs font-semibold text-[#6f5a4c]">
                    <span className="inline-flex items-center gap-1">
                      <Star
                        aria-hidden="true"
                        className="h-3.5 w-3.5 text-[#ffb020]"
                        fill="currentColor"
                      />
                      {item.rating}
                    </span>
                    <span>{item.eta}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-8 mb-2 flex items-end justify-center gap-3 pb-2">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-[#fff1e4] shadow-[0_10px_24px_rgba(255,122,26,0.2)] sm:h-24 sm:w-24">
            <Image
              alt="Mascot Chenow"
              className="object-cover object-top"
              fill
              sizes="96px"
              src={notFoundMascot}
            />
          </div>
          <div className="relative mb-6 max-w-[280px] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm font-semibold text-[#4d3b2f] shadow-[0_10px_24px_rgba(80,40,10,0.1)]">
            <span className="absolute -left-2 bottom-3 h-3 w-3 rotate-45 bg-white" />
            Đừng buồn nhé! Để mình dẫn bạn đi ăn ngon nè 🥘
          </div>
        </footer>
      </div>
    </main>
  );
}
