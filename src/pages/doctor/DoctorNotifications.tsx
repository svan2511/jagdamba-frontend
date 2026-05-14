import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Calendar, User, FileText, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react'

const notifications = [
  { id: 1, type: 'appointment', title: 'New Appointment', message: 'John Smith booked a follow-up appointment for tomorrow at 10:00 AM.', time: '30 min ago', read: false, priority: 'high' },
  { id: 2, type: 'patient', title: 'Patient Update', message: 'Emily Davis uploaded new lab results for review.', time: '1 hour ago', read: false, priority: 'medium' },
  { id: 3, type: 'message', title: 'New Message', message: 'Sarah Wilson sent you a message regarding her medication.', time: '2 hours ago', read: true, priority: 'low' },
  { id: 4, type: 'lab', title: 'Lab Results Ready', message: 'Blood work results for Michael Brown are ready for review.', time: '3 hours ago', read: true, priority: 'medium' },
  { id: 5, type: 'appointment', title: 'Appointment Cancelled', message: 'Robert Chen cancelled his appointment scheduled for tomorrow.', time: 'Yesterday', read: true, priority: 'high' },
  { id: 6, type: 'reminder', title: 'Task Reminder', message: 'Complete patient notes for John Smith before end of day.', time: 'Yesterday', read: true, priority: 'medium' },
]

export default function DoctorNotifications() {
  const [filter, setFilter] = useState('all')
  const [notifs, setNotifs] = useState(notifications)

  const filteredNotifs = filter === 'all' ? notifs : filter === 'unread' ? notifs.filter(n => !n.read) : notifs.filter(n => n.read)

  const markAsRead = (id: number) => {
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifs(notifs.map(n => ({ ...n, read: true })))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment': return Calendar
      case 'patient': return User
      case 'message': return MessageSquare
      case 'lab': return FileText
      default: return Bell
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'bg-blue-100 text-blue-700'
      case 'patient': return 'bg-green-100 text-green-700'
      case 'message': return 'bg-orange-100 text-orange-700'
      case 'lab': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      default: return 'text-green-600'
    }
  }

  const unreadCount = notifs.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background">Notifications</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">{unreadCount} unread alerts</p>
        </div>
        <button
          onClick={markAllAsRead}
          className="text-primary font-label-md text-label-md hover:underline flex items-center gap-1"
        >
          <CheckCircle className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'unread', 'read'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-colors ${
              filter === f ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.map((notif, index) => {
          const Icon = getTypeIcon(notif.type)
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => markAsRead(notif.id)}
              className={`glass-card rounded-xl p-5 cursor-pointer transition-all ${
                notif.read ? 'opacity-70' : 'border-l-4 border-l-primary'
              } hover:border-primary/50`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(notif.type)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-label-md text-label-md text-on-background">{notif.title}</h3>
                    <div className="flex items-center gap-2">
                      <AlertCircle className={`w-4 h-4 ${getPriorityColor(notif.priority)}`} />
                      <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {notif.time}
                      </span>
                    </div>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">{notif.message}</p>
                </div>
                {!notif.read && (
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredNotifs.length === 0 && (
        <div className="glass-card rounded-xl p-12 text-center">
          <Bell className="w-16 h-16 text-on-surface-variant mx-auto mb-4 opacity-50" />
          <h3 className="font-headline-sm text-headline-sm text-on-background mb-2">No notifications</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">You're all caught up!</p>
        </div>
      )}
    </div>
  )
}