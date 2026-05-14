import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Eye,
  Trash2,
  Clock,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react'
import { adminApi } from '../../api/admin'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import FullPageLoader from '../../components/FullPageLoader'

interface ScheduleRequest {
  id: number
  doctor_id: number
  request_type: string
  request_date: string
  old_start_time: string | null
  old_end_time: string | null
  requested_start_time: string | null
  requested_end_time: string | null
  reason: string | null
  status: string
  admin_notes: string | null
  approved_by: number | null
  approved_at: string | null
  created_at: string
  doctor: {
    id: number
    user: {
      id: number
      name: string
      email: string
    }
    specialty: string
  }
  approver: {
    id: number
    name: string
  } | null
}

interface Stats {
  pending: number
  approved: number
  rejected: number
  today: number
}

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

const requestTypes = [
  { value: '', label: 'All Types' },
  { value: 'leave', label: 'Leave' },
  { value: 'temporary_timing', label: 'Timing Change' },
  { value: 'unavailable', label: 'Unavailable' },
  { value: 'break_change', label: 'Break Change' },
]

const statusFilters = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

const getTypeLabel = (type: string) => {
  return requestTypes.find(t => t.value === type)?.label || type
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'leave': return 'bg-purple-100 text-purple-700'
    case 'temporary_timing': return 'bg-blue-100 text-blue-700'
    case 'unavailable': return 'bg-red-100 text-red-700'
    case 'break_change': return 'bg-amber-100 text-amber-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return { class: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Pending' }
    case 'approved':
      return { class: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Approved' }
    case 'rejected':
      return { class: 'bg-red-100 text-red-700', icon: XCircle, label: 'Rejected' }
    default:
      return { class: 'bg-gray-100 text-gray-700', icon: AlertCircle, label: status }
  }
}

