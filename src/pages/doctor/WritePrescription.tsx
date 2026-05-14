import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Trash2, FileText, Save, Printer, User, Calendar, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { appointmentsApi } from '../../api/appointments'
import { prescriptionsApi } from '../../api/prescriptions'

interface PatientInfo {
  id: number
  name: string
  email: string
  phone: string
  gender: string
  date_of_birth: string
  blood_type: string
  address: string
  total_visits: number
  last_visit: string
  last_reason: string
}

interface Appointment {
  id: number
  appointment_date: string
  appointment_time: string
  reason: string
  status: string
}

interface Medication {
  id: number
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

export default function WritePrescription() {
  const { patientId } = useParams<{ patientId?: string }>()
  const navigate = useNavigate()

  const [patient, setPatient] = useState<PatientInfo | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | ''>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [medications, setMedications] = useState<Medication[]>([
    { id: 1, name: '', dosage: '', frequency: '', duration: '', instructions: '' },
  ])
  const [chiefComplaint, setChiefComplaint] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [notes, setNotes] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')

  useEffect(() => {
    if (patientId) {
      fetchPatientData()
    } else {
      setLoading(false)
    }
  }, [patientId])

  const fetchPatientData = async () => {
    if (!patientId) return

    try {
      setLoading(true)
      const response = await appointmentsApi.getDoctorPatientDetails(parseInt(patientId))

      if (response.success && response.data) {
        setPatient(response.data)
        // Fetch appointments to find one to attach prescription to
        const aptResponse = await appointmentsApi.getDoctorAppointments({ status: 'confirmed' })
        if (aptResponse.success && aptResponse.data) {
          // Filter appointments for this patient
          const patientAppointments = aptResponse.data.filter(
            (apt: any) => apt.patient?.id === parseInt(patientId)
          )
          setAppointments(patientAppointments)
          // Select the most recent one if available
          if (patientAppointments.length > 0) {
            setSelectedAppointmentId(patientAppointments[0].id)
          }
        }
      } else {
        toast.error(response.message || 'Failed to load patient')
      }
    } catch (error) {
      console.error('Error fetching patient:', error)
      toast.error('Failed to load patient data')
    } finally {
      setLoading(false)
    }
  }

  const addMedication = () => {
    setMedications([...medications, { id: Date.now(), name: '', dosage: '', frequency: '', duration: '', instructions: '' }])
  }

  const removeMedication = (id: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter(m => m.id !== id))
    }
  }

  const updateMedication = (id: number, field: keyof Medication, value: string) => {
    setMedications(medications.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const handleSave = async () => {
    // Validation
    if (!selectedAppointmentId) {
      toast.error('Please select an appointment')
      return
    }

    const filledMeds = medications.filter(m => m.name.trim() !== '')
    if (filledMeds.length === 0) {
      toast.error('Please add at least one medication')
      return
    }

    try {
      setSaving(true)

      const data = {
        appointment_id: selectedAppointmentId as number,
        diagnosis: diagnosis || undefined,
        symptoms: chiefComplaint || undefined,
        medications: filledMeds.map(m => ({
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration,
          instructions: m.instructions || undefined,
        })),
        instructions: notes || undefined,
        follow_up_date: followUpDate || undefined,
      }

      const response = await prescriptionsApi.createPrescription(data)

      if (response.success) {
        toast.success('Prescription saved successfully!')
        navigate('/doctor/prescriptions')
      } else {
        toast.error(response.message || 'Failed to save prescription')
      }
    } catch (error: any) {
      console.error('Error saving prescription:', error)
      toast.error(error.response?.data?.message || 'Failed to save prescription')
    } finally {
      setSaving(false)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#d36135] mx-auto mb-4" />
          <p className="text-gray-600">Loading patient data...</p>
        </div>
      </div>
    )
  }

  if (!patient && patientId) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
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
            <h1 className="text-2xl font-bold text-[#273f2b]">Write Prescription</h1>
            {patient && (
              <p className="text-gray-500 text-sm">For {patient.name}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#d36135] text-white rounded-lg hover:bg-[#b5552d] transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>

      {/* Patient Info */}
      {patient && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-[#d36135] flex items-center justify-center text-white font-bold text-2xl">
              {(patient.name || 'P').charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-lg">{patient.name}</h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span>{patient.gender || 'N/A'}</span>
                <span>•</span>
                <span>{calculateAge(patient.date_of_birth)} years</span>
                <span>•</span>
                <span>Blood: {patient.blood_type || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Last Visit: {patient.last_visit || 'N/A'}</span>
              </div>
            </div>

            {/* Appointment Selection */}
            {appointments.length > 0 && (
              <div className="min-w-[250px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Appointment
                </label>
                <select
                  value={selectedAppointmentId}
                  onChange={(e) => setSelectedAppointmentId(e.target.value as unknown as number)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                >
                  <option value="">Select an appointment</option>
                  {appointments.map((apt) => (
                    <option key={apt.id} value={apt.id}>
                      {apt.appointment_date} - {apt.reason || 'Consultation'}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {appointments.length === 0 && (
              <div className="text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                No confirmed appointments found
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* No patient selected */}
      {!patientId && !patient && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center py-12"
        >
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-800 text-lg mb-2">No Patient Selected</h3>
          <p className="text-gray-500 mb-4">Please select a patient from the patients list to write a prescription.</p>
          <Link
            to="/doctor/patients"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#d36135] text-white rounded-lg hover:bg-[#b5552d] transition-colors"
          >
            <User className="w-4 h-4" />
            Go to Patients
          </Link>
        </motion.div>
      )}

      {/* Clinical Information */}
      {patient && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <h3 className="font-semibold text-gray-800 text-lg mb-6">Clinical Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chief Complaint</label>
              <input
                type="text"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="Patient's main concern"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Primary diagnosis"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Medications */}
      {patient && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-800 text-lg">Medications</h3>
            <button
              onClick={addMedication}
              className="flex items-center gap-2 px-3 py-2 bg-[#3e5641]/10 text-[#3e5641] rounded-lg text-sm font-medium hover:bg-[#3e5641]/20 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Medication
            </button>
          </div>

          <div className="space-y-4">
            {medications.map((med, index) => (
              <div key={med.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-medium text-gray-600">Medication {index + 1}</span>
                  {medications.length > 1 && (
                    <button onClick={() => removeMedication(med.id)} className="p-1 hover:bg-red-100 rounded transition-colors">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Medicine Name</label>
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) => updateMedication(med.id, 'name', e.target.value)}
                      placeholder="e.g., Amlodipine 5mg"
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Dosage</label>
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)}
                      placeholder="e.g., 1 tablet"
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Frequency</label>
                    <select
                      value={med.frequency}
                      onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                    >
                      <option value="">Select</option>
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">Three times daily</option>
                      <option value="Four times daily">Four times daily</option>
                      <option value="As needed">As needed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Duration</label>
                    <input
                      type="text"
                      value={med.duration}
                      onChange={(e) => updateMedication(med.id, 'duration', e.target.value)}
                      placeholder="e.g., 7 days"
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs text-gray-500 mb-1">Special Instructions</label>
                  <input
                    type="text"
                    value={med.instructions}
                    onChange={(e) => updateMedication(med.id, 'instructions', e.target.value)}
                    placeholder="e.g., Take after food"
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Additional Notes */}
      {patient && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <h3 className="font-semibold text-gray-800 text-lg mb-4">Additional Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional instructions or notes for the patient..."
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 resize-none h-32"
          />
        </motion.div>
      )}

      {/* Actions */}
      {patient && (
        <div className="flex justify-end gap-4">
          <Link
            to="/doctor/patients"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-[#d36135] text-white rounded-lg text-sm font-medium hover:bg-[#b5552d] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            Generate Prescription
          </button>
        </div>
      )}
    </div>
  )
}