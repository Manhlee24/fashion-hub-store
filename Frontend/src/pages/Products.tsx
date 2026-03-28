import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { Product, Category } from "@/lib/types";
import ProductCard from "@/components/features/products/ProductCard";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ChevronRight, X, ArrowUpDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const sortOptions = [
  { label: "Mới nhất", value: "newest" },
  { label: "Giá: Thấp đến Cao", value: "price_asc" },
  { label: "Giá: Cao đến Thấp", value: "price_desc" },
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get("category");
  const activeSort = searchParams.get("sort") || "newest";
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");

  const [minPriceInput, setMinPriceInput] = useState(minPrice || "");
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice || "");

  useEffect(() => {
    categoryService.getCategories().then((data) => setCategories(data ?? []));
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setLoading(true);
    productService.getProducts({
      category_id: activeCategory ? Number(activeCategory) : undefined,
      sort: activeSort,
      min_price: minPrice ? Number(minPrice) : undefined,
      max_price: maxPrice ? Number(maxPrice) : undefined
    }).then((data) => {
      setProducts(data ?? []);
      setLoading(false);
    });
  }, [activeCategory, activeSort, minPrice, maxPrice]);

  const activeCategoryName = activeCategory
    ? categories.find(c => String(c.id) === activeCategory)?.name
    : null;

  const handleSort = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", value);
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Editorial Header */}
      <div className="bg-white pt-24 md:pt-32 pb-8 border-b border-black/5">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-12">
            <Link to="/" className="hover:text-black transition-colors">HNAMSTORE</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-black">Sản phẩm</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-black">
                {activeCategoryName || "THỜI TRANG"}
              </h1>
              <p className="text-muted-foreground text-sm font-medium tracking-wide max-w-md">
                Dòng sản phẩm được thiết kế tối giản, tập trung vào chất liệu và phom dáng bền vững theo thời gian.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-px w-20 bg-black/10 hidden md:block"></div>
              <span className="text-[11px] font-black uppercase tracking-widest text-black">
                {products.length} Mẫu thiết kế
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Filter Bar */}
      <div className={`sticky ${isScrolled ? "top-16" : "top-20"} z-40 bg-white/80 backdrop-blur-xl border-b border-black/5 transition-all duration-500`}>
        <div className="container mx-auto px-4 flex items-center justify-between h-14 md:h-20 gap-8">
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar scroll-smooth flex-1">
            <button
              onClick={() => {
                const p = new URLSearchParams(searchParams);
                p.delete("category");
                setSearchParams(p);
              }}
              className={`whitespace-nowrap px-6 h-10 md:h-12 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${!activeCategory ? "bg-black text-white shadow-xl shadow-black/20" : "bg-transparent text-muted-foreground hover:text-black"}`}
            >
              Tất cả
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  const p = new URLSearchParams(searchParams);
                  p.set("category", String(c.id));
                  setSearchParams(p);
                }}
                className={`whitespace-nowrap px-6 h-10 md:h-12 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeCategory === String(c.id) ? "bg-black text-white shadow-xl shadow-black/20" : "bg-transparent text-muted-foreground hover:text-black"}`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-auto">
            {/* Advanced Filters Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="lg" className="h-10 md:h-12 rounded-full border border-black/5 gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-500">
                  <SlidersHorizontal className="h-3.5 w-3.5" /> Bộ lọc
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md p-0 border-l border-black/5 bg-white">
                <div className="flex flex-col h-full">
                  <SheetHeader className="p-8 border-b border-black/5">
                    <SheetTitle className="text-3xl font-black uppercase tracking-tighter">Bộ lọc nâng cao</SheetTitle>
                    <SheetDescription className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tùy chỉnh tìm kiếm của bạn</SheetDescription>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto p-8 space-y-12">
                    {/* Price Range Filter */}
                    <div className="space-y-6">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.3em]">Khoảng giá (VNĐ)</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="min-price" className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Giá từ</Label>
                          <Input
                            id="min-price"
                            type="number"
                            placeholder="0"
                            value={minPriceInput}
                            onChange={(e) => setMinPriceInput(e.target.value)}
                            className="h-14 rounded-2xl border-2 focus:border-black font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="max-price" className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Đến</Label>
                          <Input
                            id="max-price"
                            type="number"
                            placeholder="Vô hạn"
                            value={maxPriceInput}
                            onChange={(e) => setMaxPriceInput(e.target.value)}
                            className="h-14 rounded-2xl border-2 focus:border-black font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick Filters */}
                    <div className="space-y-6">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.3em]">Bộ lọc nhanh</h3>
                      <div className="flex flex-wrap gap-2">
                        {[500000, 1000000, 2000000].map((price) => (
                          <Button
                            key={price}
                            variant="outline"
                            className="rounded-full h-10 px-6 text-[10px] font-black uppercase tracking-widest border-2"
                            onClick={() => {
                              setMinPriceInput("0");
                              setMaxPriceInput(price.toString());
                            }}
                          >
                            Dưới {price.toLocaleString()}đ
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <SheetFooter className="p-8 border-t border-black/5 bg-muted/30 grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-14 rounded-full font-black uppercase tracking-widest text-xs border-2"
                      onClick={() => {
                        setMinPriceInput("");
                        setMaxPriceInput("");
                        const p = new URLSearchParams(searchParams);
                        p.delete("min_price");
                        p.delete("max_price");
                        setSearchParams(p);
                      }}
                    >
                      Xóa tất cả
                    </Button>
                    <SheetClose asChild>
                      <Button
                        className="h-14 rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-black/20"
                        onClick={() => {
                          const p = new URLSearchParams(searchParams);
                          if (minPriceInput) p.set("min_price", minPriceInput); else p.delete("min_price");
                          if (maxPriceInput) p.set("max_price", maxPriceInput); else p.delete("max_price");
                          setSearchParams(p);
                        }}
                      >
                        Áp dụng
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </div>
              </SheetContent>
            </Sheet>

            {/* Sorting Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="lg" className="h-10 md:h-12 rounded-full border border-black/5 gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-500">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sắp xếp: {sortOptions.find(o => o.value === activeSort)?.label}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] rounded-2xl p-2 bg-white/95 backdrop-blur-xl border-black/5 shadow-2xl">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleSort(option.value)}
                    className="flex items-center justify-between rounded-xl py-3 px-4 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-black hover:text-white transition-colors"
                  >
                    {option.label}
                    {activeSort === option.value && <Check className="h-3 w-3" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16 md:py-24">
        {/* Active Filter Pills */}
        {(activeCategory || (activeSort !== "newest") || minPrice || maxPrice) && (
          <div className="flex flex-wrap items-center gap-4 mb-16 animate-fade-in">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Đang áp dụng:</span>

            {activeCategory && (
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-black/5">
                <span className="text-[10px] font-black uppercase tracking-widest">Danh mục: {activeCategoryName}</span>
                <button onClick={() => {
                  const p = new URLSearchParams(searchParams);
                  p.delete("category");
                  setSearchParams(p);
                }} className="hover:text-emerald-500 transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {activeSort !== "newest" && (
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-black/5">
                <span className="text-[10px] font-black uppercase tracking-widest">Sắp xếp: {sortOptions.find(o => o.value === activeSort)?.label}</span>
                <button onClick={() => {
                  const p = new URLSearchParams(searchParams);
                  p.delete("sort");
                  setSearchParams(p);
                }} className="hover:text-emerald-500 transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {(minPrice || maxPrice) && (
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-black/5">
                <span className="text-[10px] font-black uppercase tracking-widest">Giá: {minPrice || 0} - {maxPrice || '∞'}</span>
                <button onClick={() => {
                  const p = new URLSearchParams(searchParams);
                  p.delete("min_price");
                  p.delete("max_price");
                  setSearchParams(p);
                }} className="hover:text-emerald-500 transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            <button
              onClick={clearFilters}
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground underline underline-offset-4 hover:text-black transition-all ml-2"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 md:gap-y-24">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-6 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="aspect-[3/4] bg-muted/50 rounded-[40px]" />
                <div className="space-y-3">
                  <div className="h-4 bg-muted/50 rounded-full w-2/3 mx-auto" />
                  <div className="h-4 bg-muted/50 rounded-full w-1/3 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-32 text-center space-y-8 animate-fade-in">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted/30">
              <SlidersHorizontal className="h-8 w-8 text-black/20" />
            </div>
            <div className="space-y-4">
              <p className="text-2xl font-black uppercase tracking-tight italic">Chưa tìm thấy thiết kế phù hợp</p>
              <p className="text-muted-foreground font-medium">Chúng tôi đang cập nhật thêm sản phẩm mới cho tiêu chí này.</p>
            </div>
            <Button onClick={clearFilters} variant="outline" className="h-14 px-10 rounded-full font-black uppercase tracking-widest text-xs border-2 hover:bg-black hover:text-white transition-all duration-500">
              Quay lại xem tất cả
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 md:gap-x-12 gap-y-16 md:gap-y-24">
            {products.map((p, i) => (
              <div
                key={p.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i % 4 * 150}ms`, animationDuration: '800ms' }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

        {/* Brand Bottom Marquee */}
        {!loading && products.length > 0 && (
          <div className="text-[10px] mt-10 pt-10 border-t border-black/5 flex justify-center font-black uppercase tracking-[1em] text-black/10 text-center">
            HNAMSTORE &copy; 2026 &bull; AUTHENTIC MINIMALISM
          </div>
        )}
      </main>
    </div>
  );
}
