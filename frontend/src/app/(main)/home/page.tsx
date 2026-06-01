import { Box } from "@/components";
import { MainHeader } from "@/components/Header/MainHeader";

export default function Home() {
  return (
    <Box className="flex min-h-full flex-col">
      <MainHeader />

      <Box className="flex-1 px-4 py-6 sm:px-6 md:px-8 lg:px-10" />
    </Box>
  );
}
