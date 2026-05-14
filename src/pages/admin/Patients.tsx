import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Plus, Trash2, Eye, Phone, Mail, Calendar, Heart, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import { adminApi } from '../../api/admin'
import FullPageLoader from '../../components/FullPageLoader'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

const bloodGroups = ['All Blood Groups', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
const genders = ['All Genders', 'Male', 'Female', 'Other']
const statuses = ['All Status', 'Active', 'Inactive']

interface Patient {
  id: number
  name: string
  email: string
  phone: string
  gender: string
  blood_group: string
  dob: string
  address: string
  is_active: boolean
  avatar: string
}

export default function Patients() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All Blood Groups')
  const [selectedGender, setSelectedGender] = useState('All Genders')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await adminApi.getAllPatients({
        page: currentPage,
        search: debouncedSearch || undefined,
        status: selectedStatus !== 'All Status' ? selectedStatus : undefined,
        blood_group: selectedBloodGroup !== 'All Blood Groups' ? selectedBloodGroup : undefined,
        gender: selectedGender !== 'All Genders' ? selectedGender : undefined,
      })

      if (response.success && response.data) {
        // Handle Laravel paginator structure: data.data is the array, data is the paginator object
        const patientsData = response.data.data || response.data
        // Filter to only show patients (role === 'patient') as safeguard
        const filteredPatients = patientsData.filter((p: any) => p.role === 'patient')
        const transformed = filteredPatients.map((patient: any) => ({
          id: patient.id,
          name: patient.name || 'Patient',
          email: patient.email || '',
          phone: patient.phone || '',
          gender: patient.patient?.gender || 'Male',
          blood_group: patient.patient?.blood_type || '',
          dob: patient.patient?.date_of_birth || '',
          address: patient.patient?.address || '',
          is_active: patient.is_active !== false,
          avatar: patient.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'PT',
        }))
        setPatients(transformed)

        // Get pagination from response.data (Laravel paginator) or response.pagination
        const paginationData = response.data
        if (paginationData && typeof paginationData === 'object') {
          setTotalItems(paginationData.total || patientsData.length)
          setTotalPages(paginationData.last_page || Math.ceil((paginationData.total || patientsData.length) / itemsPerPage) || 1)
        } else {
          setTotalItems(patientsData.length)
          setTotalPages(Math.ceil(patientsData.length / itemsPerPage) || 1)
        }
      } else {
        setPatients([])
        setError(response.message || 'Failed to load patients')
      }
    } catch {
      setPatients([])
      setError('Failed to load patients. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [currentPage, debouncedSearch, selectedStatus, selectedBloodGroup, selectedGender])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Deactivate Patient',
      html: 'Are you sure you want to deactivate this patient? They will not be able to login after this.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, deactivate',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await adminApi.deletePatient(id)
      toast.success('Patient deactivated successfully')
      fetchPatients()
    } catch {
      toast.error('Failed to deactivate patient')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">Patients Management</h1>
          <p className="text-gray-500 text-sm">Manage patient records and information</p>
        </div>
        <button onClick={() => navigate('/admin/patients/add')} className="flex items-center gap-2 px-4 py-2.5 bg-[#d36135] text-white rounded-lg font-medium hover:bg-[#b5552d] transition-colors">
          <Plus className="w-4 h-4" /> Add Patient
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: totalItems.toLocaleString() || '0', icon: FileText, color: 'bg-[#3e5641]' },
          { label: 'Active Patients', value: patients.filter(p => p.is_active).length.toString() || '0', icon: Heart, color: 'bg-[#d36135]' },
          { label: 'New This Month', value: '0', icon: Plus, color: 'bg-[#83bca9]' },
          { label: 'Inactive', value: patients.filter(p => !p.is_active).length.toString() || '0', icon: Calendar, color: 'bg-[#a24936]' },
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
            <input type="text" placeholder="Search patients by name or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]" />
          </div>
          <div className="flex gap-3">
            <select value={selectedBloodGroup} onChange={(e) => { setSelectedBloodGroup(e.target.value); setCurrentPage(1); }} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]">
              {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
            <select value={selectedGender} onChange={(e) => { setSelectedGender(e.target.value); setCurrentPage(1); }} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]">
              {genders.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]">
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Patients Table */}
      {loading ? (
        <FullPageLoader message="Loading patients..." />
      ) : error ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={fetchPatients} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              Try Again
            </button>
          </div>
        </div>
      ) : patients.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Patients Found</h3>
            <p className="text-gray-600 mb-4">
              {debouncedSearch || selectedBloodGroup !== 'All Blood Groups' || selectedGender !== 'All Genders' || selectedStatus !== 'All Status'
                ? 'No patients match your search criteria. Try adjusting your filters.'
                : 'No patients have been registered yet.'}
            </p>
            {(debouncedSearch || selectedBloodGroup !== 'All Blood Groups' || selectedGender !== 'All Genders' || selectedStatus !== 'All Status') && (
              <button onClick={() => { setSearchTerm(''); setDebouncedSearch(''); setSelectedBloodGroup('All Blood Groups'); setSelectedGender('All Genders'); setSelectedStatus('All Status'); setCurrentPage(1); }} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Gender</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Blood Group</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, index) => (
                  <motion.tr key={patient.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#3e5641]/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-[#3e5641]">{patient.avatar}</span>
                        </div>
                        <span className="font-medium text-gray-800">{patient.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{patient.gender}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">{patient.blood_group || 'N/A'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500"><Phone className="w-3 h-3" /> {patient.phone}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500"><Mail className="w-3 h-3" /> {patient.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${patient.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {patient.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/admin/patients/view/${patient.id}`)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Eye className="w-4 h-4 text-gray-500" /></button>
                        <button onClick={() => handleDelete(patient.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Pagination */}
      {totalItems > 0 && patients.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} patients</span>
          <div className="flex items-center gap-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Previous</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-2 rounded-lg text-sm ${currentPage === page ? 'bg-[#3e5641] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>{page}</button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">Next <ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  )
}