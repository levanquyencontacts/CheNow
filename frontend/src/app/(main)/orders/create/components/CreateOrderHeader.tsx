import { routes } from "@/common/utils/constant";
import { Box, Button } from "@/components";
import { ArrowLeft, Check, Save } from "lucide-react";
import type { useRouter } from "next/navigation";

export function CreateOrderHeader({
  canCreate,
  isCreating,
  onCreateOrder,
  router,
}: {
  canCreate: boolean;
  isCreating: boolean;
  onCreateOrder: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <Box className="sticky top-0 z-20 flex items-center justify-between border-b border-[#eadfd4] bg-[#fffaf5] px-5 py-4">
      <Box className="flex items-center gap-4">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md text-[#183d2b] hover:bg-[#f3e8de]"
          onClick={() => router.push(routes.ORDERS)}
          type="button"
        >
          <ArrowLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <Box>
          <h1 className="text-2xl font-semibold text-[#183d2b]">
            Tao don hang
          </h1>
          <p className="mt-0.5 text-sm text-[#6f665c]">
            Tao don hang moi cho khach
          </p>
        </Box>
      </Box>

      <Box className="flex gap-2">
        <Button
          className="h-10 rounded-md border-[#d8cbbf] bg-white px-4 text-xs font-semibold text-[#183d2b] shadow-none hover:bg-[#fff8f1]"
          variant="outlined"
        >
          <Save aria-hidden="true" className="h-4 w-4" />
          Luu nhap
        </Button>
        <Button
          className="h-10 rounded-md bg-[#183d2b] px-5 text-xs font-semibold text-white hover:bg-[#102f21]"
          disabled={!canCreate || isCreating}
          onClick={onCreateOrder}
        >
          <Check aria-hidden="true" className="h-4 w-4" />
          Tao don hang
        </Button>
      </Box>
    </Box>
  );
}
