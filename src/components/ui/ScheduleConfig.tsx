import { useState, useEffect } from 'react'
import { Clock, Coffee, Trash2, Plus } from 'lucide-react'

export interface DaySchedule {
  day: string
  label: string
  isActive: boolean
  startTime: string
  endTime: string
  slotDuration: number
  breakStart: string
  breakEnd: string
}

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
]

const SLOT_DURATIONS = [
  { value: 15, label: '15 min' },
  { value: 20, label: '20 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '60 min' },
]

interface ScheduleConfigProps {
  schedules: DaySchedule[]
  onChange: (schedules: DaySchedule[]) => void
}

export default function ScheduleConfig({ schedules, onChange }: ScheduleConfigProps) {
  const [expandedDays, setExpandedDays] = useState<string[]>(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])

  // Initialize with default schedules if empty
  useEffect(() => {
    if (schedules.length === 0) {
      const defaultSchedules: DaySchedule[] = DAYS.map(day => ({
        day: day.key,
        label: day.label,
        isActive: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day.key),
        startTime: '09:00',
        endTime: '17:00',
        slotDuration: 30,
        breakStart: '',
        breakEnd: '',
      }))
      onChange(defaultSchedules)
    }
  }, [schedules.length, onChange])

  const getSchedules = (): DaySchedule[] => {
    if (schedules.length > 0) return schedules
    return DAYS.map(day => ({
      day: day.key,
      label: day.label,
      isActive: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day.key),
      startTime: '09:00',
      endTime: '17:00',
      slotDuration: 30,
      breakStart: '',
      breakEnd: '',
    }))
  }

  const updateSchedule = (dayKey: string, updates: Partial<DaySchedule>) => {
    const current = getSchedules()
    const updated = current.map(s =>
      s.day === dayKey ? { ...s, ...updates } : s
    )
    onChange(updated)
  }

  const toggleDayActive = (dayKey: string) => {
    const current = getSchedules()
    const schedule = current.find(s => s.day === dayKey)
    if (!schedule) return

    const isCurrentlyActive = schedule.isActive

    if (!isCurrentlyActive) {
      setExpandedDays(prev => [...prev, dayKey])
    }

    updateSchedule(dayKey, { isActive: !isCurrentlyActive })
  }

  const toggleExpand = (dayKey: string) => {
    setExpandedDays(prev =>
      prev.includes(dayKey)
        ? prev.filter(d => d !== dayKey)
        : [...prev, dayKey]
    )
  }

  const handleCopyToAll = (dayKey: string) => {
    const current = getSchedules()
    const sourceSchedule = current.find(s => s.day === dayKey)
    if (!sourceSchedule) return

    const updated = current.map(s => ({
      ...s,
      startTime: sourceSchedule.startTime,
      endTime: sourceSchedule.endTime,
      slotDuration: sourceSchedule.slotDuration,
      breakStart: sourceSchedule.breakStart,
      breakEnd: sourceSchedule.breakEnd,
    }))
    onChange(updated)
  }

  const currentSchedules = getSchedules()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-700">Weekly Schedule</h4>
        <button
          type="button"
          onClick={() => handleCopyToAll('monday')}
          className="text-xs text-[#3e5641] hover:text-[#2d4030] flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Copy to all days
        </button>
      </div>

      {/* Day toggle buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {DAYS.map(day => {
          const schedule = currentSchedules.find(s => s.day === day.key)
          const isActive = schedule?.isActive ?? false

          return (
            <button
              key={day.key}
              type="button"
              onClick={() => toggleDayActive(day.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#3e5641] text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {day.label.slice(0, 3)}
            </button>
          )
        })}
      </div>

      {/* Expanded schedule for each active day */}
      <div className="space-y-2">
        {DAYS.map(day => {
          const schedule = currentSchedules.find(s => s.day === day.key)
          if (!schedule || !schedule.isActive) return null

          const isExpanded = expandedDays.includes(day.key)

          return (
            <div
              key={day.key}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Day header */}
              <div
                className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
                onClick={() => toggleExpand(day.key)}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-sm text-gray-700">{schedule.label}</span>
                  <span className="text-xs text-gray-500">
                    {schedule.startTime} - {schedule.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {schedule.slotDuration} min slots
                  </span>
                  <span className={`w-2 h-2 rounded-full ${schedule.breakStart ? 'bg-amber-400' : 'bg-gray-300'}`} />
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="p-4 bg-white space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Start Time */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => updateSchedule(day.key, { startTime: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                      />
                    </div>

                    {/* End Time */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => updateSchedule(day.key, { endTime: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                      />
                    </div>

                    {/* Slot Duration */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Slot Duration
                      </label>
                      <select
                        value={schedule.slotDuration}
                        onChange={(e) => updateSchedule(day.key, { slotDuration: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                      >
                        {SLOT_DURATIONS.map(d => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Break toggle */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Lunch Break
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (schedule.breakStart) {
                              updateSchedule(day.key, { breakStart: '', breakEnd: '' })
                            } else {
                              updateSchedule(day.key, { breakStart: '13:00', breakEnd: '14:00' })
                            }
                          }}
                          className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                            schedule.breakStart
                              ? 'bg-amber-100 text-amber-700 border border-amber-300'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          <Coffee className="w-4 h-4" />
                        </button>
                        {schedule.breakStart && (
                          <span className="text-xs text-gray-500">
                            {schedule.breakStart} - {schedule.breakEnd}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Break timings (if enabled) */}
                  {schedule.breakStart && (
                    <div className="grid grid-cols-2 gap-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <div>
                        <label className="block text-xs font-medium text-amber-700 mb-1.5">
                          Break Start
                        </label>
                        <input
                          type="time"
                          value={schedule.breakStart}
                          onChange={(e) => updateSchedule(day.key, { breakStart: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-amber-700 mb-1.5">
                          Break End
                        </label>
                        <input
                          type="time"
                          value={schedule.breakEnd}
                          onChange={(e) => updateSchedule(day.key, { breakEnd: e.target.value })}
                          className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                        />
                      </div>
                    </div>
                  )}

                  {/* Disable day button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => toggleDayActive(day.key)}
                      className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Disable this day
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Quick summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-500">
          <span className="font-medium">{currentSchedules.filter(s => s.isActive).length}</span> working days configured
          {currentSchedules.filter(s => s.breakStart).length > 0 && (
            <span className="ml-2">
              • <span className="font-medium">{currentSchedules.filter(s => s.breakStart).length}</span> days with break
            </span>
          )}
        </div>
      </div>
    </div>
  )
}