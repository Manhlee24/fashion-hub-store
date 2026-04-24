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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

  const variants = product?.variants || [];
  const hasVariants = variants.length > 0;
  const currentVariant = variants.find((v) => v.size === selectedSize);
  const stockCount = currentVariant?.stock ?? 0;
  const isOutOfStock = selectedSize ? stockCount === 0 : variants.every(v => v.stock === 0) && hasVariants;

  const handleAdd = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm");
      navigate("/auth");
      return;
    }
    if (hasVariants && !selectedSize) {
      toast.error("Vui lòng chọn kích cỡ/size");
      return;
    }
    if (currentVariant && currentVariant.stock === 0) {
      toast.error("Size này hiện đã hết hàng");
      return;
    }
    if (currentVariant && qty > currentVariant.stock) {
      toast.error(`Sản phẩm size này chỉ còn ${currentVariant.stock} trong kho`);
      return;
    }
    addItem(
      {
        id: product.id,
        product_name: product.name,
        price: product.price,
        image_url: product.image_url,
        size: hasVariants ? selectedSize : undefined
      },
      qty
    );
    toast.success(`Đã thêm ${product.name} ${hasVariants ? `(Size ${selectedSize})` : ""} vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để mua hàng");
      navigate("/auth");
      return;
    }
    if (hasVariants && !selectedSize) {
      toast.error("Vui lòng chọn kích cỡ/size");
      return;
    }
    if (currentVariant && currentVariant.stock === 0) {
      toast.error("Size này hiện đã hết hàng");
      return;
    }
    if (currentVariant && qty > currentVariant.stock) {
      toast.error(`Sản phẩm size này chỉ còn ${currentVariant.stock} trong kho`);
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
          size: hasVariants ? selectedSize : undefined
        }
      }
    });
  };

  return (
    <div className="pb-20">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-12 animate-fade-in">
          <Link to="/" className="hover:text-black transition-colors shrink-0">HNAMSTORE</Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <Link to="/products" className="hover:text-black transition-colors shrink-0">Sản phẩm</Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <span className="text-black truncate max-w-[150px] sm:max-w-[300px]">{product.name}</span>
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
            {(product.is_featured || isOutOfStock) && (
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.is_featured && (
                  <Badge className="bg-white/90 text-black hover:bg-white px-4 py-1.5 rounded-full font-bold shadow-lg border-none backdrop-blur">
                    Nổi bật
                  </Badge>
                )}
                {isOutOfStock && (
                  <Badge variant="destructive" className="px-4 py-1.5 rounded-full font-bold shadow-lg border-none">
                    Hết hàng
                  </Badge>
                )}
              </div>
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

              {hasVariants && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Kích cỡ / Size {selectedSize && currentVariant && (
                        <span className={`ml-2 normal-case font-medium ${currentVariant.stock <= 5 ? 'text-rose-500' : 'text-muted-foreground'}`}>
                          ({currentVariant.stock > 0 ? `Còn ${currentVariant.stock} sản phẩm` : 'Đã hết hàng'})
                        </span>
                      )}
                    </h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-[10px] font-bold text-muted-foreground uppercase underline underline-offset-4 hover:text-primary transition-colors">Hướng dẫn chọn size</button>
                      </DialogTrigger>
                      <DialogContent className="w-[95vw] max-w-xl bg-[#FBFBFB] border-none shadow-2xl rounded-[32px] p-0 overflow-hidden">
                        <DialogHeader className="p-6 sm:p-8 pb-0 text-left">
                          <DialogTitle className="text-xl sm:text-2xl font-black uppercase tracking-tight">Hướng dẫn chọn size {isShoe ? "Giày dép" : "Quần áo"}</DialogTitle>
                        </DialogHeader>
                        <div className="p-6 sm:p-8 pt-4 sm:pt-6">
                          <div className="overflow-x-auto">
                            {isShoe ? (
                              <table className="w-full text-sm min-w-[300px]">
                                <thead>
                                  <tr className="border-b-2 border-black/20">
                                    <th className="py-3 text-left font-black uppercase tracking-widest text-[10px]">Size VN</th>
                                    <th className="py-3 text-left font-black uppercase tracking-widest text-[10px]">Chiều dài chân (cm)</th>
                                    <th className="py-3 text-left font-black uppercase tracking-widest text-[10px]">US Size</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-b border-black/5"><td className="py-3 font-bold">39</td><td className="py-3">24.5</td><td className="py-3">6.5</td></tr>
                                  <tr className="border-b border-black/5"><td className="py-3 font-bold">40</td><td className="py-3">25.0</td><td className="py-3">7</td></tr>
                                  <tr className="border-b border-black/5"><td className="py-3 font-bold">41</td><td className="py-3">26.0</td><td className="py-3">8</td></tr>
                                  <tr className="border-b border-black/5"><td className="py-3 font-bold">42</td><td className="py-3">26.5</td><td className="py-3">8.5</td></tr>
                                  <tr className="border-b border-black/5"><td className="py-3 font-bold">43</td><td className="py-3">27.5</td><td className="py-3">9.5</td></tr>
                                  <tr className="border-b border-black/5"><td className="py-3 font-bold">44</td><td className="py-3">28.0</td><td className="py-3">10</td></tr>
                                </tbody>
                              </table>
                            ) : (
                              <table className="w-full text-sm min-w-[300px]">
                                <thead>
                                  <tr className="border-b-2 border-black/20">
                                    <th className="py-3 text-left font-black uppercase tracking-widest text-[10px]">Size</th>
                                    <th className="py-3 text-left font-black uppercase tracking-widest text-[10px]">Chiều cao (cm)</th>
                                    <th className="py-3 text-left font-black uppercase tracking-widest text-[10px]">Cân nặng (kg)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-b border-black/5"><td className="py-3 font-bold">S</td><td className="py-3">155 - 160</td><td className="py-3">45 - 50</td></tr>
                                  <tr className="border-b border-black/5"><td className="py-3 font-bold">M</td><td className="py-3">160 - 165</td><td className="py-3">50 - 55</td></tr>
                                  <tr className="border-b border-black/5"><td className="py-3 font-bold">L</td><td className="py-3">165 - 170</td><td className="py-3">55 - 65</td></tr>
                                  <tr className="border-b border-black/5"><td className="py-3 font-bold">XL</td><td className="py-3">170 - 175</td><td className="py-3">65 - 75</td></tr>
                                  <tr className="border-b border-black/5"><td className="py-3 font-bold">XXL</td><td className="py-3">175 - 180</td><td className="py-3">75 - 85</td></tr>
                                </tbody>
                              </table>
                            )}
                          </div>
                          <p className="mt-6 text-xs text-muted-foreground font-medium italic">* Bảng kích thước mang tính chất tham khảo. Xin liên hệ để được tư vấn.</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {variants.map((v) => (
                      <button
                        key={v.size}
                        onClick={() => setSelectedSize(v.size)}
                        className={`h-12 min-w-[3rem] px-4 rounded-xl border-2 font-bold text-sm transition-all duration-300 active:scale-95 relative ${selectedSize === v.size
                            ? "border-primary bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                            : "border-black/5 hover:border-black/20 text-foreground"
                          } ${v.stock === 0 ? 'opacity-50 grayscale' : ''}`}
                      >
                        {v.size}
                        {v.stock === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-[2px] bg-rose-500/50 rotate-45" />
                          </div>
                        )}
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex items-center justify-between sm:justify-center border-2 border-primary/10 rounded-full h-14 bg-white overflow-hidden shadow-sm shrink-0 px-2 sm:px-0 sm:w-auto">
                  <button 
                    disabled={isOutOfStock}
                    onClick={() => setQty(Math.max(1, qty - 1))} 
                    className="w-12 h-full flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 rounded-full sm:rounded-none"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-lg tabular-nums">{qty}</span>
                  <button 
                    disabled={isOutOfStock || (currentVariant && qty >= currentVariant.stock)}
                    onClick={() => {
                      if (currentVariant && qty >= currentVariant.stock) {
                        toast.error(`Chỉ có thể mua tối đa ${currentVariant.stock} sản phẩm`);
                        return;
                      }
                      setQty(qty + 1);
                    }} 
                    className="w-12 h-full flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 rounded-full sm:rounded-none"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button 
                  onClick={handleAdd} 
                  disabled={isOutOfStock || (hasVariants && !selectedSize)}
                  size="lg" 
                  variant="outline" 
                  className="flex-1 h-14 text-sm sm:text-lg font-bold border-2 border-primary hover:bg-primary hover:text-white rounded-full disabled:opacity-50 whitespace-nowrap"
                >
                  <ShoppingBag className="mr-2 h-5 w-5 shrink-0" /> 
                  <span className="truncate">{isOutOfStock ? "HẾT HÀNG" : "Thêm vào giỏ"}</span>
                </Button>
              </div>
              <Button 
                onClick={handleBuyNow} 
                disabled={isOutOfStock || (hasVariants && !selectedSize)}
                size="lg" 
                className="h-14 w-full text-xl font-black rounded-full shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {isOutOfStock ? "SẢN PHẨM HẾT HÀNG" : "MUA NGAY"}
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
