import Image from "next/image";
import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import forgotPasswordHero from "@/common/assets/images/che-forgot-password-hero.png";
import signupHero from "@/common/assets/images/che-signup-hero.png";
import loginHero from "@/common/assets/images/che-troi-nuoc-hero.png";
import { Box } from "../Box/Box";
import { Typography } from "../Typography/Typography";

type AuthArtworkVariant = "login" | "signup" | "forgot-password";

const artworkContent: Record<
  AuthArtworkVariant,
  { description: string; image: StaticImageData; title: ReactNode }
> = {
  login: {
    image: loginHero,
    title: "Tinh Hoa Chè Việt",
    description:
      "Nơi lưu giữ những giá trị truyền thống qua từng bát chè sen thanh mát.",
  },
  signup: {
    image: signupHero,
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
      ? "from-[#342518]/75 via-transparent to-transparent"
      : "from-[#10271e]/90 via-[#213c31]/35 to-[#163027]/20";

  return (
    <Box className="relative min-h-[430px] lg:min-h-[640px]">
      <Image
        alt="Bát chè trôi nước truyền thống"
        className="object-cover"
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        src={content.image}
      />
      <Box className={`absolute inset-0 bg-linear-to-t ${darkOverlay}`} />
      <Box className="absolute inset-x-0 bottom-0 p-8 text-[#fffaf3] sm:p-10">
        <Typography className="font-serif" variant="h1">
          {content.title}
        </Typography>
        <Typography className="mt-4 max-w-[390px] text-[#f4eee5]" variant="body2">
          {content.description}
        </Typography>
        {variant === "signup" && (
          <Box className="mt-7 flex items-center gap-4 text-[#e5d5be]">
            <PetalMark />
            <span className="h-px w-20 bg-[#dfcfb5]/70" />
          </Box>
        )}
      </Box>
    </Box>
  );
}

function PetalMark() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 21c0-5.5 3-8 7-9-1 4.5-3.5 7-7 7m0 2c0-5.5-3-8-7-9 1 4.5 3.5 7 7 7m0-5V8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M12 9c-2.6-1.2-3.3-3.7 0-6 3.3 2.3 2.6 4.8 0 6Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}
