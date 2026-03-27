import { api } from "@/lib/api";

export const heroService = {
  getHeroes: () => 
    api.get('/heroes'),
    
  createHero: (data: any) => 
    api.post('/heroes', data),
    
  updateHero: (id: string | number, data: any) => 
    api.put(`/heroes/${id}`, data),
    
  deleteHero: (id: string | number) => 
    api.delete(`/heroes/${id}`),
};
