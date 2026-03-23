import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import ProductCard from "@/components/storefront/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export default function Index() {
  const [banners, setBanners] = useState<Tables<"banners">[]>([]);
  const [featured, setFeatured] = useState<Tables<"products">[]>([]);
  const [latest, setLatest] = useState<Tables<"products">[]>([]);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => setBanners(data ?? []));

    supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => setFeatured(data ?? []));

    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => setLatest(data ?? []));
  }, []);

  const nextBanner = () => setBannerIdx((i) => (i + 1) % banners.length);
  const prevBanner = () => setBannerIdx((i) => (i - 1 + banners.length) % banners.length);

  return (
    <div>
      {/* Banner */}
      {banners.length > 0 && (
        <section className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden bg-muted">
          <img
            src={banners[bannerIdx].image_url}
            alt="Banner"
            className="h-full w-full object-cover transition-opacity duration-500"
          />
          {banners.length > 1 && (
            <>
              <button
                onClick={prevBanner}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-2 backdrop-blur hover:bg-background transition-colors active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextBanner}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-2 backdrop-blur hover:bg-background transition-colors active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setBannerIdx(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === bannerIdx ? "w-6 bg-foreground" : "w-1.5 bg-foreground/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {banners.length === 0 && (
        <section className="bg-foreground text-background">
          <div className="container mx-auto px-4 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance leading-[1.1]">
              Phong cách nam giới hiện đại
            </h1>
            <p className="mt-4 text-lg text-background/70 max-w-lg mx-auto">
              Bộ sưu tập mới nhất — tối giản, thanh lịch, tự tin.
            </p>
            <Link to="/products">
              <Button
                variant="secondary"
                size="lg"
                className="mt-8 active:scale-95"
              >
                Khám phá ngay <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Sản phẩm nổi bật</h2>
            <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Xem tất cả <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Latest */}
      {latest.length > 0 && (
        <section className="container mx-auto px-4 py-16 pt-0">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Sản phẩm mới</h2>
            <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Xem tất cả <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {latest.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {featured.length === 0 && latest.length === 0 && (
        <section className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Chưa có sản phẩm nào. Hãy thêm sản phẩm trong trang quản trị.</p>
          <Link to="/admin">
            <Button variant="outline" className="mt-4 active:scale-95">Đến trang quản trị</Button>
          </Link>
        </section>
      )}
    </div>
  );
}
