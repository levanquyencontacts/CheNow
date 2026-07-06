import { RequireAuth } from "@/guards/RequireAuth";
import { CustomerChatWidget } from "@/components/Chat/CustomerChatWidget";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequireAuth allowedWorkspaces={["customer"]}>
      {children}
      <CustomerChatWidget />
    </RequireAuth>
  );
}
