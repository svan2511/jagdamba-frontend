import { useState } from 'react'
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store'
import { logout } from '../store'
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  Calendar,
  Settings,
  Image,
  Star,
  Menu,
  ChevronDown,
  LogOut,
  BarChart3,
  Mail,
  Shield,
  Activity,
  Bell,
  Clock,
} from 'lucide-react'

const adminLinks = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/doctors', icon: Stethoscope, label: 'Doctors' },
  { to: '/admin/patients', icon: Users, label: 'Patients' },
  { to: '/admin/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/admin/schedule-requests', icon: Clock, label: 'Schedule Requests' },
  { to: '/admin/gallery', icon: Image, label: 'Gallery' },
  { to: '/admin/reviews', icon: Star, label: 'Reviews' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
]

const bottomLinks = [
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await dispatch(logout() as any).unwrap()
      localStorage.removeItem('token')
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#faf9f6]">
      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-72 bg-[#273f2b] text-white
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col shadow-xl
      `}>
        {/* Brand */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#d36135] flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Maa Jagdamba</h1>
              <p className="text-xs text-white/60">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Admin Info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
               onClick={() => setProfileOpen(!profileOpen)}>
            <div className="w-10 h-10 rounded-full bg-[#d36135] flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Admin User</p>
              <p className="text-xs text-white/60">Super Admin</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </div>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 bg-white/10 rounded-lg overflow-hidden"
              >
                <Link to="/admin/settings" className="w-full flex items-center gap-3 p-3 text-sm hover:bg-white/10 transition-colors">
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-sm hover:bg-white/10 transition-colors text-red-300">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive
                    ? 'bg-[#d36135] text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-1">
          {bottomLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive
                  ? 'bg-[#d36135] text-white shadow-lg'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-[#273f2b]" />
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-[#3e5641] focus:outline-none transition-all text-sm"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Actions */}
            <button className="flex items-center gap-2 px-4 py-2 bg-[#3e5641] text-white rounded-lg text-sm font-medium hover:bg-[#2d4030] transition-colors">
              <Mail className="w-4 h-4" />
              Contact
            </button>

            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="w-10 h-10 rounded-full bg-[#d36135] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}