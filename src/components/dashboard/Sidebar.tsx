import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  LayoutDashboard,
  CalendarIcon,
  User,
  Folder,
  CalendarDays,
  LogOut,
  Hospital,
  Pill,
  FileText,
  Bell,
  MessageSquare,
  X,
} from 'lucide-react'
import { type RootState } from '../../store'
import { notificationsApi } from '../../api/notifications'
import { useState, useEffect } from 'react'

interface SidebarProps {
  role: 'patient' | 'doctor'
  isOpen: boolean
  onClose: () => void
}

interface Notification {
  id: number
  title: string
  message: string
  type: string
  is_read: boolean
}

const patientLinks = [
  { to: '/patient/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patient/appointments', icon: CalendarIcon, label: 'Appointments' },
  { to: '/patient/medical-records', icon: Folder, label: 'Medical Records' },
  { to: '/patient/prescriptions', icon: Pill, label: 'Prescriptions' },
  { to: '/patient/reviews', icon: MessageSquare, label: 'My Reviews' },
]

const doctorLinks = [
  { to: '/doctor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/doctor/appointments', icon: CalendarIcon, label: 'Appointments' },
  { to: '/doctor/patients', icon: User, label: 'Patients' },
  { to: '/doctor/prescriptions', icon: Pill, label: 'Prescriptions' },
  { to: '/doctor/reports', icon: Folder, label: 'Medical Records' },
  { to: '/doctor/schedule', icon: CalendarDays, label: 'Schedule' },
  { to: '/doctor/profile', icon: FileText, label: 'Profile' },
]

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const { user } = useSelector((state: RootState) => state.auth)
  const links = role === 'patient' ? patientLinks : doctorLinks
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationsApi.getNotifications({ unread: true })
        if (response.success) {
          const data = response.data
          setNotifications(Array.isArray(data) ? data.slice(0, 5) : [])
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter(n => !n.is_read).length

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-transparent z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <nav className={`fixed left-0 top-0 h-full w-72 z-50 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 shadow-2xl transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Gradient Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-full blur-2xl"></div>

        {/* Close Button (Mobile) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors z-50"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Logo & Brand */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Hospital className="text-xl text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-white text-base leading-tight truncate">Maa Jagdamba</h1>
              <p className="text-emerald-400/80 text-xs font-medium">Super Speciality Hospital</p>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="mx-4 mb-6 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg overflow-hidden border-2 border-emerald-400/30">
              {user?.doctor?.image || user?.patient?.image ? (
                <img
                  src={user.doctor?.image || user.patient?.image || ''}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">{getInitials(user?.name || 'U')}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">{user?.name || 'User'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <p className="text-emerald-400/70 text-xs capitalize">{user?.role || role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3">
          <div className="mb-3">
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main Menu</span>
          </div>
          <ul className="space-y-1">
            {links.map((link) => {
              const isActive = location.pathname === link.to || location.pathname.startsWith(link.to + '/')
              return (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={onClose}
                    className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <link.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
                    <span className="text-sm font-medium">{link.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>

          {/* Notifications Section */}
          <div className="mt-6 mb-3">
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quick Info</span>
          </div>
          <div
            className={`relative px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer ${
              showNotifications ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-white/5 hover:bg-white/10 border border-transparent'
            }`}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-5 h-5 text-slate-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-sm text-slate-400">Notifications</span>
            </div>
            {showNotifications && notifications.length > 0 && (
              <div className="mt-3 pt-3 border-t border-emerald-500/20 space-y-2">
                {notifications.slice(0, 3).map((notif) => (
                  <div key={notif.id} className="text-xs text-slate-400 truncate">
                    <span className="text-emerald-400/70">{notif.title}:</span> {notif.message}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto px-3 pt-4 pb-6 border-t border-white/10">
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/patient/profile"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">My Profile</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/login"
                className="flex items-center gap-3 px-4 py-3 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Log Out</span>
              </NavLink>
            </li>
          </ul>

          {/* Version */}
          <div className="px-4 py-3 mt-3">
            <p className="text-[10px] text-slate-600 text-center">Maa Jagdamba Hospital v1.0</p>
          </div>
        </div>
      </nav>
    </>
  )
}
