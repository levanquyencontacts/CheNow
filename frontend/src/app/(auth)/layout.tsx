import { Box } from "@/components";
import { GuestOnly } from "@/guards/GuestOnly";
import { FooterPage } from "./layout/FooterPage";
import { HeaderPage } from "./layout/HeaderPage";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GuestOnly>
      <Box className="relative min-h-screen overflow-hidden bg-[#fff7ec] text-[#1f211c]">
        <Box className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(214,151,49,0.22)_0_1px,transparent_2px),radial-gradient(circle_at_98%_18%,rgba(230,203,166,0.55),transparent_22%),radial-gradient(circle_at_4%_58%,rgba(221,193,154,0.5),transparent_24%),linear-gradient(130deg,#fffaf2_0%,#fff6ea_48%,#f3ddbf_100%)]" />
        <Box className="pointer-events-none absolute -left-24 bottom-4 h-[22rem] w-[22rem] rounded-full border border-[#dfbc82]/40 opacity-60" />
        <Box className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-[#ead0ab]/45" />

        <Box className="relative mx-auto flex min-h-screen max-w-[1480px] flex-col px-4 sm:px-6 lg:px-8">
          <HeaderPage />

          <Box className="flex flex-1 items-center justify-center py-5" component="main">
            {children}
          </Box>

          <FooterPage />
        </Box>
      </Box>
    </GuestOnly>
  );
}
