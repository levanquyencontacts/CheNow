"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, CreditCard, MapPin, Minus, Pencil, Plus, ShoppingBag, Trash2, X } from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type Topping = {
  id: string;
  name: string;
  price: number;
};

type CartItem = {
  key: string;
  product: Product;
  size: "M" | "L";
  sugar: string;
  ice: string;
  toppings: Topping[];
  quantity: number;
  linePrice: number;
};

const formatPrice = (value: number) => `${value.toLocaleString("vi-VN")}đ`;
const sizeExtra = (size: CartItem["size"]) => (size === "L" ? 7000 : 0);
const TOPPINGS = [
  { id: "pearl", name: "Trân châu đen", price: 7000 },
  { id: "cheese", name: "Kem cheese", price: 10000 },
  { id: "pudding", name: "Pudding trứng", price: 8000 },
  { id: "aloe", name: "Nha đam", price: 6000 },
];
const SAVED_ADDRESSES = [
  {
    id: "home",
    label: "Nhà riêng",
    receiver: "Nguyễn Văn A",
    phone: "0900 000 000",
    address: "12 Hàng Bài, Hoàn Kiếm, Hà Nội",
    isDefault: true,
  },
  {
    id: "office",
    label: "Công ty",
    receiver: "Nguyễn Văn A",
    phone: "0900 000 001",
    address: "45 Xuân Thủy, Cầu Giấy, Hà Nội",
    isDefault: false,
  },
];
const readStoredCart = () => {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(window.localStorage.getItem("chenow-cart") ?? "[]") as CartItem[];
  } catch {
    return [];
  }
};

