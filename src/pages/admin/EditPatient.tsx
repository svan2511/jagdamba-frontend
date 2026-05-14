import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { adminApi } from '../../api/admin'

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
const genders = ['Male', 'Female', 'Other']

export default function EditPatient() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    blood_group: '',
    date_of_birth: '',
    address: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return

      try {
        setLoading(true)
        const response = await adminApi.getPatient(parseInt(id))

        if (response.success && response.data) {
          const patient = response.data
          setFormData({
            name: patient.name || '',
            email: patient.email || '',
            phone: patient.phone || '',
            gender: patient.gender || '',
            blood_group: patient.blood_group || '',
            date_of_birth: patient.date_of_birth || '',
            address: patient.address || '',
          })
        } else {
          toast.error('Patient not found')
          navigate('/admin/patients')
        }
      } catch {
        toast.error('Failed to load patient')
        navigate('/admin/patients')
      } finally {
        setLoading(false)
      }
    }

    fetchPatient()
  }, [id, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    try {
      setSaving(true)
      await adminApi.updatePatient(parseInt(id), formData)
      toast.success('Patient updated successfully!')
      navigate('/admin/patients')
    } catch {
      toast.error('Failed to update patient')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/patients')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">Edit Patient</h1>
          <p className="text-gray-500 text-sm">Update patient details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]">
                <option value="">Select Gender</option>
                {genders.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
              <select name="blood_group" value={formData.blood_group} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]">
                <option value="">Select Blood Group</option>
                {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]" />
            </div>
          </div>
        </motion.div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate('/admin/patients')} className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#3e5641] text-white rounded-lg hover:bg-[#2d4030] disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}