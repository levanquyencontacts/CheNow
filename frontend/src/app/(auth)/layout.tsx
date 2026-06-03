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
      <Box className="relative min-h-screen overflow-hidden bg-[#f7eadf] font-['Times_New_Roman',Times,serif] text-[#544838]">
        <Box className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(253,245,237,0.6)_0%,rgba(253,245,237,0.6)_31%,rgba(230,202,177,0.22)_31%,rgba(230,202,177,0.22)_63%,rgba(253,245,237,0.5)_63%),linear-gradient(0deg,rgba(249,237,226,0.92)_0%,rgba(249,237,226,0.92)_21%,transparent_21%)]" />
        <Box className="pointer-events-none absolute left-0 right-0 top-18.5 hidden h-142.5 bg-[linear-gradient(115deg,#5a3a25_0%,#6d4527_13%,#f9a52d_24%,#754a28_38%,#53351e_53%,#f7aa32_67%,#6d482c_82%,#f4a83a_100%)] opacity-95 lg:block" />

        <Box className="relative mx-auto flex min-h-screen max-w-7xl flex-col">
          <HeaderPage />

          <Box
            className="flex flex-1 items-center justify-center px-5 py-10 sm:px-12 lg:px-16 lg:py-14"
            component="main"
          >
            {children}
          </Box>

          <FooterPage />
        </Box>
      </Box>
    </GuestOnly>
  );
}
