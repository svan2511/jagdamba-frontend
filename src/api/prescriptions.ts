import apiClient from './client';
import { type ApiResponse } from './types';

export interface Prescription {
  id: number;
  diagnosis?: string;
  symptoms?: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  instructions?: string;
  follow_up_date?: string;
  created_at: string;
  doctor: {
    id: number;
    specialty: string;
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
    };
  };
  appointment?: {
    id: number;
    appointment_date: string;
    appointment_time: string;
  };
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface CreatePrescriptionData {
  appointment_id: number;
  diagnosis?: string;
  symptoms?: string;
  medications: Medication[];
  instructions?: string;
  follow_up_date?: string;
}

export const prescriptionsApi = {
  getMyPrescriptions: async (): Promise<ApiResponse<Prescription[]>> => {
    const response = await apiClient.get('/patient/prescriptions');
    return response.data;
  },

  getPrescription: async (id: number): Promise<ApiResponse<Prescription>> => {
    const response = await apiClient.get(`/prescriptions/${id}`);
    return response.data;
  },

  getDoctorPrescriptions: async (): Promise<ApiResponse<Prescription[]>> => {
    const response = await apiClient.get('/doctor/prescriptions');
    return response.data;
  },

  createPrescription: async (data: CreatePrescriptionData): Promise<ApiResponse<Prescription>> => {
    const response = await apiClient.post('/doctor/prescriptions', data);
    return response.data;
  },
};