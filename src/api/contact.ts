import apiClient from './client';
import { type ApiResponse } from './types';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  department?: string;
  message: string;
}

export const contactApi = {
  submitContact: async (data: ContactFormData): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/contact', data);
    return response.data;
  },
};