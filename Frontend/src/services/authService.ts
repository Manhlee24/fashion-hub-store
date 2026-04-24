import { api } from "@/lib/api";

export const authService = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
    
  register: (email: string, password: string, name: string) => 
    api.post('/auth/register', { email, password, name }),
    
  getProfile: () => 
    api.get('/auth/profile'),
    
  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),
    
  resetPassword: (email: string, code: string, newPassword: string) => 
    api.post('/auth/reset-password', { email, code, newPassword }),
};
