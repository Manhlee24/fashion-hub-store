import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tighter uppercase">404</h1>
        <p className="mb-6 text-lg text-muted-foreground uppercase tracking-widest font-medium">Không tìm thấy trang</p>
        <Link to="/" className="inline-flex h-12 items-center px-8 rounded-full bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-emerald-500 transition-colors active:scale-95 shadow-xl">
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
