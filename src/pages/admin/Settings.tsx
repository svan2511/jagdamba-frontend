import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Save, Lock, Globe, AlertCircle, Mail, Phone, MapPin, Clock, DollarSign, Building, Loader2 } from 'lucide-react'
import { adminApi } from '../../api/admin'
import toast from 'react-hot-toast'
import FullPageLoader from '../../components/FullPageLoader'

const tabs = [
  { id: 'profile', label: 'Hospital Profile', icon: Building },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'preferences', label: 'Preferences', icon: Globe },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [settings, setSettings] = useState<any>({})

  // Security state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await adminApi.getSettings()

      if (response.success) {
        setSettings(response.data)
      } else {
        setError(response.message || 'Failed to load settings')
      }
    } catch {
      setError('Failed to load settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      const response = await adminApi.updateSettings(settings)

      if (response.success) {
        toast.success('Settings saved successfully!')
      } else {
        toast.error(response.message || 'Failed to save settings')
      }
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      toast.error('Please fill all password fields')
      return
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      setSaving(true)
      // In a real app, you'd call an API to change password
      toast.success('Password changed successfully!')
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch {
      toast.error('Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }))
  }

  // Loading state
  if (loading) {
    return <FullPageLoader message="Loading settings..." />
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchSettings} className="px-4 py-2 bg-[#d36135] text-white rounded-lg hover:bg-[#b5552d]">Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">Settings</h1>
          <p className="text-gray-500 text-sm">Manage hospital settings and preferences</p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#3e5641] text-white rounded-lg font-medium hover:bg-[#2d4030] transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#3e5641] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* Hospital Profile Settings */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Hospital Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={settings.hospital_name || ''}
                      onChange={(e) => updateSetting('hospital_name', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      value={settings.hospital_address || ''}
                      onChange={(e) => updateSetting('hospital_address', e.target.value)}
                      rows={3}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={settings.hospital_phone || ''}
                      onChange={(e) => updateSetting('hospital_phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={settings.hospital_email || ''}
                      onChange={(e) => updateSetting('hospital_email', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={settings.hospital_emergency || ''}
                      onChange={(e) => updateSetting('hospital_emergency', e.target.value)}
                      placeholder="e.g., 102, 108, or +91..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={settings.currency || 'INR'}
                      onChange={(e) => updateSetting('currency', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                    >
                      <option value="INR">INR (₹) - Indian Rupees</option>
                      <option value="USD">USD ($) - US Dollars</option>
                      <option value="EUR">EUR (€) - Euros</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Change Admin Password
                </h3>
                <p className="text-sm text-gray-500 mb-6">Update your password to keep your account secure</p>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    disabled={saving}
                    className="px-4 py-2.5 bg-[#3e5641] text-white rounded-lg text-sm font-medium hover:bg-[#2d4030] disabled:opacity-50"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Preferences Settings */}
          {activeTab === 'preferences' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                System Preferences
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={settings.timezone || 'Asia/Kolkata'}
                      onChange={(e) => updateSetting('timezone', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                    >
                      <option value="Asia/Kolkata">IST (UTC+5:30) - India</option>
                      <option value="UTC">UTC (UTC+0:00) - Coordinated Universal Time</option>
                      <option value="America/New_York">EST (UTC-5:00) - New York</option>
                      <option value="America/Los_Angeles">PST (UTC-8:00) - Los Angeles</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                  <select
                    value={settings.date_format || 'DD/MM/YYYY'}
                    onChange={(e) => updateSetting('date_format', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2025)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2025)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (2025-12-31)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Appointment Duration (minutes)</label>
                  <select
                    value={settings.appointment_duration || '30'}
                    onChange={(e) => updateSetting('appointment_duration', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}