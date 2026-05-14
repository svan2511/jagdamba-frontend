import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Stethoscope, CalendarCheck, Star, ArrowRight, AlertCircle, Activity, DollarSign, Clock, Calendar, CheckCircle, XCircle, CalendarClock, Clock4, AlertTriangle, Check } from 'lucide-react'
import { adminApi } from '../../api/admin'
import FullPageLoader from '../../components/FullPageLoader'

interface DashboardData {
  kpi?: {
    total_patients: number
    patient_change: number
    total_appointments: number
    appointment_change: number
    total_revenue: number
    revenue_change: number
    avg_daily_visits: number
    visit_change: number
  }
  stats?: {
    total_patients: number
    total_doctors: number
    total_appointments: number
    total_reviews: number
    today_appointments: number
    pending_appointments: number
    this_month_appointments: number
  }
  appointment_stats?: {
    pending: number
    confirmed: number
    completed: number
    cancelled: number
  }
  recent_appointments: any[]
  recent_reviews: any[]
  doctor_availability?: {
    today: {
      doctors_on_leave: number
      doctors_with_timing_changes: number
      available_doctors: number
    }
    doctors_on_leave_today: Array<{ id: number; name: string; reason: string | null; override_type: string }>
    doctors_timing_changed_today: Array<{ id: number; name: string; original_timing: string | null; new_timing: string; reason: string | null }>
    pending_schedule_requests: Array<any>
    pending_request_count: number
    all_doctors_status: Array<{ id: number; name: string; specialty: string; status: string; status_label: string; details: string | null }>
  }
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      // Fetch both dashboard and analytics data
      const [dashboardRes, analyticsRes] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getAnalytics('30days')
      ])

      if (dashboardRes.success) {
        const dashboardData = dashboardRes.data
        // Merge with analytics KPI if available
        if (analyticsRes.success && analyticsRes.data?.kpi) {
          dashboardData.kpi = analyticsRes.data.kpi
        }
        setData(dashboardData)
      } else {
        setError(dashboardRes.message || 'Failed to load dashboard')
      }
    } catch (err) {
      setError('Failed to load dashboard. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const formatNumber = (num: number) => num?.toLocaleString() || '0'

  const formatCurrency = (amount: number) => {
    if (!amount) return '₹0'
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`
    return `₹${amount}`
  }

  // Loading state
  if (loading) {
    return <FullPageLoader message="Loading dashboard..." />
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchDashboard} className="px-4 py-2 bg-[#d36135] text-white rounded-lg hover:bg-[#b5552d]">Try Again</button>
        </div>
      </div>
    )
  }

  const stats = data?.stats || { total_patients: 0, total_doctors: 0, today_appointments: 0, pending_appointments: 0, this_month_appointments: 0 }
  const appointmentStats = data?.appointment_stats || { pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
  const kpi = data?.kpi || { total_patients: 0, patient_change: 0, total_appointments: 0, appointment_change: 0, total_revenue: 0, revenue_change: 0, avg_daily_visits: 0, visit_change: 0 }
  const doctorAvailability = data?.doctor_availability

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back! Here's an overview of your hospital.</p>
        </div>
        <Link to="/admin/analytics" className="flex items-center gap-2 px-4 py-2.5 bg-[#3e5641] text-white rounded-lg font-medium hover:bg-[#2d4030] transition-colors">
          <Activity className="w-4 h-4" />
          View Analytics
        </Link>
      </div>

      {/* Stats Cards with Real Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: formatNumber(stats?.total_patients), change: kpi?.patient_change, icon: Users, color: 'bg-[#3e5641]', negative: (kpi?.patient_change || 0) < 0 },
          { label: 'Total Doctors', value: formatNumber(stats?.total_doctors), change: null, icon: Stethoscope, color: 'bg-[#d36135]', negative: false },
          { label: "Today's Appointments", value: formatNumber(stats?.today_appointments), change: null, icon: Calendar, color: 'bg-[#83bca9]', negative: false },
          { label: 'This Month', value: formatNumber(stats?.this_month_appointments), change: null, icon: Activity, color: 'bg-[#a24936]', negative: false },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              {stat.change !== null && (
                <span className={`text-sm font-medium ${stat.negative ? 'text-red-600' : 'text-green-600'}`}>
                  {stat.negative ? '' : '+'}{stat.change}%
                </span>
              )}
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
              <span className="text-sm text-gray-500 block">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue & Visits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#83bca9] flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            {(kpi?.revenue_change !== null && kpi?.revenue_change !== undefined) && (
              <span className={`text-sm font-medium ${(kpi?.revenue_change || 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {(kpi?.revenue_change || 0) > 0 ? '+' : ''}{kpi?.revenue_change}%
              </span>
            )}
          </div>
          <span className="text-2xl font-bold text-gray-800">{formatCurrency(kpi?.total_revenue || 0)}</span>
          <span className="text-sm text-gray-500 block">Estimated Revenue (30 days)</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#a24936] flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            {(kpi?.visit_change !== null && kpi?.visit_change !== undefined) && (
              <span className={`text-sm font-medium ${(kpi?.visit_change || 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {(kpi?.visit_change || 0) > 0 ? '+' : ''}{kpi?.visit_change}%
              </span>
            )}
          </div>
          <span className="text-2xl font-bold text-gray-800">{formatNumber(kpi?.avg_daily_visits || 0)}</span>
          <span className="text-sm text-gray-500 block">Avg. Daily Visits</span>
        </motion.div>
      </div>

      {/* Appointment Status Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Status Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-yellow-700">{appointmentStats.pending}</span>
            <span className="text-xs text-yellow-700 block">Pending</span>
            <span className="text-[10px] text-yellow-600 block">Waiting for doctor</span>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-blue-700">{appointmentStats.confirmed}</span>
            <span className="text-xs text-blue-700 block">Confirmed</span>
            <span className="text-[10px] text-blue-600 block">Accepted by doctor</span>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-700">{appointmentStats.completed}</span>
            <span className="text-xs text-green-700 block">Completed</span>
            <span className="text-[10px] text-green-600 block">Visit done</span>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-red-700">{appointmentStats.cancelled}</span>
            <span className="text-xs text-red-700 block">Cancelled</span>
            <span className="text-[10px] text-red-600 block">Not completed</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Recent Appointments</h3>
            <Link to="/admin/appointments" className="text-[#d36135] font-medium text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {data?.recent_appointments?.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No appointments yet</p>
            ) : (
              data?.recent_appointments?.slice(0, 5).map((apt: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#d36135] flex items-center justify-center text-white font-medium">
                      {(apt.patient?.user?.name || 'P').charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {apt.patient?.user?.name || 'Patient'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Dr. {apt.doctor?.user?.name || 'Doctor'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{apt.appointment_date}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Recent Reviews</h3>
            <Link to="/admin/reviews" className="text-[#d36135] font-medium text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {data?.recent_reviews?.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No reviews yet</p>
            ) : (
              data?.recent_reviews?.slice(0, 5).map((review: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#3e5641] flex items-center justify-center text-white font-medium">
                      {(review.patient?.user?.name || 'P').charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {review.patient?.user?.name || 'Patient'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Dr. {review.doctor?.user?.name || 'Doctor'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-gray-800">{review.rating}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Manage Doctors', to: '/admin/doctors', icon: Stethoscope, color: 'bg-[#3e5641]' },
          { label: 'Manage Patients', to: '/admin/patients', icon: Users, color: 'bg-[#d36135]' },
          { label: 'Appointments', to: '/admin/appointments', icon: CalendarCheck, color: 'bg-[#83bca9]' },
          { label: 'Gallery', to: '/admin/gallery', icon: Star, color: 'bg-[#a24936]' },
        ].map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:border-[#3e5641]/50 hover:shadow-md transition-all"
          >
            <div className={`w-12 h-12 rounded-lg ${link.color} flex items-center justify-center`}>
              <link.icon className="w-6 h-6 text-white" />
            </div>
            <span className="font-medium text-gray-700 text-center">{link.label}</span>
          </Link>
        ))}
      </motion.div>

      {/* Doctor Availability Today */}
      {doctorAvailability && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Doctor Availability Today</h3>
              <p className="text-sm text-gray-500">Track doctor schedules and leave status</p>
            </div>
            <Link
              to="/admin/schedule-requests"
              className="flex items-center gap-2 px-4 py-2 bg-[#3e5641] text-white rounded-lg font-medium text-sm hover:bg-[#2d4030] transition-colors"
            >
              <CalendarClock className="w-4 h-4" />
              View Schedule Requests
              {doctorAvailability.pending_request_count > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {doctorAvailability.pending_request_count}
                </span>
              )}
            </Link>
          </div>

          {/* Availability Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-green-700">{doctorAvailability.today.available_doctors}</span>
              <span className="text-sm text-green-700 block">Available Doctors</span>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-3xl font-bold text-orange-700">{doctorAvailability.today.doctors_on_leave}</span>
              <span className="text-sm text-orange-700 block">On Leave</span>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <Clock4 className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-blue-700">{doctorAvailability.today.doctors_with_timing_changes}</span>
              <span className="text-sm text-blue-700 block">Timing Changed</span>
            </div>
          </div>

          {/* Detailed Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Doctors on Leave */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Doctors on Leave Today
              </h4>
              {doctorAvailability.doctors_on_leave_today.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">No doctors on leave today</p>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {doctorAvailability.doctors_on_leave_today.map((doctor) => (
                    <div key={doctor.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                      <div>
                        <p className="font-medium text-gray-800">{doctor.name}</p>
                        {doctor.reason && <p className="text-xs text-gray-500 italic">{doctor.reason}</p>}
                      </div>
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                        {doctor.override_type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Doctors with Timing Changes */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Clock4 className="w-4 h-4 text-blue-500" />
                Doctors with Modified Hours
              </h4>
              {doctorAvailability.doctors_timing_changed_today.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">No timing changes today</p>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {doctorAvailability.doctors_timing_changed_today.map((doctor) => (
                    <div key={doctor.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div>
                        <p className="font-medium text-gray-800">{doctor.name}</p>
                        <p className="text-sm text-blue-600 font-medium">{doctor.new_timing}</p>
                        {doctor.reason && <p className="text-xs text-gray-500 italic">{doctor.reason}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* All Doctors Status */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-gray-500" />
              All Doctors Status Today
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[250px] overflow-y-auto">
              {doctorAvailability.all_doctors_status.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`p-3 rounded-lg border flex items-center gap-3 ${
                    doctor.status === 'available'
                      ? 'bg-green-50 border-green-100'
                      : doctor.status === 'timing_changed'
                      ? 'bg-blue-50 border-blue-100'
                      : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    doctor.status === 'available'
                      ? 'bg-green-500'
                      : doctor.status === 'timing_changed'
                      ? 'bg-blue-500'
                      : 'bg-gray-400'
                  }`}>
                    {doctor.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{doctor.name}</p>
                    <p className="text-xs text-gray-500 truncate">{doctor.specialty || 'General'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                    doctor.status === 'available'
                      ? 'bg-green-100 text-green-700'
                      : doctor.status === 'timing_changed'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {doctor.status_label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Schedule Requests */}
          {doctorAvailability.pending_schedule_requests.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                Pending Schedule Requests ({doctorAvailability.pending_request_count})
              </h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {doctorAvailability.pending_schedule_requests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-medium text-sm">
                        {request.doctor_name?.charAt(0) || 'D'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{request.doctor_name}</p>
                        <p className="text-xs text-gray-500">
                          {request.type_label} - {new Date(request.date).toLocaleDateString()}
                          {request.requested_time && ` (${request.requested_time})`}
                        </p>
                        {request.reason && <p className="text-xs text-gray-400 italic">"{request.reason}"</p>}
                      </div>
                    </div>
                    <Link
                      to="/admin/schedule-requests"
                      className="text-xs text-[#d36135] hover:underline whitespace-nowrap"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}