import cheMitImage from "@/common/assets/images/chemit.png";
import { Box, Button, Image } from "@/components";
import type { Order as ApiOrder, OrderStatus } from "@/services/types/apiType";
import {
  CalendarDays,
  Check,
  Download,
  MapPin,
  PackageCheck,
  Phone,
  ShoppingBag,
  Truck,
  UserRound,
  X,
} from "lucide-react";

import { statusMeta } from "../../../../../common/utils/status";
import {
  formatCurrency,
  formatDateTime,
  formatOrderCode,
} from "../ultils/orderFormat";
import { InfoCard, InfoLine, SummaryLine } from "./OrderInfo";
import { OrderStatusHistory } from "./OrderStatusHistory";
import { StatusPill } from "./StatusPill";

const nextStatusByStatus: Partial<
  Record<OrderStatus, { label: string; status: OrderStatus }>
> = {
  confirmed: { label: "Start preparing", status: "preparing" },
  pending: { label: "Confirm", status: "confirmed" },
  preparing: { label: "Mark ready", status: "ready" },
  ready: { label: "Complete", status: "completed" },
};

export function OrderDetail({
  actionLoading,
  isFetchingDetail,
  onPrintInvoice,
  onUpdateStatus,
  order,
  selectedMeta,
}: {
  actionLoading: boolean;
  isFetchingDetail: boolean;
  onPrintInvoice: (order: ApiOrder) => void;
  onUpdateStatus: (orderId: number, status: OrderStatus) => void;
  order: ApiOrder;
  selectedMeta: (typeof statusMeta)[OrderStatus];
}) {
  const items = order.orderItems ?? [];
  const itemQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const itemSubtotal = items.reduce(
    (total, item) => total + Number(item.subtotal ?? 0),
    0,
  );
  const nextStatus = nextStatusByStatus[order.status];
  const canCancel = !["cancelled", "completed"].includes(order.status);

  return (
    <Box className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.9fr)]">
      <Box className="rounded-lg border border-[#eadfd4] bg-white/90 p-5 shadow-[0_16px_34px_rgba(55,36,20,0.06)]">
        <Box className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Box className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-[#183d2b]">
              Order detail #{formatOrderCode(order.id)}
            </h2>
            <StatusPill meta={selectedMeta} />
            {isFetchingDetail ? (
              <span className="text-xs font-semibold text-[#8a7867]">
                Updating...
              </span>
            ) : null}
          </Box>

          <Box className="flex gap-2">
            <Button
              className="h-8 rounded-md border-[#d8cbbf] bg-white px-3 text-xs font-semibold text-[#5c554c] shadow-none hover:bg-[#fff8f1]"
              onClick={() => onPrintInvoice(order)}
              variant="outlined"
            >
              <Download aria-hidden="true" className="h-3.5 w-3.5" />
              Xuat hoa don
            </Button>
            {nextStatus ? (
              <Button
                className="h-8 rounded-md border-[#b8d2bc] bg-[#eef7ef] px-3 text-xs font-semibold text-[#315d3b] shadow-none hover:bg-[#e1f1e4]"
                disabled={actionLoading}
                onClick={() => onUpdateStatus(order.id, nextStatus.status)}
              >
                <Check aria-hidden="true" className="h-3.5 w-3.5" />
                {nextStatus.label}
              </Button>
            ) : null}
            <Button
              className="h-8 rounded-md px-3 text-xs font-semibold"
              disabled={actionLoading || !canCancel}
              onClick={() => onUpdateStatus(order.id, "cancelled")}
              variant="delete"
            >
              <X aria-hidden="true" className="h-3.5 w-3.5" />
              Cancel
            </Button>
          </Box>
        </Box>

        <Box className="grid gap-4 lg:grid-cols-3">
          <InfoCard title="Customer information">
            <InfoLine
              icon={UserRound}
              text={order.receiverName || `Customer #${order.userId}`}
            />
            <InfoLine icon={Phone} text={order.receiverPhone || "-"} />
            <InfoLine icon={MapPin} text={order.deliveryAddress || "-"} />
            <p className="pt-2 text-xs font-semibold text-[#183d2b]">
              Note: {order.note || "-"}
            </p>
          </InfoCard>

          <InfoCard title="Order information">
            <InfoLine
              icon={CalendarDays}
              text={`Created: ${formatDateTime(order.createdAt)}`}
            />
            <InfoLine
              icon={ShoppingBag}
              text={`Payment method: ${order.paymentMethod.toUpperCase()}`}
            />
            <InfoLine
              icon={Truck}
              text={`Shipping: ${formatCurrency(order.shippingFee)}`}
              tone="success"
            />
            <InfoLine
              icon={PackageCheck}
              text={`Order type: ${order.orderType.replace("_", " ")}`}
            />
          </InfoCard>

          <InfoCard title="Payment summary">
            <SummaryLine label="Subtotal" value={order.subtotalAmount} />
            <SummaryLine
              danger
              label="Discount"
              value={-Number(order.discountAmount ?? 0)}
            />
            <SummaryLine label="Shipping fee" value={order.shippingFee} />
            <Box className="mt-2 flex items-center justify-between border-t border-[#eadfd4] pt-3 text-sm font-bold text-[#183d2b]">
              <span>Total</span>
              <span className="text-[#315d3b]">
                {formatCurrency(order.totalAmount)}
              </span>
            </Box>
          </InfoCard>
        </Box>

        <Box className="mt-5">
          <h3 className="mb-2 text-sm font-semibold text-[#183d2b]">
            Product list
          </h3>
          <Box className="overflow-hidden rounded-md border border-[#eadfd4]">
            <table className="w-full min-w-[640px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#eadfd4] bg-[#fffaf5] text-[#5c554c]">
                  <th className="px-3 py-3">Product</th>
                  <th className="px-3 py-3">Topping</th>
                  <th className="px-3 py-3">Unit price</th>
                  <th className="px-3 py-3">Qty</th>
                  <th className="px-3 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td
                      className="px-3 py-6 text-center text-[#6f665c]"
                      colSpan={5}
                    >
                      No products in this order.
                    </td>
                  </tr>
                ) : null}

                {items.map((item) => {
                  const toppings =
                    item.orderItemToppings
                      ?.map(
                        (topping) =>
                          `${topping.toppingName} x${topping.quantity}`,
                      )
                      .join(", ") || "-";

                  return (
                    <tr
                      className="border-b border-[#eadfd4] last:border-b-0"
                      key={item.id}
                    >
                      <td className="px-3 py-3">
                        <Box className="flex items-center gap-3">
                          <Box className="h-10 w-10 overflow-hidden rounded-md border border-[#eadfd4] bg-[#f6eee6]">
                            <Image
                              alt={item.productName}
                              className="h-full w-full object-cover"
                              previewType="thumbnails"
                              src={item.product?.imageUrl || cheMitImage.src}
                            />
                          </Box>
                          <Box>
                            <span className="font-semibold text-[#183d2b]">
                              {item.productName}
                            </span>
                            <p className="mt-0.5 text-[11px] text-[#6f665c]">
                              Size {item.sizeName}
                            </p>
                          </Box>
                        </Box>
                      </td>
                      <td className="px-3 py-3 text-[#314032]">{toppings}</td>
                      <td className="px-3 py-3 font-semibold text-[#183d2b]">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-3 py-3 font-semibold text-[#183d2b]">
                        {item.quantity}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-[#183d2b]">
                        {formatCurrency(item.subtotal)}
                      </td>
                    </tr>
                  );
                })}

                <tr className="bg-[#fffaf5] font-bold text-[#183d2b]">
                  <td className="px-3 py-3" colSpan={3}>
                    Total
                  </td>
                  <td className="px-3 py-3">{itemQuantity}</td>
                  <td className="px-3 py-3 text-right">
                    {formatCurrency(itemSubtotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>

      <OrderStatusHistory order={order} />
    </Box>
  );
}
