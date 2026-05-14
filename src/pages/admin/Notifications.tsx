import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, ChevronLeft, ChevronRight, Trash2, Check, Info, AlertTriangle, CheckCircle, XCircle, Eye, CheckCircle as CheckCircleFilled, Plus, X, Send, Loader2 } from 'lucide-react'
import { adminApi } from '../../api/admin'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import FullPageLoader from '../../components/FullPageLoader'

const notificationTypes = ['All Types', 'info', 'warning', 'success', 'error']
const statusOptions = ['All Status', 'unread', 'read']
const sendNotificationTypes = ['info', 'warning', 'success', 'error']

interface Notification {
  id: number
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
  user_name: string
}

export default function Notifications() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('All Types')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  // Send Notification Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendForm, setSendForm] = useState({
    title: '',
    message: '',
    type: 'info',
  })

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sendForm.title || !sendForm.message) {
      toast.error('Please fill all fields')
      return
    }

    try {
      setSending(true)
      await adminApi.createNotification(sendForm)
      toast.success('Notification sent successfully!')
      setIsComposeOpen(false)
      setSendForm({ title: '', message: '', type: 'info' })
      fetchNotifications()
    } catch {
      toast.error('Failed to send notification')
    } finally {
      setSending(false)
    }
  }

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await adminApi.getAllNotifications({
        page: currentPage,
        type: selectedType !== 'All Types' ? selectedType : undefined,
        is_read: selectedStatus !== 'All Status' ? selectedStatus : undefined,
      })

      if (response.success && response.data) {
        const notifData = response.data.data || response.data
        const transformed = notifData.map((notif: any) => ({
          id: notif.id,
          title: notif.title || 'Notification',
          message: notif.message || '',
          type: notif.type || 'info',
          is_read: notif.is_read !== false,
          created_at: notif.created_at || '',
          user_name: notif.user?.name || 'System',
        }))
        setNotifications(transformed)

        const paginationData = response.data
        if (paginationData && typeof paginationData === 'object') {
          setTotalItems(paginationData.total || notifData.length)
          setTotalPages(paginationData.last_page || Math.ceil((paginationData.total || notifData.length) / itemsPerPage) || 1)
        } else {
          setTotalItems(notifData.length)
          setTotalPages(Math.ceil(notifData.length / itemsPerPage) || 1)
        }
      } else {
        setNotifications([])
        setError(response.message || 'Failed to load notifications')
      }
    } catch {
      setNotifications([])
      setError('Failed to load notifications. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [currentPage, selectedType, selectedStatus])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchNotifications()
  }, [currentPage, selectedType, selectedStatus, debouncedSearch])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Delete Notification',
      html: 'Are you sure you want to delete this notification?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    })
    if (!result.isConfirmed) return

    try {
      await adminApi.deleteNotification(id)
      toast.success('Notification deleted successfully!')
      fetchNotifications()
    } catch {
      toast.error('Failed to delete notification')
    }
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await adminApi.markNotificationRead(id)
      toast.success('Notification marked as read!')
      fetchNotifications()
    } catch {
      toast.error('Failed to mark as read')
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-5 h-5 text-blue-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100'
      case 'warning': return 'bg-yellow-100'
      case 'success': return 'bg-green-100'
      case 'error': return 'bg-red-100'
      default: return 'bg-gray-100'
    }
  }

  // Local filter for search
  const filteredNotifications = notifications.filter(notif =>
    notif.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    notif.message.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">Notifications</h1>
          <p className="text-gray-500 text-sm">View and manage all notifications</p>
        </div>
        <button onClick={() => setIsComposeOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#d36135] text-white rounded-lg font-medium hover:bg-[#b5552d] transition-colors">
          <Plus className="w-4 h-4" /> Send Notification
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total', value: totalItems.toLocaleString() || '0', icon: Bell, color: 'bg-[#3e5641]' },
          { label: 'Unread', value: notifications.filter(n => !n.is_read).length.toString() || '0', icon: Eye, color: 'bg-yellow-500' },
          { label: 'Read', value: notifications.filter(n => n.is_read).length.toString() || '0', icon: CheckCircleFilled, color: 'bg-green-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                <span className="text-sm text-gray-500 block">{stat.label}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search notifications..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20" />
          </div>
          <div className="flex gap-3">
            <select value={selectedType} onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20">
              {notificationTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20">
              {statusOptions.map(s => <option key={s} value={s}>{s === 'All Status' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Notifications List */}
      {loading ? (
        <FullPageLoader message="Loading notifications..." />
      ) : error ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={fetchNotifications} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Try Again</button>
          </div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Notifications Found</h3>
            <p className="text-gray-600">
              {debouncedSearch || selectedType !== 'All Types' || selectedStatus !== 'All Status' ? 'No notifications match your filters.' : 'No notifications yet.'}
            </p>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 hover:bg-gray-50/50 ${!notif.is_read ? 'bg-blue-50/30' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full ${getTypeBg(notif.type)} flex items-center justify-center flex-shrink-0`}>
                    {getTypeIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium text-gray-800 ${!notif.is_read ? 'font-semibold' : ''}`}>{notif.title}</span>
                      {!notif.is_read && (
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">New</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{notif.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>From: {notif.user_name}</span>
                      <span>{new Date(notif.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notif.is_read && (
                      <button onClick={() => handleMarkAsRead(notif.id)} className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors" title="Mark as read">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(notif.id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Pagination */}
      {totalItems > 0 && filteredNotifications.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Previous</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-2 rounded-lg text-sm ${currentPage === page ? 'bg-[#3e5641] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>{page}</button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">Next <ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Send Notification Modal */}
      <AnimatePresence>
        {isComposeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsComposeOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Send Notification</h2>
                <button onClick={() => setIsComposeOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSendNotification} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={sendForm.title}
                    onChange={(e) => setSendForm({ ...sendForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                    placeholder="Notification title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={sendForm.message}
                    onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                    placeholder="Notification message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={sendForm.type}
                    onChange={(e) => setSendForm({ ...sendForm, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                  >
                    {sendNotificationTypes.map(t => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsComposeOpen(false)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={sending} className="px-4 py-2.5 bg-[#3e5641] text-white rounded-lg hover:bg-[#2d4030] disabled:opacity-50 flex items-center gap-2">
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}