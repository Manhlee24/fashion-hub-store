import { useEffect, useState } from "react";
import { heroService } from "@/services/heroService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";

interface HeroForm {
  image_url: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  is_active: boolean;
}

const emptyForm: HeroForm = {
  image_url: "",
  title: "",
  subtitle: "",
  button_text: "Xem ngay",
  button_link: "/products",
  is_active: true
};

export default function AdminHeroes() {
  const [heroes, setHeroes] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<HeroForm>(emptyForm);

  const load = () => {
    heroService.getHeroes().then((data: any) => setHeroes(data ?? []));
  };

  useEffect(() => { load(); }, []);

  const handleOpen = (hero?: any) => {
    if (hero) {
      setEditing(hero);
      setForm({
        image_url: hero.image_url || "",
        title: hero.title || "",
        subtitle: hero.subtitle || "",
        button_text: hero.button_text || "",
        button_link: hero.button_link || "",
        is_active: !!hero.is_active
      });
    } else {
      setEditing(null);
      setForm(emptyForm);
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.image_url.trim()) { toast.error("URL ảnh không được trống"); return; }
    try {
      if (editing) {
        await heroService.updateHero(editing.id, form);
      } else {
        await heroService.createHero(form);
      }
      setOpen(false); load();
      toast.success(editing ? "Đã cập nhật Hero" : "Đã thêm Hero mới");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi lưu");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa Hero này?")) return;
    try {
      await heroService.deleteHero(id);
      load();
      toast.success("Đã xóa Hero");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi xóa");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Quản lý Hero Section</h1>
          <p className="text-muted-foreground mt-1">Quản lý nội dung hiển thị ở đầu trang chủ.</p>
        </div>
        <Button onClick={() => handleOpen()} className="rounded-full px-6 active:scale-95 shadow-lg">
          <Plus className="mr-1.5 h-5 w-5" /> Thêm mới
        </Button>
      </div>

      <div className="border rounded-2xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="py-4">Ảnh & Tiêu đề</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Nút bấm</TableHead>
              <TableHead className="w-24 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {heroes.map((h) => (
              <TableRow key={h.id} className="group transition-colors hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="w-40 h-20 rounded-xl overflow-hidden bg-muted border flex-shrink-0">
                      <img src={h.image_url} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base uppercase leading-tight">{h.title || "Không có tiêu đề"}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{h.subtitle}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    h.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {h.is_active ? 'Đang bật' : 'Đã tắt'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium cursor-default border w-fit px-2 py-0.5 rounded bg-muted/50">{h.button_text}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                       {h.button_link} <ExternalLink className="h-2 w-2" />
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleOpen(h)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full text-destructive" onClick={() => handleDelete(h.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {heroes.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-16">Chưa có Hero Section nào. Hãy thêm mới để bắt đầu!</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight">{editing ? "Chỉnh sửa Hero" : "Thêm Hero mới"}</DialogTitle>
            <DialogDescription>Thiết lập nội dung hiển thị nổi bật trên trang chủ.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label className="font-bold">URL ảnh nền *</Label>
              <Input value={form.image_url} onChange={(e) => setForm({...form, image_url: e.target.value})} placeholder="https://unsplash.com/..." className="rounded-xl h-11" />
            </div>
            <div className="grid gap-2">
              <Label className="font-bold">Tiêu đề chính (Dùng Enter để xuống dòng)</Label>
              <Textarea value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="VÍ DỤ: PHONG CÁCH&#10;ĐỊNH HÌNH&#10;BẢN LĨNH" className="rounded-xl min-h-[100px]" />
            </div>
            <div className="grid gap-2">
              <Label className="font-bold">Mô tả / Slogan</Label>
              <Textarea value={form.subtitle} onChange={(e) => setForm({...form, subtitle: e.target.value})} placeholder="VÍ DỤ: BẢN LĨNH PHÁI MẠNH" className="rounded-xl min-h-[80px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="font-bold">Chữ trên nút</Label>
                <Input value={form.button_text} onChange={(e) => setForm({...form, button_text: e.target.value})} placeholder="MUA NGAY" className="rounded-xl h-11" />
              </div>
              <div className="grid gap-2">
                <Label className="font-bold">Link khi click</Label>
                <Input value={form.button_link} onChange={(e) => setForm({...form, button_link: e.target.value})} placeholder="/products" className="rounded-xl h-11" />
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-dashed">
              <Switch id="active-status" checked={form.is_active} onCheckedChange={(v) => setForm({...form, is_active: v})} />
              <Label htmlFor="active-status" className="font-bold cursor-pointer">Kích hoạt hiển thị</Label>
            </div>
            {form.image_url && (
              <div className="rounded-2xl overflow-hidden bg-muted aspect-[3/1] border shadow-inner">
                <img src={form.image_url} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}
            <Button onClick={handleSave} size="lg" className="w-full rounded-full h-14 font-bold text-lg shadow-xl shadow-primary/20 active:scale-[0.98]">
              {editing ? "Lưu thay đổi" : "Tạo Hero ngay"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
