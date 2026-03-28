import { useEffect, useState } from "react";
import { categoryService } from "@/services/categoryService";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, FolderOpen, Search, ChevronRight } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const load = () => {
    categoryService.getCategories().then((data) => setCategories(data ?? []));
  };

  useEffect(() => { load(); }, []);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Tên danh mục không được trống"); return; }
    try {
      if (editing) {
        await categoryService.updateCategory(editing.id, name.trim());
      } else {
        await categoryService.createCategory(name.trim());
      }
      setOpen(false); setEditing(null); setName(""); load();
      toast.success(editing ? "Cập nhật thành công" : "Đã thêm danh mục mới");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi lưu");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa danh mục này? Điều này có thể ảnh hưởng đến các sản phẩm thuộc danh mục.")) return;
    try {
      await categoryService.deleteCategory(id);
      load();
      toast.success("Đã xóa");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi xóa");
    }
  };

  const handleOpen = (category?: Category) => {
    if (category) {
      setEditing(category);
      setName(category.name);
    } else {
      setEditing(null);
      setName("");
    }
    setOpen(true);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Danh mục</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">Phân loại sản phẩm để tối ưu tìm kiếm.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/20 group-focus-within:text-black transition-colors" />
            <input 
              placeholder="TÌM DANH MỤC..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 w-full md:w-64 rounded-full pl-12 pr-6 bg-white border border-black/5 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-black/10"
            />
          </div>
          <Button onClick={() => handleOpen()} className="h-14 px-8 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl shadow-black/20 group">
            <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" /> Thêm mới
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-black/5 overflow-hidden shadow-2xl shadow-black/[0.02] max-w-4xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-black/5 bg-[#FBFBFB] hover:bg-transparent">
                <TableHead className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-black/40">Tên danh mục</TableHead>
                <TableHead className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-black/40 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((c) => (
                <TableRow key={c.id} className="group hover:bg-[#FAFAFA] transition-colors border-b border-black/5 last:border-0 cursor-default">
                  <TableCell className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-black/5 flex items-center justify-center text-black/20 group-hover:bg-black group-hover:text-white transition-all duration-500">
                        <FolderOpen className="h-4 w-4" />
                      </div>
                      <span className="text-[12px] font-black uppercase tracking-tight text-black">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <Button variant="ghost" size="icon" onClick={() => handleOpen(c)} className="h-10 w-10 rounded-full hover:bg-black hover:text-white transition-all">
                          <Pencil className="h-3.5 w-3.5" />
                       </Button>
                       <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} className="h-10 w-10 rounded-full hover:bg-rose-500 hover:text-white transition-all">
                          <Trash2 className="h-3.5 w-3.5 text-rose-500 group-hover:text-white" />
                       </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-32 space-y-4">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted/30">
                       <FolderOpen className="h-10 w-10 text-black/10" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20">Không tìm thấy danh mục nào</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-[40px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-10 bg-black text-white space-y-2">
            <DialogTitle className="text-3xl font-black uppercase tracking-tighter">
              {editing ? "Sửa danh mục" : "Danh mục mới"}
            </DialogTitle>
            <DialogDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">
              Quản lý phân loại sản phẩm của bạn.
            </DialogDescription>
          </div>
          
          <div className="p-10 space-y-6 bg-white">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-black/40">Tên danh mục *</Label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="VÍ DỤ: ÁO SƠ MI, GIÀY TÂY..."
                className="h-14 rounded-2xl border-black/5 bg-muted/30 font-black uppercase tracking-widest text-[11px] placeholder:text-black/10 focus:ring-black/5" 
              />
            </div>
          </div>

          <DialogFooter className="p-8 border-t border-black/5 bg-[#FBFBFB] flex sm:justify-between items-center gap-4">
             <Button variant="ghost" onClick={() => setOpen(false)} className="h-14 px-8 rounded-full font-black uppercase tracking-widest text-[10px] text-black/40 hover:text-black transition-colors">
                Hủy bỏ
             </Button>
             <Button onClick={handleSave} className="h-14 px-12 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl shadow-black/10">
                Lưu danh mục
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
