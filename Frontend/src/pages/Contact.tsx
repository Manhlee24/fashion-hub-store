import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, ChevronRight, MessageSquare, Instagram, Facebook, Twitter, Heart } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Tin nhắn của bạn đã được gửi thành công!");
  };

  const contactInfos = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Email",
      value: "hello@hnamstore.vn",
      sub: "Hỗ trợ 24/7"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: "Hotline",
      value: "1900 8888",
      sub: "08:00 - 22:00"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "Showroom",
      value: "Quận 1, TP. Hồ Chí Minh",
      sub: "Địa chỉ flagship"
    }
  ];

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-20 animate-fade-in">
      <div className="container mx-auto px-4 py-12 md:py-24 max-w-7xl">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-16">
          <Link to="/" className="hover:text-black transition-colors">HNAMSTORE</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-black">Liên hệ</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-start">
          {/* Left Column - Information */}
          <div className="lg:col-span-5 space-y-16">
            <div className="space-y-8">
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none text-black italic">
                GET IN<br />
                <span className="text-black/10 non-italic">TOUCH</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn tìm thấy phong cách riêng. Đừng ngần ngại liên hệ nhé.
              </p>
            </div>

            <div className="grid gap-6">
              {contactInfos.map((info, i) => (
                <div key={i} className="group p-8 bg-white border border-black/5 rounded-[32px] shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1">
                  <div className="flex items-start gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center shrink-0 shadow-xl group-hover:scale-110 transition-transform">
                      {info.icon}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-black/30">{info.label}</p>
                      <p className="text-xl font-black tracking-tight">{info.value}</p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{info.sub}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-black/5 space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black">Follow the journey</p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <button key={i} className="h-12 w-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-500">
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Premium Form */}
          <div className="lg:col-span-7">
            <div className="glass p-8 md:p-16 rounded-[48px] border border-white shadow-2xl relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 h-40 w-40 bg-black/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>

              <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3 italic">
                    <MessageSquare className="h-6 w-6 text-emerald-500" /> Gửi lời nhắn
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-black/20">Phản hồi trong 24 Giờ</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40 ml-4">Họ và tên</Label>
                    <Input id="name" placeholder="Nguyễn Văn A" className="h-16 rounded-3xl border-2 border-black/5 focus:border-black transition-all bg-white/50 backdrop-blur-sm px-6 font-bold" required />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40 ml-4">Email của bạn</Label>
                    <Input id="email" type="email" placeholder="example@hnam.vn" className="h-16 rounded-3xl border-2 border-black/5 focus:border-black transition-all bg-white/50 backdrop-blur-sm px-6 font-bold" required />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="subject" className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40 ml-4">Chủ đề quan tâm</Label>
                  <Input id="subject" placeholder="Hợp tác, hỗ trợ đơn hàng..." className="h-16 rounded-3xl border-2 border-black/5 focus:border-black transition-all bg-white/50 backdrop-blur-sm px-6 font-bold" />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="message" className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40 ml-4">Nội dung tin nhắn</Label>
                  <Textarea id="message" placeholder="Chúng tôi có thể giúp gì cho bạn?" className="min-h-[200px] rounded-[32px] border-2 border-black/5 focus:border-black transition-all bg-white/50 backdrop-blur-sm p-8 font-bold resize-none" required />
                </div>

                <Button type="submit" className="w-full h-20 py-8 text-lg font-black rounded-full bg-black text-white hover:bg-black/90 shadow-2xl shadow-black/20 transition-all duration-500 group">
                  GỬI ĐI NGAY <Send className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Button>
              </form>
            </div>

            <div className="mt-12 p-8 border border-black/5 rounded-[40px] flex items-center gap-6 animate-fade-in-up">
              <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Heart className="h-6 w-6" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest leading-relaxed">
                Cảm ơn bạn đã lựa chọn HNAMSTORE. <br />
                <span className="text-black/40">Chúng tôi luôn trân trọng mọi ý kiến đóng góp.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
