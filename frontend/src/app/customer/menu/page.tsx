"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Check,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  X,
  MapPin,
  Menu,
} from "lucide-react";

const NAV_LINKS = ["Giới thiệu", "Sản phẩm", "Khuyến mãi", "Cửa hàng", "Tin tức"];

const MENU_CATEGORIES = [
  { id: "all", name: "Tất cả", count: 45 },
  { id: "hot", name: "Món nổi bật", count: 12 },
  { id: "milktea", name: "Trà sữa", count: 22 },
  { id: "fruit", name: "Trà trái cây", count: 15 },
  { id: "macchiato", name: "Macchiato", count: 6 },
  { id: "coffee", name: "Cà phê", count: 5 },
];

const TOPPINGS = [
  { id: "pearl", name: "Trân châu đen", price: 7000 },
  { id: "cheese", name: "Kem cheese", price: 10000 },
  { id: "pudding", name: "Pudding trứng", price: 8000 },
  { id: "aloe", name: "Nha đam", price: 6000 },
];

const PRODUCTS = [
  {
    id: 1,
    categoryId: "hot",
    name: "Xanh Nhài Mơ Mận",
    price: 33000,
    tag: "Mới",
    rating: 4.8,
    sold: 1280,
    desc: "Trà xanh nhài ủ lạnh cùng mơ mận chua ngọt, hậu vị thanh nhẹ.",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLvFqOp7_XqoXS1BksaF-_LnSZR1CP6C2razOqyKL1OwHcKUz53dRa0Y3EWJa-Ewf0VcLxniOUrw6GbMRS1ASwn0PnuYlH6hQjl_5lj4xUbANEeCcTGdm2HLs2zxEes2GNupEtErPMO3W4PaGxbD4UTOMg_mrmKpdrz_tR6Wuy9xDUspq61JsVZT8l3PyHlSYnqRh-TuNR5Ha5Ogg_B47JtRtdU5qZ0kovOYfro7Y3cDzU1wiUrNkdw9VA",
    bg: "bg-[#eefbf3]",
  },
  {
    id: 2,
    categoryId: "fruit",
    name: "Ô Long Dứa Băng Tuyết",
    price: 30000,
    tag: "Bán chạy",
    rating: 4.9,
    sold: 2140,
    desc: "Ô long rang thơm, dứa tươi và lớp đá tuyết mát lạnh.",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLvWLr45mV8MfC8Vi58auOx5Wb9biqSslze1w_jBOWpPL7Xw-5ew0sBjy2pPZk0Cf3EP7fNMDlF29PYAPBgHa1ORcPQcE8a5zJTcCfO5h0LvIKZX5fUX1553adyisFvBll6kU53yUVHhVn5tO3m_cO-pmAEpYzUnx5Ko4LQ-duI6rB7ggxqxP4QaeLgWPtIVr-odikeDNcNkkDuRJLWvT6AEsc_QDa9lisX6MO1FjRfzPc1usOJ5X23MTQ",
    bg: "bg-[#fff8e1]",
  },
  {
    id: 3,
    categoryId: "macchiato",
    name: "Xanh Nhài Matcha Tươi Kem Phô Mai",
    price: 35000,
    tag: "Mới",
    rating: 4.7,
    sold: 980,
    desc: "Matcha tươi, nền trà xanh nhài và kem phô mai mằn mặn.",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLvp46gux7fWNv1KYdINSrG9GJClA-adlfW9GvwnFdL7FGEuTfSnhGSwLe5AikZ_wSXiYhqeXhKv6Ap2MB52RO2v1E2zFTuxWwL6HsX9ktk_k_U5KZbmDXkYdhsaAnsiy1ebRjRCEeHwsi5TUZGHOauorTrhf11hLty1wummqo8H6vJvEt8povBAmaeN2XTmUUX7aJnhjHBN50L9mYLO6WhXAIZN0rG8e1wfedJ402IYw8_0JjdC1SR40Q",
    bg: "bg-[#f0fdf4]",
  },
  {
    id: 4,
    categoryId: "milktea",
    name: "Trà Sữa Hạnh Phúc",
    price: 30000,
    tag: "Ưu đãi",
    rating: 4.6,
    sold: 1530,
    desc: "Trà đen đậm vị, sữa tươi béo nhẹ, dễ uống mỗi ngày.",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLsk5P-glD49KnSgOsHAfa3poHpB4SstEcZF1tZUaQR6rRxhpB44PaAYk-vcvVXVf5O-V79GKAndAD6QLEuQ175-s2381TPQGUOtDQq6DjFPK5NJxGtqEh8xeoZLfa5wqabaKL2UGeHzpW1-AJEVX3c_NzoVRuaKMr6rJX1d1bpP2_sKXBAVWaJG7aqGk70aLeqT76Jx0H04LUu9MbCAnY08GFR51V_o5oGtiiFfsRkBpSfkXpHErKOq",
    bg: "bg-[#fff4ec]",
  },
  {
    id: 5,
    categoryId: "macchiato",
    name: "Oolong Đào Quế Hoa Kem Cheese",
    price: 35000,
    rating: 4.8,
    sold: 1760,
    desc: "Ô long đào thơm, quế hoa dịu và kem cheese phủ mịn.",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLvWLr45mV8MfC8Vi58auOx5Wb9biqSslze1w_jBOWpPL7Xw-5ew0sBjy2pPZk0Cf3EP7fNMDlF29PYAPBgHa1ORcPQcE8a5zJTcCfO5h0LvIKZX5fUX1553adyisFvBll6kU53yUVHhVn5tO3m_cO-pmAEpYzUnx5Ko4LQ-duI6rB7ggxqxP4QaeLgWPtIVr-odikeDNcNkkDuRJLWvT6AEsc_QDa9lisX6MO1FjRfzPc1usOJ5X23MTQ",
    bg: "bg-[#fff8e1]",
  },
  {
    id: 6,
    categoryId: "milktea",
    name: "Trà Sữa Trân Châu Hoàng Gia",
    price: 30000,
    tag: "Bán chạy",
    rating: 4.9,
    sold: 2960,
    desc: "Vị trà sữa truyền thống, trân châu dai mềm và hậu trà thơm.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCMazeqg4PKc5rbNUthz6bT-YEDkTnrNUk3mCc6ckgC1K_PAVkJAyMlYQ08x7AASio77-DyjWYEqhFtihKS5foCQW_d2NXQzQaS-X8JWVV2fgjBp7y-EN9rncuOxl50QjMDhXkmssHmiLmXHcXTGQzZ116KjlMNdcn8eg0sXQpW1JYmp9i9F0A1282bbqJOwYH0beV8JTPaPZ6dNJNm9Ulhue3W7dekMIAiDJT1_Kg4BQgZCJnG0Ud1lNBYEXtHimvWzgrXpjfkpA",
    bg: "bg-[#f0fdf4]",
  },
];

