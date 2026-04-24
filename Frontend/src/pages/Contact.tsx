import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, ChevronRight, MessageSquare, Instagram, Facebook, Twitter, Heart, Clock } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', formData);
      toast.success("Tin nhắn của bạn đã được gửi thành công!");
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      toast.error(error.message || "Không thể gửi tin nhắn. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfos = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Email",
      value: "contact@hnamstore.vn",
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
      value: "HÀ NỘI, VIỆT NAM",
      sub: "Địa chỉ flagship"
    }
  ];

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-20 animate-fade-in">
      <div className="container mx-auto px-4 py-12 md:py-24 max-w-7xl">
        <nav className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-12 md:mb-16">
          <Link to="/" className="hover:text-black transition-colors shrink-0">HNAMSTORE</Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <span className="text-black shrink-0">Liên hệ</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-12 md:gap-24 items-start">
          {/* Left Column - Information */}
          <div className="lg:col-span-5 space-y-12 md:space-y-16">
            <div className="space-y-6 md:space-y-8">
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-black italic">
                GET IN<br />
                <span className="text-black/10 non-italic">TOUCH</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-sm">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn tìm thấy phong cách riêng. Đừng ngần ngại liên hệ nhé.
              </p>
            </div>

            <div className="grid gap-4 md:gap-6">
              {contactInfos.map((info, i) => (
                <div key={i} className="group p-6 md:p-8 bg-white border border-black/5 rounded-[24px] md:rounded-[32px] shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1">
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-black text-white flex items-center justify-center shrink-0 shadow-xl group-hover:scale-110 transition-transform">
                      {info.icon}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-widest text-black/30">{info.label}</p>
                      <p className="text-lg md:text-xl font-black tracking-tight truncate">{info.value}</p>
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
                  <button key={i} className="h-10 w-10 md:h-12 md:w-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-500">
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Premium Form */}
          <div className="lg:col-span-7 space-y-8 mt-8 lg:mt-0">
            <div className="glass p-6 sm:p-8 md:p-16 rounded-[32px] md:rounded-[48px] border border-white shadow-2xl relative overflow-hidden bg-white/50 backdrop-blur-xl">
              <div className="absolute top-0 right-0 h-40 w-40 bg-black/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>

              <div className="mb-8 md:mb-12 space-y-3 md:space-y-4 relative z-10">
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">Gửi lời nhắn</h2>
                <p className="text-sm md:text-base text-muted-foreground font-medium">Vui lòng điền đầy đủ thông tin bên dưới, chúng tôi sẽ phản hồi sớm nhất có thể.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2 md:space-y-3">
                    <Label htmlFor="name" className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40 ml-4">Họ và tên</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nguyễn Văn A" className="h-14 md:h-16 rounded-[24px] md:rounded-3xl border-2 border-black/5 focus:border-black transition-all bg-white/50 backdrop-blur-sm px-6 font-bold text-sm md:text-base" required />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <Label htmlFor="email" className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40 ml-4">Email của bạn</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="example@hnam.vn" className="h-14 md:h-16 rounded-[24px] md:rounded-3xl border-2 border-black/5 focus:border-black transition-all bg-white/50 backdrop-blur-sm px-6 font-bold text-sm md:text-base" required />
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <Label htmlFor="subject" className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40 ml-4">Chủ đề quan tâm</Label>
                  <Input id="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="Hợp tác, hỗ trợ đơn hàng..." className="h-14 md:h-16 rounded-[24px] md:rounded-3xl border-2 border-black/5 focus:border-black transition-all bg-white/50 backdrop-blur-sm px-6 font-bold text-sm md:text-base" />
                </div>

                <div className="space-y-2 md:space-y-3">
                  <Label htmlFor="message" className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40 ml-4">Nội dung tin nhắn</Label>
                  <Textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Chúng tôi có thể giúp gì cho bạn?" className="min-h-[150px] md:min-h-[200px] rounded-[24px] md:rounded-[32px] border-2 border-black/5 focus:border-black transition-all bg-white/50 backdrop-blur-sm p-6 md:p-8 font-bold resize-none text-sm md:text-base" required />
                </div>

                <Button type="submit" disabled={loading} className="w-full h-16 md:h-20 py-4 md:py-8 text-base md:text-lg font-black rounded-full bg-black text-white hover:bg-black/90 shadow-2xl shadow-black/20 transition-all duration-500 group">
                  {loading ? "ĐANG GỬI..." : "GỬI ĐI NGAY"} {!loading && <Send className="ml-3 h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
                </Button>
              </form>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-black text-white rounded-[40px] space-y-6 animate-fade-in-up delay-300">
                <Clock className="h-8 w-8 text-white/40" />
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-2">Giờ làm việc</h3>
                  <p className="text-white/60 font-medium leading-relaxed text-sm">
                    Thứ 2 - Thứ 7: 08:00 - 22:00<br />
                    Chủ nhật: 09:00 - 21:00
                  </p>
                </div>
              </div>

              <div className="p-8 border border-black/5 rounded-[40px] flex flex-col justify-center gap-6 bg-white animate-fade-in-up delay-400">
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
    </div>
  );
}
