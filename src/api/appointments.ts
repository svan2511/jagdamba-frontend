import apiClient from './client';
import type { ApiResponse, TimeSlot, AvailableSlotsResponse, SlotValidationResponse } from './types';

// Re-export slot types for convenience
export type { TimeSlot, AvailableSlotsResponse, SlotValidationResponse };

export interface Appointment {
  id: number;
  appointment_date: string;
  appointment_time: string;
  type: 'in-person' | 'telehealth';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  reason?: string;
  notes?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_at: string;
  doctor: {
    id: number;
    specialty: string;
    image?: string;
    user: {
      id: number;
      name: string;
    };
  };
  patient?: {
    id: number;
    user: {
      id: number;
      name: string;
      phone?: string;
    };
  };
}

interface BookAppointmentData {
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  type: 'in-person' | 'telehealth';
  reason?: string;
}

export const appointmentsApi = {
  // Patient appointments
  getMyAppointments: async (params?: { status?: string; type?: string }): Promise<ApiResponse<Appointment[]>> => {
    const response = await apiClient.get('/patient/appointments', { params });
    return response.data;
  },

  getAppointment: async (id: number): Promise<ApiResponse<Appointment>> => {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  },

  bookAppointment: async (data: BookAppointmentData): Promise<ApiResponse<Appointment>> => {
    const response = await apiClient.post('/appointments', data);
    return response.data;
  },

  cancelAppointment: async (id: number, reason?: string): Promise<ApiResponse<Appointment>> => {
    const response = await apiClient.post(`/appointments/${id}/cancel`, { reason });
    return response.data;
  },

  // Doctor appointments
  getDoctorAppointments: async (params?: { status?: string; date?: string; page?: number }): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/doctor/appointments', { params });
    return response.data;
  },

  updateAppointmentStatus: async (id: number, status: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/doctor/appointments/${id}/status`, { status });
    return response.data;
  },

  getDoctorPatients: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/doctor/patients');
    return response.data;
  },

  // Get available slots for booking - Uses real-time doctor schedule data
  getAvailableSlots: async (doctorId: number, date: string): Promise<ApiResponse<AvailableSlotsResponse>> => {
    const response = await apiClient.get(`/doctors/${doctorId}/slots`, { params: { date } });
    return response.data;
  },

  // Validate a specific slot before booking (prevents race conditions)
  validateSlot: async (doctorId: number, date: string, time: string): Promise<ApiResponse<SlotValidationResponse>> => {
    const response = await apiClient.post(`/doctors/${doctorId}/validate-slot`, { date, time });
    return response.data;
  },

  // Doctor - Get patient details
  getDoctorPatientDetails: async (patientId: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/doctor/patients/${patientId}`);
    return response.data;
  },

  // Doctor - Get patient medical history
  getPatientMedicalHistory: async (patientId: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/doctor/patients/${patientId}/medical-history`);
    return response.data;
  },
};