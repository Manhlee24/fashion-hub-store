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
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase animate-fade-in-down">
            <Sparkles className="h-3 w-3 text-yellow-400" />
            <span>Bộ sưu tập mới nhất đã sẵn sàng</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-white flex flex-col gap-2 md:gap-4 tracking-tighter animate-fade-in-up leading-[0.85] uppercase">
            {current.title?.split('\n').map((line: string, i: number, arr: string[]) => {
              // If there are 3 lines, the middle one (index 1) gets the gradient
              // If there are 2 lines, the second one (index 1) gets the gradient
              // If 1 line, no gradient
              const shouldGradient = arr.length > 1 && i === 1;
              return (
                <span key={i} className={shouldGradient ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400" : ""}>
                  {line}
                </span>
              );
            }) || current.title}
          </h1>

          <p className="text-base md:text-xl text-white/50 max-w-xl font-medium animate-fade-in-up delay-100 uppercase tracking-[0.2em] leading-relaxed">
            {current.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 animate-fade-in-up delay-200">
            <Link to={current.button_link || "/products"}>
              <Button
                size="lg"
                className="h-16 px-10 text-xl font-black bg-white text-black hover:bg-emerald-400 hover:text-black rounded-full group active:scale-95 transition-all shadow-xl shadow-white/10"
              >
                {current.button_text || "KHÁM PHÁ"}
                <ShoppingBag className="ml-2 h-6 w-6 transition-transform group-hover:rotate-12" />
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
    </section>
  );
}
