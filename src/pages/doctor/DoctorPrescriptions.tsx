import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Search, Pill, Calendar, User, ChevronRight, AlertCircle } from 'lucide-react'
import { prescriptionsApi } from '../../api/prescriptions'
import type { Prescription } from '../../api/prescriptions'
import FullPageLoader from '../../components/FullPageLoader'

export default function DoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    try {
      setLoading(true)
      const response = await prescriptionsApi.getDoctorPrescriptions()

      if (response.success && response.data) {
        setPrescriptions(response.data)
      } else {
        setError(response.message || 'Failed to load prescriptions')
      }
    } catch (err) {
      console.error('Error fetching prescriptions:', err)
      setError('Failed to load prescriptions')
    } finally {
      setLoading(false)
    }
  }

  const filteredPrescriptions = prescriptions.filter(rx =>
    rx.patient?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rx.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return <FullPageLoader message="Loading prescriptions..." />
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchPrescriptions} className="px-4 py-2 bg-[#d36135] text-white rounded-lg hover:bg-[#b5552d]">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">My Prescriptions</h1>
          <p className="text-gray-500 text-sm">View and manage prescriptions you've written</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search prescriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#d36135] flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-800">{prescriptions.length}</span>
              <span className="text-sm text-gray-500 block">Total Prescriptions</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#3e5641] flex items-center justify-center">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-800">
                {prescriptions.reduce((sum, rx) => sum + (rx.medications?.length || 0), 0)}
              </span>
              <span className="text-sm text-gray-500 block">Medications Prescribed</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#83bca9] flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-800">
                {new Set(prescriptions.map(rx => rx.patient?.id)).size}
              </span>
              <span className="text-sm text-gray-500 block">Unique Patients</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prescriptions List */}
      {filteredPrescriptions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Prescriptions Found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'No prescriptions match your search.' : 'You haven\'t written any prescriptions yet.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPrescriptions.map((rx, index) => (
            <motion.div
              key={rx.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#d36135]/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-[#d36135]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {rx.patient?.user?.name || 'Unknown Patient'}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(rx.created_at)}
                      </span>
                      {rx.diagnosis && (
                        <span className="px-2 py-0.5 bg-[#3e5641]/10 text-[#3e5641] rounded text-xs">
                          {rx.diagnosis}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {rx.medications?.length || 0} medication(s)
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Medications Preview */}
              {rx.medications && rx.medications.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {rx.medications.slice(0, 3).map((med, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs">
                        {med.name}
                      </span>
                    ))}
                    {rx.medications.length > 3 && (
                      <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-xs">
                        +{rx.medications.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}