import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-secondary/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold tracking-[0.15em] uppercase mb-3">MENSWEAR</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Thời trang nam tối giản, hiện đại. Chất lượng vượt trội cho phong cách hàng ngày.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">Liên kết</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground transition-colors">Trang chủ</Link></li>
              <li><Link to="/products" className="hover:text-foreground transition-colors">Sản phẩm</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-3">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: contact@menswear.vn</li>
              <li>SĐT: 0901 234 567</li>
              <li>TP. Hồ Chí Minh, Việt Nam</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MENSWEAR. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
