"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { Box, Link, Typography } from "@/components";

export function FooterPage() {
  return (
    <Box
      className="mb-4 grid gap-8 rounded-[24px] bg-white/72 px-7 py-8 text-[#3d3d35] shadow-[0_15px_45px_rgba(82,56,25,0.12)] backdrop-blur-md sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1.1fr_1.2fr] lg:px-9"
      component="footer"
    >
      <Box>
        <Box className="flex items-center gap-3">
          <LotusMark />
          <Box>
            <Typography className="font-serif text-[#172d21]" variant="h3">
              Sam Sam
            </Typography>
            <Typography
              className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c78932]"
              variant="caption"
            >
              Tinh hoa chè Việt
            </Typography>
          </Box>
        </Box>
        <Typography className="mt-5 max-w-64 text-[#686257]" variant="caption">
          Gìn giữ tinh hoa chè Việt, mang đến những trải nghiệm thanh mát và
          trọn vẹn nhất.
        </Typography>
      </Box>

      <FooterLinks
        links={["Về chúng tôi", "Sustainability", "Hướng dẫn pha chế", "Tin tức"]}
        title="Thông tin"
      />
      <FooterLinks
        links={[
          "Chính sách bảo mật",
          "Điều khoản sử dụng",
          "Chính sách đổi trả",
          "Câu hỏi thường gặp",
        ]}
        title="Hỗ trợ"
      />

      <Box>
        <Typography className="font-bold uppercase tracking-[0.12em]" variant="body2">
          Liên hệ
        </Typography>
        <Box className="mt-5 flex flex-col gap-3 text-sm text-[#514b43]">
          <span className="flex items-center gap-3">
            <Phone className="h-4 w-4" />
            0123 456 789
          </span>
          <span className="flex items-center gap-3">
            <Mail className="h-4 w-4" />
            info@samsam.vn
          </span>
          <span className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4" />
            123 Đường Sen, Tây Hồ, Hà Nội, Việt Nam
          </span>
        </Box>
      </Box>

      <Box>
        <Typography className="font-bold uppercase tracking-[0.12em]" variant="body2">
          Kết nối với chúng tôi
        </Typography>
        <Box className="mt-5 flex items-center gap-3">
          {["ig", "f", "yt"].map((label) => (
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#143b2b] text-white"
              key={label}
            >
              <span className="text-xs font-bold uppercase">{label}</span>
            </span>
          ))}
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#143b2b] text-sm font-bold text-white">
            ♪
          </span>
        </Box>
        <span className="mt-7 block h-px w-8 bg-[#d19a3d]" />
        <Typography className="mt-5 text-[#686257]" variant="caption">
          © 2026 Sam Sam. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

function FooterLinks({ title, links }: { title: string; links: string[] }) {
  return (
    <Box>
      <Typography className="font-bold uppercase tracking-[0.12em]" variant="body2">
        {title}
      </Typography>
      <Box className="mt-5 flex flex-col gap-2.5 text-[#686257]">
        {links.map((label) => (
          <Link className="text-sm" href="#" key={label} underline="none">
            {label}
          </Link>
        ))}
      </Box>
    </Box>
  );
}

function LotusMark() {
  return (
    <span className="relative flex h-11 w-[52px] items-center justify-center text-[#c98c25]">
      <LeafPath className="rotate-[-20deg]" />
      <LeafPath className="absolute rotate-[20deg]" />
      <LeafPath className="absolute" />
    </span>
  );
}

function LeafPath({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-10 w-10 ${className ?? ""}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 21c-4.2-4.4-4.2-10.6 0-18 4.2 7.4 4.2 13.6 0 18Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}
