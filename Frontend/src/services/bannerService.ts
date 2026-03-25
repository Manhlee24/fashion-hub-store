import { api } from "@/lib/api";

export const bannerService = {
  getBanners: () => 
    api.get('/banners'),
    
  createBanner: (data: any) => 
    api.post('/banners', data),
    
  updateBanner: (id: string | number, data: any) => 
    api.put(`/banners/${id}`, data),
    
  deleteBanner: (id: string | number) => 
    api.delete(`/banners/${id}`),
};
