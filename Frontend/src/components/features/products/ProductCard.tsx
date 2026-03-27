import { Link } from "react-router-dom";
import { Product } from "@/lib/types";
import { ShoppingBag } from "lucide-react";

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
      className="group relative block overflow-hidden rounded-2xl bg-white transition-all duration-500 hover:shadow-premium-hover shadow-premium active:scale-[0.98]"
    >
      <div className="aspect-[4/5] overflow-hidden bg-muted relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-xs uppercase tracking-widest font-bold">
            No Image
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 bg-white text-black px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2">
            Xem chi tiết <ShoppingBag className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Badge - Optional */}
        {product.is_featured && (
          <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter z-10">
            Hot
          </div>
        )}
      </div>

      <div className="p-5 space-y-1.5">
        <h3 className="text-sm font-bold truncate text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-base font-black text-foreground">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}
