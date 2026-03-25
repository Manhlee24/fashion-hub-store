import { api } from "@/lib/api";

export const authService = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
    
  register: (email: string, password: string, name: string) => 
    api.post('/auth/register', { email, password, name }),
    
  getProfile: () => 
    api.get('/auth/profile'),
};
