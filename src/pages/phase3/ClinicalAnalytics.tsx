import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Users, Calendar, Clock, CheckCircle, Activity } from 'lucide-react'

const analyticsData = [
  { label: 'Patient Volume', value: '156', change: '+12%', trend: 'up', icon: Users },
  { label: 'Appointments', value: '342', change: '+8%', trend: 'up', icon: Calendar },
  { label: 'Avg. Wait Time', value: '12 min', change: '-15%', trend: 'down', icon: Clock },
  { label: 'Completion Rate', value: '94%', change: '+5%', trend: 'up', icon: CheckCircle },
]

const departmentData = [
  { name: 'Cardiology', patients: 45, percentage: 28 },
  { name: 'Neurology', patients: 32, percentage: 20 },
  { name: 'Orthopedics', patients: 38, percentage: 24 },
  { name: 'Pediatrics', patients: 28, percentage: 18 },
  { name: 'Other', patients: 17, percentage: 10 },
]

const monthlyTrends = [
  { month: 'Jan', value: 120 },
  { month: 'Feb', value: 135 },
  { month: 'Mar', value: 128 },
  { month: 'Apr', value: 142 },
  { month: 'May', value: 156 },
  { month: 'Jun', value: 165 },
]

export default function ClinicalAnalytics() {
  const maxValue = Math.max(...monthlyTrends.map(m => m.value))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-h2-header text-h2-header text-primary">Clinical Analytics</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Track performance metrics and patient insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface-bright rounded-xl p-5 border border-outline-variant/30"
          >
            <div className="flex justify-between items-start mb-3">
              <stat.icon className="w-5 h-5 text-primary" />
              <span className={`flex items-center gap-1 font-label-caps text-label-caps ${
                stat.trend === 'up' ? 'text-green-600' : 'text-green-600'
              }`}>
                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <div>
              <span className="font-h1-display text-h1-display text-primary block">{stat.value}</span>
              <span className="font-body-md text-body-md text-on-surface-variant">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface-bright rounded-xl p-6 border border-outline-variant/30"
        >
          <h3 className="font-h3-sub text-h3-sub text-primary mb-6">Patient Volume Trend</h3>
          <div className="flex items-end justify-between h-48 gap-2">
            {monthlyTrends.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-primary-container rounded-t-lg transition-all duration-500" style={{ height: `${(item.value / maxValue) * 100}%` }}></div>
                <span className="font-label-caps text-label-caps text-on-surface-variant">{item.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Department Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-surface-bright rounded-xl p-6 border border-outline-variant/30"
        >
          <h3 className="font-h3-sub text-h3-sub text-primary mb-6">Department Distribution</h3>
          <div className="space-y-4">
            {departmentData.map((dept, index) => (
              <div key={dept.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-body-md text-on-surface">{dept.name}</span>
                  <span className="font-body-md text-on-surface-variant">{dept.patients} patients</span>
                </div>
                <div className="h-3 bg-surface-container-low rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.percentage}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    className="h-full bg-primary-container rounded-full"
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Additional Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-surface-bright rounded-xl p-6 border border-outline-variant/30"
      >
        <h3 className="font-h3-sub text-h3-sub text-primary mb-6">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
              <Activity className="w-10 h-10 text-green-600" />
            </div>
            <span className="font-h2-header text-h2-header text-primary block">98%</span>
            <span className="font-body-md text-on-surface-variant">Patient Satisfaction</span>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-blue-600" />
            </div>
            <span className="font-h2-header text-h2-header text-primary block">94%</span>
            <span className="font-body-md text-on-surface-variant">Treatment Success</span>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center">
              <Users className="w-10 h-10 text-purple-600" />
            </div>
            <span className="font-h2-header text-h2-header text-primary block">4.8</span>
            <span className="font-body-md text-on-surface-variant">Avg. Rating</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}