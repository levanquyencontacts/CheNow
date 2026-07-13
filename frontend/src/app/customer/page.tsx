"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BANNERS,
  FEATURED_PRODUCTS,
  NEWS,
  STATS,
  STORES,
  VALUES,
} from "@/common/mocks/customerHome";
import {
  MapPin,
  Star,
  ChevronRight,
  Play,
  Apple,
  Download,
} from "lucide-react";

/* ─── COMPONENT ─── */
export default function CustomerHomePage() {
  const [activeBanner, setActiveBanner] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const banner = BANNERS[activeBanner];

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#432010] font-sans">
      {/* ── HERO BANNER CAROUSEL ── */}
      <section className="relative flex min-h-screen flex-col overflow-hidden pt-16 transition-all duration-500">
        <Image
          alt={banner.title}
          className="object-cover opacity-45 transition-transform duration-700"
          fill
          priority
          sizes="100vw"
          src={banner.image}
          style={{ objectPosition: banner.position }}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
        <div className="absolute inset-0 bg-[#1b4332]/20" />
        <div className="relative z-10 flex flex-1 items-center">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 text-white">
            <div className="max-w-2xl">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-black tracking-widest mb-4"
                style={{
                  background: banner.accent + "30",
                  color: banner.accent,
                  border: `1px solid ${banner.accent}50`,
                }}
              >
                {banner.badge}
              </span>
              <h1 className="text-5xl md:text-7xl font-black leading-none mb-4 tracking-tight">
                {banner.title}
              </h1>
              <p className="text-lg md:text-xl text-white/70 mb-8 max-w-md leading-relaxed">
                {banner.sub}
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/customer/menu"
                  className="px-8 py-3.5 bg-white text-[#2d6a4f] font-bold rounded-full hover:scale-105 transition-transform shadow-lg text-sm"
                >
                  {banner.cta}
                </Link>
                <Link
                  href="/customer/menu"
                  className="px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors text-sm"
                >
                  Thực đơn
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Banner dots */}
        <div className="relative z-10 flex justify-center gap-3 pb-8">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveBanner(i);
                setAutoPlay(false);
              }}
              onMouseLeave={() => setAutoPlay(true)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === activeBanner ? "bg-white w-8" : "bg-white/30 w-4 hover:bg-white/50"}`}
            />
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-[#2d6a4f]">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6 text-white text-center">
          {STATS.map((s) => (
            <div key={s.value}>
              <p className="text-3xl md:text-4xl font-black">{s.value}</p>
              <p className="text-sm text-white/60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STORY SECTION ── */}
      <section
        className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12"
        id="story"
      >
        <div className="flex-1">
          <p className="text-xs font-black uppercase tracking-widest text-[#2d6a4f] mb-3">
            CheNow Story
          </p>
          <h2 className="text-4xl md:text-5xl font-black leading-tight text-[#432010] mb-6">
            Đậm vị
            <br />
            thiên nhiên,
            <br />
            <span className="text-[#2d6a4f]">trọn vị hạnh phúc</span>
          </h2>
          <p className="text-[#5f5148] leading-relaxed mb-4 max-w-lg">
            Bên cạnh niềm tự hào về những ly trà sữa ngon – sạch – tươi, chúng
            tôi luôn tự tin mang đến khách hàng những trải nghiệm tốt nhất về
            dịch vụ và không gian.
          </p>
          <p className="text-[#5f5148] leading-relaxed mb-8 max-w-lg">
            Mỗi nguyên liệu đều được tuyển chọn kỹ lưỡng từ các vùng nông sản
            Việt Nam nổi tiếng, đảm bảo hương vị tự nhiên và an toàn cho sức
            khỏe.
          </p>
          <button className="flex items-center gap-2 text-sm font-bold text-[#2d6a4f] hover:gap-4 transition-all">
            Tìm hiểu thêm <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          {VALUES.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-5 border border-[#eadfd4] hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="text-3xl mb-3">{item.emoji}</div>
              <p className="font-bold text-[#432010] text-sm">{item.title}</p>
              <p className="text-xs text-[#8c6a5a] mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="bg-[#f5ede4] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#2d6a4f] mb-2">
                Sản phẩm nổi bật
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-[#432010]">
                Khám phá hương vị
              </h2>
            </div>
            <Link
              href="/customer/menu"
              className="flex items-center gap-1.5 text-sm font-bold text-[#2d6a4f] hover:gap-3 transition-all self-start md:self-auto"
            >
              Xem thêm <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_PRODUCTS.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#eadfd4] hover:shadow-xl hover:-translate-y-2 transition-all group cursor-pointer"
              >
                <Link
                  href="/customer/menu"
                  className={`block h-48 ${p.color} relative overflow-hidden`}
                >
                  <Image
                    alt={p.name}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    src={p.image}
                    unoptimized
                  />
                  {p.tag && (
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full ${p.tag === "Mới" ? "bg-[#2d6a4f] text-white" : "bg-[#c07941] text-white"}`}
                    >
                      {p.tag}
                    </span>
                  )}
                  {p.oldPrice && (
                    <span className="absolute top-3 right-3 text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full">
                      -{Math.round((1 - p.price / p.oldPrice) * 100)}%
                    </span>
                  )}
                </Link>
                <div className="p-5">
                  <Link
                    href="/customer/menu"
                    className="font-bold text-base text-[#432010] hover:text-[#2d6a4f] transition-colors"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-[#8c6a5a] mt-1">{p.desc}</p>
                  <div className="flex items-center gap-1 mt-3">
                    <Star size={11} className="fill-[#f5a623] text-[#f5a623]" />
                    <span className="text-xs font-semibold text-[#432010]">
                      {p.rating}
                    </span>
                    <span className="text-xs text-[#c9b9ac]">
                      ({p.reviews})
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="font-black text-base text-[#2d6a4f]">
                        {p.price.toLocaleString("vi-VN")}đ
                      </span>
                      {p.oldPrice && (
                        <span className="text-xs text-[#c9b9ac] line-through ml-1.5">
                          {p.oldPrice.toLocaleString("vi-VN")}đ
                        </span>
                      )}
                    </div>
                    <Link
                      href="/customer/menu"
                      className="w-10 h-10 bg-[#2d6a4f] text-white rounded-full flex items-center justify-center text-xl font-bold hover:bg-[#1b4332] hover:scale-110 transition-all shadow-md"
                    >
                      +
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FRANCHISE SECTION ── */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] rounded-3xl p-8 text-white">
          <p className="text-xs font-black uppercase tracking-widest text-[#a8d5b5] mb-3">
            Nhượng quyền
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Gia nhập đề chế CheNow
          </h2>
          <p className="text-white/70 mb-6">
            Là một trong 300+ cửa hàng CheNow trên toàn quốc. Cơ hội kinh doanh
            lâu dài với thương hiệu được yêu thích bởi hơn 5 triệu khách hàng.
          </p>
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#a8d5b5]" />
              <span className="text-sm">Hỗ trợ huấn luyện toàn diện</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#a8d5b5]" />
              <span className="text-sm">
                Cung cấp nguyên liệu chất lượng cao
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#a8d5b5]" />
              <span className="text-sm">Quản lý kinh doanh chuyên nghiệp</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#a8d5b5]" />
              <span className="text-sm">Hệ thống marketing tổng thể</span>
            </div>
          </div>
          <button className="px-8 py-3.5 bg-white text-[#2d6a4f] font-bold rounded-full hover:scale-105 transition-transform shadow-lg">
            Tìm hiểu thêm
          </button>
        </div>
        <div className="flex-1 text-center">
          <div className="text-7xl mb-6">🏪</div>
          <p className="text-4xl font-black text-[#432010] mb-4">300+</p>
          <p className="text-lg text-[#5f5148] mb-8">
            Cửa hàng CheNow trên toàn quốc
          </p>
          <div className="bg-[#f5ede4] rounded-2xl p-8">
            <p className="text-sm text-[#432010] mb-4">
              <span className="font-black text-lg text-[#2d6a4f]">10+</span> năm
              kinh nghiệm
            </p>
            <p className="text-sm text-[#432010]">
              <span className="font-black text-lg text-[#2d6a4f]">5M+</span>{" "}
              khách hàng thân thiết
            </p>
          </div>
        </div>
      </section>

      {/* ── VIDEO SECTION ── */}
      <section className="bg-gradient-to-b from-[#432010] to-[#2d6a4f] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-[#a8d5b5] mb-3">
              Khám phá
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Hành trình CheNow
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative group cursor-pointer rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all z-10 flex items-center justify-center">
                <Play
                  size={64}
                  className="text-white group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="bg-gradient-to-br from-[#74c69d] to-[#2d6a4f] h-64 flex items-center justify-center text-6xl">
                🍵
              </div>
              <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white font-bold text-sm">
                Ủ trà 40 giờ - Công thức độc quyền CheNow
              </p>
            </div>

            <div className="relative group cursor-pointer rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all z-10 flex items-center justify-center">
                <Play
                  size={64}
                  className="text-white group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="bg-gradient-to-br from-[#c9659a] to-[#7f5539] h-64 flex items-center justify-center text-6xl">
                🌿
              </div>
              <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white font-bold text-sm">
                Từ nông trại Việt - Đến ly trà của bạn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROMO FULLWIDTH ── */}
      <section
        className="relative overflow-hidden bg-gradient-to-r from-[#432010] to-[#7f5539] py-16"
        id="promotions"
      >
        <div className="absolute inset-y-0 right-0 w-1/2 bg-white/5" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
          <div>
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest mb-3">
              Ưu đãi đặc biệt
            </span>
            <h3 className="text-3xl md:text-4xl font-black mb-2">
              Mua 2 Tặng 1 mỗi thứ Sáu
            </h3>
            <p className="text-white/70">
              Áp dụng cho tất cả đồ uống từ 35.000đ. Không giới hạn số lượng.
            </p>
          </div>
          <div className="flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center">
            <Link
              href="/customer/menu"
              className="flex-shrink-0 bg-white text-[#432010] font-black px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-xl text-center"
            >
              Đặt hàng ngay
            </Link>
            <Link
              href="/customer/menu"
              className="relative h-28 w-full overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-xl sm:w-44"
            >
              <Image
                alt="Ưu đãi đồ uống CheNow"
                className="object-cover"
                fill
                sizes="176px"
                src="https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=500&q=85"
                unoptimized
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEWS ── */}
      <section className="max-w-7xl mx-auto px-6 py-16" id="news">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#2d6a4f] mb-2">
              Tin tức & Khuyến mãi
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-[#432010]">
              Khám phá CheNow
            </h2>
          </div>
          <button className="hidden md:flex items-center gap-1.5 text-sm font-bold text-[#2d6a4f] hover:gap-3 transition-all">
            Xem thêm <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {NEWS.map((n) => (
            <div key={n.id} className="group cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-[#e8f5e9] to-[#f5ede4] rounded-2xl mb-4 flex items-center justify-center text-6xl group-hover:shadow-lg transition-shadow">
                {n.emoji}
              </div>
              <span className="text-xs font-bold text-[#2d6a4f] bg-[#e8f5e9] px-2.5 py-0.5 rounded-full">
                {n.tag}
              </span>
              <h3 className="font-bold text-[#432010] mt-2 leading-snug group-hover:text-[#2d6a4f] transition-colors line-clamp-2">
                {n.title}
              </h3>
              <p className="text-xs text-[#b8a89a] mt-1.5">{n.date}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STORES ── */}
      <section className="bg-[#1b4332] py-16" id="stores">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-black uppercase tracking-widest text-[#a8d5b5] mb-2">
            Hệ thống cửa hàng
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-8">
            Tìm CheNow gần bạn
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {STORES.map((s) => (
              <div
                key={s.name}
                className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10 hover:bg-white/20 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2d6a4f] flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white text-sm">{s.name}</p>
                      {s.hot && (
                        <span className="text-[10px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                          HOT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/60 mt-1">{s.addr}</p>
                    <p className="text-xs text-[#a8d5b5] font-semibold mt-1.5">
                      🕐 {s.open}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APP DOWNLOAD ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-widest text-[#a8d5b5] mb-3">
              Ứng dụng di động
            </p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Tải CheNow App
            </h2>
            <p className="text-white/70 mb-8">
              Đặt hàng dễ dàng, nhận ưu đãi độc quyền và theo dõi đơn hàng
              real-time. Tính năng giao dịch nhanh chóng và an toàn.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#2d6a4f] font-bold rounded-full hover:scale-105 transition-transform">
                <Apple size={18} /> App Store
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors">
                <Download size={18} /> Google Play
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 text-8xl md:text-9xl">📱</div>
        </div>
      </section>

    </div>
  );
}
