import { useEffect, useState } from "react";
import { bannerService } from "@/services/bannerService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");

  const load = () => {
    bannerService.getBanners().then((data: any) => setBanners(data ?? []));
  };

  useEffect(() => { load(); }, []);

  const handleOpen = (banner?: any) => {
    if (banner) {
      setEditing(banner);
      setImageUrl(banner.image_url);
      setIsActive(!!banner.is_active);
      setSortOrder(String(banner.sort_order));
    } else {
      setEditing(null);
      setImageUrl("");
      setIsActive(true);
      setSortOrder("0");
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!imageUrl.trim()) { toast.error("URL ảnh không được trống"); return; }
    const payload = { image_url: imageUrl.trim(), is_active: isActive, sort_order: parseInt(sortOrder) || 0 };
    try {
      if (editing) {
        await bannerService.updateBanner(editing.id, payload);
      } else {
        await bannerService.createBanner(payload);
      }
      setOpen(false); load();
      toast.success(editing ? "Đã cập nhật" : "Đã thêm banner");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi lưu");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa banner này?")) return;
    try {
      await bannerService.deleteBanner(id);
      load();
      toast.success("Đã xóa");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi xóa");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Banner</h1>
        <Button onClick={() => handleOpen()} className="active:scale-95">
          <Plus className="mr-1.5 h-4 w-4" /> Thêm
        </Button>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ảnh</TableHead>
              <TableHead>Thứ tự</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-24 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.map((b) => (
              <TableRow key={b.id}>
                <TableCell>
                  <div className="w-32 h-12 rounded bg-muted overflow-hidden">
                    <img src={b.image_url} alt="" className="h-full w-full object-cover" />
                  </div>
                </TableCell>
                <TableCell className="tabular-nums">{b.sort_order}</TableCell>
                <TableCell>{b.is_active ? "Hiển thị" : "Ẩn"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpen(b)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {banners.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Chưa có banner</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Sửa banner" : "Thêm banner"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>URL ảnh *</Label>
              <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mt-1" placeholder="https://..." />
            </div>
            <div>
              <Label>Thứ tự hiển thị</Label>
              <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="mt-1" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <Label>Hiển thị</Label>
            </div>
            {imageUrl && (
              <div className="rounded-lg overflow-hidden bg-muted aspect-[3/1]">
                <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}
            <Button onClick={handleSave} className="w-full active:scale-[0.97]">Lưu</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
