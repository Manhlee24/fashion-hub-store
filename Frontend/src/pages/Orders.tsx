import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { orderService } from "@/services/orderService";
import { Badge } from "@/components/ui/badge";
import { Package, ChevronRight, ArrowRight, Calendar, User, MapPin, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const statusMap: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: "Chờ duyệt", bg: "bg-amber-500/10", text: "text-amber-600" },
  confirmed: { label: "Đã duyệt", bg: "bg-blue-500/10", text: "text-blue-600" },
  shipping: { label: "Đang giao", bg: "bg-indigo-500/10", text: "text-indigo-600" },
  completed: { label: "Hoàn thành", bg: "bg-emerald-500/10", text: "text-emerald-600" },
  cancelled: { label: "Đã hủy", bg: "bg-rose-500/10", text: "text-rose-600" },
};

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);

  const handleViewDetails = async (id: number) => {
    setIsDetailsOpen(true);
    setDetailsLoading(true);
    try {
      const data = await orderService.getOrderById(id);
      setSelectedOrder(data);
    } catch (error) {
      console.error("Failed to fetch order details", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCancelOrder = (id: number) => {
    setCancelOrderId(id);
  };

  const confirmCancelOrder = async () => {
    if (!cancelOrderId) return;
    try {
      await orderService.updateOrderStatus(cancelOrderId, 'cancelled');
      toast.success("Hủy đơn hàng thành công");
      
      // Update local state
      setOrders(orders.map(o => o.id === cancelOrderId ? { ...o, status: 'cancelled' } : o));
    } catch (error: any) {
      toast.error(error.message || "Không thể hủy đơn hàng");
    } finally {
      setCancelOrderId(null);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (!user) return;

    orderService.getUserOrders().then((data) => {
      setOrders(data ?? []);
      setLoading(false);
    });
  }, [user, authLoading, navigate]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  if (authLoading || loading) {
    return (
      <div className="bg-white min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-4 animate-pulse">
              <div className="h-4 w-32 bg-muted/50 rounded-full" />
              <div className="h-16 w-64 bg-muted/50 rounded-2xl" />
            </div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-muted/30 rounded-[32px] animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Editorial Header */}
      <div className="bg-white pt-24 pb-12 border-b border-black/5">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-12">
              <Link to="/" className="hover:text-black transition-colors">HNAMSTORE</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-black">Lịch sử đơn hàng</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-black">
                  ĐƠN HÀNG<br />CỦA BẠN
                </h1>
                <p className="text-muted-foreground text-sm font-medium tracking-wide max-w-sm">
                  Theo dõi trạng thái và chi tiết các giao dịch mua sắm của bạn tại HNAMSTORE.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-px w-20 bg-black/10 hidden md:block"></div>
                <span className="text-[11px] font-black uppercase tracking-widest text-black/40">
                  Tổng số {orders.length} Đơn hàng
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          {orders.length === 0 ? (
            <div className="text-center py-40 space-y-10 animate-fade-in">
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-muted/30">
                <Package className="h-10 w-10 text-black/10" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-black uppercase tracking-tight italic">Danh sách trống</h2>
                <p className="text-muted-foreground font-medium max-w-xs mx-auto">Bạn chưa thực hiện đơn đặt hàng nào. Hãy bắt đầu trải nghiệm mua sắm của bạn.</p>
              </div>
              <Button asChild className="h-14 px-10 rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-black/20 group">
                <Link to="/products" className="flex items-center gap-2">
                  Mua sắm ngay <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-8 md:space-y-12">
              {orders.map((order, i) => {
                const status = statusMap[order.status] ?? { label: order.status, bg: "bg-muted", text: "text-muted-foreground" };
                return (
                  <div
                    key={order.id}
                    className="group bg-white rounded-[40px] border border-black/5 p-8 md:p-12 hover:shadow-2xl hover:shadow-black/5 transition-all duration-700 animate-fade-in-up"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
                      {/* Left Side: Order Info */}
                      <div className="flex-1 space-y-8">
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="text-[11px] font-black uppercase tracking-[0.4em] bg-black text-white px-4 py-2 rounded-full">
                            #{String(order.id).split('-')[0].toUpperCase()}
                          </span>
                          <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${status.bg} ${status.text}`}>
                            {status.label}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-8 pt-4">
                          <div className="flex items-start gap-4">
                            <div className="h-10 w-10 shrink-0 rounded-2xl bg-muted/30 flex items-center justify-center">
                              <User className="h-4 w-4 text-black/40" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Người nhận</p>
                              <p className="text-sm font-black uppercase tracking-tight">{order.receiver_name}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="h-10 w-10 shrink-0 rounded-2xl bg-muted/30 flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-black/40" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Ngày đặt</p>
                              <p className="text-sm font-black uppercase tracking-tight">
                                {new Date(order.created_at).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="sm:col-span-2 flex items-start gap-4 p-6 bg-muted/20 rounded-3xl">
                            <MapPin className="h-4 w-4 text-black/40 mt-1" />
                            <div className="space-y-1">
                              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Địa chỉ giao hàng</p>
                              <p className="text-sm font-medium leading-relaxed">{order.address}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Summary & Actions */}
                      <div className="lg:w-72 space-y-8 lg:border-l lg:border-dashed lg:border-black/10 lg:pl-12">
                        <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center lg:text-left">Tổng thanh toán</p>
                          <p className="text-3xl font-black uppercase tracking-tighter text-center lg:text-left">
                            {formatPrice(order.total_amount)}
                          </p>
                        </div>

                        <div className="flex flex-col gap-3">
                          <Button 
                            onClick={() => handleViewDetails(order.id)}
                            variant="outline" 
                            className="h-12 rounded-full text-[10px] font-black uppercase tracking-widest border-2 hover:bg-black hover:text-white transition-all duration-500"
                          >
                            Chi tiết
                          </Button>
                          {order.status === 'pending' && (
                            <Button 
                              onClick={() => handleCancelOrder(order.id)}
                              variant="ghost" 
                              className="h-12 rounded-full text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-500"
                            >
                              Hủy đơn hàng
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Brand Footer Accent */}
        <div className="mt-10 pt-10 border-t border-black/5 flex flex-col items-center gap-8">
          <div className="text-[10px] font-black uppercase tracking-[1em] text-black/10">
            HNAMSTORE &copy; 2026
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-black/20 italic">
            Authentic Minimalist Experience
          </p>
        </div>
      </main>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] rounded-[32px] p-0 overflow-hidden bg-white">
          <div className="p-8 md:p-12 max-h-[85vh] overflow-y-auto">
            <DialogHeader className="mb-8 text-left">
              <DialogTitle className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black">Chi tiết đơn hàng</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Mã đơn: #{selectedOrder?.id?.toString().split('-')[0].toUpperCase()}
              </DialogDescription>
            </DialogHeader>

            {detailsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-black/20" />
                <p className="text-sm font-medium text-muted-foreground">Đang tải chi tiết...</p>
              </div>
            ) : selectedOrder ? (
              <div className="space-y-10 animate-fade-in-up">
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground border-b border-black/5 pb-2">Sản phẩm</h3>
                  <div className="space-y-6">
                    {selectedOrder.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <div className="h-20 w-20 bg-muted/30 rounded-2xl overflow-hidden flex-shrink-0 border border-black/5">
                          {item.product?.image_url ? (
                            <img src={item.product.image_url} alt={item.product_name} className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs font-bold uppercase">No Image</div>
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="font-bold uppercase tracking-tight text-black line-clamp-1">{item.product_name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Size: {item.size} • Số lượng: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-black tracking-tight text-black">{formatPrice(Number(item.unit_price) * item.quantity)}</p>
                          {item.quantity > 1 && (
                            <p className="text-[10px] font-medium text-muted-foreground">{formatPrice(Number(item.unit_price))} / sp</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/30 rounded-3xl p-6 md:p-8 space-y-4 border border-black/5">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-muted-foreground">Trạng thái:</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusMap[selectedOrder.status]?.bg || 'bg-muted'} ${statusMap[selectedOrder.status]?.text || 'text-muted-foreground'}`}>
                      {statusMap[selectedOrder.status]?.label || selectedOrder.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-black">
                    <span className="text-muted-foreground">Ngày đặt:</span>
                    <span>{new Date(selectedOrder.created_at).toLocaleString("vi-VN")}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-black">
                    <span className="text-muted-foreground">Người nhận:</span>
                    <span className="text-right">{selectedOrder.receiver_name} <br className="md:hidden" /> {selectedOrder.phone && `(${selectedOrder.phone})`}</span>
                  </div>
                  <div className="pt-4 border-t border-black/10 flex justify-between items-end mt-4">
                    <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Tổng thanh toán</span>
                    <span className="text-3xl font-black tracking-tighter text-black">{formatPrice(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground font-medium">Không tìm thấy thông tin chi tiết.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={!!cancelOrderId} onOpenChange={(open) => !open && setCancelOrderId(null)}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl p-6 bg-white">
          <DialogHeader className="mb-4 text-left">
            <DialogTitle className="text-xl font-black uppercase tracking-tight text-black">Hủy đơn hàng</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium mt-2">
              Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setCancelOrderId(null)} className="rounded-full font-bold">
              Đóng
            </Button>
            <Button variant="destructive" onClick={confirmCancelOrder} className="rounded-full font-bold bg-rose-500 hover:bg-rose-600">
              Đồng ý Hủy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
