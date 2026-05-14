import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, Eye, Loader2, ChevronRight, Stethoscope } from 'lucide-react'
import { appointmentsApi, type Appointment } from '../../api/appointments'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import FullPageLoader from '../../components/FullPageLoader'

export default function MyAppointments() {
  const [filter, setFilter] = useState('all')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState<number | null>(null)

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true)
      const response = await appointmentsApi.getMyAppointments()
      if (response.success) {
        setAppointments(response.data)
      }
    } catch (err) {
      setError('Failed to load appointments')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const handleCancel = async (id: number) => {
    const result = await Swal.fire({
      title: 'Cancel Appointment',
      html: 'Are you sure you want to cancel this appointment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, cancel',
      cancelButtonText: 'No, keep it',
    })

    if (!result.isConfirmed) return

    try {
      setCancelling(id)
      await appointmentsApi.cancelAppointment(id)
      toast.success('Appointment cancelled successfully')
      fetchAppointments()
    } catch (err) {
      toast.error('Failed to cancel appointment')
    } finally {
      setCancelling(null)
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true
    if (filter === 'upcoming') return ['pending', 'confirmed'].includes(apt.status) && new Date(apt.appointment_date) >= new Date()
    if (filter === 'completed') return apt.status === 'completed'
    if (filter === 'cancelled') return apt.status === 'cancelled'
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700'
      case 'pending': return 'bg-amber-100 text-amber-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      case 'no-show': return 'bg-slate-100 text-slate-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getDateString = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getTimeString = (time: string) => {
    const [hours, minutes] = time.split(':')
    const h = parseInt(hours)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour12 = h % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const getTypeIcon = (type: string) => {
    return type === 'telehealth' ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  }

  if (loading) {
    return <FullPageLoader message="Loading your appointments..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Appointments</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track all your appointments</p>
        </div>
        <Link
          to="/patient/book-appointment"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25"
        >
          <Calendar className="w-5 h-5" />
          <span>Book New Appointment</span>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'All', count: appointments.length, color: 'emerald' },
          { label: 'Upcoming', count: appointments.filter(a => ['pending', 'confirmed'].includes(a.status)).length, color: 'amber' },
          { label: 'Completed', count: appointments.filter(a => a.status === 'completed').length, color: 'blue' },
          { label: 'Cancelled', count: appointments.filter(a => ['cancelled', 'no-show'].includes(a.status)).length, color: 'red' },
        ].map((stat) => (
          <div key={stat.label} className={`bg-${stat.color === 'emerald' ? 'emerald' : stat.color === 'amber' ? 'amber' : stat.color === 'blue' ? 'blue' : 'red'}-50 rounded-xl p-4 border border-${stat.color === 'emerald' ? 'emerald' : stat.color === 'amber' ? 'amber' : stat.color === 'blue' ? 'blue' : 'red'}-100`}>
            <span className="text-2xl font-bold text-slate-800">{stat.count}</span>
            <p className="text-xs font-medium text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All Appointments', icon: '📋' },
          { key: 'upcoming', label: 'Upcoming', icon: '📅' },
          { key: 'completed', label: 'Completed', icon: '✅' },
          { key: 'cancelled', label: 'Cancelled', icon: '❌' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              filter === tab.key
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-700 mb-2">No Appointments Found</h3>
          <p className="text-slate-500 text-sm mb-6">You don't have any {filter !== 'all' ? filter : ''} appointments yet.</p>
          <Link
            to="/patient/book-appointment"
            className="inline-flex items-center gap-2 bg-emerald-500 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Book Your First Appointment
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt, index) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-emerald-200 transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Doctor Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                    <Stethoscope className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 text-lg">
                      Dr. {apt.doctor?.user?.name || 'Doctor'}
                    </h3>
                    <p className="text-slate-500 text-sm">{apt.doctor?.specialty || 'Specialist'}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {getDateString(apt.appointment_date)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {getTimeString(apt.appointment_time)}
                      </span>
                    </div>
                    {apt.reason && (
                      <p className="text-sm text-slate-500 mt-2 truncate">
                        <span className="font-medium text-slate-600">Reason:</span> {apt.reason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                    {getTypeIcon(apt.type)}
                    {apt.type === 'telehealth' ? 'Telehealth' : 'In-Person'}
                  </span>

                  {/* View Button */}
                  <Link
                    to={`/patient/appointments/${apt.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors font-medium text-sm border border-emerald-200"
                  >
                    <Eye className="w-4 h-4" />
                    View
                    <ChevronRight className="w-4 h-4" />
                  </Link>

                  {/* Cancel Button */}
                  {apt.status === 'pending' || apt.status === 'confirmed' ? (
                    <button
                      onClick={() => handleCancel(apt.id)}
                      disabled={cancelling === apt.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium text-sm border border-red-200 disabled:opacity-50"
                    >
                      {cancelling === apt.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </>
                      )}
                    </button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
