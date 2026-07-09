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
import { useCategoriesQuery } from "@/services/controllers/categories/CategoriesQueries";
import { useCategorySizesQuery } from "@/services/controllers/category-sizes/CategorySizesQueries";
import { useCustomerProductsQuery } from "@/services/controllers/customer-products/CustomerProductsQueries";
import { useToppingsQuery } from "@/services/controllers/toppings/ToppingsQueries";
import {
  CategorySize,
  CustomerCartItem,
  CustomerProduct,
  Topping as ApiTopping,
} from "@/services/types/apiType";
import {
  FALLBACK_PRODUCT_IMAGE,
  MENU_CATEGORIES,
  NAV_LINKS,
  PRODUCT_BACKGROUNDS,
  PRODUCTS,
} from "@/common/mocks/customerMenu";

type Product = {
  id: number;
  categoryId: number | string;
  name: string;
  price: number;
  tag?: string;
  rating: number;
  sold: number;
  desc: string;
  image: string;
  bg: string;
};
type Topping = {
  id: number | string;
  name: string;
  price: number;
};
type SizeOption = {
  categorySizeId?: number;
  code: string;
  extraPrice: number;
  label: string;
  value: string;
};

const formatPrice = (value: number) => `${value.toLocaleString("vi-VN")}đ`;
const toProductCard = (product: CustomerProduct, index: number): Product => ({
  id: product.id,
  categoryId: product.categoryId,
  name: product.productName,
  price: Number(product.price),
  tag: index < 4 ? (index % 2 === 0 ? "Mới" : "Bán chạy") : undefined,
  rating: 4.6 + (index % 4) / 10,
  sold: 240 + product.id * 17,
  desc:
    product.description ||
    product.categoryName ||
    "Thức uống được pha chế mỗi ngày từ nguyên liệu chọn lọc.",
  image: product.imageUrl || FALLBACK_PRODUCT_IMAGE,
  bg: PRODUCT_BACKGROUNDS[index % PRODUCT_BACKGROUNDS.length],
});
const getNumericCategoryId = (product?: Product | null) => {
  const categoryId = Number(product?.categoryId);
  return Number.isFinite(categoryId) ? categoryId : undefined;
};
const toSizeOption = (
  size: CategorySize,
  categoryId: number,
): SizeOption | null => {
  const category = size.category.find((item) => item.id === categoryId);

  if (!category) return null;

  return {
    categorySizeId: category.categorySizeId,
    code: size.code,
    extraPrice: Number(category.extraPrice ?? 0),
    label: size.name,
    value: String(size.id),
  };
};
const toToppingOption = (topping: ApiTopping): Topping => ({
  id: topping.id,
  name: topping.name,
  price: Number(topping.price ?? 0),
});
const readStoredCart = () => {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(
      window.localStorage.getItem("chenow-cart") ?? "[]",
    ) as CustomerCartItem[];
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
  const [cart, setCart] = useState<CustomerCartItem[]>(readStoredCart);
  const [menuOpen, setMenuOpen] = useState(false);
  const [size, setSize] = useState("");
  const [sugar, setSugar] = useState("70%");
  const [ice, setIce] = useState("70%");
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<
    Array<number | string>
  >([]);
  const [activePromo, setActivePromo] = useState(0);

  const categoryId =
    activeCategory === "all" || activeCategory === "hot"
      ? undefined
      : Number(activeCategory);
  const selectedCategoryId = getNumericCategoryId(selectedProduct);
  const productSort =
    sortMode === "price-asc" || sortMode === "price-desc"
      ? "price"
      : sortMode === "popular"
        ? "id"
        : "productName";
  const productOrder = sortMode === "price-asc" ? "ASC" : "DESC";
  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useCategoriesQuery({
      limit: 200,
      status: "active",
    });
  const {
    data: customerProductsResponse,
    isError: isCustomerProductsError,
    isLoading: isCustomerProductsLoading,
  } = useCustomerProductsQuery({
    categoryId,
    limit: 200,
    order: productOrder,
    page: 1,
    searchValue: searchValue.trim() || undefined,
    sort: productSort,
  });
  const { data: categorySizesResponse, isLoading: isCategorySizesLoading } =
    useCategorySizesQuery({
      categoryId: selectedCategoryId ?? -1,
      limit: 200,
      order: "ASC",
    });
  const { data: toppingsResponse, isLoading: isToppingsLoading } =
    useToppingsQuery({
      categoryId: selectedCategoryId ?? -1,
      limit: 200,
      order: "ASC",
    });

  const apiProducts = useMemo(
    () =>
      customerProductsResponse?.data.map((product, index) =>
        toProductCard(product, index),
      ) ?? [],
    [customerProductsResponse?.data],
  );
  const productsSource: Product[] =
    customerProductsResponse && !isCustomerProductsError
      ? apiProducts
      : PRODUCTS;

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    window.localStorage.setItem("chenow-cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    const products = productsSource.filter((product) => {
      const matchesCategory =
        activeCategory === "all" ||
        String(product.categoryId) === activeCategory ||
        (activeCategory === "hot" && product.tag === "Bán chạy");
      const matchesSearch =
        !keyword ||
        product.name.toLowerCase().includes(keyword) ||
        product.desc.toLowerCase().includes(keyword);
      return matchesCategory && matchesSearch;
    });

    return [...products].sort((a, b) => {
      if (sortMode === "price-asc") return a.price - b.price;
      if (sortMode === "price-desc") return b.price - a.price;
      if (sortMode === "rating") return b.rating - a.rating;
      return b.sold - a.sold;
    });
  }, [activeCategory, productsSource, searchValue, sortMode]);

  const menuCategories = useMemo(() => {
    const categories = categoriesResponse?.data ?? [];

    if (!categoriesResponse) {
      return MENU_CATEGORIES;
    }

    return [
      {
        id: "all",
        name: "Tất cả",
        count:
          customerProductsResponse?.metadata.pagination.total ??
          productsSource.length,
      },
      {
        id: "hot",
        name: "Món nổi bật",
        count: productsSource.filter((product) => product.tag).length,
      },
      ...categories.map((category) => ({
        id: String(category.id),
        name: category.categoryName,
        count: productsSource.filter(
          (product) => product.categoryId === category.id,
        ).length,
      })),
    ];
  }, [
    categoriesResponse,
    customerProductsResponse?.metadata.pagination.total,
    productsSource,
  ]);

  const featuredProducts = useMemo(
    () => productsSource.filter((product) => product.tag).slice(0, 4),
    [productsSource],
  );

  useEffect(() => {
    if (featuredProducts.length <= 1) return;

    const timer = window.setInterval(() => {
      setActivePromo((current) => (current + 1) % featuredProducts.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [featuredProducts.length]);

  const activePromoIndex =
    featuredProducts.length > 0 ? activePromo % featuredProducts.length : 0;
  const sizeOptions = useMemo(() => {
    if (!selectedCategoryId) return [];

    return (categorySizesResponse?.data ?? [])
      .map((item) => toSizeOption(item, selectedCategoryId))
      .filter((item): item is SizeOption => Boolean(item));
  }, [categorySizesResponse?.data, selectedCategoryId]);
  const toppingOptions = useMemo(
    () => (toppingsResponse?.data ?? []).map(toToppingOption),
    [toppingsResponse?.data],
  );
  const selectedSize =
    sizeOptions.find((item) => item.value === size) ?? sizeOptions[0];
  const selectedToppingsTotal = selectedToppings.reduce<number>(
    (sum, id) =>
      sum +
      Number(toppingOptions.find((topping) => topping.id === id)?.price ?? 0),
    0,
  );

  const currentPrice =
    Number(selectedProduct?.price ?? 0) +
    Number(selectedSize?.extraPrice ?? 0) +
    selectedToppingsTotal;

  const openOrderModal = (product: Product) => {
    setSelectedProduct(product);
    setSize("");
    setSugar("70%");
    setIce("70%");
    setQuantity(1);
    setSelectedToppings([]);
  };

  const createConfiguredItem = () => {
    if (!selectedProduct || !selectedSize) return null;

    const toppings = toppingOptions.filter((topping) =>
      selectedToppings.includes(topping.id),
    );
    const optionKey = [
      selectedProduct.id,
      selectedSize.value,
      sugar,
      ice,
      toppings.map((topping) => topping.id).join("-"),
    ].join("|");

    return {
      key: optionKey,
      product: selectedProduct,
      size: selectedSize.label,
      sugar,
      ice,
      toppings,
      quantity,
      linePrice: currentPrice,
    };
  };

  const mergeCartItem = (current: CustomerCartItem[], item: CustomerCartItem) => {
    const existing = current.find((cartItem) => cartItem.key === item.key);
    if (existing) {
      return current.map((cartItem) =>
        cartItem.key === item.key
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem,
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
              <p className="text-lg font-black leading-none tracking-tight text-[#432010]">
                CheNow
              </p>
              <p className="text-[9px] uppercase leading-none tracking-widest text-[#8c6a5a]">
                Đậm vị thiên nhiên
              </p>
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
            <button
              className="p-2 lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="flex flex-col gap-1 border-t border-[#eadfd4] bg-white px-6 py-4 lg:hidden">
            {NAV_LINKS.map((link) => (
              <a
                className="border-b border-[#f5ede4] py-2 text-sm font-medium text-[#5f5148] last:border-0"
                href="#"
                key={link}
              >
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
                Thực đơn CheNow
              </span>
              <h1 className="text-4xl font-black leading-[1.08] text-charcoal-black md:text-6xl">
                Chọn món yêu thích,
                <span className="block text-emerald">
                  đặt nhanh trong vài bước.
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-on-surface-variant">
                Xem giá, chọn size, thêm topping và gửi đơn ngay trên website.
                CheNow sẽ chuẩn bị đồ uống sau khi đơn được xác nhận.
              </p>
            </div>
            <div className="rounded-2xl border border-[#eadfd4] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald/10 text-primary">
                  <Check size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-charcoal-black">
                    Freeship cho đơn từ 120.000đ
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Thời gian giao dự kiến 25-35 phút tại Hà Nội.
                  </p>
                </div>
              </div>
              <div className="mt-5">{goToOrderButton}</div>
            </div>
          </div>

          <div className="mb-10 overflow-hidden rounded-2xl border border-[#eadfd4] bg-white shadow-sm">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${activePromoIndex * 100}%)` }}
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
                      <p className="text-xs font-bold uppercase tracking-widest text-primary">
                        Gợi ý hôm nay
                      </p>
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
                        {product.rating} ·{" "}
                        {product.sold.toLocaleString("vi-VN")} đã bán
                      </span>
                      <span className="rounded-full bg-emerald px-4 py-2 text-sm font-black text-white">
                        Chọn món
                      </span>
                    </div>
                  </div>
                  <div
                    className={`${product.bg} relative min-h-[260px] overflow-hidden lg:min-h-[360px]`}
                  >
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
              <p className="text-xs font-semibold text-on-surface-variant">
                Món nổi bật được cập nhật theo từng ngày
              </p>
              <div className="flex gap-2">
                {featuredProducts.map((product, index) => (
                  <button
                    aria-label={`Chuyển đến banner ${product.name}`}
                    className={`h-2 rounded-full transition-all ${
                      activePromoIndex === index
                        ? "w-8 bg-primary"
                        : "w-2 bg-[#d9c8b8] hover:bg-[#bda995]"
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
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    Lựa chọn thực đơn
                  </p>
                  <h2 className="mt-1 text-xl font-black text-charcoal-black">
                    Danh mục
                  </h2>
                </div>
                <div className="space-y-2">
                  {menuCategories.map((category) => (
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
                          activeCategory === category.id
                            ? "bg-white/20 text-white"
                            : "bg-white text-on-surface-variant"
                        }`}
                      >
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-5 rounded-xl bg-[#fffaf5] p-4">
                  <p className="text-sm font-bold text-charcoal-black">
                    Đơn hiện tại
                  </p>
                  <p className="mt-1 text-xs text-on-surface-variant">
                    {cartCount} món trong giỏ
                  </p>
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
                    {
                      menuCategories.find(
                        (category) => category.id === activeCategory,
                      )?.name
                    }
                  </h2>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {filteredProducts.length} món phù hợp
                  </p>
                  {(isCustomerProductsLoading || isCategoriesLoading) && (
                    <p className="mt-1 text-xs font-semibold text-primary">
                      Đang tải dữ liệu menu...
                    </p>
                  )}
                  {isCustomerProductsError && (
                    <p className="mt-1 text-xs font-semibold text-error">
                      Chưa tải được API, đang hiển thị dữ liệu mẫu.
                    </p>
                  )}
                </div>
                {goToOrderButton}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <article
                    className="group overflow-hidden rounded-2xl border border-[#eadfd4] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#cdb8a5] hover:shadow-xl"
                    key={product.id}
                  >
                    <button
                      className="block w-full text-left"
                      onClick={() => openOrderModal(product)}
                      type="button"
                    >
                      <div
                        className={`${product.bg} relative aspect-[4/3] overflow-hidden`}
                      >
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
                          {product.rating}{" "}
                          <span className="text-[#c9b9ac]">|</span> Đã bán{" "}
                          {product.sold.toLocaleString("vi-VN")}
                        </div>
                        <h3 className="line-clamp-2 min-h-12 text-lg font-black leading-tight text-charcoal-black">
                          {product.name}
                        </h3>
                        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-on-surface-variant">
                          {product.desc}
                        </p>
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
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Cấu hình món
                </p>
                <h3 className="text-xl font-bold text-charcoal-black">
                  {selectedProduct.name}
                </h3>
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
                <div
                  className={`${selectedProduct.bg} relative aspect-square overflow-hidden rounded-2xl`}
                >
                  <Image
                    alt={selectedProduct.name}
                    className="object-cover"
                    fill
                    sizes="210px"
                    src={selectedProduct.image}
                    unoptimized
                  />
                </div>
                <p className="mt-3 text-sm leading-5 text-on-surface-variant">
                  {selectedProduct.desc}
                </p>
              </div>
              <div className="space-y-5">
                <OptionGroup
                  active={selectedSize?.value ?? ""}
                  items={sizeOptions.map((item) => ({
                    label: item.label,
                    value: item.value,
                    hint:
                      item.extraPrice > 0
                        ? `+${formatPrice(item.extraPrice)}`
                        : "Gia goc",
                  }))}
                  label="Size"
                  onChange={setSize}
                />
                <OptionGroup
                  active={sugar}
                  items={["30%", "50%", "70%", "100%"].map((value) => ({
                    label: value,
                    value,
                  }))}
                  label="Đường"
                  onChange={setSugar}
                />
                <OptionGroup
                  active={ice}
                  items={["Ít đá", "50%", "70%", "100%"].map((value) => ({
                    label: value,
                    value,
                  }))}
                  label="Đá"
                  onChange={setIce}
                />

                <div>
                  <p className="mb-2 text-sm font-bold text-charcoal-black">
                    Topping
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {isToppingsLoading ? (
                      <p className="col-span-full rounded-xl border border-[#eadfd4] bg-white px-3 py-2 text-sm text-on-surface-variant">
                        Dang tai topping...
                      </p>
                    ) : toppingOptions.length === 0 ? (
                      <p className="col-span-full rounded-xl border border-[#eadfd4] bg-white px-3 py-2 text-sm text-on-surface-variant">
                        Danh muc nay chua co topping.
                      </p>
                    ) : (
                      toppingOptions.map((topping) => {
                        const active = selectedToppings.includes(topping.id);
                        return (
                          <button
                            className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                              active
                                ? "border-primary bg-emerald/10 text-primary"
                                : "border-[#eadfd4] bg-white text-on-surface"
                            }`}
                            key={topping.id}
                            onClick={() =>
                              setSelectedToppings((current) =>
                                active
                                  ? current.filter((id) => id !== topping.id)
                                  : [...current, topping.id],
                              )
                            }
                            type="button"
                          >
                            <span className="font-semibold">
                              {topping.name}
                            </span>
                            <span className="text-xs">
                              {formatPrice(topping.price)}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="grid gap-3 border-t border-[#eadfd4] pt-5 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
                  <QuantityStepper onChange={setQuantity} value={quantity} />
                  <button
                    className="flex h-12 items-center justify-center rounded-xl bg-emerald px-5 text-sm font-black text-white transition-colors hover:bg-primary"
                    disabled={isCategorySizesLoading || !selectedSize}
                    onClick={() => addConfiguredItem(false)}
                    type="button"
                  >
                    Thêm vào giỏ
                  </button>
                  <button
                    className="flex h-12 items-center justify-center rounded-xl bg-amber px-5 text-sm font-black text-charcoal-black transition-transform hover:scale-[1.01] active:scale-[0.98]"
                    disabled={isCategorySizesLoading || !selectedSize}
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
              active === item.value
                ? "border-primary bg-emerald/10 text-primary"
                : "border-[#eadfd4] bg-white text-on-surface"
            }`}
            key={item.value}
            onClick={() => onChange(item.value)}
            type="button"
          >
            {item.label}
            {item.hint && (
              <span className="mt-1 block text-[11px] font-medium text-on-surface-variant">
                {item.hint}
              </span>
            )}
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
    <div
      className={`flex items-center rounded-full bg-surface-container ${compact ? "gap-2 px-2 py-1" : "gap-4 px-3 py-2"}`}
    >
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
              <p className="text-[10px] uppercase tracking-widest text-white/50">
                Đậm vị thiên nhiên
              </p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/60">
            Thức uống từ trà, sữa tươi và nông sản Việt được pha chế mỗi ngày để
            giữ vị tự nhiên, dễ uống.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold">Thực đơn</p>
          {["Món nổi bật", "Trà sữa", "Trà trái cây", "Macchiato"].map(
            (item) => (
              <a
                className="block py-1 text-sm text-white/60 transition-colors hover:text-white"
                href="#"
                key={item}
              >
                {item}
              </a>
            ),
          )}
        </div>
        <div>
          <p className="mb-3 text-sm font-bold">Hỗ trợ</p>
          {[
            "Chính sách giao hàng",
            "Đổi trả & hoàn tiền",
            "Điều khoản thành viên",
            "Liên hệ cửa hàng",
          ].map((item) => (
            <a
              className="block py-1 text-sm text-white/60 transition-colors hover:text-white"
              href="#"
              key={item}
            >
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
