import { api } from "@/lib/api";

export const productService = {
  getProducts: (params?: { category_id?: number; is_featured?: boolean; include_hidden?: boolean; min_price?: number; max_price?: number; sort?: string }) => {
    let endpoint = '/products';
    const queryParams = new URLSearchParams();
    if (params?.category_id) queryParams.append('category_id', params.category_id.toString());
    if (params?.is_featured !== undefined) queryParams.append('is_featured', params.is_featured.toString());
    if (params?.include_hidden) queryParams.append('include_hidden', 'true');
    if (params?.min_price) queryParams.append('min_price', params.min_price.toString());
    if (params?.max_price) queryParams.append('max_price', params.max_price.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    
    const queryString = queryParams.toString();
    if (queryString) endpoint += `?${queryString}`;
    
    return api.get(endpoint);
  },
  
  getProductById: (id: string | number) => 
    api.get(`/products/${id}`),
    
  createProduct: (data: any) => 
    api.post('/products', data),
    
  updateProduct: (id: string | number, data: any) => 
    api.put(`/products/${id}`, data),
    
  deleteProduct: (id: string | number) => 
    api.delete(`/products/${id}`),
};
