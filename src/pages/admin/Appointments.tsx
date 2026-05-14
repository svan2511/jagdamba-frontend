import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Calendar, Clock, Stethoscope, Phone, Eye, ChevronLeft, ChevronRight, CalendarCheck, Hourglass, XCircle, CheckCircle } from 'lucide-react'
import { adminApi } from '../../api/admin'
import FullPageLoader from '../../components/FullPageLoader'

const statuses = ['All Status', 'Confirmed', 'Pending', 'Cancelled', 'Completed']

interface Appointment {
  id: number
  patient_name: string
  patient_phone: string
  doctor_name: string
  doctor_specialty: string
  appointment_date: string
  appointment_time: string
  type: string
  status: string
  notes: string
}

export default function Appointments() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [selectedDate, setSelectedDate] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [appointmentStats, setAppointmentStats] = useState({ pending: 0, confirmed: 0, cancelled: 0, completed: 0 })
  const itemsPerPage = 10

  // Fetch appointment stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await adminApi.getDashboardStats()
      if (response.success && response.data?.appointment_stats) {
        setAppointmentStats(response.data.appointment_stats)
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await adminApi.getAllAppointments({
        page: currentPage,
        search: debouncedSearch || undefined,
        status: selectedStatus !== 'All Status' ? selectedStatus.toLowerCase() : undefined,
        appointment_date: selectedDate || undefined,
      })

      if (response.success && response.data) {
        const appointmentsData = response.data.data || response.data
        const transformed = appointmentsData.map((apt: any) => ({
          id: apt.id,
          patient_name: apt.patient?.user?.name || 'Patient',
          patient_phone: apt.patient?.user?.phone || '',
          doctor_name: apt.doctor?.user?.name || 'Doctor',
          doctor_specialty: apt.doctor?.specialty || '',
          appointment_date: apt.appointment_date || '',
          appointment_time: apt.appointment_time || '',
          type: apt.type || 'General',
          status: apt.status || 'Pending',
          notes: apt.notes || '',
        }))
        setAppointments(transformed)

        const paginationData = response.data
        if (paginationData && typeof paginationData === 'object') {
          setTotalItems(paginationData.total || appointmentsData.length)
          setTotalPages(paginationData.last_page || Math.ceil((paginationData.total || appointmentsData.length) / itemsPerPage) || 1)
        } else {
          setTotalItems(appointmentsData.length)
          setTotalPages(Math.ceil(appointmentsData.length / itemsPerPage) || 1)
        }
      } else {
        setAppointments([])
        setError(response.message || 'Failed to load appointments')
      }
    } catch {
      setAppointments([])
      setError('Failed to load appointments. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [currentPage, debouncedSearch, selectedStatus, selectedDate])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch when filters or page changes
  useEffect(() => {
    fetchAppointments()
  }, [currentPage, debouncedSearch, selectedStatus, selectedDate])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-700'
      case 'Pending': return 'bg-yellow-100 text-yellow-700'
      case 'Cancelled': return 'bg-red-100 text-red-700'
      case 'Completed': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed': return <CheckCircle className="w-4 h-4" />
      case 'Pending': return <Hourglass className="w-4 h-4" />
      case 'Cancelled': return <XCircle className="w-4 h-4" />
      case 'Completed': return <CalendarCheck className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">Appointments Management</h1>
          <p className="text-gray-500 text-sm">View all hospital appointments (Read-only)</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Appointments', value: totalItems.toLocaleString() || '0', icon: Calendar, color: 'bg-[#3e5641]' },
          { label: 'Pending', value: appointmentStats.pending.toString() || '0', icon: Hourglass, color: 'bg-yellow-500' },
          { label: 'Confirmed', value: appointmentStats.confirmed.toString() || '0', icon: CheckCircle, color: 'bg-green-500' },
          { label: 'Cancelled', value: appointmentStats.cancelled.toString() || '0', icon: XCircle, color: 'bg-red-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                <span className="text-sm text-gray-500 block">{stat.label}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by patient name or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]" />
          </div>
          <div className="flex gap-3">
            <input type="date" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setCurrentPage(1); }} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]" />
            <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]">
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Appointments Table */}
      {loading ? (
        <FullPageLoader message="Loading appointments..." />
      ) : error ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={fetchAppointments} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              Try Again
            </button>
          </div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Appointments Found</h3>
            <p className="text-gray-600 mb-4">
              {debouncedSearch || selectedStatus !== 'All Status' || selectedDate
                ? 'No appointments match your search criteria. Try adjusting your filters.'
                : 'No appointments have been booked yet.'}
            </p>
            {(debouncedSearch || selectedStatus !== 'All Status' || selectedDate) && (
              <button onClick={() => { setSearchTerm(''); setDebouncedSearch(''); setSelectedStatus('All Status'); setSelectedDate(''); setCurrentPage(1); }} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt, index) => (
                  <motion.tr key={apt.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#3e5641]/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-[#3e5641]">{apt.patient_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-800 block">{apt.patient_name}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {apt.patient_phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-[#d36135]" />
                        <div>
                          <span className="font-medium text-gray-800 block">{apt.doctor_name}</span>
                          <span className="text-xs text-gray-500">{apt.doctor_specialty}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <span className="flex items-center gap-1 text-gray-600"><Calendar className="w-3 h-3" /> {apt.appointment_date}</span>
                        <span className="flex items-center gap-1 text-gray-500"><Clock className="w-3 h-3" /> {apt.appointment_time}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{apt.type}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(apt.status)}`}>
                        {getStatusIcon(apt.status)} {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/admin/appointments/view/${apt.id}`)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Eye className="w-4 h-4 text-gray-500" /></button>
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
      {totalItems > 0 && appointments.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} appointments</span>
          <div className="flex items-center gap-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Previous</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-2 rounded-lg text-sm ${currentPage === page ? 'bg-[#3e5641] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>{page}</button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">Next <ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  )
}