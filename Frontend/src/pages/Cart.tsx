import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package, ShieldCheck, Truck, ChevronRight } from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeItem, totalAmount } = useCart();
  const { user } = useAuth();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-32 text-center max-w-2xl animate-fade-in">
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-black/5 mb-8">
           <ShoppingBag className="h-10 w-10 text-black/20" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter text-black mb-4">Bạn chưa đăng nhập</h2>
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-black/30 mb-10 leading-relaxed">
          Đăng nhập để xem các sản phẩm trong giỏ hàng và hoàn thành việc mua sắm của bạn.
        </p>
        <Link to="/auth">
          <Button className="h-14 px-12 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl shadow-black/20 active:scale-95 group">
            Đăng nhập ngay <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-40 text-center max-w-2xl animate-fade-in">
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-black/5 mb-8">
           <ShoppingBag className="h-10 w-10 text-black/20" />
        </div>
        <h2 className="text-5xl font-black uppercase tracking-tighter text-black mb-4">Giỏ hàng trống</h2>
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-black/30 mb-10">
          Có vẻ như bạn chưa chọn được sản phẩm ưng ý.
        </p>
        <Link to="/products">
          <Button className="h-14 px-12 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl shadow-black/20 active:scale-95 group">
            Khám phá bộ sưu tập <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 md:py-24 max-w-7xl animate-fade-in">
      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-12">
        <Link to="/" className="hover:text-black transition-colors">HNAMSTORE</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-black">Giỏ hàng</span>
      </nav>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-black leading-none">
            GIỎ HÀNG<br/>CỦA BẠN
          </h1>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-black/30 tracking-widest italic">
            Tổng cộng ({items.reduce((acc, curr) => acc + curr.quantity, 0)}) sản phẩm
          </p>
        </div>
        <div className="flex items-center gap-4 text-black/10">
           <div className="h-px w-20 bg-current hidden md:block"></div>
           <span className="text-[10px] font-black uppercase tracking-[1em]">HNAMSTORE</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-16 md:gap-24">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-12">
          {items.map((item, i) => (
            <div 
              key={`${item.id}-${item.size}`} 
              className="group flex flex-col md:flex-row gap-8 pb-12 border-b border-black/5 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="md:w-48 md:h-64 rounded-[32px] bg-[#F8F8F8] overflow-hidden shrink-0 ring-1 ring-black/5 group-hover:shadow-2xl transition-all duration-700">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.product_name} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                ) : (
                  <div className="flex h-full items-center justify-center text-black/10">
                     <Package className="h-8 w-8" />
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between py-2">
                <div className="space-y-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <Link to={`/products/${item.id}`} className="text-2xl font-black uppercase tracking-tighter text-black hover:text-black/60 transition-colors">
                        {item.product_name}
                      </Link>
                      {item.size && (
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Kích cỡ: {item.size}</p>
                      )}
                    </div>
                    <p className="text-xl font-black uppercase tracking-tighter tabular-nums text-black">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  
                  <div className="bg-black/5 p-1 rounded-full w-fit flex items-center gap-1">
                     <button 
                       onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)} 
                       className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-white transition-all active:scale-90"
                     >
                       <Minus className="h-3 w-3" />
                     </button>
                     <span className="w-8 text-center text-[10px] font-black tabular-nums">{item.quantity}</span>
                     <button 
                       onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)} 
                       className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-white transition-all active:scale-90"
                     >
                       <Plus className="h-3 w-3" />
                     </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8 md:mt-0">
                   <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                         <ShieldCheck className="h-3 w-3 text-emerald-500" /> Còn hàng
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40 px-3 py-1">
                         <Truck className="h-3 w-3" /> Giao nội thành
                      </div>
                   </div>
                   <button 
                     onClick={() => removeItem(item.id, item.size)} 
                     className="group/del p-3 text-black/40 hover:text-rose-500 transition-all duration-300 active:scale-90 rounded-full hover:bg-rose-50"
                   >
                     <Trash2 className="h-4 w-4 transition-transform group-hover/del:rotate-12" />
                   </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="pt-12">
            <Link to="/products" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/40 hover:text-black transition-all group">
               <Package className="h-4 w-4 transition-transform group-hover:scale-110" /> Tiếp tục mua sắm
            </Link>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="relative">
          <div className="sticky top-32 space-y-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="bg-white rounded-[40px] p-10 border border-black/5 shadow-2xl shadow-black/[0.02]">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-black/30 mb-10 pb-4 border-b border-black/5">Tóm tắt đơn hàng</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Tạm tính</span>
                  <span className="text-[12px] font-black tabular-nums">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-black/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Phí vận chuyển</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Miễn phí</span>
                </div>
                
                <div className="pt-4 flex justify-between items-end">
                   <div>
                     <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black">Tổng số</p>
                     <p className="text-[8px] font-bold text-black/30 uppercase tracking-[0.2em] mt-1 italic">Đã bao gồm VAT</p>
                   </div>
                   <p className="text-4xl font-black uppercase tracking-tighter tabular-nums text-black">{formatPrice(totalAmount)}</p>
                </div>
              </div>

              {user ? (
                <Link to="/checkout" className="block mt-12">
                  <Button className="w-full h-16 rounded-[28px] bg-black text-white hover:bg-black/90 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-black/20 group">
                    Tiến hành thanh toán <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth" className="block mt-12">
                  <Button variant="outline" className="w-full h-16 rounded-[28px] border-2 border-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black hover:text-white transition-all">
                    Đăng nhập ngay
                  </Button>
                </Link>
              )}
            </div>

            <div className="p-8 border border-black/5 rounded-[40px] space-y-4 bg-muted/10">
               <div className="flex items-center gap-4">
                  <ShieldCheck className="h-5 w-5 text-black/20" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Thanh toán bảo mật 100%</p>
               </div>
               <p className="text-[9px] font-medium text-black/30 leading-relaxed italic">
                 Dữ liệu cá nhân của bạn sẽ được sử dụng để hỗ trợ trải nghiệm của bạn trên khắp trang web này.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
