import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService } from "@/services/productService";
import { Product } from "@/lib/types";
import ProductCard from "@/components/features/products/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import Hero from "@/components/features/home/Hero";

export default function Index() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [latest, setLatest] = useState<Product[]>([]);

  useEffect(() => {
    productService.getProducts({ is_featured: true }).then((data) => setFeatured(data.slice(0, 4)));
    productService.getProducts().then((data) => setLatest(data.slice(0, 4)));
  }, []);

  return (
    <div className="bg-white">
      <Hero />

      {/* Featured Section */}
      {featured.length > 0 && (
        <section className="py-24 md:py-40 overflow-hidden bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="space-y-6 max-w-xl">
                <div className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.5em] animate-fade-in-down">Bộ sưu tập đặc biệt</div>
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] text-black">
                  EDITOR'S<br /><span className="text-black/20">CHOICE</span>
                </h2>
                <p className="text-muted-foreground text-sm font-medium tracking-wide leading-relaxed pl-1 max-w-md">Những thiết kế biểu tượng làm nên tên tuổi HNAMSTORE, được tuyển chọn bởi các chuyên gia thời trang.</p>
              </div>
              <Link
                to="/products"
                className="group inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-black transition-all border-b-2 border-black pb-2 mb-2"
              >
                Khám phá ngay <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {featured.map((p, i) => (
                <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Story Section */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-square overflow-hidden rounded-[40px] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?auto=format&fit=crop&q=80&w=1200"
              alt="Brand Story"
              className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-[3000ms]"
            />
          </div>
          <div className="space-y-10">
            <div className="space-y-4">
              <h3 className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">Câu chuyện của chúng tôi</h3>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">HNAMSTORE:<br />Tinh hoa của<br />Sự tối giản</h2>
            </div>
            <p className="text-white/60 text-lg leading-relaxed font-medium">
              Khởi nguồn từ khao khát mang đến vẻ đẹp vĩnh cửu trong nhịp sống hiện đại, HNAMSTORE không chỉ bán quần áo, chúng tôi định hình một phong cách sống. Mỗi đường kim mũi chỉ là một lời tuyên bố về chất lượng.
            </p>
            <div className="flex gap-12 pt-4">
              <div className="space-y-2">
                <div className="text-3xl font-black italic">100%</div>
                <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Thủ công</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-black italic">5k+</div>
                <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Khách hàng</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-black italic">12+</div>
                <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Quốc gia</div>
              </div>
            </div>
            <Link to="/about" className="inline-block pt-6">
              <Button size="lg" className="bg-white text-black hover:bg-emerald-400 rounded-full px-10 h-14 font-black text-xs tracking-widest uppercase transition-all">
                Đọc thêm về chúng tôi
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social / Trust Section */}
      <section className="py-16 border-y border-black/[0.03] bg-white overflow-hidden select-none">
        <div className="flex w-[200%] animate-marquee whitespace-nowrap opacity-10 grayscale">
          <div className="flex items-center gap-16 md:gap-32 px-8">
            <div className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase">VOGUE</div>
            <div className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase">GQ</div>
            <div className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase">ELLE</div>
            <div className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase">BAZAAR</div>
            <div className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase">GRAZIA</div>
            <div className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase">COSMOPOLITAN</div>
          </div>
          <div className="flex items-center gap-16 md:gap-32 px-8">
            <div className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase">VOGUE</div>
            <div className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase">GQ</div>
            <div className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase">ELLE</div>
            <div className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase">BAZAAR</div>
            <div className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase">GRAZIA</div>
            <div className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase">COSMOPOLITAN</div>
          </div>
        </div>
      </section>

      {/* Latest Section */}
      {latest.length > 0 && (
        <section className="bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="space-y-4">
                <div className="text-black/30 font-bold text-[10px] uppercase tracking-[0.4em]">Phát hành mới</div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">Sản phẩm<br />Mới về</h2>
              </div>
              <Link
                to="/products"
                className="group inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-black transition-all border-b border-transparent hover:border-black pb-1"
              >
                Khám phá trọn bộ <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              {latest.map((p, i) => (
                <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community Section */}
      <section className="py-32 bg-[#0a0a0a] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none grayscale">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1600"
            alt="Community Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center space-y-12">
          <div className="space-y-6 max-w-2xl mx-auto">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-400">Kết nối cùng HNAM</h3>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none animate-reveal-up">Tham gia<br />Cộng đồng</h2>
            <p className="text-lg text-white/40 leading-relaxed font-medium uppercase tracking-widest text-[11px] animate-reveal-up delay-200">
              Chia sẻ phong cách của bạn với hashtag <span className="text-white">#HNAMSTORE</span> và trở thành một phần của thế hệ dẫn đầu xu hướng tối giản.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
            <button className="h-14 px-10 bg-white text-black text-xs font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all duration-500 active:scale-95 shadow-2xl">
              Theo dõi Instagram
            </button>
            <button className="h-14 px-10 border border-white/20 text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500 active:scale-95">
              Tham gia Group
            </button>
          </div>
        </div>
      </section>

      {featured.length === 0 && latest.length === 0 && (
        <section className="container mx-auto px-4 py-32 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <p className="text-muted-foreground text-lg italic font-medium">Hiện tại chúng tôi đang chuẩn bị các bộ sưu tập mới nhất. Vui lòng quay lại sau.</p>
            <Link to="/admin">
              <Button size="lg" variant="outline" className="rounded-full px-10 border-2 font-bold uppercase tracking-widest active:scale-95">Quản trị viên</Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
