"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Menu, PackageCheck, ShoppingCart, X } from "lucide-react";
import logoSamSam from "@/common/assets/images/logosamsam.png";
import { NAV_LINKS } from "@/common/mocks/customerHome";
import { routes } from "@/common/utils/constant";
import { useCustomerCartQuery } from "@/services/controllers/cart/CartQueries";

const getNavHref = (label: string) => {
  if (label === "Sản phẩm") return "/customer/menu";
  if (label === "Giới thiệu") return "/customer#story";
  if (label === "Khuyến mãi") return "/customer#promotions";
  if (label === "Cửa hàng") return "/customer#stores";
  if (label === "Tin tức") return "/customer#news";

  return "/customer";
};

export function CustomerHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: cart } = useCustomerCartQuery();
  const cartCount = cart?.cartCount ?? 0;

  const cartLabel = useMemo(
    () => (cartCount > 0 ? `Giỏ hàng, ${cartCount} món` : "Giỏ hàng"),
    [cartCount],
  );

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#eadfd4] bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link className="flex items-center gap-2.5" href="/customer">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-transparent">
            <Image
              alt="CheNow Logo"
              className="h-full w-full object-contain"
              priority
              src={logoSamSam}
            />
          </div>
          <div>
            <p className="text-lg font-black leading-none tracking-tight text-[#432010]">
              CheNow
            </p>
            <p className="text-[9px] uppercase leading-none tracking-widest text-[#8c6a5a]">
              Đậm vị thiên nhiên
            </p>
          </div>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <Link
                className="rounded-full px-4 py-2 text-sm font-medium text-[#5f5148] transition-all hover:bg-[#f5ede4] hover:text-[#2d6a4f]"
                href={getNavHref(link)}
              >
                {link}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            className="hidden items-center gap-1.5 rounded-full border border-[#eadfd4] px-3 py-1.5 text-xs font-medium text-[#5f5148] transition-colors hover:border-[#2d6a4f] md:flex"
            href={routes.CUSTOMER_ADDRESSES}
          >
            <MapPin className="text-[#2d6a4f]" size={12} /> Địa chỉ
          </Link>
          <Link
            className="hidden items-center gap-1.5 rounded-full border border-[#eadfd4] px-3 py-1.5 text-xs font-medium text-[#5f5148] transition-colors hover:border-[#2d6a4f] md:flex"
            href={routes.CUSTOMER_ORDERS}
          >
            <PackageCheck className="text-[#2d6a4f]" size={12} /> Đơn hàng
          </Link>
          <button
            aria-label={cartLabel}
            className="relative rounded-full bg-[#f5ede4] p-2.5 transition-colors hover:bg-[#eadfd4]"
            onClick={() => router.push("/customer/order")}
            type="button"
          >
            <ShoppingCart className="text-[#432010]" size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2d6a4f] px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="p-2 lg:hidden"
            onClick={() => setMenuOpen((current) => !current)}
            type="button"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-[#eadfd4] bg-white px-6 py-4 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              className="border-b border-[#f5ede4] py-2 text-sm font-medium text-[#5f5148] last:border-0"
              href={getNavHref(link)}
              key={link}
              onClick={() => setMenuOpen(false)}
            >
              {link}
            </Link>
          ))}
          <Link
            className="border-b border-[#f5ede4] py-2 text-sm font-medium text-[#5f5148] last:border-0"
            href={routes.CUSTOMER_ADDRESSES}
            onClick={() => setMenuOpen(false)}
          >
            Địa chỉ giao hàng
          </Link>
          <Link
            className="border-b border-[#f5ede4] py-2 text-sm font-medium text-[#5f5148] last:border-0"
            href={routes.CUSTOMER_ORDERS}
            onClick={() => setMenuOpen(false)}
          >
            Đơn hàng của tôi
          </Link>
        </div>
      )}
    </nav>
  );
}
