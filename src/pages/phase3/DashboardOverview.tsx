import { motion } from 'framer-motion'
import { CalendarDays, Users, TrendingUp, CheckCircle, Clock, AlertTriangle, ArrowRight, MoreVertical } from 'lucide-react'

const stats = [
  { label: "Today's Appointments", value: '12', change: '+3 from yesterday', icon: CalendarDays, color: 'text-primary' },
  { label: 'Patients Seen', value: '8', change: 'On track', icon: Users, color: 'text-primary' },
  { label: 'Pending Consultations', value: '4', change: 'High priority', icon: AlertTriangle, color: 'text-secondary' },
  { label: 'Completed Today', value: '6', change: '+2 completed', icon: CheckCircle, color: 'text-green-600' },
]

const upcomingAppointments = [
  { time: '09:00 AM', patient: 'John Smith', type: 'Follow-up', status: 'Confirmed' },
  { time: '10:30 AM', patient: 'Emily Davis', type: 'New Patient', status: 'Confirmed' },
  { time: '11:30 AM', patient: 'Michael Brown', type: 'Emergency', status: 'Pending' },
  { time: '02:00 PM', patient: 'Sarah Wilson', type: 'Checkup', status: 'Confirmed' },
]

const recentPatients = [
  { name: 'John Smith', condition: 'Hypertension', lastVisit: 'Oct 12, 2024', status: 'Stable' },
  { name: 'Emily Davis', condition: 'Diabetes Type 2', lastVisit: 'Oct 10, 2024', status: 'Under Observation' },
  { name: 'Robert Chen', condition: 'Cardiac Checkup', lastVisit: 'Oct 08, 2024', status: 'Recovered' },
]

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-bright rounded-xl p-6 lg:p-8 border border-outline-variant/30 shadow-sm"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="font-h2-header text-h2-header text-primary mb-2">Good morning, Dr. Voss.</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">You have 12 appointments scheduled today. Your first patient arrives at 9:00 AM.</p>
          </div>
          <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-body-md font-medium hover:bg-primary transition-colors">
            Start Day
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface-bright rounded-xl p-5 border border-outline-variant/30 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">{stat.label}</span>
              <stat.icon className={`${stat.color} w-5 h-5`} />
            </div>
            <div>
              <div className="flex items-end gap-2 mb-1">
                <span className="font-h1-display text-h1-display text-primary">{stat.value}</span>
              </div>
              <span className="font-body-md text-body-md text-on-surface-variant">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-surface-bright rounded-xl p-6 border border-outline-variant/30"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-h3-sub text-h3-sub text-primary">Today's Schedule</h3>
            <button className="text-secondary font-body-md font-medium flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingAppointments.map((apt, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 text-center">
                    <span className="font-label-caps text-label-caps text-primary">{apt.time}</span>
                  </div>
                  <div>
                    <h4 className="font-body-md font-medium text-on-surface">{apt.patient}</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">{apt.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full font-label-caps text-label-caps ${
                    apt.status === 'Confirmed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {apt.status}
                  </span>
                  <button className="p-1 hover:bg-surface-container-high rounded">
                    <MoreVertical className="w-4 h-4 text-on-surface-variant" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Patients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-surface-bright rounded-xl p-6 border border-outline-variant/30"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-h3-sub text-h3-sub text-primary">Recent Patients</h3>
            <button className="text-secondary font-body-md font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recentPatients.map((patient, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer">
                <div>
                  <h4 className="font-body-md text-on-surface">{patient.name}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">{patient.condition}</p>
                </div>
                <span className={`px-2 py-1 rounded-full font-label-caps text-[10px] ${
                  patient.status === 'Stable' ? 'bg-green-100 text-green-700' :
                  patient.status === 'Under Observation' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {patient.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Appointments', icon: CalendarDays, color: 'bg-primary-container/20 text-primary' },
          { label: 'Patients', icon: Users, color: 'bg-secondary-container/20 text-secondary' },
          { label: 'Clinical Notes', icon: TrendingUp, color: 'bg-tertiary-container/20 text-tertiary' },
          { label: 'Analytics', icon: Clock, color: 'bg-surface-container-high text-on-surface-variant' },
        ].map((action) => (
          <button
            key={action.label}
            className="bg-surface-bright rounded-xl p-4 flex flex-col items-center justify-center gap-2 border border-outline-variant/30 hover:border-primary/50 transition-colors cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${action.color}`}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="font-body-md text-on-surface">{action.label}</span>
          </button>
        ))}
      </motion.div>
    </div>
  )
}