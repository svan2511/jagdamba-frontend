import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Pill, Calendar, User, AlertCircle } from 'lucide-react'
import { prescriptionsApi, type Prescription } from '../../api/prescriptions'
import FullPageLoader from '../../components/FullPageLoader'

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    try {
      setLoading(true)
      const response = await prescriptionsApi.getMyPrescriptions()

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
      <div>
        <h1 className="text-2xl font-bold text-[#273f2b]">My Prescriptions</h1>
        <p className="text-gray-500 text-sm mt-1">View your prescription history and details</p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pill className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Prescriptions Found</h3>
            <p className="text-gray-500">You don't have any prescriptions yet.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prescriptions.map((rx, index) => (
            <motion.div
              key={rx.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-[#d36135]/10 flex items-center justify-center mb-4">
                <Pill className="text-[#d36135] w-6 h-6" />
              </div>

              {/* Diagnosis */}
              {rx.diagnosis && (
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-[#3e5641]/10 text-[#3e5641] rounded-full text-xs font-medium">
                    {rx.diagnosis}
                  </span>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(rx.created_at)}</span>
              </div>

              {/* Doctor Info */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-[#3e5641]/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-[#3e5641]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{rx.doctor?.user?.name || 'Doctor'}</p>
                  <p className="text-xs text-gray-500">{rx.doctor?.specialty || ''}</p>
                </div>
              </div>

              {/* Medications */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Medications:</h4>
                {rx.medications && rx.medications.length > 0 ? (
                  rx.medications.map((med, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3">
                      <p className="font-medium text-gray-800 text-sm">{med.name}</p>
                      <p className="text-xs text-gray-500">
                        {med.dosage} - {med.frequency} - {med.duration}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No medications listed</p>
                )}
              </div>

              {/* Instructions */}
              {rx.instructions && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Instructions:</h4>
                  <p className="text-sm text-gray-600">{rx.instructions}</p>
                </div>
              )}

              {/* Follow-up Date */}
              {rx.follow_up_date && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-[#d36135]" />
                    <span className="text-gray-600">Follow-up: </span>
                    <span className="font-medium text-gray-800">{formatDate(rx.follow_up_date)}</span>
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