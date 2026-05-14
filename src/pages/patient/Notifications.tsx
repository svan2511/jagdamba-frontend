import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Calendar, Pill, FileText, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react'

const notifications = [
  { id: 1, type: 'appointment', title: 'Appointment Reminder', message: 'Your cardiology appointment with Dr. Emily Chen is scheduled for today at 2:30 PM.', time: '1 hour ago', read: false, icon: Calendar },
  { id: 2, type: 'prescription', title: 'Prescription Ready', message: 'Your prescription for Amlodipine 5mg is ready for pickup at the pharmacy.', time: '3 hours ago', read: false, icon: Pill },
  { id: 3, type: 'result', title: 'Lab Results Available', message: 'Your Complete Blood Count (CBC) results are now available to view.', time: 'Yesterday', read: true, icon: FileText },
  { id: 4, type: 'message', title: 'New Message from Doctor', message: 'Dr. Michael Park sent you a message regarding your recent visit.', time: '2 days ago', read: true, icon: MessageSquare },
  { id: 5, type: 'appointment', title: 'Appointment Confirmed', message: 'Your appointment with Dr. Sarah Johnson on Oct 28 has been confirmed.', time: '3 days ago', read: true, icon: Calendar },
  { id: 6, type: 'reminder', title: 'Health Check Reminder', message: 'It\'s time to schedule your annual health checkup.', time: '1 week ago', read: true, icon: AlertCircle },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case 'appointment': return 'bg-blue-100 text-blue-700'
    case 'prescription': return 'bg-green-100 text-green-700'
    case 'result': return 'bg-purple-100 text-purple-700'
    case 'message': return 'bg-orange-100 text-orange-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

export default function Notifications() {
  const [filter, setFilter] = useState('all')
  const [notifs, setNotifs] = useState(notifications)

  const filteredNotifs = filter === 'all' ? notifs : filter === 'unread' ? notifs.filter(n => !n.read) : notifs.filter(n => n.read)

  const markAsRead = (id: number) => {
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifs(notifs.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifs.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background">Notifications</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">You have {unreadCount} unread notifications</p>
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
        {filteredNotifs.map((notif, index) => (
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
                <notif.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-label-md text-label-md text-on-background">{notif.title}</h3>
                  <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {notif.time}
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">{notif.message}</p>
              </div>
              {!notif.read && (
                <div className="w-3 h-3 bg-primary rounded-full"></div>
              )}
            </div>
          </motion.div>
        ))}
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