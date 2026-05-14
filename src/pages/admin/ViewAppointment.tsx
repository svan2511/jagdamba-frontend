import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Stethoscope, Phone, FileText, Loader2, CheckCircle, Hourglass, XCircle, CalendarCheck } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { adminApi } from '../../api/admin'

export default function ViewAppointment() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [appointment, setAppointment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!id) {
        navigate('/admin/appointments')
        return
      }

      try {
        setLoading(true)
        const response = await adminApi.getAppointment(parseInt(id))

        if (response.success && response.data) {
          const apt = response.data
          setAppointment({
            id: apt.id,
            patient_name: apt.patient?.user?.name || 'Patient',
            patient_phone: apt.patient?.user?.phone || '',
            patient_email: apt.patient?.user?.email || '',
            doctor_name: apt.doctor?.user?.name || 'Doctor',
            doctor_specialty: apt.doctor?.specialty || '',
            appointment_date: apt.appointment_date || '',
            appointment_time: apt.appointment_time || '',
            type: apt.type || 'General',
            status: apt.status || 'pending',
            reason: apt.reason || '',
            notes: apt.notes || '',
            fee: apt.consultation_fee || '₹0',
            payment_status: apt.payment_status || 'Pending',
            created_at: apt.created_at || '',
          })
        } else {
          setError('Appointment not found')
        }
      } catch {
        setError('Failed to load appointment details')
      } finally {
        setLoading(false)
      }
    }

    fetchAppointment()
  }, [id, navigate])

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Hourglass className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      case 'completed': return <CalendarCheck className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !appointment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/appointments')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-[#273f2b]">Appointment Not Found</h1>
        </div>
        <p className="text-gray-500">{error || 'Unable to load appointment'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/appointments')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#273f2b]">Appointment Details</h1>
            <p className="text-gray-500 text-sm">View appointment information</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Appointment Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Appointment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#3e5641]/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#3e5641]" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Date</span>
                  <span className="font-medium text-gray-800">{appointment.appointment_date}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#3e5641]/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#3e5641]" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Time</span>
                  <span className="font-medium text-gray-800">{appointment.appointment_time}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#d36135]/10 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-[#d36135]" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Type</span>
                  <span className="font-medium text-gray-800">{appointment.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Reason</span>
                  <span className="font-medium text-gray-800">{appointment.reason || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Doctor Details</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#3e5641] flex items-center justify-center">
                <span className="text-xl font-bold text-white">{appointment.doctor_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}</span>
              </div>
              <div>
                <span className="font-medium text-gray-800 block">{appointment.doctor_name}</span>
                <span className="text-sm text-gray-500">{appointment.doctor_specialty}</span>
              </div>
            </div>
          </div>

          {/* Notes (if any) */}
          {appointment.notes && (
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes</h3>
              <p className="text-gray-600">{appointment.notes}</p>
            </div>
          )}
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Patient Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#3e5641]/10 flex items-center justify-center">
                <span className="text-lg font-medium text-[#3e5641]">{appointment.patient_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}</span>
              </div>
              <div>
                <span className="font-medium text-gray-800 block">{appointment.patient_name}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{appointment.patient_phone}</span>
              </div>
            </div>
          </motion.div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Status</h3>
            <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 w-fit ${getStatusColor(appointment.status)}`}>
              {getStatusIcon(appointment.status)}
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </span>
            <p className="text-sm text-gray-500 mt-2">Booked on: {new Date(appointment.created_at).toLocaleDateString()}</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}