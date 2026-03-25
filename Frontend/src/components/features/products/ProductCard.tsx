import { Link } from "react-router-dom";
import { Product } from "@/lib/types";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md active:scale-[0.98]"
    >
      <div className="aspect-[3/4] overflow-hidden bg-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            Không có ảnh
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium truncate">{product.name}</h3>
        <p className="mt-1 text-sm font-semibold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
