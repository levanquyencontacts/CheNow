"use client";
import { useState, useEffect } from "react";
import { ShoppingCart, MapPin, Star, Search, Menu, X, ChevronRight, Phone, Mail, Play, Apple, Download } from "lucide-react";

/* ─── DATA ─── */
const NAV_LINKS = ["Giới thiệu", "Sản phẩm", "Khuyến mãi", "Cửa hàng", "Tin tức"];

const BANNERS = [
  { id: 0, emoji: "🧋", badge: "MỚI", title: "Matcha Tươi Nè", sub: "Vị matcha Nhật nguyên chất, hương thơm dịu nhẹ", cta: "Đặt ngay", bg: "from-[#1b4332] via-[#2d6a4f] to-[#386641]", accent: "#a8d5b5" },
  { id: 1, emoji: "🍑", badge: "HOT", title: "Trà Đào Cam Sả", sub: "Vị chua ngọt thanh mát, giải nhiệt mùa hè", cta: "Khám phá", bg: "from-[#7f5539] via-[#9c6b3c] to-[#b07d4a]", accent: "#f5c58a" },
  { id: 2, emoji: "🫧", badge: "ƯU ĐÃI", title: "Mua 2 Tặng 1", sub: "Áp dụng mỗi thứ Sáu cho tất cả đồ uống", cta: "Xem ưu đãi", bg: "from-[#432010] via-[#5c2e18] to-[#7f5539]", accent: "#f0c090" },
];

const FEATURED_PRODUCTS = [
  { id: 1, name: "Trà Sữa Oolong", price: 45000, oldPrice: 55000, tag: "Bán chạy", rating: 4.8, reviews: 120, desc: "Oolong thượng hạng, sữa tươi béo ngậy", emoji: "🧋", color: "from-[#d4a35a] to-[#b07d4a]" },
  { id: 4, name: "Hồng Trà Lài", price: 42000, oldPrice: 48000, tag: "Bán chạy", rating: 4.9, reviews: 156, desc: "Hương hoa lài dịu nhẹ, thơm lừng", emoji: "🌸", color: "from-[#e8a4c8] to-[#c9659a]" },
  { id: 5, name: "Matcha Đá Xay", price: 49000, oldPrice: null, tag: "Mới", rating: 4.5, reviews: 67, desc: "Matcha Nhật nguyên chất, đậm vị", emoji: "🍵", color: "from-[#74c69d] to-[#2d6a4f]" },
];

const VALUES = [
  { emoji: "🌿", title: "Nguyên liệu sạch", desc: "100% nông sản Việt Nam tuyển chọn kỹ lưỡng" },
  { emoji: "🧋", title: "Công thức độc quyền", desc: "Hương vị riêng biệt, không thể lặp lại" },
  { emoji: "🏪", title: "300+ cửa hàng", desc: "Phục vụ khắp toàn quốc, gần bạn nhất" },
  { emoji: "❤️", title: "5M+ khách hàng", desc: "Tin tưởng và yêu thích CheNow" },
];

const NEWS = [
  { id: 1, tag: "Khuyến mãi", title: "Pride Month tại CheNow Vạn Hạnh Mall: Cùng lan tỏa sắc màu yêu thương", date: "20/06/2026", emoji: "🌈" },
  { id: 2, tag: "Sản phẩm mới", title: "Matcha Tươi Nè — Vị matcha Nhật được ủ theo công thức độc quyền", date: "15/06/2026", emoji: "🍵" },
  { id: 3, tag: "Câu chuyện", title: "CheNow và hành trình đưa nông sản Việt lên tầm quốc tế", date: "10/06/2026", emoji: "🌿" },
];

const STORES = [
  { name: "CheNow Hoàn Kiếm", addr: "12 Hàng Bài, Hoàn Kiếm, Hà Nội", open: "7:00 – 22:00", hot: true },
  { name: "CheNow Cầu Giấy", addr: "45 Xuân Thủy, Cầu Giấy, Hà Nội", open: "7:00 – 22:00", hot: false },
  { name: "CheNow Bình Thạnh", addr: "88 Đinh Tiên Hoàng, Bình Thạnh, TP.HCM", open: "8:00 – 22:30", hot: true },
];

const STATS = [
  { value: "300+", label: "Cửa hàng toàn quốc" },
  { value: "5M+", label: "Khách hàng thân thiết" },
  { value: "10+", label: "Năm kinh nghiệm" },
  { value: "99%", label: "Hài lòng dịch vụ" },
];

