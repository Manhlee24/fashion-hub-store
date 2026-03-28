import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { heroService } from "@/services/heroService";

export default function Hero() {
  const [hero, setHero] = useState<any>(null);

  useEffect(() => {
    heroService.getHeroes().then((data: any) => {
      const activeHero = data?.find((h: any) => h.is_active);
      if (activeHero) setHero(activeHero);
    });
  }, []);

  const defaultHero = {
    image_url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop",
    title: "PHONG CÁCH ĐỊNH HÌNH",
    subtitle: "BẢN LĨNH",
    button_text: "Mua sắm ngay",
    button_link: "/products"
  };

  const current = hero || defaultHero;

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#0a0a0a]">
      {/* Background with Gradient and Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
        <img
          src={current.image_url}
          alt="Fashion Hero"
          className="h-full w-full object-cover scale-105 animate-subtle-zoom"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-30" />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-4xl space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white text-[10px] font-bold tracking-[0.3em] uppercase animate-fade-in-down">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            <span>Bộ sưu tập Mới 2026</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white flex flex-col gap-2 tracking-tighter leading-[1.2] uppercase">
            {current.title?.split('\n').map((line: string, i: number, arr: string[]) => {
              const shouldGradient = arr.length > 1 && i === 1;
              return (
                <div key={i} className="overflow-hidden py-10 -my-8 text-wrap">
                  <span 
                    className={`block animate-reveal-up ${shouldGradient ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400" : ""}`}
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    {line}
                  </span>
                </div>
              );
            }) || (
              <div className="overflow-hidden py-10 -my-8 text-wrap">
                <span className="block animate-reveal-up">{current.title}</span>
              </div>
            )}
          </h1>

          <p className="text-sm md:text-lg text-white/40 max-w-xl font-medium animate-reveal-up delay-300 uppercase tracking-[0.4em] leading-relaxed">
            {current.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 animate-fade-in-up delay-200">
            <Link to={current.button_link || "/products"}>
              <Button
                size="lg"
                className="h-16 px-12 text-lg font-bold bg-white text-black hover:bg-emerald-400 hover:text-black rounded-none group active:scale-95 transition-all duration-500 shadow-2xl shadow-white/5"
              >
                {current.button_text || "KHÁM PHÁ NGAY"}
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Button>
            </Link>
          </div>

          <div className="pt-16 grid grid-cols-3 gap-12 border-t border-white/10 animate-fade-in-up delay-300">
            <div>
              <div className="text-3xl font-black text-white tracking-tighter">500+</div>
              <div className="text-[10px] text-white/50 uppercase tracking-[0.2em] mt-2">Sản phẩm độc quyền</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white tracking-tighter">50k+</div>
              <div className="text-[10px] text-white/50 uppercase tracking-[0.2em] mt-2">Khách hàng tin dùng</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white tracking-tighter">24h</div>
              <div className="text-[10px] text-white/50 uppercase tracking-[0.2em] mt-2">Giao hàng hỏa tốc</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 opacity-30 hover:opacity-100 transition-opacity cursor-pointer animate-fade-in-up delay-700">
        <span className="text-[8px] text-white uppercase tracking-[0.5em] font-bold translate-x-[1px]">Cuộn xuống</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
