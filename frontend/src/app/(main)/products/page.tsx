import { Box, PageHeader } from "@/components";

export default function ProductsPage() {
  return (
    <Box className="flex min-h-full flex-col">
      <PageHeader title='Products' searchPlaceholder="Search Inventory..." />
    </Box>


  );
}
