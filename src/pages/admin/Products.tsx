import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface ProductForm {
  product_name: string;
  price: string;
  description: string;
  image_url: string;
  category_id: string;
  is_featured: boolean;
}

const emptyForm: ProductForm = { product_name: "", price: "", description: "", image_url: "", category_id: "", is_featured: false };

export default function AdminProducts() {
  const [products, setProducts] = useState<Tables<"products">[]>([]);
  const [categories, setCategories] = useState<Tables<"categories">[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tables<"products"> | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const load = () => {
    supabase.from("products").select("*").order("created_at", { ascending: false }).then(({ data }) => setProducts(data ?? []));
  };

  useEffect(() => {
    load();
    supabase.from("categories").select("*").order("category_name").then(({ data }) => setCategories(data ?? []));
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const handleOpen = (product?: Tables<"products">) => {
    if (product) {
      setEditing(product);
      setForm({
        product_name: product.product_name,
        price: String(product.price),
        description: product.description ?? "",
        image_url: product.image_url ?? "",
        category_id: product.category_id ?? "",
        is_featured: product.is_featured,
      });
    } else {
      setEditing(null);
      setForm(emptyForm);
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.product_name.trim()) { toast.error("Tên sản phẩm không được trống"); return; }
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) { toast.error("Giá phải là số dương"); return; }

    const payload = {
      product_name: form.product_name.trim(),
      price,
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      category_id: form.category_id || null,
      is_featured: form.is_featured,
    };

    if (editing) {
      await supabase.from("products").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("products").insert(payload);
    }
    setOpen(false); load();
    toast.success(editing ? "Đã cập nhật" : "Đã thêm sản phẩm");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa sản phẩm này?")) return;
    await supabase.from("products").delete().eq("id", id);
    load();
    toast.success("Đã xóa");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Sản phẩm</h1>
        <Button onClick={() => handleOpen()} className="active:scale-95">
          <Plus className="mr-1.5 h-4 w-4" /> Thêm
        </Button>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ảnh</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Nổi bật</TableHead>
              <TableHead className="w-24 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="w-10 h-10 rounded bg-muted overflow-hidden">
                    {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-cover" /> : null}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{p.product_name}</TableCell>
                <TableCell className="tabular-nums">{formatPrice(p.price)}</TableCell>
                <TableCell>{p.is_featured ? "✓" : ""}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpen(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Chưa có sản phẩm</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Sửa sản phẩm" : "Thêm sản phẩm"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tên sản phẩm *</Label>
              <Input value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Giá (VNĐ) *</Label>
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" rows={3} />
            </div>
            <div>
              <Label>URL ảnh</Label>
              <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="mt-1" placeholder="https://..." />
            </div>
            <div>
              <Label>Danh mục</Label>
              <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.category_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} />
              <Label>Sản phẩm nổi bật</Label>
            </div>
            <Button onClick={handleSave} className="w-full active:scale-[0.97]">Lưu</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