export default function ScheduleRequests() {
  const [requests, setRequests] = useState<ScheduleRequest[]>([])
  const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, rejected: 0, today: 0 })
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [meta, setMeta] = useState<PaginationMeta>({ current_page: 1, last_page: 1, per_page: 15, total: 0 })

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [doctorFilter, setDoctorFilter] = useState<number | ''>('')
  const [currentPage, setCurrentPage] = useState(1)

  // Modal states
  const [viewModal, setViewModal] = useState(false)
  const [approveModal, setApproveModal] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<ScheduleRequest | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await adminApi.getScheduleRequests({
        page: currentPage,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        request_type: typeFilter || undefined,
        doctor_id: doctorFilter || undefined,
        per_page: 15,
      })

      if (response.success) {
        setRequests(response.data || [])
        if (response.meta) {
          setMeta(response.meta)
        }
        if (response.stats) {
          setStats({
            pending: response.stats.pending || 0,
            approved: response.stats.approved || 0,
            rejected: response.stats.rejected || 0,
            today: response.stats.today || 0,
          })
        }
      } else {
        setError(response.message || 'Failed to load schedule requests')
      }
    } catch (err) {
      setError('Failed to load schedule requests. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [currentPage, debouncedSearch, statusFilter, typeFilter, doctorFilter])

  const fetchDoctors = useCallback(async () => {
    try {
      const response = await adminApi.getScheduleRequestDoctors()
      if (response.success) {
        setDoctors(response.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch doctors', err)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= meta.last_page) {
      setCurrentPage(page)
    }
  }

  const handleView = (request: ScheduleRequest) => {
    setSelectedRequest(request)
    setViewModal(true)
  }

  const handleApprove = (request: ScheduleRequest) => {
    setSelectedRequest(request)
    setAdminNotes('')
    setApproveModal(true)
  }

  const handleReject = (request: ScheduleRequest) => {
    setSelectedRequest(request)
    setAdminNotes('')
    setRejectModal(true)
  }

  const confirmApprove = async () => {
    if (!selectedRequest) return
    setActionLoading(true)
    try {
      const response = await adminApi.approveScheduleRequest(selectedRequest.id, adminNotes || undefined)
      if (response.success) {
        toast.success('Request approved successfully')
        setApproveModal(false)
        fetchRequests()
      } else {
        toast.error(response.message || 'Failed to approve request')
      }
    } catch (err) {
      toast.error('Failed to approve request')
    } finally {
      setActionLoading(false)
    }
  }

  const confirmReject = async () => {
    if (!selectedRequest) return
    setActionLoading(true)
    try {
      const response = await adminApi.rejectScheduleRequest(selectedRequest.id, adminNotes || undefined)
      if (response.success) {
        toast.success('Request rejected')
        setRejectModal(false)
        fetchRequests()
      } else {
        toast.error(response.message || 'Failed to reject request')
      }
    } catch (err) {
      toast.error('Failed to reject request')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (request: ScheduleRequest) => {
    const result = await Swal.fire({
      title: 'Delete Request',
      html: 'Are you sure you want to delete this schedule request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      const response = await adminApi.deleteScheduleRequest(request.id)
      if (response.success) {
        toast.success('Request deleted successfully')
        fetchRequests()
      } else {
        toast.error(response.message || 'Failed to delete request')
      }
    } catch (err) {
      toast.error('Failed to delete request')
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (time: string | null) => {
    if (!time) return '-'
    return time.substring(0, 5)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">Schedule Requests</h1>
          <p className="text-gray-500 text-sm">Review and manage doctor schedule requests</p>
        </div>
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#3e5641] text-white rounded-lg font-medium hover:bg-[#2d4030] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.approved}</p>
              <p className="text-xs text-gray-500">Approved</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.rejected}</p>
              <p className="text-xs text-gray-500">Rejected</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.today}</p>
              <p className="text-xs text-gray-500">Today's</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
            >
              {statusFilters.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
            >
              {requestTypes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <select
              value={doctorFilter}
              onChange={(e) => { setDoctorFilter(e.target.value === '' ? '' : Number(e.target.value)); setCurrentPage(1); }}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
            >
              <option value="">All Doctors</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.user?.name} - {d.specialty}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Requests Table */}
      {loading ? (
        <FullPageLoader message="Loading requests..." />
      ) : error ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={fetchRequests} className="px-4 py-2 bg-[#d36135] text-white rounded-lg hover:bg-[#b5552d]">
              Try Again
            </button>
          </div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Requests Found</h3>
            <p className="text-gray-600 mb-4">
              {debouncedSearch || statusFilter || typeFilter || doctorFilter
                ? 'No requests match your filters. Try adjusting your search criteria.'
                : 'No schedule requests have been submitted yet.'}
            </p>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Current</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Requested</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request, index) => {
                  const statusBadge = getStatusBadge(request.status)
                  return (
                    <motion.tr
                      key={request.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-gray-50 hover:bg-gray-50/50"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#3e5641]/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-[#3e5641]" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{request.doctor?.user?.name || 'Doctor'}</p>
                            <p className="text-xs text-gray-500">{request.doctor?.specialty || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(request.request_type)}`}>
                          {getTypeLabel(request.request_type)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-gray-800">{formatDate(request.request_date)}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-gray-600">
                          {formatTime(request.old_start_time)} - {formatTime(request.old_end_time)}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-gray-600">
                          {formatTime(request.requested_start_time)} - {formatTime(request.requested_end_time)}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.class} flex items-center gap-1 w-fit`}>
                          <statusBadge.icon className="w-3 h-3" />
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(request)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(request)}
                                className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <Check className="w-4 h-4 text-green-600" />
                              </button>
                              <button
                                onClick={() => handleReject(request)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <X className="w-4 h-4 text-red-600" />
                              </button>
                              <button
                                onClick={() => handleDelete(request)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Pagination */}
      {meta.total > 0 && requests.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing {((meta.current_page - 1) * meta.per_page) + 1} to {Math.min(meta.current_page * meta.per_page, meta.total)} of {meta.total} requests
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(meta.current_page - 1)}
              disabled={meta.current_page === 1}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            {Array.from({ length: Math.min(meta.last_page, 5) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-lg text-sm ${meta.current_page === page ? 'bg-[#3e5641] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(meta.current_page + 1)}
              disabled={meta.current_page === meta.last_page}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* View Modal */}
      <AnimatePresence>
        {viewModal && selectedRequest && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setViewModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Request Details</h3>
                  <button onClick={() => setViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-[#3e5641]/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-[#3e5641]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{selectedRequest.doctor?.user?.name || 'Doctor'}</p>
                      <p className="text-sm text-gray-500">{selectedRequest.doctor?.specialty || ''}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Request Type</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedRequest.request_type)}`}>
                        {getTypeLabel(selectedRequest.request_type)}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedRequest.status).class}`}>
                        {getStatusBadge(selectedRequest.status).label}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Request Date</p>
                    <p className="text-sm font-medium text-gray-800">{formatDate(selectedRequest.request_date)}</p>
                  </div>

                  {(selectedRequest.old_start_time || selectedRequest.old_end_time) && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Current Schedule</p>
                      <p className="text-sm text-gray-600">
                        {formatTime(selectedRequest.old_start_time)} - {formatTime(selectedRequest.old_end_time)}
                      </p>
                    </div>
                  )}

                  {(selectedRequest.requested_start_time || selectedRequest.requested_end_time) && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Requested Schedule</p>
                      <p className="text-sm text-gray-600">
                        {formatTime(selectedRequest.requested_start_time)} - {formatTime(selectedRequest.requested_end_time)}
                      </p>
                    </div>
                  )}

                  {selectedRequest.reason && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Reason</p>
                      <p className="text-sm text-gray-600">{selectedRequest.reason}</p>
                    </div>
                  )}

                  {selectedRequest.admin_notes && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Admin Notes</p>
                      <p className="text-sm text-gray-600">{selectedRequest.admin_notes}</p>
                    </div>
                  )}

                  {selectedRequest.approved_at && selectedRequest.approver && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Processed By</p>
                      <p className="text-sm text-gray-600">
                        {selectedRequest.approver.name} on {new Date(selectedRequest.approved_at).toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-gray-400">
                    Submitted: {new Date(selectedRequest.created_at).toLocaleString()}
                  </div>
                </div>

                {selectedRequest.status === 'pending' && (
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => { setViewModal(false); handleApprove(selectedRequest); }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => { setViewModal(false); handleReject(selectedRequest); }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Approve Modal */}
      <AnimatePresence>
        {approveModal && selectedRequest && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setApproveModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Approve Request</h3>
                  <button onClick={() => setApproveModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Approve <strong>{selectedRequest.doctor?.user?.name}</strong>'s request for {getTypeLabel(selectedRequest.request_type).toLowerCase()} on <strong>{formatDate(selectedRequest.request_date)}</strong>?
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    This will update the doctor's schedule accordingly.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes (optional)</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add any notes about this approval..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641] resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setApproveModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmApprove}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Approve
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModal && selectedRequest && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setRejectModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Reject Request</h3>
                  <button onClick={() => setRejectModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="mb-4 p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600">
                    Reject <strong>{selectedRequest.doctor?.user?.name}</strong>'s request for {getTypeLabel(selectedRequest.request_type).toLowerCase()} on <strong>{formatDate(selectedRequest.request_date)}</strong>?
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    The doctor's current schedule will remain unchanged.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes (optional)</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add a reason for rejection..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641] resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setRejectModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmReject}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    Reject
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
