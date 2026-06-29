import { Box } from "@/components";
import type { CartItem, PaymentMethod } from "@/services/types/apiType";
import { Trash2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { Field } from "./FormPrimitives";
import { formatCurrency, inputClass } from "./createOrderUtils";

export function OrderSummary({
  cartItems,
  discountAmount,
  orderNote,
  paymentMethod,
  setCartItems,
  setDiscountAmount,
  setOrderNote,
  setPaymentMethod,
  setShippingFee,
  shippingFee,
  subtotalAmount,
  totalAmount,
}: {
  cartItems: CartItem[];
  discountAmount: number;
  orderNote: string;
  paymentMethod: PaymentMethod;
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
  setDiscountAmount: (value: number) => void;
  setOrderNote: (value: string) => void;
  setPaymentMethod: (value: PaymentMethod) => void;
  setShippingFee: (value: number) => void;
  shippingFee: number;
  subtotalAmount: number;
  totalAmount: number;
}) {
  return (
    <aside className="rounded-lg border border-[#eadfd4] bg-white/90 shadow-[0_8px_18px_rgba(55,36,20,0.04)] xl:sticky xl:top-24 xl:self-start">
      <Box className="flex items-center justify-between border-b border-[#eadfd4] p-4">
        <h2 className="font-bold text-[#183d2b]">
          4. San pham trong don ({cartItems.length})
        </h2>
        <button
          className="text-xs font-semibold text-[#b12f1d]"
          onClick={() => setCartItems([])}
          type="button"
        >
          Xoa tat ca
        </button>
      </Box>

      <Box className="max-h-[420px] space-y-3 overflow-y-auto p-4">
        {cartItems.length === 0 ? (
          <Box className="rounded-md border border-dashed border-[#d8cbbf] p-6 text-center text-sm text-[#6f665c]">
            Chua co san pham nao trong don.
          </Box>
        ) : (
          cartItems.map((item) => (
            <Box
              className="rounded-md border border-[#eadfd4] bg-[#fffaf5] p-3"
              key={item.key}
            >
              <Box className="grid grid-cols-[1fr_auto] gap-3">
                <Box>
                  <p className="text-sm font-bold text-[#183d2b]">
                    {item.productName}
                  </p>
                  <p className="mt-1 text-xs text-[#6f665c]">
                    Size: {item.sizeName}
                  </p>
                  {item.orderItemToppings?.length ? (
                    <ul className="mt-2 space-y-1 text-xs text-[#314032]">
                      {item.orderItemToppings.map((topping) => (
                        <li key={topping.toppingId}>
                          {topping.toppingName} x {topping.quantity}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </Box>
                <button
                  className="text-[#b12f1d]"
                  onClick={() =>
                    setCartItems((current) =>
                      current.filter((cartItem) => cartItem.key !== item.key),
                    )
                  }
                  type="button"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              </Box>
              <Box className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[#315d3b]">
                  {formatCurrency(item.subtotal)}
                </span>
                <span className="text-xs font-semibold text-[#6f665c]">
                  SL: {item.quantity}
                </span>
              </Box>
            </Box>
          ))
        )}
      </Box>

      <Box className="space-y-4 border-t border-[#eadfd4] p-4">
        <SummaryLine label="Tam tinh" value={subtotalAmount} />
        <MoneyField
          label="Phi ship"
          onChange={setShippingFee}
          value={shippingFee}
        />
        <MoneyField
          label="Giam gia"
          onChange={setDiscountAmount}
          value={discountAmount}
        />
        <Box className="flex items-center justify-between border-t border-[#eadfd4] pt-4">
          <span className="text-lg font-bold text-[#183d2b]">Tong tien</span>
          <span className="text-2xl font-bold text-[#315d3b]">
            {formatCurrency(totalAmount)}
          </span>
        </Box>

        <Box>
          <p className="mb-3 text-sm font-bold text-[#183d2b]">
            Phuong thuc thanh toan
          </p>
          <Box className="grid gap-2 text-sm text-[#314032]">
            {[
              ["cash", "Tien mat (COD)"],
              ["vnpay", "Chuyen khoan"],
              ["momo", "Vi dien tu"],
            ].map(([value, label]) => (
              <label className="flex items-center gap-2" key={value}>
                <input
                  checked={paymentMethod === value}
                  className="h-4 w-4 accent-[#183d2b]"
                  onChange={() => setPaymentMethod(value as PaymentMethod)}
                  type="radio"
                />
                {label}
              </label>
            ))}
          </Box>
        </Box>

        <Field label="Trang thai don">
          <select className={inputClass} disabled value="pending">
            <option value="pending">Pending</option>
          </select>
        </Field>

        <Field label="Ghi chu don hang">
          <textarea
            className="min-h-24 rounded-md border border-[#d8c8bd] bg-white px-3 py-2 text-sm text-[#183d2b] outline-none focus:border-[#183d2b]"
            onChange={(event) => setOrderNote(event.target.value)}
            placeholder="Ghi chu them cho don hang..."
            value={orderNote}
          />
        </Field>
      </Box>
    </aside>
  );
}

function MoneyField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <Box className="grid grid-cols-[1fr_130px_32px] items-center gap-2 text-sm">
      <span className="font-semibold text-[#314032]">{label}</span>
      <input
        className="h-9 rounded-md border border-[#d8c8bd] bg-white px-3 text-right text-sm text-[#183d2b] outline-none focus:border-[#183d2b]"
        min={0}
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
        value={value}
      />
      <span className="flex h-9 items-center justify-center rounded-md border border-[#eadfd4] bg-[#fffaf5] text-xs font-semibold text-[#183d2b]">
        d
      </span>
    </Box>
  );
}

function SummaryLine({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Box className="flex items-center justify-between text-sm font-semibold">
      <span className="text-[#314032]">{label}</span>
      <span className="text-[#183d2b]">{formatCurrency(value)}</span>
    </Box>
  );
}