type Product = (typeof PRODUCTS)[number];
type Topping = (typeof TOPPINGS)[number];
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
const readStoredCart = () => {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(window.localStorage.getItem("chenow-cart") ?? "[]") as CartItem[];
  } catch {
    return [];
  }
};

export default function MenuCustomerPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [sortMode, setSortMode] = useState("popular");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>(readStoredCart);
  const [menuOpen, setMenuOpen] = useState(false);
  const [size, setSize] = useState<CartItem["size"]>("M");
  const [sugar, setSugar] = useState("70%");
  const [ice, setIce] = useState("70%");
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [activePromo, setActivePromo] = useState(0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    window.localStorage.setItem("chenow-cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    const products = PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === "all" ||
        product.categoryId === activeCategory ||
        (activeCategory === "hot" && product.tag === "Bán chạy");
      const matchesSearch =
        !keyword || product.name.toLowerCase().includes(keyword) || product.desc.toLowerCase().includes(keyword);
      return matchesCategory && matchesSearch;
    });

    return [...products].sort((a, b) => {
      if (sortMode === "price-asc") return a.price - b.price;
      if (sortMode === "price-desc") return b.price - a.price;
      if (sortMode === "rating") return b.rating - a.rating;
      return b.sold - a.sold;
    });
  }, [activeCategory, searchValue, sortMode]);

  const featuredProducts = useMemo(() => PRODUCTS.filter((product) => product.tag).slice(0, 4), []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePromo((current) => (current + 1) % featuredProducts.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [featuredProducts.length]);

  const currentPrice =
    (selectedProduct?.price ?? 0) +
    sizeExtra(size) +
    selectedToppings.reduce((sum, id) => sum + (TOPPINGS.find((topping) => topping.id === id)?.price ?? 0), 0);

  const openOrderModal = (product: Product) => {
    setSelectedProduct(product);
    setSize("M");
    setSugar("70%");
    setIce("70%");
    setQuantity(1);
    setSelectedToppings([]);
  };

  const createConfiguredItem = () => {
    if (!selectedProduct) return null;

    const toppings = TOPPINGS.filter((topping) => selectedToppings.includes(topping.id));
    const optionKey = [
      selectedProduct.id,
      size,
      sugar,
      ice,
      toppings.map((topping) => topping.id).join("-"),
    ].join("|");

    return {
      key: optionKey,
      product: selectedProduct,
      size,
      sugar,
      ice,
      toppings,
      quantity,
      linePrice: currentPrice,
    };
  };

  const mergeCartItem = (current: CartItem[], item: CartItem) => {
    const existing = current.find((cartItem) => cartItem.key === item.key);
    if (existing) {
      return current.map((cartItem) =>
        cartItem.key === item.key ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem,
      );
    }

    return [...current, item];
  };

  const addConfiguredItem = (redirectToOrder = false) => {
    const item = createConfiguredItem();
    if (!item) return;

    const nextCart = mergeCartItem(cart, item);
    setCart(nextCart);
    window.localStorage.setItem("chenow-cart", JSON.stringify(nextCart));
    setSelectedProduct(null);

    if (redirectToOrder) {
      router.push("/customer/order");
    }
  };

  const buyConfiguredItemNow = () => {
    addConfiguredItem(true);
  };

  const openCartPage = () => {
    router.push("/customer/order");
  };

  const cartLabel = cartCount > 0 ? `Giỏ hàng, ${cartCount} món` : "Giỏ hàng";

  const CartButton = (
    <button
      aria-label={cartLabel}
      className="relative rounded-full bg-[#f5ede4] p-2.5 transition-colors hover:bg-[#eadfd4]"
      onClick={openCartPage}
      type="button"
    >
      <ShoppingCart className="text-[#432010]" size={18} />
      {cartCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2d6a4f] px-1 text-[10px] font-bold text-white">
          {cartCount}
        </span>
      )}
    </button>
  );

  const goToOrderButton = (
    <button
      className="hidden items-center gap-2 rounded-xl bg-amber px-4 py-3 text-sm font-black text-charcoal-black transition-transform hover:scale-[1.01] md:flex"
      onClick={openCartPage}
      type="button"
    >
      <ShoppingCart size={17} />
      Đặt hàng ({cartCount})
    </button>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-cream-white font-body-lg text-on-surface selection:bg-emerald/30">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#eadfd4] bg-white/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] shadow">
              <span className="text-base font-black text-white">C</span>
            </div>
            <div>
              <p className="text-lg font-black leading-none tracking-tight text-[#432010]">CheNow</p>
              <p className="text-[9px] uppercase leading-none tracking-widest text-[#8c6a5a]">Đậm vị thiên nhiên</p>
            </div>
          </div>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <a
                  className="rounded-full px-4 py-2 text-sm font-medium text-[#5f5148] transition-all hover:bg-[#f5ede4] hover:text-[#2d6a4f]"
                  href="#"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button className="hidden items-center gap-1.5 rounded-full border border-[#eadfd4] px-3 py-1.5 text-xs font-medium text-[#5f5148] transition-colors hover:border-[#2d6a4f] md:flex">
              <MapPin className="text-[#2d6a4f]" size={12} /> Hà Nội
            </button>
            {CartButton}
            <button className="p-2 lg:hidden" onClick={() => setMenuOpen(!menuOpen)} type="button">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="flex flex-col gap-1 border-t border-[#eadfd4] bg-white px-6 py-4 lg:hidden">
            {NAV_LINKS.map((link) => (
              <a className="border-b border-[#f5ede4] py-2 text-sm font-medium text-[#5f5148] last:border-0" href="#" key={link}>
                {link}
              </a>
            ))}
          </div>
        )}
      </nav>

      <main className="relative pt-28">
        <section className="mx-auto mb-20 max-w-[1280px] px-6">
          <div className="mb-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <span className="mb-4 block text-label-caps font-bold uppercase tracking-widest text-amber">
                CheNow Web Menu
              </span>
              <h1 className="text-4xl font-black leading-[1.08] text-charcoal-black md:text-6xl">
                Thực đơn dạng thẻ,
                <span className="block text-emerald">rõ món, rõ giá.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-on-surface-variant">
                Giao diện web card rộng rãi hơn: ảnh món nổi bật, thông tin dễ đọc, vẫn có thêm vào giỏ và đặt hàng ngay.
              </p>
            </div>
            <div className="rounded-2xl border border-[#eadfd4] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald/10 text-primary">
                  <Check size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-charcoal-black">Miễn phí giao từ 120.000đ</p>
                  <p className="text-xs text-on-surface-variant">Dự kiến giao 25-35 phút tại Hà Nội.</p>
                </div>
              </div>
              <div className="mt-5">{goToOrderButton}</div>
            </div>
          </div>

          <div className="mb-10 overflow-hidden rounded-2xl border border-[#eadfd4] bg-white shadow-sm">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${activePromo * 100}%)` }}
            >
              {featuredProducts.map((product) => (
                <button
                  className="grid min-w-full gap-0 text-left lg:grid-cols-[minmax(0,1fr)_42%]"
                  key={product.id}
                  onClick={() => openOrderModal(product)}
                  type="button"
                >
                  <div className="flex min-h-[260px] flex-col justify-between bg-[#fffaf5] p-6 md:p-8">
                    <div>
                      <span className="mb-4 inline-flex rounded-full bg-amber px-3 py-1 text-[10px] font-black uppercase text-charcoal-black">
                        {product.tag}
                      </span>
                      <p className="text-xs font-bold uppercase tracking-widest text-primary">Quảng cáo hôm nay</p>
                      <h2 className="mt-3 max-w-xl text-3xl font-black leading-tight text-charcoal-black md:text-5xl">
                        {product.name}
                      </h2>
                      <p className="mt-4 max-w-lg text-sm leading-6 text-on-surface-variant md:text-base">
                        {product.desc}
                      </p>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-white px-4 py-2 text-lg font-black text-primary shadow-sm">
                        {formatPrice(product.price)}
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-bold text-[#8c6a5a] shadow-sm">
                        <Star className="fill-amber text-amber" size={13} />
                        {product.rating} · {product.sold.toLocaleString("vi-VN")} đã bán
                      </span>
                      <span className="rounded-full bg-emerald px-4 py-2 text-sm font-black text-white">
                        Chọn món
                      </span>
                    </div>
                  </div>
                  <div className={`${product.bg} relative min-h-[260px] overflow-hidden lg:min-h-[360px]`}>
                    <Image
                      alt={product.name}
                      className="object-cover"
                      fill
                      sizes="(min-width: 1024px) 42vw, 100vw"
                      src={product.image}
                      unoptimized
                    />
                  </div>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-[#f1e6dc] px-5 py-3">
              <p className="text-xs font-semibold text-on-surface-variant">Banner tự chạy, có thể chọn slide</p>
              <div className="flex gap-2">
                {featuredProducts.map((product, index) => (
                  <button
                    aria-label={`Chuyển đến banner ${product.name}`}
                    className={`h-2 rounded-full transition-all ${
                      activePromo === index ? "w-8 bg-primary" : "w-2 bg-[#d9c8b8] hover:bg-[#bda995]"
                    }`}
                    key={product.id}
                    onClick={() => setActivePromo(index)}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-[#eadfd4] bg-white p-5 shadow-sm">
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Lựa chọn thực đơn</p>
                  <h2 className="mt-1 text-xl font-black text-charcoal-black">Danh mục</h2>
                </div>
                <div className="space-y-2">
                  {MENU_CATEGORIES.map((category) => (
                    <button
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                        activeCategory === category.id
                          ? "bg-primary font-bold text-white shadow-sm"
                          : "bg-[#fffaf5] font-semibold text-on-surface-variant hover:bg-emerald/10 hover:text-primary"
                      }`}
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      type="button"
                    >
                      <span>{category.name}</span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          activeCategory === category.id ? "bg-white/20 text-white" : "bg-white text-on-surface-variant"
                        }`}
                      >
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-5 rounded-xl bg-[#fffaf5] p-4">
                  <p className="text-sm font-bold text-charcoal-black">Đơn hiện tại</p>
                  <p className="mt-1 text-xs text-on-surface-variant">{cartCount} món trong giỏ</p>
                  <button
                    className="mt-3 w-full rounded-xl bg-amber px-4 py-3 text-sm font-black text-charcoal-black transition-transform hover:scale-[1.01]"
                    onClick={openCartPage}
                    type="button"
                  >
                    Xem giỏ hàng
                  </button>
                </div>
              </div>
            </aside>

            <div className="min-w-0">
              <div className="sticky top-16 z-30 mb-8 rounded-2xl border border-[#eadfd4] bg-white/95 p-4 shadow-sm backdrop-blur">
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_210px]">
                  <label className="flex h-12 items-center gap-3 rounded-xl border border-[#eadfd4] bg-[#fffaf5] px-4 text-sm text-on-surface-variant">
                    <Search size={18} />
                    <input
                      className="h-full min-w-0 flex-1 bg-transparent text-charcoal-black outline-none placeholder:text-[#9d8b78]"
                      onChange={(event) => setSearchValue(event.target.value)}
                      placeholder="Tìm trà sữa, ô long, matcha..."
                      value={searchValue}
                    />
                  </label>
                  <label className="flex h-12 items-center gap-3 rounded-xl border border-[#eadfd4] bg-[#fffaf5] px-4 text-sm text-on-surface-variant">
                    <SlidersHorizontal size={18} />
                    <select
                      className="h-full min-w-0 flex-1 bg-transparent text-charcoal-black outline-none"
                      onChange={(event) => setSortMode(event.target.value)}
                      value={sortMode}
                    >
                      <option value="popular">Bán chạy</option>
                      <option value="rating">Đánh giá cao</option>
                      <option value="price-asc">Giá thấp đến cao</option>
                      <option value="price-desc">Giá cao đến thấp</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black text-charcoal-black">
                    {MENU_CATEGORIES.find((category) => category.id === activeCategory)?.name}
                  </h2>
                  <p className="mt-1 text-sm text-on-surface-variant">{filteredProducts.length} món phù hợp</p>
                </div>
                {goToOrderButton}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <article
                    className="group overflow-hidden rounded-2xl border border-[#eadfd4] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#cdb8a5] hover:shadow-xl"
                    key={product.id}
                  >
                    <button className="block w-full text-left" onClick={() => openOrderModal(product)} type="button">
                      <div className={`${product.bg} relative aspect-[4/3] overflow-hidden`}>
                        <Image
                          alt={product.name}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          fill
                          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                          src={product.image}
                          unoptimized
                        />
                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/45 to-transparent px-4 pb-4 pt-10">
                          {product.tag ? (
                            <span className="rounded-full bg-amber px-3 py-1 text-[10px] font-black uppercase text-charcoal-black">
                              {product.tag}
                            </span>
                          ) : (
                            <span />
                          )}
                          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#8c6a5a]">
                          <Star className="fill-amber text-amber" size={13} />
                          {product.rating} <span className="text-[#c9b9ac]">|</span> Đã bán {product.sold.toLocaleString("vi-VN")}
                        </div>
                        <h3 className="line-clamp-2 min-h-12 text-lg font-black leading-tight text-charcoal-black">
                          {product.name}
                        </h3>
                        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-on-surface-variant">{product.desc}</p>
                      </div>
                    </button>
                    <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-2 border-t border-[#f1e6dc] p-4">
                      <button
                        className="flex h-11 items-center justify-center rounded-xl bg-emerald text-white transition-colors hover:bg-primary"
                        onClick={() => openOrderModal(product)}
                        type="button"
                      >
                        <Plus size={18} />
                      </button>
                      <button
                        className="h-11 rounded-xl bg-amber px-4 text-sm font-black text-charcoal-black transition-transform hover:scale-[1.01] active:scale-[0.98]"
                        onClick={() => openOrderModal(product)}
                        type="button"
                      >
                        Đặt ngay
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <MenuFooter />

      {selectedProduct && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-charcoal-black/45 px-4 py-6 backdrop-blur-sm sm:items-center">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eadfd4] bg-white p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Cấu hình món</p>
                <h3 className="text-xl font-bold text-charcoal-black">{selectedProduct.name}</h3>
              </div>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface"
                onClick={() => setSelectedProduct(null)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-6 p-5 md:grid-cols-[210px_minmax(0,1fr)]">
              <div>
                <div className={`${selectedProduct.bg} relative aspect-square overflow-hidden rounded-2xl`}>
                  <Image
                    alt={selectedProduct.name}
                    className="object-cover"
                    fill
                    sizes="210px"
                    src={selectedProduct.image}
                    unoptimized
                  />
                </div>
                <p className="mt-3 text-sm leading-5 text-on-surface-variant">{selectedProduct.desc}</p>
              </div>
              <div className="space-y-5">
                <OptionGroup
                  active={size}
                  items={[
                    { label: "M", value: "M", hint: "Giá gốc" },
                    { label: "L", value: "L", hint: "+7.000đ" },
                  ]}
                  label="Size"
                  onChange={(value) => setSize(value as CartItem["size"])}
                />
                <OptionGroup
                  active={sugar}
                  items={["30%", "50%", "70%", "100%"].map((value) => ({ label: value, value }))}
                  label="Đường"
                  onChange={setSugar}
                />
                <OptionGroup
                  active={ice}
                  items={["Ít đá", "50%", "70%", "100%"].map((value) => ({ label: value, value }))}
                  label="Đá"
                  onChange={setIce}
                />

                <div>
                  <p className="mb-2 text-sm font-bold text-charcoal-black">Topping</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {TOPPINGS.map((topping) => {
                      const active = selectedToppings.includes(topping.id);
                      return (
                        <button
                          className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                            active ? "border-primary bg-emerald/10 text-primary" : "border-[#eadfd4] bg-white text-on-surface"
                          }`}
                          key={topping.id}
                          onClick={() =>
                            setSelectedToppings((current) =>
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

                <div className="grid gap-3 border-t border-[#eadfd4] pt-5 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
                  <QuantityStepper onChange={setQuantity} value={quantity} />
                  <button
                    className="flex h-12 items-center justify-center rounded-xl bg-emerald px-5 text-sm font-black text-white transition-colors hover:bg-primary"
                    onClick={() => addConfiguredItem(false)}
                    type="button"
                  >
                    Thêm vào giỏ
                  </button>
                  <button
                    className="flex h-12 items-center justify-center rounded-xl bg-amber px-5 text-sm font-black text-charcoal-black transition-transform hover:scale-[1.01] active:scale-[0.98]"
                    onClick={buyConfiguredItemNow}
                    type="button"
                  >
                    Đặt hàng ngay - {formatPrice(currentPrice * quantity)}
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

function QuantityStepper({
  compact = false,
  onChange,
  value,
}: {
  compact?: boolean;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <div className={`flex items-center rounded-full bg-surface-container ${compact ? "gap-2 px-2 py-1" : "gap-4 px-3 py-2"}`}>
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

function MenuFooter() {
  return (
    <footer className="bg-[#432010] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
              <span className="font-black">C</span>
            </div>
            <div>
              <p className="font-black">CheNow</p>
              <p className="text-[10px] uppercase tracking-widest text-white/50">Đậm vị thiên nhiên</p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/60">
            Thức uống từ trà, sữa tươi và nông sản Việt được pha chế mỗi ngày để giữ vị tự nhiên, dễ uống.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold">Thực đơn</p>
          {["Món nổi bật", "Trà sữa", "Trà trái cây", "Macchiato"].map((item) => (
            <a className="block py-1 text-sm text-white/60 transition-colors hover:text-white" href="#" key={item}>
              {item}
            </a>
          ))}
        </div>
        <div>
          <p className="mb-3 text-sm font-bold">Hỗ trợ</p>
          {["Chính sách giao hàng", "Đổi trả & hoàn tiền", "Điều khoản thành viên", "Liên hệ cửa hàng"].map((item) => (
            <a className="block py-1 text-sm text-white/60 transition-colors hover:text-white" href="#" key={item}>
              {item}
            </a>
          ))}
        </div>
        <div>
          <p className="mb-3 text-sm font-bold">Liên hệ</p>
          <div className="space-y-2 text-sm text-white/60">
            <p>Hotline: 1800 6272</p>
            <p>Email: hello@chenow.vn</p>
            <p>12 Hàng Bài, Hoàn Kiếm, Hà Nội</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/35">
        © 2026 CheNow. All rights reserved.
      </div>
    </footer>
  );
}
