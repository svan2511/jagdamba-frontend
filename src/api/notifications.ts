import apiClient from './client';
import { type ApiResponse } from './types';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationsResponse {
  data: Notification[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  unread_count: number;
}

export const notificationsApi = {
  getNotifications: async (params?: { unread?: boolean }): Promise<ApiResponse<NotificationsResponse>> => {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  },

  markAsRead: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.post(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.post('/notifications/mark-all-read');
    return response.data;
  },

  deleteNotification: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },
};