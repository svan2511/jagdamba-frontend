import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import ScrollToTop from '../components/ScrollToTop'

export default function DoctorDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden antialiased bg-slate-50">
      <ScrollToTop />
      <Sidebar
        role="doctor"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col md:ml-72 h-screen overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 xl:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
