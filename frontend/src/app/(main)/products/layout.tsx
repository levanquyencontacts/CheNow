import { PageHeader } from "@/components";

export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PageHeader title="Products" searchPlaceholder="Search Inventory..." />
      {children}
    </>
  );
}
