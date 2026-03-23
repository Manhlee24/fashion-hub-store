import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye } from "lucide-react";

const statuses = [
  { value: "pending", label: "Chờ duyệt" },
  { value: "confirmed", label: "Đã duyệt" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  confirmed: "default",
  shipping: "outline",
  completed: "default",
  cancelled: "destructive",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Tables<"orders">[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [detailOrder, setDetailOrder] = useState<Tables<"orders"> | null>(null);
  const [orderItems, setOrderItems] = useState<(Tables<"order_items"> & { product_name?: string })[]>([]);

  const load = () => {
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (filterStatus !== "all") query = query.eq("status", filterStatus);
    query.then(({ data }) => setOrders(data ?? []));
  };

  useEffect(() => { load(); }, [filterStatus]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const viewDetail = async (order: Tables<"orders">) => {
    setDetailOrder(order);
    const { data } = await supabase.from("order_items").select("*, products(product_name)").eq("order_id", order.id);
    setOrderItems(
      (data ?? []).map((item: any) => ({
        ...item,
        product_name: item.products?.product_name ?? "N/A",
      }))
    );
  };

  const updateStatus = async (orderId: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    load();
    if (detailOrder?.id === orderId) setDetailOrder((prev) => prev ? { ...prev, status } : null);
    toast.success("Đã cập nhật trạng thái");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Đơn hàng</h1>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {statuses.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Người nhận</TableHead>
              <TableHead>Tổng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-xs">{o.id.slice(0, 8).toUpperCase()}</TableCell>
                <TableCell>{o.receiver_name}</TableCell>
                <TableCell className="tabular-nums">{formatPrice(o.total_amount)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[o.status] ?? "secondary"}>
                    {statuses.find((s) => s.value === o.status)?.label ?? o.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{new Date(o.created_at).toLocaleDateString("vi-VN")}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => viewDetail(o)}><Eye className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Không có đơn hàng</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!detailOrder} onOpenChange={() => setDetailOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Chi tiết đơn #{detailOrder?.id.slice(0, 8).toUpperCase()}</DialogTitle></DialogHeader>
          {detailOrder && (
            <div className="space-y-4">
              <div className="text-sm space-y-1">
                <p>Người nhận: <span className="font-medium">{detailOrder.receiver_name}</span></p>
                <p>SĐT: {detailOrder.phone}</p>
                <p>Địa chỉ: {detailOrder.address}</p>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>SL</TableHead>
                      <TableHead>Đơn giá</TableHead>
                      <TableHead>Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="tabular-nums">{formatPrice(item.unit_price)}</TableCell>
                        <TableCell className="tabular-nums">{formatPrice(item.unit_price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Tổng cộng</span>
                <span className="tabular-nums">{formatPrice(detailOrder.total_amount)}</span>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Cập nhật trạng thái:</p>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((s) => (
                    <Button
                      key={s.value}
                      variant={detailOrder.status === s.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateStatus(detailOrder.id, s.value)}
                      className="active:scale-95"
                    >
                      {s.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
