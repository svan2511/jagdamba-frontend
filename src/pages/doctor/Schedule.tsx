import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  Check,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  CalendarClock,
  Coffee,
  Clock4,
  CalendarX,
  AlertTriangle,
  Eye,
  Trash2,
  Loader2,
} from 'lucide-react'
import { doctorsApi } from '../../api/doctors'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import FullPageLoader from '../../components/FullPageLoader'

interface ScheduleData {
  base_schedules?: BaseSchedule[]
  overrides?: ScheduleOverride[]
  is_available?: boolean
  consultation_fee?: number
  available_days?: string[]
  start_time?: string
  end_time?: string
}

interface BaseSchedule {
  id: number
  day_of_week: string
  start_time: string
  end_time: string
  slot_duration: number
  break_start: string | null
  break_end: string | null
  is_active: boolean
}

interface ScheduleOverride {
  id: number
  date: string
  override_type: string
  start_time: string | null
  end_time: string | null
  reason: string | null
  is_active: boolean
}

interface ScheduleRequest {
  id: number
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
  approver?: { name: string }
}

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const requestTypes = [
  { value: 'leave', label: 'Leave Request', icon: CalendarX, color: 'bg-red-500' },
  { value: 'temporary_timing', label: 'Timing Change', icon: Clock4, color: 'bg-blue-500' },
  { value: 'unavailable', label: 'Unavailable', icon: AlertTriangle, color: 'bg-orange-500' },
  { value: 'break_change', label: 'Break Change', icon: Coffee, color: 'bg-purple-500' },
]

const statusStyles: Record<string, { bg: string; text: string; icon: typeof Clock }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
  approved: { bg: 'bg-green-100', text: 'text-green-700', icon: Check },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: X },
}

