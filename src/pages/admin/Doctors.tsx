import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Plus, Edit2, Trash2, Eye, Phone, Mail, Stethoscope, ChevronLeft, ChevronRight } from 'lucide-react'
import { adminApi, type DoctorResponse } from '../../api/admin'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import FullPageLoader from '../../components/FullPageLoader'

const departments = ['All Departments', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'General Medicine']
const statuses = ['All Status', 'Active', 'Inactive']

interface Doctor {
  id: number
  name: string
  specialty: string
  department: string
  phone: string
  email: string
  status: string
  patients: number
  avatar: string
}

export default function Doctors() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDept, setSelectedDept] = useState('All Departments')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await adminApi.getAllDoctors({
        page: currentPage,
        search: debouncedSearch || undefined,
        specialty: selectedDept !== 'All Departments' ? selectedDept : undefined,
        status: selectedStatus !== 'All Status' ? selectedStatus : undefined,
      })

      if (response.success && response.data) {
        const transformed = response.data.map((doc: DoctorResponse) => ({
          id: doc.id,
          name: doc.user?.name || 'Doctor',
          specialty: doc.specialty || '',
          department: doc.specialty || '',
          phone: doc.user?.phone || '',
          email: doc.user?.email || '',
          status: (doc.is_available && doc.user?.is_active !== false) ? 'Active' : 'Inactive',
          patients: 0,
          avatar: doc.user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'DR',
        }))
        setDoctors(transformed)

        // @ts-ignore
        const meta = response.meta
        if (meta) {
          setTotalItems(meta.total || response.data.length)
          setTotalPages(meta.last_page || 1)
        } else {
          setTotalItems(response.data.length)
          setTotalPages(Math.ceil(response.data.length / itemsPerPage) || 1)
        }
      } else {
        setDoctors([])
        setError(response.message || 'Failed to load doctors')
      }
    } catch (err: unknown) {
      setDoctors([])
      setError('Failed to load doctors. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [currentPage, debouncedSearch, selectedDept, selectedStatus])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Deactivate Doctor',
      html: 'Are you sure you want to deactivate this doctor? They will not be able to login after this.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, deactivate',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await adminApi.deleteDoctor(id)
      toast.success('Doctor deactivated successfully')
      fetchDoctors()
    } catch (err) {
      toast.error('Failed to deactivate doctor')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">Doctors Management</h1>
          <p className="text-gray-500 text-sm">Manage hospital doctors and their details</p>
        </div>
        <button onClick={() => navigate('/admin/doctors/add')} className="flex items-center gap-2 px-4 py-2.5 bg-[#d36135] text-white rounded-lg font-medium hover:bg-[#b5552d] transition-colors">
          <Plus className="w-4 h-4" /> Add Doctor
        </button>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search doctors by name or specialty..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]" />
          </div>
          <div className="flex gap-3">
            <select value={selectedDept} onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(1); }} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]">
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
            <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]">
              {statuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Doctors Table */}
      {loading ? (
        <FullPageLoader message="Loading doctors..." />
      ) : error ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={fetchDoctors} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              Try Again
            </button>
          </div>
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Doctors Found</h3>
            <p className="text-gray-600 mb-4">
              {debouncedSearch || selectedDept !== 'All Departments' || selectedStatus !== 'All Status'
                ? 'No doctors match your search criteria. Try adjusting your filters.'
                : 'No doctors have been added yet.'}
            </p>
            {(debouncedSearch || selectedDept !== 'All Departments' || selectedStatus !== 'All Status') && (
              <button onClick={() => { setSearchTerm(''); setDebouncedSearch(''); setSelectedDept('All Departments'); setSelectedStatus('All Status'); setCurrentPage(1); }} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
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
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Specialty</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Department</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Patients</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor, index) => (
                  <motion.tr key={doctor.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#3e5641]/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-[#3e5641]">{doctor.avatar}</span>
                        </div>
                        <span className="font-medium text-gray-800">{doctor.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-[#d36135]" />
                        <span className="text-sm text-gray-600">{doctor.specialty}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{doctor.department}</td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500"><Phone className="w-3 h-3" /> {doctor.phone}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500"><Mail className="w-3 h-3" /> {doctor.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6"><span className="text-sm font-medium text-gray-800">{doctor.patients}</span></td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${doctor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {doctor.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/admin/doctors/view/${doctor.id}`)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Eye className="w-4 h-4 text-gray-500" /></button>
                        <button onClick={() => navigate(`/admin/doctors/edit/${doctor.id}`)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                        <button onClick={() => handleDelete(doctor.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
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
      {totalItems > 0 && doctors.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} doctors</span>
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