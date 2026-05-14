import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Eye, Calendar, AlertCircle } from 'lucide-react'
import { reportsApi, type Report } from '../../api/reports'
import { getFileUrl } from '../../api/client'
import FullPageLoader from '../../components/FullPageLoader'

export default function MedicalRecords() {
  const [records, setRecords] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<Report | null>(null)

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const response = await reportsApi.getMyReports()

      if (response.success && response.data) {
        setRecords(response.data)
      } else {
        setError(response.message || 'Failed to load medical records')
      }
    } catch (err) {
      console.error('Error fetching records:', err)
      setError('Failed to load medical records')
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

  const getStatusColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'lab report':
        return 'bg-blue-100 text-blue-700'
      case 'diagnostic':
        return 'bg-purple-100 text-purple-700'
      case 'prescription':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return <FullPageLoader message="Loading medical records..." />
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
          <button onClick={fetchRecords} className="px-4 py-2 bg-[#d36135] text-white rounded-lg hover:bg-[#b5552d]">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#273f2b]">Medical Records</h1>
        <p className="text-gray-500 text-sm mt-1">View your medical reports and test results</p>
      </div>

      {records.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Medical Records Found</h3>
            <p className="text-gray-500">You don't have any medical records yet.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="space-y-4">
            {records.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#3e5641]/50 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#d36135]/10 flex items-center justify-center">
                    <FileText className="text-[#d36135] w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{record.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formatDate(record.report_date)}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.report_type)}`}>
                        {record.report_type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedRecord(record)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                  {record.file_path && (
                    <a
                      href={getFileUrl(record.file_path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-5 h-5 text-[#3e5641]" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Record Details</h2>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Eye className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Title</label>
                <p className="font-medium text-gray-800">{selectedRecord.title}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Type</label>
                <p className="font-medium text-gray-800">{selectedRecord.report_type}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Date</label>
                <p className="font-medium text-gray-800">{formatDate(selectedRecord.report_date)}</p>
              </div>

              {selectedRecord.description && (
                <div>
                  <label className="text-sm text-gray-500">Description</label>
                  <p className="text-gray-600">{selectedRecord.description}</p>
                </div>
              )}

              {selectedRecord.file_path && (
                <div>
                  <label className="text-sm text-gray-500">File</label>
                  <a
                    href={getFileUrl(selectedRecord.file_path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#d36135] hover:underline"
                  >
                    <Download className="w-4 h-4" />
                    View/Download File
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}