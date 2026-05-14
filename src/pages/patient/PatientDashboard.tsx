import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {
  Calendar,
  CalendarDays,
  Clock,
  FileText,
  Pill,
  User,
  ArrowRight,
  Activity,
  Heart,
  Bell,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  MapPin,
  Phone,
  ChevronRight,
} from 'lucide-react'
import { type RootState } from '../../store'
import { appointmentsApi, type Appointment } from '../../api/appointments'
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

export default function PatientDashboard() {
  const { user } = useSelector((state: RootState) => state.auth)

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  })

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)

      const [aptResponse, notifResponse] = await Promise.all([
        appointmentsApi.getMyAppointments(),
        notificationsApi.getNotifications({ unread: true }),
      ])

      if (aptResponse.success) {
        const allAppointments = aptResponse.data || []
        setAppointments(allAppointments)

        const upcoming = allAppointments.filter((a: Appointment) =>
          ['pending', 'confirmed'].includes(a.status) &&
          new Date(`${a.appointment_date} ${a.appointment_time}`) >= new Date()
        ).length

        const completed = allAppointments.filter((a: Appointment) => a.status === 'completed').length
        const cancelled = allAppointments.filter((a: Appointment) => ['cancelled', 'no-show'].includes(a.status)).length

        setStats({ upcoming, completed, cancelled })
      }

      if (notifResponse.success) {
        const notifData = notifResponse.data
        setNotifications(Array.isArray(notifData) ? notifData : [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const upcomingAppointments = appointments
    ?.filter((a: Appointment) =>
      ['pending', 'confirmed'].includes(a.status) &&
      new Date(`${a.appointment_date} ${a.appointment_time}`) >= new Date()
    )
    .slice(0, 3) || []

  const unreadNotifications = notifications?.filter(n => !n.is_read) || []

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getDateString = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const getTimeString = (time: string) => {
    const [hours, minutes] = time.split(':')
    const h = parseInt(hours)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour12 = h % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
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
    return <FullPageLoader message="Loading your dashboard..." />
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-6 lg:p-8 shadow-xl shadow-emerald-500/20"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Decorative Icons */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 hidden lg:block">
          <Heart className="w-32 h-32 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-emerald-200 text-sm font-medium mb-1">{getDateString(new Date().toISOString())}</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {getGreeting()}, {user?.name?.split(' ')[0] || 'Patient'}!
              </h2>
              <p className="text-emerald-100/90 text-base max-w-lg">
                {upcomingAppointments.length > 0
                  ? `You have ${upcomingAppointments.length} upcoming appointment${upcomingAppointments.length > 1 ? 's' : ''}. Stay healthy!`
                  : 'No upcoming appointments. Book one today to take care of your health.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/patient/book-appointment"
                className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-semibold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Appointment</span>
              </Link>
              <Link
                to="/patient/appointments"
                className="inline-flex items-center justify-center gap-2 bg-white/20 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <FileText className="w-5 h-5" />
                <span>View History</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Upcoming', value: stats.upcoming, icon: CalendarDays, color: 'emerald', bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'blue', bg: 'bg-blue-50', iconColor: 'text-blue-600' },
          { label: 'Cancelled', value: stats.cancelled, icon: AlertCircle, color: 'red', bg: 'bg-red-50', iconColor: 'text-red-500' },
          { label: 'Notifications', value: unreadNotifications.length, icon: Bell, color: 'amber', bg: 'bg-amber-50', iconColor: 'text-amber-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bg} rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
        >
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Upcoming Appointments</h3>
                <p className="text-xs text-slate-500">{upcomingAppointments.length} scheduled</p>
              </div>
            </div>
            <Link
              to="/patient/appointments"
              className="flex items-center gap-1 text-emerald-600 font-medium text-sm hover:text-emerald-700 transition-colors"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-5">
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CalendarDays className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="font-medium text-slate-700 mb-2">No Upcoming Appointments</h4>
                <p className="text-slate-500 text-sm mb-4">Schedule your next visit to stay on top of your health.</p>
                <Link
                  to="/patient/book-appointment"
                  className="inline-flex items-center gap-2 bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Book Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((apt, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:border-emerald-200 hover:shadow-sm transition-all"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20">
                      <Stethoscope className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800 truncate">
                        Dr. {apt.doctor?.user?.name || 'Doctor'}
                      </h4>
                      <p className="text-sm text-slate-500">{apt.doctor?.specialty || 'Specialist'}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {getDateString(apt.appointment_date)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          {getTimeString(apt.appointment_time)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium capitalize">
                        {apt.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
        >
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Notifications</h3>
                <p className="text-xs text-slate-500">{unreadNotifications.length} unread</p>
              </div>
            </div>
          </div>

          <div className="p-5 max-h-[400px] overflow-y-auto">
            {unreadNotifications.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm">All caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {unreadNotifications.slice(0, 5).map((notif, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gradient-to-r from-emerald-50/50 to-transparent rounded-xl border border-emerald-100/50 hover:border-emerald-200 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bell className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-800 text-sm">{notif.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="text-[10px] text-emerald-600 mt-1 font-medium">{formatTimeAgo(notif.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {unreadNotifications.length > 0 && (
            <div className="p-3 border-t border-slate-100 bg-slate-50/50">
              <Link
                to="/patient/notifications"
                className="flex items-center justify-center gap-1 text-emerald-600 font-medium text-sm hover:text-emerald-700 transition-colors"
              >
                View all notifications <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions & Health Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
        >
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Book Appointment', icon: Calendar, to: '/patient/book-appointment', color: 'emerald' },
              { label: 'Medical Records', icon: FileText, to: '/patient/medical-records', color: 'blue' },
              { label: 'Prescriptions', icon: Pill, to: '/patient/prescriptions', color: 'purple' },
              { label: 'My Profile', icon: User, to: '/patient/profile', color: 'slate' },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className={`flex items-center gap-3 p-4 bg-${action.color}-50 rounded-xl border border-${action.color}-100 hover:border-${action.color}-200 hover:shadow-sm transition-all group`}
              >
                <div className={`w-10 h-10 bg-${action.color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                </div>
                <span className="font-medium text-slate-700 text-sm">{action.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Health Tips / Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/20"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Health Tip of the Day
          </h3>
          <p className="text-emerald-100/90 text-sm leading-relaxed mb-6">
            Regular health check-ups can detect potential issues early. We recommend scheduling a comprehensive health screening at least once a year.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-emerald-100">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Main Road, City Center</span>
            </div>
            <div className="flex items-center gap-3 text-emerald-100">
              <Phone className="w-4 h-4" />
              <span className="text-sm">Emergency: 1024-XXX-XXXX</span>
            </div>
          </div>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-medium px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
          >
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
