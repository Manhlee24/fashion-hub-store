import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { orderService } from "@/services/orderService";
import { categoryService } from "@/services/categoryService";
import { Package, ShoppingCart, FolderOpen, TrendingUp, DollarSign, ArrowUpRight, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, categories: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
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
      setRecentOrders((orders as any).slice(0, 5));
      setLoading(false);
    });
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const cards = [
    { label: "Doanh thu", value: formatPrice(stats.revenue), icon: DollarSign, trend: "+12.5%", color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { label: "Đơn hàng", value: stats.orders, icon: ShoppingCart, trend: "+4.3%", color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: "Sản phẩm", value: stats.products, icon: Package, trend: "0%", color: "text-amber-600", bg: "bg-amber-500/10" },
    { label: "Danh mục", value: stats.categories, icon: FolderOpen, trend: "Ổn định", color: "text-indigo-600", bg: "bg-indigo-500/10" },
  ];

  if (loading) {
    return (
       <div className="space-y-12 animate-pulse">
         <div className="h-10 w-48 bg-black/5 rounded-full" />
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-black/5 rounded-[32px]" />)}
         </div>
         <div className="h-64 bg-black/5 rounded-[40px]" />
       </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-black mb-2">Tổng quan</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">Hôm nay, {new Date().toLocaleDateString('vi-VN')}</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((c, i) => (
          <div key={c.label} className="group bg-white rounded-[32px] p-8 border border-black/5 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className={`h-12 w-12 rounded-2xl ${c.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </div>
              <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3" />
                {c.trend}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30">{c.label}</p>
              <p className="text-2xl font-black uppercase tracking-tighter tabular-nums text-black">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Orders & Activity Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Orders Table View */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-black/5 overflow-hidden">
          <div className="p-8 md:p-10 flex items-center justify-between border-b border-black/5 text-bold">
            <div className="flex items-center gap-3">
               <Clock className="h-4 w-4 text-black/40" />
               <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">Đơn hàng gần đây</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase tracking-widest text-black/40 hover:text-black">
               Tất cả <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/5 bg-[#FBFBFB]">
                  <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-black/30">Mã đơn</th>
                  <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-black/30">Khách hàng</th>
                  <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-black/30">Tổng cộng</th>
                  <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-black/30">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-[#FAFAFA] transition-colors cursor-pointer">
                    <td className="px-8 py-6 text-[10px] font-black uppercase tracking-tighter text-black">#{String(order.id).split('-')[0]}</td>
                    <td className="px-8 py-6">
                       <p className="text-[11px] font-black uppercase tracking-tight text-black">{order.receiver_name}</p>
                       <p className="text-[9px] font-medium text-black/30 lowercase italic">{new Date(order.created_at).toLocaleTimeString('vi-VN')}</p>
                    </td>
                    <td className="px-8 py-6 text-[11px] font-black tabular-nums">{formatPrice(order.total_amount)}</td>
                    <td className="px-8 py-6">
                       <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                         order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                         order.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-black/5 text-black/40'
                       }`}>
                         {order.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health / Quick Info Sidebar */}
        <div className="space-y-8">
           <div className="bg-black text-white rounded-[40px] p-10 space-y-8 shadow-2xl shadow-black/20">
              <div className="space-y-2">
                 <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Thao tác nhanh</h3>
                 <p className="text-2xl font-black uppercase tracking-tighter leading-tight italic">Tạo sản phẩm mới ngay bây giờ.</p>
              </div>
              <Button asChild className="w-full h-14 bg-white text-black hover:bg-white/90 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-white/10 group">
                 <a href="/admin/products" className="flex items-center gap-2">
                   Bắt đầu <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                 </a>
              </Button>
           </div>

           <div className="bg-white rounded-[40px] border border-black/5 p-10 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">Dung lượng kho</h3>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span>Sản phẩm active</span>
                       <span className="text-black/40">85%</span>
                    </div>
                    <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                       <div className="h-full bg-black rounded-full" style={{ width: '85%' }} />
                    </div>
                 </div>
                 <p className="text-[9px] font-medium text-black/30 italic">Hệ thống đang hoạt động ổn định với hiệu suất tối ưu.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
