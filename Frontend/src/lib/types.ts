export interface Category {
  id: number;
  name: string;
  created_at: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  size: string;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  category_id?: number;
  category_name?: string;
  category?: Category;
  variants?: ProductVariant[];
  is_featured: boolean;
  status?: 'active' | 'hidden';
  size?: string;
  created_at: string;
}

export interface Banner {
  id: number;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}