export default function Schedule() {
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'create'>('overview')
  const [schedule, setSchedule] = useState<ScheduleData | null>(null)
  const [requests, setRequests] = useState<ScheduleRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [requestFilter, setRequestFilter] = useState<string>('all')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<ScheduleRequest | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(0)

  // Form state
  const [formData, setFormData] = useState({
    request_type: 'leave' as 'leave' | 'temporary_timing' | 'unavailable' | 'break_change',
    request_date: '',
    old_start_time: '',
    old_end_time: '',
    requested_start_time: '',
    requested_end_time: '',
    reason: '',
  })

  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true)
      const response = await doctorsApi.getMySchedule()
      if (response.success && response.data) {
        setSchedule(response.data)
      }
    } catch {
      toast.error('Failed to load schedule')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRequests = useCallback(async () => {
    try {
      const params: any = {}
      if (requestFilter !== 'all') {
        params.status = requestFilter
      }
      params.per_page = 50
      const response = await doctorsApi.getMyScheduleRequests(params)
      if (response.success) {
        setRequests(response.data || [])
      }
    } catch {
      toast.error('Failed to load requests')
    }
  }, [requestFilter])

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchSchedule()
    } else if (activeTab === 'requests') {
      fetchRequests()
    }
  }, [activeTab, fetchSchedule, fetchRequests])

  const getWeekDates = (weekOffset: number) => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7)
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return date
    })
  }

  const weekDates = getWeekDates(currentWeek)

  const getBaseScheduleForDay = (dayOfWeek: string) => {
    return schedule?.base_schedules?.find(
      (s) => s.day_of_week.toLowerCase() === dayOfWeek.toLowerCase() && s.is_active
    )
  }

  const getOverrideForDate = (date: string) => {
    return schedule?.overrides?.find((o) => o.date === date && o.is_active)
  }

  const handleSubmitRequest = async () => {
    // Validation
    if (!formData.request_date) {
      toast.error('Please select a date')
      return
    }

    const today = new Date().toISOString().split('T')[0]
    if (formData.request_date < today) {
      toast.error('Cannot select past dates')
      return
    }

    if (['temporary_timing', 'break_change'].includes(formData.request_type)) {
      if (!formData.requested_start_time || !formData.requested_end_time) {
        toast.error('Please fill in the requested timing')
        return
      }
      if (formData.requested_start_time >= formData.requested_end_time) {
        toast.error('End time must be after start time')
        return
      }
    }

    try {
      setSubmitting(true)
      const payload: any = {
        request_type: formData.request_type,
        request_date: formData.request_date,
        reason: formData.reason || null,
      }

      if (formData.requested_start_time) {
        payload.requested_start_time = formData.requested_start_time
      }
      if (formData.requested_end_time) {
        payload.requested_end_time = formData.requested_end_time
      }
      if (formData.old_start_time) {
        payload.old_start_time = formData.old_start_time
      }
      if (formData.old_end_time) {
        payload.old_end_time = formData.old_end_time
      }

      const response = await doctorsApi.createScheduleRequest(payload)
      if (response.success) {
        toast.success(response.message || 'Request submitted successfully')
        setActiveTab('requests')
        setFormData({
          request_type: 'leave',
          request_date: '',
          old_start_time: '',
          old_end_time: '',
          requested_start_time: '',
          requested_end_time: '',
          reason: '',
        })
        setActiveTab('requests')
        fetchRequests()
      } else {
        toast.error(response.message || 'Failed to submit request')
      }
    } catch {
      toast.error('Failed to submit request')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancelRequest = async (id: number) => {
    const result = await Swal.fire({
      title: 'Cancel Request',
      text: 'Are you sure you want to cancel this request?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d36135',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, cancel',
      cancelButtonText: 'No',
    })

    if (!result.isConfirmed) return

    try {
      const response = await doctorsApi.cancelScheduleRequest(id)
      if (response.success) {
        toast.success('Request cancelled successfully')
        fetchRequests()
      } else {
        toast.error(response.message || 'Failed to cancel request')
      }
    } catch {
      toast.error('Failed to cancel request')
    }
  }

  const openDetailModal = (request: ScheduleRequest) => {
    setSelectedRequest(request)
    setShowDetailModal(true)
  }

  if (loading && !schedule) {
    return <FullPageLoader message="Loading schedule..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">Schedule Management</h1>
          <p className="text-gray-500 text-sm">Manage your availability and request changes</p>
        </div>
        <button
          onClick={() => setActiveTab('create')}
          className="flex items-center gap-2 px-4 py-2 bg-[#d36135] text-white rounded-lg font-medium hover:bg-[#b5552d] transition-colors"
        >
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
        {[
          { key: 'overview', label: 'Schedule Overview', icon: Calendar },
          { key: 'requests', label: 'My Requests', icon: CalendarClock, badge: requests.filter(r => r.status === 'pending').length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'overview' | 'requests')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === tab.key
                ? 'bg-white text-[#273f2b] shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.badge ? (
              <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">{tab.badge}</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${schedule?.is_available ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="font-semibold text-gray-800">
                    {schedule?.is_available ? 'Available for Appointments' : 'Not Available'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {schedule?.base_schedules?.length || 0} active schedule days
                </div>
              </div>
            </div>

            {/* Week Navigation */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentWeek(currentWeek - 1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <span className="font-semibold text-gray-800">
                  {weekDates[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={() => setCurrentWeek(currentWeek + 1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Weekly Grid */}
            <div className="grid grid-cols-7 gap-3">
              {weekDays.map((day, index) => {
                const date = weekDates[index]
                const dateStr = date.toISOString().split('T')[0]
                const baseSchedule = getBaseScheduleForDay(day)
                const override = getOverrideForDate(dateStr)
                const isToday = date.toDateString() === new Date().toDateString()
                const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))

                return (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-xl border-2 p-4 min-h-[180px] ${
                      isToday ? 'border-[#d36135]' : baseSchedule ? 'border-gray-100' : 'border-gray-50'
                    } ${isPast ? 'opacity-60' : ''}`}
                  >
                    <div className={`text-center mb-3 pb-3 border-b ${baseSchedule ? 'border-gray-100' : 'border-gray-50'}`}>
                      <span className="text-xs text-gray-500 block">{shortDays[index]}</span>
                      <span className={`text-xl font-bold ${isToday ? 'text-[#d36135]' : 'text-gray-800'}`}>
                        {date.getDate()}
                      </span>
                    </div>

                    {override ? (
                      <div className="space-y-2">
                        <div className={`px-2 py-1.5 rounded-lg text-xs font-medium text-white ${statusStyles[override.override_type]?.bg || 'bg-red-500'}`}>
                          {override.override_type === 'leave' ? 'Leave' :
                           override.override_type === 'unavailable' ? 'Unavailable' :
                           override.override_type === 'custom_timing' ? 'Custom Hours' : 'Holiday'}
                        </div>
                        {override.start_time && override.end_time && (
                          <p className="text-xs text-gray-500">{override.start_time} - {override.end_time}</p>
                        )}
                        {override.reason && <p className="text-xs text-gray-400 italic">{override.reason}</p>}
                      </div>
                    ) : baseSchedule ? (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-gray-700">
                          {baseSchedule.start_time} - {baseSchedule.end_time}
                        </div>
                        {baseSchedule.break_start && baseSchedule.break_end && (
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <Coffee className="w-3 h-3" />
                            Break: {baseSchedule.break_start} - {baseSchedule.break_end}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <span className="text-xs text-gray-400">Off Day</span>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Schedule Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#3e5641] flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gray-800">{schedule?.base_schedules?.length || 0}</span>
                    <span className="text-sm text-gray-500 block">Working Days</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#d36135] flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gray-800">
                      {schedule?.base_schedules?.reduce((acc, s) => acc + (parseInt(s.end_time.split(':')[0]) - parseInt(s.start_time.split(':')[0])), 0) || 0}h
                    </span>
                    <span className="text-sm text-gray-500 block">Weekly Hours</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#83bca9] flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gray-800">
                      {schedule?.base_schedules?.filter(s => s.break_start).length || 0}
                    </span>
                    <span className="text-sm text-gray-500 block">With Breaks</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'requests' && (
          <motion.div
            key="requests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gray-800">{requests.filter(r => r.status === 'pending').length}</span>
                    <span className="text-sm text-gray-500 block">Pending</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gray-800">{requests.filter(r => r.status === 'approved').length}</span>
                    <span className="text-sm text-gray-500 block">Approved</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                    <X className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gray-800">{requests.filter(r => r.status === 'rejected').length}</span>
                    <span className="text-sm text-gray-500 block">Rejected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setRequestFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    requestFilter === filter
                      ? 'bg-[#3e5641] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            {/* Requests List */}
            {requests.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
                <div className="text-center">
                  <CalendarClock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Requests Found</h3>
                  <p className="text-gray-500">You haven't submitted any schedule requests yet.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => {
                  const typeInfo = requestTypes.find(t => t.value === request.request_type) || requestTypes[0]

                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg ${typeInfo.color} flex items-center justify-center`}>
                            <typeInfo.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{typeInfo.label}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(request.request_date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                            {request.requested_start_time && request.requested_end_time && (
                              <p className="text-sm text-gray-600 mt-1">
                                Requested: {request.requested_start_time} - {request.requested_end_time}
                              </p>
                            )}
                            {request.reason && (
                              <p className="text-sm text-gray-400 mt-1 italic">"{request.reason}"</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[request.status]?.bg} ${statusStyles[request.status]?.text}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openDetailModal(request)}
                              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {request.status === 'pending' && (
                              <button
                                onClick={() => handleCancelRequest(request.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                title="Cancel Request"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {request.admin_notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Admin Note:</span> {request.admin_notes}
                          </p>
                        </div>
                      )}

                      {request.approved_at && (
                        <p className="text-xs text-gray-400 mt-3">
                          Processed on {new Date(request.approved_at).toLocaleString()}
                          {request.approver && ` by ${request.approver.name}`}
                        </p>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Submit Schedule Request</h3>
              <p className="text-sm text-gray-500 mb-6">
                All requests will be reviewed by the admin before implementation.
                You will be notified once processed.
              </p>

              {/* Request Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Request Type</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {requestTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, request_type: type.value as any })}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        formData.request_type === type.value
                          ? 'border-[#3e5641] bg-[#3e5641]/5'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg ${type.color} flex items-center justify-center`}>
                        <type.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <span className="font-medium text-gray-800">{type.label}</span>
                        <p className="text-xs text-gray-500">
                          {type.value === 'leave' && 'Request time off'}
                          {type.value === 'temporary_timing' && 'Change working hours'}
                          {type.value === 'unavailable' && 'Mark as unavailable'}
                          {type.value === 'break_change' && 'Modify break times'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.request_date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, request_date: e.target.value })}
                  className="w-full md:w-64 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                />
              </div>

              {/* Timing Fields */}
              {['temporary_timing', 'break_change'].includes(formData.request_type) && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requested Timing</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={formData.requested_start_time}
                        onChange={(e) => setFormData({ ...formData, requested_start_time: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Time</label>
                      <input
                        type="time"
                        value={formData.requested_end_time}
                        onChange={(e) => setFormData({ ...formData, requested_end_time: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Reason */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Provide a reason for your request..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveTab('overview')}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRequest}
                  disabled={submitting || !formData.request_date}
                  className="flex-1 px-4 py-3 bg-[#d36135] text-white rounded-lg font-medium hover:bg-[#b5552d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Request Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Type</span>
                <span className="font-medium text-gray-800">
                  {requestTypes.find(t => t.value === selectedRequest.request_type)?.label || selectedRequest.request_type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Date</span>
                <span className="font-medium text-gray-800">
                  {new Date(selectedRequest.request_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              {selectedRequest.old_start_time && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Original Timing</span>
                  <span className="font-medium text-gray-800">
                    {selectedRequest.old_start_time} - {selectedRequest.old_end_time}
                  </span>
                </div>
              )}
              {selectedRequest.requested_start_time && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Requested Timing</span>
                  <span className="font-medium text-gray-800">
                    {selectedRequest.requested_start_time} - {selectedRequest.requested_end_time}
                  </span>
                </div>
              )}
              {selectedRequest.reason && (
                <div className="flex items-start justify-between">
                  <span className="text-sm text-gray-500">Reason</span>
                  <span className="font-medium text-gray-800 text-right max-w-[200px]">
                    {selectedRequest.reason}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[selectedRequest.status]?.bg} ${statusStyles[selectedRequest.status]?.text}`}>
                  {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                </span>
              </div>
              {selectedRequest.admin_notes && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Admin Note</p>
                  <p className="text-sm text-gray-700">{selectedRequest.admin_notes}</p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Submitted</span>
                <span className="text-sm text-gray-600">
                  {new Date(selectedRequest.created_at).toLocaleString()}
                </span>
              </div>
              {selectedRequest.approved_at && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Processed</span>
                  <span className="text-sm text-gray-600">
                    {new Date(selectedRequest.approved_at).toLocaleString()}
                    {selectedRequest.approver && ` by ${selectedRequest.approver.name}`}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowDetailModal(false)}
              className="w-full mt-6 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}