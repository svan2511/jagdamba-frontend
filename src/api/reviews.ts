import apiClient from './client';
import { type ApiResponse } from './types';

export interface Review {
  id: number;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
  patient: {
    id: number;
    user: {
      id: number;
      name: string;
    };
  } | null;
  doctor: {
    id: number;
    specialty: string;
    user: {
      id: number;
      name: string;
    } | null;
  } | null;
}

interface SubmitReviewData {
  doctor_id: number;
  appointment_id?: number;
  rating: number;
  comment: string;
}

export const reviewsApi = {
  // Get all public approved reviews (for homepage)
  getPublicReviews: async (limit: number = 10): Promise<ApiResponse<Review[]>> => {
    const response = await apiClient.get('/reviews', { params: { limit } });
    return response.data;
  },

  // Get reviews for a specific doctor
  getDoctorReviews: async (doctorId: number): Promise<ApiResponse<Review[]>> => {
    const response = await apiClient.get(`/doctors/${doctorId}/reviews`);
    return response.data;
  },

  // Submit a review (patient only)
  submitReview: async (data: SubmitReviewData): Promise<ApiResponse<Review>> => {
    const response = await apiClient.post('/reviews', data);
    return response.data;
  },
};