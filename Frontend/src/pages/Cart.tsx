import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeItem, totalAmount } = useCart();
  const { user } = useAuth();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h2 className="mt-4 text-xl font-semibold">Bạn chưa đăng nhập</h2>
        <p className="mt-2 text-muted-foreground">Vui lòng đăng nhập để xem giỏ hàng của bạn.</p>
        <Link to="/auth">
          <Button className="mt-6 active:scale-95">Đăng nhập ngay</Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h2 className="mt-4 text-xl font-semibold">Giỏ hàng trống</h2>
        <p className="mt-2 text-muted-foreground">Hãy khám phá các sản phẩm của chúng tôi.</p>
        <Link to="/products">
          <Button className="mt-6 active:scale-95">Mua sắm ngay</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Giỏ hàng</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
              <div className="w-20 h-24 rounded bg-muted overflow-hidden shrink-0">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.product_name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">N/A</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.id}`} className="font-medium text-sm hover:underline truncate block">
                  {item.product_name}
                </Link>
                <p className="text-sm font-semibold mt-1">{formatPrice(item.price)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center border rounded-md">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-accent transition-colors active:scale-95">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-xs font-medium tabular-nums">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-accent transition-colors active:scale-95">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors active:scale-95">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm font-semibold tabular-nums">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="border rounded-lg p-6 h-fit sticky top-20">
          <h3 className="font-semibold mb-4">Tóm tắt đơn hàng</h3>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Tạm tính</span>
            <span className="font-medium tabular-nums">{formatPrice(totalAmount)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t">
            <span>Tổng cộng</span>
            <span className="tabular-nums">{formatPrice(totalAmount)}</span>
          </div>
          {user ? (
            <Link to="/checkout">
              <Button className="w-full mt-6 active:scale-[0.97]">Thanh toán</Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button className="w-full mt-6 active:scale-[0.97]">Đăng nhập để thanh toán</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
