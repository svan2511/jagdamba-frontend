import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Bell, Search, Menu, ChevronDown, User, LogOut, Settings, Moon, Sun, Calendar, Clock, Check } from 'lucide-react'
import { logout } from '../../store/slices/authSlice'
import { type AppDispatch } from '../../store'
import { type RootState } from '../../store'
import { notificationsApi } from '../../api/notifications'

interface TopbarProps {
  onMenuClick: () => void
}

interface Notification {
  id: number
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingNotif, setLoadingNotif] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoadingNotif(true)
        const response = await notificationsApi.getNotifications({ unread: true })
        if (response.success) {
          const data = response.data
          setNotifications(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingNotif(false)
      }
    }
    fetchNotifications()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id)
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
    } catch (err) {
      console.error(err)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const formatTime = (date: string) => {
    const now = new Date()
    const notifDate = new Date(date)
    const diff = now.getTime() - notifDate.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return notifDate.toLocaleDateString()
  }

  const unreadCount = notifications.filter(n => !n.is_read).length
  const profileLink = user?.role === 'doctor' ? '/doctor/profile' : '/patient/profile'

  return (
    <header className="flex justify-between items-center w-full px-4 md:px-6 py-3 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm sticky top-0 z-40">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
        onClick={onMenuClick}
      >
        <Menu className="w-5 h-5 text-slate-700" />
      </button>

      {/* Search Bar (Desktop) */}
      <div className="hidden md:flex items-center gap-4 flex-1 max-w-lg">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 transition-colors group-focus-within:text-emerald-500" />
          <input
            className="w-full bg-slate-100 border border-transparent hover:border-slate-200 focus:border-emerald-400 focus:bg-white rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 transition-all outline-none"
            placeholder="Search appointments, records..."
            type="text"
          />
        </div>
      </div>

      {/* Mobile Search Icon */}
      <div className="md:hidden flex items-center gap-2">
        <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
          <Search className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Quick Book Button */}
        <Link
          to="/patient/book-appointment"
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md shadow-emerald-500/25 text-sm font-medium"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Now</span>
        </Link>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors hidden sm:flex"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-500" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5 text-slate-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs text-emerald-600 font-medium px-2.5 py-1 bg-emerald-50 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {loadingNotif ? (
                  <div className="p-8 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 ${!notif.is_read ? 'bg-emerald-50/30' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!notif.is_read ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                          <Bell className={`w-5 h-5 ${!notif.is_read ? 'text-emerald-600' : 'text-slate-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-slate-800 text-sm truncate">{notif.title}</p>
                            {!notif.is_read && (
                              <button
                                onClick={() => handleMarkAsRead(notif.id)}
                                className="p-1 hover:bg-emerald-100 rounded-full transition-colors flex-shrink-0"
                                title="Mark as read"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notif.message}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <p className="text-[10px] text-slate-400">{formatTime(notif.created_at)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                <Link
                  to={user?.role === 'doctor' ? '/doctor/notifications' : '/patient/notifications'}
                  className="flex items-center justify-center gap-2 text-emerald-600 font-medium text-sm hover:text-emerald-700 transition-colors"
                  onClick={() => setShowNotifications(false)}
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 pr-3 hover:bg-slate-100 rounded-full transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center overflow-hidden border-2 border-white shadow-lg">
              {user?.doctor?.image || user?.patient?.image ? (
                <img
                  src={user.doctor?.image || user.patient?.image || ''}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">{getInitials(user?.name || 'U')}</span>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-medium text-slate-800 text-sm leading-tight max-w-[120px] truncate">{user?.name || 'User'}</p>
              <p className="text-[11px] text-slate-500 capitalize">{user?.role || 'Patient'}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <p className="font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
              </div>
              <div className="py-2">
                <Link
                  to={profileLink}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-700 text-sm">My Profile</span>
                </Link>
                <Link
                  to={user?.role === 'doctor' ? '/doctor/settings' : '/patient/profile'}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-700 text-sm">Settings</span>
                </Link>
              </div>
              <div className="p-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 rounded-xl text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium text-sm">Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
