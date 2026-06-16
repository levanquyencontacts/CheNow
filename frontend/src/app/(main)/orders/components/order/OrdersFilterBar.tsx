import { Box, Button } from "@/components";
import type { Order as ApiOrder } from "@/services/types/apiType";
import { Download, Search } from "lucide-react";

export function OrdersFilterBar({
  onPrintInvoice,
  onSearchChange,
  searchValue,
  selectedOrder,
}: {
  onPrintInvoice: (order: ApiOrder) => void;
  onSearchChange: (value: string) => void;
  searchValue: string;
  selectedOrder?: ApiOrder;
}) {
  return (
    <Box className="grid gap-3 border-b border-[#eadfd4] bg-[#fffaf5] p-4 lg:grid-cols-[minmax(220px,1fr)_160px_160px_160px_auto]">
      <label className="flex h-10 items-center gap-2.5 rounded-md border border-[#eadfd4] bg-white px-3 text-xs text-[#8a7867]">
        <Search aria-hidden="true" className="h-4 w-4" />
        <input
          className="h-full min-w-0 flex-1 bg-transparent text-[#183d2b] outline-none placeholder:text-[#9d8b78]"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search orders..."
          value={searchValue}
        />
      </label>

      {["Status", "Created date", "Customer"].map((label) => (
        <button
          className="flex h-10 items-center justify-between rounded-md border border-[#eadfd4] bg-white px-3 text-xs font-semibold text-[#5c554c] hover:bg-[#fff8f1]"
          key={label}
          type="button"
        >
          {label}
          <span className="text-[#9d8b78]">v</span>
        </button>
      ))}

      <Button
        className="h-10 rounded-md border-[#d8cbbf] bg-white px-4 text-xs font-semibold text-[#5c554c] shadow-none hover:bg-[#fff8f1]"
        disabled={!selectedOrder}
        onClick={() => {
          if (selectedOrder) {
            onPrintInvoice(selectedOrder);
          }
        }}
        variant="outlined"
      >
        <Download aria-hidden="true" className="h-3.5 w-3.5" />
        Export invoice
      </Button>
    </Box>
  );
}
