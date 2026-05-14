import apiClient from './client'
import { type ApiResponse } from './types'

export interface Report {
  id: number
  title: string
  report_type: string
  file_path: string | null
  description: string | null
  report_date: string
  created_at: string
  patient?: {
    id: number
    user: {
      id: number
      name: string
      phone?: string
    }
  }
}

export interface CreateReportData {
  patient_id: number
  appointment_id?: number
  title: string
  report_type: string
  file_path?: string
  description?: string
  report_date: string
}

export const reportsApi = {
  // Patient
  getMyReports: async (): Promise<ApiResponse<Report[]>> => {
    const response = await apiClient.get('/patient/reports')
    return response.data
  },

  getReport: async (id: number): Promise<ApiResponse<Report>> => {
    const response = await apiClient.get(`/patient/reports/${id}`)
    return response.data
  },

  // Doctor
  getDoctorReports: async (): Promise<ApiResponse<Report[]>> => {
    const response = await apiClient.get('/doctor/reports')
    return response.data
  },

  getDoctorReport: async (id: number): Promise<ApiResponse<Report>> => {
    const response = await apiClient.get(`/doctor/reports/${id}`)
    return response.data
  },

  createDoctorReport: async (data: CreateReportData): Promise<ApiResponse<Report>> => {
    const response = await apiClient.post('/doctor/reports', data)
    return response.data
  },

  deleteDoctorReport: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/doctor/reports/${id}`)
    return response.data
  },
}