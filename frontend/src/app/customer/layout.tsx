import { RequireAuth } from "@/guards/RequireAuth";
import { CustomerChatWidget } from "@/components/Chat/CustomerChatWidget";
import { CustomerFooter } from "./components/CustomerFooter";
import { CustomerHeader } from "./components/CustomerHeader";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequireAuth allowedWorkspaces={["customer"]}>
      <CustomerHeader />
      {children}
      <CustomerFooter />
      <CustomerChatWidget />
    </RequireAuth>
  );
}
