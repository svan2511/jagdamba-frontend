import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {
  CalendarIcon,
  Users,
  Clock,
  ArrowRight,
  AlertCircle,
  Star,
  TrendingUp,
  Activity,
  CalendarCheck,
  Pill,
  UserCheck,
  Bell,
  ChevronRight,
} from 'lucide-react'
import { type RootState } from '../../store'
import { doctorsApi } from '../../api/doctors'
import { notificationsApi } from '../../api/notifications'
import FullPageLoader from '../../components/FullPageLoader'

interface Notification {
  id: number
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}

export default function DoctorDashboard() {
  const { user } = useSelector((state: RootState) => state.auth)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const [dashResponse, notifResponse] = await Promise.all([
        doctorsApi.getDoctorDashboard(),
        notificationsApi.getNotifications({ unread: true }),
      ])

      if (dashResponse.success && dashResponse.data) {
        setDashboardData(dashResponse.data)
      } else {
        setError(dashResponse.message || 'Failed to load dashboard')
      }

      if (notifResponse.success) {
        const data = notifResponse.data
        setNotifications(Array.isArray(data) ? data : [])
      }
    } catch {
      setError('Failed to load dashboard. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
  }

  const getDateString = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const notifDate = new Date(date)
    const diff = now.getTime() - notifDate.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  if (loading) {
    return <FullPageLoader message="Loading dashboard..." />
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Something went wrong</h3>
          <p className="text-slate-500 mb-4">{error}</p>
          <button onClick={fetchDashboardData} className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const doctor = dashboardData?.doctor
  const stats = dashboardData?.stats || {}
  const todayAppointments = dashboardData?.today_appointments || []
  const doctorName = user?.name?.split(' ').slice(0, 2).join(' ') || doctor?.user?.name?.split(' ').slice(0, 2).join(' ') || 'Doctor'
  const unreadCount = notifications.filter(n => !n.is_read).length

  const statsCards = [
    { label: "Today's Appointments", value: stats.today_appointments || 0, icon: CalendarCheck, color: 'emerald', bg: 'bg-emerald-50' },
    { label: 'Pending Approvals', value: stats.pending_appointments || 0, icon: Clock, color: 'amber', bg: 'bg-amber-50' },
    { label: 'This Month', value: stats.this_month_appointments || 0, icon: TrendingUp, color: 'blue', bg: 'bg-blue-50' },
    { label: 'Total Patients', value: stats.total_patients || 0, icon: Users, color: 'purple', bg: 'bg-purple-50' },
  ]

  const quickActions = [
    { label: 'View Appointments', to: '/doctor/appointments', icon: CalendarIcon, color: 'emerald' },
    { label: 'My Patients', to: '/doctor/patients', icon: UserCheck, color: 'blue' },
    { label: 'Write Prescription', to: '/doctor/prescription', icon: Pill, color: 'purple' },
    { label: 'My Schedule', to: '/doctor/schedule', icon: Clock, color: 'amber' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700'
      case 'pending': return 'bg-amber-100 text-amber-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      default: return 'bg-red-100 text-red-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-6 lg:p-8 shadow-xl"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent"></div>
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30 border-2 border-emerald-400/30">
              {user?.doctor?.image || doctor?.image ? (
                <img src={user?.doctor?.image || doctor?.image} alt={doctorName} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="text-2xl lg:text-3xl font-bold text-white">{getInitials(doctorName)}</span>
              )}
            </div>
            <div>
              <p className="text-emerald-400/80 text-sm font-medium mb-1">{getDateString(new Date().toISOString())}</p>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                {getGreeting()}, Dr. {doctorName}!
              </h2>
              <p className="text-slate-400">
                You have <span className="font-bold text-emerald-400">{stats.today_appointments || 0}</span> appointments today
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {stats.average_rating > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-white">{stats.average_rating}</span>
                <span className="text-slate-400 text-sm">rating</span>
              </div>
            )}
            <div className="px-4 py-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
              <span className="text-emerald-400 font-medium">{doctor?.specialty || 'General'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bg} rounded-2xl p-5 border border-slate-100 hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
              <div className={`w-10 h-10 bg-${stat.color === 'emerald' ? 'emerald-100' : stat.color === 'amber' ? 'amber-100' : stat.color === 'blue' ? 'blue-100' : 'purple-100'} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color === 'emerald' ? 'emerald-600' : stat.color === 'amber' ? 'amber-600' : stat.color === 'blue' ? 'blue-600' : 'purple-600'}`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
        >
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Today's Appointments</h3>
                <p className="text-xs text-slate-500">{todayAppointments.length} scheduled</p>
              </div>
            </div>
            <Link
              to="/doctor/appointments"
              className="flex items-center gap-1 text-emerald-600 font-medium text-sm hover:text-emerald-700 transition-colors"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-5">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="font-medium text-slate-700 mb-2">No Appointments Today</h4>
                <p className="text-slate-500 text-sm">Enjoy your free day or check your schedule.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayAppointments.slice(0, 5).map((apt: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:border-emerald-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20">
                        {getInitials(apt.patient?.user?.name || 'P')}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{apt.patient?.user?.name || 'Patient'}</h4>
                        <p className="text-sm text-slate-500">{apt.type || 'General Consultation'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-800">{apt.appointment_time}</p>
                      <span className={`text-xs px-2.5 py-1 rounded-full inline-block mt-1 font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions & Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className={`flex items-center gap-3 p-3 bg-${action.color === 'emerald' ? 'emerald' : action.color === 'blue' ? 'blue' : action.color === 'purple' ? 'purple' : 'amber'}-50 rounded-xl border border-${action.color === 'emerald' ? 'emerald' : action.color === 'blue' ? 'blue' : action.color === 'purple' ? 'purple' : 'amber'}-100 hover:shadow-sm transition-all group`}
                >
                  <div className={`w-10 h-10 bg-${action.color === 'emerald' ? 'emerald-100' : action.color === 'blue' ? 'blue-100' : action.color === 'purple' ? 'purple-100' : 'amber-100'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className={`w-5 h-5 text-${action.color === 'emerald' ? 'emerald-600' : action.color === 'blue' ? 'blue-600' : action.color === 'purple' ? 'purple-600' : 'amber-600'}`} />
                  </div>
                  <span className="font-medium text-slate-700 text-sm">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-slate-800">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">{unreadCount}</span>
                )}
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto p-3">
              {notifications.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-slate-400 text-sm">No new notifications</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.slice(0, 3).map((notif, index) => (
                    <div key={index} className="p-2 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-700 font-medium truncate">{notif.title}</p>
                      <p className="text-xs text-slate-500">{formatTimeAgo(notif.created_at)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-800">Your Profile</h3>
          </div>
          <Link
            to="/doctor/profile"
            className="flex items-center gap-2 bg-emerald-500 text-white font-medium px-4 py-2 rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Edit Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-2">Specialty</span>
            <span className="font-semibold text-slate-800">{doctor?.specialty || 'General'}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-2">Qualification</span>
            <span className="font-semibold text-slate-800">{doctor?.qualification || 'N/A'}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-2">Consultation Fee</span>
            <span className="font-semibold text-emerald-600 text-lg">${doctor?.consultation_fee || 0}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-2">Contact</span>
            <span className="font-semibold text-slate-800 text-sm truncate">{doctor?.user?.phone || doctor?.user?.email || 'N/A'}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
