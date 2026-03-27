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
    productService.getProducts({ is_featured: true }).then((data) => setFeatured(data.slice(0, 8)));
    productService.getProducts().then((data) => setLatest(data.slice(0, 8)));
  }, []);

  return (
    <div className="bg-white">
      <Hero />

      {/* Featured Section */}
      {featured.length > 0 && (
        <section className="py-24 overflow-hidden bg-[#fafafa]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="space-y-2">
                <div className="text-emerald-500 font-bold text-[10px] uppercase tracking-[0.3em] animate-fade-in-down">Đề xuất cho bạn</div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase animate-fade-in-up">Sản phẩm nổi bật</h2>
              </div>
              <Link 
                to="/products" 
                className="group inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-black transition-all border-b-2 border-transparent hover:border-black pb-1 active:scale-95"
              >
                Xem tất cả <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 animate-fade-in-up delay-100">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social / Trust Section (Optional Addition for "messy" fix) */}
      <section className="py-20 border-y border-black/5 bg-white overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="text-2xl font-black tracking-tighter italic uppercase">VOGUE</div>
             <div className="text-2xl font-black tracking-tighter italic uppercase">GQ</div>
             <div className="text-2xl font-black tracking-tighter italic uppercase">ELLE</div>
             <div className="text-2xl font-black tracking-tighter italic uppercase">BAZAAR</div>
          </div>
        </div>
      </section>

      {/* Latest Section */}
      {latest.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="space-y-2">
                <div className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.3em]">Hàng mới về</div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Bộ sưu tập mới</h2>
              </div>
              <Link 
                to="/products" 
                className="group inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-black transition-all border-b-2 border-transparent hover:border-black pb-1 active:scale-95"
              >
                Xem tất cả <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {latest.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

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
