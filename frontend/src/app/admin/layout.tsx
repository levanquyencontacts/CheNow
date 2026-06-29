import { Box } from "@/components";
import { RequireAuth } from "@/guards/RequireAuth";
import { MainSidebar } from "@/components/Sidebar/MainSidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequireAuth allowedWorkspaces={["admin"]}>
      <Box className="min-h-screen bg-[#fff8f1] text-[#143d2a]">
        <Box className="flex min-h-screen w-full bg-[#fff8f1]">
          <MainSidebar />

          <Box className="flex min-w-0 flex-1 flex-col">
            <Box
              className="flex flex-1 flex-col overflow-x-hidden bg-[#fff8f1]"
              component="main"
            >
              {children}
            </Box>
          </Box>
        </Box>
      </Box>
    </RequireAuth>
  );
}
