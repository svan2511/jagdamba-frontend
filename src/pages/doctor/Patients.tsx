import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, Mail, Calendar, Activity, Heart, Search, ChevronRight, AlertCircle, Users, Loader2 } from 'lucide-react'
import { appointmentsApi } from '../../api/appointments'
import FullPageLoader from '../../components/FullPageLoader'

interface Patient {
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

export default function DoctorPatients() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const fetchPatients = useCallback(async (isSearching = false) => {
    try {
      if (isSearching) setLoading(true)
      setError('')
      const response = await appointmentsApi.getDoctorPatients()

      if (response.success && response.data) {
        setPatients(response.data)
      } else {
        setError(response.message || 'Failed to load patients')
      }
    } catch {
      setError('Failed to load patients. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      if (searchTerm) {
        fetchPatients(true)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, fetchPatients])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  const filteredPatients = patients.filter(p =>
    p.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    p.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    p.phone?.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  // Stats
  const totalPatients = patients.length

  // Loading state
  if (loading && patients.length === 0) {
    return <FullPageLoader message="Loading patients..." />
  }

  // Error state
  if (error && patients.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => fetchPatients(false)} className="px-4 py-2 bg-[#d36135] text-white rounded-lg hover:bg-[#b5552d]">Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">My Patients</h1>
          <p className="text-gray-500 text-sm">View and manage your patients</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Patients', value: totalPatients, icon: Users, color: 'bg-[#3e5641]' },
          { label: 'Total Visits', value: patients.reduce((sum, p) => sum + p.total_visits, 0), icon: Calendar, color: 'bg-[#d36135]' },
          { label: 'Active This Month', value: patients.filter(p => p.last_visit && new Date(p.last_visit) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length, icon: Activity, color: 'bg-[#83bca9]' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                <span className="text-sm text-gray-500 block">{stat.label}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Patients List */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#d36135] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Patients Found</h3>
            <p className="text-gray-500">
              {debouncedSearch ? 'No patients match your search.' : 'No patients have visited you yet.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedPatient(patient)}
                className={`bg-white rounded-xl p-5 border border-gray-100 shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-[#3e5641]/50 ${
                  selectedPatient?.id === patient.id ? 'border-[#3e5641] shadow-md' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#d36135] flex items-center justify-center text-white font-bold text-lg">
                      {(patient.name || 'P').charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{patient.name}</h3>
                      <p className="text-sm text-gray-500">{patient.gender || 'N/A'} • {patient.total_visits} visits</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-[#3e5641]/10 text-[#3e5641] rounded-full text-xs font-medium">
                      {patient.total_visits} visits
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{patient.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Last: {patient.last_visit || 'N/A'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Patient Details Panel */}
          {selectedPatient && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-fit"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-[#d36135] flex items-center justify-center mx-auto mb-3 text-white font-bold text-2xl">
                  {(selectedPatient.name || 'P').charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{selectedPatient.name}</h3>
                <p className="text-sm text-gray-500">{selectedPatient.last_reason || 'General consultation'}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selectedPatient.phone || 'No phone'}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selectedPatient.email || 'No email'}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">Last: {selectedPatient.last_visit || 'N/A'}</span>
                </div>
                {selectedPatient.blood_type && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Heart className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Blood: {selectedPatient.blood_type}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <span className="text-xs text-gray-500 block">Total Visits</span>
                  <span className="text-lg font-bold text-gray-800">{selectedPatient.total_visits}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <span className="text-xs text-gray-500 block">Gender</span>
                  <span className="text-lg font-bold text-gray-800">{selectedPatient.gender || 'N/A'}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <Link
                  to={`/doctor/prescription/${selectedPatient.id}`}
                  className="w-full bg-[#d36135] text-white px-4 py-3 rounded-lg font-medium text-center hover:bg-[#b5552d] transition-colors"
                >
                  Write Prescription
                </Link>
                <Link
                  to={`/doctor/medical-history/${selectedPatient.id}`}
                  className="w-full bg-[#3e5641]/10 text-[#3e5641] px-4 py-3 rounded-lg font-medium text-center hover:bg-[#3e5641]/20 transition-colors"
                >
                  View Medical History
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}