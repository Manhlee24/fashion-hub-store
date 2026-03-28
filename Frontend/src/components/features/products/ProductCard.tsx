import { Link } from "react-router-dom";
import { Product } from "@/lib/types";
import { ArrowRight } from "lucide-react";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(numericPrice);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative block overflow-hidden bg-white transition-all duration-700 hover:shadow-premium-hover shadow-premium active:scale-[0.99] border border-black/[0.03]"
    >
      <div className="aspect-[3/4] overflow-hidden bg-secondary/30 relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-1000 cubic-bezier(0.19, 1, 0.22, 1) group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold">
            No Image
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-4">
          <div className="w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-700 bg-white/90 backdrop-blur-md text-black py-3 rounded-none font-bold text-[10px] uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-2 border border-black/5">
            Xem Sản Phẩm <ArrowRight className="h-3 w-3" />
          </div>
        </div>

        {/* Badge */}
        {product.is_featured && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-black text-[9px] font-bold px-3 py-1 uppercase tracking-[0.2em] z-10 border border-black/5">
            Nổi bật
          </div>
        )}
      </div>

      <div className="p-6 space-y-2 text-center">
        <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.2em] truncate px-2">
          {product.name}
        </h3>
        <p className="text-sm font-bold text-foreground tracking-tight">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
