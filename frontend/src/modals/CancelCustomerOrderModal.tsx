"use client";

import { Box, Button, Modal } from "@/components";
import { useModal } from "@/providers";
import { formatCurrency } from "@/app/admin/orders/components/ultils/orderFormat";
import { useCancelMyOrderMutation } from "@/services/controllers/orders/OrdersQueries";

interface CancelCustomerOrderModalProps {
  invoiceCode?: string | null;
  orderCode: string;
  orderId: number;
  totalAmount: string | number;
}

export function CancelCustomerOrderModal({
  invoiceCode,
  orderCode,
  orderId,
  totalAmount,
}: CancelCustomerOrderModalProps) {
  const { closeModal } = useModal();
  const { mutate: cancelOrder, isPending } = useCancelMyOrderMutation();

  const handleCancelOrder = () => {
    cancelOrder(orderId, { onSuccess: closeModal });
  };

  return (
    <Modal
      className="max-w-[460px] rounded-md"
      closeTitle="Dong xac nhan huy don"
      onClose={closeModal}
    >
      <Box className="px-7 pb-6 pt-6">
        <Modal.Title className="mb-3 min-h-0 text-base font-semibold">
          Huy don hang?
        </Modal.Title>
        <p className="text-sm leading-6 text-[#5f564b]">
          Don hang chi co the huy khi dang cho xac nhan. Sau khi huy, trang
          thai don se chuyen sang cancelled.
        </p>

        <Box className="mt-5 rounded-lg bg-[#fffaf5] p-3 text-sm text-[#5f5148]">
          <p className="font-bold text-[#183d2b]">
            {invoiceCode || orderCode}
          </p>
          <p className="mt-1">Tong tien: {formatCurrency(totalAmount)}</p>
        </Box>
      </Box>

      <Modal.BottomButtons className="mt-auto justify-end border-t border-[#eadfd4] bg-[#fff3e8] px-7 py-5">
        <Button
          className="h-10 rounded-md px-5 text-xs text-[#6f6256]"
          disabled={isPending}
          onClick={closeModal}
          type="button"
          variant="outlined"
        >
          Giu don
        </Button>
        <Button
          className="h-10 rounded-md px-5 text-xs"
          disabled={isPending}
          onClick={handleCancelOrder}
          type="button"
          variant="delete"
        >
          {isPending ? "Dang huy..." : "Xac nhan huy"}
        </Button>
      </Modal.BottomButtons>
    </Modal>
  );
}
