import { routes } from "@/common/utils/constant";
import { redirect } from "next/navigation";

export default function AdminIndexPage() {
  redirect(routes.ADMIN_HOME);
}
