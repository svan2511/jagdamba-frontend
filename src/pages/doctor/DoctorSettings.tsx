import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Lock, Smartphone, HelpCircle, LogOut, ChevronRight, DollarSign, Calendar, FileText } from 'lucide-react'

export default function DoctorSettings() {
  const [notifications, setNotifications] = useState({
    appointmentAlerts: true,
    patientUpdates: true,
    labResults: true,
    emailNotifications: true,
    smsAlerts: true,
  })

  return (
    <div className="space-y-6">
      <h1 className="font-headline-lg text-headline-lg text-on-background">Settings</h1>

      {/* Professional Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center">
            <Calendar className="text-primary w-5 h-5" />
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-background">Professional Settings</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Schedule Management', desc: 'Manage your working hours and availability' },
            { label: 'Consultation Fees', desc: 'Update your consultation charges' },
            { label: 'Availability Slots', desc: 'Set your available time slots' },
            { label: 'Service Types', desc: 'Configure consultation types (In-person, Telehealth)' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-surface-container rounded-lg hover:bg-surface-container-high cursor-pointer transition-colors">
              <div>
                <h4 className="font-label-md text-label-md text-on-background">{item.label}</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-on-surface-variant" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Billing & Payments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center">
            <DollarSign className="text-primary w-5 h-5" />
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-background">Billing & Payments</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Payment History', desc: 'View your earnings and transactions' },
            { label: 'Bank Details', desc: 'Manage your payout account' },
            { label: 'Invoice Settings', desc: 'Configure invoice generation' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-surface-container rounded-lg hover:bg-surface-container-high cursor-pointer transition-colors">
              <div>
                <h4 className="font-label-md text-label-md text-on-background">{item.label}</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-on-surface-variant" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center">
            <Bell className="text-primary w-5 h-5" />
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-background">Notification Preferences</h3>
        </div>
        <div className="space-y-4">
          {[
            { key: 'appointmentAlerts', label: 'Appointment Alerts', desc: 'New bookings and cancellations' },
            { key: 'patientUpdates', label: 'Patient Updates', desc: 'Lab results and messages' },
            { key: 'labResults', label: 'Lab Results', desc: 'When new results are uploaded' },
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
            { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Receive urgent notifications via SMS' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <h4 className="font-label-md text-label-md text-on-background">{item.label}</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-outline'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center">
            <Lock className="text-primary w-5 h-5" />
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-background">Security</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Change Password', desc: 'Update your account password' },
            { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security' },
            { label: 'Login Sessions', desc: 'Manage active login sessions' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-surface-container rounded-lg hover:bg-surface-container-high cursor-pointer transition-colors">
              <div>
                <h4 className="font-label-md text-label-md text-on-background">{item.label}</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-on-surface-variant" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* App & Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="space-y-3">
          {[
            { label: 'App Preferences', icon: Smartphone, desc: 'App settings and preferences' },
            { label: 'Help Center', icon: HelpCircle, desc: 'Get help and FAQs' },
            { label: 'Terms & Privacy', icon: FileText, desc: 'Legal information' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-surface-container rounded-lg hover:bg-surface-container-high cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <item.icon className="text-on-surface-variant w-5 h-5" />
                <div>
                  <h4 className="font-label-md text-label-md text-on-background">{item.label}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-on-surface-variant" />
            </div>
          ))}
          <button className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
            <div className="flex items-center gap-3">
              <LogOut className="text-red-600 w-5 h-5" />
              <div>
                <h4 className="font-label-md text-label-md text-red-600">Log Out</h4>
                <p className="font-body-sm text-body-sm text-red-400">Sign out of your account</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}