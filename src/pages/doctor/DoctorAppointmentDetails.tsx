import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, MapPin, Video, FileText, Phone, Mail, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { appointmentsApi } from '../../api/appointments'
import toast from 'react-hot-toast'
import FullPageLoader from '../../components/FullPageLoader'

interface Appointment {
  id: number
  appointment_date: string
  appointment_time: string
  type: 'in-person' | 'telehealth' | string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show' | string
  reason?: string
  notes?: string | null
  patient?: {
    id: number
    user: {
      id?: number
      name: string
      email?: string
      phone?: string
    }
  }
  doctor?: {
    id: number
    specialty: string
    user: {
      name: string
    }
  }
}

export default function DoctorAppointmentDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true)
        const response = await appointmentsApi.getAppointment(parseInt(id!))
        if (response.success && response.data) {
          setAppointment(response.data)
        } else {
          setError(response.message || 'Failed to load appointment')
        }
      } catch (err) {
        setError('Failed to load appointment details')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchAppointment()
  }, [id])

  const handleConfirm = async () => {
    if (!appointment) return
    try {
      setUpdating(true)
      const response = await appointmentsApi.updateAppointmentStatus(appointment.id, 'confirmed')
      if (response.success) {
        toast.success('Appointment confirmed!')
        setAppointment({ ...appointment, status: 'confirmed' })
      }
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const handleComplete = async () => {
    if (!appointment) return
    try {
      setUpdating(true)
      const response = await appointmentsApi.updateAppointmentStatus(appointment.id, 'completed')
      if (response.success) {
        toast.success('Appointment marked as completed!')
        setAppointment({ ...appointment, status: 'completed' })
      }
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700'
      case 'pending': return 'bg-amber-100 text-amber-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const getDateString = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  const getTimeString = (time: string) => {
    const [hours, minutes] = time.split(':')
    const h = parseInt(hours)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour12 = h % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  if (loading) {
    return <FullPageLoader message="Loading appointment..." />
  }

  if (error || !appointment) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Something went wrong</h3>
          <p className="text-slate-500 mb-4">{error || 'Appointment not found'}</p>
          <button onClick={() => navigate('/doctor/appointments')} className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
            Back to Appointments
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/doctor/appointments')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Appointment Details</h1>
          <p className="text-slate-500 text-sm">ID: #{appointment.id}</p>
        </div>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 p-6"
      >
        {/* Patient Info */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-500/20">
              {appointment.patient?.user?.name?.charAt(0) || 'P'}
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 text-lg">{appointment.patient?.user?.name || 'Patient'}</h2>
              <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                {appointment.patient?.user?.phone && (
                  <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {appointment.patient.user.phone}</span>
                )}
                {appointment.patient?.user?.email && (
                  <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {appointment.patient.user.email}</span>
                )}
              </div>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(appointment.status)}`}>
            {appointment.status}
          </span>
        </div>

        {/* Appointment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block">Date</span>
                <span className="font-semibold text-slate-800">{getDateString(appointment.appointment_date)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block">Time</span>
                <span className="font-semibold text-slate-800">{getTimeString(appointment.appointment_time)}</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                {appointment.type === 'telehealth' ? <Video className="w-5 h-5 text-blue-600" /> : <MapPin className="w-5 h-5 text-blue-600" />}
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block">Type</span>
                <span className="font-semibold text-slate-800 capitalize">{appointment.type === 'telehealth' ? 'Telehealth' : 'In-Person'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block">Reason</span>
                <span className="font-semibold text-slate-800">{appointment.reason || 'General consultation'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {appointment.notes && (
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <h4 className="font-semibold text-amber-800 mb-2">Notes</h4>
            <p className="text-amber-700 text-sm">{appointment.notes}</p>
          </div>
        )}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-slate-200 p-6"
      >
        <h3 className="font-semibold text-slate-800 mb-4">Actions</h3>
        <div className="flex flex-wrap gap-3">
          {appointment.status === 'pending' && (
            <button
              onClick={handleConfirm}
              disabled={updating}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Confirm Appointment
            </button>
          )}
          {appointment.status === 'confirmed' && (
            <button
              onClick={handleComplete}
              disabled={updating}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Mark as Completed
            </button>
          )}
          {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
            <button
              onClick={() => navigate(`/doctor/prescription?patient=${appointment.patient?.id}&appointment=${appointment.id}`)}
              className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Write Prescription
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}