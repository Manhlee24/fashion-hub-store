import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Checkout() {
  const { user } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ receiver_name: "", phone: "", address: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.receiver_name.trim()) e.receiver_name = "Vui lòng nhập tên người nhận";
    if (!form.phone.trim()) e.phone = "Vui lòng nhập số điện thoại";
    else if (!/^[0-9]{9,11}$/.test(form.phone.trim())) e.phone = "Số điện thoại không hợp lệ";
    if (!form.address.trim()) e.address = "Vui lòng nhập địa chỉ";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        receiver_name: form.receiver_name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        total_amount: totalAmount,
      })
      .select()
      .single();

    if (error || !order) {
      toast.error("Lỗi khi tạo đơn hàng");
      setLoading(false);
      return;
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) {
      toast.error("Lỗi khi lưu sản phẩm đơn hàng");
      setLoading(false);
      return;
    }

    clearCart();
    toast.success("Đặt hàng thành công!");
    navigate("/orders");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Thanh toán</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold">Thông tin nhận hàng</h2>

          <div>
            <Label htmlFor="receiver_name">Tên người nhận *</Label>
            <Input
              id="receiver_name"
              value={form.receiver_name}
              onChange={(e) => setForm({ ...form, receiver_name: e.target.value })}
              className="mt-1.5"
            />
            {errors.receiver_name && <p className="text-sm text-destructive mt-1">{errors.receiver_name}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Số điện thoại *</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1.5"
            />
            {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="address">Địa chỉ nhận hàng *</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="mt-1.5"
            />
            {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="font-semibold mb-4">Tóm tắt đơn hàng</h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.product_name} × {item.quantity}</span>
                <span className="tabular-nums">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t">
            <span>Tổng cộng</span>
            <span className="tabular-nums">{formatPrice(totalAmount)}</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Phương thức: Thanh toán khi nhận hàng (COD)</p>
        </div>

        <Button type="submit" className="w-full active:scale-[0.97]" size="lg" disabled={loading}>
          {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
        </Button>
      </form>
    </div>
  );
}
