import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import ProductCard from "@/components/storefront/ProductCard";
import { Button } from "@/components/ui/button";

export default function Products() {
  const [products, setProducts] = useState<Tables<"products">[]>([]);
  const [categories, setCategories] = useState<Tables<"categories">[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  useEffect(() => {
    supabase.from("categories").select("*").order("category_name").then(({ data }) => setCategories(data ?? []));
  }, []);

  useEffect(() => {
    setLoading(true);
    let query = supabase.from("products").select("*").order("created_at", { ascending: false });
    if (activeCategory) query = query.eq("category_id", activeCategory);
    query.then(({ data }) => {
      setProducts(data ?? []);
      setLoading(false);
    });
  }, [activeCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Sản phẩm</h1>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Button
          variant={!activeCategory ? "default" : "outline"}
          size="sm"
          onClick={() => setSearchParams({})}
          className="active:scale-95"
        >
          Tất cả
        </Button>
        {categories.map((c) => (
          <Button
            key={c.id}
            variant={activeCategory === c.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSearchParams({ category: c.id })}
            className="active:scale-95"
          >
            {c.category_name}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Không tìm thấy sản phẩm nào.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
