import { useEffect, useState } from "react";
import { categoryService } from "@/services/categoryService";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");

  const load = () => {
    categoryService.getCategories().then((data) => setCategories(data ?? []));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Tên danh mục không được trống"); return; }
    try {
      if (editing) {
        await categoryService.updateCategory(editing.id, name.trim());
      } else {
        await categoryService.createCategory(name.trim());
      }
      setOpen(false); setEditing(null); setName(""); load();
      toast.success(editing ? "Đã cập nhật" : "Đã thêm danh mục");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi lưu");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa danh mục này?")) return;
    try {
      await categoryService.deleteCategory(id);
      load();
      toast.success("Đã xóa");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi xóa");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Danh mục</h1>
        <Button onClick={() => { setEditing(null); setName(""); setOpen(true); }} className="active:scale-95">
          <Plus className="mr-1.5 h-4 w-4" /> Thêm
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên danh mục</TableHead>
              <TableHead className="w-24 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(c); setName(c.name); setOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-8">Chưa có danh mục</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Sửa danh mục" : "Thêm danh mục"}</DialogTitle>
          </DialogHeader>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên danh mục" />
          <Button onClick={handleSave} className="w-full active:scale-[0.97]">Lưu</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
