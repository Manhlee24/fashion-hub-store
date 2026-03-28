import { useEffect, useState } from "react";
import { orderService } from "@/services/orderService";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, ShoppingBag, Clock, User, MapPin, Phone, CreditCard, ChevronRight, Search, Filter } from "lucide-react";

const statuses = [
  { value: "pending", label: "Chờ duyệt", bg: "bg-amber-500/10", text: "text-amber-600" },
  { value: "confirmed", label: "Đã duyệt", bg: "bg-blue-500/10", text: "text-blue-600" },
  { value: "shipping", label: "Đang giao", bg: "bg-indigo-500/10", text: "text-indigo-600" },
  { value: "completed", label: "Hoàn thành", bg: "bg-emerald-500/10", text: "text-emerald-600" },
  { value: "cancelled", label: "Đã hủy", bg: "bg-rose-500/10", text: "text-rose-600" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [detailOrder, setDetailOrder] = useState<any | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const load = () => {
    orderService.getOrders().then((data) => {
      let filtered = data ?? [];
      if (filterStatus !== "all") {
        filtered = filtered.filter((o: any) => o.status === filterStatus);
      }
      setOrders(filtered);
    });
  };

  useEffect(() => { load(); }, [filterStatus]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const filteredOrders = orders.filter(o => 
    String(o.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.receiver_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewDetail = async (order: any) => {
    setDetailOrder(order);
    try {
      const data: any = await orderService.getOrderById(order.id);
      setOrderItems(data.items ?? []);
    } catch (error: any) {
      toast.error("Không thể tải chi tiết đơn hàng");
    }
  };

  const updateStatus = async (orderId: number, status: string) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      load();
      if (detailOrder?.id === orderId) setDetailOrder((prev: any) => prev ? { ...prev, status } : null);
      toast.success("Đã cập nhật trạng thái");
    } catch (error: any) {
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Đơn hàng</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">Theo dõi và quản lý giao dịch của khách hàng.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/20 group-focus-within:text-black transition-colors" />
            <input 
              placeholder="TÌM MÃ ĐƠN/KHÁCH HÀNG..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 w-full md:w-80 rounded-full pl-12 pr-6 bg-white border border-black/5 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-black/10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-14 w-40 rounded-full border-black/5 bg-white text-[10px] font-black uppercase tracking-widest pl-6">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-black/40" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-black/5">
              <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">Tất cả</SelectItem>
              {statuses.map((s) => <SelectItem key={s.value} value={s.value} className="text-[10px] font-black uppercase tracking-widest">{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-black/5 overflow-hidden shadow-2xl shadow-black/[0.02]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-black/5 bg-[#FBFBFB] hover:bg-transparent">
                <TableHead className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-black/40">Mã đơn</TableHead>
                <TableHead className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-black/40">Khách hàng</TableHead>
                <TableHead className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-black/40">Thanh toán</TableHead>
                <TableHead className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-black/40">Trạng thái</TableHead>
                <TableHead className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-black/40">Thời gian</TableHead>
                <TableHead className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-black/40 text-right">Chi tiết</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((o) => {
                const status = statuses.find(s => s.value === o.status) || { label: o.status, bg: "bg-black/5", text: "text-black/40" };
                return (
                  <tr key={o.id} className="group hover:bg-[#FAFAFA] transition-colors border-b border-black/5 last:border-0 cursor-default">
                    <td className="px-8 py-8">
                       <span className="text-[11px] font-black uppercase tracking-tighter text-black">#{String(o.id).split('-')[0]}</span>
                    </td>
                    <td className="px-8 py-8">
                       <p className="text-[12px] font-black uppercase tracking-tight text-black">{o.receiver_name}</p>
                       <p className="text-[9px] font-medium text-black/30 lowercase italic truncate max-w-[150px]">{o.address}</p>
                    </td>
                    <td className="px-8 py-8">
                       <p className="text-[12px] font-black tabular-nums text-black">{formatPrice(o.total_amount)}</p>
                    </td>
                    <td className="px-8 py-8">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${status.bg} ${status.text}`}>
                         {status.label}
                       </span>
                    </td>
                    <td className="px-8 py-8">
                       <p className="text-[10px] font-black uppercase tracking-widest text-black/40">
                         {new Date(o.created_at).toLocaleDateString("vi-VN")}
                       </p>
                    </td>
                    <td className="px-8 py-8 text-right">
                       <Button variant="ghost" size="icon" onClick={() => viewDetail(o)} className="h-10 w-10 rounded-full hover:bg-black hover:text-white transition-all">
                          <Eye className="h-4 w-4" />
                       </Button>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr className="hover:bg-transparent">
                  <td colSpan={6} className="text-center py-40 space-y-4">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted/30">
                       <ShoppingBag className="h-10 w-10 text-black/10" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20">Không có đơn hàng nào</p>
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!detailOrder} onOpenChange={() => setDetailOrder(null)}>
        <DialogContent className="max-w-3xl rounded-[40px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-10 bg-black text-white flex justify-between items-start">
             <div className="space-y-2">
                <DialogTitle className="text-3xl font-black uppercase tracking-tighter">
                  ĐƠN HÀNG #{String(detailOrder?.id).split('-')[0].toUpperCase()}
                </DialogTitle>
                <div className="flex items-center gap-3">
                   <Clock className="h-3.5 w-3.5 text-white/40" />
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">
                     {detailOrder && new Date(detailOrder.created_at).toLocaleString("vi-VN")}
                   </p>
                </div>
             </div>
             <Badge className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-none ${
               statuses.find(s => s.value === detailOrder?.status)?.bg || "bg-white/10"
             } ${statuses.find(s => s.value === detailOrder?.status)?.text || "text-white"}`}>
               {statuses.find(s => s.value === detailOrder?.status)?.label || detailOrder?.status}
             </Badge>
          </div>

          <div className="p-10 grid md:grid-cols-3 gap-12 bg-white max-h-[70vh] overflow-y-auto">
             {/* Customer & Info */}
             <div className="md:col-span-1 space-y-10">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 pb-2 border-b border-black/5">Khách hàng</h4>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                       <User className="h-4 w-4 text-black/40 shrink-0" />
                       <p className="text-[12px] font-black uppercase tracking-tight">{detailOrder?.receiver_name}</p>
                    </div>
                    <div className="flex gap-4">
                       <Phone className="h-4 w-4 text-black/40 shrink-0" />
                       <p className="text-[12px] font-medium">{detailOrder?.phone}</p>
                    </div>
                    <div className="flex gap-4">
                       <MapPin className="h-4 w-4 text-black/40 shrink-0" />
                       <p className="text-[11px] font-medium leading-relaxed">{detailOrder?.address}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 pb-2 border-b border-black/5">Cập nhật trạng thái</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {statuses.map((s) => (
                      <Button
                        key={s.value}
                        variant={detailOrder?.status === s.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateStatus(detailOrder.id, s.value)}
                        className={`h-11 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                          detailOrder?.status === s.value ? "bg-black text-white" : "border-black/5 hover:bg-black hover:text-white"
                        }`}
                      >
                        {s.label}
                      </Button>
                    ))}
                  </div>
                </div>
             </div>

             {/* Order Content */}
             <div className="md:col-span-2 space-y-10">
                <div className="space-y-6">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 pb-2 border-b border-black/5">Sản phẩm đã đặt</h4>
                   <div className="rounded-[28px] border border-black/5 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-[#FBFBFB] hover:bg-transparent">
                            <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest">Sản phẩm</TableHead>
                            <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-center">SL</TableHead>
                            <TableHead className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-right">Tổng</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orderItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="px-6 py-5">
                                 <p className="text-[11px] font-black uppercase tracking-tight">{item.product_name}</p>
                                 <p className="text-[9px] font-black text-black/30 tabular-nums uppercase">{formatPrice(item.unit_price)}</p>
                              </TableCell>
                              <TableCell className="px-6 py-5 text-center text-[11px] font-black">×{item.quantity}</TableCell>
                              <TableCell className="px-6 py-5 text-right font-black text-[11px] tabular-nums">
                                {formatPrice(item.unit_price * item.quantity)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                   </div>
                </div>

                <div className="bg-muted/30 rounded-[32px] p-8 space-y-4">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-black/40">
                      <span>Tạm tính</span>
                      <span className="tabular-nums">{formatPrice(detailOrder?.total_amount || 0)}</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-black/40">
                      <span>Vận chuyển</span>
                      <span className="text-emerald-600">MIỄN PHÍ</span>
                   </div>
                   <div className="pt-4 border-t border-black/5 flex justify-between items-center">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em]">Tổng thanh toán</p>
                      <p className="text-3xl font-black uppercase tracking-tighter tabular-nums">
                        {formatPrice(detailOrder?.total_amount || 0)}
                      </p>
                   </div>
                </div>
             </div>
          </div>

          <DialogFooter className="p-8 border-t border-black/5 bg-[#FBFBFB]">
             <Button onClick={() => setDetailOrder(null)} className="h-14 px-12 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl shadow-black/20 w-full sm:w-auto">
                Đóng chi tiết
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
