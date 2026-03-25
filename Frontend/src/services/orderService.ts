import { api } from "@/lib/api";

export const orderService = {
  getOrders: () => 
    api.get('/orders'),
    
  getUserOrders: () => 
    api.get('/orders/user'),
    
  getOrderById: (id: string | number) => 
    api.get(`/orders/${id}`),
    
  createOrder: (data: { total_amount: number; items: any[] }) => 
    api.post('/orders', data),
    
  updateOrderStatus: (id: string | number, status: string) => 
    api.put(`/orders/${id}/status`, { status }),
};
