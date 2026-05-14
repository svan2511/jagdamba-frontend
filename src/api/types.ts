// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error_code?: string;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  stats?: Record<string, any>;
}

// Slot types
export interface TimeSlot {
  start: string;
  end: string;
  start_formatted?: string;
  end_formatted?: string;
}

export interface AvailableSlotsResponse {
  slots: TimeSlot[];
  message?: string;
  date: string;
  day: string;
  has_schedule: boolean;
  schedule_info?: {
    type: string;
    start_time: string;
    end_time: string;
    slot_duration: number;
    break_start?: string;
    break_end?: string;
  };
  booked_count?: number;
  total_slots?: number;
}

export interface SlotValidationResponse {
  valid: boolean;
  message: string;
  error_code?: string;
  slot?: {
    start: string;
    end: string;
  };
}

// Auth types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'doctor' | 'patient';
  is_active: boolean;
  created_at: string;
  doctor?: Doctor;
  patient?: Patient;
}

export interface Doctor {
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
}

export interface Patient {
  id: number;
  image?: string | null;
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
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

export interface AuthResponse {
  user: User;
  token: string;
}