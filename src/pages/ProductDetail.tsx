import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Tables<"products"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-[3/4] bg-muted rounded-lg animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
            <div className="h-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Sản phẩm không tồn tại.</p>
        <Link to="/products">
          <Button variant="outline" className="mt-4">Quay lại</Button>
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addItem(
      { id: product.id, product_name: product.product_name, price: product.price, image_url: product.image_url },
      qty
    );
    toast.success("Đã thêm vào giỏ hàng");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Quay lại
      </Link>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted">
          {product.image_url ? (
            <img src={product.image_url} alt={product.product_name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">Không có ảnh</div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{product.product_name}</h1>
          <p className="mt-3 text-2xl font-semibold">{formatPrice(product.price)}</p>

          {product.description && (
            <p className="mt-6 text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
          )}

          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center border rounded-md">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-accent transition-colors active:scale-95">
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 text-sm font-medium tabular-nums">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-2 hover:bg-accent transition-colors active:scale-95">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button onClick={handleAdd} size="lg" className="flex-1 active:scale-[0.97]">
              <ShoppingBag className="mr-2 h-4 w-4" /> Thêm vào giỏ hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
