import { useState, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { orderService } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  ChevronRight, 
  MapPin, 
  Phone, 
  User, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  ShoppingCart,
  Loader2
} from "lucide-react";

export default function Checkout() {
  const { user } = useAuth();
  const { items: cartItems, totalAmount: cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ receiver_name: "", phone: "", address: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if we're doing a direct purchase (Buy Now)
  const directItem = location.state?.directItem;

  const { items, totalAmount, isDirect } = useMemo(() => {
    if (directItem) {
      return {
        items: [directItem],
        totalAmount: directItem.price * directItem.quantity,
        isDirect: true
      };
    }
    return {
      items: cartItems,
      totalAmount: cartTotal,
      isDirect: false
    };
  }, [directItem, cartItems, cartTotal]);

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

    try {
      const orderItems = items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        size: item.size
      }));

      await orderService.createOrder({
        total_amount: totalAmount,
        items: orderItems,
        // @ts-ignore - Backend expects these in body too
        receiver_name: form.receiver_name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });

      if (!isDirect) {
        clearCart();
      }
      
      toast.success("Đặt hàng thành công!");
      navigate("/orders");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi tạo đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] animate-fade-in">
      <div className="container mx-auto px-6 py-12 md:py-20 max-w-7xl">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-12">
          <Link to="/" className="hover:text-black transition-colors">HNAMSTORE</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/cart" className="hover:text-black transition-colors">Giỏ hàng</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-black">Thanh toán</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-16 md:gap-24">
          {/* Main Content - Shipping Form */}
          <div className="lg:col-span-7 space-y-16">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black">
                THANH TOÁN
              </h1>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-black/30 italic">
                Vui lòng cung cấp chi tiết giao hàng của bạn.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="space-y-10">
                <div className="flex items-center gap-4 pb-4 border-b border-black/5 text-black">
                   <div className="h-10 w-10 rounded-2xl bg-black flex items-center justify-center text-white">
                      <Truck className="h-4 w-4" />
                   </div>
                   <h2 className="text-[12px] font-black uppercase tracking-[0.3em]">Thông tin nhận hàng</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="receiver_name" className="text-[10px] font-black uppercase tracking-widest text-black/40">Tên người nhận *</Label>
                    <div className="relative group">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/20 group-focus-within:text-black transition-colors" />
                       <Input
                         id="receiver_name"
                         placeholder="VÍ DỤ: NGUYỄN VĂN A"
                         value={form.receiver_name}
                         onChange={(e) => setForm({ ...form, receiver_name: e.target.value })}
                         className="h-14 pl-12 rounded-2xl border-black/5 bg-white font-black uppercase tracking-widest text-[11px] placeholder:text-black/10 transition-all focus:ring-black/5"
                       />
                    </div>
                    {errors.receiver_name && <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">{errors.receiver_name}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-black/40">Số điện thoại *</Label>
                    <div className="relative group">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/20 group-focus-within:text-black transition-colors" />
                       <Input
                         id="phone"
                         placeholder="VÍ DỤ: 0987654321"
                         value={form.phone}
                         onChange={(e) => setForm({ ...form, phone: e.target.value })}
                         className="h-14 pl-12 rounded-2xl border-black/5 bg-white font-black uppercase tracking-widest text-[11px] placeholder:text-black/10 transition-all focus:ring-black/5"
                       />
                    </div>
                    {errors.phone && <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">{errors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-black/40">Địa chỉ cụ thể *</Label>
                  <div className="relative group">
                     <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/20 group-focus-within:text-black transition-colors" />
                     <Input
                       id="address"
                       placeholder="VÍ DỤ: 123 ĐƯỜNG LÊ LỢI, QUẬN 1, TP. HCM"
                       value={form.address}
                       onChange={(e) => setForm({ ...form, address: e.target.value })}
                       className="h-14 pl-12 rounded-2xl border-black/5 bg-white font-black uppercase tracking-widest text-[11px] placeholder:text-black/10 transition-all focus:ring-black/5"
                     />
                  </div>
                  {errors.address && <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">{errors.address}</p>}
                </div>
              </div>

              <div className="space-y-10">
                 <div className="flex items-center gap-4 pb-4 border-b border-black/5 text-black">
                    <div className="h-10 w-10 rounded-2xl bg-black flex items-center justify-center text-white">
                       <CreditCard className="h-4 w-4" />
                    </div>
                    <h2 className="text-[12px] font-black uppercase tracking-[0.3em]">Phương thức thanh toán</h2>
                 </div>

                 <div className="bg-black text-white p-6 rounded-[32px] flex items-center justify-between group cursor-default border border-black group-hover:bg-white group-hover:text-black transition-all">
                    <div className="flex items-center gap-6">
                       <div className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center">
                          <CreditCard className="h-5 w-5" />
                       </div>
                       <div>
                          <p className="text-[11px] font-black uppercase tracking-widest">Thanh toán khi nhận hàng (COD)</p>
                          <p className="text-[9px] font-medium text-white/50 lowercase mt-1 italic">Nhận hàng rồi mới thanh toán tiền mặt</p>
                       </div>
                    </div>
                    <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center text-black">
                       <div className="h-2 w-2 rounded-full bg-black"></div>
                    </div>
                 </div>
              </div>
              
              <div className="hidden lg:block pt-8 text-black/20 text-[9px] font-black uppercase tracking-[0.5em] italic">
                 HNAMSTORE OFFICIAL STORE
              </div>
            </form>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8 animate-fade-in-up md:delay-200">
               <div className="bg-white rounded-[40px] border border-black/5 overflow-hidden shadow-2xl shadow-black/[0.02]">
                  <div className="p-10 bg-black text-white flex items-center justify-between">
                     <h3 className="text-[12px] font-black uppercase tracking-[0.3em]">Tóm tắt đơn hàng</h3>
                     <ShoppingCart className="h-4 w-4 text-white/40" />
                  </div>

                  <div className="p-10 space-y-8">
                     <div className="space-y-6">
                       {items.map((item) => (
                         <div key={`${item.id}-${item.size}`} className="flex justify-between items-start gap-4 animate-fade-in-up">
                           <div className="space-y-1 flex-1">
                             <p className="text-[12px] font-black uppercase tracking-tight text-black line-clamp-1">{item.product_name}</p>
                             <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest text-black/30">
                                <span>SL: {item.quantity}</span>
                                {item.size && <span>Size: {item.size}</span>}
                             </div>
                           </div>
                           <p className="text-[12px] font-black tabular-nums text-black">{formatPrice(item.price * item.quantity)}</p>
                         </div>
                       ))}
                     </div>

                     <div className="space-y-4 pt-8 border-t border-black/5">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-black/40">
                           <span>Tạm tính</span>
                           <span className="tabular-nums">{formatPrice(totalAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Vận chuyển</span>
                           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Miễn phí</span>
                        </div>
                        
                        <div className="pt-8 flex justify-between items-end">
                           <p className="text-[12px] font-black uppercase tracking-[0.3em] text-black">Tổng cộng</p>
                           <p className="text-4xl font-black uppercase tracking-tighter tabular-nums text-black">{formatPrice(totalAmount)}</p>
                        </div>
                     </div>

                     <Button 
                       onClick={handleSubmit} 
                       disabled={loading}
                       className="w-full h-16 rounded-[28px] bg-black text-white hover:bg-black/90 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-black/20 mt-8 group active:scale-[0.98] transition-all"
                     >
                       {loading ? (
                         <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-white/50" />
                            Đang xử lý...
                         </div>
                       ) : (
                         <div className="flex items-center gap-2">
                            Xác nhận đặt hàng <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                         </div>
                       )}
                     </Button>
                  </div>
               </div>

               <div className="p-10 border border-black/5 rounded-[40px] space-y-6 bg-[#FAFAFA]">
                  <div className="flex items-center gap-4">
                     <ShieldCheck className="h-6 w-6 text-emerald-500" />
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Bảo vệ đơn hàng</p>
                        <p className="text-[9px] font-medium text-black/30 italic mt-0.5">Mọi đơn hàng đều được HNAMSTORE kiểm duyệt kỹ lưỡng.</p>
                     </div>
                  </div>
                  <div className="pt-4 border-t border-black/5 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.4em] text-black/20">
                     <span>Secure Checkout</span>
                     <div className="flex gap-2 opacity-50">
                        <div className="h-4 w-8 bg-black/10 rounded"></div>
                        <div className="h-4 w-8 bg-black/10 rounded"></div>
                        <div className="h-4 w-8 bg-black/10 rounded"></div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
