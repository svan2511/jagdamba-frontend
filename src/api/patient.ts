import apiClient from './client';
import { type ApiResponse, type Patient } from './types';

export interface PatientProfileResponse extends Patient {
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
}

interface UpdatePatientData {
  name?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  blood_type?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  medical_history?: string;
  allergies?: string;
}

export const patientApi = {
  getProfile: async (): Promise<ApiResponse<PatientProfileResponse>> => {
    const response = await apiClient.get('/patient/profile');
    return response.data;
  },

  updateProfile: async (data: UpdatePatientData): Promise<ApiResponse<PatientProfileResponse>> => {
    const response = await apiClient.put('/patient/profile', data);
    return response.data;
  },

  updateProfileWithImage: async (data: FormData): Promise<ApiResponse<PatientProfileResponse>> => {
    const response = await apiClient.post('/patient/profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMedicalHistory: async (): Promise<ApiResponse<{
    medical_history: string | null;
    allergies: string | null;
    blood_type: string | null;
    emergency_contact: {
      name: string | null;
      phone: string | null;
      relation: string | null;
    };
  }>> => {
    const response = await apiClient.get('/patient/medical-history');
    return response.data;
  },
};