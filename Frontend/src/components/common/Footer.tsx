import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-white pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-20 text-balance">
          {/* Brand Col */}
          <div className="space-y-8">
            <Link to="/" className="text-2xl font-black tracking-[-0.07em] uppercase flex items-center gap-1.5 group">
              <span className="bg-white text-black px-2.5 py-1 rounded-none group-hover:bg-emerald-400 transition-all duration-500">H</span>
              NAM<span className="text-[9px] align-top mt-1 font-bold opacity-30">™</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs font-medium uppercase tracking-wider text-[11px]">
              Thời trang nam tối giản, hiện đại. Chất lượng vượt trội cho phong cách hàng ngày và sự thanh lịch bản lĩnh.
            </p>
            <div className="flex items-center gap-6 text-white/30">
              <a href="#" className="hover:text-emerald-400 transition-colors duration-500"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-emerald-400 transition-colors duration-500"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-emerald-400 transition-colors duration-500"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Nav Col */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-white/50">Cửa hàng</h4>
            <ul className="space-y-4">
              {["Trang chủ", "Sản phẩm", "Bộ sưu tập", "Về chúng tôi"].map((item) => (
                <li key={item}>
                  <Link to={item === "Sản phẩm" ? "/products" : "/"} className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all duration-500 block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Col */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-white/50">Hỗ trợ</h4>
            <ul className="space-y-4">
              {["Giao hàng", "Đổi trả", "Chính sách", "Liên hệ"].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all duration-500 block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-white/50">Kết nối</h4>
            <div className="space-y-4 text-white/40 text-xs font-bold uppercase tracking-widest">
              <div className="flex items-center gap-4 group cursor-pointer hover:text-white transition-colors">
                <Mail className="h-4 w-4 opacity-50" />
                <span>contact@hnamstore.vn</span>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer hover:text-white transition-colors">
                <Phone className="h-4 w-4 opacity-50" />
                <span>0901 234 567</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="h-4 w-4 opacity-50" />
                <span className="leading-relaxed">Hà Nội, Việt Nam</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">
            © {currentYear} HNAMSTORE. BẢn quyền thuộc về hnamstore.vn
          </p>
          <div className="flex gap-8 text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Legal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
