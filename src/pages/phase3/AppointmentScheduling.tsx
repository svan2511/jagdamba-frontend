import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowLeft, ArrowRight, Plus, Check, X } from 'lucide-react'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const scheduleData: Record<string, { time: string; type: string; color: string; patient?: string }[]> = {
  Mon: [
    { time: '09:00 - 10:00', type: 'Consultation', color: 'bg-primary-container/20', patient: 'John Smith' },
    { time: '10:00 - 11:00', type: 'Follow-up', color: 'bg-green-100', patient: 'Emily Davis' },
    { time: '14:00 - 15:00', type: 'Procedure', color: 'bg-purple-100', patient: 'Michael Brown' },
  ],
  Tue: [
    { time: '09:00 - 12:00', type: 'Surgery', color: 'bg-red-100', patient: 'Robert Chen' },
    { time: '14:00 - 16:00', type: 'Admin', color: 'bg-surface-container-high', patient: '' },
  ],
  Wed: [
    { time: '10:00 - 11:00', type: 'Consultation', color: 'bg-primary-container/20', patient: 'Sarah Wilson' },
  ],
  Thu: [
    { time: '09:00 - 10:00', type: 'Follow-up', color: 'bg-green-100', patient: 'Lisa Anderson' },
    { time: '11:00 - 13:00', type: 'Procedure', color: 'bg-purple-100', patient: 'James Taylor' },
  ],
  Fri: [
    { time: '09:00 - 12:00', type: 'Consultation', color: 'bg-primary-container/20', patient: 'Multiple' },
  ],
  Sat: [],
  Sun: [],
}

export default function AppointmentScheduling() {
  const [currentWeek, setCurrentWeek] = useState(0)

  const getWeekDates = (weekOffset: number) => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7)
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return date
    })
  }

  const weekDates = getWeekDates(currentWeek)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-h2-header text-h2-header text-primary">Appointment Scheduling</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage your weekly schedule and appointments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-body-md font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Add Block
        </button>
      </div>

      {/* Week Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-bright rounded-xl p-4 border border-outline-variant/30"
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentWeek(currentWeek - 1)}
            className="p-2 hover:bg-surface-container-high rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
          </button>
          <span className="font-h3-sub text-h3-sub text-primary">
            {weekDates[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => setCurrentWeek(currentWeek + 1)}
            className="p-2 hover:bg-surface-container-high rounded-lg transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>
      </motion.div>

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-7 gap-3">
        {weekDays.map((day, index) => {
          const date = weekDates[index]
          const isToday = date.toDateString() === new Date().toDateString()
          const daySchedule = scheduleData[day] || []

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-surface-bright rounded-xl p-3 border ${
                isToday ? 'border-secondary-container border-2' : 'border-outline-variant/30'
              }`}
            >
              <div className={`text-center mb-3 ${isToday ? 'text-secondary' : ''}`}>
                <span className="font-label-caps text-label-caps text-on-surface-variant block">{day}</span>
                <span className={`font-h3-sub text-h3-sub ${isToday ? 'text-secondary' : 'text-primary'}`}>
                  {date.getDate()}
                </span>
              </div>

              <div className="space-y-2 min-h-[200px]">
                {daySchedule.length > 0 ? (
                  daySchedule.map((slot, i) => (
                    <div key={i} className={`p-2 rounded-lg ${slot.color}`}>
                      <span className="font-body-sm text-body-sm text-on-surface block text-[10px]">{slot.time}</span>
                      <span className="font-label-caps text-label-caps text-on-surface-variant">{slot.type}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">No slots</span>
                  </div>
                )}
              </div>

              <button className="w-full mt-2 p-2 border border-dashed border-outline-variant rounded-lg font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-container-low transition-colors text-[10px]">
                + Add
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Hours', value: '32 hrs', icon: Clock, color: 'text-primary' },
          { label: 'Consultations', value: '18', icon: Calendar, color: 'text-blue-600' },
          { label: 'Procedures', value: '6', icon: Check, color: 'text-purple-600' },
          { label: 'Admin Time', value: '8 hrs', icon: X, color: 'text-gray-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-surface-bright rounded-xl p-4 border border-outline-variant/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`${stat.color} w-4 h-4`} />
              <span className="font-label-caps text-label-caps text-on-surface-variant">{stat.label}</span>
            </div>
            <span className="font-h2-header text-h2-header text-primary">{stat.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}