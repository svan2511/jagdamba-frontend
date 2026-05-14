import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { adminApi } from '../../api/admin'
import ScheduleConfig from '../../components/ui/ScheduleConfig'
import type { DaySchedule } from '../../components/ui/ScheduleConfig'

const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'General Medicine', 'Gynecology', 'Urology', 'Oncology', 'Radiology']

const defaultSchedules: DaySchedule[] = [
  { day: 'monday', label: 'Monday', isActive: false, startTime: '09:00', endTime: '17:00', slotDuration: 30, breakStart: '', breakEnd: '' },
  { day: 'tuesday', label: 'Tuesday', isActive: false, startTime: '09:00', endTime: '17:00', slotDuration: 30, breakStart: '', breakEnd: '' },
  { day: 'wednesday', label: 'Wednesday', isActive: false, startTime: '09:00', endTime: '17:00', slotDuration: 30, breakStart: '', breakEnd: '' },
  { day: 'thursday', label: 'Thursday', isActive: false, startTime: '09:00', endTime: '17:00', slotDuration: 30, breakStart: '', breakEnd: '' },
  { day: 'friday', label: 'Friday', isActive: false, startTime: '09:00', endTime: '17:00', slotDuration: 30, breakStart: '', breakEnd: '' },
  { day: 'saturday', label: 'Saturday', isActive: false, startTime: '09:00', endTime: '14:00', slotDuration: 30, breakStart: '', breakEnd: '' },
  { day: 'sunday', label: 'Sunday', isActive: false, startTime: '09:00', endTime: '14:00', slotDuration: 30, breakStart: '', breakEnd: '' },
]

export default function EditDoctor() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [scheduleLoading, setScheduleLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialty: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    about: '',
  })

  const [schedules, setSchedules] = useState<DaySchedule[]>(defaultSchedules)

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return

      try {
        const response = await adminApi.getDoctor(parseInt(id))
        if (response.success && response.data) {
          const doc = response.data
          const name = doc.user?.name || ''
          const nameParts = name.split(' ')

          setFormData({
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: doc.user?.email || '',
            phone: doc.user?.phone || '',
            specialty: doc.specialty || '',
            qualification: doc.qualification || '',
            experience: doc.experience_years?.toString() || '',
            consultationFee: doc.consultation_fee?.toString() || '',
            about: doc.bio || '',
          })

          // Fetch the doctor's base schedules
          await fetchDoctorSchedules(parseInt(id))
        } else {
          toast.error('Doctor not found')
          navigate('/admin/doctors')
        }
      } catch (err) {
        toast.error('Failed to load doctor')
        navigate('/admin/doctors')
      } finally {
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [id, navigate])

  const fetchDoctorSchedules = async (doctorId: number) => {
    setScheduleLoading(true)
    try {
      const response = await adminApi.getDoctorSchedules({ search: '' })
      if (response.success && response.data) {
        // Find the doctor in the list
        const doctorData = Array.isArray(response.data)
          ? response.data.find((d: any) => d.id === doctorId)
          : null

        if (doctorData?.base_schedules && doctorData.base_schedules.length > 0) {
          // Map base schedules to DaySchedule format
          const loadedSchedules = defaultSchedules.map(day => {
            const baseSchedule = doctorData.base_schedules.find(
              (s: any) => s.day_of_week === day.day
            )
            if (baseSchedule) {
              return {
                day: day.day,
                label: day.label,
                isActive: baseSchedule.is_active,
                startTime: baseSchedule.start_time,
                endTime: baseSchedule.end_time,
                slotDuration: baseSchedule.slot_duration || 30,
                breakStart: baseSchedule.break_start || '',
                breakEnd: baseSchedule.break_end || '',
              }
            }
            return { ...day }
          })
          setSchedules(loadedSchedules)
        }
      }
    } catch (err) {
      console.error('Failed to load schedules:', err)
    } finally {
      setScheduleLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    // Validate at least one working day
    const activeDays = schedules.filter(s => s.isActive)
    if (activeDays.length === 0) {
      toast.error('Please configure at least one working day')
      return
    }

    // Validate time ranges
    for (const schedule of activeDays) {
      if (schedule.startTime >= schedule.endTime) {
        toast.error(`${schedule.label}: End time must be after start time`)
        return
      }
      if (schedule.breakStart && schedule.breakEnd) {
        if (schedule.breakStart >= schedule.breakEnd) {
          toast.error(`${schedule.label}: Break end time must be after break start time`)
          return
        }
      }
    }

    try {
      setSaving(true)

      // Update doctor data
      await adminApi.updateDoctor(parseInt(id), {
        specialty: formData.specialty,
        qualification: formData.qualification,
        experience_years: parseInt(formData.experience) || 0,
        bio: formData.about,
        consultation_fee: parseInt(formData.consultationFee) || 0,
        is_available: true,
      })

      // Update schedules
      const schedulePayload = activeDays.map(s => ({
        day_of_week: s.day,
        start_time: s.startTime,
        end_time: s.endTime,
        slot_duration: s.slotDuration,
        break_start: s.breakStart || undefined,
        break_end: s.breakEnd || undefined,
        is_active: true,
      }))

      await adminApi.saveDoctorSchedule({
        doctor_id: parseInt(id),
        schedules: schedulePayload,
      })

      toast.success('Doctor updated with schedule successfully!')
      navigate('/admin/doctors')
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update doctor'
      toast.error(errorMessage)
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
        <button onClick={() => navigate('/admin/doctors')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#273f2b]">Edit Doctor</h1>
          <p className="text-gray-500 text-sm">Update doctor details and schedule</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} disabled className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} disabled className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} disabled className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Professional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
              <select name="specialty" value={formData.specialty} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]">
                <option value="">Select Specialty</option>
                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
              <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="MBBS, MD, DM" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
              <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee (Rs.)</label>
              <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]" />
            </div>
          </div>
        </motion.div>

        {/* Schedule Configuration */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Weekly Schedule</h3>
          {scheduleLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#3e5641]" />
            </div>
          ) : (
            <ScheduleConfig schedules={schedules} onChange={setSchedules} />
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">About</h3>
          <textarea name="about" rows={4} value={formData.about} onChange={handleChange} placeholder="Write about the doctor's experience..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e5641]/20 focus:border-[#3e5641]" />
        </motion.div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate('/admin/doctors')} className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[#3e5641] text-white rounded-lg text-sm font-medium hover:bg-[#2d4030] disabled:opacity-50 disabled:cursor-not-allowed">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}