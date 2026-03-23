import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, ShoppingCart, FolderOpen } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, categories: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id, total_amount"),
      supabase.from("categories").select("id", { count: "exact", head: true }),
    ]).then(([p, o, c]) => {
      const orders = o.data ?? [];
      setStats({
        products: p.count ?? 0,
        orders: orders.length,
        categories: c.count ?? 0,
        revenue: orders.reduce((sum, ord) => sum + Number(ord.total_amount), 0),
      });
    });
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const cards = [
    { label: "Sản phẩm", value: stats.products, icon: Package },
    { label: "Đơn hàng", value: stats.orders, icon: ShoppingCart },
    { label: "Danh mục", value: stats.categories, icon: FolderOpen },
    { label: "Doanh thu", value: formatPrice(stats.revenue), icon: ShoppingCart },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Tổng quan</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="border rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <c.icon className="h-4 w-4" />
              <span className="text-xs font-medium">{c.label}</span>
            </div>
            <p className="text-2xl font-bold tabular-nums">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
