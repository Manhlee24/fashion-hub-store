import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight, Shield, Star, Heart } from "lucide-react";

export default function About() {
  const brandValues = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Chất lượng vĩnh cửu",
      desc: "Chúng tôi chỉ sử dụng những vật liệu bền bỉ và cao cấp nhất cho từng sản phẩm."
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Thiết kế tối giản",
      desc: "Vẻ đẹp thực sự nằm ở sự đơn giản và tinh tế trong từng đường kim mũi chỉ."
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Tâm huyết thủ công",
      desc: "Mỗi thiết kế là một tác phẩm được chăm chút bởi những nghệ nhân lành nghề."
    }
  ];

  return (
    <div className="bg-[#FDFDFD] min-h-screen pb-20 animate-fade-in">
      {/* Hero Section - Editorial */}
      <div className="container mx-auto px-4 py-12 md:py-24">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-16">
          <Link to="/" className="hover:text-black transition-colors">HNAMSTORE</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-black">Về chúng tôi</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-12 items-end mb-24">
          <div className="lg:col-span-8">
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-black">
              CÂU CHUYỆN<br />
              <span className="text-black/10">DI SẢN</span>
            </h1>
          </div>
          <div className="lg:col-span-4 pb-4">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-black/30 mb-6 italic">Since 2026 &bull; Minimalist Elegance</p>
            <p className="text-sm font-medium leading-relaxed text-muted-foreground max-w-sm">
              HNAMSTORE ra đời từ khát vọng định nghĩa lại sự lịch lãm tối giản trong kỷ nguyên số. Chúng tôi tin rằng phong cách quý ông không chỉ đến từ bộ trang phục, mà là bản sắc của sự tự tin.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl transition-transform duration-700 hover:scale-[1.02]">
            <img
              src="https://images.pexels.com/photos/3839432/pexels-photo-3839432.jpeg"
              alt="HNAMSTORE Men's Fashion"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center space-y-12 md:pl-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic">Triết lý thiết kế</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Từng đường cắt, từng lựa chọn chất liệu tại HNAMSTORE đều được tính toán kỹ lưỡng để mang lại sự thoải mái tuyệt đối mà vẫn giữ được phom dáng sang trọng vượt thời gian.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-4xl font-black tabular-nums">100%</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Chất liệu tự nhiên</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-black tabular-nums">1500+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Khách hàng tin tưởng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Values Grids */}
        <div className="bg-black text-white rounded-[60px] p-12 md:p-24 mb-32 shadow-2xl shadow-black/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none italic">Giá trị cốt lõi</h2>
              <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-12 md:gap-8 text-center">
              {brandValues.map((v, i) => (
                <div key={i} className="space-y-6 group">
                  <div className="mx-auto h-16 w-16 rounded-3xl bg-white/10 flex items-center justify-center transition-all duration-500 group-hover:bg-emerald-500 group-hover:scale-110">
                    {v.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em]">{v.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed px-4">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heritage Section - Visual Narrative */}
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-5xl font-black uppercase tracking-tighter leading-tight italic">Chạm vào sự<br />hoàn mỹ</h2>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Tầm nhìn của chúng tôi là xây dựng một cộng đồng những người trân trọng giá trị đích thực, nơi mỗi sản phẩm không chỉ là một món đồ, mà là một kỷ niệm đồng hành cùng bạn qua năm tháng.
              </p>
            </div>
            <Link to="/products" className="inline-flex items-center gap-4 group">
              <div className="h-14 w-14 rounded-full border border-black/10 flex items-center justify-center transition-all duration-500 group-hover:bg-black group-hover:text-white">
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black underline underline-offset-8">Khám phá ngay</span>
            </Link>
          </div>

          <div className="relative">
            <div className="aspect-[3/4] rounded-[48px] overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/31318445/pexels-photo-31318445.jpeg"
                alt="Minimalist Tailoring"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-12 -left-12 hidden md:block w-64 p-8 glass rounded-[32px] border border-white/20 shadow-2xl animate-fade-in-up">
              <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-4">Cam kết dịch vụ</p>
              <p className="text-xs font-bold leading-relaxed">Giao hàng hỏa tốc trong 2h tại nội thành TP.HCM & Hà Nội.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
