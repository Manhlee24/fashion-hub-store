import { api } from "@/lib/api";

export const categoryService = {
  getCategories: () => 
    api.get('/categories'),
    
  createCategory: (name: string) => 
    api.post('/categories', { name }),
    
  updateCategory: (id: string | number, name: string) => 
    api.put(`/categories/${id}`, { name }),
    
  deleteCategory: (id: string | number) => 
    api.delete(`/categories/${id}`),
};
