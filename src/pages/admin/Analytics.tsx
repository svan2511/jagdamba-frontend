import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Users, Calendar, DollarSign, Activity, Download, AlertCircle } from 'lucide-react'
import { adminApi } from '../../api/admin'
import FullPageLoader from '../../components/FullPageLoader'

export default function Analytics() {
  const [dateRange, setDateRange] = useState('6months')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await adminApi.getAnalytics(dateRange)

      if (response.success && response.data) {
        setAnalyticsData(response.data)
      } else {
        setError(response.message || 'Failed to load analytics')
      }
    } catch {
      setError('Failed to load analytics. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  // Fallback empty data structure
  const kpi = analyticsData?.kpi || {
    total_patients: 0,
    patient_change: 0,
    total_appointments: 0,
    appointment_change: 0,
    total_revenue: 0,
    revenue_change: 0,
    avg_daily_visits: 0,
    visit_change: 0,
  }

  const monthlyData = analyticsData?.monthly_data || []
  const weeklyData = analyticsData?.weekly_data || []
  const departmentStats = analyticsData?.department_stats || []
  const topDoctors = analyticsData?.top_doctors || []

  const maxPatients = monthlyData.length > 0 ? Math.max(...monthlyData.map((m: any) => m.patients || 0)) : 1
  const maxVisits = weeklyData.length > 0 ? Math.max(...weeklyData.map((d: any) => d.visits || 0)) : 1

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`
    return `₹${amount}`
  }

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const handleExport = () => {
    // Simple CSV export
    const csvContent = [
      ['Metric', 'Value', 'Change'],
      ['Total Patients', kpi.total_patients, `${kpi.patient_change}%`],
      ['Total Appointments', kpi.total_appointments, `${kpi.appointment_change}%`],
      ['Total Revenue', kpi.total_revenue, `${kpi.revenue_change}%`],
      ['Avg Daily Visits', kpi.avg_daily_visits, `${kpi.visit_change}%`],
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">Analytics Dashboard</h1>
          <p className="text-gray-500 text-sm">Comprehensive hospital performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#3e5641] text-white rounded-lg font-medium hover:bg-[#2d4030] transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <FullPageLoader message="Loading analytics..." />
      ) : error ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={fetchAnalytics} className="px-4 py-2 bg-[#d36135] text-white rounded-lg hover:bg-[#b5552d]">Try Again</button>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Patients', value: formatNumber(kpi.total_patients), change: kpi.patient_change, icon: Users, color: 'bg-[#3e5641]', negative: kpi.patient_change < 0 },
              { label: 'Total Appointments', value: formatNumber(kpi.total_appointments), change: kpi.appointment_change, icon: Calendar, color: 'bg-[#d36135]', negative: kpi.appointment_change < 0 },
              { label: 'Total Revenue', value: formatCurrency(kpi.total_revenue), change: kpi.revenue_change, icon: DollarSign, color: 'bg-[#83bca9]', negative: kpi.revenue_change < 0 },
              { label: 'Avg. Daily Visits', value: formatNumber(kpi.avg_daily_visits), change: kpi.visit_change, icon: Activity, color: 'bg-[#a24936]', negative: kpi.visit_change < 0 },
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
                  <span className={`text-sm font-medium ${stat.negative ? 'text-red-600' : 'text-green-600'}`}>
                    {stat.negative ? '' : '+'}{stat.change}%
                  </span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                  <span className="text-sm text-gray-500 block">{stat.label}</span>
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
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Patient & Appointment Trends</h3>
              </div>
              {monthlyData.length > 0 ? (
                <div className="flex items-end justify-between h-64 gap-2">
                  {monthlyData.map((item: any, index: number) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex flex-col items-center gap-1">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max((item.patients / maxPatients) * 100, 2)}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                          className="w-8 bg-[#3e5641] rounded-t-lg"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max((item.appointments / maxPatients) * 60, 2)}%` }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                          className="w-8 bg-[#d36135] rounded-t-lg"
                        />
                      </div>
                      <span className="text-xs text-gray-500">{item.month}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#3e5641] rounded-full" />
                  <span className="text-xs text-gray-500">Patients</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#d36135] rounded-full" />
                  <span className="text-xs text-gray-500">Appointments</span>
                </div>
              </div>
            </motion.div>

            {/* Weekly Visits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Daily Visits This Week</h3>
              {weeklyData.length > 0 ? (
                <div className="flex items-end justify-between h-56 gap-1">
                  {weeklyData.map((day: any, index: number) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                      <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100%' }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max((day.visits / maxVisits) * 100, 2)}%` }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                          className="absolute bottom-0 w-full bg-gradient-to-t from-[#d36135] to-[#e8886a] rounded-t-lg"
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 truncate w-full text-center">{day.day}</span>
                      <span className="text-xs font-medium text-gray-700">{day.visits}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-56 flex items-center justify-center text-gray-500">
                  No data available
                </div>
              )}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Department Distribution</h3>
              {departmentStats.length > 0 ? (
                <div className="space-y-4">
                  {departmentStats.map((dept: any, index: number) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">{dept.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{dept.patients} patients</span>
                          <span className={`text-xs font-medium ${dept.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {dept.growth > 0 ? '+' : ''}{dept.growth}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(dept.percentage, 2)}%` }}
                          transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-[#3e5641] to-[#83bca9] rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-500">
                  No department data available
                </div>
              )}
            </motion.div>

            {/* Top Performing Doctors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Top Performing Doctors</h3>
              {topDoctors.length > 0 ? (
                <div className="space-y-4">
                  {topDoctors.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-[#3e5641] flex items-center justify-center text-white text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">{doc.name}</span>
                          <span className="text-xs px-2 py-0.5 bg-[#3e5641]/10 text-[#3e5641] rounded">{doc.department}</span>
                        </div>
                        <span className="text-xs text-gray-500">{doc.patients} patients</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-gray-800">{doc.rating}</span>
                        <span className="text-yellow-400">★</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-500">
                  No doctor data available
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </div>
  )
}