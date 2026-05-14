import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle } from 'lucide-react'

const timeSlots = [
  { id: 1, time: '09:00 AM', enabled: true },
  { id: 2, time: '09:30 AM', enabled: true },
  { id: 3, time: '10:00 AM', enabled: true },
  { id: 4, time: '10:30 AM', enabled: false },
  { id: 5, time: '11:00 AM', enabled: true },
  { id: 6, time: '11:30 AM', enabled: true },
  { id: 7, time: '12:00 PM', enabled: false },
  { id: 8, time: '02:00 PM', enabled: true },
  { id: 9, time: '02:30 PM', enabled: true },
  { id: 10, time: '03:00 PM', enabled: true },
  { id: 11, time: '03:30 PM', enabled: true },
  { id: 12, time: '04:00 PM', enabled: true },
  { id: 13, time: '04:30 PM', enabled: false },
  { id: 14, time: '05:00 PM', enabled: true },
]

const days = [
  { name: 'Monday', enabled: true },
  { name: 'Tuesday', enabled: true },
  { name: 'Wednesday', enabled: true },
  { name: 'Thursday', enabled: true },
  { name: 'Friday', enabled: true },
  { name: 'Saturday', enabled: false },
  { name: 'Sunday', enabled: false },
]

export default function Availability() {
  const [slots, setSlots] = useState(timeSlots)
  const [daySettings, setDaySettings] = useState(days)
  const [selectedDate, setSelectedDate] = useState('')

  const toggleSlot = (id: number) => {
    setSlots(slots.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))
  }

  const toggleDay = (name: string) => {
    setDaySettings(daySettings.map(d => d.name === name ? { ...d, enabled: !d.enabled } : d))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline-lg text-headline-lg text-on-background">Availability Settings</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-colors">
          <CheckCircle className="w-4 h-4" /> Save Changes
        </button>
      </div>

      {/* Weekly Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="font-headline-sm text-headline-sm text-on-background mb-6">Weekly Availability</h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {daySettings.map((day) => (
            <div
              key={day.name}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                day.enabled
                  ? 'border-primary bg-primary-container/20'
                  : 'border-outline-variant bg-surface-container'
              }`}
              onClick={() => toggleDay(day.name)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-md text-label-md text-on-background">{day.name}</span>
                <div className={`w-4 h-4 rounded-full ${day.enabled ? 'bg-primary' : 'bg-outline'}`}></div>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {day.enabled ? 'Available' : 'Unavailable'}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Time Slots */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="font-headline-sm text-headline-sm text-on-background mb-6">Time Slots</h3>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
          {slots.map((slot, index) => (
            <motion.button
              key={slot.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => toggleSlot(slot.id)}
              className={`p-4 rounded-lg border font-label-md text-label-md transition-all ${
                slot.enabled
                  ? 'border-primary bg-primary-container/20 text-primary'
                  : 'border-outline-variant text-on-surface-variant opacity-50'
              }`}
            >
              <Clock className="w-5 h-5 mx-auto mb-2" />
              {slot.time}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Specific Date Override */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="font-headline-sm text-headline-sm text-on-background mb-6">Specific Date Override</h3>
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1">
            <label className="font-label-md text-label-md text-on-surface-variant block mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 bg-surface-container rounded-lg border border-outline-variant focus:border-primary outline-none font-body-md text-body-md"
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-label-md text-label-md hover:bg-green-200 transition-colors">
              Available
            </button>
            <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-label-md text-label-md hover:bg-red-200 transition-colors">
              Unavailable
            </button>
          </div>
        </div>
      </motion.div>

      {/* Consultation Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="font-headline-sm text-headline-sm text-on-background mb-6">Consultation Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { type: 'In-Person', duration: '30 min', slots: 15 },
            { type: 'Telehealth', duration: '20 min', slots: 20 },
            { type: 'Follow-up', duration: '15 min', slots: 25 },
          ].map((item, index) => (
            <div key={index} className="p-4 bg-surface-container rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-label-md text-label-md text-on-background">{item.type}</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Duration</span>
                  <span className="font-body-md text-body-md text-on-background">{item.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Max Slots/Day</span>
                  <span className="font-body-md text-body-md text-on-background">{item.slots}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}