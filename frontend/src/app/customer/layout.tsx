import { RequireAuth } from "@/guards/RequireAuth";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RequireAuth allowedWorkspaces={["customer"]}>{children}</RequireAuth>;
}
