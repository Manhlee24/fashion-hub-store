import { Link } from "react-router-dom";
import { ShoppingBag, User, Menu, X, LogOut } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from
"@/components/ui/dropdown-menu";

export default function Header() {
  const { totalItems } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
  { label: "Trang chủ", to: "/" },
  { label: "Sản phẩm", to: "/products" }];


  return (
    <header className="sticky top-0 z-50 glass border-b-0">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link to="/" className="text-2xl font-black tracking-[-0.05em] uppercase flex items-center gap-1 group">
          <span className="bg-black text-white px-2 py-0.5 rounded-sm group-hover:bg-emerald-500 transition-colors">H</span>
          NAM<span className="text-[10px] align-top mt-1 font-bold">™</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground transition-all hover:text-black relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-black after:transition-all hover:after:w-full"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user && (
            <Link to="/cart" className="relative p-2 hover:bg-accent rounded-md transition-colors active:scale-95">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {user ?
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="active:scale-95">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/orders">Đơn hàng của tôi</Link>
                </DropdownMenuItem>
                {isAdmin &&
              <DropdownMenuItem asChild>
                    <Link to="/admin">Quản trị</Link>
                  </DropdownMenuItem>
              }
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> :

          <Link to="/auth">
              <Button variant="outline" size="sm" className="active:scale-95">
                Đăng nhập
              </Button>
            </Link>
          }

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden active:scale-95"
            onClick={() => setMobileOpen(!mobileOpen)}>
            
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen &&
      <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-3">
            {navLinks.map((l) =>
          <Link
            key={l.to}
            to={l.to}
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors">
            
                {l.label}
              </Link>
          )}
          </nav>
        </div>
      }
    </header>);

}