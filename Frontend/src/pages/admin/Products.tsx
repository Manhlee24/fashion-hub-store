import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { Product, Category, ProductVariant } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, ExternalLink, MoreVertical, Package, X } from "lucide-react";

interface ProductForm {
  name: string;
  price: string;
  description: string;
  image_url: string;
  category_id: string;
  is_featured: boolean;
  status: 'active' | 'hidden';
  variants: { size: string; stock: string }[];
}

const emptyForm: ProductForm = { 
  name: "", 
  price: "", 
  description: "", 
  image_url: "", 
  category_id: "", 
  is_featured: false,
  status: 'active',
  variants: []
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");

  const load = () => {
    productService.getProducts({ include_hidden: true }).then((data) => setProducts(data ?? []));
  };

  useEffect(() => {
    load();
    categoryService.getCategories().then((data) => setCategories(data ?? []));
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpen = (product?: Product) => {
    if (product) {
      setEditing(product);
      setForm({
        name: product.name,
        price: String(product.price),
        description: product.description ?? "",
        image_url: product.image_url ?? "",
        category_id: product.category_id ? String(product.category_id) : "",
        is_featured: !!product.is_featured,
        status: product.status || 'active',
        variants: product.variants?.map(v => ({ size: v.size, stock: String(v.stock) })) || []
      });
    } else {
      setEditing(null);
      setForm(emptyForm);
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Tên sản phẩm không được trống"); return; }
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) { toast.error("Giá phải là số dương"); return; }

    const selectedCategory = categories.find((c) => String(c.id) === form.category_id);
    const catName = (selectedCategory?.name || "").toLowerCase();
    const prodName = form.name.toLowerCase();
    
    const isAccessory = catName.includes("phụ kiện") || catName.includes("trang sức") ||
      prodName.includes("ví") || prodName.includes("thắt lưng") || prodName.includes("kính") || prodName.includes("nước hoa");

    let submitVariants = [];
    if (isAccessory) {
      const stock = form.variants.length > 0 ? parseInt(form.variants[0].stock) || 0 : 0;
      submitVariants = [{ size: "Freesize", stock }];
    } else {
      submitVariants = form.variants.filter(v => v.size.trim() !== "").map(v => ({
        size: v.size.trim(),
        stock: parseInt(v.stock) || 0
      }));
    }

    if (submitVariants.length === 0) {
      toast.error("Vui lòng loại sản phẩm này (hoặc khai báo kích cỡ) và số lượng tồn kho");
      return;
    }

    const payload = {
      name: form.name.trim(),
      price,
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      category_id: form.category_id ? Number(form.category_id) : null,
      is_featured: form.is_featured,
      status: form.status,
      variants: submitVariants
    };

    try {
      if (editing) {
        await productService.updateProduct(editing.id, payload);
      } else {
        await productService.createProduct(payload);
      }
      setOpen(false); load();
      toast.success(editing ? "Cập nhật thành công" : "Đã thêm sản phẩm mới");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi lưu sản phẩm");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa sản phẩm này?")) return;
    try {
      await productService.deleteProduct(id);
      load();
      toast.success("Đã xóa");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi xóa");
    }
  };

  const addVariant = () => {
    setForm({ ...form, variants: [...form.variants, { size: "", stock: "0" }] });
  };

  const removeVariant = (index: number) => {
    setForm({ ...form, variants: form.variants.filter((_, i) => i !== index) });
  };

  const updateVariant = (index: number, key: 'size' | 'stock', value: string) => {
    const newVariants = [...form.variants];
    newVariants[index] = { ...newVariants[index], [key]: value };
    setForm({ ...form, variants: newVariants });
  };

  const getTotalStock = (p: Product) => {
    return p.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
  };

  const selectedCat = categories.find((c) => String(c.id) === form.category_id);
  const currentCatName = (selectedCat?.name || "").toLowerCase();
  const currentProdName = form.name.toLowerCase();

  const isShoe = currentCatName.includes("giày") || currentCatName.includes("dép") || currentCatName.includes("ủng") ||
    currentProdName.includes("giày") || currentProdName.includes("dép") || currentProdName.includes("ủng") || currentProdName.includes("boot");

  const isAccessory = currentCatName.includes("phụ kiện") || currentCatName.includes("trang sức") ||
    currentProdName.includes("ví") || currentProdName.includes("thắt lưng") || currentProdName.includes("kính") || currentProdName.includes("nước hoa");
  
  const hasSize = !isAccessory;
  const allowedSizes = isShoe ? ["38", "39", "40", "41", "42", "43", "44"] : ["S", "M", "L", "XL", "XXL"];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Sản phẩm</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">Quản lý kho hàng theo từng size chi tiết.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/20 group-focus-within:text-black transition-colors" />
            <Input 
              placeholder="TÌM KIẾM SẢN PHẨM..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 w-full md:w-80 rounded-full pl-12 bg-white border-black/5 text-[10px] font-black uppercase tracking-widest focus:ring-black/5"
            />
          </div>
          <Button onClick={() => handleOpen()} className="shrink-0 h-14 px-8 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl shadow-black/20 group">
            <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" /> Thêm mới
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-black/5 overflow-hidden shadow-2xl shadow-black/[0.02]">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-black/5 bg-[#FBFBFB] hover:bg-transparent">
                <TableHead className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-black/40">Sản phẩm</TableHead>
                <TableHead className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-black/40">Danh mục</TableHead>
                <TableHead className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-black/40 text-center">Tồn kho</TableHead>
                <TableHead className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-black/40 text-center">Nổi bật</TableHead>
                <TableHead className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-black/40">Trạng thái</TableHead>
                <TableHead className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-black/40 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((p) => (
                <TableRow key={p.id} className="group hover:bg-[#FAFAFA] transition-colors border-b border-black/5 last:border-0 cursor-default">
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-6 min-w-[250px]">
                      <div className="h-16 w-16 rounded-[20px] bg-muted overflow-hidden ring-1 ring-black/5 shrink-0 group-hover:scale-105 transition-transform duration-500">
                        {p.image_url ? (
                          <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-black/10">
                            <Package className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-[12px] font-black uppercase tracking-tight text-black">{p.name}</p>
                        <p className="text-[10px] font-black tabular-nums text-black/40">{formatPrice(p.price)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/60">
                      {categories.find(c => c.id === p.category_id)?.name || "Chưa phân loại"}
                    </span>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-center">
                    <div className="space-y-1">
                      <span className={`text-[11px] font-black tabular-nums ${getTotalStock(p) === 0 ? 'text-rose-500' : 'text-black'}`}>
                        {getTotalStock(p)}
                      </span>
                      <p className="text-[8px] font-black uppercase tracking-widest text-black/20">
                        {p.variants?.length || 0} Size
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-center">
                    {p.is_featured ? (
                      <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                        <Plus className="h-3 w-3 rotate-45 scale-75" />
                      </div>
                    ) : (
                      <span className="text-black/10 italic text-[10px] font-black">--</span>
                    )}
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      p.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {p.status === 'active' ? 'Hoạt động' : 'Đã ẩn'}
                    </span>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                       <Button variant="ghost" size="icon" onClick={() => handleOpen(p)} className="h-10 w-10 rounded-full hover:bg-black hover:text-white transition-all">
                          <Pencil className="h-3.5 w-3.5" />
                       </Button>
                       <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="h-10 w-10 rounded-full hover:bg-rose-500 hover:text-white transition-all">
                          <Trash2 className="h-3.5 w-3.5 text-rose-500 group-hover:text-white" />
                       </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-40 space-y-4">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted/30">
                       <Package className="h-10 w-10 text-black/10" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20">Không tìm thấy sản phẩm nào</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden flex flex-col divide-y divide-black/5">
          {filteredProducts.map((p) => (
            <div key={p.id} className="p-6 space-y-6 bg-white hover:bg-[#FAFAFA] transition-colors">
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 rounded-[20px] bg-muted overflow-hidden ring-1 ring-black/5 shrink-0">
                  {p.image_url ? (
                    <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-black/10">
                      <Package className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2 pt-1">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-black uppercase tracking-tight text-black line-clamp-2 leading-snug">{p.name}</p>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => handleOpen(p)} className="h-8 w-8 rounded-full bg-black/5 hover:bg-black hover:text-white transition-all">
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="h-8 w-8 rounded-full bg-rose-50 hover:bg-rose-500 hover:text-white transition-all">
                        <Trash2 className="h-3 w-3 text-rose-500 group-hover:text-white" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs font-black tabular-nums text-black/60">{formatPrice(p.price)}</p>
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      p.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {p.status === 'active' ? 'Hoạt động' : 'Đã ẩn'}
                    </span>
                    {p.is_featured && (
                      <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-black text-white">
                        Nổi bật
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FBFBFB] border border-black/5">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-black/30">Danh mục</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-black line-clamp-1">
                    {categories.find(c => c.id === p.category_id)?.name || "Chưa phân loại"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-black/30">Tồn kho / Size</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-[12px] font-black tabular-nums ${getTotalStock(p) === 0 ? 'text-rose-500' : 'text-black'}`}>
                      {getTotalStock(p)}
                    </span>
                    <span className="text-[9px] font-bold text-black/40">/ {p.variants?.length || 0} Size</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="p-12 text-center space-y-4">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted/30">
                <Package className="h-10 w-10 text-black/10" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20">Không tìm thấy sản phẩm nào</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl rounded-[40px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-10 bg-black text-white space-y-2">
            <DialogTitle className="text-3xl font-black uppercase tracking-tighter">
              {editing ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
            </DialogTitle>
            <DialogDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">
              Quản lý thông tin chi tiết và kho hàng theo từng size.
            </DialogDescription>
          </div>
          
          <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto bg-white">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-black/40">Tên sản phẩm *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-12 rounded-2xl border-black/5 bg-muted/30 font-bold focus:ring-black/5" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-black/40">Giá bán (VNĐ) *</Label>
                <Input type="number" min="0" pattern="[0-9]*" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value.replace(/\D/g, '') })} className="h-12 rounded-2xl border-black/5 bg-muted/30 font-bold focus:ring-black/5" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-black/40">Mô tả sản phẩm</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-2xl border-black/5 bg-muted/30 font-medium min-h-[120px] focus:ring-black/5" />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-black/40">Đường dẫn ảnh sản phẩm</Label>
              <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="h-12 rounded-2xl border-black/5 bg-muted/30 font-medium focus:ring-black/5" placeholder="https://unsplash.com/..." />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-black/40">Danh mục hình thức</Label>
                <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                  <SelectTrigger className="h-12 rounded-2xl border-black/5 bg-muted/30 font-black uppercase tracking-widest text-[10px]">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-black/5">
                    {categories.map((c) => <SelectItem key={c.id} value={String(c.id)} className="text-[10px] font-black uppercase tracking-widest">{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-black/40">Trạng thái hiển thị</Label>
                <Select value={form.status} onValueChange={(v: 'active' | 'hidden') => setForm({ ...form, status: v })}>
                  <SelectTrigger className="h-12 rounded-2xl border-black/5 bg-muted/30 font-black uppercase tracking-widest text-[10px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-black/5">
                    <SelectItem value="active" className="text-[10px] font-black uppercase tracking-widest">Hoạt động (Hiển thị)</SelectItem>
                    <SelectItem value="hidden" className="text-[10px] font-black uppercase tracking-widest">Đã ẩn (Kho lưu trữ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-black uppercase tracking-widest text-black/40">
                  {isAccessory ? "Quản lý kho hàng *" : "Quản lý kho theo Size *"}
                </Label>
                {hasSize && (
                  <Button variant="outline" size="sm" onClick={addVariant} className="h-8 rounded-full text-[9px] font-black uppercase tracking-widest border-black/10 hover:bg-black hover:text-white transition-all">
                    <Plus className="mr-1 h-3 w-3" /> Thêm Size
                  </Button>
                )}
              </div>
              
              <div className="space-y-3">
                {isAccessory ? (
                  <div className="flex items-center gap-4 animate-fade-in-up">
                    <div className="flex-1">
                      <Input 
                        disabled
                        value="Freesize (Phụ kiện)" 
                        className="h-10 rounded-xl border-black/5 bg-muted/50 font-black uppercase tracking-widest text-[10px] text-black/40"
                      />
                    </div>
                    <div className="w-32">
                      <Input 
                        type="number" 
                        min="0" 
                        pattern="[0-9]*"
                        placeholder="Kho" 
                        value={form.variants[0]?.stock || "0"} 
                        onChange={(e) => {
                          const cleanValue = e.target.value.replace(/\D/g, '');
                          const newVariants = [...form.variants];
                          if (newVariants.length === 0) newVariants.push({ size: 'Freesize', stock: cleanValue });
                          else newVariants[0].stock = cleanValue;
                          setForm({ ...form, variants: newVariants });
                        }}
                        className="h-10 rounded-xl border-black/5 bg-muted/30 font-black tabular-nums text-[10px]"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {form.variants.map((v, i) => (
                      <div key={i} className="flex items-center gap-4 animate-fade-in-up">
                        <div className="flex-1">
                          <Select value={v.size} onValueChange={(val) => updateVariant(i, 'size', val)}>
                            <SelectTrigger className="h-10 rounded-xl border-black/5 bg-muted/30 font-black uppercase tracking-widest text-[10px]">
                              <SelectValue placeholder="Chọn Size" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-black/5">
                              {allowedSizes.map(size => (
                                <SelectItem key={size} value={size} className="text-[10px] font-black uppercase tracking-widest">{size}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-32">
                          <Input 
                            type="number" 
                            min="0" 
                            pattern="[0-9]*"
                            placeholder="Kho" 
                            value={v.stock} 
                            onChange={(e) => updateVariant(i, 'stock', e.target.value.replace(/\D/g, ''))}
                            className="h-10 rounded-xl border-black/5 bg-muted/30 font-black tabular-nums text-[10px]"
                          />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeVariant(i)} className="h-10 w-10 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-600 shrink-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {form.variants.length === 0 && (
                      <div className="p-8 border-2 border-dashed border-black/5 rounded-2xl text-center">
                        <p className="text-[9px] font-black uppercase tracking-widest text-black/20 italic">Chưa có thông tin kho hàng theo size.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-muted/30 rounded-[28px] border border-black/5">
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-tight text-black">Gắn thẻ nổi bật</p>
                <p className="text-[9px] font-medium text-black/30 italic">Hiển thị sản phẩm này tại trang chủ.</p>
              </div>
              <Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} className="data-[state=checked]:bg-black" />
            </div>
          </div>

          <DialogFooter className="p-8 border-t border-black/5 bg-[#FBFBFB] flex sm:justify-between items-center gap-4">
             <Button variant="ghost" onClick={() => setOpen(false)} className="h-14 px-8 rounded-full font-black uppercase tracking-widest text-[10px] text-black/40 hover:text-black">
                Hủy bỏ
             </Button>
             <Button onClick={handleSave} className="h-14 px-12 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl shadow-black/10">
                Lưu thay đổi
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
