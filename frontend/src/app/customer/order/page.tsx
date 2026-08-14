import { redirect } from "next/navigation";
import { routes } from "@/common/utils/constant";

export default function CustomerOrderRedirectPage() {
  redirect(routes.CUSTOMER_CART);
}
