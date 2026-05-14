import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, AlertCircle, User, Calendar, Heart, Phone, Mail, Pill, Activity } from 'lucide-react'
import { appointmentsApi } from '../../api/appointments'

interface PatientInfo {
  id: number
  name: string
  email: string
  phone: string
  gender: string
  date_of_birth: string
  blood_type: string
  address: string
}

interface MedicalInfo {
  medical_history: string | null
  allergies: string | null
  emergency_contact: {
    name: string | null
    phone: string | null
    relation: string | null
  }
}

interface Appointment {
  id: number
  date: string
  time: string
  reason: string
  status: string
}

interface Prescription {
  id: number
  date: string
  diagnosis: string | null
  symptoms: string | null
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    duration: string
  }>
  instructions: string | null
}

interface MedicalHistoryData {
  patient: PatientInfo
  medical_info: MedicalInfo
  appointments: Appointment[]
  prescriptions: Prescription[]
}

export default function MedicalHistory() {
  const { patientId } = useParams<{ patientId?: string }>()
  const [data, setData] = useState<MedicalHistoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'prescriptions'>('overview')

  useEffect(() => {
    if (patientId) {
      fetchMedicalHistory()
    } else {
      setLoading(false)
    }
  }, [patientId])

  const fetchMedicalHistory = async () => {
    if (!patientId) return

    try {
      setLoading(true)
      setError('')
      const response = await appointmentsApi.getPatientMedicalHistory(parseInt(patientId))

      if (response.success && response.data) {
        setData(response.data)
      } else {
        setError(response.message || 'Failed to load medical history')
      }
    } catch (err) {
      console.error('Error fetching medical history:', err)
      setError('Failed to load medical history')
    } finally {
      setLoading(false)
    }
  }

  const calculateAge = (dob: string) => {
    if (!dob) return 'N/A'
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#d36135] mx-auto mb-4" />
          <p className="text-gray-600">Loading medical history...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex justify-center gap-3">
            <Link to="/doctor/patients" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Back to Patients
            </Link>
            <button onClick={fetchMedicalHistory} className="px-4 py-2 bg-[#d36135] text-white rounded-lg hover:bg-[#b5552d]">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!data && patientId) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Patient Not Found</h3>
          <p className="text-gray-600 mb-4">Unable to load patient data.</p>
          <Link to="/doctor/patients" className="text-[#d36135] hover:underline">
            Back to Patients
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/doctor/patients"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#273f2b]">Medical History</h1>
            {data?.patient && (
              <p className="text-gray-500 text-sm">{data.patient.name}</p>
            )}
          </div>
        </div>
        {data?.patient && (
          <Link
            to={`/doctor/prescription/${data.patient.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-[#d36135] text-white rounded-lg hover:bg-[#b5552d] transition-colors"
          >
            <Pill className="w-4 h-4" />
            Write Prescription
          </Link>
        )}
      </div>

      {/* No patient selected */}
      {!patientId && !data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center py-12"
        >
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-800 text-lg mb-2">No Patient Selected</h3>
          <p className="text-gray-500 mb-4">Please select a patient to view their medical history.</p>
          <Link
            to="/doctor/patients"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#d36135] text-white rounded-lg hover:bg-[#b5552d] transition-colors"
          >
            <User className="w-4 h-4" />
            Go to Patients
          </Link>
        </motion.div>
      )}

      {data && (
        <>
          {/* Patient Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#d36135] flex items-center justify-center text-white font-bold text-2xl">
                {(data.patient.name || 'P').charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-xl">{data.patient.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {data.patient.gender || 'N/A'}, {calculateAge(data.patient.date_of_birth)} years
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    Blood: {data.patient.blood_type || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {data.patient.phone || 'N/A'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {data.patient.email || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'appointments', label: 'Appointments', icon: Calendar },
              { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#d36135] text-[#d36135]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Medical Info */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#3e5641]" />
                    Medical Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Medical History</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg text-sm">
                        {data.medical_info.medical_history || 'No medical history recorded'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1">Allergies</label>
                      <p className={`p-3 rounded-lg text-sm ${data.medical_info.allergies ? 'bg-red-50 text-red-700' : 'text-gray-400 bg-gray-50'}`}>
                        {data.medical_info.allergies || 'No known allergies'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#d36135]" />
                    Emergency Contact
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-800">
                        {data.medical_info.emergency_contact.name || 'Not provided'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-800">
                        {data.medical_info.emergency_contact.phone || 'Not provided'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-500">Relation:</span>
                      <span className="text-gray-800">
                        {data.medical_info.emergency_contact.relation || 'Not provided'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-gray-800 text-lg mb-4">Visit Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#3e5641]/10 rounded-lg text-center">
                      <span className="text-2xl font-bold text-[#3e5641]">{data.appointments.length}</span>
                      <span className="text-sm text-gray-600 block">Total Visits</span>
                    </div>
                    <div className="p-4 bg-[#d36135]/10 rounded-lg text-center">
                      <span className="text-2xl font-bold text-[#d36135]">{data.prescriptions.length}</span>
                      <span className="text-sm text-gray-600 block">Prescriptions</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                {data.appointments.length === 0 ? (
                  <div className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">No Appointments</h3>
                    <p className="text-gray-500">This patient has no appointments with you.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {data.appointments.map((apt) => (
                      <div key={apt.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#3e5641]/10 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-[#3e5641]" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{apt.reason || 'Consultation'}</h4>
                            <p className="text-sm text-gray-500">{formatDate(apt.date)} at {apt.time}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                          apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div className="space-y-4">
                {data.prescriptions.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                    <Pill className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">No Prescriptions</h3>
                    <p className="text-gray-500">This patient has no prescriptions from you.</p>
                  </div>
                ) : (
                  data.prescriptions.map((rx) => (
                    <div key={rx.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-800">Prescription</h4>
                          <p className="text-sm text-gray-500">{formatDate(rx.date)}</p>
                        </div>
                        {rx.diagnosis && (
                          <span className="px-3 py-1 bg-[#3e5641]/10 text-[#3e5641] rounded-full text-xs font-medium">
                            {rx.diagnosis}
                          </span>
                        )}
                      </div>

                      {rx.symptoms && (
                        <div className="mb-4">
                          <label className="text-sm text-gray-500 block mb-1">Symptoms</label>
                          <p className="text-gray-800 bg-gray-50 p-3 rounded-lg text-sm">{rx.symptoms}</p>
                        </div>
                      )}

                      <div className="mb-4">
                        <label className="text-sm text-gray-500 block mb-2">Medications</label>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="text-left p-3 font-medium text-gray-600">Medicine</th>
                                <th className="text-left p-3 font-medium text-gray-600">Dosage</th>
                                <th className="text-left p-3 font-medium text-gray-600">Frequency</th>
                                <th className="text-left p-3 font-medium text-gray-600">Duration</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {rx.medications.map((med, idx) => (
                                <tr key={idx}>
                                  <td className="p-3 text-gray-800">{med.name}</td>
                                  <td className="p-3 text-gray-600">{med.dosage}</td>
                                  <td className="p-3 text-gray-600">{med.frequency}</td>
                                  <td className="p-3 text-gray-600">{med.duration}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {rx.instructions && (
                        <div>
                          <label className="text-sm text-gray-500 block mb-1">Instructions</label>
                          <p className="text-gray-800 bg-gray-50 p-3 rounded-lg text-sm">{rx.instructions}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  )
}