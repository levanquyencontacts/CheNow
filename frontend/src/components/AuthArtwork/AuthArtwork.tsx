import { Heart, Play, Sprout } from "lucide-react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import forgotPasswordHero from "@/common/assets/images/che-forgot-password-hero.png";
import chenmit from "@/common/assets/images/chemit.png";
import { Box } from "../Box/Box";
import { Typography } from "../Typography/Typography";

type AuthArtworkVariant = "login" | "signup" | "forgot-password";

const artworkContent: Record<
  AuthArtworkVariant,
  { description: string; image: StaticImageData; title: ReactNode }
> = {
  login: {
    image: chenmit,
    title: (
      <>
        Tinh hoa
        <br />
        Chè <span className="text-[#d6a23c]">Việt</span>
      </>
    ),
    description:
      "Nơi lưu giữ những giá trị truyền thống qua từng bát chè sen thanh mát.",
  },
  signup: {
    image: chenmit,
    title: (
      <>
        Gia Nhập Cộng Đồng
        <br />
        Yêu Chè
      </>
    ),
    description:
      "Đăng ký để nhận những ưu đãi độc quyền và khám phá bí quyết nấu chè truyền thống.",
  },
  "forgot-password": {
    image: forgotPasswordHero,
    title: (
      <>
        Khôi Phục Hương Vị
        <br />
        Quen Thuộc
      </>
    ),
    description:
      "Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập vào tài khoản của mình.",
  },
};

export function AuthArtwork({
  variant = "login",
}: {
  variant?: AuthArtworkVariant;
}) {
  const content = artworkContent[variant];
  const darkOverlay =
    variant === "login"
      ? "from-[#0a0e0a]/90 via-[#0e140e]/35 to-transparent"
      : "from-[#10271e]/90 via-[#213c31]/35 to-[#163027]/20";

  return (
    <Box className="relative min-h-[620px] overflow-hidden rounded-[24px] lg:min-h-[690px]">
      <Image
        alt="Bát chè truyền thống"
        className="object-cover"
        fill
        priority
        sizes="(min-width: 1024px) 52vw, 100vw"
        src={content.image}
      />
      <Box className={`absolute inset-0 bg-linear-to-r ${darkOverlay}`} />
      <Box className="absolute inset-0 bg-linear-to-t from-[#07100b]/70 via-transparent to-transparent" />

      <Box className="absolute left-7 top-[22%] max-w-[500px] text-[#fffaf3] sm:left-10">
        {variant === "login" && (
          <Box className="mb-6 flex items-center gap-4 text-[#d6a23c]">
            <span className="text-sm font-bold uppercase tracking-[0.32em]">
              Sam Sam
            </span>
            <span className="h-px w-14 bg-[#d6a23c]/90" />
          </Box>
        )}
        <Typography
          className="font-serif text-[54px] leading-[0.98] text-white sm:text-[66px]"
          variant="h1"
        >
          {content.title}
        </Typography>
        <Typography
          className="mt-8 max-w-[360px] text-base leading-8 text-[#fff5e9]"
          variant="body2"
        >
          {content.description}
        </Typography>

        {variant === "login" && (
          <button
            className="mt-14 flex h-20 w-20 items-center justify-center rounded-full border border-[#d6a23c] bg-[#173b2a]/65 text-white shadow-[0_10px_28px_rgba(0,0,0,0.25)]"
            type="button"
          >
            <Play className="ml-1 h-7 w-7 fill-white" />
            <span className="sr-only">Khám phá ngay</span>
          </button>
        )}
      </Box>

      {variant === "login" && (
        <>
          <Box className="absolute bottom-9 left-7 right-32 hidden rounded-2xl border border-white/15 bg-[#1f2b20]/60 px-8 py-5 text-white shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-md sm:left-10 lg:flex">
            <Feature icon={<Sprout />} label="Nguyên liệu tự nhiên" />
            <Feature icon={<BowlIcon />} label="Công thức gia truyền" />
            <Feature icon={<Heart />} label="Trọn vị thanh mát từ tâm" />
          </Box>
          <Box className="absolute bottom-16 right-10 hidden flex-col items-center gap-2 text-white lg:flex">
            <span className="text-sm">01</span>
            <span className="h-9 w-px bg-[#d6a23c]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#d6a23c]" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
            <span className="mt-3 text-sm">03</span>
          </Box>
        </>
      )}
    </Box>
  );
}

function BowlIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 11h16c-.4 4.6-3.8 8-8 8s-7.6-3.4-8-8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M7 11c0-1.5 1-2 1-3.2M12 11c0-1.5 1-2 1-3.2M17 11c0-1.5 1-2 1-3.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function Feature({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <Box className="flex flex-1 items-center gap-4 border-r border-white/10 px-6 last:border-r-0 first:pl-0 last:pr-0">
      <span className="flex h-10 w-10 items-center justify-center text-[#d6a23c] [&>svg]:h-7 [&>svg]:w-7">
        {icon}
      </span>
      <span className="text-sm font-semibold leading-6">{label}</span>
    </Box>
  );
}
