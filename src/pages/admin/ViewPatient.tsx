import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Phone, Calendar, Heart, FileText, Loader2, MapPin, Droplet, User } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { adminApi, type PatientResponse } from '../../api/admin'

export default function ViewPatient() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [patient, setPatient] = useState<PatientResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return

      try {
        setLoading(true)
        const response = await adminApi.getPatient(parseInt(id))

        if (response.success && response.data) {
          setPatient(response.data)
        } else {
          toast.error('Patient not found')
          navigate('/admin/patients')
        }
      } catch {
        toast.error('Failed to load patient details')
        navigate('/admin/patients')
      } finally {
        setLoading(false)
      }
    }

    fetchPatient()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!patient) {
    return null
  }

  const name = patient.name || 'Patient'
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const status = patient.is_active !== false ? 'Active' : 'Inactive'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/patients')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#273f2b]">Patient Details</h1>
            <p className="text-gray-500 text-sm">View patient information</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-[#3e5641] flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-white">{initials}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{name}</h2>
            <p className="text-gray-500 text-sm">Patient</p>
            <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
              status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {status}
            </span>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{patient.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{patient.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Joined: {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </motion.div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Gender</span>
                  <span className="font-medium text-gray-800">{patient.gender || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Date of Birth</span>
                  <span className="font-medium text-gray-800">{patient.date_of_birth || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <Droplet className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Blood Group</span>
                  <span className="font-medium text-gray-800">{patient.blood_group || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Address</span>
                  <span className="font-medium text-gray-800">{patient.address || 'N/A'}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Medical Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Medical Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-[#3e5641]" />
                  <span className="text-sm font-medium text-gray-600">Appointments</span>
                </div>
                <span className="text-2xl font-bold text-gray-800">0</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-[#d36135]" />
                  <span className="text-sm font-medium text-gray-600">Prescriptions</span>
                </div>
                <span className="text-2xl font-bold text-gray-800">0</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-[#83bca9]" />
                  <span className="text-sm font-medium text-gray-600">Reports</span>
                </div>
                <span className="text-2xl font-bold text-gray-800">0</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}