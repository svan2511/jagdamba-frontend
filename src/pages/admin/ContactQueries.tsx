import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Mail, Search, Eye, Trash2, CheckCircle, Clock, XCircle, MessageSquare, X } from 'lucide-react'
import { adminApi } from '../../api/admin'
import FullPageLoader from '../../components/FullPageLoader'
import toast from 'react-hot-toast'

interface Contact {
  id: number
  name: string
  email: string
  phone: string | null
  department: string | null
  message: string
  status: 'new' | 'read' | 'replied' | 'closed'
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export default function ContactQueries() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 })
  const [stats, setStats] = useState({ total: 0, new: 0, read: 0, replied: 0, closed: 0 })

  const fetchContacts = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      setError('')
      const response = await adminApi.getContacts({
        page,
        search: search || undefined,
        status: statusFilter || undefined,
      })

      if (response.success) {
        setContacts(response.data)
        if (response.pagination) {
          setPagination(response.pagination)
        }
      } else {
        setError(response.message || 'Failed to load contacts')
      }
    } catch (err) {
      setError('Failed to load contacts. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  const fetchStats = useCallback(async () => {
    try {
      const response = await adminApi.getContactStats()
      if (response.success) {
        setStats(response.data)
      }
    } catch (err) {
      console.error('Failed to load stats')
    }
  }, [])

  useEffect(() => {
    fetchContacts()
    fetchStats()
  }, [fetchContacts, fetchStats])

  const handleViewContact = async (contact: Contact) => {
    setSelectedContact(contact)
    if (contact.status === 'new') {
      try {
        await adminApi.updateContact(contact.id, { status: 'read' })
        const updatedContact = { ...contact, status: 'read' as const }
        setSelectedContact(updatedContact)
        setContacts(prev => prev.map(c => c.id === contact.id ? updatedContact : c))
        fetchStats()
      } catch (err) {
        console.error('Failed to mark as read')
      }
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await adminApi.updateContact(id, { status: newStatus })
      if (response.success) {
        toast.success('Status updated')
        setContacts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus as Contact['status'] } : c))
        if (selectedContact?.id === id) {
          setSelectedContact({ ...selectedContact, status: newStatus as Contact['status'] })
        }
        fetchStats()
      }
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact query?')) return
    try {
      const response = await adminApi.deleteContact(id)
      if (response.success) {
        toast.success('Contact deleted')
        setContacts(prev => prev.filter(c => c.id !== id))
        if (selectedContact?.id === id) {
          setSelectedContact(null)
        }
        fetchStats()
      }
    } catch (err) {
      toast.error('Failed to delete contact')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-700'
      case 'read': return 'bg-blue-100 text-blue-700'
      case 'replied': return 'bg-green-100 text-green-700'
      case 'closed': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="w-3 h-3" />
      case 'read': return <Eye className="w-3 h-3" />
      case 'replied': return <CheckCircle className="w-3 h-3" />
      case 'closed': return <XCircle className="w-3 h-3" />
      default: return <Clock className="w-3 h-3" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">Contact Queries</h1>
          <p className="text-gray-500 text-sm">Manage and respond to contact form submissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-[#3e5641]' },
          { label: 'New', value: stats.new, color: 'bg-red-500' },
          { label: 'Read', value: stats.read, color: 'bg-blue-500' },
          { label: 'Replied', value: stats.replied, color: 'bg-green-500' },
          { label: 'Closed', value: stats.closed, color: 'bg-gray-500' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
            <span className="text-xs text-gray-500 block">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-[#3e5641] focus:outline-none transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2.5 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-[#3e5641] focus:outline-none transition-all text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
        <button
          onClick={() => fetchContacts(1)}
          className="px-4 py-2.5 bg-[#3e5641] text-white rounded-lg font-medium text-sm hover:bg-[#2d4030] transition-colors"
        >
          Apply Filters
        </button>
      </div>

      {/* Contacts List */}
      {loading ? (
        <FullPageLoader message="Loading contacts..." />
      ) : error ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={() => fetchContacts()} className="px-4 py-2 bg-[#d36135] text-white rounded-lg hover:bg-[#b5552d]">Try Again</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact List */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">All Contacts ({pagination.total})</h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {contacts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No contacts found</p>
                </div>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => handleViewContact(contact)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedContact?.id === contact.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-800">{contact.name}</span>
                      <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(contact.status)}`}>
                        {getStatusIcon(contact.status)}
                        {contact.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{contact.email}</p>
                    <p className="text-xs text-gray-400 mt-1 truncate">{contact.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(contact.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="p-4 border-t border-gray-100 flex justify-center gap-2">
                <button
                  onClick={() => fetchContacts(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="px-3 py-1 bg-gray-100 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-200 transition-colors"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm text-gray-600">
                  Page {pagination.current_page} of {pagination.last_page}
                </span>
                <button
                  onClick={() => fetchContacts(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-3 py-1 bg-gray-100 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-200 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {selectedContact ? (
              <>
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">Contact Details</h3>
                    <p className="text-xs text-gray-500">
                      Received on {new Date(selectedContact.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="px-3 py-2 bg-gray-100 border border-transparent rounded-lg text-sm focus:bg-white focus:border-[#3e5641] focus:outline-none transition-all"
                      value={selectedContact.status}
                      onChange={(e) => handleStatusChange(selectedContact.id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      onClick={() => handleDelete(selectedContact.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedContact(null)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-xs text-gray-500 block mb-1">Name</label>
                      <p className="font-medium text-gray-800">{selectedContact.name}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-xs text-gray-500 block mb-1">Email</label>
                      <a href={`mailto:${selectedContact.email}`} className="font-medium text-[#d36135] hover:underline">
                        {selectedContact.email}
                      </a>
                    </div>
                    {selectedContact.phone && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="text-xs text-gray-500 block mb-1">Phone</label>
                        <a href={`tel:${selectedContact.phone}`} className="font-medium text-gray-800 hover:text-[#d36135]">
                          {selectedContact.phone}
                        </a>
                      </div>
                    )}
                    {selectedContact.department && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="text-xs text-gray-500 block mb-1">Department</label>
                        <p className="font-medium text-gray-800">{selectedContact.department}</p>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-xs text-gray-500 block mb-2">Message</label>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <p className="text-gray-800 whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`mailto:${selectedContact.email}?subject=Re: Maa Jagdamba Hospital - Contact Query`}
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#3e5641] text-white rounded-lg font-medium text-sm hover:bg-[#2d4030] transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Reply via Email
                    </a>
                    {selectedContact.phone && (
                      <a
                        href={`tel:${selectedContact.phone}`}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#d36135] text-white rounded-lg font-medium text-sm hover:bg-[#b5552d] transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Call Now
                      </a>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                <Eye className="w-16 h-16 mb-4 text-gray-300" />
                <p className="text-lg font-medium">Select a contact to view details</p>
                <p className="text-sm text-gray-400">Click on any contact from the list</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}