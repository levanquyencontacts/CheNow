"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import logoSamSam from "@/common/assets/images/logosamsam.png";

export function CustomerFooter() {
  return (
    <footer className="bg-[#432010] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-transparent">
              <Image
                alt="CheNow Logo"
                className="h-full w-full object-contain"
                src={logoSamSam}
              />
            </div>
            <span className="text-lg font-black">CheNow</span>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-white/60">
            Đậm vị thiên nhiên, trọn vị hạnh phúc. Thương hiệu trà sữa tiên
            phong sử dụng nông sản Việt.
          </p>
          <div className="flex gap-2">
            {["fb", "ig", "yt", "tk"].map((social) => (
              <span
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/10 text-xs font-bold transition-colors hover:bg-white/20"
                key={social}
              >
                {social}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold">Về CheNow</p>
          {["Câu chuyện thương hiệu", "Nhượng quyền", "Tuyển dụng", "Chuỗi cửa hàng"].map(
            (item) => (
              <Link
                className="block py-1 text-sm text-white/60 transition-colors hover:text-white"
                href="#"
                key={item}
              >
                {item}
              </Link>
            ),
          )}
        </div>

        <div>
          <p className="mb-3 text-sm font-bold">Chính sách</p>
          {[
            "Chính sách thành viên",
            "Hình thức thanh toán",
            "Vận chuyển giao nhận",
            "Đổi trả & hoàn tiền",
          ].map((item) => (
            <Link
              className="block py-1 text-sm text-white/60 transition-colors hover:text-white"
              href="#"
              key={item}
            >
              {item}
            </Link>
          ))}
        </div>

        <div>
          <p className="mb-3 text-sm font-bold">Liên hệ</p>
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm text-white/60">
              <Phone size={13} /> 1800 6272
            </p>
            <p className="flex items-center gap-2 text-sm text-white/60">
              <Mail size={13} /> hello@chenow.vn
            </p>
            <p className="flex items-start gap-2 text-sm text-white/60">
              <MapPin className="mt-0.5 flex-shrink-0" size={13} /> 12 Hàng
              Bài, Hoàn Kiếm, Hà Nội
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/30">
        © 2026 CheNow. All rights reserved.
      </div>
    </footer>
  );
}
