import { useState, useEffect, useCallback } from 'react'
import { appointmentsApi, type Appointment } from '../api/appointments'
import { patientApi } from '../api/patient'
import { doctorsApi } from '../api/doctors'
import { notificationsApi, type Notification } from '../api/notifications'

// Hook for patient appointments
export function usePatientAppointments(status?: string, type?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true)
      const response = await appointmentsApi.getMyAppointments({ status, type })
      if (response.success) {
        setAppointments(response.data)
      }
    } catch (err: unknown) {
      setError('Failed to load appointments')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [status, type])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  return { appointments, loading, error, refetch: fetchAppointments }
}

// Hook for patient profile
export function usePatientProfile() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      const response = await patientApi.getProfile()
      if (response.success) {
        setProfile(response.data)
      }
    } catch (err: unknown) {
      setError('Failed to load profile')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return { profile, loading, error, refetch: fetchProfile }
}

// Hook for notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      const response = await notificationsApi.getNotifications()
      if (response.success) {
        setNotifications(response.data.data)
        setUnreadCount(response.data.unread_count)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return { notifications, unreadCount, loading, refetch: fetchNotifications }
}

// Hook for doctors list
export function useDoctors(specialty?: string, search?: string) {
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true)
      const response = await doctorsApi.getDoctors({ specialty, search })
      if (response.success) {
        setDoctors(response.data)
      }
    } catch (err: unknown) {
      setError('Failed to load doctors')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [specialty, search])

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  return { doctors, loading, error, refetch: fetchDoctors }
}

// Hook for single doctor
export function useDoctor(id: number) {
  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true)
        const response = await doctorsApi.getDoctor(id)
        if (response.success) {
          setDoctor(response.data)
        }
      } catch (err: unknown) {
        setError('Failed to load doctor')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchDoctor()
  }, [id])

  return { doctor, loading, error }
}