/* ─── COMPONENT ─── */
export default function CustomerHomePage() {
  const [activeBanner, setActiveBanner] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
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

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#eadfd4] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] flex items-center justify-center shadow">
              <span className="text-white font-black text-base">C</span>
            </div>
            <div>
              <p className="font-black text-[#432010] leading-none text-lg tracking-tight">CheNow</p>
              <p className="text-[9px] text-[#8c6a5a] leading-none tracking-widest uppercase">Đậm vị thiên nhiên</p>
            </div>
          </div>

          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l}>
                <a href="#" className="px-4 py-2 rounded-full text-sm font-medium text-[#5f5148] hover:bg-[#f5ede4] hover:text-[#2d6a4f] transition-all">{l}</a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#eadfd4] text-xs font-medium text-[#5f5148] hover:border-[#2d6a4f] transition-colors">
              <MapPin size={12} className="text-[#2d6a4f]" /> Hà Nội
            </button>
            <button className="relative p-2.5 rounded-full bg-[#f5ede4] hover:bg-[#eadfd4] transition-colors" onClick={() => setCartCount(c => c + 1)}>
              <ShoppingCart size={18} className="text-[#432010]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2d6a4f] text-white text-[10px] rounded-full flex items-center justify-center font-bold">{cartCount}</span>
              )}
            </button>
            <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-[#eadfd4] px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a key={l} href="#" className="py-2 text-sm font-medium text-[#5f5148] border-b border-[#f5ede4] last:border-0">{l}</a>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO BANNER CAROUSEL ── */}
      <section className={`pt-16 min-h-screen bg-gradient-to-br ${banner.bg} flex flex-col transition-all duration-500`}>
        <div className="flex-1 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-center gap-12 py-20">
          <div className="flex-1 text-white">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black tracking-widest mb-4"
              style={{ background: banner.accent + "30", color: banner.accent, border: `1px solid ${banner.accent}50` }}>
              {banner.badge}
            </span>
            <h1 className="text-5xl md:text-7xl font-black leading-none mb-4 tracking-tight">{banner.title}</h1>
            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-md leading-relaxed">{banner.sub}</p>
            <div className="flex items-center gap-4">
              <button className="px-8 py-3.5 bg-white text-[#2d6a4f] font-bold rounded-full hover:scale-105 transition-transform shadow-lg text-sm">
                {banner.cta}
              </button>
              <button className="px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors text-sm">
                Thực đơn
              </button>
            </div>
          </div>
          <div className="relative flex-shrink-0">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center animate-pulse"
              style={{ background: `radial-gradient(circle, ${banner.accent}20, transparent)`, border: `2px solid ${banner.accent}30` }}>
              <div className="text-9xl md:text-[10rem] filter drop-shadow-2xl">{banner.emoji}</div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/10 blur-xl" />
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-white/10 blur-lg" />
          </div>
        </div>

        {/* Banner dots */}
        <div className="flex justify-center gap-3 pb-8">
          {BANNERS.map((_, i) => (
            <button key={i} 
              onClick={() => { setActiveBanner(i); setAutoPlay(false); }}
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
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1">
          <p className="text-xs font-black uppercase tracking-widest text-[#2d6a4f] mb-3">CheNow Story</p>
          <h2 className="text-4xl md:text-5xl font-black leading-tight text-[#432010] mb-6">
            Đậm vị<br />thiên nhiên,<br /><span className="text-[#2d6a4f]">trọn vị hạnh phúc</span>
          </h2>
          <p className="text-[#5f5148] leading-relaxed mb-4 max-w-lg">
            Bên cạnh niềm tự hào về những ly trà sữa ngon – sạch – tươi, chúng tôi luôn tự tin mang đến khách hàng những trải nghiệm tốt nhất về dịch vụ và không gian.
          </p>
          <p className="text-[#5f5148] leading-relaxed mb-8 max-w-lg">
            Mỗi nguyên liệu đều được tuyển chọn kỹ lưỡng từ các vùng nông sản Việt Nam nổi tiếng, đảm bảo hương vị tự nhiên và an toàn cho sức khỏe.
          </p>
          <button className="flex items-center gap-2 text-sm font-bold text-[#2d6a4f] hover:gap-4 transition-all">
            Tìm hiểu thêm <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          {VALUES.map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-5 border border-[#eadfd4] hover:shadow-lg hover:-translate-y-1 transition-all">
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
              <p className="text-xs font-black uppercase tracking-widest text-[#2d6a4f] mb-2">Sản phẩm nổi bật</p>
              <h2 className="text-3xl md:text-4xl font-black text-[#432010]">Khám phá hương vị</h2>
            </div>
            <button className="flex items-center gap-1.5 text-sm font-bold text-[#2d6a4f] hover:gap-3 transition-all self-start md:self-auto">
              Xem thêm <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_PRODUCTS.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-[#eadfd4] hover:shadow-xl hover:-translate-y-2 transition-all group cursor-pointer">
                <div className={`h-48 bg-gradient-to-br ${p.color} flex items-center justify-center relative`}>
                  <span className="text-6xl filter drop-shadow-lg group-hover:scale-110 transition-transform">{p.emoji}</span>
                  {p.tag && (
                    <span className={`absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full ${p.tag === "Mới" ? "bg-[#2d6a4f] text-white" : "bg-[#c07941] text-white"}`}>
                      {p.tag}
                    </span>
                  )}
                  {p.oldPrice && (
                    <span className="absolute top-3 right-3 text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full">
                      -{Math.round((1 - p.price / p.oldPrice) * 100)}%
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-base text-[#432010]">{p.name}</h3>
                  <p className="text-xs text-[#8c6a5a] mt-1">{p.desc}</p>
                  <div className="flex items-center gap-1 mt-3">
                    <Star size={11} className="fill-[#f5a623] text-[#f5a623]" />
                    <span className="text-xs font-semibold text-[#432010]">{p.rating}</span>
                    <span className="text-xs text-[#c9b9ac]">({p.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="font-black text-base text-[#2d6a4f]">{p.price.toLocaleString("vi-VN")}đ</span>
                      {p.oldPrice && <span className="text-xs text-[#c9b9ac] line-through ml-1.5">{p.oldPrice.toLocaleString("vi-VN")}đ</span>}
                    </div>
                    <button onClick={() => setCartCount(c => c + 1)}
                      className="w-10 h-10 bg-[#2d6a4f] text-white rounded-full flex items-center justify-center text-xl font-bold hover:bg-[#1b4332] hover:scale-110 transition-all shadow-md">
                      +
                    </button>
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
          <p className="text-xs font-black uppercase tracking-widest text-[#a8d5b5] mb-3">Nhượng quyền</p>
          <h2 className="text-3xl md:text-4xl font-black mb-4">Gia nhập đề chế CheNow</h2>
          <p className="text-white/70 mb-6">Là một trong 300+ cửa hàng CheNow trên toàn quốc. Cơ hội kinh doanh lâu dài với thương hiệu được yêu thích bởi hơn 5 triệu khách hàng.</p>
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#a8d5b5]" />
              <span className="text-sm">Hỗ trợ huấn luyện toàn diện</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#a8d5b5]" />
              <span className="text-sm">Cung cấp nguyên liệu chất lượng cao</span>
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
          <p className="text-lg text-[#5f5148] mb-8">Cửa hàng CheNow trên toàn quốc</p>
          <div className="bg-[#f5ede4] rounded-2xl p-8">
            <p className="text-sm text-[#432010] mb-4"><span className="font-black text-lg text-[#2d6a4f]">10+</span> năm kinh nghiệm</p>
            <p className="text-sm text-[#432010]"><span className="font-black text-lg text-[#2d6a4f]">5M+</span> khách hàng thân thiết</p>
          </div>
        </div>
      </section>

      {/* ── VIDEO SECTION ── */}
      <section className="bg-gradient-to-b from-[#432010] to-[#2d6a4f] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-[#a8d5b5] mb-3">Khám phá</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">Hành trình CheNow</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative group cursor-pointer rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all z-10 flex items-center justify-center">
                <Play size={64} className="text-white group-hover:scale-110 transition-transform" />
              </div>
              <div className="bg-gradient-to-br from-[#74c69d] to-[#2d6a4f] h-64 flex items-center justify-center text-6xl">
                🍵
              </div>
              <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white font-bold text-sm">Ủ trà 40 giờ - Công thức độc quyền CheNow</p>
            </div>

            <div className="relative group cursor-pointer rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all z-10 flex items-center justify-center">
                <Play size={64} className="text-white group-hover:scale-110 transition-transform" />
              </div>
              <div className="bg-gradient-to-br from-[#c9659a] to-[#7f5539] h-64 flex items-center justify-center text-6xl">
                🌿
              </div>
              <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white font-bold text-sm">Từ nông trại Việt - Đến ly trà của bạn</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROMO FULLWIDTH ── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#432010] to-[#7f5539] py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-10 text-8xl">🧋</div>
          <div className="absolute bottom-4 right-20 text-6xl">🍑</div>
          <div className="absolute top-8 right-40 text-5xl">🌿</div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div>
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest mb-3">Ưu đãi đặc biệt</span>
            <h3 className="text-3xl md:text-4xl font-black mb-2">Mua 2 Tặng 1 mỗi thứ Sáu</h3>
            <p className="text-white/70">Áp dụng cho tất cả đồ uống từ 35.000đ. Không giới hạn số lượng.</p>
          </div>
          <button className="flex-shrink-0 bg-white text-[#432010] font-black px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-xl">
            Đặt hàng ngay
          </button>
        </div>
      </section>

      {/* ── NEWS ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#2d6a4f] mb-2">Tin tức & Khuyến mãi</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#432010]">Khám phá CheNow</h2>
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
              <span className="text-xs font-bold text-[#2d6a4f] bg-[#e8f5e9] px-2.5 py-0.5 rounded-full">{n.tag}</span>
              <h3 className="font-bold text-[#432010] mt-2 leading-snug group-hover:text-[#2d6a4f] transition-colors line-clamp-2">{n.title}</h3>
              <p className="text-xs text-[#b8a89a] mt-1.5">{n.date}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STORES ── */}
      <section className="bg-[#1b4332] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-black uppercase tracking-widest text-[#a8d5b5] mb-2">Hệ thống cửa hàng</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-8">Tìm CheNow gần bạn</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {STORES.map((s) => (
              <div key={s.name} className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10 hover:bg-white/20 transition-colors cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2d6a4f] flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white text-sm">{s.name}</p>
                      {s.hot && <span className="text-[10px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full">HOT</span>}
                    </div>
                    <p className="text-xs text-white/60 mt-1">{s.addr}</p>
                    <p className="text-xs text-[#a8d5b5] font-semibold mt-1.5">🕐 {s.open}</p>
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
            <p className="text-xs font-black uppercase tracking-widest text-[#a8d5b5] mb-3">Ứng dụng di động</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Tải CheNow App</h2>
            <p className="text-white/70 mb-8">Đặt hàng dễ dàng, nhận ưu đãi độc quyền và theo dõi đơn hàng real-time. Tính năng giao dịch nhanh chóng và an toàn.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#2d6a4f] font-bold rounded-full hover:scale-105 transition-transform">
                <Apple size={18} /> App Store
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors">
                <Download size={18} /> Google Play
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 text-8xl md:text-9xl">
            📱
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#432010] text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="font-black text-base">C</span>
              </div>
              <span className="font-black text-lg">CheNow</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4">Đậm vị thiên nhiên, trọn vị hạnh phúc. Thương hiệu trà sữa tiên phong sử dụng nông sản Việt.</p>
            <div className="flex gap-2">
              {["fb", "ig", "yt", "tk"].map((s) => (
                <div key={s} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors text-xs font-bold">{s}</div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-bold mb-3 text-sm">Về CheNow</p>
            {["Câu chuyện thương hiệu", "Nhượng quyền", "Tuyển dụng", "Chuỗi cửa hàng"].map((l) => (
              <a key={l} href="#" className="block text-sm text-white/60 hover:text-white py-1 transition-colors">{l}</a>
            ))}
          </div>
          <div>
            <p className="font-bold mb-3 text-sm">Chính sách</p>
            {["Chính sách thành viên", "Hình thức thanh toán", "Vận chuyển giao nhận", "Đổi trả & hoàn tiền"].map((l) => (
              <a key={l} href="#" className="block text-sm text-white/60 hover:text-white py-1 transition-colors">{l}</a>
            ))}
          </div>
          <div>
            <p className="font-bold mb-3 text-sm">Liên hệ</p>
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm text-white/60"><Phone size={13} /> 1800 6272</p>
              <p className="flex items-center gap-2 text-sm text-white/60"><Mail size={13} /> hello@chenow.vn</p>
              <p className="flex items-start gap-2 text-sm text-white/60"><MapPin size={13} className="mt-0.5 flex-shrink-0" /> 12 Hàng Bài, Hoàn Kiếm, Hà Nội</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 text-center py-4 text-xs text-white/30">
          © 2026 CheNow. All rights reserved.
        </div>
      </footer>

    </div>
  );
}