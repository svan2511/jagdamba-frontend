import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Video, MapPin, Search, Loader2, AlertCircle, CheckCircle, XCircle, ChevronLeft, ChevronRight, Calendar, Eye } from 'lucide-react'
import { appointmentsApi } from '../../api/appointments'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import FullPageLoader from '../../components/FullPageLoader'

export default function DoctorAppointments() {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await appointmentsApi.getDoctorAppointments({
        status: filter !== 'all' ? filter : undefined,
        page: currentPage,
      })

      if (response.success && response.data) {
        const data = response.data.data || response.data
        setAppointments(data)

        const pagination = response.data
        if (pagination && pagination.total) {
          setTotalItems(pagination.total)
          setTotalPages(pagination.last_page || Math.ceil(pagination.total / 20))
        }
      } else {
        setError(response.message || 'Failed to load appointments')
      }
    } catch {
      setError('Failed to load appointments. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [filter, currentPage])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchAppointments()
  }, [filter, currentPage])

  useEffect(() => {
    if (debouncedSearch) {
      setSearching(true)
      const timer = setTimeout(() => setSearching(false), 300)
      return () => clearTimeout(timer)
    }
  }, [debouncedSearch])

  const handleConfirm = async (id: number) => {
    const result = await Swal.fire({
      title: 'Confirm Appointment',
      text: 'Are you sure you want to confirm this appointment?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, confirm',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      const response = await appointmentsApi.updateAppointmentStatus(id, 'confirmed')
      if (response.success) {
        toast.success('Appointment confirmed!')
        fetchAppointments()
      } else {
        toast.error(response.message || 'Failed to confirm')
      }
    } catch {
      toast.error('Failed to confirm appointment')
    }
  }

  const handleComplete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Mark as Completed',
      text: 'Mark this appointment as completed?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, complete',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      const response = await appointmentsApi.updateAppointmentStatus(id, 'completed')
      if (response.success) {
        toast.success('Appointment marked as completed!')
        fetchAppointments()
      } else {
        toast.error(response.message || 'Failed to complete')
      }
    } catch {
      toast.error('Failed to complete appointment')
    }
  }

  const handleCancel = async (id: number) => {
    const result = await Swal.fire({
      title: 'Cancel Appointment',
      text: 'Are you sure you want to cancel this appointment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, cancel',
      cancelButtonText: 'No',
    })

    if (!result.isConfirmed) return

    try {
      const response = await appointmentsApi.updateAppointmentStatus(id, 'cancelled')
      if (response.success) {
        toast.success('Appointment cancelled!')
        fetchAppointments()
      } else {
        toast.error(response.message || 'Failed to cancel')
      }
    } catch {
      toast.error('Failed to cancel appointment')
    }
  }

  const filteredAppointments = appointments.filter((apt: any) =>
    apt.patient?.user?.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    apt.reason?.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  // Loading state
  if (loading && appointments.length === 0) {
    return <FullPageLoader message="Loading appointments..." />
  }

  // Error state
  if (error && appointments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchAppointments} className="px-4 py-2 bg-[#d36135] text-white rounded-lg hover:bg-[#b5552d]">Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">Appointments</h1>
          <p className="text-gray-500 text-sm">Manage your appointments</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'confirmed', label: 'Confirmed' },
          { key: 'completed', label: 'Completed' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => { setFilter(f.key); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === f.key
                ? 'bg-[#3e5641] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Appointments Table */}
      {loading || searching ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#d36135] mx-auto mb-4" />
          <p className="text-gray-600">Searching...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Appointments Found</h3>
            <p className="text-gray-500">
              {filter !== 'all' ? 'No appointments match your filter.' : 'No appointments scheduled yet.'}
            </p>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Patient</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Date & Time</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Type</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Reason</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt: any, index: number) => (
                  <motion.tr
                    key={apt.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#d36135] flex items-center justify-center text-white font-medium">
                          {(apt.patient?.user?.name || 'P').charAt(0)}
                        </div>
                        <div>
                          <span className="font-medium text-gray-800 block">{apt.patient?.user?.name || 'Patient'}</span>
                          <span className="text-xs text-gray-500">{apt.patient?.user?.phone || 'No phone'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{apt.appointment_date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 mt-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{apt.appointment_time}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {apt.type === 'telehealth' ? (
                          <Video className="w-4 h-4 text-blue-500" />
                        ) : (
                          <MapPin className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-700 capitalize">
                          {apt.type === 'telehealth' ? 'Telehealth' : 'In-Person'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600">{apt.reason || 'General consultation'}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {/* View Button */}
                        <Link
                          to={`/doctor/appointments/${apt.id}`}
                          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5 text-slate-600" />
                        </Link>

                        {apt.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleConfirm(apt.id)}
                              className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                              title="Confirm"
                            >
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </button>
                            <button
                              onClick={() => handleCancel(apt.id)}
                              className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <XCircle className="w-5 h-5 text-red-600" />
                            </button>
                          </>
                        )}
                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => handleComplete(apt.id)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                            title="Mark Complete"
                          >
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalItems)} of {totalItems}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  currentPage === page
                    ? 'bg-[#3e5641] text-white'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}