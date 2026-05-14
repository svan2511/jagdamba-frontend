import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FileText, Plus, Search, Calendar, User, Trash2, Eye, Download, X, Loader2, Upload, File } from 'lucide-react'
import toast from 'react-hot-toast'
import { reportsApi, type Report, type CreateReportData } from '../../api/reports'
import { appointmentsApi } from '../../api/appointments'
import FullPageLoader from '../../components/FullPageLoader'
import apiClient, { getFileUrl } from '../../api/client'

export default function DoctorReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [saving, setSaving] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [formData, setFormData] = useState<CreateReportData>({
    patient_id: 0,
    title: '',
    report_type: '',
    description: '',
    report_date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [reportsRes, patientsRes] = await Promise.all([
        reportsApi.getDoctorReports(),
        appointmentsApi.getDoctorPatients(),
      ])

      if (reportsRes.success && reportsRes.data) {
        setReports(reportsRes.data)
      }

      if (patientsRes.success && patientsRes.data) {
        setPatients(patientsRes.data)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.patient_id || !formData.title || !formData.report_type || !formData.report_date) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSaving(true)

      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('patient_id', formData.patient_id.toString())
      formDataToSend.append('title', formData.title)
      formDataToSend.append('report_type', formData.report_type)
      formDataToSend.append('description', formData.description || '')
      formDataToSend.append('report_date', formData.report_date)

      if (selectedFile) {
        formDataToSend.append('file', selectedFile)
      }

      const response = await apiClient.post('/doctor/reports', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        toast.success('Report added successfully')
        setShowAddModal(false)
        setFormData({
          patient_id: 0,
          title: '',
          report_type: '',
          description: '',
          report_date: new Date().toISOString().split('T')[0],
        })
        setSelectedFile(null)
        fetchData()
      } else {
        toast.error(response.data.message || 'Failed to add report')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add report')
    } finally {
      setSaving(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }
      setSelectedFile(file)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this report?')) return

    try {
      const response = await reportsApi.deleteDoctorReport(id)
      if (response.success) {
        toast.success('Report deleted')
        fetchData()
      } else {
        toast.error(response.message || 'Failed to delete report')
      }
    } catch (err) {
      toast.error('Failed to delete report')
    }
  }

  const filteredReports = reports.filter(rx =>
    rx.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rx.patient?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rx.report_type?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTypeColor = (type: string) => {
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
    return <FullPageLoader message="Loading reports..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">Medical Records</h1>
          <p className="text-gray-500 text-sm">Manage patient reports and test results</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#d36135] text-white rounded-lg hover:bg-[#b5552d] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Report
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 w-full md:w-64"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#d36135] flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-800">{reports.length}</span>
              <span className="text-sm text-gray-500 block">Total Reports</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-800">
                {reports.filter(r => r.report_type?.toLowerCase().includes('lab')).length}
              </span>
              <span className="text-sm text-gray-500 block">Lab Reports</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-800">
                {reports.filter(r => r.report_type?.toLowerCase().includes('diagnostic')).length}
              </span>
              <span className="text-sm text-gray-500 block">Diagnostic</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#3e5641] flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-800">
                {new Set(reports.map(r => r.patient?.id)).size}
              </span>
              <span className="text-sm text-gray-500 block">Patients</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Reports Found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'No reports match your search.' : 'No medical reports have been added yet.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Report</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Patient</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReports.map((report, index) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#d36135]/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-[#d36135]" />
                        </div>
                        <span className="font-medium text-gray-800">{report.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{report.patient?.user?.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(report.report_type)}`}>
                        {report.report_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(report.report_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                        {report.file_path && (
                          <a
                            href={getFileUrl(report.file_path)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download className="w-5 h-5 text-[#3e5641]" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Report Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Add Medical Report</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
                <select
                  value={formData.patient_id}
                  onChange={(e) => setFormData({ ...formData, patient_id: parseInt(e.target.value) })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                  required
                >
                  <option value={0}>Select Patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Complete Blood Count (CBC)"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type *</label>
                <select
                  value={formData.report_type}
                  onChange={(e) => setFormData({ ...formData, report_type: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Lab Report">Lab Report</option>
                  <option value="Diagnostic">Diagnostic</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Date *</label>
                <input
                  type="date"
                  value={formData.report_date}
                  onChange={(e) => setFormData({ ...formData, report_date: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter any notes or description..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
                  className="hidden"
                />
                {!selectedFile ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#d36135] hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500">Click to upload file (PDF, JPG, PNG, DOC)</span>
                    <span className="text-xs text-gray-400">Max file size: 10MB</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <File className="w-8 h-8 text-[#d36135]" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1 hover:bg-red-100 rounded"
                    >
                      <X className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#d36135] text-white rounded-lg hover:bg-[#b5552d] disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add Report
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* View Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-lg w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Report Details</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-lg bg-[#d36135]/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#d36135]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedReport.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(selectedReport.report_type)}`}>
                    {selectedReport.report_type}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Patient</label>
                  <p className="font-medium text-gray-800">{selectedReport.patient?.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Report Date</label>
                  <p className="font-medium text-gray-800">{formatDate(selectedReport.report_date)}</p>
                </div>
              </div>

              {selectedReport.description && (
                <div>
                  <label className="text-sm text-gray-500">Description</label>
                  <p className="text-gray-600">{selectedReport.description}</p>
                </div>
              )}

              {selectedReport.file_path && (
                <div>
                  <label className="text-sm text-gray-500">File</label>
                  <a
                    href={getFileUrl(selectedReport.file_path)}
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
                onClick={() => setSelectedReport(null)}
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