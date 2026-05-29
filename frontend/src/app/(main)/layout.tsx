import { Box } from "@/components";
import { MainHeader } from "../../components/Header/MainHeader";
import { MainSidebar } from "../../components/Sidebar/MainSidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box className="min-h-screen bg-[#fff8f1] text-[#143d2a]">
      <Box className="mx-auto flex min-h-screen max-w-7xl overflow-hidden border-x border-[#eadfd4] bg-[#fff8f1]">
        <MainSidebar />

        <Box className="flex min-w-0 flex-1 flex-col">
          <MainHeader />
          <Box
            className="flex-1 overflow-x-hidden bg-[#fff8f1] px-5 py-8 md:px-10"
            component="main"
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
