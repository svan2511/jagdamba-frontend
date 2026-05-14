import apiClient from './client';
import { type ApiResponse } from './types';

export interface DoctorsResponse {
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
  };
}

interface DoctorScheduleResponse {
  available_days: string[];
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface DoctorReviewsResponse {
  id: number;
  rating: number;
  comment?: string;
  is_approved: boolean;
  created_at: string;
  patient: {
    id: number;
    user: {
      id: number;
      name: string;
    };
  };
}

// Doctor Dashboard Data
interface DoctorDashboardData {
  doctor: DoctorsResponse;
  stats: {
    total_appointments: number;
    today_appointments: number;
    pending_appointments: number;
    completed_appointments: number;
    total_patients: number;
    total_prescriptions: number;
    average_rating: number;
    this_month_appointments: number;
  };
  recent_appointments: any[];
  recent_prescriptions: any[];
}

export const doctorsApi = {
  // Public endpoints
  getDoctors: async (params?: { specialty?: string; search?: string }): Promise<ApiResponse<DoctorsResponse[]>> => {
    const response = await apiClient.get('/doctors', { params });
    return response.data;
  },

  getDoctor: async (id: number): Promise<ApiResponse<DoctorsResponse>> => {
    const response = await apiClient.get(`/doctors/${id}`);
    return response.data;
  },

  getDoctorSchedule: async (id: number): Promise<ApiResponse<DoctorScheduleResponse>> => {
    const response = await apiClient.get(`/doctors/${id}/schedule`);
    return response.data;
  },

  getDoctorReviews: async (id: number): Promise<ApiResponse<DoctorReviewsResponse[]>> => {
    const response = await apiClient.get(`/doctors/${id}/reviews`);
    return response.data;
  },

  // Doctor Dashboard
  getDoctorDashboard: async (): Promise<ApiResponse<DoctorDashboardData>> => {
    const response = await apiClient.get('/doctor/dashboard');
    return response.data;
  },

  getDoctorProfile: async (): Promise<ApiResponse<DoctorsResponse>> => {
    const response = await apiClient.get('/doctor/profile');
    return response.data;
  },

  updateDoctorProfile: async (data: FormData): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/doctor/profile', data);
    return response.data;
  },

  // Doctor Schedule
  getMySchedule: async (): Promise<ApiResponse<DoctorScheduleResponse>> => {
    const response = await apiClient.get('/doctor/schedule');
    return response.data;
  },

  updateMySchedule: async (data: any): Promise<ApiResponse<DoctorScheduleResponse>> => {
    const response = await apiClient.put('/doctor/schedule', data);
    return response.data;
  },

  // Schedule Management (for doctor's own use)
  getMyDoctorSchedule: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/doctor/schedule');
    return response.data;
  },

  createLeave: async (data: { start_date: string; end_date: string; reason?: string }): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/doctor/leave', data);
    return response.data;
  },

  createCustomTiming: async (data: { date: string; start_time: string; end_time: string; reason?: string }): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/doctor/custom-timing', data);
    return response.data;
  },

  deleteOverride: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/doctor/override/${id}`);
    return response.data;
  },

  toggleAvailability: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/doctor/availability/toggle');
    return response.data;
  },

  // Schedule Requests
  getMyScheduleRequests: async (params?: { status?: string; request_type?: string; per_page?: number }): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/doctor/schedule/requests', { params });
    return response.data;
  },

  createScheduleRequest: async (data: {
    request_type: 'leave' | 'temporary_timing' | 'unavailable' | 'break_change';
    request_date: string;
    old_start_time?: string;
    old_end_time?: string;
    requested_start_time?: string;
    requested_end_time?: string;
    reason?: string;
  }): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/doctor/schedule/requests', data);
    return response.data;
  },

  cancelScheduleRequest: async (id: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/doctor/schedule/requests/${id}`);
    return response.data;
  },
};