export default function CustomerOrderPage() {
  const [cart, setCart] = useState<CartItem[]>(readStoredCart);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingSize, setEditingSize] = useState<CartItem["size"]>("M");
  const [editingSugar, setEditingSugar] = useState("70%");
  const [editingIce, setEditingIce] = useState("70%");
  const [editingQuantity, setEditingQuantity] = useState(1);
  const [editingToppings, setEditingToppings] = useState<string[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState(SAVED_ADDRESSES[0].id);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    window.localStorage.setItem("chenow-cart", JSON.stringify(cart));
  }, [cart]);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.linePrice * item.quantity, 0), [cart]);
  const deliveryFee = subtotal >= 120000 || subtotal === 0 ? 0 : 15000;
  const total = subtotal + deliveryFee;
  const editingItem = cart.find((item) => item.key === editingKey);
  const editingLinePrice =
    (editingItem?.product.price ?? 0) +
    sizeExtra(editingSize) +
    editingToppings.reduce((sum, id) => sum + (TOPPINGS.find((topping) => topping.id === id)?.price ?? 0), 0);

  const updateQuantity = (key: string, nextQuantity: number) => {
    setCart((current) =>
      nextQuantity <= 0
        ? current.filter((item) => item.key !== key)
        : current.map((item) => (item.key === key ? { ...item, quantity: nextQuantity } : item)),
    );
  };

  const openEditModal = (item: CartItem) => {
    setEditingKey(item.key);
    setEditingSize(item.size);
    setEditingSugar(item.sugar);
    setEditingIce(item.ice);
    setEditingQuantity(item.quantity);
    setEditingToppings(item.toppings.map((topping) => topping.id));
  };

  const saveEditedItem = () => {
    if (!editingItem) return;

    const toppings = TOPPINGS.filter((topping) => editingToppings.includes(topping.id));
    const nextKey = [
      editingItem.product.id,
      editingSize,
      editingSugar,
      editingIce,
      toppings.map((topping) => topping.id).join("-"),
    ].join("|");

    const updatedItem: CartItem = {
      ...editingItem,
      key: nextKey,
      size: editingSize,
      sugar: editingSugar,
      ice: editingIce,
      toppings,
      quantity: editingQuantity,
      linePrice: editingLinePrice,
    };

    setCart((current) => {
      const withoutOriginal = current.filter((item) => item.key !== editingItem.key);
      const duplicatedItem = withoutOriginal.find((item) => item.key === nextKey);

      if (duplicatedItem) {
        return withoutOriginal.map((item) =>
          item.key === nextKey
            ? { ...item, quantity: item.quantity + updatedItem.quantity }
            : item,
        );
      }

      return [...withoutOriginal, updatedItem];
    });
    setEditingKey(null);
  };

  return (
    <div className="min-h-screen bg-cream-white text-on-surface">
      <header className="border-b border-[#eadfd4] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link className="flex items-center gap-2 text-sm font-bold text-primary" href="/customer/menu">
            <ArrowLeft size={18} />
            Quay lại thực đơn
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2d6a4f] text-sm font-black text-white">
              C
            </div>
            <span className="font-black text-[#432010]">CheNow</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">Thanh toán</p>
          <h1 className="text-3xl font-black text-charcoal-black md:text-4xl">Hoàn tất đơn hàng</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
            Kiểm tra lại món đã chọn, chọn địa chỉ giao hàng và phương thức thanh toán.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-6">
            <div className="rounded-2xl border border-[#eadfd4] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <ShoppingBag className="text-primary" size={20} />
                <h2 className="text-lg font-bold text-charcoal-black">Món trong giỏ</h2>
              </div>
              <div className="space-y-3">
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <div className="rounded-2xl border border-[#eadfd4] bg-[#fffaf5] p-4" key={item.key}>
                      <div className="flex gap-4">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-tea-wash">
                          <Image
                            alt={item.product.name}
                            className="object-cover"
                            fill
                            sizes="96px"
                            src={item.product.image}
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-bold leading-tight text-charcoal-black">{item.product.name}</h3>
                              <p className="mt-1 text-xs text-on-surface-variant">
                                Size {item.size}, đường {item.sugar}, đá {item.ice}
                              </p>
                              {item.toppings.length > 0 && (
                                <p className="mt-1 text-xs text-on-surface-variant">
                                  Topping: {item.toppings.map((topping) => topping.name).join(", ")}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary transition-colors hover:bg-emerald/10"
                                onClick={() => openEditModal(item)}
                                type="button"
                              >
                                <Pencil size={15} />
                              </button>
                              <button className="text-error" onClick={() => updateQuantity(item.key, 0)} type="button">
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-lg font-bold text-primary">{formatPrice(item.linePrice * item.quantity)}</span>
                            <QuantityStepper onChange={(value) => updateQuantity(item.key, value)} value={item.quantity} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#d8cbbf] p-8 text-center text-on-surface-variant">
                    <ShoppingBag className="mx-auto mb-3 opacity-60" size={42} />
                    <p className="font-semibold">Chưa có món nào trong giỏ.</p>
                    <Link className="mt-3 inline-flex font-bold text-primary" href="/customer/menu">
                      Thêm món từ thực đơn
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-[#eadfd4] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="text-primary" size={20} />
                <h2 className="text-lg font-bold text-charcoal-black">Chọn địa chỉ giao hàng</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {SAVED_ADDRESSES.map((address) => {
                  const active = selectedAddressId === address.id;

                  return (
                    <button
                      className={`rounded-2xl border p-4 text-left transition-colors ${
                        active ? "border-primary bg-emerald/10" : "border-[#eadfd4] bg-white hover:bg-[#fffaf5]"
                      }`}
                      key={address.id}
                      onClick={() => setSelectedAddressId(address.id)}
                      type="button"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-bold text-charcoal-black">{address.label}</span>
                        {address.isDefault && (
                          <span className="rounded-full bg-amber px-2 py-1 text-[10px] font-black text-charcoal-black">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm font-semibold text-[#315d3b]">
                        {address.receiver} · {address.phone}
                      </p>
                      <p className="mt-1 text-sm leading-5 text-on-surface-variant">{address.address}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-[#eadfd4] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="text-primary" size={20} />
                <h2 className="text-lg font-bold text-charcoal-black">Phương thức thanh toán</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ["cod", "Tiền mặt", "Thanh toán khi nhận hàng"],
                  ["bank", "Chuyển khoản", "Nhận mã thanh toán sau khi đặt"],
                  ["wallet", "Ví điện tử", "Momo/ZaloPay/VNPay"],
                ].map(([value, title, desc]) => (
                  <button
                    className={`rounded-2xl border p-4 text-left transition-colors ${
                      paymentMethod === value ? "border-primary bg-emerald/10 text-primary" : "border-[#eadfd4] bg-white"
                    }`}
                    key={value}
                    onClick={() => setPaymentMethod(value)}
                    type="button"
                  >
                    <span className="font-bold">{title}</span>
                    <span className="mt-1 block text-xs text-on-surface-variant">{desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside className="self-start rounded-2xl border border-[#eadfd4] bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <h2 className="mb-4 text-lg font-bold text-charcoal-black">Tóm tắt đơn</h2>
            <div className="space-y-3">
              <SummaryLine label="Tạm tính" value={subtotal} />
              <SummaryLine label="Phí giao hàng" value={deliveryFee} />
              <div className="flex items-center justify-between border-t border-[#eadfd4] pt-4">
                <span className="font-bold text-on-surface-variant">Tổng cộng</span>
                <span className="text-2xl font-black text-primary">{formatPrice(total)}</span>
              </div>
            </div>
            <button
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber py-4 text-lg font-bold text-charcoal-black shadow-lg shadow-amber/20 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              disabled={cart.length === 0}
              type="button"
            >
              <CheckCircle2 size={20} />
              Xác nhận đặt hàng
            </button>
            <p className="mt-3 text-center text-xs leading-5 text-on-surface-variant">
              Nhân viên cửa hàng sẽ xác nhận đơn trước khi pha chế.
            </p>
          </aside>
        </div>
      </main>

      {editingItem && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-charcoal-black/45 px-4 py-6 backdrop-blur-sm sm:items-center">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eadfd4] bg-white p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Sửa món</p>
                <h3 className="text-xl font-bold text-charcoal-black">{editingItem.product.name}</h3>
              </div>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface"
                onClick={() => setEditingKey(null)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-6 p-5 md:grid-cols-[210px_minmax(0,1fr)]">
              <div>
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-tea-wash">
                  <Image
                    alt={editingItem.product.name}
                    className="object-cover"
                    fill
                    sizes="210px"
                    src={editingItem.product.image}
                    unoptimized
                  />
                </div>
                <p className="mt-3 text-sm font-bold text-primary">
                  {formatPrice(editingLinePrice)} / món
                </p>
              </div>
              <div className="space-y-5">
                <OptionGroup
                  active={editingSize}
                  items={[
                    { label: "M", value: "M", hint: "Giá gốc" },
                    { label: "L", value: "L", hint: "+7.000đ" },
                  ]}
                  label="Size"
                  onChange={(value) => setEditingSize(value as CartItem["size"])}
                />
                <OptionGroup
                  active={editingSugar}
                  items={["30%", "50%", "70%", "100%"].map((value) => ({ label: value, value }))}
                  label="Đường"
                  onChange={setEditingSugar}
                />
                <OptionGroup
                  active={editingIce}
                  items={["Ít đá", "50%", "70%", "100%"].map((value) => ({ label: value, value }))}
                  label="Đá"
                  onChange={setEditingIce}
                />

                <div>
                  <p className="mb-2 text-sm font-bold text-charcoal-black">Topping</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {TOPPINGS.map((topping) => {
                      const active = editingToppings.includes(topping.id);

                      return (
                        <button
                          className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                            active ? "border-primary bg-emerald/10 text-primary" : "border-[#eadfd4] bg-white text-on-surface"
                          }`}
                          key={topping.id}
                          onClick={() =>
                            setEditingToppings((current) =>
                              active ? current.filter((id) => id !== topping.id) : [...current, topping.id],
                            )
                          }
                          type="button"
                        >
                          <span className="font-semibold">{topping.name}</span>
                          <span className="text-xs">{formatPrice(topping.price)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-3 border-t border-[#eadfd4] pt-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
                  <QuantityStepper onChange={setEditingQuantity} value={editingQuantity} />
                  <button
                    className="flex h-12 items-center justify-center rounded-xl bg-amber px-5 text-sm font-black text-charcoal-black transition-transform hover:scale-[1.01] active:scale-[0.98]"
                    onClick={saveEditedItem}
                    type="button"
                  >
                    Lưu thay đổi - {formatPrice(editingLinePrice * editingQuantity)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OptionGroup({
  active,
  items,
  label,
  onChange,
}: {
  active: string;
  items: { label: string; value: string; hint?: string }[];
  label: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-charcoal-black">{label}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {items.map((item) => (
          <button
            className={`rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${
              active === item.value ? "border-primary bg-emerald/10 text-primary" : "border-[#eadfd4] bg-white text-on-surface"
            }`}
            key={item.value}
            onClick={() => onChange(item.value)}
            type="button"
          >
            {item.label}
            {item.hint && <span className="mt-1 block text-[11px] font-medium text-on-surface-variant">{item.hint}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuantityStepper({ onChange, value }: { onChange: (value: number) => void; value: number }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-surface-container px-2 py-1">
      <button
        className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-on-surface-variant transition-colors hover:text-primary"
        onClick={() => onChange(Math.max(0, value - 1))}
        type="button"
      >
        <Minus size={14} />
      </button>
      <span className="min-w-6 text-center text-sm font-bold">{value}</span>
      <button
        className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-on-surface-variant transition-colors hover:text-primary"
        onClick={() => onChange(value + 1)}
        type="button"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm font-semibold">
      <span className="text-on-surface-variant">{label}</span>
      <span className="text-charcoal-black">{formatPrice(value)}</span>
    </div>
  );
}
