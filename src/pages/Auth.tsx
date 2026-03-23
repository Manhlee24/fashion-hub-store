import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (!isLogin && !name.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return;
    }
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    const { error } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password, name);

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (!isLogin) {
      toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.");
    } else {
      toast.success("Đăng nhập thành công!");
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-sm">
      <h1 className="text-2xl font-bold text-center mb-8">
        {isLogin ? "Đăng nhập" : "Đăng ký"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <Label htmlFor="name">Họ tên</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
          </div>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="password">Mật khẩu</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
        </div>
        <Button type="submit" className="w-full active:scale-[0.97]" disabled={loading}>
          {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-foreground font-medium underline underline-offset-4 hover:no-underline"
        >
          {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
        </button>
      </p>
    </div>
  );
}
