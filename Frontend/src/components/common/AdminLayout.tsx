import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { LayoutDashboard, Package, FolderOpen, ShoppingCart, Image, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Tổng quan", to: "/admin", icon: LayoutDashboard },
  { label: "Danh mục", to: "/admin/categories", icon: FolderOpen },
  { label: "Sản phẩm", to: "/admin/products", icon: Package },
  { label: "Đơn hàng", to: "/admin/orders", icon: ShoppingCart },
  { label: "Hero Section", to: "/admin/heroes", icon: Image },
];

export default function AdminLayout() {
  const { isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/");
  }, [loading, isAdmin, navigate]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><p>Đang tải...</p></div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r bg-secondary/20">
        <div className="p-4 border-b">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2">
            <ArrowLeft className="h-3 w-3" /> Về cửa hàng
          </Link>
          <h2 className="font-bold tracking-[0.1em] uppercase text-sm">MENSWEAR Admin</h2>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  active ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t">
          <Button variant="ghost" size="sm" onClick={() => signOut()} className="w-full justify-start text-muted-foreground">
            <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-col flex-1">
        <div className="md:hidden border-b p-3 flex items-center gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition-colors ${
                  active ? "bg-foreground text-background font-medium" : "bg-secondary text-muted-foreground"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
