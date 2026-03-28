import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { productService } from "@/services/productService";
import { Product } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, ArrowLeft, Truck, ShieldCheck, Star, Share2, Heart, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/features/products/ProductCard";
import { Badge } from "@/components/ui/badge";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const catName = (product?.category?.name || product?.category_name || "").toLowerCase();
  const prodName = (product?.name || "").toLowerCase();

  const isShoe = catName.includes("giày") || catName.includes("dép") || catName.includes("ủng") ||
    prodName.includes("giày") || prodName.includes("dép") || prodName.includes("ủng") || prodName.includes("boot");

  const isAccessory = catName.includes("phụ kiện") || catName.includes("trang sức") ||
    prodName.includes("ví") || prodName.includes("thắt lưng") || prodName.includes("kính") || prodName.includes("nước hoa");

  const hasSize = !isAccessory;
  const sizes = isShoe ? ["39", "40", "41", "42", "43", "44"] : ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);
    setLoading(true);

    productService.getProductById(id).then((data) => {
      setProduct(data);
      if (data?.category_id) {
        productService.getProducts({ category_id: data.category_id }).then((rel) => {
          setRelated(rel.filter((p: Product) => p.id !== data.id).slice(0, 4));
        });
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [id]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-muted shimmer shadow-xl" />
          <div className="space-y-6">
            <div className="h-4 bg-muted shimmer w-1/4" />
            <div className="h-10 bg-muted shimmer w-3/4" />
            <div className="h-6 bg-muted shimmer w-1/4" />
            <div className="space-y-4">
              <div className="h-4 bg-muted shimmer" />
              <div className="h-4 bg-muted shimmer" />
              <div className="h-32 bg-muted shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-2">Sản phẩm không khả dụng</h2>
        <Link to="/products">
          <Button variant="outline" className="mt-4 rounded-full">Quay lại cửa hàng</Button>
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm");
      navigate("/auth");
      return;
    }
    if (hasSize && !selectedSize) {
      toast.error("Vui lòng chọn kích cỡ/size");
      return;
    }
    addItem(
      {
        id: product.id,
        product_name: product.name,
        price: product.price,
        image_url: product.image_url,
        size: hasSize ? selectedSize : undefined
      },
      qty
    );
    toast.success(`Đã thêm ${product.name} ${hasSize ? `(Size ${selectedSize})` : ""} vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để mua hàng");
      navigate("/auth");
      return;
    }
    if (hasSize && !selectedSize) {
      toast.error("Vui lòng chọn kích cỡ/size");
      return;
    }
    navigate("/checkout", {
      state: {
        directItem: {
          id: product.id,
          product_name: product.name,
          price: product.price,
          image_url: product.image_url,
          quantity: qty,
          size: hasSize ? selectedSize : undefined
        }
      }
    });
  };

  return (
    <div className="pb-20">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-12 animate-fade-in">
          <Link to="/" className="hover:text-black transition-colors">HNAMSTORE</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/products" className="hover:text-black transition-colors">Sản phẩm</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-black truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-muted shadow-xl border border-black/5">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">Không có ảnh</div>
              )}
            </div>
            {product.is_featured && (
              <Badge className="absolute top-6 left-6 bg-white/90 text-black hover:bg-white px-4 py-1.5 rounded-full font-bold shadow-lg border-none backdrop-blur">
                Nổi bật
              </Badge>
            )}
          </div>

          <div className="flex flex-col">
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                <Star className="h-4 w-4 fill-emerald-600" />
                <span>Sản phẩm chính hãng HNAMSTORE</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-foreground">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="border-y py-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider">Mô tả sản phẩm</h3>
                <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                  {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
                </p>
              </div>

              {hasSize && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider">Kích cỡ / Size</h3>
                    <button className="text-[10px] font-bold text-muted-foreground uppercase underline underline-offset-4 hover:text-primary transition-colors">Hướng dẫn chọn size</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`h-12 min-w-[3rem] px-4 rounded-xl border-2 font-bold text-sm transition-all duration-300 active:scale-95 ${selectedSize === s
                            ? "border-primary bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                            : "border-black/5 hover:border-black/20 text-foreground"
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex gap-4 items-start p-4 bg-muted/20 rounded-2xl border border-black/5">
                  <Truck className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <h4 className="font-bold text-sm">Giao hàng miễn phí</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Dự kiến 2-3 ngày làm việc.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start p-4 bg-muted/20 rounded-2xl border border-black/5">
                  <ShieldCheck className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <h4 className="font-bold text-sm">Thanh toán an toàn</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Bảo hành 12 tháng chính hãng.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-primary/10 rounded-full h-14 bg-white overflow-hidden shadow-sm">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-full hover:bg-muted transition-colors px-3">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-lg tabular-nums">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-12 h-full hover:bg-muted transition-colors px-3">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button onClick={handleAdd} size="lg" variant="outline" className="flex-1 h-14 text-lg font-bold border-2 border-primary hover:bg-primary hover:text-white rounded-full">
                  <ShoppingBag className="mr-2 h-5 w-5" /> Thêm vào giỏ
                </Button>
              </div>
              <Button onClick={handleBuyNow} size="lg" className="h-14 w-full text-xl font-black rounded-full shadow-lg shadow-primary/20">
                MUA NGAY
              </Button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24 pt-16 border-t">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black uppercase tracking-tight">Sản phẩm tương tự</h2>
              <Link to="/products" className="text-sm font-bold underline underline-offset-4 hover:text-primary transition-colors">Xem tất cả</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
