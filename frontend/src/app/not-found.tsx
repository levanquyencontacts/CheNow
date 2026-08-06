"use client";

import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { AdminNotFound } from "@/components/NotFound/AdminNotFound";
import { CustomerNotFound } from "@/components/NotFound/CustomerNotFound";
import type { RootState } from "@/services/store";

export default function NotFoundPage() {
  const pathname = usePathname();
  const activeWorkspace = useSelector(
    (state: RootState) => state.auth.activeWorkspace,
  );

  if (pathname.startsWith("/admin") || activeWorkspace === "admin") {
    return <AdminNotFound />;
  }

  return <CustomerNotFound />;
}
