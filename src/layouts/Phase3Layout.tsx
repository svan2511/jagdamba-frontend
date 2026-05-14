import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutGrid,
  CalendarDays,
  Folder,
  BarChart3,
  ClipboardList,
  User,
  Settings,
  Bell,
  LogOut,
  Menu,
  AlertTriangle,
} from 'lucide-react'

interface Phase3LayoutProps {
  role: 'doctor' | 'patient'
}

const doctorLinks = [
  { to: '/doctor/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { to: '/doctor/appointments', icon: CalendarDays, label: 'Appointments' },
  { to: '/doctor/patients', icon: Folder, label: 'Patients' },
  { to: '/doctor/clinical-notes', icon: ClipboardList, label: 'Clinical Notes' },
  { to: '/doctor/analytics', icon: BarChart3, label: 'Analytics' },
]

const patientLinks = [
  { to: '/patient/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { to: '/patient/appointments', icon: CalendarDays, label: 'Appointments' },
  { to: '/patient/medical-records', icon: Folder, label: 'Records' },
  { to: '/patient/prescriptions', icon: ClipboardList, label: 'Prescriptions' },
]

export default function Phase3Layout({ role }: Phase3LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const links = role === 'doctor' ? doctorLinks : patientLinks

  return (
    <div className="flex min-h-screen bg-[#f4f9f7]">
      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        bg-surface-container-low w-64 border-r border-outline-variant/30
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}>
        {/* Brand */}
        <div className="h-20 flex items-center justify-center border-b border-outline-variant/30 px-4">
          <h1 className="font-h2-header text-h3-sub text-primary font-semibold">Serenity Health</h1>
        </div>

        {/* User Info */}
        <div className="flex flex-col items-center p-6 border-b border-outline-variant/30">
          <div className="w-20 h-20 rounded-full bg-primary-container/20 flex items-center justify-center mb-3">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h3 className="font-h3-sub text-h3-sub text-primary">Dr. Julianne Voss</h3>
          <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">Senior Surgeon</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                ${isActive
                  ? 'bg-surface-bright text-primary border-l-4 border-secondary-container shadow-inner'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
                }
              `}
            >
              <link.icon className="w-5 h-5" />
              <span className="font-label-caps text-label-caps">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-outline-variant/30 space-y-1">
          <button className="flex items-center gap-3 p-3 w-full text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="font-label-caps text-label-caps">Notifications</span>
          </button>
          <button className="flex items-center gap-3 p-3 w-full text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-label-caps text-label-caps">Settings</span>
          </button>
          <NavLink
            to="/login"
            className="flex items-center gap-3 p-3 w-full text-error hover:bg-error-container rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-label-caps text-label-caps">Log Out</span>
          </NavLink>
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
        <header className="h-20 bg-surface-bright border-b border-outline-variant/30 flex items-center justify-between px-6 sticky top-0 z-30">
          <button
            className="md:hidden p-2 hover:bg-surface-container-high rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-primary" />
          </button>

          <div className="flex-1 md:flex-none"></div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-full font-body-md font-medium hover:bg-secondary/90 transition-colors">
              <AlertTriangle className="w-4 h-4" />
              Emergency
            </button>
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
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