import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { orderService } from "@/services/orderService";
import { categoryService } from "@/services/categoryService";
import { Package, ShoppingCart, FolderOpen } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, categories: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([
      productService.getProducts(),
      orderService.getOrders(),
      categoryService.getCategories(),
    ]).then(([products, orders, categories]) => {
      setStats({
        products: (products as any).length,
        orders: (orders as any).length,
        categories: (categories as any).length,
        revenue: (orders as any).reduce((sum: number, ord: any) => sum + Number(ord.total_amount), 0),
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
