import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { LayoutDashboard, Package, FolderOpen, ShoppingCart, Image, LogOut, ArrowLeft, Menu, X, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { label: "Tổng quan", to: "/admin", icon: LayoutDashboard },
  { label: "Danh mục", to: "/admin/categories", icon: FolderOpen },
  { label: "Sản phẩm", to: "/admin/products", icon: Package },
  { label: "Đơn hàng", to: "/admin/orders", icon: ShoppingCart },
  { label: "Hero Section", to: "/admin/heroes", icon: Image },
];

export default function AdminLayout() {
  const { isAdmin, loading, signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/");
  }, [loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">Đang khởi tạo hệ thống...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-black text-white shrink-0 sticky top-0 h-screen">
        <div className="p-8 border-b border-white/5">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors mb-8 group">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Về cửa hàng
          </Link>
          <div className="space-y-1">
            <h2 className="text-xl font-black uppercase tracking-tighter">HNAMSTORE</h2>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 italic">Hệ thống Quản trị</p>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                  active 
                    ? "bg-white text-black shadow-xl shadow-white/10" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`h-4 w-4 ${active ? "text-black" : "text-white/20"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="bg-white/5 rounded-[32px] p-6 space-y-4 text-center lg:text-left">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-black">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black uppercase tracking-tight truncate">{user?.name || "Quản trị viên"}</p>
                <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Admin Access</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => signOut()} 
              className="w-full justify-center lg:justify-start h-10 rounded-full text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-white/5"
            >
              <LogOut className="mr-2 h-3.5 w-3.5" /> Đăng xuất
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="h-20 lg:h-24 bg-white border-b border-black/5 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-30">
          <div className="flex items-center gap-4">
             {/* Mobile Menu Trigger */}
             <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="lg:hidden">
                   <Menu className="h-5 w-5" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="p-0 bg-black text-white border-none w-80">
                 <div className="flex flex-col h-full">
                    <div className="p-8 border-b border-white/5">
                       <h2 className="text-xl font-black uppercase tracking-tighter">HNAMSTORE</h2>
                       <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 italic">Admin Management</p>
                    </div>
                    <nav className="flex-1 p-6 space-y-2">
                       {navItems.map((item) => {
                         const active = location.pathname === item.to;
                         return (
                           <Link
                             key={item.to}
                             to={item.to}
                             onClick={() => setIsMobileMenuOpen(false)}
                             className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                               active ? "bg-white text-black" : "text-white/40 hover:text-white"
                             }`}
                           >
                             <item.icon className="h-4 w-4" />
                             {item.label}
                           </Link>
                         );
                       })}
                    </nav>
                 </div>
               </SheetContent>
             </Sheet>
             
             <div className="hidden lg:block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 hidden lg:block">Trạng thái hệ thống: Sẵn sàng</h3>
             <h3 className="text-[11px] font-black uppercase tracking-widest lg:hidden">HNAMSTORE ADMIN</h3>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
             <Button variant="ghost" size="icon" className="h-10 w-10 md:h-12 md:w-12 rounded-full border border-black/5">
                <Bell className="h-4 w-4 text-black/40" />
             </Button>
             <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-black flex items-center justify-center text-[10px] font-black text-white ring-4 ring-black/5 cursor-pointer">
                {user?.name?.charAt(0).toUpperCase() || "A"}
             </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="p-6 md:p-12 lg:p-16">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
