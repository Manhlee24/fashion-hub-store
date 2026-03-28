import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect } from "react";

export default function StorefrontLayout() {
  const location = useLocation();

  useEffect(() => {
    // Disable browser's native scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Attempt 1: Immediate reset
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);

    // Attempt 2: After a frame (ensures DOM is ready)
    const raf = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });

    // Attempt 3: After a small delay (for async data/render)
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [location.pathname, location.search]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main key={location.pathname} className="flex-1 page-fade-in">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
