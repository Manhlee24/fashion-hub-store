import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Chờ duyệt", variant: "secondary" },
  confirmed: { label: "Đã duyệt", variant: "default" },
  shipping: { label: "Đang giao", variant: "outline" },
  completed: { label: "Hoàn thành", variant: "default" },
  cancelled: { label: "Đã hủy", variant: "destructive" },
};

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Tables<"orders">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (!user) return;

    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? []);
        setLoading(false);
      });
  }, [user, authLoading, navigate]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Bạn chưa có đơn hàng nào.</p>
          <Link to="/products" className="text-sm underline mt-2 inline-block">Mua sắm ngay</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusMap[order.status] ?? { label: order.status, variant: "secondary" as const };
            return (
              <div key={order.id} className="border rounded-lg p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="text-sm text-muted-foreground">
                    #{order.id.slice(0, 8).toUpperCase()} · {new Date(order.created_at).toLocaleDateString("vi-VN")}
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                <div className="text-sm space-y-1">
                  <p>Người nhận: <span className="font-medium">{order.receiver_name}</span></p>
                  <p>Địa chỉ: {order.address}</p>
                  <p className="font-semibold">Tổng: {formatPrice(order.total_amount)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
