import apiClient from './client';
import { type ApiResponse } from './types';

export interface DoctorResponse {
  id: number;
  specialty: string;
  qualification?: string;
  experience_years: number;
  bio?: string;
  image?: string;
  consultation_fee: number;
  available_days: string[];
  start_time: string;
  end_time: string;
  is_available: boolean;
  is_verified: boolean;
  average_rating: number;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    is_active?: boolean;
  };
}

export interface PatientResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  is_active: boolean;
  created_at: string;
  patient?: {
    id: number;
    user_id: number;
    date_of_birth: string;
    gender: string;
    blood_type: string;
    address: string;
  };
  // Backward compatibility
  gender?: string;
  blood_group?: string;
  date_of_birth?: string;
  address?: string;
}

interface CreateDoctorData {
  // User fields
  name: string;
  email: string;
  phone: string;
  password?: string;
  // Doctor fields
  specialty: string;
  qualification?: string;
  experience_years: number;
  designation?: string;
  bio?: string;
  consultation_fee: number;
  available_days?: string[];
  start_time?: string;
  end_time?: string;
  is_available: boolean;
}

export const adminApi = {
  createDoctor: async (data: CreateDoctorData): Promise<ApiResponse<DoctorResponse>> => {
    const response = await apiClient.post('/admin/doctors', data);
    return response.data;
  },

  getAllDoctors: async (params?: { page?: number; search?: string; specialty?: string; status?: string }): Promise<ApiResponse<DoctorResponse[]>> => {
    const response = await apiClient.get('/admin/doctors', { params });
    return response.data;
  },

  getDoctor: async (id: number): Promise<ApiResponse<DoctorResponse>> => {
    const response = await apiClient.get(`/admin/doctors/${id}`);
    return response.data;
  },

  deleteDoctor: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/admin/doctors/${id}`);
    return response.data;
  },

  updateDoctor: async (id: number, data: Partial<CreateDoctorData>): Promise<ApiResponse<DoctorResponse>> => {
    const response = await apiClient.put(`/admin/doctors/${id}`, data);
    return response.data;
  },

  getAllAppointments: async (params?: { page?: number; search?: string; status?: string; appointment_date?: string }): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/admin/appointments', { params });
    return response.data;
  },

  getAppointment: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/admin/appointments/${id}`);
    return response.data;
  },

  getAllPatients: async (params?: { page?: number; search?: string; status?: string; blood_group?: string; gender?: string }): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/admin/patients', { params });
    return response.data;
  },

  getPatient: async (id: number): Promise<ApiResponse<PatientResponse>> => {
    const response = await apiClient.get(`/admin/patients/${id}`);
    return response.data;
  },

  deletePatient: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/admin/patients/${id}`);
    return response.data;
  },

  updatePatient: async (id: number, data: Partial<PatientResponse>): Promise<ApiResponse<PatientResponse>> => {
    const response = await apiClient.put(`/admin/patients/${id}`, data);
    return response.data;
  },

  getAllReviews: async (params?: { page?: number; status?: string; rating?: number; doctor_id?: number }): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/admin/reviews', { params });
    return response.data;
  },

  updateReviewStatus: async (id: number, status: string): Promise<ApiResponse<any>> => {
    // Backend expects is_approved as boolean: true for Published, false for Rejected
    const isApproved = status === 'Published' || status === 'Approved'
    const response = await apiClient.put(`/admin/reviews/${id}/status`, { is_approved: isApproved });
    return response.data;
  },

  getAllNotifications: async (params?: { page?: number; type?: string; is_read?: string }): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/admin/notifications', { params });
    return response.data;
  },

  markNotificationRead: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/admin/notifications/${id}/read`);
    return response.data;
  },

  deleteNotification: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/admin/notifications/${id}/delete`);
    return response.data;
  },

  createNotification: async (data: { title: string; message: string; type?: string; user_id?: number }): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/admin/notifications', data);
    return response.data;
  },

  getAllGallery: async (params?: { page?: number; category?: string; type?: string; is_active?: string }): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/admin/gallery', { params });
    return response.data;
  },

  createGallery: async (data: { title: string; image: string; category: string; is_active: boolean }): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/admin/gallery', data);
    return response.data;
  },

  updateGallery: async (id: number, data: FormData): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/admin/gallery/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteGallery: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/admin/gallery/${id}`);
    return response.data;
  },

  getAnalytics: async (range?: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/admin/analytics', { params: { range } });
    return response.data;
  },

  getDashboardStats: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },

  getSettings: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/admin/settings');
    return response.data;
  },

  updateSettings: async (data: Record<string, string>): Promise<ApiResponse<any>> => {
    const response = await apiClient.put('/admin/settings', data);
    return response.data;
  },

  // Doctor Schedule Management
  getDoctorSchedules: async (params?: { specialty?: string; search?: string }): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/admin/schedules', { params });
    return response.data;
  },

  saveDoctorSchedule: async (data: {
    doctor_id: number;
    schedules: Array<{
      day_of_week: string;
      start_time: string;
      end_time: string;
      slot_duration: number;
      break_start?: string;
      break_end?: string;
      is_active: boolean;
    }>;
  }): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/admin/schedules', data);
    return response.data;
  },

  deleteDoctorSchedule: async (doctorId: number, dayOfWeek: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/admin/schedules/${doctorId}/${dayOfWeek}`);
    return response.data;
  },

  blockDoctorSchedule: async (doctorId: number, startDate: string, endDate: string, reason?: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.post(`/admin/doctors/${doctorId}/block`, {
      start_date: startDate,
      end_date: endDate,
      reason,
    });
    return response.data;
  },

  toggleDoctorAvailability: async (doctorId: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.post(`/admin/doctors/${doctorId}/toggle-availability`);
    return response.data;
  },

  // Schedule Request Management
  getScheduleRequests: async (params?: {
    page?: number;
    status?: string;
    request_type?: string;
    doctor_id?: number;
    from_date?: string;
    to_date?: string;
    search?: string;
    per_page?: number;
  }): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/admin/schedule-requests', { params });
    return response.data;
  },

  getScheduleRequest: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/admin/schedule-requests/${id}`);
    return response.data;
  },

  approveScheduleRequest: async (id: number, adminNotes?: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/admin/schedule-requests/${id}/approve`, {
      admin_notes: adminNotes,
    });
    return response.data;
  },

  rejectScheduleRequest: async (id: number, adminNotes?: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/admin/schedule-requests/${id}/reject`, {
      admin_notes: adminNotes,
    });
    return response.data;
  },

  updateScheduleRequest: async (id: number, data: {
    requested_start_time?: string;
    requested_end_time?: string;
    reason?: string;
    admin_notes?: string;
  }): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/admin/schedule-requests/${id}`, data);
    return response.data;
  },

  deleteScheduleRequest: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/admin/schedule-requests/${id}`);
    return response.data;
  },

  getScheduleRequestStats: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/admin/schedule-requests/stats');
    return response.data;
  },

  getScheduleRequestDoctors: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/admin/schedule-requests/doctors');
    return response.data;
  },
};