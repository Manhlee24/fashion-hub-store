import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type AuthMode = 'login' | 'register' | 'forgot_password' | 'reset_password';

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'forgot_password') {
      if (!email.trim()) return toast.error("Vui lòng nhập email");
      setLoading(true);
      try {
        const res: any = await authService.forgotPassword(email);
        toast.success(res.message || "Mã xác nhận đã được gửi");
        setMode('reset_password');
      } catch (error: any) {
        toast.error(error.message || "Không thể gửi mã xác nhận");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === 'reset_password') {
      if (!email.trim() || !resetCode.trim() || !password.trim()) {
        return toast.error("Vui lòng điền đầy đủ thông tin");
      }
      if (password.length < 6) return toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      setLoading(true);
      try {
        const res: any = await authService.resetPassword(email, resetCode, password);
        toast.success(res.message || "Đổi mật khẩu thành công");
        setMode('login');
        setPassword("");
        setResetCode("");
      } catch (error: any) {
        toast.error(error.message || "Không thể đổi mật khẩu");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Existing login & register logic
    if (!email.trim() || !password.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (mode === 'register' && !name.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return;
    }
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    const { error } = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password, name);

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (mode === 'register') {
      toast.success("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
      setMode('login');
      setPassword("");
    } else {
      toast.success("Đăng nhập thành công!");
      navigate("/");
    }
    setLoading(false);
  };

  const getTitle = () => {
    switch(mode) {
      case 'login': return "Đăng nhập";
      case 'register': return "Đăng ký";
      case 'forgot_password': return "Quên mật khẩu";
      case 'reset_password': return "Tạo mật khẩu mới";
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-sm">
      <h1 className="text-2xl font-black text-center mb-8 uppercase tracking-tight">
        {getTitle()}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <Label htmlFor="name">Họ tên</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
          </div>
        )}
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={mode === 'reset_password'} className="mt-1.5" />
        </div>

        {mode === 'reset_password' && (
          <div>
            <Label htmlFor="code">Mã xác nhận (6 số)</Label>
            <Input id="code" type="text" value={resetCode} onChange={(e) => setResetCode(e.target.value)} className="mt-1.5" placeholder="Ví dụ: 123456" />
          </div>
        )}

        {(mode === 'login' || mode === 'register' || mode === 'reset_password') && (
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <Label htmlFor="password">{mode === 'reset_password' ? 'Mật khẩu mới' : 'Mật khẩu'}</Label>
              {mode === 'login' && (
                <button 
                  type="button" 
                  onClick={() => setMode('forgot_password')} 
                  className="text-xs text-muted-foreground hover:text-black font-medium transition-colors"
                >
                  Quên mật khẩu?
                </button>
              )}
            </div>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        )}

        <Button type="submit" className="w-full h-12 font-black uppercase tracking-widest text-[10px] active:scale-[0.97]" disabled={loading}>
          {loading ? "Đang xử lý..." : getTitle()}
        </Button>
      </form>

      <p className="text-center text-[11px] font-medium text-muted-foreground mt-8">
        {(mode === 'login' || mode === 'forgot_password' || mode === 'reset_password') ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'register' ? 'login' : 'register');
            setPassword("");
            setResetCode("");
          }}
          className="text-black font-black uppercase tracking-widest hover:underline underline-offset-4"
        >
          {(mode === 'login' || mode === 'forgot_password' || mode === 'reset_password') ? "Đăng ký ngay" : "Đăng nhập"}
        </button>
      </p>

      {(mode === 'forgot_password' || mode === 'reset_password') && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setMode('login')}
            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-black"
          >
            ← Quay lại đăng nhập
          </button>
        </div>
      )}
    </div>
  );
}
